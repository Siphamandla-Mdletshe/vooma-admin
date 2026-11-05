# Vooma Admin

Standalone admin web application. This folder is independent of `vooma-driver-app`: it has its own dependencies, brand tokens and build. No Expo or React Native installation is required.

## Run locally

Use Node.js 22.12+ (Node 24 recommended) and npm.

```sh
npm install
npm run dev
```

Open http://localhost:5173. The login screen is the entry page. Choose **Explore demo dashboard** to view the screens. **Sign out** in the top-right account menu returns to login and resets the sample session.

## Commands

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

Production files are generated in `dist/`. Navigation uses hashes, such as `/#drivers`. Direct links start at login and continue to that section when entering the demo.

## Screens and behaviour

Includes login, dashboard, drivers and driver details, passengers, vehicle verification, trips, payments, support, reports and settings. The dashboard uses the reference collage's navy navigation, blue controls, compact tables, and white cards. Shared Vooma brand colours remain in `src/brand/tokens.json`. The responsive dashboard supports vertical scrolling, a sticky navigation bar and a collapsible mobile sidebar.

The reference totals use deterministic January 2025 demo datasets, with working search, status/city/date filters, and ten-row pagination. The dashboard revenue and trend charts are illustrative. Avatar and vehicle imagery is recreated; generation details are in `docs/dashboard-assets.md`. Driver messages save only within the demo flow.

All records are synthetic. Search, filters, profile reviews and status updates operate on local sample data. Changes reset on refresh or sign-out. Login validates email and password fields but admin authentication is not connected; credentials are neither transmitted nor persisted. Connect admin authentication, role-based authorization and backend APIs before operational use.

## Repository

This directory can be published as its own repository, named `vooma-admin`. No remote is configured and nothing has been published. Keep `node_modules/`, `dist/` and local environment files out of Git; commit the lockfile alongside the source.
