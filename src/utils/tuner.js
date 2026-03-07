/**
 * Guitar tuner utilities — tuning definitions, pitch math, note matching.
 */

export const TUNINGS = {
  standard: {
    name: 'Standard',
    short: 'Std',
    strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    freqs: [82.41, 110.00, 146.83, 196.00, 246.94, 329.63],
  },
  dropD: {
    name: 'Drop D',
    short: 'Drop D',
    strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    freqs: [73.42, 110.00, 146.83, 196.00, 246.94, 329.63],
  },
  openG: {
    name: 'Open G',
    short: 'Open G',
    strings: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
    freqs: [73.42, 98.00, 146.83, 196.00, 246.94, 293.66],
  },
  openD: {
    name: 'Open D',
    short: 'Open D',
    strings: ['D2', 'A2', 'D3', 'F♯3', 'A3', 'D4'],
    freqs: [73.42, 110.00, 146.83, 185.00, 220.00, 293.66],
  },
  dadgad: {
    name: 'DADGAD',
    short: 'DADGAD',
    strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
    freqs: [73.42, 110.00, 146.83, 196.00, 220.00, 293.66],
  },
};

export const TUNING_KEYS = Object.keys(TUNINGS);

// All 12 note names for chromatic detection
const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

/**
 * Convert a frequency to the nearest note name + octave + cents offset.
 * Based on A4 = 440Hz.
 */
export function frequencyToNote(freq) {
  if (!freq || freq <= 0) return null;
  const semitones = 12 * Math.log2(freq / 440);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12 + 9) % 12; // A=0, shift to C=0
  const octave = Math.floor((rounded + 9) / 12) + 4;
  return {
    name: NOTE_NAMES[noteIndex],
    octave,
    full: `${NOTE_NAMES[noteIndex]}${octave}`,
    cents,
    frequency: freq,
  };
}

/**
 * Calculate cents difference between detected and target frequency.
 */
export function centsOff(detected, target) {
  if (!detected || !target || detected <= 0 || target <= 0) return 0;
  return Math.round(1200 * Math.log2(detected / target));
}

/**
 * Find the closest string in the given tuning for a detected frequency.
 * Returns { stringIndex, note, targetFreq, cents, inTune }
 */
export function findClosestString(freq, tuningKey = 'standard') {
  const tuning = TUNINGS[tuningKey];
  if (!tuning || !freq || freq <= 0) return null;

  let closestIdx = 0;
  let closestCents = Infinity;

  for (let i = 0; i < tuning.freqs.length; i++) {
    const cents = Math.abs(centsOff(freq, tuning.freqs[i]));
    if (cents < closestCents) {
      closestCents = cents;
      closestIdx = i;
    }
  }

  const cents = centsOff(freq, tuning.freqs[closestIdx]);
  return {
    stringIndex: closestIdx,
    note: tuning.strings[closestIdx],
    targetFreq: tuning.freqs[closestIdx],
    cents,
    inTune: Math.abs(cents) <= 3,
  };
}

/**
 * Which strings differ between standard and the given tuning.
 * Returns array of string indices that are changed.
 */
export function changedStrings(tuningKey) {
  if (tuningKey === 'standard') return [];
  const tuning = TUNINGS[tuningKey];
  const standard = TUNINGS.standard;
  const changed = [];
  for (let i = 0; i < 6; i++) {
    if (tuning.freqs[i] !== standard.freqs[i]) changed.push(i);
  }
  return changed;
}
