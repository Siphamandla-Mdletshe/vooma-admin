# Vooma Admin

Standalone admin web application. This folder is independent of **vooma-driver-app** and has its own dependencies and build.

## Run locally

Use Node.js 22.12+ (Node 24 recommended) and npm.

    npm install
    Copy-Item .env.example .env.local
    npm run dev

Open http://localhost:5173. The API should be running at the URL in `.env.local`; the default is http://localhost:4000.

To use the API on the network server, set `VITE_API_BASE_URL=http://192.168.8.80:4000` in `.env` or `.env.local`. If both files exist, `.env.local` takes precedence. Vite reloads environment changes; refresh the browser afterward. Development allows HTTP for localhost and private network IP addresses. Production requires an HTTPS API URL.

## Admin sign-in

Admin sign-in is handled by Vooma using email one-time codes. No identity-provider account, client ID, or client secret is needed. The API's **ADMIN_EMAILS** allowlist controls who can sign in. Codes expire after five minutes, and successful verification creates a one-hour admin session held in browser memory.

For a local end-to-end setup, run `npm run local:init` and `npm run local:up` in the Vooma API folder, then start this app with `npm run dev`. Enter **admin@example.test** and retrieve the code from **http://localhost:8025** (Mailpit). The local stack adds that synthetic address to **ADMIN_EMAILS** and routes email to Mailpit.

Drivers and Vehicles load real registration records from the configured API. Open **Drivers → select a driver → Documents** to see the identity photo, licence images, professional permit, vehicle registration, insurance, and any optional certificates uploaded during registration. Clean-scanned images and PDFs can be previewed or downloaded using the admin session; missing files and pending scans are shown explicitly. **Review application** moves a submitted application into review, then lets an admin approve, reject, request changes, or suspend an approved driver. Every transition is version-guarded and audited by the API. **Refresh registrations** and **Refresh documents** fetch the latest submissions.

The driver app and admin app must point to the same API/database. For a driver app on a phone, use this PC's current LAN address on port 4000; the admin browser on this PC can use `http://localhost:4000`. Restart Expo after changing `EXPO_PUBLIC_API_BASE_URL`. Files selected only in registration preview mode are not uploaded. Trips, payments, support, and reports still use sample data.

## Support workspace

Open **Support** and select a ticket number or subject to view the conversation, customer details, related trip, device information, and attachments. **Reply to customer** opens conversation, internal-note, and activity tabs with draft saving, formatting, file attachments, suggested actions, and quick responses. **Assign** and **Escalate** open a drawer for agent/team routing, priority, tags, due dates, and an internal note. **Resolve ticket** records the resolution, customer communication, optional compensation, and survey preference, then updates the ticket list.

Support is a session-only preview using sample tickets. Saved drafts, replies, notes, assignment changes, attachments, and resolutions survive navigation within the signed-in session but reset on refresh or sign-out. Files remain in browser memory; no support messages, agent notifications, surveys, or payments are sent to external services.

## Commands

    npm run typecheck
    npm run lint
    npm run build
    npm run preview

Production files are generated in dist/. Keep node_modules/, dist/ and local environment files out of Git; commit the lockfile alongside the source.
