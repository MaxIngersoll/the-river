// ─── Music Theory Data ───
// Shared constants and utility functions for The Shed

import { today, addDays } from '../utils/storage';

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_DISPLAY = { 'C#': 'C#/Db', 'D#': 'D#/Eb', 'F#': 'F#/Gb', 'G#': 'G#/Ab', 'A#': 'A#/Bb' };

export const INTERVALS = {
  major:     [0, 2, 4, 5, 7, 9, 11],
  minor:     [0, 2, 3, 5, 7, 8, 10],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  blues:     [0, 3, 5, 6, 7, 10],
  dorian:    [0, 2, 3, 5, 7, 9, 10],
  mixolydian:[0, 2, 4, 5, 7, 9, 10],
};

export const SCALE_NAMES = {
  major: 'Major', minor: 'Natural Minor', pentatonic_major: 'Major Pentatonic',
  pentatonic_minor: 'Minor Pentatonic', blues: 'Blues', dorian: 'Dorian', mixolydian: 'Mixolydian',
};

// Step patterns (semitone distances between consecutive notes)
export const STEP_PATTERNS = {
  major: '2-2-1-2-2-2-1',
  minor: '2-1-2-2-1-2-2',
  pentatonic_major: '2-2-3-2-3',
  pentatonic_minor: '3-2-2-3-2',
  blues: '3-2-1-1-3-2',
  dorian: '2-1-2-2-2-1-2',
  mixolydian: '2-2-1-2-2-1-2',
};

// Chord formulas: intervals from root
export const CHORD_FORMULAS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  '7': [0, 4, 7, 10],
  'm7': [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  dim: [0, 3, 6],
  sus4: [0, 5, 7],
  sus2: [0, 2, 7],
  aug: [0, 4, 8],
};

// ─── Oblique Strategy Cards ───

export const OBLIQUE_CARDS = [
  { type: 'chord', text: 'Try an Fsus2 today — it sounds like a question' },
  { type: 'prompt', text: 'Play the last thing you learned, but slower' },
  { type: 'chord', text: 'Cmaj7 — the chord that sounds like Sunday morning' },
  { type: 'prompt', text: 'What does this song sound like in a minor key?' },
  { type: 'chord', text: 'Dsus4 — resolve it, or don\'t. Both are beautiful.' },
  { type: 'prompt', text: 'Play something you haven\'t touched in a month' },
  { type: 'chord', text: 'Am7 — jazz starts here' },
  { type: 'prompt', text: 'Close your eyes for the first minute' },
  { type: 'chord', text: 'G/B — one note changes everything' },
  { type: 'prompt', text: 'What would this sound like if you were happy?' },
  { type: 'chord', text: 'Bm — the loneliest chord. Give it company.' },
  { type: 'prompt', text: 'Hum before you play' },
  { type: 'chord', text: 'Cadd9 — Wonderwall\'s secret ingredient' },
  { type: 'prompt', text: 'Play something you\'re afraid of' },
  { type: 'chord', text: 'E7#9 — the Hendrix chord. You know you want to.' },
  { type: 'prompt', text: 'What does the river sound like today?' },
  { type: 'prompt', text: 'Learn one new chord. Just one.' },
  { type: 'prompt', text: 'Play the same thing three times. Notice what changes.' },
  { type: 'chord', text: 'Dm — every sad song begins here (or should)' },
  { type: 'prompt', text: 'What would Brian Eno do?' },
  { type: 'chord', text: 'Fmaj7 — play it on the first fret. Let everything ring.' },
  { type: 'prompt', text: 'Don\'t start from the beginning this time' },
  { type: 'chord', text: 'Bb6 — the warmest chord nobody plays' },
  { type: 'prompt', text: 'Play only on the highest two strings for a while' },
  { type: 'chord', text: 'Em9 — spread your fingers wide, let the open strings breathe' },
  { type: 'prompt', text: 'What if silence were the instrument?' },
  { type: 'chord', text: 'Asus2 — two open strings and a question mark' },
  { type: 'prompt', text: 'Play something that sounds like rain on a window' },
  { type: 'chord', text: 'Dbmaj7 — unfamiliar territory. Good.' },
  { type: 'prompt', text: 'Pick a fret you never visit. Stay there.' },
  { type: 'chord', text: 'Gmaj9 — three fingers, five ringing strings, one small universe' },
  { type: 'prompt', text: 'Listen to the room before you start' },
  { type: 'chord', text: 'C/E — walk down to it from G. Feel the gravity.' },
  { type: 'prompt', text: 'What would Jiro do? Repeat one thing until it is perfect.' },
  { type: 'chord', text: 'A7sus4 — it wants to resolve. Make it wait.' },
  { type: 'prompt', text: 'Tune to the sound of your breathing' },
  { type: 'chord', text: 'Dm11 — stack fourths across the neck like a tower' },
  { type: 'prompt', text: 'Play the ugliest chord you know. Find something beautiful in it.' },
  { type: 'chord', text: 'F#m7 — the chord that lives between dreaming and waking' },
  { type: 'prompt', text: 'Remove one note from what you\'re playing. Then another.' },
  { type: 'chord', text: 'Eadd9 — open position, let the B and E strings sing together' },
  { type: 'prompt', text: 'What does this piece forget to say?' },
  { type: 'chord', text: 'Abmaj7 — barre the 4th fret. The whole neck hums.' },
  { type: 'prompt', text: 'Play as if someone were sleeping in the next room' },
  { type: 'chord', text: 'D/F# — a small bassline hidden inside a chord change' },
  { type: 'prompt', text: 'The mistake you just made — play it again, on purpose' },
  { type: 'chord', text: 'Cmaj7#11 — Lydian in one grip. It floats.' },
  { type: 'prompt', text: 'What is the least number of notes this needs?' },
  { type: 'chord', text: 'Bb9 — move your Am7 shape up three frets and barre' },
  { type: 'prompt', text: 'Let the last note decay completely before playing the next' },
  { type: 'chord', text: 'Esus2 — open strings only. The guitar already knows this one.' },
  { type: 'prompt', text: 'Play something you would want to hear through a wall' },
];

