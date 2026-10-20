<?php
declare(strict_types=1);

const GHC_MAX_JSON_BODY_BYTES = 16384;

function ghc_json(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function ghc_config(): array
{
    $documentRoot = trim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), DIRECTORY_SEPARATOR);
    $accountRoot = $documentRoot !== ''
        ? dirname(DIRECTORY_SEPARATOR . $documentRoot)
        : dirname(__DIR__, 2);
    $configPath = getenv('GHC_PRIVATE_CONFIG') ?: $accountRoot . '/private/global-hearts-config.php';

    if (!is_file($configPath) || !is_readable($configPath)) {
        ghc_json(503, [
            'ok' => false,
            'code' => 'backend_not_configured',
            'message' => 'Online services are not configured yet. Please use the bank-transfer details or contact our team.',
        ]);
    }

    $config = require $configPath;
    if (!is_array($config)) {
        error_log('GHC backend: private configuration did not return an array.');
        ghc_json(503, ['ok' => false, 'code' => 'backend_not_configured', 'message' => 'Online services are temporarily unavailable.']);
    }

    return $config;
}

function ghc_bootstrap(bool $sameOrigin = true): array
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Cache-Control: no-store, max-age=0');

    $config = ghc_config();
    if ($sameOrigin) {
        $origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
        $allowedOrigin = rtrim((string) ($config['site_origin'] ?? ''), '/');
        if ($origin !== '' && ($allowedOrigin === '' || !hash_equals($allowedOrigin, rtrim($origin, '/')))) {
            ghc_json(403, ['ok' => false, 'code' => 'origin_not_allowed', 'message' => 'Request origin is not allowed.']);
        }
        if ($origin !== '') {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
        }
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    return $config;
}

function ghc_require_method(string $method): void
{
    if (strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? '')) !== strtoupper($method)) {
        header('Allow: ' . strtoupper($method));
        ghc_json(405, ['ok' => false, 'code' => 'method_not_allowed', 'message' => 'This request method is not supported.']);
    }
}

function ghc_read_json(): array
{
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > GHC_MAX_JSON_BODY_BYTES) {
        ghc_json(413, ['ok' => false, 'code' => 'request_too_large', 'message' => 'The request is too large.']);
    }

    $raw = file_get_contents('php://input');
    if (!is_string($raw) || strlen($raw) > GHC_MAX_JSON_BODY_BYTES) {
        ghc_json(413, ['ok' => false, 'code' => 'request_too_large', 'message' => 'The request is too large.']);
    }

    try {
        $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        ghc_json(400, ['ok' => false, 'code' => 'invalid_json', 'message' => 'Please submit a valid request.']);
    }

    if (!is_array($data)) {
        ghc_json(400, ['ok' => false, 'code' => 'invalid_json', 'message' => 'Please submit a valid request.']);
    }

    return $data;
}

