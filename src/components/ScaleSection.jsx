import { useMemo } from 'react';
import {
  NOTES, SCALE_NAMES, STEP_PATTERNS, OPEN_STRINGS, STRING_LABELS,
} from '../data/musicTheory';

// ─── Fretboard Diagram ───

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

// ─── Position Diagram ───

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

// ─── Main Scale Section ───

export default function ScaleSection({
  rootNote, scale, rootIdx, scaleNoteIndexes, positions,
  showDegrees, setShowDegrees, activePosition, setActivePosition,
  highlightRange,
}) {
  return (
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
  );
}
