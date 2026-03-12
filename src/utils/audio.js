// ─── Web Audio API Engine for Practice Soundscape ───

let audioCtx = null;
let masterGain = null;

// Metronome state
let metronomeRunning = false;
let metronomeBPM = 80;
let metronomeTimerId = null;
let nextNoteTime = 0;
let currentBeat = 0;

// Rain state
let rainRunning = false;
let rainNodes = null;  // holds all rain audio nodes for cleanup
let rainGain = null;
let rainVolume = 0.3;

// Constants
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.1;
const BPM_MIN = 40;
const BPM_MAX = 208;

// ─── Initialization ───

export function initAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return;
  }

  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  try {
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;
    masterGain.connect(audioCtx.destination);

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch {
    audioCtx = null;
    masterGain = null;
  }
}

function ensureContext() {
  if (!audioCtx) {
    initAudio();
    if (!audioCtx) return false;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return true;
}

// ─── Metronome ───
// Uses a noise burst + pitched oscillator for a warm, woody click

function scheduleClick(time, isAccent) {
  // --- Pitched component: short triangle wave for warmth ---
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = isAccent ? 1200 : 800;

  const duration = isAccent ? 0.035 : 0.025;
  const peakGain = isAccent ? 0.35 : 0.2;

  oscGain.gain.setValueAtTime(0, time);
  oscGain.gain.linearRampToValueAtTime(peakGain, time + 0.001);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(oscGain);
  oscGain.connect(masterGain);
  osc.start(time);
  osc.stop(time + duration + 0.01);

  // --- Noise burst for transient snap ---
  const noiseLen = Math.ceil(audioCtx.sampleRate * 0.015);
  const noiseBuf = audioCtx.createBuffer(1, noiseLen, audioCtx.sampleRate);
  const noiseData = noiseBuf.getChannelData(0);
  for (let i = 0; i < noiseLen; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseLen); // decaying noise
  }

  const noiseSrc = audioCtx.createBufferSource();
  noiseSrc.buffer = noiseBuf;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = isAccent ? 3500 : 2500;
  noiseFilter.Q.value = 1.5;

  const noiseGain = audioCtx.createGain();
  const noisePeak = isAccent ? 0.25 : 0.15;
  noiseGain.gain.setValueAtTime(noisePeak, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseSrc.start(time);
  noiseSrc.stop(time + 0.03);
}

function schedulerTick() {
  while (nextNoteTime < audioCtx.currentTime + SCHEDULE_AHEAD) {
    const isAccent = currentBeat === 0;
    scheduleClick(nextNoteTime, isAccent);

    const secondsPerBeat = 60.0 / metronomeBPM;
    nextNoteTime += secondsPerBeat;
    currentBeat = (currentBeat + 1) % 4;
  }
}

export function startMetronome(bpm = 80) {
  if (!ensureContext()) return;

  if (metronomeRunning) {
    stopMetronome();
  }

  metronomeBPM = clampBPM(bpm);
  metronomeRunning = true;
  currentBeat = 0;
  nextNoteTime = audioCtx.currentTime;

  metronomeTimerId = setInterval(schedulerTick, LOOKAHEAD_MS);
}

export function stopMetronome() {
  metronomeRunning = false;
  if (metronomeTimerId !== null) {
    clearInterval(metronomeTimerId);
    metronomeTimerId = null;
  }
}

export function setBPM(bpm) {
  metronomeBPM = clampBPM(bpm);
}

export function getMetronomeState() {
  return {
    running: metronomeRunning,
    bpm: metronomeBPM,
  };
}

function clampBPM(bpm) {
  return Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(bpm)));
}

// ─── Ambient: Rain ───
// Uses brown noise (warmer than white noise) with multiple filter layers
// and LFO modulation for organic movement

let cachedBrownBuffer = null;

