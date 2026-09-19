---
name: Huda is fully free with no payment integration
description: Product decision that Huda must not contain subscriptions, paywalls, billing SDKs, or purchase UI.
---

Huda is a fully free app. Do not add subscriptions, paywalls, trials, purchase restoration, billing permissions, RevenueCat, or another payment provider unless the user explicitly reverses this decision.

**Why:** The user requested removal of all payment options after Google Play identified the app as offering in-app purchases.

**How to apply:** New features must remain available without payment checks. Before Android releases, confirm the dependency tree and generated app configuration contain no billing SDK or paywall route.