function ghc_db(array $config): PDO
{
    $database = $config['database'] ?? [];
    if (!is_array($database) || empty($database['dsn']) || empty($database['username'])) {
        ghc_json(503, ['ok' => false, 'code' => 'database_not_configured', 'message' => 'Online services are temporarily unavailable.']);
    }

    try {
        $db = new PDO(
            (string) $database['dsn'],
            (string) $database['username'],
            (string) ($database['password'] ?? ''),
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        $db->exec("SET time_zone = '+00:00'");
        return $db;
    } catch (Throwable $error) {
        error_log('GHC backend: database connection failed (' . get_class($error) . ').');
        ghc_json(503, ['ok' => false, 'code' => 'database_unavailable', 'message' => 'Online services are temporarily unavailable.']);
    }
}

function ghc_rate_limit(PDO $db, array $config, string $scope, int $limit, int $windowSeconds, ?string $identity = null): void
{
    $remoteAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $pepper = (string) ($config['rate_limit_key'] ?? '');
    if (strlen($pepper) < 32) {
        ghc_json(503, ['ok' => false, 'code' => 'backend_not_configured', 'message' => 'Online services are temporarily unavailable.']);
    }

    if (random_int(1, 100) === 1) {
        $db->exec('DELETE FROM api_rate_limits WHERE updated_at < UTC_TIMESTAMP() - INTERVAL 2 DAY');
    }

    $rateIdentity = $identity === null
        ? 'ip|' . $remoteAddress
        : 'identity|' . strtolower(trim($identity));
    $keyHash = hash_hmac('sha256', $scope . '|' . $rateIdentity, $pepper);
    $bucket = (int) floor(time() / max(1, $windowSeconds));
    $statement = $db->prepare(
        'INSERT INTO api_rate_limits (key_hash, bucket_start, hits) VALUES (:key_hash, :bucket_insert, 1)
         ON DUPLICATE KEY UPDATE hits = IF(bucket_start = :bucket_compare, hits + 1, 1), bucket_start = :bucket_update'
    );
    $statement->execute([
        ':key_hash' => $keyHash,
        ':bucket_insert' => $bucket,
        ':bucket_compare' => $bucket,
        ':bucket_update' => $bucket,
    ]);

    $lookup = $db->prepare('SELECT hits FROM api_rate_limits WHERE key_hash = :key_hash');
    $lookup->execute([':key_hash' => $keyHash]);
    $hits = (int) $lookup->fetchColumn();
    if ($hits > $limit) {
        ghc_json(429, ['ok' => false, 'code' => 'rate_limited', 'message' => 'Please wait a little before trying again.']);
    }
}

function ghc_http_json(string $method, string $url, array $headers, ?array $body = null, ?array $basicAuth = null): array
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('curl_extension_missing');
    }

    $curl = curl_init($url);
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
    ];
    if ($body !== null) {
        $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
    if ($basicAuth !== null) {
        $options[CURLOPT_HTTPAUTH] = CURLAUTH_BASIC;
        $options[CURLOPT_USERPWD] = $basicAuth[0] . ':' . $basicAuth[1];
    }

    curl_setopt_array($curl, $options);
    $responseBody = curl_exec($curl);
    $httpStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_errno($curl);
    curl_close($curl);

    if (!is_string($responseBody) || $curlError !== 0) {
        throw new RuntimeException('provider_connection_failed');
    }

    $decoded = json_decode($responseBody, true);
    return [
        'status' => $httpStatus,
        'json' => is_array($decoded) ? $decoded : [],
    ];
}

function ghc_paypal_base(array $config): string
{
    $mode = strtolower((string) ($config['paypal']['mode'] ?? 'sandbox'));
    return $mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

function ghc_paypal_token(array $config): string
{
    $paypal = $config['paypal'] ?? [];
    $clientId = (string) ($paypal['client_id'] ?? '');
    $clientSecret = (string) ($paypal['client_secret'] ?? '');
    if ($clientId === '' || $clientSecret === '') {
        throw new RuntimeException('paypal_not_configured');
    }

    $base = ghc_paypal_base($config);
    $cacheKey = 'ghc_paypal_token_' . hash('sha256', $base . '|' . $clientId);
    if (function_exists('apcu_enabled') && apcu_enabled()) {
        $cached = apcu_fetch($cacheKey, $cacheHit);
        if ($cacheHit && is_string($cached) && $cached !== '') {
            return $cached;
        }
    }

    $url = $base . '/v1/oauth2/token';
    $curl = curl_init($url);
    if ($curl === false) {
        throw new RuntimeException('paypal_transport_failed');
    }
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
        CURLOPT_HTTPHEADER => ['Accept: application/json', 'Accept-Language: en_US'],
        CURLOPT_USERPWD => $clientId . ':' . $clientSecret,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
    ]);
    $responseBody = curl_exec($curl);
    $httpStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_errno($curl);
    curl_close($curl);

    $decoded = is_string($responseBody) ? json_decode($responseBody, true) : null;
    if ($curlError !== 0 || $httpStatus < 200 || $httpStatus >= 300 || !is_array($decoded) || empty($decoded['access_token'])) {
        error_log('GHC backend: PayPal token request failed with HTTP ' . $httpStatus . '.');
        throw new RuntimeException('paypal_auth_failed');
    }

    $accessToken = (string) $decoded['access_token'];
    $cacheSeconds = max(0, (int) ($decoded['expires_in'] ?? 0) - 120);
    if ($cacheSeconds > 0 && function_exists('apcu_enabled') && apcu_enabled()) {
        apcu_store($cacheKey, $accessToken, $cacheSeconds);
    }
    return $accessToken;
}

