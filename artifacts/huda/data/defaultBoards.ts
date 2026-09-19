export type IconLib = 'Ionicons';

export interface Tile {
  id: string;
  label: string;
  icon: string;
  iconLib: IconLib;
  color: string;
  boardId: string;
  imageKey?: string;      // key into TILE_IMAGES (bundled asset)
  imageUri?: string;      // local URI — custom photo or downloaded image
  audioUri?: string;      // local URI — recorded audio (overrides TTS)
  isCustom?: boolean;
}

export interface Board {
  id: string;
  name: string;
  icon: string;
  tiles: Tile[];
}

export const TILE_COLORS = {
  core: '#E63946',
  action: '#2D9A57',
  people: '#2B78BE',
  thing: '#E07B39',
  descriptor: '#C98A1A',
  social: '#7C4DBC',
  food: '#D4650A',
  emotion: '#D0457E',
  home: '#526475',
  quick: '#2A9D8F',
} as const;

// ─── Alphabet tiles (A–Z) ────────────────────────────────────────────────────
export const ALPHA_PALETTE = [
  '#E63946', '#2A9D8F', '#E07B39', '#2B78BE', '#7C4DBC',
  '#2D9A57', '#D0457E', '#C98A1A', '#526475', '#D4650A',
];
const alphabetTiles: Tile[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => ({
  id: `alpha-${letter.toLowerCase()}`,
  label: letter,
  icon: 'text',
  iconLib: 'Ionicons' as IconLib,
  color: ALPHA_PALETTE[i % ALPHA_PALETTE.length],
  boardId: 'alphabet',
}));

// ─── Number tiles (0–9 + common milestones) ───────────────────────────────────
const NUM_DATA: { label: string; icon: string }[] = [
  { label: '0',   icon: 'ellipse-outline'         },
  { label: '1',   icon: 'finger-print'            },
  { label: '2',   icon: 'list'                    },
  { label: '3',   icon: 'triangle'                },
  { label: '4',   icon: 'grid'                    },
  { label: '5',   icon: 'hand-right'              },
  { label: '6',   icon: 'dice'                    },
  { label: '7',   icon: 'star'                    },
  { label: '8',   icon: 'infinite'                },
  { label: '9',   icon: 'cloudy-night'            },
  { label: '10',  icon: 'calculator'              },
  { label: '20',  icon: 'podium'                  },
  { label: '50',  icon: 'trophy'                  },
  { label: '100', icon: 'ribbon'                  },
];
const NUM_PALETTE = [
  '#E63946', '#2B78BE', '#2D9A57', '#E07B39', '#7C4DBC',
  '#D0457E', '#2A9D8F', '#C98A1A', '#526475', '#D4650A',
  '#E63946', '#2B78BE', '#2D9A57', '#7C4DBC',
];
const numberTiles: Tile[] = NUM_DATA.map(({ label, icon }, i) => ({
  id: `num-${label}`,
  label,
  icon,
  iconLib: 'Ionicons' as IconLib,
  color: NUM_PALETTE[i],
  boardId: 'numbers',
}));

