// Static calm-sound manifest — require() must be static for Metro bundler.
// WAV (PCM) is used instead of MP3 so ExoPlayer can detect the format by
// magic bytes ("RIFF") rather than relying on MIME type or file extension,
// which Metro's dev server does not reliably provide.
const CALM_SOUNDS: Record<string, any> = {
  rain:          require('./rain.wav'),
  ocean:         require('./ocean.wav'),
  forest:        require('./forest.wav'),
  fire:          require('./fire.wav'),
  stream:        require('./stream.wav'),
  wind:          require('./wind.wav'),
  whitenoise:    require('./whitenoise.wav'),
  bowls:         require('./bowls.wav'),
  piano:         require('./piano.wav'),
  thunderstorm:  require('./thunderstorm.wav'),
  waterfall:     require('./waterfall.wav'),
  crickets:      require('./crickets.wav'),
  brownnoise:    require('./brownnoise.wav'),
  coffeeshop:    require('./coffeeshop.wav'),
  healingtone:   require('./healingtone.wav'),
};

export default CALM_SOUNDS;
