import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  NOTES, NOTE_DISPLAY, SCALE_NAMES, INTENTS,
  getScaleNotes, getDiatonicChords, getCAGEDPositions,
} from '../data/musicTheory';
import {
  getReadyPageState, saveReadyPageState, getFavorites, toggleFavorite,
  incrementKeyHit, incrementSectionHit, getAdaptiveKeyOrder,
  getAdaptiveDefaultSection,
} from '../utils/storage';
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

// ─── Favorites Pill Row ───
// Compact row of saved key+scale combos for instant recall
function FavoritesPills({ favorites, currentRoot, currentScale, onLoad, onRemove }) {
  if (!favorites.length) return null;

  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 mt-1.5">
      {favorites.map((fav, i) => {
        const isActive = fav.root === currentRoot && fav.scale === currentScale;
        return (
          <button
            key={`${fav.root}-${fav.scale}-${i}`}
            onClick={() => onLoad(fav.root, fav.scale)}
            onContextMenu={(e) => { e.preventDefault(); onRemove(fav.root, fav.scale); }}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-semibold transition-all active:scale-95 ${
              isActive
                ? 'bg-water-2/25 text-water-5 ring-1 ring-water-3/30'
                : 'card text-text-2 hover:text-text'
            }`}
          >
            <span className="text-amber-400 text-[8px]">★</span>
            {fav.root} {SCALE_NAMES[fav.scale]?.split(' ')[0] || fav.scale}
          </button>
        );
      })}
    </div>
  );
}

// ─── Sticky Root Lock Bar ───
// Compact key/scale selector that stays visible while scrolling
function StickyRootLock({
  rootNote, scale, onRootChange, onScaleChange, expanded, onToggleExpand,
  isFav, onToggleFav, quickJumpKeys,
}) {
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

        {/* Star — toggle favorite */}
        <button
          onClick={onToggleFav}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all"
          aria-label={isFav ? 'Remove from favorites' : 'Save as favorite'}
        >
          <span className={`text-sm transition-all ${isFav ? 'text-amber-400 scale-110' : 'text-text-3/40 hover:text-text-3'}`}>
            {isFav ? '★' : '☆'}
          </span>
        </button>

        {/* Quick key jumps — adaptive order from keyHits */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1">
          {quickJumpKeys.map(note => (
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

// ─── The Living Ready Page — Competition R Winner ───
// Ive's "Quiet Teacher" + Linus's counters + Oprah's UX
// Layer 1: Persistent state (page remembers where you left it)
// Layer 2: Favorites (star to save, pill row to recall)
// Layer 3: Adaptive intelligence (keyHits, sectionHits, reordering)

export default function ShedPage({ sessions = [], onNavigate }) {
  // ── Layer 1: Initialize from persistent state ──
  const savedState = useRef(getReadyPageState());
  const defaultSection = useRef(getAdaptiveDefaultSection(INTENTS.map(i => i.id)));

  const [rootNote, setRootNote] = useState(savedState.current.root || 'C');
  const [scale, setScale] = useState(savedState.current.scale || 'major');
  const [showDegrees, setShowDegrees] = useState(savedState.current.showDegrees || 'notes');
  const [activePosition, setActivePosition] = useState(null);
  const [showBarre, setShowBarre] = useState(false);
  const [showIntervals, setShowIntervals] = useState(true);
  const [obliqueDismissed, setObliqueDismissed] = useState(false);
  const [rootLockExpanded, setRootLockExpanded] = useState(false);

  // Accordion state — restored from persistent state, or adaptive default
  const [openSections, setOpenSections] = useState(() => {
    const saved = savedState.current.openSections;
    if (saved && Object.keys(saved).some(k => saved[k])) return saved;
    return { [defaultSection.current]: true };
  });

  // ── Layer 2: Favorites ──
  const [favorites, setFavorites] = useState(getFavorites);
  const currentIsFav = favorites.some(f => f.root === rootNote && f.scale === scale);

  const handleToggleFav = useCallback(() => {
    const updated = toggleFavorite(rootNote, scale);
    setFavorites(updated);
  }, [rootNote, scale]);

  const handleLoadFav = useCallback((root, s) => {
    setRootNote(root);
    setScale(s);
  }, []);

  const handleRemoveFav = useCallback((root, s) => {
    const updated = toggleFavorite(root, s);
    setFavorites(updated);
  }, []);

  // ── Layer 3: Adaptive quick-jump keys ──
  const quickJumpKeys = useMemo(
    () => getAdaptiveKeyOrder(['C', 'D', 'E', 'G', 'A']),
    [] // only compute on mount
  );

  // ── Debounced persistence (Layer 1) ──
  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveReadyPageState({ root: rootNote, scale, openSections, showDegrees });
    }, 250);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [rootNote, scale, openSections, showDegrees]);

  // ── Layer 3: Increment counters ──
  const handleRootChange = useCallback((note) => {
    setRootNote(note);
    incrementKeyHit(note);
  }, []);

  const toggleSection = useCallback((id) => {
    setOpenSections(prev => {
      const isOpening = !prev[id];
      if (isOpening) incrementSectionHit(id);
      return { ...prev, [id]: !prev[id] };
    });
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
      for (const key of Object.keys(prev)) next[key] = false;
      next[intent] = true;
      return next;
    });
    incrementSectionHit(intent);
  }, []);

  return (
    <div className="px-4 pt-3 pb-24">
      {/* Sticky Root Lock bar — with star + adaptive quick-jump */}
      <StickyRootLock
        rootNote={rootNote}
        scale={scale}
        onRootChange={handleRootChange}
        onScaleChange={setScale}
        expanded={rootLockExpanded}
        onToggleExpand={() => setRootLockExpanded(e => !e)}
        isFav={currentIsFav}
        onToggleFav={handleToggleFav}
        quickJumpKeys={quickJumpKeys}
      />

      {/* Favorites pill row — hidden when empty (progressive disclosure) */}
      <FavoritesPills
        favorites={favorites}
        currentRoot={rootNote}
        currentScale={scale}
        onLoad={handleLoadFav}
        onRemove={handleRemoveFav}
      />

      {/* Oblique Strategy Card */}
      <div className="mt-3">
        <ObliqueCard dismissed={obliqueDismissed} onDismiss={() => setObliqueDismissed(true)} />
      </div>

      {/* The Current — HERO position (Spool: smart suggestion drives the page) */}
      <CurrentCard
        sessions={sessions}
        onSetRoot={handleRootChange}
        onSetScale={setScale}
        onSetIntent={handleSetIntent}
      />

      {/* Quick Start triptych */}
      <QuickStartCards
        sessions={sessions}
        onSetRoot={handleRootChange}
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
              <CircleSection rootNote={rootNote} onSetRootNote={handleRootChange} />
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