function ghc_paypal_request(array $config, string $method, string $path, ?array $body = null, ?string $requestId = null): array
{
    $headers = ['Authorization: Bearer ' . ghc_paypal_token($config), 'Accept: application/json'];
    if ($body !== null) {
        $headers[] = 'Content-Type: application/json';
    }
    if ($requestId !== null) {
        $headers[] = 'PayPal-Request-Id: ' . $requestId;
    }

    $response = ghc_http_json($method, ghc_paypal_base($config) . $path, $headers, $body);
    if ($response['status'] < 200 || $response['status'] >= 300) {
        error_log('GHC backend: PayPal API returned HTTP ' . $response['status'] . ' for ' . $method . ' ' . $path . '.');
    }
    return $response;
}

function ghc_pesapal_base(array $config): string
{
    $mode = strtolower((string) ($config['pesapal']['mode'] ?? 'sandbox'));
    return $mode === 'live' ? 'https://pay.pesapal.com/v3/api' : 'https://cybqa.pesapal.com/pesapalv3/api';
}

function ghc_pesapal_token(array $config): string
{
    $pesapal = $config['pesapal'] ?? [];
    $consumerKey = (string) ($pesapal['consumer_key'] ?? '');
    $consumerSecret = (string) ($pesapal['consumer_secret'] ?? '');
    if ($consumerKey === '' || $consumerSecret === '') {
        throw new RuntimeException('pesapal_not_configured');
    }

    $base = ghc_pesapal_base($config);
    $cacheKey = 'ghc_pesapal_token_' . hash('sha256', $base . '|' . $consumerKey);
    if (function_exists('apcu_enabled') && apcu_enabled()) {
        $cached = apcu_fetch($cacheKey, $cacheHit);
        if ($cacheHit && is_string($cached) && $cached !== '') return $cached;
    }

    $response = ghc_http_json('POST', $base . '/Auth/RequestToken', [
        'Accept: application/json', 'Content-Type: application/json',
    ], ['consumer_key' => $consumerKey, 'consumer_secret' => $consumerSecret]);
    $token = (string) ($response['json']['token'] ?? '');
    if ($response['status'] < 200 || $response['status'] >= 300 || $token === '') {
        error_log('GHC backend: Pesapal authentication failed with HTTP ' . $response['status'] . '.');
        throw new RuntimeException('pesapal_auth_failed');
    }

    // Pesapal tokens are valid for up to five minutes; cache for four to avoid using an expired token.
    if (function_exists('apcu_enabled') && apcu_enabled()) apcu_store($cacheKey, $token, 240);
    return $token;
}

function ghc_pesapal_request(array $config, string $method, string $path, ?array $body = null): array
{
    $response = ghc_http_json($method, ghc_pesapal_base($config) . $path, [
        'Authorization: Bearer ' . ghc_pesapal_token($config),
        'Accept: application/json',
        'Content-Type: application/json',
    ], $body);
    if ($response['status'] < 200 || $response['status'] >= 300) {
        error_log('GHC backend: Pesapal API returned HTTP ' . $response['status'] . ' for ' . $method . ' ' . $path . '.');
    }
    return $response;
}

function ghc_send_resend(array $config, string $to, string $subject, string $html, string $text, ?string $idempotencyKey = null): array
{
    $resend = $config['resend'] ?? [];
    $apiKey = (string) ($resend['api_key'] ?? '');
    $from = (string) ($resend['from'] ?? '');
    if ($apiKey === '' || $from === '') {
        return ['ok' => false, 'id' => null, 'reason' => 'resend_not_configured'];
    }

    $body = [
        'from' => $from,
        'to' => [$to],
        'subject' => $subject,
        'html' => $html,
        'text' => $text,
    ];
    if (!empty($resend['reply_to'])) {
        $body['reply_to'] = (string) $resend['reply_to'];
    }

    $headers = [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'Accept: application/json',
    ];
    if ($idempotencyKey !== null) {
        $headers[] = 'Idempotency-Key: ' . $idempotencyKey;
    }

    try {
        $response = ghc_http_json('POST', 'https://api.resend.com/emails', $headers, $body);
    } catch (Throwable $error) {
        error_log('GHC backend: Resend request failed (' . get_class($error) . ').');
        return ['ok' => false, 'id' => null, 'reason' => 'resend_request_failed'];
    }

    if ($response['status'] < 200 || $response['status'] >= 300 || empty($response['json']['id'])) {
        error_log('GHC backend: Resend returned HTTP ' . $response['status'] . '.');
        return ['ok' => false, 'id' => null, 'reason' => 'resend_rejected'];
    }

    return ['ok' => true, 'id' => (string) $response['json']['id'], 'reason' => null];
}