// Standard tuning fret positions for scale visualization
export const OPEN_STRINGS = [4, 11, 7, 2, 9, 4]; // E A D G B E (high to low as indexes into NOTES)
export const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'];

// ─── Circle of Fifths ───

export const FIFTHS_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
export const MINOR_FIFTHS = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];

// ─── Tuning Frequencies ───
export const STRING_FREQS = [
  { label: 'E', freq: 329.63 },  // high E
  { label: 'B', freq: 246.94 },
  { label: 'G', freq: 196.00 },
  { label: 'D', freq: 146.83 },
  { label: 'A', freq: 110.00 },
  { label: 'E', freq: 82.41 },   // low E
];

// ─── Intent Categories ───

export const INTENTS = [
  { id: 'scale', label: 'Scale', icon: '\uD83C\uDFB8', desc: 'Notes on the neck' },
  { id: 'chords', label: 'Chords', icon: '\u266B', desc: 'What fits this key' },
  { id: 'circle', label: 'Circle', icon: '\u2299', desc: 'Key relationships' },
  { id: 'ref', label: 'Quick Ref', icon: '\uD83D\uDCD6', desc: 'Common shapes' },
];

// Interval color system: root=blue, 3rd=warm, 5th=neutral, 7th=purple
export const INTERVAL_COLORS = {
  root: 'var(--accent)',   // vivid blue
  third: '#F59E0B',  // warm amber
  fifth: '#64748B',  // neutral slate
  seventh: '#A78BFA', // purple
  other: 'var(--accent)',  // default blue
};

