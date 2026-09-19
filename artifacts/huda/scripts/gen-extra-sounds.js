/**
 * Generates 6 additional calming ambient WAV files using PCM synthesis.
 * Each file: 12 seconds, 44100 Hz, 16-bit, mono.
 * Run: node scripts/gen-extra-sounds.js
 */
const fs   = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION    = 12;           // seconds
const NUM_SAMPLES = SAMPLE_RATE * DURATION;
const OUT_DIR     = path.join(__dirname, '../assets/sounds/calm');

/* ── WAV writer ────────────────────────────────────────────────── */
function writeWav(filename, samples) {
  const int16 = new Int16Array(NUM_SAMPLES);
  for (let i = 0; i < NUM_SAMPLES; i++) {
    int16[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
  }

  const dataBytes = int16.buffer.byteLength;
  const buf       = Buffer.alloc(44 + dataBytes);

  buf.write('RIFF', 0);                buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write('WAVE', 8);                buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);           buf.writeUInt16LE(1,  20);   // PCM
  buf.writeUInt16LE(1,  22);           buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28); buf.writeUInt16LE(2, 32); // blockAlign
  buf.writeUInt16LE(16, 34);           buf.write('data', 36);
  buf.writeUInt32LE(dataBytes, 40);
  Buffer.from(int16.buffer).copy(buf, 44);

  const outPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(outPath, buf);
  console.log(`✓  ${filename}  (${(buf.length / 1024).toFixed(0)} KB)`);
}

/* ── Utilities ─────────────────────────────────────────────────── */
let _noise = Math.random();
function lcg() {
  _noise = (_noise * 1664525 + 1013904223) & 0xffffffff;
  return (_noise >>> 0) / 0xffffffff;  // [0,1)
}
function white() { return lcg() * 2 - 1; }   // [-1,1]

/** One-pole low-pass: y[n] = a*x[n] + (1-a)*y[n-1] */
function lowpass(x, prev, a) { return a * x + (1 - a) * prev; }

/** Clamp + soft-clip */
function clip(x) {
  x = Math.max(-1, Math.min(1, x));
  return x - (x * x * x) / 3;
}

/* ── 1. Thunderstorm ──────────────────────────────────────────── */
function genThunderstorm() {
  const samples = new Float32Array(NUM_SAMPLES);
  let lp1 = 0, lp2 = 0, lp3 = 0;

  // Envelope: start quiet, swell, then steady
  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;

    // Deep rumble — heavily low-passed white noise
    const raw = white();
    lp1 = lowpass(raw, lp1, 0.003);
    lp2 = lowpass(lp1, lp2, 0.005);
    lp3 = lowpass(lp2, lp3, 0.004);
    let rumble = lp3 * 3;

    // Occasional thunder cracks (at t≈2s, t≈5s, t≈9s)
    let crack = 0;
    for (const [ts, dur, amp] of [[2.0, 0.35, 1.2], [5.3, 0.55, 1.5], [9.1, 0.45, 1.1]]) {
      if (t >= ts && t < ts + dur) {
        const env = Math.exp(-(t - ts) / (dur * 0.3));
        crack += white() * env * amp;
      }
    }
    // Low-pass the crack too so it sounds like distant thunder
    crack = lowpass(crack, 0, 0.05);

    // Rain layer — mid-frequency noise
    let rain = 0;
    let rlp = 0;
    const r = white();
    rlp = lowpass(r, rlp, 0.02);
    rain = rlp * 0.4;

    const env = Math.min(1, t / 1.5) * Math.min(1, (DURATION - t) / 1.5);
    samples[i] = clip((rumble * 0.9 + crack * 0.6 + rain * 0.3) * env * 0.7);
  }
  writeWav('thunderstorm.wav', samples);
}

/* ── 2. Waterfall ────────────────────────────────────────────── */
function genWaterfall() {
  const samples = new Float32Array(NUM_SAMPLES);
  // Waterfall = broadband noise + rhythmic low-freq pulses (big splashes)
  let lp1 = 0, lp2 = 0, hp1 = 0, prev = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const w = white();

    // High-freq spray layer
    const spray = w * 0.3;

    // Mid-freq body — slight bandpass
    lp1 = lowpass(w, lp1, 0.08);
    const body = lp1 * 0.7;

    // Low rumble of falling water
    lp2 = lowpass(lp1, lp2, 0.02);
    const rumble = lp2 * 1.5;

    // Slow AM modulation — gives water a "breathing" feel
    const mod = 0.82 + 0.18 * Math.sin(2 * Math.PI * 0.11 * t) * Math.sin(2 * Math.PI * 0.07 * t + 1);

    const env = Math.min(1, t / 1.0) * Math.min(1, (DURATION - t) / 1.0);
    samples[i] = clip((spray + body + rumble) * mod * env * 0.72);
  }
  writeWav('waterfall.wav', samples);
}

