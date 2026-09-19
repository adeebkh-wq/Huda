---
name: EAS production environment variables
description: Which env vars must be set on expo.dev for EAS production builds to work — Replit env vars are NOT picked up by EAS at build time.
---

# EAS Production Environment Variables

## Rule
Replit shared env vars (`EXPO_PUBLIC_*`) are NOT available in EAS builds. Every `EXPO_PUBLIC_*` variable the app reads must be explicitly added to the EAS project's environment variables at https://expo.dev/accounts/adeebk/projects/huda/environment-variables.

**Why:** EAS builds run on Expo's servers, not Replit. Only variables set via `eas env:create` or the expo.dev dashboard (or literal values in `eas.json` `env`) are baked into the bundle.

## Currently set on EAS (production environment)
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key (pk_test_ or pk_live_)
- `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` — RevenueCat Android public key
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` — RevenueCat iOS public key
- `EXPO_PUBLIC_REVENUECAT_TEST_API_KEY` — RevenueCat test key

## How to add a new one
```bash
cd artifacts/huda
npx eas-cli env:create --environment production --name EXPO_PUBLIC_FOO --value "bar" --visibility plaintext --non-interactive
```

## How to check what's set
```bash
cd artifacts/huda && npx eas-cli env:list --environment production
```

**How to apply:** Before triggering any EAS production build, verify all required EXPO_PUBLIC_* vars are listed. Missing vars silently become `undefined` in the bundle.
