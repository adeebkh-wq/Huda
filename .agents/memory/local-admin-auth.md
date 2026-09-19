---
name: Device-only local caregiver admin
description: Security and routing rules for Huda's email-free local caregiver account.
---

Huda supports a device-only caregiver admin alongside Clerk. The local profile stores only a caregiver name, random salt, and SHA-256 PIN hash in SecureStore; its session flag is local and never sent to Clerk, RevenueCat, or the API.

**Why:** Caregivers need an email-free offline option without weakening or replacing cloud account and subscription flows. The previous built-in `9999` admin passcode was an insecure bypass and must not return.

**How to apply:** Route guards may admit either an authenticated Clerk session or an authenticated local-admin session. Cloud-only features must continue to require Clerk identity. Do not add a universal default PIN or store a plaintext PIN.