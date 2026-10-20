-- Apply once to databases created from the original PayPal-only schema.
-- Back up the database first. Existing donations remain assigned to PayPal.
ALTER TABLE donations
    ADD COLUMN payment_provider ENUM('paypal', 'pesapal') NOT NULL DEFAULT 'paypal' AFTER capture_token_expires_at,
    ADD COLUMN pesapal_tracking_id VARCHAR(64) NULL AFTER paypal_capture_id,
    ADD COLUMN pesapal_confirmation_code VARCHAR(100) NULL AFTER pesapal_tracking_id,
    ADD UNIQUE KEY uq_donations_pesapal_tracking (pesapal_tracking_id);
