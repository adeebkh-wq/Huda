/**
 * Colour-blind accessible theme overlays.
 *
 * Each theme is a partial override of the base light/dark palette.
 * applyColorTheme() merges the override on top of whatever base palette
 * useColors() resolved from the device colour scheme.
 *
 * Palette token overrides are kept minimal — only the tokens that
 * are perceptually ambiguous for the target vision type are changed.
 * All non-overridden tokens retain their default values so UI chrome
 * (backgrounds, text, borders) looks unchanged.
 *
 * Colour selections are based on the Okabe-Ito universal palette
 * (https://jfly.uni-koeln.de/color/) and WCAG 2.1 contrast guidelines.
 */

import type colors from './colors';

export type ColorTheme = 'default' | 'protanopia' | 'tritanopia' | 'highContrast';
export type TileSize = 'small' | 'medium' | 'large';

type Palette = typeof colors.light;
type PartialPalette = Partial<Palette>;

// ── Protanopia / Deuteranopia ─────────────────────────────────────────────────
// Red-green colour blindness (~8% of men, ~0.5% of women).
// Reds and greens appear as similar brownish/yellowish tones.
// Fix: replace reds with orange, greens with blue, keep blues/purples.
const PROTANOPIA: PartialPalette = {
  // Tile category colours
  tileCore:       '#E07B00', // orange-red  (was red   #E63946)
  tileAction:     '#0072B2', // royal blue  (was green  #2D9A57)
  tilePeople:     '#56B4E9', // sky blue    (was blue   #2B78BE — differentiated from tileAction)
  tileThing:      '#CC5500', // burnt sienna (was orange #E07B39 — deepened)
  tileDescriptor: '#E6B400', // amber       (was gold   #C98A1A)
  tileSocial:     '#CC79A7', // pink/rose   (was purple #7C4DBC)
  tileFood:       '#8B4513', // saddle-brown (was dark-orange #D4650A)
  tileEmotion:    '#009E73', // teal-green  (was pink-red    #D0457E)
  // Feelings
  feelingAngry:   '#E07B00', // orange instead of red
  feelingHappy:   '#E6B400', // amber-yellow (was orange-yellow)
};

// ── Tritanopia ────────────────────────────────────────────────────────────────
// Blue-yellow colour blindness (~0.01% of people, both sexes).
// Blues appear green; yellows appear pink/red.
// Fix: replace blues with pink, yellows with orange, keep reds/greens.
const TRITANOPIA: PartialPalette = {
  // Tile category colours
  tilePeople:     '#CC79A7', // rose/pink    (was blue   #2B78BE — blue looks green)
  tileDescriptor: '#D55E00', // red-orange   (was gold/yellow #C98A1A — yellow looks pink)
  tileSocial:     '#9B2C8D', // deep magenta (was blue-purple #7C4DBC)
  tileQuick:      '#D55E00', // red-orange   (was teal   #2A9D8F)
  primary:        '#D55E00',
  tint:           '#D55E00',
  speakButton:    '#D55E00',
  // Feelings
  feelingSad:     '#CC79A7', // rose  (was blue  #3B82F6)
  feelingCalm:    '#2D9A57', // green (was teal  #10B981)
  feelingScared:  '#D55E00', // orange (was blue-violet #8B5CF6)
};

// ── High Contrast ─────────────────────────────────────────────────────────────
// For users with low vision or in bright/glare environments.
// Dark background, white text, fully saturated tile colours.
const HIGH_CONTRAST: PartialPalette = {
  // Surfaces
  background:          '#0A0A0A',
  card:                '#111111',
  sentenceBar:         '#111111',
  // Text
  foreground:          '#FFFFFF',
  cardForeground:      '#FFFFFF',
  text:                '#FFFFFF',
  secondaryForeground: '#FFFFFF',
  accentForeground:    '#FFFFFF',
  mutedForeground:     '#CCCCCC',
  // Chrome
  muted:               '#222222',
  secondary:           '#1A1A1A',
  border:              '#555555',
  input:               '#333333',
  // Tile colours — fully saturated
  tileCore:            '#FF3333',
  tileAction:          '#00DD66',
  tilePeople:          '#3399FF',
  tileThing:           '#FF8800',
  tileDescriptor:      '#FFE000',
  tileSocial:          '#CC44FF',
  tileFood:            '#FF5500',
  tileEmotion:         '#FF2299',
  tileHome:            '#88BBDD',
  tileQuick:           '#00FFCC',
  // Primary / speak
  primary:             '#00FFCC',
  tint:                '#00FFCC',
  speakButton:         '#00FFCC',
  primaryForeground:   '#0A0A0A',
};

// ── Registry ──────────────────────────────────────────────────────────────────

const THEME_OVERRIDES: Record<ColorTheme, PartialPalette> = {
  default:      {},
  protanopia:   PROTANOPIA,
  tritanopia:   TRITANOPIA,
  highContrast: HIGH_CONTRAST,
};

/** Merge the colour-blind theme override on top of a resolved base palette. */
export function applyColorTheme<T extends Record<string, any>>(
  basePalette: T,
  theme: ColorTheme,
): T {
  const overrides = THEME_OVERRIDES[theme] ?? {};
  return { ...basePalette, ...overrides } as T;
}

/** Human-readable labels for each theme (English). */
export const COLOR_THEME_LABELS: Record<ColorTheme, string> = {
  default:      'Default',
  protanopia:   'Protanopia / Deuteranopia',
  tritanopia:   'Tritanopia',
  highContrast: 'High Contrast',
};

/** A representative swatch colour shown in the settings picker. */
export const COLOR_THEME_SWATCHES: Record<ColorTheme, string[]> = {
  default:      ['#E63946', '#2D9A57', '#2B78BE', '#E07B39'],
  protanopia:   ['#E07B00', '#0072B2', '#56B4E9', '#CC5500'],
  tritanopia:   ['#E63946', '#2D9A57', '#CC79A7', '#D55E00'],
  highContrast: ['#FF3333', '#00DD66', '#3399FF', '#FF8800'],
};
