import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../app.json');
const config = JSON.parse(fs.readFileSync(appPath, 'utf8'));
const current = config.expo.android.versionCode;
const requested = process.env.REQUESTED_VERSION_CODE?.trim();
const runNumber = Number(process.env.GITHUB_RUN_NUMBER);
const versionCode = requested ? Number(requested) : current + runNumber;

if (!Number.isSafeInteger(versionCode) || versionCode <= current || versionCode > 2100000000) {
  throw new Error(`Android version code must be an integer greater than ${current} and at most 2100000000.`);
}
config.expo.android.versionCode = versionCode;
fs.writeFileSync(appPath, JSON.stringify(config, null, 2) + '\n');
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Android version code: ${versionCode}\n`);
}
console.log(`Android version code: ${versionCode}`);
