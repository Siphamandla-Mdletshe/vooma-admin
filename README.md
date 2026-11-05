# Vooma Admin

Standalone admin web application. This folder is independent of **vooma-driver-app** and has its own dependencies and build.

## Run locally

Use Node.js 22.12+ (Node 24 recommended) and npm.

    npm install
    Copy-Item .env.example .env.local
    npm run dev

Open http://localhost:5173. The API should be running at the URL in `.env.local`; the default is http://localhost:4000.

## Admin sign-in

Admin sign-in is handled by Vooma using email one-time codes. No identity-provider account, client ID, or client secret is needed. The API's **ADMIN_EMAILS** allowlist controls who can sign in. Codes expire after five minutes, and successful verification creates a one-hour admin session held in browser memory.

For a local end-to-end setup, run `npm run local:init` and `npm run local:up` in the Vooma API folder, then start this app with `npm run dev`. Enter **admin@example.test** and retrieve the code from **http://localhost:8025** (Mailpit). The local stack adds that synthetic address to **ADMIN_EMAILS** and routes email to Mailpit.

The current API integration covers authentication only. After a successful sign-in, the dashboard explicitly identifies its records and actions as sample data; driver, support, and other operational endpoints still need to be connected. **Explore demo dashboard** remains available without signing in and uses sample data only.

## Commands

    npm run typecheck
    npm run lint
    npm run build
    npm run preview

Production files are generated in dist/. Keep node_modules/, dist/ and local environment files out of Git; commit the lockfile alongside the source.