// Common chord shapes for quick ref
export const COMMON_SHAPES = [
  { name: 'E Major', frets: [0, 2, 2, 1, 0, 0] },
  { name: 'A Major', frets: [-1, 0, 2, 2, 2, 0] },
  { name: 'D Major', frets: [-1, -1, 0, 2, 3, 2] },
  { name: 'G Major', frets: [3, 2, 0, 0, 0, 3] },
  { name: 'C Major', frets: [-1, 3, 2, 0, 1, 0] },
  { name: 'Em', frets: [0, 2, 2, 0, 0, 0] },
  { name: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
  { name: 'Dm', frets: [-1, -1, 0, 2, 3, 1] },
  { name: 'F Major', frets: [1, 3, 3, 2, 1, 1] },
  { name: 'B7', frets: [-1, 2, 1, 2, 0, 2] },
  { name: 'E7', frets: [0, 2, 0, 1, 0, 0] },
  { name: 'A7', frets: [-1, 0, 2, 0, 2, 0] },
];

// ─── Chord Voicing Database ───
// Open voicings keyed by note+quality (e.g. "C_major", "F#_minor")
// frets: [E A D G B e] — -1 = muted, 0 = open
// barre: fret number if barre chord

export const OPEN_VOICINGS = {
  'C_major':  { frets: [-1, 3, 2, 0, 1, 0] },
  'D_major':  { frets: [-1, -1, 0, 2, 3, 2] },
  'E_major':  { frets: [0, 2, 2, 1, 0, 0] },
  'F_major':  { frets: [1, 3, 3, 2, 1, 1], barre: 1 },
  'G_major':  { frets: [3, 2, 0, 0, 0, 3] },
  'A_major':  { frets: [-1, 0, 2, 2, 2, 0] },
  'B_major':  { frets: [-1, 2, 4, 4, 4, 2], barre: 2 },
  'C_minor':  { frets: [-1, 3, 5, 5, 4, 3], barre: 3 },
  'D_minor':  { frets: [-1, -1, 0, 2, 3, 1] },
  'E_minor':  { frets: [0, 2, 2, 0, 0, 0] },
  'F_minor':  { frets: [1, 3, 3, 1, 1, 1], barre: 1 },
  'G_minor':  { frets: [3, 5, 5, 3, 3, 3], barre: 3 },
  'A_minor':  { frets: [-1, 0, 2, 2, 1, 0] },
  'B_minor':  { frets: [-1, 2, 4, 4, 3, 2], barre: 2 },
  'C_dim':    { frets: [-1, 3, 4, 2, 4, 2] },
  'D_dim':    { frets: [-1, -1, 0, 1, 3, 1] },
  'E_dim':    { frets: [0, 1, 2, 0, -1, -1] },
  'F_dim':    { frets: [1, 2, 3, 1, -1, -1] },
  'G_dim':    { frets: [3, 4, 5, 3, -1, -1] },
  'A_dim':    { frets: [-1, 0, 1, 2, 1, -1] },
  'B_dim':    { frets: [-1, 2, 3, 4, 3, -1] },
  // Sharps/flats (enharmonic equivalents)
  'C#_major': { frets: [-1, 4, 3, 1, 2, 1], barre: 1 },
  'D#_major': { frets: [-1, -1, 1, 3, 4, 3], barre: 1 },
  'F#_major': { frets: [2, 4, 4, 3, 2, 2], barre: 2 },
  'G#_major': { frets: [4, 6, 6, 5, 4, 4], barre: 4 },
  'A#_major': { frets: [-1, 1, 3, 3, 3, 1], barre: 1 },
  'C#_minor': { frets: [-1, 4, 6, 6, 5, 4], barre: 4 },
  'D#_minor': { frets: [-1, -1, 1, 3, 4, 2] },
  'F#_minor': { frets: [2, 4, 4, 2, 2, 2], barre: 2 },
  'G#_minor': { frets: [4, 6, 6, 4, 4, 4], barre: 4 },
  'A#_minor': { frets: [-1, 1, 3, 3, 2, 1], barre: 1 },
  'C#_dim':   { frets: [-1, 4, 5, 3, 5, 3] },
  'D#_dim':   { frets: [-1, -1, 1, 2, 4, 2] },
  'F#_dim':   { frets: [2, 3, 4, 2, -1, -1] },
  'G#_dim':   { frets: [4, 5, 6, 4, -1, -1] },
  'A#_dim':   { frets: [-1, 1, 2, 3, 2, -1] },
};

// ─── Utility Functions ───

// Diatonic chords for major/minor keys
export function getDiatonicChords(root, scale) {
  const rootIdx = NOTES.indexOf(root);
  const intervals = INTERVALS[scale] || INTERVALS.major;
  const scaleNotes = intervals.map(i => NOTES[(rootIdx + i) % 12]);

  if (scale === 'major') {
    const qualities = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'dim'];
    return scaleNotes.map((note, i) => ({ root: note, quality: qualities[i], numeral: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii\u00B0'][i] }));
  }
  if (scale === 'minor') {
    const qualities = ['minor', 'dim', 'major', 'minor', 'minor', 'major', 'major'];
    return scaleNotes.map((note, i) => ({ root: note, quality: qualities[i], numeral: ['i', 'ii\u00B0', 'III', 'iv', 'v', 'VI', 'VII'][i] }));
  }
  return scaleNotes.map((note) => ({ root: note, quality: 'major', numeral: note }));
}

export function getScaleNotes(root, scale) {
  const rootIdx = NOTES.indexOf(root);
  const intervals = INTERVALS[scale] || INTERVALS.major;
  return intervals.map(i => (rootIdx + i) % 12);
}

// ─── CAGED Position Computation ───

export function getCAGEDPositions(rootIdx) {
  // Root fret on 6th string (open low E = note index 4)
  const rootFret = (rootIdx - 4 + 12) % 12 || 12;
  const shapes = [
    { name: 'E shape', offset: -1 },
    { name: 'D shape', offset: 2 },
    { name: 'C shape', offset: 4 },
    { name: 'A shape', offset: 7 },
    { name: 'G shape', offset: 9 },
  ];
  return shapes.map(s => {
    let start = rootFret + s.offset;
    while (start < 1) start += 12;
    while (start > 12) start -= 12;
    return { name: s.name, startFret: start };
  });
}

// ─── Common Progressions ───
export function getProgressions(scale) {
  if (scale === 'minor' || scale === 'dorian') {
    return [
      { name: 'Minor Pop', numerals: ['i', 'iv', 'VII', 'III'] },
      { name: 'Andalusian', numerals: ['i', 'VI', 'III', 'VII'] },
      { name: 'Natural Minor', numerals: ['i', 'iv', 'v', 'i'] },
    ];
  }
  return [
    { name: 'Pop/Rock', numerals: ['I', 'V', 'vi', 'IV'] },
    { name: 'Blues/Country', numerals: ['I', 'IV', 'V', 'I'] },
    { name: 'Jazz Essential', numerals: ['ii', 'V', 'I'] },
    { name: '50s/Doo-wop', numerals: ['I', 'vi', 'IV', 'V'] },
  ];
}

// E-form and A-form barre chord generators
export function getBarreVoicing(root, quality) {
  const rootIdx = NOTES.indexOf(root);
  // E-form barre (root on 6th string)
  const eFret = (rootIdx - 4 + 12) % 12 || 12;
  // A-form barre (root on 5th string)
  const aFret = (rootIdx - 9 + 12) % 12 || 12;

  if (quality === 'major') {
    return eFret <= 7
      ? { frets: [eFret, eFret + 2, eFret + 2, eFret + 1, eFret, eFret], barre: eFret }
      : { frets: [-1, aFret, aFret + 2, aFret + 2, aFret + 2, aFret], barre: aFret };
  }
  if (quality === 'minor') {
    return eFret <= 7
      ? { frets: [eFret, eFret + 2, eFret + 2, eFret, eFret, eFret], barre: eFret }
      : { frets: [-1, aFret, aFret + 2, aFret + 2, aFret + 1, aFret], barre: aFret };
  }
  return null;
}

// Look up the best voicing for a chord
export function getChordVoicing(root, quality, preferBarre = false) {
  const key = `${root}_${quality}`;
  if (preferBarre) {
    const barre = getBarreVoicing(root, quality);
    if (barre) return barre;
  }
  return OPEN_VOICINGS[key] || getBarreVoicing(root, quality) || { frets: [-1, -1, -1, -1, -1, -1] };
}

export function getIntervalColor(noteIdx, rootIdx, quality) {
  const interval = (noteIdx - rootIdx + 12) % 12;
  if (interval === 0) return INTERVAL_COLORS.root;
  if (interval === 3 || interval === 4) return INTERVAL_COLORS.third; // minor or major 3rd
  if (interval === 7) return INTERVAL_COLORS.fifth;
  if (interval === 10 || interval === 11) return INTERVAL_COLORS.seventh; // minor or major 7th
  return INTERVAL_COLORS.other;
}

// ─── Practice Intelligence ───

// Parse session notes for key/scale mentions
export function parseSessionContext(session) {
  if (!session?.note) return null;
  const note = session.note.toLowerCase();
  const foundRoot = NOTES.find(n => note.includes(n.toLowerCase() + ' ') || note.includes(n.toLowerCase() + 'm'));
  const foundScale = Object.keys(SCALE_NAMES).find(s =>
    note.includes(SCALE_NAMES[s].toLowerCase())
  );
  return { root: foundRoot || null, scale: foundScale || null };
}

// Analyze which keys/scales have been practiced recently
export function analyzePracticeHistory(sessions) {
  if (!sessions?.length) return { recentKeys: {}, recentTags: {}, avgMinutes: 15, lastSession: null };
  const twoWeeksAgo = addDays(today(), -14);
  const recent = sessions.filter(s => s.date >= twoWeeksAgo && !s.fog);
  const sorted = [...sessions].filter(s => !s.fog).sort((a, b) => (b.created_at || b.date).localeCompare(a.created_at || a.date));

  const recentKeys = {};
  const recentTags = {};
  for (const s of recent) {
    const ctx = parseSessionContext(s);
    if (ctx?.root) recentKeys[ctx.root] = (recentKeys[ctx.root] || 0) + 1;
    if (Array.isArray(s.tags)) {
      for (const t of s.tags) recentTags[t] = (recentTags[t] || 0) + 1;
    }
  }

  const totalMins = recent.reduce((sum, s) => sum + s.duration_minutes, 0);
  const avgMinutes = recent.length > 0 ? Math.round(totalMins / recent.length) : 15;

  return { recentKeys, recentTags, avgMinutes, lastSession: sorted[0] || null };
}

// Generate a deterministic "explore" suggestion based on practice gaps
export function getExploreSuggestion(recentKeys) {
  const allKeys = [...NOTES];
  // Find keys NOT practiced recently
  const unpracticed = allKeys.filter(k => !recentKeys[k]);
  if (unpracticed.length === 0) return { root: 'E', scale: 'dorian' }; // fallback to something interesting
  // Pick based on day-of-year for determinism
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const root = unpracticed[dayOfYear % unpracticed.length];
  // Pick an interesting scale they might not know
  const scales = ['pentatonic_minor', 'blues', 'dorian', 'mixolydian', 'minor'];
  const scale = scales[dayOfYear % scales.length];
  return { root, scale };
}

// Generate a challenge: random key + higher BPM
export function getChallengeSuggestion(avgMinutes) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const root = NOTES[(dayOfYear * 7) % 12];
  const progressionSets = [
    { name: 'Pop/Rock', numerals: ['I', 'V', 'vi', 'IV'] },
    { name: 'Blues', numerals: ['I', 'IV', 'V', 'I'] },
    { name: 'Jazz', numerals: ['ii', 'V', 'I'] },
    { name: 'Minor', numerals: ['i', 'iv', 'VII', 'III'] },
  ];
  const prog = progressionSets[(dayOfYear * 3) % progressionSets.length];
  const bpm = Math.round((80 + (dayOfYear % 40)) * 1.1); // slight push
  return { root, progression: prog, bpm };
}

// Dispatch a custom event to start the timer from any component
export function dispatchTimerStart(note) {
  window.dispatchEvent(new CustomEvent('river-start-timer', { detail: { note } }));
}

