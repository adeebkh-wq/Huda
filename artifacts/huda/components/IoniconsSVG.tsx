/**
 * Drop-in SVG replacement for @expo/vector-icons Ionicons.
 * Uses lucide-react-native (SVG-based, no font loading required).
 * Maps Ionicons icon names → Lucide components.
 */
import React from 'react';
import {
  ArrowLeft,
  Award,
  ChartBar,
  ChartBarBig,
  BookOpen,
  Calculator,
  Check,
  ChevronRight,
  Circle,
  CloudMoon,
  CloudRain,
  Delete,
  Dice5,
  Droplets,
  Eye,
  FileText,
  Flame,
  Gamepad2,
  Grid3x3,
  Hand,
  Heart,
  Image as ImageIcon,
  CirclePlus,
  CircleStop,
  CircleX,
  Images,
  Info,
  Infinity,
  Languages,
  LayoutGrid,
  Leaf,
  List,
  Lock,
  LogOut,
  Megaphone,
  MessageCircle,
  MessageCircleMore,
  Mic,
  Minus,
  Moon,
  Music2,
  Paintbrush,
  Palette,
  Pencil,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Repeat,
  Ribbon,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Smile,
  Star,
  Sun,
  Tag,
  Trash2,
  TrendingUp,
  Triangle,
  Trophy,
  Type,
  Undo2,
  User,
  Volume1,
  Volume2,
  VolumeX,
  Wind,
  X,
  Zap,
  ScanLine as FingerprintIcon,
  Camera,
  GitBranch,
  Pause,
  Menu,
  CloudLightning,
  Waves,
  Coffee,
  Sparkles,
  Bug,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const ICON_MAP: Record<string, LucideIcon> = {
  // Navigation / UI
  'menu':                       Menu,
  'menu-outline':               Menu,
  'thunderstorm-outline':       CloudLightning,
  'thunderstorm':               CloudLightning,
  'waves':                      Waves,
  'waves-outline':              Waves,
  'cafe-outline':               Coffee,
  'cafe':                       Coffee,
  'sparkles-outline':           Sparkles,
  'sparkles':                   Sparkles,
  'bug-outline':                Bug,
  'bug':                        Bug,
  'add':                        Plus,
  'add-circle':                 CirclePlus,
  'add-circle-outline':         CirclePlus,
  'arrow-back':                 ArrowLeft,
  'arrow-undo':                 Undo2,
  'backspace-outline':          Delete,
  'checkmark':                  Check,
  'chevron-forward':            ChevronRight,
  'close':                      X,
  'close-circle':               CircleX,
  'remove':                     Minus,
  'remove-circle-outline':      CircleX,
  'refresh':                    RefreshCw,
  'refresh-outline':            RefreshCw,
  'sync':                       RefreshCw,
  'search':                     Search,
  'play':                       Play,
  'pause':                      Pause,
  'stop-circle':                CircleStop,

  // People / auth
  'person':                     User,
  'lock-closed':                Lock,
  'lock-closed-outline':        Lock,
  'log-out-outline':            LogOut,
  'shield-checkmark':           ShieldCheck,
  'shield-outline':             Shield,
  'finger-print':               FingerprintIcon,

  // Nature / ambience
  'moon':                       Moon,
  'moon-outline':               Moon,
  'sunny':                      Sun,
  'leaf-outline':               Leaf,
  'water':                      Droplets,
  'water-outline':              Droplets,
  'cloudy-night':               CloudMoon,
  'cloudy-outline':             CloudMoon,
  'rainy-outline':              CloudRain,
  'flame-outline':              Flame,
  'git-branch-outline':         GitBranch,
  'radio-outline':              Radio,
  'wind-outline':               Wind,

  // Communication
  'mic':                        Mic,
  'mic-outline':                Mic,
  'chatbubble-ellipses':        MessageCircleMore,
  'chatbubbles':                MessageCircle,
  'chatbubbles-outline':        MessageCircle,
  'megaphone':                  Megaphone,
  'mail':                       MessageCircle,

  // Media / creative
  'camera':                     Camera,
  'image':                      ImageIcon,
  'image-outline':              ImageIcon,
  'images':                     Images,
  'images-outline':             Images,
  'brush':                      Paintbrush,
  'color-palette':              Palette,
  'pencil':                     Pencil,
  'musical-notes-outline':      Music2,
  'musical-notes':              Music2,
  'repeat':                     Repeat,
  'stop-circle-outline':        CircleStop,
  'volume-low-outline':         Volume1,
  'volume-low':                 Volume1,
  'pricetag-outline':           Tag,
  'pricetag':                   Tag,

  // Emotion
  'happy-outline':              Smile,
  'heart':                      Heart,
  'heart-outline':              Heart,

  // Games / activities
  'game-controller':            Gamepad2,
  'game-controller-outline':    Gamepad2,
  'ellipse':                    Circle,
  'ellipse-outline':            Circle,
  'flash':                      Zap,

  // Data / settings
  'settings-outline':           Settings,
  'bar-chart-outline':          ChartBarBig,
  'stats-chart':                ChartBar,
  'trending-up-outline':        TrendingUp,
  'document-text-outline':      FileText,
  'book-outline':               BookOpen,
  'information-circle-outline': Info,
  'grid-outline':               Grid3x3,
  'grid':                       Grid3x3,
  'apps-outline':               LayoutGrid,
  'language-outline':           Languages,
  'eye-outline':                Eye,
  'text':                       Type,
  'text-outline':               Type,
  'list':                       List,

  // Misc
  'star':                       Star,
  'trophy':                     Trophy,
  'podium':                     Award,
  'ribbon':                     Ribbon,
  'award':                      Award,
  'hand-right':                 Hand,
  'volume-high':                Volume2,
  'volume-high-outline':        Volume2,
  'volume-mute':                VolumeX,
  'infinite':                   Infinity,
  'triangle':                   Triangle,
  'calculator':                 Calculator,
  'dice':                       Dice5,
  'sunny-outline':              Sun,
};

export interface IoniconProps {
  name: string;
  size?: number;
  color?: string;
  style?: object;
  /** unused — kept for API compatibility */
  allowFontScaling?: boolean;
}

/**
 * SVG-backed Ionicons drop-in. Pass the same `name`, `size`, `color` props
 * you would pass to `<Ionicons>` from @expo/vector-icons.
 */
export function Ionicons({ name, size = 24, color = '#000', style }: IoniconProps) {
  const IconComponent: LucideIcon = ICON_MAP[name] ?? Circle;
  return <IconComponent size={size} color={color} style={style as any} />;
}

export default Ionicons;
