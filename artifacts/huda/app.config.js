/**
 * Dynamic Expo config — overrides app.json with runtime environment values.
 *
 * Why this exists:
 *   expo-router's `origin` setting is added to `exp.extra.router.origin` and
 *   used by the Expo CLI CorsMiddleware to build its allowedHosts list. In the
 *   Replit preview the requests arrive from the *.expo.pike.replit.dev subdomain
 *   which is different from localhost, so Metro rejects them unless that domain
 *   is explicitly allowed. We inject it here via EXPO_ROUTER_ORIGIN so the dev
 *   server accepts asset requests from the Replit proxy.
 */

// Pull base config from app.json (all static values live there).
const appJson = require('./app.json');
const base = appJson.expo;

// Build the expo-router origin: prefer the env-injected Replit expo domain,
// fall back to the hardcoded value so production builds are unaffected.
const routerOrigin = process.env.EXPO_ROUTER_ORIGIN || 'https://replit.com/';

module.exports = {
  ...base,
  plugins: [
    ['expo-router', { origin: routerOrigin }],
    // Keep all other plugins from app.json (skip the first expo-router entry).
    ...base.plugins.slice(1),
  ],
};
