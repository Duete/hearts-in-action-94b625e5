<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
$config = ghc_bootstrap(true);
ghc_require_method('POST');
$data = ghc_read_json();

$email = strtolower(trim((string) ($data['email'] ?? '')));
$consent = ($data['consent'] ?? false) === true;
$honeypot = trim((string) ($data['website'] ?? ''));

if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ghc_json(422, ['ok' => false, 'code' => 'invalid_email', 'message' => 'Enter a valid email address.']);
}
if (!$consent) {
    ghc_json(422, ['ok' => false, 'code' => 'consent_required', 'message' => 'Please confirm that you want to receive newsletter updates.']);
}

try {
    $db = ghc_db($config);
    ghc_rate_limit($db, $config, 'newsletter-subscribe', 5, 3600);

    // Quietly accept honeypot submissions without forwarding them to the mailing list.
    if ($honeypot !== '') {
        ghc_json(202, ['ok' => true, 'message' => 'Your request was received. If this address needs confirmation, check your inbox; campaign emails are sent only to confirmed subscribers.']);
    }

    ghc_rate_limit($db, $config, 'newsletter-email', 3, 86400, $email);

    $mailerLite = $config['mailerlite'] ?? [];
    $apiKey = (string) ($mailerLite['api_key'] ?? '');
    $groupId = (string) ($mailerLite['group_id'] ?? '');
    if ($apiKey === '' || $groupId === '') {
        ghc_json(503, ['ok' => false, 'code' => 'newsletter_not_configured', 'message' => 'Newsletter signup is temporarily unavailable. Please try again later.']);
    }

    $response = ghc_http_json('POST', 'https://connect.mailerlite.com/api/subscribers', [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'Accept: application/json',
    ], [
        'email' => $email,
        'groups' => [$groupId],
        'status' => 'unconfirmed',
    ]);

    if ($response['status'] !== 200 && $response['status'] !== 201) {
        error_log('GHC backend: MailerLite rejected a newsletter signup with HTTP ' . $response['status'] . '.');
        ghc_json(502, ['ok' => false, 'code' => 'newsletter_provider_error', 'message' => 'We could not submit your signup right now. Please try again later.']);
    }

    // The address stays unconfirmed; avoid claiming a message was sent if MailerLite suppresses it.
    ghc_json(202, ['ok' => true, 'message' => 'Your request was received. If this address needs confirmation, check your inbox; campaign emails are sent only to confirmed subscribers.']);
} catch (Throwable $error) {
    error_log('GHC backend: newsletter request failed (' . get_class($error) . ').');
    ghc_json(503, ['ok' => false, 'code' => 'newsletter_unavailable', 'message' => 'Newsletter signup is temporarily unavailable. Please try again later.']);
}
