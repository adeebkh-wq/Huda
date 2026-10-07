const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Make Metro watch the entire pnpm workspace so it can bundle assets
// (fonts, images, etc.) from packages installed in the root node_modules.
config.watchFolders = [workspaceRoot];

// Let Metro find modules from both the artifact's own node_modules
// and the workspace root's node_modules (pnpm hoisted + .pnpm store).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
