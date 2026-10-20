<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
header('Cache-Control: no-store, max-age=0');
header('Referrer-Policy: no-referrer');
$trackingId = trim((string) ($_GET['OrderTrackingId'] ?? ''));
$reference = trim((string) ($_GET['OrderMerchantReference'] ?? ''));
$config = ghc_config();
$siteOrigin = rtrim((string) ($config['site_origin'] ?? ''), '/');
$originParts = parse_url($siteOrigin);
if (!is_array($originParts) || ($originParts['scheme'] ?? '') !== 'https' || empty($originParts['host']) || isset($originParts['user']) || isset($originParts['pass'])) {
    http_response_code(503);
    exit('Payment return is not configured.');
}
$params = ['payment' => 'pesapal-return'];
if (preg_match('/\A[A-Za-z0-9-]{1,64}\z/', $trackingId) && preg_match('/\AGHC[A-F0-9]{24}\z/', $reference)) {
    $params['OrderTrackingId'] = $trackingId;
    $params['OrderMerchantReference'] = $reference;
}
header('Location: ' . $siteOrigin . '/donate/?' . http_build_query($params), true, 303);
exit;
