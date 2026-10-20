<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
$config = ghc_bootstrap(true);
ghc_require_method('POST');
$data = ghc_read_json();

$cleanName = static function (mixed $value): string {
    $name = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $value)) ?? '');
    if ($name === '' || strlen($name) > 100 || preg_match('/[\x00-\x1F\x7F]/', $name)) {
        return '';
    }
    return $name;
};

$firstName = $cleanName($data['firstName'] ?? '');
$lastName = $cleanName($data['lastName'] ?? '');
$email = strtolower(trim((string) ($data['email'] ?? '')));
$amountInput = trim((string) ($data['amount'] ?? ''));
$privacyAcknowledged = ($data['privacyAcknowledged'] ?? false) === true;

if ($firstName === '' || $lastName === '') {
    ghc_json(422, ['ok' => false, 'code' => 'invalid_name', 'message' => 'Enter your first and last name.']);
}
if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ghc_json(422, ['ok' => false, 'code' => 'invalid_email', 'message' => 'Enter a valid email address.']);
}
if (!$privacyAcknowledged) {
    ghc_json(422, ['ok' => false, 'code' => 'notice_required', 'message' => 'Please acknowledge how your contact details will be used.']);
}
if (!preg_match('/\A(?:0|[1-9][0-9]{0,7})(?:\.[0-9]{1,2})?\z/D', $amountInput)) {
    ghc_json(422, ['ok' => false, 'code' => 'invalid_amount', 'message' => 'Enter a valid donation amount.']);
}

$amountValue = (float) $amountInput;
$maxAmount = (float) ($config['paypal']['max_amount'] ?? 100000);
if (!is_finite($amountValue) || $amountValue < 1 || $amountValue > $maxAmount) {
    ghc_json(422, ['ok' => false, 'code' => 'amount_out_of_range', 'message' => 'Choose an amount within the allowed range.']);
}
$amount = number_format($amountValue, 2, '.', '');
$currency = strtoupper((string) ($config['paypal']['currency'] ?? 'USD'));
$siteOrigin = rtrim((string) ($config['site_origin'] ?? ''), '/');
$paypal = $config['paypal'] ?? [];

if (!in_array(strtolower((string) ($paypal['mode'] ?? 'sandbox')), ['sandbox', 'live'], true)
    || $currency !== 'USD'
    || $siteOrigin === ''
    || empty($paypal['client_id'])
    || empty($paypal['client_secret'])) {
    ghc_json(503, ['ok' => false, 'code' => 'paypal_not_configured', 'message' => 'PayPal checkout is not configured yet. Please use the bank-transfer details or contact our team.']);
}

try {
    $db = ghc_db($config);
    ghc_rate_limit($db, $config, 'paypal-create-order', 8, 3600);

    $reference = 'GHC' . strtoupper(bin2hex(random_bytes(12)));
    $captureToken = bin2hex(random_bytes(32));
    $captureTokenHash = hash('sha256', $captureToken);

    $insert = $db->prepare(
        "INSERT INTO donations (public_reference, capture_token_hash, capture_token_expires_at, currency, amount, donor_first_name, donor_last_name, donor_email, privacy_acknowledged, privacy_acknowledged_at, status)
         VALUES (:reference, :token_hash, UTC_TIMESTAMP() + INTERVAL 1 DAY, :currency, :amount, :first_name, :last_name, :email, 1, UTC_TIMESTAMP(), 'creating')"
    );
    $insert->execute([
        ':reference' => $reference,
        ':token_hash' => $captureTokenHash,
        ':currency' => $currency,
        ':amount' => $amount,
        ':first_name' => $firstName,
        ':last_name' => $lastName,
        ':email' => $email,
    ]);
    $donationId = (int) $db->lastInsertId();

    $orderBody = [
        'intent' => 'CAPTURE',
        'payment_source' => [
            'paypal' => [
                'experience_context' => [
                    'brand_name' => 'Global Hearts Community',
                    'landing_page' => 'LOGIN',
                    'user_action' => 'PAY_NOW',
                    'shipping_preference' => 'NO_SHIPPING',
                    'return_url' => $siteOrigin . '/donate/?payment=return',
                    'cancel_url' => $siteOrigin . '/donate/?payment=cancelled',
                ],
            ],
        ],
        'purchase_units' => [[
            'reference_id' => $reference,
            'custom_id' => $reference,
            'invoice_id' => $reference,
            'description' => 'Donation to Global Hearts Community',
            'amount' => [
                'currency_code' => $currency,
                'value' => $amount,
            ],
        ]],
    ];

    $response = ghc_paypal_request($config, 'POST', '/v2/checkout/orders', $orderBody, 'create-' . $reference);
    $order = $response['json'];
    $orderId = (string) ($order['id'] ?? '');
    $approvalUrl = '';
    foreach (($order['links'] ?? []) as $link) {
        if (in_array((string) ($link['rel'] ?? ''), ['approve', 'payer-action'], true)) {
            $approvalUrl = (string) ($link['href'] ?? '');
            break;
        }
    }

    if ($response['status'] < 200 || $response['status'] >= 300 || $orderId === '' || $approvalUrl === '') {
        $failed = $db->prepare("UPDATE donations SET status = 'failed' WHERE id = :id");
        $failed->execute([':id' => $donationId]);
        error_log('GHC backend: PayPal did not return a usable approval link.');
        ghc_json(502, ['ok' => false, 'code' => 'paypal_order_failed', 'message' => 'PayPal checkout could not be started. Please try again or use bank transfer.']);
    }

    $update = $db->prepare("UPDATE donations SET paypal_order_id = :order_id, status = 'pending' WHERE id = :id");
    $update->execute([':order_id' => $orderId, ':id' => $donationId]);

    ghc_json(201, [
        'ok' => true,
        'orderId' => $orderId,
        'approvalUrl' => $approvalUrl,
        'captureToken' => $captureToken,
        'reference' => $reference,
    ]);
} catch (Throwable $error) {
    if (isset($db, $donationId)) {
        try {
            $failed = $db->prepare("UPDATE donations SET status = 'failed' WHERE id = :id AND status = 'creating'");
            $failed->execute([':id' => $donationId]);
        } catch (Throwable) {
            // Keep the public response generic; the hosting error log contains the operational failure class.
        }
    }
    error_log('GHC backend: PayPal order creation failed (' . get_class($error) . ').');
    ghc_json(503, ['ok' => false, 'code' => 'paypal_unavailable', 'message' => 'PayPal checkout is temporarily unavailable. Please try again or use bank transfer.']);
}