function ghc_send_donation_receipt(PDO $db, array $config, int $donationId): string
{
    $claim = $db->prepare(
        "UPDATE donations SET receipt_status = 'sending', receipt_attempted_at = UTC_TIMESTAMP(),
             receipt_first_attempted_at = COALESCE(receipt_first_attempted_at, UTC_TIMESTAMP())
         WHERE id = :id AND (
             receipt_status = 'pending'
             OR (receipt_first_attempted_at >= UTC_TIMESTAMP() - INTERVAL 23 HOUR AND (
                 receipt_status = 'failed'
                 OR (receipt_status = 'sending' AND receipt_attempted_at < UTC_TIMESTAMP() - INTERVAL 5 MINUTE)
             ))
         )"
    );
    $claim->execute([':id' => $donationId]);

    if ($claim->rowCount() === 0) {
        $current = $db->prepare('SELECT receipt_status FROM donations WHERE id = :id');
        $current->execute([':id' => $donationId]);
        return (string) ($current->fetchColumn() ?: 'failed');
    }

    $select = $db->prepare('SELECT public_reference, payment_provider, currency, amount, donor_first_name, donor_last_name, donor_email, paid_at FROM donations WHERE id = :id');
    $select->execute([':id' => $donationId]);
    $donation = $select->fetch();
    if (!$donation) {
        return 'failed';
    }

    $firstName = trim((string) $donation['donor_first_name']);
    $fullName = trim($firstName . ' ' . (string) $donation['donor_last_name']);
    $safeName = htmlspecialchars($fullName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeReference = htmlspecialchars((string) $donation['public_reference'], ENT_QUOTES, 'UTF-8');
    $safeAmount = htmlspecialchars((string) $donation['currency'] . ' ' . number_format((float) $donation['amount'], 2, '.', ','), ENT_QUOTES, 'UTF-8');
    $date = (string) ($donation['paid_at'] ?? gmdate('Y-m-d H:i:s'));
    $utc = new DateTimeZone('UTC');
    $receiptDate = DateTimeImmutable::createFromFormat('!Y-m-d H:i:s', $date, $utc);
    if ($receiptDate === false) {
        $receiptDate = new DateTimeImmutable('now', $utc);
    }
    $safeDate = htmlspecialchars($receiptDate->format('F j, Y'), ENT_QUOTES, 'UTF-8');
    $providerName = (string) ($donation['payment_provider'] ?? 'paypal') === 'pesapal' ? 'Pesapal' : 'PayPal';

    $subject = 'Thank you for your donation to Global Hearts Community';
    $html = '<p>Dear ' . $safeName . ',</p>'
        . '<p>Thank you for your donation to Global Hearts Community. ' . $providerName . ' has confirmed your payment.</p>'
        . '<p><strong>Amount:</strong> ' . $safeAmount . '<br>'
        . '<strong>Date:</strong> ' . $safeDate . '<br>'
        . '<strong>Reference:</strong> ' . $safeReference . '</p>'
        . '<p>This email confirms the payment received. It is not a statement about tax deductibility.</p>'
        . '<p>With gratitude,<br>Global Hearts Community</p>';
    $text = "Dear {$fullName},\n\nThank you for your donation to Global Hearts Community. {$providerName} has confirmed your payment.\n\n"
        . "Amount: {$donation['currency']} " . number_format((float) $donation['amount'], 2, '.', ',') . "\n"
        . "Date: {$date}\nReference: {$donation['public_reference']}\n\n"
        . "This email confirms the payment received. It is not a statement about tax deductibility.\n\nWith gratitude,\nGlobal Hearts Community";

    $sent = ghc_send_resend(
        $config,
        (string) $donation['donor_email'],
        $subject,
        $html,
        $text,
        'donation-receipt/' . (string) $donation['public_reference']
    );
    if ($sent['ok']) {
        $notifyEmail = trim((string) ($config['resend']['donation_notify_email'] ?? ''));
        if ($notifyEmail !== '' && filter_var($notifyEmail, FILTER_VALIDATE_EMAIL)) {
            $safeEmail = htmlspecialchars((string) $donation['donor_email'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $notification = ghc_send_resend(
                $config,
                $notifyEmail,
                'Confirmed donation received — ' . (string) $donation['public_reference'],
                '<p>A ' . $providerName . ' donation was confirmed.</p><p><strong>Donor:</strong> ' . $safeName . '<br><strong>Email:</strong> ' . $safeEmail . '<br><strong>Amount:</strong> ' . $safeAmount . '<br><strong>Reference:</strong> ' . $safeReference . '</p>',
                "A {$providerName} donation was confirmed.\nDonor: {$fullName}\nEmail: {$donation['donor_email']}\nAmount: {$safeAmount}\nReference: {$donation['public_reference']}",
                'donation-notification/' . (string) $donation['public_reference']
            );
            if (!$notification['ok']) {
                error_log('GHC backend: internal donation notification could not be delivered.');
            }
        }
        $update = $db->prepare("UPDATE donations SET receipt_status = 'sent', receipt_provider_id = :provider_id, receipt_sent_at = UTC_TIMESTAMP() WHERE id = :id");
        $update->execute([':provider_id' => $sent['id'], ':id' => $donationId]);
        return 'sent';
    }

    $failed = $db->prepare("UPDATE donations SET receipt_status = 'failed' WHERE id = :id AND receipt_status = 'sending'");
    $failed->execute([':id' => $donationId]);
    return 'failed';
}

function ghc_receipt_retry_allowed(PDO $db, int $donationId): bool
{
    $statement = $db->prepare("SELECT (receipt_status <> 'sent' AND receipt_first_attempted_at >= UTC_TIMESTAMP() - INTERVAL 23 HOUR) FROM donations WHERE id = :id");
    $statement->execute([':id' => $donationId]);
    return (int) $statement->fetchColumn() === 1;
}

function ghc_canonical_money(string $amount): ?string
{
    $amount = trim($amount);
    if (!preg_match('/\A(0|[1-9][0-9]{0,8})(?:\.([0-9]{1,2}))?\z/', $amount, $matches)) {
        return null;
    }
    $whole = ltrim($matches[1], '0');
    if ($whole === '') {
        $whole = '0';
    }
    return $whole . '.' . str_pad($matches[2] ?? '', 2, '0');
}

function ghc_mark_verified_donation(PDO $db, array $config, array $donation, string $captureId, string $amount, string $currency): array
{
    $expectedAmount = ghc_canonical_money((string) $donation['amount']);
    $receivedAmount = ghc_canonical_money($amount);
    $expectedCurrency = strtoupper((string) $donation['currency']);
    if ($expectedAmount === null || $receivedAmount === null || $expectedAmount !== $receivedAmount || $expectedCurrency !== strtoupper($currency)) {
        error_log('GHC backend: PayPal amount/currency mismatch for donation ' . (string) $donation['public_reference'] . '.');
        throw new RuntimeException('payment_amount_mismatch');
    }

    $update = $db->prepare(
        "UPDATE donations SET status = 'paid', paypal_capture_id = :capture_id, paid_at = COALESCE(paid_at, UTC_TIMESTAMP())
         WHERE id = :id AND payment_provider = 'paypal' AND status IN ('pending', 'paid')"
    );
    $update->execute([':capture_id' => $captureId, ':id' => (int) $donation['id']]);
    if ($update->rowCount() === 0) {
        $check = $db->prepare("SELECT status, paypal_capture_id FROM donations WHERE id = :id");
        $check->execute([':id' => (int) $donation['id']]);
        $current = $check->fetch();
        if (!$current || $current['status'] !== 'paid' || (string) $current['paypal_capture_id'] !== $captureId) {
            throw new RuntimeException('donation_not_pending');
        }
    }

    $receiptStatus = ghc_send_donation_receipt($db, $config, (int) $donation['id']);
    return [
        'reference' => (string) $donation['public_reference'],
        'receipt_status' => $receiptStatus,
    ];
}

function ghc_verify_pesapal_donation(PDO $db, array $config, array $donation, string $trackingId, string $merchantReference): array
{
    if (!hash_equals((string) $donation['public_reference'], $merchantReference)
        || !hash_equals((string) ($donation['pesapal_tracking_id'] ?? ''), $trackingId)) {
        throw new RuntimeException('pesapal_reference_mismatch');
    }

    $response = ghc_pesapal_request($config, 'GET', '/Transactions/GetTransactionStatus?orderTrackingId=' . rawurlencode($trackingId));
    if ($response['status'] < 200 || $response['status'] >= 300) throw new RuntimeException('pesapal_status_unavailable');
    $remote = $response['json'];
    $remoteReference = (string) ($remote['merchant_reference'] ?? '');
    $remoteAmount = ghc_canonical_money((string) ($remote['amount'] ?? ''));
    $localAmount = ghc_canonical_money((string) $donation['amount']);
    $remoteCurrency = strtoupper((string) ($remote['currency'] ?? ''));
    $localCurrency = strtoupper((string) $donation['currency']);
    if ($remoteReference === '' || !hash_equals($merchantReference, $remoteReference)
        || $remoteAmount === null || $localAmount === null || $remoteAmount !== $localAmount
        || $remoteCurrency !== $localCurrency) {
        error_log('GHC backend: Pesapal transaction identifiers, amount, or currency did not match local donation.');
        throw new RuntimeException('pesapal_transaction_mismatch');
    }

    $paymentStatus = strtoupper(trim((string) ($remote['payment_status_description'] ?? '')));
    if ($paymentStatus === 'REVERSED') {
        $reverse = $db->prepare("UPDATE donations SET status = 'reversed', reversed_at = COALESCE(reversed_at, UTC_TIMESTAMP()) WHERE id = :id AND payment_provider = 'pesapal' AND status IN ('pending', 'paid', 'reversed')");
        $reverse->execute([':id' => (int) $donation['id']]);
        return ['status' => 'reversed'];
    }
    if ($paymentStatus !== 'COMPLETED') {
        if ($paymentStatus === 'FAILED') {
            $fail = $db->prepare("UPDATE donations SET status = 'failed' WHERE id = :id AND payment_provider = 'pesapal' AND status IN ('creating', 'pending', 'failed')");
            $fail->execute([':id' => (int) $donation['id']]);
            return ['status' => 'failed'];
        }
        return ['status' => 'pending'];
    }

    $confirmationCode = substr((string) ($remote['confirmation_code'] ?? ''), 0, 100);
    $update = $db->prepare(
        "UPDATE donations SET status = 'paid', pesapal_confirmation_code = :confirmation_code, paid_at = COALESCE(paid_at, UTC_TIMESTAMP())
         WHERE id = :id AND payment_provider = 'pesapal' AND status IN ('pending', 'failed', 'paid')"
    );
    $update->execute([':confirmation_code' => $confirmationCode !== '' ? $confirmationCode : null, ':id' => (int) $donation['id']]);
    if ($update->rowCount() === 0) {
        $check = $db->prepare("SELECT status, payment_provider FROM donations WHERE id = :id");
        $check->execute([':id' => (int) $donation['id']]);
        $current = $check->fetch();
        if (!$current || $current['status'] !== 'paid' || $current['payment_provider'] !== 'pesapal') {
            throw new RuntimeException('donation_not_pending');
        }
    }

    $receiptStatus = ghc_send_donation_receipt($db, $config, (int) $donation['id']);
    return [
        'status' => 'paid',
        'reference' => (string) $donation['public_reference'],
        'receipt_status' => $receiptStatus,
        'receipt_retry_allowed' => ghc_receipt_retry_allowed($db, (int) $donation['id']),
    ];
}
