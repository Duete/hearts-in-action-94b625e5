<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
$config = ghc_bootstrap(false);
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? ''));
if (!in_array($method, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    ghc_json(405, ['ok' => false, 'code' => 'method_not_allowed']);
}

$payload = $_GET;
if ($method === 'POST') {
    $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    if (str_contains($contentType, 'application/json')) {
        $payload = ghc_read_json();
    } else {
        $payload = $_POST;
    }
}
$trackingId = trim((string) ($payload['OrderTrackingId'] ?? $payload['orderTrackingId'] ?? ''));
$reference = trim((string) ($payload['OrderMerchantReference'] ?? $payload['orderMerchantReference'] ?? ''));
$notificationType = strtoupper(trim((string) ($payload['OrderNotificationType'] ?? $payload['orderNotificationType'] ?? '')));

header('Content-Type: application/json; charset=utf-8');
$respond = static function (int $status) use ($trackingId, $reference, $notificationType): never {
    echo json_encode([
        'orderNotificationType' => $notificationType !== '' ? $notificationType : 'IPNCHANGE',
        'orderTrackingId' => $trackingId,
        'orderMerchantReference' => $reference,
        'status' => $status,
    ], JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
};

if ($notificationType !== 'IPNCHANGE' || !preg_match('/\A[A-Za-z0-9-]{1,64}\z/', $trackingId)
    || !preg_match('/\AGHC[A-F0-9]{24}\z/', $reference)) {
    $respond(500);
}

try {
    $db = ghc_db($config);
    ghc_rate_limit($db, $config, 'pesapal-ipn-ip', 300, 3600);
    ghc_rate_limit($db, $config, 'pesapal-ipn-global', 1000, 3600, 'global');
    $lookup = $db->prepare("SELECT * FROM donations WHERE payment_provider = 'pesapal' AND public_reference = :reference AND pesapal_tracking_id = :tracking_id LIMIT 1");
    $lookup->execute([':reference' => $reference, ':tracking_id' => $trackingId]);
    $donation = $lookup->fetch();
    if (!$donation) {
        error_log('GHC backend: Pesapal IPN did not match a local transaction.');
        $respond(500);
    }
    ghc_verify_pesapal_donation($db, $config, $donation, $trackingId, $reference);
    $respond(200);
} catch (Throwable $error) {
    error_log('GHC backend: Pesapal IPN reconciliation failed (' . get_class($error) . ').');
    $respond(500);
}
