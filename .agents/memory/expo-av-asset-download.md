---
name: expo-av asset download in Expo Go
description: How to correctly load bundled audio assets for expo-av on Android in Expo Go SDK 54
---

## Rule
Never use `Asset.fromModule(n).localUri` as the source for expo-av on Android in Expo Go.
Use `Asset.fromModule(n).uri` (the Metro HTTP URL) with `FileSystem.downloadAsync(uri, dest)` to a path that has the correct audio extension (e.g. `.wav`).

**Why:** In Expo Go SDK 54 on Android, `Asset.downloadAsync()` writes a ~240-byte metadata stub to `localUri`, not the actual binary file. ExoPlayer receives this stub, cannot detect the audio format, and throws "None of the available extractors could read the stream." This happens regardless of whether you pass the `require()` number directly or resolve through `Asset.fromModule` — the underlying native code hits the same stale cache.

**How to apply:**
```typescript
const asset = Asset.fromModule(sound.source); // sound.source is a require() number
const httpUri = asset.uri;                    // always the Metro HTTP URL — real binary
const dest = `${FileSystem.cacheDirectory}myapp_${sound.id}.wav`;
const info = await FileSystem.getInfoAsync(dest);
if (!info.exists || (info as any).size < 1024) {
  await FileSystem.downloadAsync(httpUri, dest);
}
// now play from dest — ExoPlayer sees .wav extension + real binary
const { sound: avSound } = await Audio.Sound.createAsync({ uri: dest }, { shouldPlay: true, ... });
```

Cache check: re-download if the file is missing or smaller than 1 KB (catches the stale stub case without re-downloading on every play).
