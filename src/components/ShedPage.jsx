import { useState, useMemo, useCallback, useRef } from 'react';

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

function ChordCard({ root, quality, numeral }) {
  const name = quality === 'major' ? root : quality === 'minor' ? `${root}m` : `${root}${quality}`;
  const qualityColor = quality === 'major' ? 'text-water-4' : quality === 'minor' ? 'text-lavender' : 'text-coral';
  return (
    <div className="card px-3 py-2.5 text-center">
      <p className="text-[10px] text-text-3 font-medium mb-0.5">{numeral}</p>
      <p className={`text-sm font-bold ${qualityColor}`}>{name}</p>
      <p className="text-[9px] text-text-3 mt-0.5">
        {CHORD_FORMULAS[quality]?.map(i => NOTES[(NOTES.indexOf(root) + i) % 12]).join(' · ')}
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

// Common chord shapes for quick ref
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

function ChordDiagram({ name, frets }) {
  const FRETS_SHOWN = 4;
  const minFret = Math.max(0, Math.min(...frets.filter(f => f > 0)));
  const offset = minFret > 2 ? minFret - 1 : 0;

  return (
    <div className="text-center">
      <p className="text-[10px] font-bold text-text-2 mb-1">{name}</p>
      <svg viewBox="0 0 50 56" className="w-12 mx-auto">
        {/* Nut or position indicator */}
        {offset === 0 ? (
          <rect x="8" y="8" width="34" height="2" fill="currentColor" className="text-text-2" />
        ) : (
          <text x="5" y="18" fontSize="6" fill="#A8A29E" textAnchor="middle">{offset + 1}</text>
        )}
        {/* Fret lines */}
        {Array.from({ length: FRETS_SHOWN + 1 }, (_, i) => (
          <line key={i} x1="8" y1={10 + i * 10} x2="42" y2={10 + i * 10} stroke="#57534E" strokeWidth="0.5" />
        ))}
        {/* String lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={8 + i * 6.8} y1="10" x2={8 + i * 6.8} y2={10 + FRETS_SHOWN * 10} stroke="#57534E" strokeWidth="0.5" />
        ))}
        {/* Finger positions */}
        {frets.map((f, i) => {
          const x = 8 + i * 6.8;
          if (f === -1) return <text key={i} x={x} y="6" fontSize="6" textAnchor="middle" fill="#E8735A">×</text>;
          if (f === 0) return <circle key={i} cx={x} cy="6" r="2" fill="none" stroke="#A8A29E" strokeWidth="0.5" />;
          const y = 10 + (f - offset - 0.5) * 10;
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#3B82F6" />;
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

function ProgressionStrips({ rootNote, scale, diatonicChords }) {
  const progressions = useMemo(() => getProgressions(scale), [scale]);

  // Map numeral to chord name
  const numeralToChord = useCallback((numeral) => {
    const clean = numeral.replace('°', '');
    const chord = diatonicChords.find(c => c.numeral.replace('°', '') === clean);
    if (!chord) return numeral;
    return chord.quality === 'major' ? chord.root : `${chord.root}m`;
  }, [diatonicChords]);

  return (
    <div className="space-y-2">
      {progressions.map((prog, i) => (
        <div key={i} className="card px-3 py-2.5 flex items-center gap-2">
          <span className="text-[9px] text-text-3 font-medium w-16 shrink-0">{prog.name}</span>
          <div className="flex gap-1.5 flex-1">
            {prog.numerals.map((num, j) => (
              <div key={j} className="flex-1 text-center">
                <span className="text-[8px] text-text-3 block">{num}</span>
                <span className="text-xs font-bold text-water-4">{numeralToChord(num)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───

export default function ShedPage() {
  const [rootNote, setRootNote] = useState('C');
  const [scale, setScale] = useState('major');
  const [intent, setIntent] = useState('chords');
  const [showDegrees, setShowDegrees] = useState(false);
  const [activePosition, setActivePosition] = useState(null);

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
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text">The Dock</h1>
        <p className="text-xs text-text-3 mt-0.5">Your launchpad — reference, tune, play</p>
      </div>

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
          <p className="text-xs text-text-3 mb-3">
            Diatonic chords in <span className="text-water-4 font-semibold">{rootNote} {SCALE_NAMES[scale]}</span>
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {diatonicChords.map((chord, i) => (
              <ChordCard key={i} {...chord} />
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
