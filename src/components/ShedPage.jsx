import { useState, useMemo } from 'react';
import {
  NOTES, NOTE_DISPLAY, SCALE_NAMES, INTENTS,
  getScaleNotes, getDiatonicChords, getCAGEDPositions,
} from '../data/musicTheory';
import ObliqueCard from './ObliqueCard';
import ChordSection from './ChordSection';
import ScaleSection from './ScaleSection';
import CircleSection from './CircleSection';
import QuickRefSection from './QuickRefSection';
import { TuningStrip, QuickStartCards, CurrentCard } from './ShedHelpers';

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
      <ObliqueCard dismissed={obliqueDismissed} onDismiss={() => setObliqueDismissed(true)} />

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
        <ChordSection
          rootNote={rootNote} scale={scale} rootIdx={rootIdx}
          scaleNoteIndexes={scaleNoteIndexes} diatonicChords={diatonicChords}
          showBarre={showBarre} setShowBarre={setShowBarre}
          showIntervals={showIntervals} setShowIntervals={setShowIntervals}
        />
      )}

      {intent === 'scale' && (
        <ScaleSection
          rootNote={rootNote} scale={scale} rootIdx={rootIdx}
          scaleNoteIndexes={scaleNoteIndexes} positions={positions}
          showDegrees={showDegrees} setShowDegrees={setShowDegrees}
          activePosition={activePosition} setActivePosition={setActivePosition}
          highlightRange={highlightRange}
        />
      )}

      {intent === 'circle' && (
        <CircleSection rootNote={rootNote} onSetRootNote={setRootNote} />
      )}

      {intent === 'ref' && (
        <QuickRefSection />
      )}

      {/* Easter egg */}
      <p className="text-center text-text-3/30 text-[9px] mt-12 italic">
        If the answer isn&apos;t here, just play the blues in E and look confident.
      </p>
    </div>
  );
}
