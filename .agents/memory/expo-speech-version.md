---
name: expo-speech version pinning
description: expo-speech version compatibility with Expo SDK 54
---

**Rule:** Expo SDK 54 requires `expo-speech@^14.0.8`. Running `pnpm add expo-speech` without a version installs the latest (v57+) which is incompatible and causes a Metro watcher ENOENT crash.

**Why:** pnpm resolves to the latest published version; Expo SDK version pinning is not automatic via pnpm (unlike `npx expo install`).

**How to apply:** Always install with an explicit major: `pnpm add expo-speech@14`. Same rule applies to other Expo packages — check `expo doctor` output for expected versions.
