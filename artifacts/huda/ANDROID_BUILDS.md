# Android builds in GitHub

Open this repository's **Actions → Android APK and AAB → Run workflow**.
Each run creates a standalone APK and an Android App Bundle. Download them
from the run's **Artifacts** section once the build succeeds.

The workflow uses the checked-in Expo SDK and pnpm lockfile. Native files are
generated only on GitHub's runner; Huda AAC remains a managed Expo project.
JavaScript, tile images, sounds, and the native therapy videos are bundled.
It does not require Expo account authentication or upload anything to Google Play.

## Signing

Without upload-key secrets, the APK uses Android's test signing key and the
AAB is **unsigned**, not ready for Google Play.

For store-ready builds, configure all four repository **Actions secrets**:

- `ANDROID_KEYSTORE_BASE64`: the existing upload keystore, base64-encoded.
- `ANDROID_KEYSTORE_PASSWORD`: that keystore's password.
- `ANDROID_KEY_ALIAS`: the existing upload key alias.
- `ANDROID_KEY_PASSWORD`: that key's password.

Configure these only in GitHub's secure secret settings, never in chat or
source files. Use the existing upload key for an already-published app.
The workflow fails explicitly if signing is only partially configured.

**Do not uninstall an existing Huda AAC installation to fix a test-key mismatch.**
Uninstalling removes its local boards, recordings, and settings.

## Version codes and optional online features

By default the build uses the source version code plus this workflow's run
number. For Google Play, enter a version code greater than your last uploaded
version in **Run workflow**; runs from other systems may use a higher number.

If online image search needs the hosted API, set repository Actions variables
`EXPO_PUBLIC_DOMAIN` and `EXPO_PUBLIC_REPL_ID` to the appropriate public values.
Do not place private API keys in `EXPO_PUBLIC_*` variables. Huda AAC's local boards,
recordings, sounds, and therapy videos do not require an account or this API.
