import type { LanguageCode } from './translations';

export type TherapyNarrationLessonId =
  | 'speech-aac'
  | 'occupational'
  | 'play'
  | 'caregiver'
  | 'behavior';

export const therapyNarrationAssets: Record<
  LanguageCode,
  Record<TherapyNarrationLessonId, number>
> = {
  en: {
    'speech-aac': require('../assets/audio/therapy-narration/en-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/en-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/en-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/en-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/en-behavior.mp3'),
  },
  es: {
    'speech-aac': require('../assets/audio/therapy-narration/es-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/es-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/es-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/es-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/es-behavior.mp3'),
  },
  fr: {
    'speech-aac': require('../assets/audio/therapy-narration/fr-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/fr-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/fr-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/fr-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/fr-behavior.mp3'),
  },
  ar: {
    'speech-aac': require('../assets/audio/therapy-narration/ar-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/ar-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/ar-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/ar-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/ar-behavior.mp3'),
  },
  de: {
    'speech-aac': require('../assets/audio/therapy-narration/de-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/de-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/de-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/de-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/de-behavior.mp3'),
  },
  pt: {
    'speech-aac': require('../assets/audio/therapy-narration/pt-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/pt-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/pt-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/pt-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/pt-behavior.mp3'),
  },
  zh: {
    'speech-aac': require('../assets/audio/therapy-narration/zh-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/zh-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/zh-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/zh-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/zh-behavior.mp3'),
  },
  hi: {
    'speech-aac': require('../assets/audio/therapy-narration/hi-speech-aac.mp3'),
    occupational: require('../assets/audio/therapy-narration/hi-occupational.mp3'),
    play: require('../assets/audio/therapy-narration/hi-play.mp3'),
    caregiver: require('../assets/audio/therapy-narration/hi-caregiver.mp3'),
    behavior: require('../assets/audio/therapy-narration/hi-behavior.mp3'),
  },
};
