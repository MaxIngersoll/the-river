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
let rainSource = null;
let rainGain = null;
let rainVolume = 0.3;

// Constants
const LOOKAHEAD_MS = 25;     // How often the scheduler checks (ms)
const SCHEDULE_AHEAD = 0.1;  // How far ahead to schedule (seconds)
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
  if (!Ctx) return; // Browser doesn't support Web Audio

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

function scheduleClick(time, isAccent) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.value = isAccent ? 880 : 440;

  // Gain envelope: quick attack, fast decay for a click sound
  const duration = isAccent ? 0.08 : 0.05;
  const peakGain = isAccent ? 0.6 : 0.3;

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(peakGain, time + 0.002);
  gain.gain.linearRampToValueAtTime(0, time + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(time);
  osc.stop(time + duration + 0.01);
}

function schedulerTick() {
  while (nextNoteTime < audioCtx.currentTime + SCHEDULE_AHEAD) {
    const isAccent = currentBeat === 0;
    scheduleClick(nextNoteTime, isAccent);

    // Advance beat
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

let cachedNoiseBuffer = null;

function getWhiteNoiseBuffer() {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === audioCtx.sampleRate) {
    return cachedNoiseBuffer;
  }
  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * 10; // 10-second buffer to avoid audible looping
  const buffer = audioCtx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  cachedNoiseBuffer = buffer;
  return buffer;
}

export function startRain(volume = 0.3) {
  if (!ensureContext()) return;

  if (rainRunning) {
    stopRain();
  }

  rainVolume = Math.min(1, Math.max(0, volume));

  const buffer = getWhiteNoiseBuffer();

  rainSource = audioCtx.createBufferSource();
  rainSource.buffer = buffer;
  rainSource.loop = true;

  // Two-filter chain for more realistic rain texture
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 2400;
  lowpass.Q.value = 0.3;

  const bandpass = audioCtx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 800;
  bandpass.Q.value = 0.4;

  rainGain = audioCtx.createGain();
  rainGain.gain.setValueAtTime(0, audioCtx.currentTime);
  rainGain.gain.linearRampToValueAtTime(rainVolume, audioCtx.currentTime + 0.5);

  rainSource.connect(lowpass);
  lowpass.connect(bandpass);
  bandpass.connect(rainGain);
  rainGain.connect(masterGain);

  rainSource.start();
  rainRunning = true;
}

export function stopRain() {
  if (!rainRunning || !rainSource) return;

  try {
    // Fade out for click-free stop
    const now = audioCtx.currentTime;
    rainGain.gain.cancelScheduledValues(now);
    rainGain.gain.setValueAtTime(rainGain.gain.value, now);
    rainGain.gain.linearRampToValueAtTime(0, now + 0.15);

    // Stop and disconnect after fade
    const source = rainSource;
    const gain = rainGain;
    setTimeout(() => {
      try {
        source.stop();
        source.disconnect();
        gain.disconnect();
      } catch {
        // Already stopped or disconnected
      }
    }, 200);
  } catch {
    // Graceful fallback
  }

  rainSource = null;
  rainGain = null;
  rainRunning = false;
}

export function setRainVolume(volume) {
  rainVolume = Math.min(1, Math.max(0, volume));
  if (rainRunning && rainGain && audioCtx) {
    const now = audioCtx.currentTime;
    rainGain.gain.cancelScheduledValues(now);
    rainGain.gain.setValueAtTime(rainGain.gain.value, now);
    rainGain.gain.linearRampToValueAtTime(rainVolume, now + 0.05);
  }
}

export function getRainState() {
  return {
    running: rainRunning,
    volume: rainVolume,
  };
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
