/**
 * Built-in calming sounds for the Sensory Music screen.
 *
 * All built-in tracks are generated ambient audio bundled locally with Metro
 * so playback works fully offline with no network dependency.
 * Custom user-added sounds use a `uri` field (remote URL or local file).
 */

import CALM_SOUND_ASSETS from '@/assets/sounds/calm';

export interface CalmingSound {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  /**
   * For built-in sounds: Metro require() asset (from CALM_SOUND_ASSETS).
   * Either source or uri must be present.
   */
  source?: any;
  /**
   * For custom user-added sounds: remote URL or local file URI.
   */
  uri?: string;
  /** Whether to loop. Default true. */
  loop?: boolean;
  /** True for user-added custom sounds. */
  custom?: boolean;
}

/** Built-in calming sounds — ordered by expected preference. */
export const BUILT_IN_SOUNDS: CalmingSound[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Soft rainfall on a quiet afternoon',
    icon: 'rainy-outline',
    color: '#4A90D9',
    source: CALM_SOUND_ASSETS.rain,
    loop: true,
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Rhythmic waves rolling onto the shore',
    icon: 'water-outline',
    color: '#1976D2',
    source: CALM_SOUND_ASSETS.ocean,
    loop: true,
  },
  {
    id: 'forest',
    name: 'Forest Birds',
    description: 'Morning birdsong in a peaceful forest',
    icon: 'leaf-outline',
    color: '#388E3C',
    source: CALM_SOUND_ASSETS.forest,
    loop: true,
  },
  {
    id: 'fire',
    name: 'Crackling Fire',
    description: 'A warm, cozy campfire',
    icon: 'flame-outline',
    color: '#E64A19',
    source: CALM_SOUND_ASSETS.fire,
    loop: true,
  },
  {
    id: 'stream',
    name: 'Babbling Stream',
    description: 'A gentle brook flowing over pebbles',
    icon: 'git-branch-outline',
    color: '#00897B',
    source: CALM_SOUND_ASSETS.stream,
    loop: true,
  },
  {
    id: 'wind',
    name: 'Gentle Wind',
    description: 'A soft breeze through the trees',
    icon: 'cloudy-outline',
    color: '#546E7A',
    source: CALM_SOUND_ASSETS.wind,
    loop: true,
  },
  {
    id: 'whitenoise',
    name: 'White Noise',
    description: 'Steady white noise for focus and calm',
    icon: 'radio-outline',
    color: '#455A64',
    source: CALM_SOUND_ASSETS.whitenoise,
    loop: true,
  },
  {
    id: 'bowls',
    name: 'Singing Bowls',
    description: 'Tibetan bowls for deep, grounding calm',
    icon: 'ellipse-outline',
    color: '#7B1FA2',
    source: CALM_SOUND_ASSETS.bowls,
    loop: true,
  },
  {
    id: 'piano',
    name: 'Soft Piano',
    description: 'Gentle harmonics to settle the mind',
    icon: 'musical-notes-outline',
    color: '#C2185B',
    source: CALM_SOUND_ASSETS.piano,
    loop: true,
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    description: 'Distant thunder and rolling rain',
    icon: 'thunderstorm-outline',
    color: '#5C6BC0',
    source: CALM_SOUND_ASSETS.thunderstorm,
    loop: true,
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    description: 'Rushing water tumbling over rocks',
    icon: 'waves-outline',
    color: '#0097A7',
    source: CALM_SOUND_ASSETS.waterfall,
    loop: true,
  },
  {
    id: 'crickets',
    name: 'Night Crickets',
    description: 'Peaceful summer night with crickets and frogs',
    icon: 'bug-outline',
    color: '#558B2F',
    source: CALM_SOUND_ASSETS.crickets,
    loop: true,
  },
  {
    id: 'brownnoise',
    name: 'Brown Noise',
    description: 'Deep, warm noise for focus and sleep',
    icon: 'radio-outline',
    color: '#6D4C41',
    source: CALM_SOUND_ASSETS.brownnoise,
    loop: true,
  },
  {
    id: 'coffeeshop',
    name: 'Coffee Shop',
    description: 'Gentle café murmur and clinking cups',
    icon: 'cafe-outline',
    color: '#8D6E63',
    source: CALM_SOUND_ASSETS.coffeeshop,
    loop: true,
  },
  {
    id: 'healingtone',
    name: '432 Hz Healing',
    description: '432 Hz tone with soft harmonics for deep calm',
    icon: 'sparkles-outline',
    color: '#AB47BC',
    source: CALM_SOUND_ASSETS.healingtone,
    loop: true,
  },
];
