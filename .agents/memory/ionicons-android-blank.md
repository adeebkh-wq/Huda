---
name: Ionicons blank on Android
description: Font-based @expo/vector-icons icons render blank on Android in Expo Go SDK 54. Root cause and fix.
---

## The Problem
`@expo/vector-icons` Ionicons (and any font-based icon set) renders blank glyphs on Android in Expo Go SDK 54 / React Native 0.77+. The font loads successfully (JS cache + `getLoadedFonts()` both confirm it), but Android's text renderer does not display Private Use Area (PUA) Unicode glyphs from dynamically-loaded custom fonts. This is a known Android limitation — not a font-loading bug.

**Why:** Android's font fallback chain can bypass a custom-registered font for PUA code points (0xF100–0xF4FF used by icon fonts), rendering nothing instead of the glyph. The issue is exacerbated by React Native's new architecture (Fabric) on Expo Go SDK 54.

## The Fix
Replace all `@expo/vector-icons` imports with **SVG-based icons** via `lucide-react-native`. SVG icons don't require any font loading and render correctly on all platforms.

**How to apply:**
1. `pnpm --filter @workspace/huda add lucide-react-native` (`react-native-svg` must already be installed)
2. Create `components/IoniconsSVG.tsx` — a shim that exports `Ionicons` backed by Lucide SVG components with a mapping from Ionicons name strings to Lucide components
3. Change every `import { Ionicons } from '@expo/vector-icons'` → `import { Ionicons } from '@/components/IoniconsSVG'`
4. For `Feather` or other icon sets: import Lucide icons directly (e.g. `AlertCircle`, `X`)
5. Remove `ionicons: require('../assets/fonts/Ionicons.ttf')` from `useFonts` in `_layout.tsx`

**Lucide export name gotcha:** `fingerprint-pattern.js` is exported from the CJS bundle as `Fingerprint` (not `FingerprintPattern` as the d.ts says). Import as `Fingerprint as FingerprintIcon`.

## Mapping gotchas
- `icon: 'sync'` in games data → `RefreshCw`
- `icon: 'ellipse'` in games data → `Circle`
- `icon: 'flash'` in board tabs data → `Zap`
- `icon: 'apps-outline'` in boards data → `LayoutGrid`
- Lucide `Image` conflicts with React Native's `Image` — import as `Image as ImageIcon`
- Unknown icon names fall through to `Circle` as a safe placeholder
