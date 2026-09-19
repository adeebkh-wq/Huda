// Static sound manifest — require() must be static for Metro bundler.
const GAME_SOUNDS: Record<string, any> = {
  bubbles: require('./bubbles.wav'),
  rain:    require('./rain.wav'),
  spinner: require('./spinner.wav'),
  glow:    require('./glow.wav'),
  sand:    require('./sand.wav'),
  mirror:  require('./mirror.wav'),
};

export default GAME_SOUNDS;
