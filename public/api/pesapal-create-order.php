<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
$config = ghc_bootstrap(true);
ghc_require_method('POST');
$data = ghc_read_json();

$cleanName = static function (mixed $value): string {
    $name = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $value)) ?? '');
    return $name !== '' && strlen($name) <= 100 && !preg_match('/[\x00-\x1F\x7F]/', $name) ? $name : '';
};
$firstName = $cleanName($data['firstName'] ?? '');
$lastName = $cleanName($data['lastName'] ?? '');
$email = strtolower(trim((string) ($data['email'] ?? '')));
$amountInput = trim((string) ($data['amount'] ?? ''));
$requestedCurrency = strtoupper(trim((string) ($data['currency'] ?? '')));
$privacyAcknowledged = ($data['privacyAcknowledged'] ?? false) === true;
if ($firstName === '' || $lastName === '') ghc_json(422, ['ok' => false, 'code' => 'invalid_name', 'message' => 'Enter your first and last name.']);
if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) ghc_json(422, ['ok' => false, 'code' => 'invalid_email', 'message' => 'Enter a valid email address.']);
if (!$privacyAcknowledged) ghc_json(422, ['ok' => false, 'code' => 'notice_required', 'message' => 'Please acknowledge how your contact details will be used.']);
$pesapal = $config['pesapal'] ?? [];
$configuredCurrencies = $pesapal['currencies'] ?? [$pesapal['currency'] ?? 'UGX'];
$configuredCurrencies = array_map(static fn ($item): string => strtoupper((string) $item), is_array($configuredCurrencies) ? $configuredCurrencies : []);
$currency = $requestedCurrency !== '' ? $requestedCurrency : strtoupper((string) ($pesapal['currency'] ?? 'UGX'));
if (!in_array($currency, ['UGX', 'USD'], true) || !in_array($currency, $configuredCurrencies, true)) {
    ghc_json(422, ['ok' => false, 'code' => 'unsupported_currency', 'message' => 'That Pesapal currency is not enabled for this donation. Choose another currency or payment method.']);
}
$amountPattern = $currency === 'UGX' ? '/\A(?:0|[1-9][0-9]{0,8})\z/D' : '/\A(?:0|[1-9][0-9]{0,8})(?:\.[0-9]{1,2})?\z/D';
if (!preg_match($amountPattern, $amountInput)) {
    ghc_json(422, ['ok' => false, 'code' => 'invalid_amount', 'message' => $currency === 'UGX' ? 'Enter a whole-number donation amount in UGX.' : 'Enter a donation amount in USD with no more than two decimal places.']);
}
$amountValue = (float) $amountInput;
$defaultMax = $currency === 'UGX' ? 100000000 : 100000;
$maxAmount = (float) (($pesapal['max_amount_by_currency'][$currency] ?? null) ?? ($pesapal['max_amount'] ?? $defaultMax));
$siteOrigin = rtrim((string) ($config['site_origin'] ?? ''), '/');
if (!in_array(strtolower((string) ($pesapal['mode'] ?? 'sandbox')), ['sandbox', 'live'], true)
    || $siteOrigin === '' || empty($pesapal['consumer_key'])
    || empty($pesapal['consumer_secret']) || empty($pesapal['ipn_id'])) {
    ghc_json(503, ['ok' => false, 'code' => 'pesapal_not_configured', 'message' => 'Pesapal checkout is not configured yet. Please use PayPal or bank transfer.']);
}
if (!is_finite($amountValue) || $amountValue < 1 || $amountValue > $maxAmount) {
    ghc_json(422, ['ok' => false, 'code' => 'amount_out_of_range', 'message' => 'Choose an amount within the allowed range.']);
}

try {
    $db = ghc_db($config);
    ghc_rate_limit($db, $config, 'pesapal-create-order', 8, 3600);
    $reference = 'GHC' . strtoupper(bin2hex(random_bytes(12)));
    $captureToken = bin2hex(random_bytes(32));
    $insert = $db->prepare(
        "INSERT INTO donations (public_reference, capture_token_hash, capture_token_expires_at, payment_provider, currency, amount, donor_first_name, donor_last_name, donor_email, privacy_acknowledged, privacy_acknowledged_at, status)
         VALUES (:reference, :token_hash, UTC_TIMESTAMP() + INTERVAL 1 DAY, 'pesapal', :currency, :amount, :first_name, :last_name, :email, 1, UTC_TIMESTAMP(), 'creating')"
    );
    $insert->execute([
        ':reference' => $reference,
        ':token_hash' => hash('sha256', $captureToken),
        ':currency' => $currency,
        ':amount' => number_format($amountValue, 2, '.', ''),
        ':first_name' => $firstName,
        ':last_name' => $lastName,
        ':email' => $email,
    ]);
    $donationId = (int) $db->lastInsertId();

    $request = [
        'id' => $reference,
        'currency' => $currency,
        'amount' => $amountValue,
        'description' => 'Donation to Global Hearts Community',
        'callback_url' => $siteOrigin . '/api/pesapal-return.php',
        'cancellation_url' => $siteOrigin . '/donate/?payment=pesapal-cancelled',
        'notification_id' => (string) $pesapal['ipn_id'],
        'redirect_mode' => 'TOP_WINDOW',
        'billing_address' => [
            'email_address' => $email,
            'country_code' => 'UG',
            'first_name' => $firstName,
            'last_name' => $lastName,
        ],
    ];
    $response = ghc_pesapal_request($config, 'POST', '/Transactions/SubmitOrderRequest', $request);
    $trackingId = (string) ($response['json']['order_tracking_id'] ?? '');
    $redirectUrl = (string) ($response['json']['redirect_url'] ?? '');
    $redirectHost = strtolower((string) parse_url($redirectUrl, PHP_URL_HOST));
    $allowedHosts = ['pay.pesapal.com', 'cybqa.pesapal.com'];
    if ($response['status'] < 200 || $response['status'] >= 300 || $trackingId === ''
        || !filter_var($redirectUrl, FILTER_VALIDATE_URL) || !in_array($redirectHost, $allowedHosts, true)
        || parse_url($redirectUrl, PHP_URL_SCHEME) !== 'https') {
        $failed = $db->prepare("UPDATE donations SET status = 'failed' WHERE id = :id");
        $failed->execute([':id' => $donationId]);
        error_log('GHC backend: Pesapal did not return a valid hosted checkout URL.');
        ghc_json(502, ['ok' => false, 'code' => 'pesapal_order_failed', 'message' => 'Pesapal checkout could not be started. Please try again or use another payment method.']);
    }

    $update = $db->prepare("UPDATE donations SET pesapal_tracking_id = :tracking_id, status = 'pending' WHERE id = :id");
    $update->execute([':tracking_id' => $trackingId, ':id' => $donationId]);
    ghc_json(201, ['ok' => true, 'orderId' => $trackingId, 'approvalUrl' => $redirectUrl, 'captureToken' => $captureToken, 'reference' => $reference]);
} catch (Throwable $error) {
    if (isset($db, $donationId)) {
        try {
            $failed = $db->prepare("UPDATE donations SET status = 'failed' WHERE id = :id AND status = 'creating'");
            $failed->execute([':id' => $donationId]);
        } catch (Throwable) {
            // Preserve generic client response; diagnostic details remain in the host error log.
        }
    }
    error_log('GHC backend: Pesapal order creation failed (' . get_class($error) . ').');
    ghc_json(503, ['ok' => false, 'code' => 'pesapal_unavailable', 'message' => 'Pesapal checkout is temporarily unavailable. Please try again or use PayPal or bank transfer.']);
}
