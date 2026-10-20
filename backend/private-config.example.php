<?php
declare(strict_types=1);

/**
 * Copy this file OUTSIDE the website document root to:
 *   ../private/global-hearts-config.php
 * from the hosting account home directory.
 * Never commit real credentials or put them in Vite/VITE_* variables.
 */
return [
    'site_origin' => 'https://www.globalheartscommunity.org',
    'database' => [
        'dsn' => 'mysql:host=localhost;dbname=REPLACE_WITH_DATABASE;charset=utf8mb4',
        'username' => 'REPLACE_WITH_DATABASE_USER',
        'password' => 'REPLACE_WITH_DATABASE_PASSWORD',
    ],
    // Use a long random value (at least 32 bytes) to hash IPs for rate limiting.
    'rate_limit_key' => 'REPLACE_WITH_RANDOM_SECRET',
    'paypal' => [
        // Keep sandbox until a small end-to-end test is successful.
        'mode' => 'sandbox',
        'client_id' => '',
        'client_secret' => '',
        'webhook_id' => '',
        'currency' => 'USD',
        'max_amount' => '100000.00',
    ],
    'pesapal' => [
        // Use sandbox first. Request the consumer key/secret from your Pesapal merchant account.
        'mode' => 'sandbox',
        'consumer_key' => '',
        'consumer_secret' => '',
        // Register https://www.globalheartscommunity.org/api/pesapal-ipn.php once per environment
        // and paste the returned ipn_id here.
        'ipn_id' => '',
        'currency' => 'UGX',
        'max_amount' => '100000000.00',
    ],
    'mailerlite' => [
        'api_key' => '',
        'group_id' => '',
    ],
    'resend' => [
        'api_key' => '',
        // Must be a sender address/domain verified in Resend.
        'from' => '',
        'reply_to' => 'globalheartscommunity@gmail.com',
        // Optional address to receive an internal notice for each confirmed gift.
        'donation_notify_email' => '',
    ],
];
