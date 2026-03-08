import { useState, useMemo, useCallback, useRef } from 'react';
import { PRACTICE_TAGS, getSessionsByDate, today, addDays } from '../utils/storage';

// ─── Music Theory Data ───

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_DISPLAY = { 'C#': 'C#/Db', 'D#': 'D#/Eb', 'F#': 'F#/Gb', 'G#': 'G#/Ab', 'A#': 'A#/Bb' };

const INTERVALS = {
  major:     [0, 2, 4, 5, 7, 9, 11],
  minor:     [0, 2, 3, 5, 7, 8, 10],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  blues:     [0, 3, 5, 6, 7, 10],
  dorian:    [0, 2, 3, 5, 7, 9, 10],
  mixolydian:[0, 2, 4, 5, 7, 9, 10],
};

const SCALE_NAMES = {
  major: 'Major', minor: 'Natural Minor', pentatonic_major: 'Major Pentatonic',
  pentatonic_minor: 'Minor Pentatonic', blues: 'Blues', dorian: 'Dorian', mixolydian: 'Mixolydian',
};

// Step patterns (semitone distances between consecutive notes)
const STEP_PATTERNS = {
  major: '2-2-1-2-2-2-1',
  minor: '2-1-2-2-1-2-2',
  pentatonic_major: '2-2-3-2-3',
  pentatonic_minor: '3-2-2-3-2',
  blues: '3-2-1-1-3-2',
  dorian: '2-1-2-2-2-1-2',
  mixolydian: '2-2-1-2-2-1-2',
};

