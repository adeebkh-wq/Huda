const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

const appDir = path.resolve(__dirname, '..');
const languages = {
  en: 'en-us+f3',
  es: 'es+f3',
  fr: 'fr-fr+f3',
  ar: 'ar+f3',
  de: 'de+f3',
  pt: 'pt-br+f3',
  zh: 'cmn+f3',
  hi: 'hi+f3',
};
const outputDir = path.join(appDir, 'assets/audio/therapy-narration');
const lessonData = JSON.parse(
  fs.readFileSync(path.join(appDir, 'data/therapy-lessons.json'), 'utf8'),
);
const subtitleSource = fs.readFileSync(
  path.join(appDir, 'data/therapySubtitles.ts'),
  'utf8',
);
const compiledSubtitles = ts.transpileModule(subtitleSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const subtitleModule = { exports: {} };
new Function('exports', 'require', 'module', compiledSubtitles)(
  subtitleModule.exports,
  require,
  subtitleModule,
);
const { getTherapySubtitles } = subtitleModule.exports;

fs.mkdirSync(outputDir, { recursive: true });

for (const [language, voice] of Object.entries(languages)) {
  for (const lesson of lessonData.lessons) {
    const segments = getTherapySubtitles(lesson.id, language, lesson.segments);
    const script = segments
      .map(({ caption }) => caption.trim())
      .filter(Boolean)
      .join(' ');
    if (!script) throw new Error(`Missing script for ${language}/${lesson.id}`);

    const wav = spawnSync(
      'espeak-ng',
      ['-v', voice, '-s', '145', '-p', '48', '-a', '165', '--stdout', script],
      { encoding: null, maxBuffer: 40 * 1024 * 1024 },
    );
    if (wav.status !== 0 || !wav.stdout?.length) {
      throw new Error(`eSpeak failed for ${language}/${lesson.id}: ${wav.stderr?.toString()}`);
    }

    const outputPath = path.join(outputDir, `${language}-${lesson.id}.mp3`);
    const encoded = spawnSync(
      'ffmpeg',
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-f',
        'wav',
        '-i',
        'pipe:0',
        '-ac',
        '1',
        '-ar',
        '22050',
        '-c:a',
        'libmp3lame',
        '-b:a',
        '48k',
        '-id3v2_version',
        '3',
        outputPath,
      ],
      { input: wav.stdout, encoding: null, maxBuffer: 10 * 1024 * 1024 },
    );
    if (encoded.status !== 0) {
      throw new Error(`MP3 encoding failed for ${language}/${lesson.id}: ${encoded.stderr?.toString()}`);
    }

    const file = fs.statSync(outputPath);
    if (file.size < 1024) throw new Error(`Invalid audio file: ${outputPath}`);
    console.log(`${language}/${lesson.id}: ${Math.round(file.size / 1024)} KB`);
  }
}
