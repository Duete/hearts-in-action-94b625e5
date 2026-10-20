<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
$config = ghc_bootstrap(false);
ghc_require_method('POST');

function ghc_request_header(string $name): string
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    foreach ($headers as $headerName => $value) {
        if (strcasecmp((string) $headerName, $name) === 0) {
            return trim((string) $value);
        }
    }
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    return trim((string) ($_SERVER[$serverKey] ?? ''));
}

function ghc_mark_webhook_processed(PDO $db, string $eventId, ?string $resourceId = null): void
{
    $claimToken = (string) ($GLOBALS['ghc_webhook_claim_token'] ?? '');
    if ($claimToken === '') throw new RuntimeException('webhook_claim_missing');
    $statement = $db->prepare("UPDATE paypal_webhook_events SET status = 'processed', resource_id = :resource_id, review_note = NULL, processing_at = NULL, processing_token = NULL, processed_at = UTC_TIMESTAMP() WHERE event_id = :event_id AND status = 'processing' AND processing_token = :claim_token");
    $statement->execute([':event_id' => $eventId, ':resource_id' => $resourceId, ':claim_token' => $claimToken]);
    if ($statement->rowCount() !== 1) throw new RuntimeException('webhook_claim_lost');
}

function ghc_mark_webhook_review(PDO $db, string $eventId, string $resourceId, string $note): void
{
    $claimToken = (string) ($GLOBALS['ghc_webhook_claim_token'] ?? '');
    if ($claimToken === '') throw new RuntimeException('webhook_claim_missing');
    $statement = $db->prepare("UPDATE paypal_webhook_events SET status = 'needs_review', resource_id = :resource_id, review_note = :review_note, processing_at = NULL, processing_token = NULL WHERE event_id = :event_id AND status = 'processing' AND processing_token = :claim_token");
    $statement->execute([
        ':event_id' => $eventId,
        ':resource_id' => substr($resourceId, 0, 100),
        ':review_note' => substr($note, 0, 255),
        ':claim_token' => $claimToken,
    ]);
    if ($statement->rowCount() !== 1) throw new RuntimeException('webhook_claim_lost');
}

function ghc_apply_refund_state(PDO $db, array $donation, string $captureId, string $newStatus): void
{
    $currentStatus = (string) $donation['status'];
    if (in_array($currentStatus, ['refunded', 'reversed'], true)) {
        if ($currentStatus === 'reversed' || $newStatus !== 'reversed') {
            return;
        }
    }

    if ($newStatus === 'partially_refunded') {
        if ($currentStatus !== 'paid') return;
        $statement = $db->prepare("UPDATE donations SET status = 'partially_refunded', paypal_capture_id = :capture_id WHERE id = :id AND status = 'paid'");
        $statement->execute([':capture_id' => $captureId, ':id' => (int) $donation['id']]);
        return;
    }
    if ($newStatus === 'refunded') {
        if (!in_array($currentStatus, ['paid', 'partially_refunded'], true)) return;
        $statement = $db->prepare("UPDATE donations SET status = 'refunded', paypal_capture_id = :capture_id, refunded_at = COALESCE(refunded_at, UTC_TIMESTAMP()) WHERE id = :id AND status IN ('paid', 'partially_refunded')");
        $statement->execute([':capture_id' => $captureId, ':id' => (int) $donation['id']]);
        return;
    }
    if ($newStatus === 'reversed') {
        if (!in_array($currentStatus, ['paid', 'partially_refunded', 'refunded'], true)) return;
        $statement = $db->prepare("UPDATE donations SET status = 'reversed', paypal_capture_id = :capture_id, reversed_at = COALESCE(reversed_at, UTC_TIMESTAMP()) WHERE id = :id AND status IN ('paid', 'partially_refunded', 'refunded')");
        $statement->execute([':capture_id' => $captureId, ':id' => (int) $donation['id']]);
    }
}

$rawEvent = file_get_contents('php://input');
if (!is_string($rawEvent) || $rawEvent === '' || strlen($rawEvent) > 262144) {
    ghc_json(400, ['ok' => false, 'code' => 'invalid_event']);
}
$event = json_decode($rawEvent, true);
if (!is_array($event) || empty($event['id']) || empty($event['event_type'])) {
    ghc_json(400, ['ok' => false, 'code' => 'invalid_event']);
}

