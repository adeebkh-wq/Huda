---
name: Expo web audio — bypass expo-av with HTMLAudioElement
description: How to make audio play on web in an Expo/React Native app without autoplay policy failures.
---

## The rule
On web, bypass expo-av entirely. Use HTMLAudioElement directly. Pre-resolve all asset URIs on component mount (in a useEffect), then call `audio.play()` as the first synchronous operation inside the user-gesture handler — no awaits before it.

**Why:** Browser autoplay policy requires `.play()` to be called within (or very close to) the user gesture call stack. expo-av's web implementation goes: `createAsync → getNativeSourceAndFullInitialStatusForLoadAsync → asset.downloadAsync() → new Audio(src) → media.play()`. The multiple awaits (especially `asset.downloadAsync`) break the gesture context on most browsers. This causes `.play()` to throw a `NotAllowedError` silently and audio never starts.

**How to apply:**
```tsx
// 1. Pre-resolve URIs on mount (async is OK here, no user gesture yet)
const webAudioRef = useRef<HTMLAudioElement | null>(null);
const [webUrls, setWebUrls] = useState<Record<string, string>>({});

useEffect(() => {
  if (Platform.OS !== 'web') return;
  Promise.all(sounds.map(async (s) => {
    const asset = Asset.fromModule(s.source);
    await asset.downloadAsync();
    return [s.id, asset.uri] as [string, string];
  })).then((pairs) => {
    const map: Record<string, string> = {};
    pairs.forEach(([id, uri]) => { map[id] = uri; });
    setWebUrls(map);
  });
}, []);

// 2. In play callback — NO awaits before audio.play()
if (Platform.OS === 'web') {
  const prev = webAudioRef.current;
  webAudioRef.current = null;
  if (prev) { prev.pause(); prev.src = ''; }

  const url = webUrls[sound.id];
  if (!url) return; // not yet resolved

  const el = new (window as any).Audio() as HTMLAudioElement;
  el.src = url; el.loop = isLooping; el.volume = volume;
  webAudioRef.current = el;
  el.play().catch(console.error); // call is synchronous, Promise resolves async
  return;
}
```

## expo-file-system v19 legacy import
expo-file-system v19 moved `cacheDirectory`, `getInfoAsync`, `downloadAsync`, `copyAsync` to a legacy sub-path. Import as:
```ts
import * as FileSystem from 'expo-file-system/legacy';
```
The default import (`expo-file-system`) only exports the new File/Directory class API plus deprecated stubs that throw at runtime.