export const DEFAULT_BOARDS: Board[] = [
  // ── Core ──────────────────────────────────────────────────────────────────
  {
    id: 'core',
    name: 'Core',
    icon: 'star',
    tiles: [
      { id: 'core-want',   label: 'Want',       icon: 'hand-right',            iconLib: 'Ionicons', color: TILE_COLORS.core,    boardId: 'core', imageKey: 'want'  },
      { id: 'core-more',   label: 'More',       icon: 'add-circle',            iconLib: 'Ionicons', color: TILE_COLORS.core,    boardId: 'core', imageKey: 'more'  },
      { id: 'core-go',     label: 'Go',         icon: 'arrow-forward-circle',  iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'core', imageKey: 'go'    },
      { id: 'core-stop',   label: 'Stop',       icon: 'stop-circle',           iconLib: 'Ionicons', color: TILE_COLORS.core,    boardId: 'core', imageKey: 'stop'  },
      { id: 'core-help',   label: 'Help',       icon: 'help-circle',           iconLib: 'Ionicons', color: TILE_COLORS.social,  boardId: 'core', imageKey: 'help'  },
      { id: 'core-yes',    label: 'Yes',        icon: 'checkmark-circle',      iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'core', imageKey: 'yes'   },
      { id: 'core-no',     label: 'No',         icon: 'close-circle',          iconLib: 'Ionicons', color: TILE_COLORS.core,    boardId: 'core', imageKey: 'no'    },
      { id: 'core-i',      label: 'I',          icon: 'person',                iconLib: 'Ionicons', color: TILE_COLORS.people,  boardId: 'core', imageKey: 'i'     },
      { id: 'core-you',    label: 'You',        icon: 'person-outline',        iconLib: 'Ionicons', color: TILE_COLORS.people,  boardId: 'core', imageKey: 'you'   },
      { id: 'core-like',   label: 'Like',       icon: 'heart',                 iconLib: 'Ionicons', color: TILE_COLORS.emotion, boardId: 'core', imageKey: 'like'  },
      { id: 'core-play',   label: 'Play',       icon: 'game-controller',       iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'core', imageKey: 'play'  },
      { id: 'core-eat',    label: 'Eat',        icon: 'restaurant',            iconLib: 'Ionicons', color: TILE_COLORS.food,    boardId: 'core', imageKey: 'eat'   },
      { id: 'core-drink',  label: 'Drink',      icon: 'water',                 iconLib: 'Ionicons', color: TILE_COLORS.food,    boardId: 'core', imageKey: 'drink' },
      { id: 'core-sleep',  label: 'Sleep',      icon: 'moon',                  iconLib: 'Ionicons', color: TILE_COLORS.home,    boardId: 'core', imageKey: 'sleep' },
      { id: 'core-done',   label: 'Done',       icon: 'checkmark-done-circle', iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'core', imageKey: 'done'  },
      { id: 'core-nolike', label: "Don't Like", icon: 'heart-dislike',         iconLib: 'Ionicons', color: TILE_COLORS.core,    boardId: 'core'                    },
    ],
  },

  // ── People ────────────────────────────────────────────────────────────────
  {
    id: 'people',
    name: 'People',
    icon: 'people',
    tiles: [
      { id: 'ppl-mom',     label: 'Mom',     icon: 'woman',          iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people', imageKey: 'mom' },
      { id: 'ppl-dad',     label: 'Dad',     icon: 'man',            iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people', imageKey: 'dad' },
      { id: 'ppl-teacher', label: 'Teacher', icon: 'school',         iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people' },
      { id: 'ppl-friend',  label: 'Friend',  icon: 'people',         iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people' },
      { id: 'ppl-doctor',  label: 'Doctor',  icon: 'medkit',         iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people' },
      { id: 'ppl-baby',    label: 'Baby',    icon: 'happy',          iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people' },
      { id: 'ppl-we',      label: 'We',      icon: 'people-circle',  iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people' },
      { id: 'ppl-they',    label: 'They',    icon: 'people-outline', iconLib: 'Ionicons', color: TILE_COLORS.people, boardId: 'people' },
    ],
  },

  // ── Food ──────────────────────────────────────────────────────────────────
  {
    id: 'food',
    name: 'Food',
    icon: 'restaurant',
    tiles: [
      { id: 'food-water',  label: 'Water',     icon: 'water',      iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food', imageKey: 'water' },
      { id: 'food-milk',   label: 'Milk',      icon: 'cafe',       iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food', imageKey: 'milk'  },
      { id: 'food-juice',  label: 'Juice',     icon: 'beaker',     iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-apple',  label: 'Apple',     icon: 'nutrition',  iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food', imageKey: 'apple' },
      { id: 'food-banana', label: 'Banana',    icon: 'leaf',       iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-bread',  label: 'Bread',     icon: 'pizza',      iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-cereal', label: 'Cereal',    icon: 'grid',       iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-cookie', label: 'Cookie',    icon: 'happy',      iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-chips',  label: 'Chips',     icon: 'flame',      iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-rice',   label: 'Rice',      icon: 'restaurant', iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-egg',    label: 'Egg',       icon: 'ellipse',    iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
      { id: 'food-more',   label: 'More Food', icon: 'add',        iconLib: 'Ionicons', color: TILE_COLORS.food, boardId: 'food' },
    ],
  },

  // ── School ────────────────────────────────────────────────────────────────
  {
    id: 'school',
    name: 'School',
    icon: 'school',
    tiles: [
      { id: 'school-book',     label: 'Book',      icon: 'book',          iconLib: 'Ionicons', color: TILE_COLORS.thing,   boardId: 'school', imageKey: 'book' },
      { id: 'school-write',    label: 'Write',     icon: 'pencil',        iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'school' },
      { id: 'school-read',     label: 'Read',      icon: 'reader',        iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'school' },
      { id: 'school-math',     label: 'Math',      icon: 'calculator',    iconLib: 'Ionicons', color: TILE_COLORS.thing,   boardId: 'school' },
      { id: 'school-art',      label: 'Art',       icon: 'color-palette', iconLib: 'Ionicons', color: TILE_COLORS.emotion, boardId: 'school' },
      { id: 'school-music',    label: 'Music',     icon: 'musical-notes', iconLib: 'Ionicons', color: TILE_COLORS.social,  boardId: 'school' },
      { id: 'school-computer', label: 'Computer',  icon: 'laptop',        iconLib: 'Ionicons', color: TILE_COLORS.thing,   boardId: 'school' },
      { id: 'school-bathroom', label: 'Bathroom',  icon: 'man',           iconLib: 'Ionicons', color: TILE_COLORS.home,    boardId: 'school' },
      { id: 'school-lunch',    label: 'Lunch',     icon: 'restaurant',    iconLib: 'Ionicons', color: TILE_COLORS.food,    boardId: 'school' },
      { id: 'school-play',     label: 'Recess',    icon: 'football',      iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'school' },
      { id: 'school-done',     label: 'Finished',  icon: 'checkmark-done',iconLib: 'Ionicons', color: TILE_COLORS.action,  boardId: 'school' },
      { id: 'school-help',     label: 'Need Help', icon: 'help-circle',   iconLib: 'Ionicons', color: TILE_COLORS.social,  boardId: 'school' },
    ],
  },

  // ── Feelings ──────────────────────────────────────────────────────────────
  {
    id: 'feelings',
    name: 'Feelings',
    icon: 'happy',
    tiles: [
      { id: 'feel-happy',   label: 'Happy',   icon: 'happy',         iconLib: 'Ionicons', color: '#F59E0B', boardId: 'feelings', imageKey: 'happy' },
      { id: 'feel-sad',     label: 'Sad',     icon: 'sad',           iconLib: 'Ionicons', color: '#3B82F6', boardId: 'feelings', imageKey: 'sad'   },
      { id: 'feel-angry',   label: 'Angry',   icon: 'flame',         iconLib: 'Ionicons', color: '#EF4444', boardId: 'feelings', imageKey: 'angry' },
      { id: 'feel-scared',  label: 'Scared',  icon: 'warning',       iconLib: 'Ionicons', color: '#8B5CF6', boardId: 'feelings' },
      { id: 'feel-tired',   label: 'Tired',   icon: 'moon',          iconLib: 'Ionicons', color: '#64748B', boardId: 'feelings' },
      { id: 'feel-sick',    label: 'Sick',    icon: 'medical',       iconLib: 'Ionicons', color: '#10B981', boardId: 'feelings' },
      { id: 'feel-excited', label: 'Excited', icon: 'star',          iconLib: 'Ionicons', color: '#F97316', boardId: 'feelings' },
      { id: 'feel-calm',    label: 'Calm',    icon: 'leaf',          iconLib: 'Ionicons', color: '#2D9A57', boardId: 'feelings' },
      { id: 'feel-loved',   label: 'Loved',   icon: 'heart',         iconLib: 'Ionicons', color: '#EC4899', boardId: 'feelings' },
      { id: 'feel-bored',   label: 'Bored',   icon: 'remove-circle', iconLib: 'Ionicons', color: '#94A3B8', boardId: 'feelings' },
      { id: 'feel-pain',    label: 'Hurt',    icon: 'bandage',       iconLib: 'Ionicons', color: '#DC2626', boardId: 'feelings' },
      { id: 'feel-ok',      label: 'OK',      icon: 'thumbs-up',     iconLib: 'Ionicons', color: '#2A9D8F', boardId: 'feelings' },
    ],
  },

  // ── Home ──────────────────────────────────────────────────────────────────
  {
    id: 'home',
    name: 'Home',
    icon: 'home',
    tiles: [
      { id: 'home-sleep',   label: 'Sleep',   icon: 'bed',            iconLib: 'Ionicons', color: TILE_COLORS.home,       boardId: 'home', imageKey: 'sleep' },
      { id: 'home-tv',      label: 'TV',      icon: 'tv',             iconLib: 'Ionicons', color: TILE_COLORS.home,       boardId: 'home' },
      { id: 'home-outside', label: 'Outside', icon: 'sunny',          iconLib: 'Ionicons', color: TILE_COLORS.descriptor, boardId: 'home' },
      { id: 'home-bath',    label: 'Bath',    icon: 'water',          iconLib: 'Ionicons', color: TILE_COLORS.home,       boardId: 'home' },
      { id: 'home-toy',     label: 'Toy',     icon: 'cube',           iconLib: 'Ionicons', color: TILE_COLORS.thing,      boardId: 'home' },
      { id: 'home-music',   label: 'Music',   icon: 'musical-notes',  iconLib: 'Ionicons', color: TILE_COLORS.social,     boardId: 'home' },
      { id: 'home-hug',     label: 'Hug',     icon: 'heart',          iconLib: 'Ionicons', color: TILE_COLORS.emotion,    boardId: 'home' },
      { id: 'home-phone',   label: 'Phone',   icon: 'phone-portrait', iconLib: 'Ionicons', color: TILE_COLORS.thing,      boardId: 'home' },
      { id: 'home-car',     label: 'Car',     icon: 'car',            iconLib: 'Ionicons', color: TILE_COLORS.thing,      boardId: 'home' },
      { id: 'home-park',    label: 'Park',    icon: 'leaf',           iconLib: 'Ionicons', color: TILE_COLORS.action,     boardId: 'home' },
      { id: 'home-book',    label: 'Book',    icon: 'book',           iconLib: 'Ionicons', color: TILE_COLORS.thing,      boardId: 'home', imageKey: 'book' },
      { id: 'home-cook',    label: 'Cook',    icon: 'flame',          iconLib: 'Ionicons', color: TILE_COLORS.food,       boardId: 'home' },
    ],
  },

  // ── Colours ───────────────────────────────────────────────────────────────
  {
    id: 'colors',
    name: 'Colours',
    icon: 'color-palette',
    tiles: [
      { id: 'col-red',    label: 'Red',    icon: 'ellipse', iconLib: 'Ionicons', color: '#E63946', boardId: 'colors' },
      { id: 'col-blue',   label: 'Blue',   icon: 'ellipse', iconLib: 'Ionicons', color: '#2B78BE', boardId: 'colors' },
      { id: 'col-green',  label: 'Green',  icon: 'ellipse', iconLib: 'Ionicons', color: '#2D9A57', boardId: 'colors' },
      { id: 'col-yellow', label: 'Yellow', icon: 'ellipse', iconLib: 'Ionicons', color: '#F59E0B', boardId: 'colors' },
      { id: 'col-orange', label: 'Orange', icon: 'ellipse', iconLib: 'Ionicons', color: '#E07B39', boardId: 'colors' },
      { id: 'col-purple', label: 'Purple', icon: 'ellipse', iconLib: 'Ionicons', color: '#7C4DBC', boardId: 'colors' },
      { id: 'col-pink',   label: 'Pink',   icon: 'ellipse', iconLib: 'Ionicons', color: '#D0457E', boardId: 'colors' },
      { id: 'col-white',  label: 'White',  icon: 'ellipse', iconLib: 'Ionicons', color: '#9CA3AF', boardId: 'colors' },
      { id: 'col-black',  label: 'Black',  icon: 'ellipse', iconLib: 'Ionicons', color: '#1F2937', boardId: 'colors' },
      { id: 'col-brown',  label: 'Brown',  icon: 'ellipse', iconLib: 'Ionicons', color: '#795548', boardId: 'colors' },
      { id: 'col-gray',   label: 'Gray',   icon: 'ellipse', iconLib: 'Ionicons', color: '#6B7280', boardId: 'colors' },
      { id: 'col-teal',   label: 'Teal',   icon: 'ellipse', iconLib: 'Ionicons', color: '#2A9D8F', boardId: 'colors' },
    ],
  },

  // ── Alphabet ──────────────────────────────────────────────────────────────
  {
    id: 'alphabet',
    name: 'Alphabet',
    icon: 'text',
    tiles: alphabetTiles,
  },

  // ── Numbers ───────────────────────────────────────────────────────────────
  {
    id: 'numbers',
    name: 'Numbers',
    icon: 'calculator',
    tiles: numberTiles,
  },
];

export const QUICK_PHRASES = [
  { id: 'qp-break',  label: 'I need a break', icon: 'pause-circle', color: '#7C4DBC' },
  { id: 'qp-loud',   label: 'Too loud',        icon: 'volume-high',  color: '#E63946' },
  { id: 'qp-bright', label: 'Too bright',      icon: 'sunny',        color: '#C98A1A' },
  { id: 'qp-toilet', label: 'Bathroom',        icon: 'man',          color: '#526475' },
  { id: 'qp-water',  label: 'Water please',    icon: 'water',        color: '#2B78BE' },
  { id: 'qp-help',   label: 'Help me',         icon: 'help-circle',  color: '#2D9A57' },
];
