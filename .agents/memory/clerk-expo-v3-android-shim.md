---
name: clerk-expo v3 Android native module shim
description: How to make @clerk/expo v3 work in Expo Go on Android without the ClerkExpo native module
---

## Problem
`@clerk/expo` ships two versions of its native module specs:
- `dist/specs/NativeClerkModule.android.js` → uses `requireNativeModule("ClerkExpo")` (hard crash if missing)
- `dist/specs/NativeClerkModule.js` → uses `requireOptionalNativeModule("ClerkExpo")` (returns null safely)

Same pattern for `NativeClerkGoogleSignIn`. On Android Expo Go, Metro picks up the `.android.js` file which hard-crashes because the ClerkExpo native module doesn't exist in Expo Go.

`@clerk/expo` v2.19.0 is NOT a fix — it depends on `@clerk/react@5.x` which calls `loadClerkUiScript` (a DOM-only function) and crashes in React Native.

## Fix: Metro resolver override

In `metro.config.js`, intercept the resolved file path for the two Android specs and redirect to the non-Android optional versions:

```js
const clerkSpecsDir = path.join(__dirname, 'node_modules/@clerk/expo/dist/specs');
const hardNativeAndroidFiles = {
  [path.join(clerkSpecsDir, 'NativeClerkModule.android.js')]:
    path.join(clerkSpecsDir, 'NativeClerkModule.js'),
  [path.join(clerkSpecsDir, 'NativeClerkGoogleSignIn.android.js')]:
    path.join(clerkSpecsDir, 'NativeClerkGoogleSignIn.js'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolution = context.resolveRequest(context, moduleName, platform);
  if (
    platform === 'android' &&
    resolution?.type === 'sourceFile' &&
    hardNativeAndroidFiles[resolution.filePath]
  ) {
    return { ...resolution, filePath: hardNativeAndroidFiles[resolution.filePath] };
  }
  return resolution;
};
```

`context.resolveRequest` calls the default resolver (not the custom function), so no infinite recursion.

**Why:** All ClerkExpo usages in the v3 dist already null-check the module (`if (!ClerkExpo?.getClientToken) return null`), so graceful degradation works fine without the native module. Only the spec import itself is the hard point.

## v3 API changes (vs v2)
- `useSignUp()` → `{ signUp, errors, fetchStatus }` (no `setActive`, no `isLoaded`)
- Sign up: `signUp.password({ emailAddress, password })` (was `signUp.create(...)`)
- Send code: `signUp.verifications.sendEmailCode()` (was `prepareEmailAddressVerification`)
- Verify: `signUp.verifications.verifyEmailCode({ code })` (was `attemptEmailAddressVerification`)
- Finalize: `signUp.finalize({ navigate: ... })` (was `setActive({ session: createdSessionId })`)
- `useSignIn()` → same pattern, `signIn.password()`, `signIn.finalize()`
- `tokenCache` now importable from `@clerk/expo/token-cache` (no manual SecureStore impl needed)
- `ClerkLoaded` should wrap app content inside `ClerkProvider`
- Sign-up form must include `<View nativeID="clerk-captcha" />` for Clerk bot protection

## Layout setup (v3 canonical)
```tsx
import { ClerkProvider, ClerkLoaded } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';

<ClerkProvider publishableKey={key} tokenCache={tokenCache}>
  <ClerkLoaded>
    {/* app content */}
  </ClerkLoaded>
</ClerkProvider>
```
