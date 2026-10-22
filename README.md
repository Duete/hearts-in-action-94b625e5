# Global Hearts Community

Website for Global Hearts Community, a charity serving Mbale and surrounding communities in Uganda.

## Stack

- React, TypeScript, and Vite
- Tailwind CSS and shadcn/ui
- PHP 8.1+ API for donations and newsletter subscriptions
- MySQL/MariaDB for donation records and API rate limits

## Local development

Requirements: Node.js and npm.

```sh
npm ci
npm run dev
```

Create a production build with prerendered routes:

```sh
npm run build
```

The complete deployable site is written to `dist/`.

## Production hosting

The site’s online donation and newsletter flows require PHP-capable HTTPS hosting. Deploy the complete `dist/` directory, including `dist/api/`, to a server with PHP 8.1+, PHP cURL, PDO MySQL, and MySQL/MariaDB. Configure the private server credentials outside the public document root. Do not deploy the frontend alone if you need working payment and subscription endpoints.

See [backend/README.md](backend/README.md) for database setup, private configuration, PayPal and Pesapal setup, MailerLite double opt-in, Resend receipts, and sandbox testing.

## Repository conventions

- Keep impact figures in `src/data/impact.json` and verify them against published reporting.
- Keep new images in the project asset directory, prefer existing organization photography, and optimize files for the web.
- The Home page owns the Programs section; `/programs` redirects to `/#programs`.
- Keep shared impact figures consistent across homepage highlights and news reporting.