$webhookId = (string) ($config['paypal']['webhook_id'] ?? '');
$headers = [
    'auth_algo' => ghc_request_header('PAYPAL-AUTH-ALGO'),
    'cert_url' => ghc_request_header('PAYPAL-CERT-URL'),
    'transmission_id' => ghc_request_header('PAYPAL-TRANSMISSION-ID'),
    'transmission_sig' => ghc_request_header('PAYPAL-TRANSMISSION-SIG'),
    'transmission_time' => ghc_request_header('PAYPAL-TRANSMISSION-TIME'),
];
$headerLimits = ['auth_algo' => 32, 'cert_url' => 2048, 'transmission_id' => 128, 'transmission_sig' => 8192, 'transmission_time' => 64];
foreach ($headerLimits as $name => $maximumLength) {
    if ($headers[$name] === '' || strlen($headers[$name]) > $maximumLength) {
        ghc_json(400, ['ok' => false, 'code' => 'invalid_webhook_headers']);
    }
}
$certificateUrl = parse_url($headers['cert_url']);
if (!is_array($certificateUrl)) {
    ghc_json(400, ['ok' => false, 'code' => 'invalid_webhook_headers']);
}
$certificateHost = strtolower((string) ($certificateUrl['host'] ?? ''));
if (($certificateUrl['scheme'] ?? '') !== 'https'
    || !preg_match('/(?:^|\.)paypal\.com\z/i', $certificateHost)
    || !str_starts_with((string) ($certificateUrl['path'] ?? ''), '/v1/notifications/certs/')
    || isset($certificateUrl['user'])
    || isset($certificateUrl['pass'])
    || (isset($certificateUrl['port']) && (int) $certificateUrl['port'] !== 443)) {
    ghc_json(400, ['ok' => false, 'code' => 'invalid_webhook_headers']);
}
if ($webhookId === '') {
    ghc_json(503, ['ok' => false, 'code' => 'webhook_not_configured']);
}
if ($headers['auth_algo'] !== 'SHA256withRSA') {
    ghc_json(400, ['ok' => false, 'code' => 'invalid_webhook_headers']);
}

