---
name: Expo Metro CORS in Replit
description: How to allow asset requests from the Replit proxy domain through Metro's CorsMiddleware in a dev build.
---

## The rule
Create `app.config.js` that reads `process.env.EXPO_ROUTER_ORIGIN` and passes it as the `origin` to the `expo-router` plugin. Set `EXPO_ROUTER_ORIGIN=https://$REPLIT_EXPO_DEV_DOMAIN` in the dev script.

**Why:** Metro's `CorsMiddleware` builds an `allowedHosts` list from `exp.extra.router.origin` (set by the expo-router plugin). Requests arriving from `*.expo.pike.replit.dev` fail the `isLocalhost` check and the `isSameOrigin` check (Host header is `localhost:PORT`), so Metro throws "Unauthorized request" and blocks asset loading. Adding the Replit expo domain to the allowed list fixes this.

**How to apply:** In `app.config.js`:
```js
const routerOrigin = process.env.EXPO_ROUTER_ORIGIN || 'https://replit.com/';
module.exports = {
  ...require('./app.json').expo,
  plugins: [
    ['expo-router', { origin: routerOrigin }],
    ...require('./app.json').expo.plugins.slice(1),
  ],
};
```
And in `package.json` dev script add: `EXPO_ROUTER_ORIGIN=https://$REPLIT_EXPO_DEV_DOMAIN`

Do NOT import `@expo/config-plugins` in `app.config.js` — EAS CLI resolves it from a different node_modules tree and will fail with "Cannot find module".
