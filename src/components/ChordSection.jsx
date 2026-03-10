import { useState, useMemo, useCallback } from 'react';
import {
  NOTES, SCALE_NAMES, CHORD_FORMULAS, OPEN_STRINGS,
  getChordVoicing, getIntervalColor, getProgressions,
} from '../data/musicTheory';

// ─── Chord Diagram ───

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
            fill="rgba(var(--accent-rgb),0.2)" stroke="rgba(var(--accent-rgb),0.3)" strokeWidth="0.5"
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
          if (f === -1) return <text key={i} x={x} y="6" fontSize="6" textAnchor="middle" fill="#E8735A">&times;</text>;
          if (f === 0) return <circle key={i} cx={x} cy="6" r="2" fill="none" stroke="#A8A29E" strokeWidth="0.6" />;
          const y = 10 + (f - offset - 0.5) * 10;
          // Determine interval color
          const noteIdx = (OPEN_STRINGS[i] + f) % 12;
          const color = showIntervals && rootIdx != null
            ? getIntervalColor(noteIdx, rootIdx, 'major')
            : 'var(--accent)';
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

// ─── Chord Card ───

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
        {CHORD_FORMULAS[quality]?.map(i => NOTES[(rootIdx + i) % 12]).join(' \u00B7 ')}
      </p>
    </div>
  );
}

// ─── Progression Strips ───

function ProgressionStrips({ rootNote, scale, diatonicChords }) {
  const progressions = useMemo(() => getProgressions(scale), [scale]);

  // Map numeral to chord name
  const numeralToChord = useCallback((numeral) => {
    const clean = numeral.replace('\u00B0', '');
    const chord = diatonicChords.find(c => c.numeral.replace('\u00B0', '') === clean);
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
              ? 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),1))'
              : 'linear-gradient(135deg, rgba(var(--accent-rgb),0.4), rgba(var(--accent-deep-rgb),0.5))'
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

// ─── Main Chord Section ───

export default function ChordSection({
  rootNote, scale, rootIdx, scaleNoteIndexes, diatonicChords,
  showBarre, setShowBarre, showIntervals, setShowIntervals,
}) {
  return (
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
  );
}
