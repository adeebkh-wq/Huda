---
name: Clerk v3 Expo reset password flow
description: Correct API for the forgot-password / reset-password flow in @clerk/expo v3; attemptFirstFactor does not exist on SignInFuture.
---

## Problem
`signIn.attemptFirstFactor()` is undefined in Clerk v3 Expo (`@clerk/expo` ≥ 3.x).
It was removed from `SignInFuture`. Calling it throws "undefined is not a function".

## Correct v3 reset password flow

```ts
// Step 1 — initiate (sends the OTP email)
await signIn.create({ strategy: 'reset_password_email_code', identifier: email });

// Step 2 — verify the OTP code
await (signIn as any).verifyResetPasswordEmailCode({ code });

// Step 3 — set the new password
await (signIn as any).submitResetPassword({ password: newPassword });

// Step 4 — create the session (same as normal sign-in)
if (signIn.status === 'complete') {
  await signIn.finalize({ navigate: () => {} });
  // let (auth)/_layout.tsx <Redirect> handle navigation — do NOT call router.replace here
}
```

**Why `as any`:** TypeScript types in `@clerk/expo` 3.7.x don't export `verifyResetPasswordEmailCode` /
`submitResetPassword` on the hook return type, but they exist at runtime (confirmed via
`@clerk/clerk-js@6.4.0` CDN type definitions).

## Navigation rule (applies to all auth flows)
Never call `router.replace()` manually after `finalize()`. The layout guards
(`(auth)/_layout.tsx` → `<Redirect href="/(tabs)" />` when `isSignedIn` is true,
`(tabs)/_layout.tsx` → `<Redirect href="/" />` when `isSignedIn` is false) are the sole
navigation triggers. Two competing navigations cause a white screen.

**Why:** Expo Router + Clerk state updates are async; calling `router.replace` while a
layout `<Redirect>` is also queued creates a race that renders a blank screen.