/* ── 3. Night Crickets ────────────────────────────────────────── */
function genCrickets() {
  const samples = new Float32Array(NUM_SAMPLES);
  // Crickets = amplitude-modulated sine bursts (~4200 Hz) in rhythmic pulses
  const CRICKET_FREQ = 4200;
  const CHIRP_RATE   = 3.8;  // chirps per second
  const CHIRPS_PER_BURST = 4;

  // Second layer at slightly different pitch
  const CRICKET2_FREQ = 4050;
  const CHIRP2_RATE   = 3.3;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;

    // Layer 1
    const phase1  = CHIRP_RATE * t;
    const inChirp1 = (phase1 % 1) < (CHIRPS_PER_BURST / (CHIRPS_PER_BURST + 3));
    const chirpEnv1 = inChirp1 ? 0.5 + 0.5 * Math.sin(Math.PI * ((phase1 % 1) / 0.55)) : 0;
    const s1 = Math.sin(2 * Math.PI * CRICKET_FREQ * t) * chirpEnv1 * 0.35;

    // Layer 2 (different phase)
    const phase2   = CHIRP2_RATE * (t + 0.17);
    const inChirp2 = (phase2 % 1) < 0.45;
    const chirpEnv2 = inChirp2 ? 0.5 + 0.5 * Math.sin(Math.PI * ((phase2 % 1) / 0.45)) : 0;
    const s2 = Math.sin(2 * Math.PI * CRICKET2_FREQ * t) * chirpEnv2 * 0.28;

    // Distant frogs — low-frequency sporadic
    const frogPhase = 0.55 * t + 0.4;
    const frogOn = (frogPhase % 1) < 0.08;
    const frog = frogOn ? Math.sin(2 * Math.PI * 280 * t) * 0.12 : 0;

    // Soft night-wind background
    const wind = white() * 0.04;

    const env = Math.min(1, t / 2.0) * Math.min(1, (DURATION - t) / 2.0);
    samples[i] = clip((s1 + s2 + frog + wind) * env * 0.88);
  }
  writeWav('crickets.wav', samples);
}

/* ── 4. Brown Noise ───────────────────────────────────────────── */
function genBrownNoise() {
  const samples = new Float32Array(NUM_SAMPLES);
  // Brown (Brownian) noise: integrated white noise, 1/f² spectrum
  let acc = 0;
  // We need to normalize after — collect pass 1 to find max
  const raw = new Float32Array(NUM_SAMPLES);
  for (let i = 0; i < NUM_SAMPLES; i++) {
    acc += white() * 0.1;
    acc  = Math.max(-1, Math.min(1, acc)); // prevent runaway
    raw[i] = acc;
  }
  // Normalize
  let peak = 0;
  for (let i = 0; i < NUM_SAMPLES; i++) peak = Math.max(peak, Math.abs(raw[i]));
  const scale = peak > 0 ? 0.85 / peak : 1;
  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t   = i / SAMPLE_RATE;
    const env = Math.min(1, t / 1.5) * Math.min(1, (DURATION - t) / 1.5);
    samples[i] = raw[i] * scale * env;
  }
  writeWav('brownnoise.wav', samples);
}

/* ── 5. Coffee Shop ──────────────────────────────────────────── */
function genCoffeeShop() {
  const samples = new Float32Array(NUM_SAMPLES);
  // Murmur: band-pass noise (200–2000 Hz) with slow amplitude variation
  // Cups/clinking: occasional high transients
  let lp1 = 0, lp2 = 0, hp = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const w = white();

    // Band-pass: low-pass then subtract more low-pass → mid band
    lp1 = lowpass(w,   lp1, 0.15);
    lp2 = lowpass(lp1, lp2, 0.01);
    const murmur = (lp1 - lp2) * 0.8;

    // Slow modulation — people talking, rising and falling
    const mod = 0.65 + 0.20 * Math.sin(2 * Math.PI * 0.08 * t)
                     + 0.15 * Math.sin(2 * Math.PI * 0.17 * t + 0.9);

    // Occasional cup clink (at ~3s, ~7s, ~10.5s)
    let clink = 0;
    for (const [ts, freq] of [[3.1, 1800], [7.4, 2100], [10.6, 1600]]) {
      if (t >= ts && t < ts + 0.18) {
        const decay = Math.exp(-18 * (t - ts));
        clink += Math.sin(2 * Math.PI * freq * t) * decay * 0.18;
      }
    }

    const env = Math.min(1, t / 1.0) * Math.min(1, (DURATION - t) / 1.0);
    samples[i] = clip((murmur * mod + clink) * env * 0.7);
  }
  writeWav('coffeeshop.wav', samples);
}

/* ── 6. Healing Tone (432 Hz + harmonics) ────────────────────── */
function genHealingTone() {
  const samples = new Float32Array(NUM_SAMPLES);
  // 432 Hz fundamental + soft harmonics + gentle shimmer
  const FREQ = 432;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;

    // Fundamental
    const f0 = Math.sin(2 * Math.PI * FREQ * t);
    // 2nd harmonic (octave) — softer
    const f1 = Math.sin(2 * Math.PI * FREQ * 2 * t) * 0.3;
    // 3rd harmonic (fifth above octave)
    const f2 = Math.sin(2 * Math.PI * FREQ * 3 * t) * 0.12;
    // 5th harmonic
    const f3 = Math.sin(2 * Math.PI * FREQ * 5 * t) * 0.05;

    // Slow tremolo — gives a "singing bowl" feel
    const tremolo = 1 + 0.06 * Math.sin(2 * Math.PI * 0.25 * t);
    // Slow chorus shimmer
    const chorus  = 1 + 0.03 * Math.sin(2 * Math.PI * 0.13 * t + 1.2);

    // Very soft noise floor for texture
    const texture = white() * 0.01;

    const env = Math.min(1, t / 2.5) * Math.min(1, (DURATION - t) / 2.5);
    samples[i] = clip(((f0 + f1 + f2 + f3) * tremolo * chorus + texture) * env * 0.55);
  }
  writeWav('healingtone.wav', samples);
}

/* ── Run all ───────────────────────────────────────────────────── */
console.log(`Generating 6 new ambient sounds → ${OUT_DIR}\n`);
genThunderstorm();
genWaterfall();
genCrickets();
genBrownNoise();
genCoffeeShop();
genHealingTone();
console.log('\nAll done.');
