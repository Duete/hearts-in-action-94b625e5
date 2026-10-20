CREATE TABLE donations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_reference CHAR(27) NOT NULL,
    capture_token_hash CHAR(64) NOT NULL,
    capture_token_expires_at DATETIME NOT NULL,
    payment_provider ENUM('paypal', 'pesapal') NOT NULL DEFAULT 'paypal',
    paypal_order_id VARCHAR(64) NULL,
    paypal_capture_id VARCHAR(64) NULL,
    pesapal_tracking_id VARCHAR(64) NULL,
    pesapal_confirmation_code VARCHAR(100) NULL,
    currency CHAR(3) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    donor_first_name VARCHAR(100) NOT NULL,
    donor_last_name VARCHAR(100) NOT NULL,
    donor_email VARCHAR(254) NOT NULL,
    privacy_acknowledged TINYINT(1) NOT NULL DEFAULT 0,
    privacy_acknowledged_at DATETIME NULL,
    status ENUM('creating', 'pending', 'paid', 'partially_refunded', 'refunded', 'reversed', 'failed') NOT NULL DEFAULT 'creating',
    receipt_status ENUM('pending', 'sending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
    receipt_provider_id VARCHAR(100) NULL,
    receipt_attempted_at DATETIME NULL,
    receipt_first_attempted_at DATETIME NULL,
    receipt_sent_at DATETIME NULL,
    paid_at DATETIME NULL,
    refunded_at DATETIME NULL,
    reversed_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_donations_public_reference (public_reference),
    UNIQUE KEY uq_donations_paypal_order (paypal_order_id),
    UNIQUE KEY uq_donations_paypal_capture (paypal_capture_id),
    UNIQUE KEY uq_donations_pesapal_tracking (pesapal_tracking_id),
    KEY idx_donations_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE api_rate_limits (
    key_hash CHAR(64) NOT NULL,
    bucket_start BIGINT UNSIGNED NOT NULL,
    hits SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (key_hash),
    KEY idx_rate_limits_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE paypal_webhook_events (
    event_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    status ENUM('received', 'processing', 'processed', 'failed', 'needs_review') NOT NULL DEFAULT 'received',
    resource_id VARCHAR(100) NULL,
    review_note VARCHAR(255) NULL,
    received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processing_at DATETIME NULL,
    processing_token CHAR(64) NULL,
    processed_at DATETIME NULL,
    PRIMARY KEY (event_id),
    KEY idx_paypal_events_status_received (status, received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
