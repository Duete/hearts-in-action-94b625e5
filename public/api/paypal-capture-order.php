<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
$config = ghc_bootstrap(true);
ghc_require_method('POST');
$data = ghc_read_json();
$orderId = trim((string) ($data['orderId'] ?? ''));
$captureToken = trim((string) ($data['captureToken'] ?? ''));

if (!preg_match('/\A[A-Z0-9]{1,64}\z/', $orderId) || !preg_match('/\A[a-f0-9]{64}\z/', $captureToken)) {
    ghc_json(422, ['ok' => false, 'code' => 'invalid_order', 'message' => 'We could not verify this checkout. Contact our team before trying another payment.']);
}

try {
    $db = ghc_db($config);
    ghc_rate_limit($db, $config, 'paypal-capture-order', 12, 3600);

    $lookup = $db->prepare('SELECT *, (capture_token_expires_at > UTC_TIMESTAMP()) AS capture_token_valid FROM donations WHERE paypal_order_id = :order_id LIMIT 1');
    $lookup->execute([':order_id' => $orderId]);
    $donation = $lookup->fetch();
    if (!$donation) {
        ghc_json(404, ['ok' => false, 'code' => 'order_not_found', 'message' => 'We could not find this checkout. Contact our team before trying another payment.']);
    }

    $expectedHash = (string) $donation['capture_token_hash'];
    if ((int) $donation['capture_token_valid'] !== 1 || $expectedHash === '' || !hash_equals($expectedHash, hash('sha256', $captureToken))) {
        ghc_json(403, ['ok' => false, 'code' => 'invalid_order_token', 'message' => 'We could not verify this checkout. Contact our team before trying another payment.']);
    }

    if ((string) $donation['status'] === 'paid') {
        $receiptStatus = ghc_send_donation_receipt($db, $config, (int) $donation['id']);
        $receiptRetryAllowed = ghc_receipt_retry_allowed($db, (int) $donation['id']);
        ghc_json(200, [
            'ok' => true,
            'status' => 'paid',
            'reference' => (string) $donation['public_reference'],
            'receiptStatus' => $receiptStatus,
            'receiptRetryAllowed' => $receiptRetryAllowed,
        ]);
    }
    if ((string) $donation['status'] !== 'pending') {
        ghc_json(409, ['ok' => false, 'code' => 'order_not_pending', 'message' => 'This checkout is not awaiting payment. Contact our team if you believe this is an error.']);
    }

    $capture = ghc_paypal_request(
        $config,
        'POST',
        '/v2/checkout/orders/' . rawurlencode($orderId) . '/capture',
        null,
        'capture-' . (string) $donation['public_reference']
    );

    $order = $capture['json'];
    if ($capture['status'] < 200 || $capture['status'] >= 300 || (string) ($order['status'] ?? '') !== 'COMPLETED') {
        error_log('GHC backend: PayPal capture was not completed for order ' . $orderId . '.');
        ghc_json(409, ['ok' => false, 'code' => 'payment_not_confirmed', 'message' => 'PayPal has not confirmed the payment yet. Do not pay again; please wait or contact our team.']);
    }

    $captureResource = null;
    foreach (($order['purchase_units'] ?? []) as $unit) {
        foreach (($unit['payments']['captures'] ?? []) as $candidate) {
            if ((string) ($candidate['status'] ?? '') === 'COMPLETED') {
                $captureResource = $candidate;
                break 2;
            }
        }
    }
    if (!is_array($captureResource) || empty($captureResource['id']) || empty($captureResource['amount']['value']) || empty($captureResource['amount']['currency_code'])) {
        error_log('GHC backend: completed PayPal order had no completed capture data for order ' . $orderId . '.');
        ghc_json(502, ['ok' => false, 'code' => 'capture_data_incomplete', 'message' => 'Payment verification is delayed. Please contact our team before trying another payment.']);
    }

    $result = ghc_mark_verified_donation(
        $db,
        $config,
        $donation,
        (string) $captureResource['id'],
        (string) $captureResource['amount']['value'],
        (string) $captureResource['amount']['currency_code']
    );
    $receiptRetryAllowed = ghc_receipt_retry_allowed($db, (int) $donation['id']);

    ghc_json(200, [
        'ok' => true,
        'status' => 'paid',
        'reference' => $result['reference'],
        'receiptStatus' => $result['receipt_status'],
        'receiptRetryAllowed' => $receiptRetryAllowed,
    ]);
} catch (Throwable $error) {
    error_log('GHC backend: PayPal capture verification failed (' . get_class($error) . ').');
    ghc_json(503, ['ok' => false, 'code' => 'payment_verification_unavailable', 'message' => 'We could not verify this payment right now. Do not pay again; contact our team for help.']);
}