function getBrownNoiseBuffer() {
  if (cachedBrownBuffer && cachedBrownBuffer.sampleRate === audioCtx.sampleRate) {
    return cachedBrownBuffer;
  }

  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * 12; // 12-second buffer
  const buffer = audioCtx.createBuffer(2, length, sampleRate); // stereo

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let lastOut = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise: integrated white noise with leaky integration
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      data[i] = lastOut * 3.5; // Normalize amplitude
    }
  }

  cachedBrownBuffer = buffer;
  return buffer;
}

export function startRain(volume = 0.3) {
  if (!ensureContext()) return;

  if (rainRunning) {
    stopRain();
  }

  rainVolume = Math.min(1, Math.max(0, volume));

  const buffer = getBrownNoiseBuffer();

  // --- Layer 1: Low rumble (distant rain / room ambience) ---
  const src1 = audioCtx.createBufferSource();
  src1.buffer = buffer;
  src1.loop = true;

  const lowFilter = audioCtx.createBiquadFilter();
  lowFilter.type = 'lowpass';
  lowFilter.frequency.value = 400;
  lowFilter.Q.value = 0.5;

  const lowGain = audioCtx.createGain();
  lowGain.gain.value = 0.6;

  src1.connect(lowFilter);
  lowFilter.connect(lowGain);

  // --- Layer 2: Mid splatter (rain hitting surfaces) ---
  const src2 = audioCtx.createBufferSource();
  src2.buffer = buffer;
  src2.loop = true;
  // Offset the second source to decorrelate from first
  src2.loopStart = 3.7;
  src2.loopEnd = 12;

  const midFilter = audioCtx.createBiquadFilter();
  midFilter.type = 'bandpass';
  midFilter.frequency.value = 1800;
  midFilter.Q.value = 0.3;

  const midGain = audioCtx.createGain();
  midGain.gain.value = 0.25;

  src2.connect(midFilter);
  midFilter.connect(midGain);

  // --- Layer 3: High shimmer (fine droplets / patter) ---
  const src3 = audioCtx.createBufferSource();
  src3.buffer = buffer;
  src3.loop = true;
  src3.loopStart = 6.2;
  src3.loopEnd = 12;

  const highFilter = audioCtx.createBiquadFilter();
  highFilter.type = 'highpass';
  highFilter.frequency.value = 4000;
  highFilter.Q.value = 0.2;

  const highShelf = audioCtx.createBiquadFilter();
  highShelf.type = 'highshelf';
  highShelf.frequency.value = 6000;
  highShelf.gain.value = -8; // tame harsh highs

  const highGain = audioCtx.createGain();
  highGain.gain.value = 0.12;

  src3.connect(highFilter);
  highFilter.connect(highShelf);
  highShelf.connect(highGain);

  // --- LFO: Slow modulation on mid-frequency filter for organic variation ---
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.15; // very slow wobble
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 400; // modulate ±400 Hz around 1800
  lfo.connect(lfoGain);
  lfoGain.connect(midFilter.frequency);
  lfo.start();

  // Second LFO for volume breathing
  const lfo2 = audioCtx.createOscillator();
  lfo2.type = 'sine';
  lfo2.frequency.value = 0.08; // even slower
  const lfo2Gain = audioCtx.createGain();
  lfo2Gain.gain.value = 0.04; // subtle volume swell ±0.04
  lfo2.connect(lfo2Gain);

  // --- Mix bus ---
  rainGain = audioCtx.createGain();
  rainGain.gain.setValueAtTime(0, audioCtx.currentTime);
  rainGain.gain.linearRampToValueAtTime(rainVolume, audioCtx.currentTime + 1.5); // slow fade in

  lowGain.connect(rainGain);
  midGain.connect(rainGain);
  highGain.connect(rainGain);
  lfo2Gain.connect(rainGain.gain);

  // Gentle compression to even out the noise
  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 12;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.1;
  compressor.release.value = 0.25;

  rainGain.connect(compressor);
  compressor.connect(masterGain);

  // Start all sources
  src1.start();
  src2.start();
  src3.start();

  // Store references for cleanup
  rainNodes = { src1, src2, src3, lfo, lfo2, lowFilter, midFilter, highFilter, highShelf, lowGain, midGain, highGain, lfoGain, lfo2Gain, compressor };
  rainRunning = true;
}

