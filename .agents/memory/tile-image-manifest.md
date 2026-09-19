---
name: Tile image manifest (static require)
description: How bundled tile images are pre-declared for Metro's static require() system
---

**Rule:** All bundled tile images are declared with static `require()` in `artifacts/huda/assets/tileImages.ts`. Metro cannot resolve dynamic `require('./tiles/' + key + '.jpg')` — every path must be a string literal at build time.

**Why:** Metro's bundler performs static analysis on require() calls. Dynamic paths are not supported.

**How to apply:** When adding new bundled tile images, add a new entry to `assets/tileImages.ts` with a static `require()`. Custom user images (from camera roll or downloaded) use `{ uri: string }` sources and bypass this system entirely — stored in AsyncStorage under `huda_tile_customizations`.
