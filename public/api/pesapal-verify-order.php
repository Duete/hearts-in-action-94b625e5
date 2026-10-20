<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
$config = ghc_bootstrap(true);
ghc_require_method('POST');
$data = ghc_read_json();
$trackingId = trim((string) ($data['orderTrackingId'] ?? ''));
$reference = trim((string) ($data['merchantReference'] ?? ''));
$captureToken = trim((string) ($data['captureToken'] ?? ''));
if (!preg_match('/\A[A-Za-z0-9-]{1,64}\z/', $trackingId)
    || !preg_match('/\AGHC[A-F0-9]{24}\z/', $reference)
    || !preg_match('/\A[a-f0-9]{64}\z/', $captureToken)) {
    ghc_json(422, ['ok' => false, 'code' => 'invalid_order', 'message' => 'We could not verify this Pesapal checkout. Contact our team before trying another payment.']);
}

try {
    $db = ghc_db($config);
    ghc_rate_limit($db, $config, 'pesapal-verify-order', 12, 3600);
    $lookup = $db->prepare("SELECT *, (capture_token_expires_at > UTC_TIMESTAMP()) AS capture_token_valid FROM donations WHERE payment_provider = 'pesapal' AND public_reference = :reference AND pesapal_tracking_id = :tracking_id LIMIT 1");
    $lookup->execute([':reference' => $reference, ':tracking_id' => $trackingId]);
    $donation = $lookup->fetch();
    if (!$donation) ghc_json(404, ['ok' => false, 'code' => 'order_not_found', 'message' => 'We could not find this checkout. Contact our team before trying another payment.']);
    if ((int) $donation['capture_token_valid'] !== 1 || !hash_equals((string) $donation['capture_token_hash'], hash('sha256', $captureToken))) {
        ghc_json(403, ['ok' => false, 'code' => 'invalid_order_token', 'message' => 'We could not verify this checkout. Contact our team before trying another payment.']);
    }

    $result = ghc_verify_pesapal_donation($db, $config, $donation, $trackingId, $reference);
    if ($result['status'] !== 'paid') {
        ghc_json(200, ['ok' => true, 'status' => $result['status'], 'reference' => $reference, 'message' => 'Pesapal has not confirmed this payment yet. Do not pay again; wait briefly or contact our team.']);
    }
    ghc_json(200, [
        'ok' => true,
        'status' => 'paid',
        'reference' => $result['reference'],
        'receiptStatus' => $result['receipt_status'],
        'receiptRetryAllowed' => $result['receipt_retry_allowed'],
    ]);
} catch (Throwable $error) {
    error_log('GHC backend: Pesapal transaction verification failed (' . get_class($error) . ').');
    ghc_json(503, ['ok' => false, 'code' => 'pesapal_verification_unavailable', 'message' => 'We could not verify this payment right now. Do not pay again; contact our team for help.']);
}