export function stopRain() {
  if (!rainRunning || !rainNodes) return;

  try {
    const now = audioCtx.currentTime;
    rainGain.gain.cancelScheduledValues(now);
    rainGain.gain.setValueAtTime(rainGain.gain.value, now);
    rainGain.gain.linearRampToValueAtTime(0, now + 0.8); // slower fade out

    const nodes = rainNodes;
    const gain = rainGain;
    setTimeout(() => {
      try {
        nodes.src1.stop(); nodes.src1.disconnect();
        nodes.src2.stop(); nodes.src2.disconnect();
        nodes.src3.stop(); nodes.src3.disconnect();
        nodes.lfo.stop(); nodes.lfo.disconnect();
        nodes.lfo2.stop(); nodes.lfo2.disconnect();
        nodes.lowFilter.disconnect();
        nodes.midFilter.disconnect();
        nodes.highFilter.disconnect();
        nodes.highShelf.disconnect();
        nodes.lowGain.disconnect();
        nodes.midGain.disconnect();
        nodes.highGain.disconnect();
        nodes.lfoGain.disconnect();
        nodes.lfo2Gain.disconnect();
        nodes.compressor.disconnect();
        gain.disconnect();
      } catch {
        // Already stopped or disconnected
      }
    }, 1000);
  } catch {
    // Graceful fallback
  }

  rainNodes = null;
  rainGain = null;
  rainRunning = false;
}

export function setRainVolume(volume) {
  rainVolume = Math.min(1, Math.max(0, volume));
  if (rainRunning && rainGain && audioCtx) {
    const now = audioCtx.currentTime;
    rainGain.gain.cancelScheduledValues(now);
    rainGain.gain.setValueAtTime(rainGain.gain.value, now);
    rainGain.gain.linearRampToValueAtTime(rainVolume, now + 0.1);
  }
}

export function getRainState() {
  return {
    running: rainRunning,
    volume: rainVolume,
  };
}

// ─── Note Playback (Fretboard Tap) ───
// Plays a guitar-like pluck at the given frequency

export function playNote(frequency, duration = 0.8) {
  if (!ensureContext()) return;

  const now = audioCtx.currentTime;

  // Fundamental + harmonics for guitar-like timbre
  const fund = audioCtx.createOscillator();
  fund.type = 'triangle';
  fund.frequency.value = frequency;

  const h2 = audioCtx.createOscillator();
  h2.type = 'sine';
  h2.frequency.value = frequency * 2;

  const h3 = audioCtx.createOscillator();
  h3.type = 'sine';
  h3.frequency.value = frequency * 3;

  // Pluck envelope: fast attack, exponential decay
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.25, now + 0.005);
  env.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const h2Gain = audioCtx.createGain();
  h2Gain.gain.value = 0.12;
  const h3Gain = audioCtx.createGain();
  h3Gain.gain.value = 0.05;

  // Low-pass filter: guitar body resonance
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + duration * 0.6);
  filter.Q.value = 1;

  fund.connect(env);
  h2.connect(h2Gain);
  h2Gain.connect(env);
  h3.connect(h3Gain);
  h3Gain.connect(env);
  env.connect(filter);
  filter.connect(masterGain);

  fund.start(now);
  h2.start(now);
  h3.start(now);
  fund.stop(now + duration + 0.05);
  h2.stop(now + duration + 0.05);
  h3.stop(now + duration + 0.05);
}

// ─── Master Controls ───

export function setMasterVolume(volume) {
  if (!masterGain || !audioCtx) return;
  const v = Math.min(1, Math.max(0, volume));
  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(v, now + 0.05);
}

export function suspendAudio() {
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  }
}

export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function stopAll() {
  stopMetronome();
  stopRain();
}

// ─── iOS Safari: suspend/resume AudioContext on visibility change ───
document.addEventListener('visibilitychange', () => {
  if (!audioCtx) return;
  if (document.hidden) {
    audioCtx.suspend();
  } else {
    audioCtx.resume();
  }
});
