---
name: Tile size & colour-blind theme settings
description: How tile grid density and colour-blind palette overrides are wired together.
---

## Tile Size

Setting: `CaregiverSettings.tileSize: 'small' | 'medium' | 'large'` (persisted in `huda_settings`)

`TileGrid.tsx` reads `settings.tileSize` from `useCaregiver()` and applies a column offset:
- small  → +1 column (more tiles per row, physically smaller)
- medium → no change (default)
- large  → -1 column (fewer tiles per row, physically bigger)
- min 2 cols, max 10 cols enforced

**Why:** changing the base column count from `computeLayout(width)` is simpler than a scaling multiplier — tiles fill available space naturally without gaps.

## Colour-Blind Themes

Setting: `CaregiverSettings.colorTheme: 'default' | 'protanopia' | 'tritanopia' | 'highContrast'`

Theme overrides defined in `constants/colorThemes.ts` → `applyColorTheme(basePalette, theme)`.

`hooks/useColors.ts` reads `CaregiverContext` via `useContext` (null-safe, no throw) and applies the overlay on top of the light/dark palette. Safe to call outside `CaregiverProvider`.

`CaregiverContext` is now exported (not just the hook) so `useColors` can access it with `useContext`.

**Why:** reading via `useContext` with a null-check (not `useCaregiver()`) prevents crashes in the rare case where a component renders outside the provider tree (e.g. missing-config splash screen).

Removed: `highContrast: boolean` field from `CaregiverSettings` — folded into `colorTheme: 'highContrast'`.