// Chord formulas: intervals from root
const CHORD_FORMULAS = {
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

const OBLIQUE_CARDS = [
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

// Diatonic chords for major/minor keys
function getDiatonicChords(root, scale) {
  const rootIdx = NOTES.indexOf(root);
  const intervals = INTERVALS[scale] || INTERVALS.major;
  const scaleNotes = intervals.map(i => NOTES[(rootIdx + i) % 12]);

  if (scale === 'major') {
    const qualities = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'dim'];
    return scaleNotes.map((note, i) => ({ root: note, quality: qualities[i], numeral: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'][i] }));
  }
  if (scale === 'minor') {
    const qualities = ['minor', 'dim', 'major', 'minor', 'minor', 'major', 'major'];
    return scaleNotes.map((note, i) => ({ root: note, quality: qualities[i], numeral: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'][i] }));
  }
  return scaleNotes.map((note) => ({ root: note, quality: 'major', numeral: note }));
}

// Standard tuning fret positions for scale visualization
const OPEN_STRINGS = [4, 11, 7, 2, 9, 4]; // E A D G B E (high to low as indexes into NOTES)
const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'];

function getScaleNotes(root, scale) {
  const rootIdx = NOTES.indexOf(root);
  const intervals = INTERVALS[scale] || INTERVALS.major;
  return intervals.map(i => (rootIdx + i) % 12);
}

// ─── CAGED Position Computation ───

function getCAGEDPositions(rootIdx) {
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

// ─── Circle of Fifths ───

const FIFTHS_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
const MINOR_FIFTHS = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];

// ─── Tuning Frequencies ───
const STRING_FREQS = [
  { label: 'E', freq: 329.63 },  // high E
  { label: 'B', freq: 246.94 },
  { label: 'G', freq: 196.00 },
  { label: 'D', freq: 146.83 },
  { label: 'A', freq: 110.00 },
  { label: 'E', freq: 82.41 },   // low E
];

// ─── Common Progressions ───
function getProgressions(scale) {
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

// ─── Intent Categories ───

const INTENTS = [
  { id: 'chords', label: 'Chords', icon: '♫', desc: 'What fits this key' },
  { id: 'scale', label: 'Scale', icon: '🎸', desc: 'Notes on the neck' },
  { id: 'circle', label: 'Circle', icon: '⊙', desc: 'Key relationships' },
  { id: 'ref', label: 'Quick Ref', icon: '📖', desc: 'Common shapes' },
];

// ─── Components ───

function FretboardDiagram({ scaleNoteIndexes, rootIdx, showDegrees, highlightRange }) {
  const FRETS = 15;
  const STRINGS = 6;
  const LEFT = 32;
  const NUT_W = 4;
  const BASE_FRET_W = 52;
  const STRING_GAP = 28;
  const TOP = 30;
  const DOT_R = 11;
  const STRING_THICKNESS = [0.8, 1, 1.2, 1.6, 2, 2.4];
  const MARKERS = [3, 5, 7, 9, 12, 15];
  const DOUBLE_MARKERS = [12];

  // Proportional fret spacing (Luthier's Blueprint: fretWidth(n) = BASE * 0.9439^n)
  const fretWidths = useMemo(() => {
    const widths = [];
    for (let i = 0; i < FRETS; i++) {
      widths.push(BASE_FRET_W * Math.pow(0.9439, i));
    }
    return widths;
  }, []);

  // Cumulative positions for fret lines
  const fretPositions = useMemo(() => {
    const positions = [LEFT + NUT_W]; // fret 0 line = right edge of nut
    let x = LEFT + NUT_W;
    for (let i = 0; i < FRETS; i++) {
      x += fretWidths[i];
      positions.push(x);
    }
    return positions;
  }, [fretWidths]);

  const W = fretPositions[FRETS] + 10;
  const H = TOP + (STRINGS - 1) * STRING_GAP + 40;

  const fretX = (f) => {
    if (f <= 0) return LEFT + NUT_W;
    const left = fretPositions[f - 1];
    const right = fretPositions[f];
    return (left + right) / 2;
  };
  const fretLineX = (f) => fretPositions[f];
  const stringY = (s) => TOP + s * STRING_GAP;

  // Build degree lookup: noteIdx → degree string
  const degreeLookup = {};
  const DEGREE_LABELS = ['1', '2', '3', '4', '5', '6', '7'];
  scaleNoteIndexes.forEach((idx, i) => {
    degreeLookup[idx] = DEGREE_LABELS[i] || String(i + 1);
  });

  // Is a fret within the highlight range?
  const inRange = (f) => {
    if (!highlightRange) return true;
    return f >= highlightRange.start && f < highlightRange.start + highlightRange.span;
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4 pb-2">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
        {/* Fretboard wood background */}
        <rect x={LEFT} y={TOP - 6} width={W - LEFT - 6} height={(STRINGS - 1) * STRING_GAP + 12} rx="4"
          fill="currentColor" className="text-dry/60" />

        {/* Nut */}
        <rect x={LEFT} y={TOP - 6} width={NUT_W} height={(STRINGS - 1) * STRING_GAP + 12} rx="1"
          fill="currentColor" className="text-text-2" />

        {/* Highlight range overlay */}
        {highlightRange && (
          <rect
            x={fretLineX(highlightRange.start - 1) + 1}
            y={TOP - 6}
            width={fretLineX(highlightRange.start - 1 + highlightRange.span) - fretLineX(highlightRange.start - 1) - 2}
            height={(STRINGS - 1) * STRING_GAP + 12}
            rx="3"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
          />
        )}

        {/* Fret wires */}
        {Array.from({ length: FRETS }, (_, f) => (
          <line key={f} x1={fretLineX(f + 1)} y1={TOP - 5} x2={fretLineX(f + 1)} y2={TOP + (STRINGS - 1) * STRING_GAP + 5}
            stroke="currentColor" className="text-dry-bank" strokeWidth="1.5" />
        ))}

        {/* Fret markers (inlays) */}
        {MARKERS.filter(f => f <= FRETS).map(f => {
          const cx = fretX(f);
          const cy = TOP + (STRINGS - 1) * STRING_GAP / 2;
          if (DOUBLE_MARKERS.includes(f)) {
            return (
              <g key={`m${f}`}>
                <circle cx={cx} cy={cy - STRING_GAP * 0.8} r={4} fill="currentColor" className="text-text-3/20" />
                <circle cx={cx} cy={cy + STRING_GAP * 0.8} r={4} fill="currentColor" className="text-text-3/20" />
              </g>
            );
          }
          return <circle key={`m${f}`} cx={cx} cy={cy} r={4} fill="currentColor" className="text-text-3/20" />;
        })}

        {/* Fret numbers */}
        {Array.from({ length: FRETS }, (_, f) => (
          <text key={f} x={fretX(f + 1)} y={TOP - 16} textAnchor="middle" fontSize="10"
            fill="currentColor" className="text-text-3" fontWeight="500">
            {f + 1}
          </text>
        ))}

        {/* Open string indicators (O = in scale, X = not in scale) */}
        {OPEN_STRINGS.map((openNote, s) => {
          const isInScale = scaleNoteIndexes.includes(openNote);
          return (
            <text key={`open-${s}`} x={LEFT + NUT_W / 2} y={stringY(s) - 16}
              textAnchor="middle" fontSize="9" fontWeight="600"
              fill={isInScale ? '#3B82F6' : '#A8A29E'}>
              {isInScale ? 'O' : 'X'}
            </text>
          );
        })}

        {/* Strings */}
        {Array.from({ length: STRINGS }, (_, s) => (
          <line key={s} x1={LEFT + NUT_W} y1={stringY(s)} x2={W - 6} y2={stringY(s)}
            stroke="currentColor" className="text-text-3/50" strokeWidth={STRING_THICKNESS[s]} />
        ))}

        {/* String labels */}
        {STRING_LABELS.map((label, s) => (
          <text key={s} x={LEFT - 8} y={stringY(s) + 1} textAnchor="end" dominantBaseline="central"
            fontSize="11" fill="currentColor" className="text-text-3" fontWeight="600" fontFamily="monospace">
            {label}
          </text>
        ))}

        {/* Note dots */}
        {OPEN_STRINGS.map((openNote, s) =>
          Array.from({ length: FRETS + 1 }, (_, f) => {
            const noteIdx = (openNote + f) % 12;
            if (!scaleNoteIndexes.includes(noteIdx)) return null;
            const isRoot = noteIdx === rootIdx;
            if (f === 0) return null; // open strings shown via O/X indicators
            const dimmed = !inRange(f);
            const cx = fretX(f);
            const cy = stringY(s);
            const label = showDegrees ? degreeLookup[noteIdx] : NOTES[noteIdx];
            return (
              <g key={`${s}-${f}`} opacity={dimmed ? 0.2 : 1}>
                {isRoot && !dimmed && (
                  <circle cx={cx} cy={cy} r={DOT_R + 2} fill="rgba(59,130,246,0.15)" />
                )}
                <circle cx={cx} cy={cy} r={DOT_R}
                  fill={isRoot ? '#2563EB' : 'rgba(59,130,246,0.15)'}
                  stroke={isRoot ? 'none' : 'rgba(59,130,246,0.4)'}
                  strokeWidth="1" />
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
                  fontSize="9" fontWeight="700"
                  fill={isRoot ? 'white' : '#3B82F6'}>
                  {label}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

function PositionDiagram({ scaleNoteIndexes, rootIdx, startFret, name }) {
  const FRETS_SHOWN = 5;
  const STR_GAP = 9;
  const FRET_GAP = 12;
  const PAD_L = 12;
  const PAD_T = 2;
  const DOT_R = 3.5;
  const W = PAD_L + 5 * STR_GAP + 6;
  const H = PAD_T + FRETS_SHOWN * FRET_GAP + 6;

  return (
    <div className="text-center flex-1 min-w-0">
      <p className="text-[8px] font-semibold text-text-3 mb-0.5 truncate">{name}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: '66px' }}>
        <text x={5} y={PAD_T + FRET_GAP * 0.5} fontSize="5" fill="#A8A29E" textAnchor="middle" dominantBaseline="central">
          {startFret}
        </text>
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L + 5 * STR_GAP} y2={PAD_T}
          stroke="#78716C" strokeWidth={startFret <= 1 ? 2.5 : 0.5} />
        {Array.from({ length: FRETS_SHOWN }, (_, i) => (
          <line key={i} x1={PAD_L} y1={PAD_T + (i + 1) * FRET_GAP} x2={PAD_L + 5 * STR_GAP} y2={PAD_T + (i + 1) * FRET_GAP}
            stroke="#78716C" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={PAD_L + i * STR_GAP} y1={PAD_T} x2={PAD_L + i * STR_GAP} y2={PAD_T + FRETS_SHOWN * FRET_GAP}
            stroke="#78716C" strokeWidth={0.6 + (5 - i) * 0.12} />
        ))}
        {OPEN_STRINGS.map((openNote, stringIdx) => {
          const xPos = 5 - stringIdx;
          return Array.from({ length: FRETS_SHOWN }, (_, f) => {
            const fret = startFret + f;
            const noteIdx = (openNote + fret) % 12;
            if (!scaleNoteIndexes.includes(noteIdx)) return null;
            const isRoot = noteIdx === rootIdx;
            const cx = PAD_L + xPos * STR_GAP;
            const cy = PAD_T + (f + 0.5) * FRET_GAP;
            return (
              <g key={`${stringIdx}-${f}`}>
                <circle cx={cx} cy={cy} r={DOT_R}
                  fill={isRoot ? '#2563EB' : 'rgba(59,130,246,0.35)'}
                  stroke={isRoot ? 'none' : 'rgba(59,130,246,0.5)'}
                  strokeWidth="0.5" />
                <text x={cx} y={cy + 0.3} textAnchor="middle" dominantBaseline="central"
                  fontSize="3" fontWeight="700" fill={isRoot ? 'white' : '#1e40af'}>
                  {NOTES[noteIdx]}
                </text>
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
}

function ChordCard({ root, quality, numeral, showBarre = false, showIntervals = false }) {
  const name = quality === 'major' ? root : quality === 'minor' ? `${root}m` : `${root}${quality}`;
  const voicing = getChordVoicing(root, quality, showBarre);
  const rootIdx = NOTES.indexOf(root);

  return (
    <div className="card px-2 py-2 text-center">
      <p className="text-[9px] text-text-3 font-medium mb-0.5">{numeral}</p>
      <ChordDiagram
        name={name}
        frets={voicing.frets}
        barre={voicing.barre}
        rootIdx={rootIdx}
        showIntervals={showIntervals}
      />
      <p className="text-[8px] text-text-3 mt-0.5">
        {CHORD_FORMULAS[quality]?.map(i => NOTES[(rootIdx + i) % 12]).join(' · ')}
      </p>
    </div>
  );
}

function CircleOfFifths({ selectedRoot, onSelect }) {
  const radius = 100;
  const center = 120;
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
      {/* Outer ring labels — major keys */}
      {FIFTHS_ORDER.map((note, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const isSelected = note === selectedRoot;
        return (
          <g key={note} onClick={() => onSelect(note)} className="cursor-pointer">
            <circle cx={x} cy={y} r={isSelected ? 16 : 13} fill={isSelected ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'} stroke={isSelected ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={isSelected ? '#60A5FA' : '#A8A29E'} fontSize="10" fontWeight={isSelected ? '700' : '500'}>
              {note}
            </text>
          </g>
        );
      })}
      {/* Inner ring — relative minor */}
      {MINOR_FIFTHS.map((note, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const innerR = 60;
        const x = center + innerR * Math.cos(angle);
        const y = center + innerR * Math.sin(angle);
        return (
          <g key={`m-${note}`} onClick={() => onSelect(note)} className="cursor-pointer">
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#A78BFA" fontSize="8" fontWeight="500">
              {note}m
            </text>
          </g>
        );
      })}
      {/* Center label */}
      <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fill="#57534E" fontSize="8" fontWeight="600">
        FIFTHS
      </text>
    </svg>
  );
}

// ─── Chord Voicing Database ───
// Open voicings keyed by note+quality (e.g. "C_major", "F#_minor")
// frets: [E A D G B e] — -1 = muted, 0 = open
// fingers: optional finger numbers for display
// barre: fret number if barre chord

const OPEN_VOICINGS = {
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

// E-form and A-form barre chord generators
function getBarreVoicing(root, quality) {
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
function getChordVoicing(root, quality, preferBarre = false) {
  const key = `${root}_${quality}`;
  if (preferBarre) {
    const barre = getBarreVoicing(root, quality);
    if (barre) return barre;
  }
  return OPEN_VOICINGS[key] || getBarreVoicing(root, quality) || { frets: [-1, -1, -1, -1, -1, -1] };
}

// Interval color system: root=blue, 3rd=warm, 5th=neutral, 7th=purple
const INTERVAL_COLORS = {
  root: '#2563EB',   // vivid blue
  third: '#F59E0B',  // warm amber
  fifth: '#64748B',  // neutral slate
  seventh: '#A78BFA', // purple
  other: '#3B82F6',  // default blue
};

function getIntervalColor(noteIdx, rootIdx, quality) {
  const interval = (noteIdx - rootIdx + 12) % 12;
  if (interval === 0) return INTERVAL_COLORS.root;
  if (interval === 3 || interval === 4) return INTERVAL_COLORS.third; // minor or major 3rd
  if (interval === 7) return INTERVAL_COLORS.fifth;
  if (interval === 10 || interval === 11) return INTERVAL_COLORS.seventh; // minor or major 7th
  return INTERVAL_COLORS.other;
}

// Common chord shapes for quick ref (kept for backward compat)
const COMMON_SHAPES = [
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

function ChordDiagram({ name, frets, rootIdx, barre, showIntervals = false }) {
  const FRETS_SHOWN = 4;
  const playedFrets = frets.filter(f => f > 0);
  const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 0;
  const offset = minFret > 2 ? minFret - 1 : 0;

  return (
    <div className="text-center">
      <p className="text-[10px] font-bold text-text-2 mb-1">{name}</p>
      <svg viewBox="0 0 50 60" className="w-14 mx-auto">
        {/* Nut or position indicator */}
        {offset === 0 ? (
          <rect x="8" y="8" width="34" height="2.5" rx="0.5" fill="currentColor" className="text-text-2" />
        ) : (
          <text x="4" y="18" fontSize="6" fill="#A8A29E" textAnchor="middle" fontWeight="600">{offset + 1}</text>
        )}
        {/* Barre indicator */}
        {barre && barre > offset && (
          <rect
            x="7" y={10 + (barre - offset - 0.5) * 10 - 2.5}
            width="36" height="5" rx="2.5"
            fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"
          />
        )}
        {/* Fret lines */}
        {Array.from({ length: FRETS_SHOWN + 1 }, (_, i) => (
          <line key={i} x1="8" y1={10 + i * 10} x2="42" y2={10 + i * 10} stroke="#57534E" strokeWidth="0.5" />
        ))}
        {/* String lines with gauge variation */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={8 + i * 6.8} y1="10" x2={8 + i * 6.8} y2={10 + FRETS_SHOWN * 10}
            stroke="#57534E" strokeWidth={0.4 + (5 - i) * 0.08} />
        ))}
        {/* Finger positions with interval colors */}
        {frets.map((f, i) => {
          const x = 8 + i * 6.8;
          if (f === -1) return <text key={i} x={x} y="6" fontSize="6" textAnchor="middle" fill="#E8735A">×</text>;
          if (f === 0) return <circle key={i} cx={x} cy="6" r="2" fill="none" stroke="#A8A29E" strokeWidth="0.6" />;
          const y = 10 + (f - offset - 0.5) * 10;
          // Determine interval color
          const noteIdx = (OPEN_STRINGS[i] + f) % 12;
          const color = showIntervals && rootIdx != null
            ? getIntervalColor(noteIdx, rootIdx, 'major')
            : '#3B82F6';
          const isRoot = rootIdx != null && noteIdx === rootIdx;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isRoot ? 3.2 : 2.5} fill={color} />
              {isRoot && <circle cx={x} cy={y} r={3.2} fill="none" stroke="white" strokeWidth="0.4" opacity={0.5} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Tuning Strip Component ───

function TuningStrip() {
  const audioCtxRef = useRef(null);
  const activeOscRef = useRef(null);

  const playString = useCallback((freq) => {
    // Stop previous
    if (activeOscRef.current) {
      try { activeOscRef.current.stop(); } catch {}
      activeOscRef.current = null;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2);
    activeOscRef.current = osc;
  }, []);

  return (
    <div className="flex gap-1.5 mb-4">
      {STRING_FREQS.map((s, i) => (
        <button
          key={i}
          onClick={() => playString(s.freq)}
          className="flex-1 card py-2 text-center active:scale-95 transition-all"
        >
          <span className="text-xs font-bold text-text-2">{s.label}</span>
          <span className="text-[8px] text-text-3 block">{i === 0 ? 'hi' : i === 5 ? 'lo' : ''}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Progression Strip Component ───

// Dispatch a custom event to start the timer from any component
function dispatchTimerStart(note) {
  window.dispatchEvent(new CustomEvent('river-start-timer', { detail: { note } }));
}

function ProgressionStrips({ rootNote, scale, diatonicChords }) {
  const progressions = useMemo(() => getProgressions(scale), [scale]);

  // Map numeral to chord name
  const numeralToChord = useCallback((numeral) => {
    const clean = numeral.replace('°', '');
    const chord = diatonicChords.find(c => c.numeral.replace('°', '') === clean);
    if (!chord) return numeral;
    return chord.quality === 'major' ? chord.root : `${chord.root}m`;
  }, [diatonicChords]);

  // Highlight the progression (no auto-timer — user starts timer themselves)
  const [activeProg, setActiveProg] = useState(null);
  const handlePractice = useCallback((prog) => {
    setActiveProg(prev => prev === prog.name ? null : prog.name);
  }, []);

  return (
    <div className="space-y-2">
      {progressions.map((prog, i) => (
        <div key={i} className="card px-3 py-2.5 flex items-center gap-2">
          <span className="text-[9px] text-text-3 font-medium w-14 shrink-0">{prog.name}</span>
          <div className="flex gap-1.5 flex-1">
            {prog.numerals.map((num, j) => (
              <div key={j} className="flex-1 text-center">
                <span className="text-[8px] text-text-3 block">{num}</span>
                <span className="text-xs font-bold text-water-4">{numeralToChord(num)}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => handlePractice(prog)}
            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all ${
              activeProg === prog.name ? 'ring-2 ring-water-4' : ''
            }`}
            style={{ background: activeProg === prog.name
              ? 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,1))'
              : 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(30,64,175,0.5))'
            }}
            aria-label={`Highlight ${prog.name} progression`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Practice Intelligence ───

// Parse session notes for key/scale mentions
function parseSessionContext(session) {
  if (!session?.note) return null;
  const note = session.note.toLowerCase();
  const foundRoot = NOTES.find(n => note.includes(n.toLowerCase() + ' ') || note.includes(n.toLowerCase() + 'm'));
  const foundScale = Object.keys(SCALE_NAMES).find(s =>
    note.includes(SCALE_NAMES[s].toLowerCase())
  );
  return { root: foundRoot || null, scale: foundScale || null };
}

// Analyze which keys/scales have been practiced recently
function analyzePracticeHistory(sessions) {
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
function getExploreSuggestion(recentKeys) {
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
function getChallengeSuggestion(avgMinutes) {
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

// ─── Quick Start Component ───

function QuickStartCards({ sessions, onSetRoot, onSetScale }) {
  const analysis = useMemo(() => analyzePracticeHistory(sessions), [sessions]);

  if (!sessions?.length) return null;

  const continueCtx = parseSessionContext(analysis.lastSession);
  const explore = getExploreSuggestion(analysis.recentKeys);
  const challenge = getChallengeSuggestion(analysis.avgMinutes);

  const cards = [
    {
      id: 'continue',
      label: 'Continue',
      sublabel: continueCtx?.root
        ? `${continueCtx.root} ${continueCtx.scale ? SCALE_NAMES[continueCtx.scale] : 'Major'}`
        : analysis.lastSession?.tags?.[0] || 'Last session',
      icon: '→',
      action: () => {
        if (continueCtx?.root) onSetRoot(continueCtx.root);
        if (continueCtx?.scale) onSetScale(continueCtx.scale);
      },
    },
    {
      id: 'explore',
      label: 'Explore',
      sublabel: `${explore.root} ${SCALE_NAMES[explore.scale]}`,
      icon: '◇',
      action: () => {
        onSetRoot(explore.root);
        onSetScale(explore.scale);
      },
    },
    {
      id: 'challenge',
      label: 'Challenge',
      sublabel: `${challenge.root} · ${challenge.progression.name} · ${challenge.bpm} BPM`,
      icon: '⚡',
      action: () => {
        onSetRoot(challenge.root);
      },
    },
  ];

  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
      {cards.map(card => (
        <button
          key={card.id}
          onClick={card.action}
          className="flex-1 min-w-[100px] card px-3 py-2.5 text-left active:scale-95 transition-all group"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-water-4 text-xs">{card.icon}</span>
            <span className="text-[10px] font-semibold text-text-2 uppercase tracking-wide">{card.label}</span>
          </div>
          <p className="text-[9px] text-text-3 truncate leading-tight">{card.sublabel}</p>
        </button>
      ))}
    </div>
  );
}

// ─── Current Card Component ───

function CurrentCard({ sessions, onSetRoot, onSetScale, onSetIntent }) {
  const analysis = useMemo(() => analyzePracticeHistory(sessions), [sessions]);

  if (!sessions?.length || sessions.length < 3) return null;

  // Determine suggestion based on practice gaps
  const explore = getExploreSuggestion(analysis.recentKeys);

  // Find the least-practiced tag
  const tagCounts = analysis.recentTags;
  const leastTag = PRACTICE_TAGS.find(t => !tagCounts[t]) ||
    PRACTICE_TAGS.reduce((min, t) => (tagCounts[t] || 0) < (tagCounts[min] || 0) ? t : min, PRACTICE_TAGS[0]);

  // Build suggestion text
  const suggestion = `Try ${explore.root} ${SCALE_NAMES[explore.scale]} — focus on ${leastTag}`;

  const handleFlow = useCallback(() => {
    onSetRoot(explore.root);
    onSetScale(explore.scale);
    onSetIntent('scale');
  }, [explore, onSetRoot, onSetScale, onSetIntent]);

  const handleStartTimer = useCallback((e) => {
    e.stopPropagation();
    dispatchTimerStart(`${explore.root} ${SCALE_NAMES[explore.scale]} — ${leastTag}`);
  }, [explore, leastTag]);

  return (
    <div
      className="w-full card p-4 mb-5 text-left active:scale-[0.98] transition-all group"
      style={{ borderLeft: '3px solid rgba(59,130,246,0.4)' }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-water-4 uppercase tracking-widest">The Current</span>
      </div>
      <button onClick={handleFlow} className="text-left w-full">
        <p className="text-sm text-text font-medium">{suggestion}</p>
        <p className="text-[9px] text-text-3 mt-1">Based on your last {Math.min(sessions.length, 14)} sessions</p>
      </button>
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handleStartTimer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))' }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
          Flow
        </button>
        <button
          onClick={handleFlow}
          className="px-3 py-1.5 rounded-full text-[10px] font-medium text-text-3 active:scale-95 transition-all"
        >
          Load reference
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function ShedPage({ sessions = [], onNavigate }) {
  const [rootNote, setRootNote] = useState('C');
  const [scale, setScale] = useState('major');
  const [intent, setIntent] = useState('chords');
  const [showDegrees, setShowDegrees] = useState(false);
  const [activePosition, setActivePosition] = useState(null);
  const [showBarre, setShowBarre] = useState(false);
  const [showIntervals, setShowIntervals] = useState(true);
  const [obliqueDismissed, setObliqueDismissed] = useState(false);

  // Pick today's oblique card (changes daily, consistent within a day)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const obliqueCard = OBLIQUE_CARDS[dayOfYear % OBLIQUE_CARDS.length];

  const rootIdx = NOTES.indexOf(rootNote);
  const scaleNoteIndexes = useMemo(() => getScaleNotes(rootNote, scale), [rootNote, scale]);
  const diatonicChords = useMemo(() => getDiatonicChords(rootNote, scale), [rootNote, scale]);
  const positions = useMemo(() =>
    getCAGEDPositions(rootIdx).sort((a, b) => a.startFret - b.startFret),
    [rootIdx]
  );
  const highlightRange = activePosition != null
    ? { start: positions[activePosition].startFret, span: 5 }
    : null;

  return (
    <div className="px-4 pt-14 pb-24">
      {/* Oblique Strategy Card */}
      {!obliqueDismissed && (
        <div
          className="relative mb-4 px-4 py-3.5 rounded-xl border border-water-3/15"
          style={{
            transform: 'rotate(-0.5deg)',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.04), rgba(147,130,220,0.06))',
          }}
        >
          <button
            onClick={() => setObliqueDismissed(true)}
            className="absolute top-2 right-2.5 w-6 h-6 flex items-center justify-center rounded-full text-text-3/50 hover:text-text-3 transition-colors"
            aria-label="Dismiss card"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <p className="text-[9px] uppercase tracking-widest text-text-3/60 font-semibold mb-1.5">
            {obliqueCard.type === 'chord' ? 'Today\u2019s Chord' : 'Today\u2019s Prompt'}
          </p>
          <p className="font-serif italic text-text text-sm leading-relaxed pr-6">
            {obliqueCard.text}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text">Ready</h1>
        <p className="text-xs text-text-3 mt-0.5">Your launchpad — reference and play</p>
      </div>

      {/* The Current — smart practice suggestion */}
      <CurrentCard
        sessions={sessions}
        onSetRoot={setRootNote}
        onSetScale={setScale}
        onSetIntent={setIntent}
      />

      {/* Quick Start triptych */}
      <QuickStartCards
        sessions={sessions}
        onSetRoot={setRootNote}
        onSetScale={setScale}
      />

      {/* Tuning Strip */}
      <TuningStrip />

      {/* Root Lock — key selector */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-3">Root Lock</p>
          <div className="flex-1 h-px bg-dry" />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          {NOTES.map(note => (
            <button
              key={note}
              onClick={() => setRootNote(note)}
              className={`shrink-0 w-9 h-9 rounded-full text-xs font-bold transition-all active:scale-90 ${
                note === rootNote
                  ? 'text-white'
                  : 'card text-text-2'
              }`}
              style={note === rootNote ? {
                background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                boxShadow: '0 2px 10px rgba(59,130,246,0.3)',
              } : undefined}
            >
              {NOTE_DISPLAY[note] ? note.replace('#', '#') : note}
            </button>
          ))}
        </div>
        {/* Scale selector */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
          {Object.keys(SCALE_NAMES).map(s => (
            <button
              key={s}
              onClick={() => setScale(s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all active:scale-95 ${
                s === scale
                  ? 'bg-water-2/20 text-water-5'
                  : 'text-text-3 hover:text-text-2'
              }`}
            >
              {SCALE_NAMES[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Intent navigation */}
      <div className="flex gap-1 mb-5">
        {INTENTS.map(i => (
          <button
            key={i.id}
            onClick={() => setIntent(i.id)}
            className={`flex-1 py-2 rounded-xl text-center transition-all active:scale-95 ${
              i.id === intent ? 'card border border-water-3/20' : 'text-text-3'
            }`}
          >
            <div className="text-sm mb-0.5">{i.icon}</div>
            <div className={`text-[10px] font-semibold ${i.id === intent ? 'text-text' : 'text-text-3'}`}>{i.label}</div>
          </button>
        ))}
      </div>

      {/* Content based on intent */}
      {intent === 'chords' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-text-3">
              Diatonic chords in <span className="text-water-4 font-semibold">{rootNote} {SCALE_NAMES[scale]}</span>
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowBarre(b => !b)}
                className={`px-2 py-1 rounded-full text-[9px] font-semibold transition-all active:scale-95 ${
                  showBarre ? 'bg-water-2/20 text-water-5' : 'card text-text-3'
                }`}
              >
                Barre
              </button>
              <button
                onClick={() => setShowIntervals(v => !v)}
                className={`px-2 py-1 rounded-full text-[9px] font-semibold transition-all active:scale-95 ${
                  showIntervals ? 'bg-water-2/20 text-water-5' : 'card text-text-3'
                }`}
              >
                Colors
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {diatonicChords.map((chord, i) => (
              <ChordCard key={i} {...chord} showBarre={showBarre} showIntervals={showIntervals} />
            ))}
          </div>

          {/* Progressions */}
          <div className="flex items-center gap-2 mt-6 mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-3">Progressions</p>
            <div className="flex-1 h-px bg-dry" />
          </div>
          <ProgressionStrips rootNote={rootNote} scale={scale} diatonicChords={diatonicChords} />

          <p className="text-xs text-text-3 mb-2 mt-6">Scale notes</p>
          <div className="flex gap-1.5 mb-2">
            {scaleNoteIndexes.map((idx, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-water-4 text-white' : 'card text-text-2'
                }`}
              >
                {NOTES[idx]}
              </div>
            ))}
          </div>
        </div>
      )}

      {intent === 'scale' && (
        <div>
          {/* Header with step pattern */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-text-3">
              <span className="text-water-4 font-semibold">{rootNote} {SCALE_NAMES[scale]}</span> on the fretboard
            </p>
            <button
              onClick={() => setShowDegrees(d => !d)}
              className={`px-2.5 py-1 rounded-full text-[9px] font-semibold transition-all active:scale-95 ${
                showDegrees ? 'bg-water-2/20 text-water-5' : 'card text-text-3'
              }`}
            >
              {showDegrees ? '1 2 3' : 'A B C'}
            </button>
          </div>

          {/* Scale formula */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[9px] text-text-3 font-medium">Formula:</span>
            <div className="flex gap-0.5">
              {STEP_PATTERNS[scale]?.split('-').map((step, i) => (
                <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                  step === '1' ? 'bg-coral/15 text-coral' : step === '2' ? 'bg-water-2/15 text-water-5' : 'bg-lavender/15 text-lavender'
                }`}>
                  {step}
                </span>
              ))}
            </div>
            <span className="text-[8px] text-text-3 ml-1">(semitones)</span>
          </div>

          <div className="card p-3 mb-4">
            <FretboardDiagram
              scaleNoteIndexes={scaleNoteIndexes}
              rootIdx={rootIdx}
              showDegrees={showDegrees}
              highlightRange={highlightRange}
            />
          </div>

          {/* CAGED Position Diagrams (sorted by fret, tappable) */}
          <div className="flex items-center gap-2 mt-5 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-3">Positions</p>
            <div className="flex-1 h-px bg-dry" />
            {activePosition != null && (
              <button
                onClick={() => setActivePosition(null)}
                className="text-[9px] text-water-4 font-semibold"
              >
                Show all
              </button>
            )}
          </div>
          <div className="card p-3">
            <div className="flex gap-1">
              {positions.map((pos, i) => (
                <div
                  key={pos.name}
                  onClick={() => setActivePosition(activePosition === i ? null : i)}
                  className={`cursor-pointer transition-all rounded-lg ${
                    activePosition === i ? 'ring-1 ring-water-4/40 bg-water-2/5' :
                    activePosition != null ? 'opacity-40' : ''
                  }`}
                >
                  <PositionDiagram
                    scaleNoteIndexes={scaleNoteIndexes}
                    rootIdx={rootIdx}
                    startFret={pos.startFret}
                    name={pos.name}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale degrees */}
          <div className="flex gap-1.5 flex-wrap mt-4">
            {scaleNoteIndexes.map((idx, i) => {
              const degree = ['1', '2', '3', '4', '5', '6', '7', 'b2', 'b3', '#4', 'b5', 'b6', 'b7'][i] || (i + 1);
              return (
                <div key={i} className="card px-2.5 py-1.5 text-center">
                  <p className="text-[9px] text-text-3">{degree}</p>
                  <p className={`text-xs font-bold ${i === 0 ? 'text-water-4' : 'text-text-2'}`}>{NOTES[idx]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {intent === 'circle' && (
        <div>
          <p className="text-xs text-text-3 mb-3">Tap a key to change Root Lock</p>
          <div className="card p-4 mb-4">
            <CircleOfFifths selectedRoot={rootNote} onSelect={setRootNote} />
          </div>
          <p className="text-[10px] text-text-3 text-center">
            Outer: major keys · Inner: relative minor · Adjacent keys share 6 of 7 notes
          </p>
        </div>
      )}

      {intent === 'ref' && (
        <div>
          <p className="text-xs text-text-3 mb-3">Common open chord shapes</p>
          <div className="grid grid-cols-4 gap-3">
            {COMMON_SHAPES.map(shape => (
              <ChordDiagram key={shape.name} {...shape} />
            ))}
          </div>
        </div>
      )}

      {/* Easter egg */}
      <p className="text-center text-text-3/30 text-[9px] mt-12 italic">
        If the answer isn&apos;t here, just play the blues in E and look confident.
      </p>
    </div>
  );
}
