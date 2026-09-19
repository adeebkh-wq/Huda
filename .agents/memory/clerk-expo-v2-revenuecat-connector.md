---
name: clerk-expo-v2 and RevenueCat connector patterns
description: @clerk/expo v3 native module issue, v2 downgrade, and RevenueCat connector path quirk for seed scripts
---

# @clerk/expo v3 → v2 downgrade

`@clerk/expo` v3.x ships a native module `ClerkExpo` that is NOT available in Expo Go.
Symptom: "Cannot find native module 'ClerkExpo'" at startup.

**Fix:** Downgrade to v2.x (`@clerk/expo@2.19.0` confirmed working with SDK 54 + Expo Go).

**API differences in v2:**
- No `@clerk/expo/token-cache` subpath — implement tokenCache manually using `expo-secure-store`.
- `useSignIn()` returns `{ signIn, setActive, isLoaded }`.
- Sign-in: `signIn.create({ identifier, password })` → check `.status === 'complete'` → `setActive({ session: createdSessionId })`.
- `useSignUp()` returns `{ signUp, setActive, isLoaded }`.
- Sign-up: `signUp.create({ emailAddress, password })` → `signUp.prepareEmailAddressVerification({ strategy: 'email_code' })` → `signUp.attemptEmailAddressVerification({ code })` → `setActive({ session: createdSessionId })`.
- `useAuth()`, `useUser()`, `useClerk()` — same interface as v3.

**Why:** Replit's Expo Go–based preview can't run native modules that require a custom dev client build.

**How to apply:** Whenever installing @clerk/expo, pin to `~2.19.0` until a Expo Go-compatible v3 is available.

---

# RevenueCat Connector path convention

The Replit RevenueCat connector's base URL is `https://api.revenuecat.com` (without `/v2`).

When using a custom `fetch` inside `createClient({ baseUrl: "https://api.revenuecat.com/v2", fetch: customFetch })`:
- The full URL passed to customFetch is `https://api.revenuecat.com/v2/projects?...`
- Strip `"https://api.revenuecat.com"` (NOT `"/v2"`) to get `/v2/projects?...`
- Pass that path to `connectors.proxy("revenuecat", path, { method })`

**Why:** Connector adds its own domain prefix; the path you pass must include the `/v2` segment.

---

# hey-api createClient custom fetch

The hey-api `createClient` (used by `@replit/revenuecat-sdk`) passes a `Request` object to the custom fetch function, not a plain string.

Extract the URL with `(input as Request).url`, NOT `input.toString()` (which yields `"[object Request]"`).

Also extract method and body from the `Request` object when `init` is not provided.
