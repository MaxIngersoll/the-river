import { useState, useMemo, useCallback, useRef } from 'react';
import { PRACTICE_TAGS } from '../utils/storage';
import {
  NOTES, SCALE_NAMES, STRING_FREQS,
  parseSessionContext, analyzePracticeHistory,
  getExploreSuggestion, getChallengeSuggestion, dispatchTimerStart,
} from '../data/musicTheory';

// ─── Tuning Strip Component ───

export function TuningStrip() {
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

// ─── Quick Start Cards ───

export function QuickStartCards({ sessions, onSetRoot, onSetScale }) {
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
      icon: '\u2192',
      action: () => {
        if (continueCtx?.root) onSetRoot(continueCtx.root);
        if (continueCtx?.scale) onSetScale(continueCtx.scale);
      },
    },
    {
      id: 'explore',
      label: 'Explore',
      sublabel: `${explore.root} ${SCALE_NAMES[explore.scale]}`,
      icon: '\u25C7',
      action: () => {
        onSetRoot(explore.root);
        onSetScale(explore.scale);
      },
    },
    {
      id: 'challenge',
      label: 'Challenge',
      sublabel: `${challenge.root} \u00B7 ${challenge.progression.name} \u00B7 ${challenge.bpm} BPM`,
      icon: '\u26A1',
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

export function CurrentCard({ sessions, onSetRoot, onSetScale, onSetIntent }) {
  const analysis = useMemo(() => analyzePracticeHistory(sessions), [sessions]);

  if (!sessions?.length || sessions.length < 3) return null;

  // Determine suggestion based on practice gaps
  const explore = getExploreSuggestion(analysis.recentKeys);

  // Find the least-practiced tag
  const tagCounts = analysis.recentTags;
  const leastTag = PRACTICE_TAGS.find(t => !tagCounts[t]) ||
    PRACTICE_TAGS.reduce((min, t) => (tagCounts[t] || 0) < (tagCounts[min] || 0) ? t : min, PRACTICE_TAGS[0]);

  // Build suggestion text
  const suggestion = `Try ${explore.root} ${SCALE_NAMES[explore.scale]} \u2014 focus on ${leastTag}`;

  const handleFlow = useCallback(() => {
    onSetRoot(explore.root);
    onSetScale(explore.scale);
    onSetIntent('scale');
  }, [explore, onSetRoot, onSetScale, onSetIntent]);

  const handleStartTimer = useCallback((e) => {
    e.stopPropagation();
    dispatchTimerStart(`${explore.root} ${SCALE_NAMES[explore.scale]} \u2014 ${leastTag}`);
  }, [explore, leastTag]);

  return (
    <div
      className="w-full card p-4 mb-5 text-left active:scale-[0.98] transition-all group"
      style={{ borderLeft: '3px solid rgba(var(--accent-rgb),0.4)' }}
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
          style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),0.95))' }}
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
