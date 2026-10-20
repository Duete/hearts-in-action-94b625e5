# Donation and newsletter backend

This repository contains same-origin PHP endpoints for the static React/Vite site. They are designed for PHP-capable LiteSpeed/Apache-style hosting. PayPal, MailerLite, and Resend credentials stay on the server; the browser never receives provider secrets.

## What the backend does

- Newsletter signups require explicit consent, are rate-limited, and are submitted to MailerLite with status `unconfirmed`. MailerLite double opt-in must be enabled. Campaign mail is sent only after the subscriber confirms; the site does not claim that a confirmation email was sent when the provider response does not confirm that.
- One-time PayPal donations are created and captured on the server. Donors are redirected to PayPal-hosted checkout; the site does not collect card numbers.
- A donation is marked paid only after a server-side capture confirmation and amount/currency comparison. PayPal webhook signatures are verified through PayPal’s verification API.
- Confirmed capture refunds/reversals are reconciled against PayPal’s current capture record when possible. Ambiguous refund events are stored as `needs_review` rather than silently discarded or treated as paid. Staff must monitor and reconcile those records.
- Donor receipts are sent through Resend only after a verified capture. The receipt request uses a stable Resend `Idempotency-Key` based on the donation reference to reduce duplicate sends during retries.
- Bank and Western Union transfers remain manual. They are not treated as paid and do not trigger an automatic receipt until staff verify the transfer.

The implementation does not create provider accounts, verify a sender domain, or add credentials. Online services remain unavailable until the host configuration and provider accounts are completed.

## Host requirements

Use a host that executes PHP 8.1 or later and provides PHP cURL, PDO MySQL, HTTPS, and MySQL/MariaDB. Upload the built site so PHP files under `dist/api/` execute server-side and are not served as text or rewritten to `index.html`. The frontend currently uses relative `/api/...` paths; for separate frontend/backend hosts, put the API behind a same-origin `/api` reverse proxy or add a configurable API base URL and matching CORS policy before launch.

## Setup

1. Create a MySQL database and a database user with access limited to that database. Import [`schema.sql`](./schema.sql). The database stores donor names, email, amount, consent timestamp, payment identifiers, receipt state, and minimal webhook metadata. Restrict database access and backups to authorized administrators, and set a retention period that matches the organization’s accounting and privacy obligations.
2. Copy [`private-config.example.php`](./private-config.example.php) to a private location outside the document root. With a typical cPanel layout, if the site document root is `/home/ACCOUNT/public_html`, create `/home/ACCOUNT/private/global-hearts-config.php`. Restrict file permissions (for example, `chmod 600`). For a different path, set `GHC_PRIVATE_CONFIG`. Never place live keys in this repository, a `VITE_*` variable, JavaScript, or a publicly served directory.
3. Set `site_origin` to the canonical HTTPS origin, configure the database DSN/user/password, keep `paypal.currency` set to `USD` (the current checkout UI is USD-only), and generate a random `rate_limit_key` (for example, `openssl rand -hex 32`). The example file contains placeholders only.
4. In PayPal Developer Dashboard, create a REST app and start with sandbox credentials. Register `https://www.globalheartscommunity.org/api/paypal-webhook.php` for `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED`, `PAYMENT.CAPTURE.REVERSED`, `PAYMENT.REFUND.PENDING`, and `PAYMENT.REFUND.FAILED`. Copy that environment’s webhook ID into the private config. Sandbox and live apps use different credentials and webhook IDs.
5. In MailerLite, create an API key and select the subscriber group ID. Enable double-opt-in confirmation in the MailerLite account, then set those values in the private config.
6. In Resend, verify the sender domain/address and DNS records, create an API key, and set `resend.from` to the verified sender. Optionally set `donation_notify_email` for an internal copy; donor receipts are sent independently.
7. Deploy `dist/` to the document root and verify PHP files execute server-side. Test newsletter confirmation and a complete PayPal sandbox donation, including receipt delivery and webhook handling. Check the database for donation state and receipt status. Review server logs without exposing them publicly.
8. Only after sandbox testing, set PayPal mode to `live` and install the live PayPal client ID, secret, and webhook ID. Do not use sandbox credentials in production.

The API reads its private configuration from the account’s `private/` directory outside `public_html` by default. For a nonstandard document-root layout, use `GHC_PRIVATE_CONFIG`; do not move secrets into `public/api/`.

## Security and operations

- Payment credentials remain server-side. The application never asks donors to enter card details into the website.
- Each checkout gets a random capture token; only its SHA-256 hash is stored in MySQL. The raw token remains in the donor’s same-tab session storage and expires after 24 hours. Repeated requests after payment never create or capture a second PayPal payment; they may only retry a receipt within the bounded window.
- Prepared statements are used for SQL. Amount and currency are validated server-side. API requests accept only the configured site origin when an `Origin` header is present, bound JSON request sizes, and rate-limit by hashed IP; newsletter attempts also use a keyed hash of the email, not the raw address. Webhook verification is throttled before outbound PayPal calls, PayPal OAuth tokens are cached in APCu when the host provides it, and webhook events use a fenced processing claim to prevent stale workers from overwriting newer results. Stale rate-limit rows are purged after 48 hours. A newsletter honeypot and explicit consent reduce unwanted submissions.
- Newsletter consent is separate from donation processing. Donating does not add an address to the mailing list.
- Receipt delivery can fail independently from payment. The payment remains recorded, the page reports the receipt state honestly, and the state is stored for follow-up. Resend documents idempotency keys as valid for 24 hours; automatic and donor-requested retries stop 23 hours after the first attempt, and older unresolved `sending`/`failed` receipts require staff reconciliation before any manual retry.
- Review refund events that need staff attention with:

  ```sql
  SELECT event_id, event_type, resource_id, review_note, received_at
  FROM paypal_webhook_events
  WHERE status = 'needs_review'
  ORDER BY received_at DESC;
  ```

- The database contains personal information. The sample does not define donor-data deletion/retention or claim tax deductibility. The organization should adopt its privacy notice and documented retention process before production; protect database backups and limit administrator access.

## Official API references

- [PayPal Orders v2 — create order](https://developer.paypal.com/api/orders/v2/orders-create)
- [PayPal Orders v2 — capture order](https://developer.paypal.com/api/orders/v2/orders-capture)
- [PayPal REST API authentication](https://developer.paypal.com/api/rest/authentication)
- [PayPal webhook signature verification](https://developer.paypal.com/api/webhooks/v1/verify-webhook-signature-post)
- [PayPal webhook event names](https://developer.paypal.com/api/rest/webhooks/event-names)
- [PayPal Payments v2 — show captured payment details](https://developer.paypal.com/api/payments/v2/captures-get)
- [MailerLite API — subscribers](https://developers.mailerlite.com/api/subscribers)
- [Resend API — send email](https://resend.com/docs/api-reference/emails/send-email)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
