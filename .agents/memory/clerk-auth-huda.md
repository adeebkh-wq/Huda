---
name: Clerk auth + device sessions in Huda
description: How Clerk auth and one-device enforcement are wired in Huda and the API server.
---

## Architecture

- **ClerkProvider** wraps the root layout at `app/_layout.tsx`. Uses `@clerk/expo/token-cache` (expo-secure-store) for session persistence.
- **EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY** is set in the dev script via `$CLERK_PUBLISHABLE_KEY` (the secret).
- Auth screens live at `app/(auth)/sign-in.tsx` and `app/(auth)/sign-up.tsx` — custom UI, no native Clerk components (incompatible with Expo Go).
- Welcome/intro screen at `app/index.tsx` — shown to unauthenticated users; redirects signed-in users to `/(tabs)`.
- `app/(auth)/_layout.tsx` — redirects signed-in users to `/(tabs)`.
- `app/(tabs)/_layout.tsx` — redirects unauthenticated users to `/` (welcome screen).

## API Server (Clerk + device sessions)

- `@clerk/express` middleware added to `app.ts`; uses `publishableKeyFromHost` + `getClerkProxyHost` from the proxy middleware.
- Clerk proxy middleware mounted at `/api/__clerk` (before body parsers).
- Device session routes at `POST /api/device/register` and `GET /api/device/check`.
- DB table `device_sessions` (user_id UNIQUE) — one active device per user; register overwrites the previous device.
- Drizzle schema at `lib/db/src/schema/device-sessions.ts`.

## One-device enforcement flow (app side — TO BE BUILT)

- On sign-in, call `POST /api/device/register` with a stable device ID (UUID stored in AsyncStorage).
- On app resume, call `GET /api/device/check`. If `isActive: false`, sign the user out and show a "signed in on another device" message.

## Caregiver PIN vs Clerk

- Clerk = primary account login (caregiver identity, subscription).
- PIN = quick re-lock of the caregiver dashboard so children can't access settings. These coexist.

## Donations removed

- `donationUrl`, `setDonationUrl`, `DONATION_URL_KEY` removed from `CaregiverContext.tsx`.
- Donation card removed from `caregiver/index.tsx`.
- "Support Huda" section and admin panel removed from `caregiver/settings.tsx`.

**Why:** App moved to a subscription model; donation prompts replaced by account-gated access.
