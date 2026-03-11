import { useState, useMemo, useCallback } from 'react';
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

// ─── Accordion Section ───
// Progressive disclosure: tap header to expand/collapse content
function AccordionSection({ id, icon, label, isOpen, onToggle, children }) {
  return (
    <div className="mb-3">
      <button
        onClick={() => onToggle(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${
          isOpen
            ? 'card border border-water-3/15'
            : 'hover:bg-dry/40'
        }`}
        aria-expanded={isOpen}
        aria-controls={`section-${id}`}
      >
        <span className="text-base">{icon}</span>
        <span className={`text-sm font-semibold flex-1 text-left ${
          isOpen ? 'text-text' : 'text-text-2'
        }`}>
          {label}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`text-text-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        id={`section-${id}`}
        role="region"
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        {isOpen && children}
      </div>
    </div>
  );
}

// ─── Sticky Root Lock Bar ───
// Compact key/scale selector that stays visible while scrolling
function StickyRootLock({ rootNote, scale, onRootChange, onScaleChange, expanded, onToggleExpand }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 px-4 pt-2 pb-2" style={{
      background: 'linear-gradient(to bottom, var(--color-bg) 80%, transparent)',
    }}>
      <div className="flex items-center gap-2">
        {/* Compact key display — tap to expand */}
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full card active:scale-95 transition-all"
        >
          <span className="text-xs font-bold text-text">{rootNote}</span>
          <span className="text-[10px] text-text-3">{SCALE_NAMES[scale]}</span>
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round"
            className={`text-text-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Quick key jumps */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1">
          {['C', 'D', 'E', 'G', 'A'].map(note => (
            <button
              key={note}
              onClick={() => onRootChange(note)}
              className={`shrink-0 w-7 h-7 rounded-full text-[10px] font-bold transition-all active:scale-90 ${
                note === rootNote
                  ? 'text-white'
                  : 'text-text-3 hover:text-text-2'
              }`}
              style={note === rootNote ? {
                background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),0.95))',
              } : undefined}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded: full key and scale selectors */}
      <div className={`overflow-hidden transition-all duration-300 ${
        expanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
      }`}>
        {/* All notes */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {NOTES.map(note => (
            <button
              key={note}
              onClick={() => onRootChange(note)}
              className={`shrink-0 w-8 h-8 rounded-full text-[10px] font-bold transition-all active:scale-90 ${
                note === rootNote
                  ? 'text-white'
                  : 'card text-text-2'
              }`}
              style={note === rootNote ? {
                background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),0.95))',
                boxShadow: '0 2px 8px rgba(var(--accent-rgb),0.25)',
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
              onClick={() => onScaleChange(s)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all active:scale-95 ${
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
    </div>
  );
}

// ─── Smart Ready — Competition M Winner ───
// Spool + Rams + Wroblewski synthesis: progressive disclosure, The Current as hero,
// sticky Root Lock, accordion sections. Same content, better organization.

export default function ShedPage({ sessions = [], onNavigate }) {
  const [rootNote, setRootNote] = useState('C');
  const [scale, setScale] = useState('major');
  const [showDegrees, setShowDegrees] = useState(false);
  const [activePosition, setActivePosition] = useState(null);
  const [showBarre, setShowBarre] = useState(false);
  const [showIntervals, setShowIntervals] = useState(true);
  const [obliqueDismissed, setObliqueDismissed] = useState(false);
  const [rootLockExpanded, setRootLockExpanded] = useState(false);

  // Accordion state — default: scale open (Max: scales first)
  const [openSections, setOpenSections] = useState({ scale: true });

  const toggleSection = useCallback((id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

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

  // When CurrentCard sets intent, open that accordion section
  const handleSetIntent = useCallback((intent) => {
    setOpenSections(prev => {
      const next = {};
      // Close all others, open the selected one
      for (const key of Object.keys(prev)) next[key] = false;
      next[intent] = true;
      return next;
    });
  }, []);

  return (
    <div className="px-4 pt-3 pb-24">
      {/* Sticky Root Lock bar — always accessible */}
      <StickyRootLock
        rootNote={rootNote}
        scale={scale}
        onRootChange={setRootNote}
        onScaleChange={setScale}
        expanded={rootLockExpanded}
        onToggleExpand={() => setRootLockExpanded(e => !e)}
      />

      {/* Oblique Strategy Card */}
      <div className="mt-3">
        <ObliqueCard dismissed={obliqueDismissed} onDismiss={() => setObliqueDismissed(true)} />
      </div>

      {/* The Current — HERO position (Spool: smart suggestion drives the page) */}
      <CurrentCard
        sessions={sessions}
        onSetRoot={setRootNote}
        onSetScale={setScale}
        onSetIntent={handleSetIntent}
      />

      {/* Quick Start triptych */}
      <QuickStartCards
        sessions={sessions}
        onSetRoot={setRootNote}
        onSetScale={setScale}
      />

      {/* ─── Accordion Sections (Rams: progressive disclosure) ─── */}
      <div className="mt-2">
        {INTENTS.map(i => (
          <AccordionSection
            key={i.id}
            id={i.id}
            icon={i.icon}
            label={`${i.label} in ${rootNote} ${SCALE_NAMES[scale]}`}
            isOpen={!!openSections[i.id]}
            onToggle={toggleSection}
          >
            {i.id === 'chords' && (
              <ChordSection
                rootNote={rootNote} scale={scale} rootIdx={rootIdx}
                scaleNoteIndexes={scaleNoteIndexes} diatonicChords={diatonicChords}
                showBarre={showBarre} setShowBarre={setShowBarre}
                showIntervals={showIntervals} setShowIntervals={setShowIntervals}
              />
            )}
            {i.id === 'scale' && (
              <ScaleSection
                rootNote={rootNote} scale={scale} rootIdx={rootIdx}
                scaleNoteIndexes={scaleNoteIndexes} positions={positions}
                showDegrees={showDegrees} setShowDegrees={setShowDegrees}
                activePosition={activePosition} setActivePosition={setActivePosition}
                highlightRange={highlightRange}
              />
            )}
            {i.id === 'circle' && (
              <CircleSection rootNote={rootNote} onSetRootNote={setRootNote} />
            )}
            {i.id === 'ref' && (
              <QuickRefSection />
            )}
          </AccordionSection>
        ))}
      </div>

      {/* Tuning Strip — moved below content (Rams: tool, not reference) */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-3">Tuning</p>
          <div className="flex-1 h-px bg-dry" />
        </div>
        <TuningStrip />
      </div>

      {/* Easter egg */}
      <p className="text-center text-text-3/30 text-[9px] mt-8 italic">
        If the answer isn&apos;t here, just play the blues in E and look confident.
      </p>
    </div>
  );
}