try {
    $db = ghc_db($config);
    ghc_rate_limit($db, $config, 'paypal-webhook-ip', 300, 3600);
    ghc_rate_limit($db, $config, 'paypal-webhook-global', 1000, 3600, 'global');

    $verification = ghc_paypal_request($config, 'POST', '/v1/notifications/verify-webhook-signature', [
        'auth_algo' => $headers['auth_algo'],
        'cert_url' => $headers['cert_url'],
        'transmission_id' => $headers['transmission_id'],
        'transmission_sig' => $headers['transmission_sig'],
        'transmission_time' => $headers['transmission_time'],
        'webhook_id' => $webhookId,
        'webhook_event' => $event,
    ]);
    if ($verification['status'] !== 200) {
        error_log('GHC backend: PayPal webhook verification service returned HTTP ' . $verification['status'] . '.');
        ghc_json(503, ['ok' => false, 'code' => 'webhook_verification_unavailable']);
    }
    if ((string) ($verification['json']['verification_status'] ?? '') !== 'SUCCESS') {
        error_log('GHC backend: PayPal webhook signature verification failed.');
        ghc_json(400, ['ok' => false, 'code' => 'invalid_webhook_signature']);
    }

    $eventId = substr((string) $event['id'], 0, 100);
    $eventType = substr((string) $event['event_type'], 0, 120);
    $resource = is_array($event['resource'] ?? null) ? $event['resource'] : [];
    $resourceId = substr((string) ($resource['id'] ?? ''), 0, 100);

    $insert = $db->prepare("INSERT IGNORE INTO paypal_webhook_events (event_id, event_type, status, resource_id) VALUES (:event_id, :event_type, 'received', :resource_id)");
    $insert->execute([':event_id' => $eventId, ':event_type' => $eventType, ':resource_id' => $resourceId !== '' ? $resourceId : null]);

    $claimToken = bin2hex(random_bytes(32));
    $GLOBALS['ghc_webhook_claim_token'] = $claimToken;
    $claim = $db->prepare("UPDATE paypal_webhook_events SET status = 'processing', processing_at = UTC_TIMESTAMP(), processing_token = :claim_token WHERE event_id = :event_id AND (status IN ('received', 'failed') OR (status = 'processing' AND (processing_at IS NULL OR processing_at < UTC_TIMESTAMP() - INTERVAL 10 MINUTE)))");
    $claim->execute([':event_id' => $eventId, ':claim_token' => $claimToken]);
    if ($claim->rowCount() === 0) {
        $eventLookup = $db->prepare('SELECT status FROM paypal_webhook_events WHERE event_id = :event_id');
        $eventLookup->execute([':event_id' => $eventId]);
        $currentEventStatus = (string) $eventLookup->fetchColumn();
        if (in_array($currentEventStatus, ['processed', 'needs_review'], true)) {
            ghc_json(200, ['ok' => true, 'duplicate' => true]);
        }
        if ($currentEventStatus === 'processing') {
            ghc_json(503, ['ok' => false, 'code' => 'webhook_processing']);
        }
        ghc_json(503, ['ok' => false, 'code' => 'webhook_retry']);
    }

    $captureLifecycleEvents = ['PAYMENT.CAPTURE.REFUNDED', 'PAYMENT.CAPTURE.REVERSED'];
    $refundReviewEvents = ['PAYMENT.REFUND.PENDING', 'PAYMENT.REFUND.FAILED'];

    if (in_array($eventType, $refundReviewEvents, true)) {
        ghc_mark_webhook_review($db, $eventId, $resourceId, 'Refund lifecycle event recorded for staff reconciliation.');
        error_log('GHC backend: PayPal refund lifecycle event requires staff review.');
        ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
    }

    if (in_array($eventType, $captureLifecycleEvents, true)) {
        $captureId = (string) ($resource['id'] ?? $resource['supplementary_data']['related_ids']['capture_id'] ?? '');
        $orderId = (string) ($resource['supplementary_data']['related_ids']['order_id'] ?? '');
        if ($captureId === '') {
            ghc_mark_webhook_review($db, $eventId, $resourceId, 'Capture ID missing from signed refund/reversal event.');
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }

        $lookup = $db->prepare('SELECT * FROM donations WHERE paypal_capture_id = :capture_id LIMIT 1');
        $lookup->execute([':capture_id' => $captureId]);
        $donation = $lookup->fetch();
        if (!$donation && $orderId !== '') {
            $lookup = $db->prepare('SELECT * FROM donations WHERE paypal_order_id = :order_id LIMIT 1');
            $lookup->execute([':order_id' => $orderId]);
            $donation = $lookup->fetch();
        }
        if (!$donation || !in_array((string) $donation['status'], ['paid', 'partially_refunded', 'refunded', 'reversed'], true)) {
            ghc_mark_webhook_review($db, $eventId, $captureId, 'No finalized local donation matched this refund/reversal; reconcile against PayPal.');
            error_log('GHC backend: verified PayPal refund/reversal did not match a finalized donation.');
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }
        $storedCaptureId = (string) ($donation['paypal_capture_id'] ?? '');
        if ($storedCaptureId !== '' && !hash_equals($storedCaptureId, $captureId)) {
            ghc_mark_webhook_review($db, $eventId, $captureId, 'Refund/reversal capture ID conflicts with the local donation.');
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }

        $details = ghc_paypal_request($config, 'GET', '/v2/payments/captures/' . rawurlencode($captureId));
        if ($details['status'] !== 200) {
            throw new RuntimeException('capture_reconciliation_failed');
        }
        $capture = $details['json'];
        $captureAmount = ghc_canonical_money((string) ($capture['amount']['value'] ?? ''));
        $donationAmount = ghc_canonical_money((string) $donation['amount']);
        $captureCurrency = strtoupper((string) ($capture['amount']['currency_code'] ?? ''));
        $donationCurrency = strtoupper((string) $donation['currency']);
        if ($captureAmount === null || $donationAmount === null || $captureAmount !== $donationAmount || $captureCurrency !== $donationCurrency) {
            ghc_mark_webhook_review($db, $eventId, $captureId, 'PayPal capture amount or currency did not match the local donation.');
            error_log('GHC backend: PayPal refund/reversal amount mismatch requires staff review.');
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }

        $remoteStatus = strtoupper((string) ($capture['status'] ?? ''));
        $newStatus = null;
        if ($eventType === 'PAYMENT.CAPTURE.REVERSED' && $remoteStatus === 'REVERSED') {
            $newStatus = 'reversed';
        } elseif ($eventType === 'PAYMENT.CAPTURE.REFUNDED' && $remoteStatus === 'REFUNDED') {
            $newStatus = 'refunded';
        } elseif ($eventType === 'PAYMENT.CAPTURE.REFUNDED' && $remoteStatus === 'PARTIALLY_REFUNDED') {
            $newStatus = 'partially_refunded';
        }
        if ($newStatus === null) {
            ghc_mark_webhook_review($db, $eventId, $captureId, 'PayPal capture state needs staff reconciliation; reported status: ' . $remoteStatus);
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }

        ghc_apply_refund_state($db, $donation, $captureId, $newStatus);
        ghc_mark_webhook_processed($db, $eventId, $captureId);
        ghc_json(200, ['ok' => true]);
    }

    if ($eventType !== 'PAYMENT.CAPTURE.COMPLETED') {
        ghc_mark_webhook_processed($db, $eventId, $resourceId !== '' ? $resourceId : null);
        ghc_json(200, ['ok' => true]);
    }

    $orderId = (string) ($resource['supplementary_data']['related_ids']['order_id'] ?? '');
    $referenceValues = array_values(array_filter([
        trim((string) ($resource['custom_id'] ?? '')),
        trim((string) ($resource['invoice_id'] ?? '')),
        trim((string) ($resource['reference_id'] ?? '')),
    ], static fn (string $value): bool => $value !== ''));
    if (count(array_unique($referenceValues)) > 1) {
        ghc_mark_webhook_review($db, $eventId, $resourceId, 'PayPal custom, invoice, and reference IDs disagree.');
        ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
    }
    $reference = $referenceValues[0] ?? '';
    $donation = null;
    if ($orderId !== '') {
        $lookup = $db->prepare('SELECT * FROM donations WHERE paypal_order_id = :order_id LIMIT 1');
        $lookup->execute([':order_id' => $orderId]);
        $donation = $lookup->fetch();
    }
    if (!$donation && $reference !== '') {
        $lookup = $db->prepare('SELECT * FROM donations WHERE public_reference = :reference LIMIT 1');
        $lookup->execute([':reference' => $reference]);
        $donation = $lookup->fetch();
    }
    if (!$donation) {
        ghc_mark_webhook_review($db, $eventId, $resourceId, 'Verified capture event had no local order reference.');
        error_log('GHC backend: verified PayPal capture event had no order reference.');
        ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
    }

    $amount = (string) ($resource['amount']['value'] ?? '');
    $currency = (string) ($resource['amount']['currency_code'] ?? '');
    $captureId = (string) ($resource['id'] ?? '');
    if ($amount === '' || $currency === '' || $captureId === '') {
        throw new RuntimeException('verified_event_missing_capture_fields');
    }

    if (($reference !== '' && !hash_equals((string) $donation['public_reference'], $reference))
        || ($orderId !== '' && (string) ($donation['paypal_order_id'] ?? '') !== '' && !hash_equals((string) $donation['paypal_order_id'], $orderId))
        || ((string) ($donation['paypal_capture_id'] ?? '') !== '' && !hash_equals((string) $donation['paypal_capture_id'], $captureId))) {
        ghc_mark_webhook_review($db, $eventId, $captureId, 'PayPal capture identifiers did not match the local donation.');
        error_log('GHC backend: verified PayPal capture identifiers require staff review.');
        ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
    }

    $expectedAmount = ghc_canonical_money((string) $donation['amount']);
    $receivedAmount = ghc_canonical_money($amount);
    if ($expectedAmount === null || $receivedAmount === null || $expectedAmount !== $receivedAmount || strtoupper((string) $donation['currency']) !== strtoupper($currency)) {
        ghc_mark_webhook_review($db, $eventId, $captureId, 'PayPal capture amount or currency did not match the local donation.');
        error_log('GHC backend: verified PayPal capture amount mismatch requires staff review.');
        ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
    }

    if ($orderId !== '' && (string) ($donation['paypal_order_id'] ?? '') === '') {
        if ($reference === '' || !hash_equals((string) $donation['public_reference'], $reference)) {
            ghc_mark_webhook_review($db, $eventId, $resourceId, 'Order-ID recovery lacked a matching local reference.');
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }
        $associate = $db->prepare('UPDATE donations SET paypal_order_id = :order_id WHERE id = :id AND paypal_order_id IS NULL');
        $associate->execute([':order_id' => $orderId, ':id' => (int) $donation['id']]);
        if ($associate->rowCount() === 0) {
            $storedOrder = $db->prepare('SELECT paypal_order_id FROM donations WHERE id = :id');
            $storedOrder->execute([':id' => (int) $donation['id']]);
            if (!hash_equals($orderId, (string) $storedOrder->fetchColumn())) {
                ghc_mark_webhook_review($db, $eventId, $captureId, 'Verified PayPal order ID could not be associated safely.');
                ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
            }
        }
        $donation['paypal_order_id'] = $orderId;
    }

    $donationStatus = (string) $donation['status'];
    if (in_array($donationStatus, ['partially_refunded', 'refunded', 'reversed'], true)) {
        ghc_mark_webhook_processed($db, $eventId, $captureId);
        ghc_json(200, ['ok' => true]);
    }
    if (in_array($donationStatus, ['creating', 'failed'], true)) {
        if ($orderId === '' || $reference === '' || !hash_equals((string) $donation['public_reference'], $reference)) {
            ghc_mark_webhook_review($db, $eventId, $captureId, 'A completed capture could not be safely linked to the local order.');
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }
        $recover = $db->prepare("UPDATE donations SET paypal_order_id = :order_set, status = 'pending' WHERE id = :id AND status IN ('creating', 'failed') AND (paypal_order_id IS NULL OR paypal_order_id = :order_match)");
        $recover->execute([':order_set' => $orderId, ':id' => (int) $donation['id'], ':order_match' => $orderId]);
        if ($recover->rowCount() === 0) {
            $state = $db->prepare('SELECT status, paypal_order_id FROM donations WHERE id = :id');
            $state->execute([':id' => (int) $donation['id']]);
            $latest = $state->fetch();
            if (!$latest || (string) $latest['status'] !== 'pending' || !hash_equals((string) $latest['paypal_order_id'], $orderId)) {
                ghc_mark_webhook_review($db, $eventId, $captureId, 'The verified capture could not safely repair the local order state.');
                ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
            }
        }
        $donation['status'] = 'pending';
        $donation['paypal_order_id'] = $orderId;
    }

    $finalized = ghc_mark_verified_donation($db, $config, $donation, $captureId, $amount, $currency);
    if ($finalized['receipt_status'] !== 'sent') {
        $receiptWindow = $db->prepare('SELECT (receipt_first_attempted_at >= UTC_TIMESTAMP() - INTERVAL 23 HOUR) AS retryable FROM donations WHERE id = :id');
        $receiptWindow->execute([':id' => (int) $donation['id']]);
        if ((int) $receiptWindow->fetchColumn() !== 1) {
            ghc_mark_webhook_review($db, $eventId, $captureId, 'Receipt was not confirmed within the automatic retry window.');
            ghc_json(200, ['ok' => true, 'reviewRequired' => true]);
        }
        throw new RuntimeException('receipt_delivery_pending_or_failed');
    }

    ghc_mark_webhook_processed($db, $eventId, $captureId);
    ghc_json(200, ['ok' => true]);
} catch (Throwable $error) {
    error_log('GHC backend: verified PayPal webhook processing failed (' . get_class($error) . ').');
    if (isset($db, $eventId)) {
        try {
            $claimToken = (string) ($GLOBALS['ghc_webhook_claim_token'] ?? '');
            $failed = $db->prepare("UPDATE paypal_webhook_events SET status = 'failed', processing_at = NULL, processing_token = NULL WHERE event_id = :event_id AND status = 'processing' AND processing_token = :claim_token");
            if ($claimToken !== '') {
                $failed->execute([':event_id' => $eventId, ':claim_token' => $claimToken]);
            }
        } catch (Throwable) {
            // PayPal will retry this event after a non-2xx response.
        }
    }
    ghc_json(500, ['ok' => false, 'code' => 'webhook_processing_failed']);
}
