const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

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

// Resolve the real (non-symlink) paths to the Clerk Android native-module specs.
// pnpm symlinks node_modules -> root .pnpm store, so Metro sees the real path.
function realClerkSpec(name) {
  const linked = path.join(
    projectRoot,
    'node_modules/@clerk/expo/dist/specs',
    name,
  );
  try {
    return fs.realpathSync(linked);
  } catch {
    return linked; // fallback – path didn't exist yet (first install)
  }
}

const ANDROID_TO_OPTIONAL = {
  [realClerkSpec('NativeClerkModule.android.js')]:
    realClerkSpec('NativeClerkModule.js'),
  [realClerkSpec('NativeClerkGoogleSignIn.android.js')]:
    realClerkSpec('NativeClerkGoogleSignIn.js'),
};

// On Android, @clerk/expo ships .android.js specs that call requireNativeModule
// (hard crash in Expo Go). Redirect them to the plain .js files that use
// requireOptionalNativeModule so the SDK degrades gracefully.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolution = context.resolveRequest(context, moduleName, platform);
  if (
    platform === 'android' &&
    resolution?.type === 'sourceFile' &&
    ANDROID_TO_OPTIONAL[resolution.filePath]
  ) {
    return { ...resolution, filePath: ANDROID_TO_OPTIONAL[resolution.filePath] };
  }
  return resolution;
};

module.exports = config;
