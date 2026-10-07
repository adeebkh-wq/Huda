// Web: VP9 avoids dependence on proprietary H.264 support in preview browsers.
// Metro selects this module only for web; WebM copies are not in native bundles.
export const therapyMedia: Record<string, number> = {
  'speech-aac': require('../assets/videos/therapy/speech-aac.webm'),
  occupational: require('../assets/videos/therapy/occupational.webm'),
  play: require('../assets/videos/therapy/play.webm'),
  caregiver: require('../assets/videos/therapy/caregiver.webm'),
  behavior: require('../assets/videos/therapy/behavior.webm'),
};
