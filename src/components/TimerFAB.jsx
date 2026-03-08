import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PRACTICE_TAGS } from '../utils/storage';
import { haptics } from '../utils/haptics';
import MoodPicker from './MoodPicker';
import SoundscapePanel from './SoundscapePanel';

function formatTimer(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function formatTimerCompact(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const TIMER_STORAGE_KEY = 'river-active-timer';

function persistTimer(state) {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function loadTimer() {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearTimerStorage() {
  localStorage.removeItem(TIMER_STORAGE_KEY);
}

export default function TimerFAB({ onSaveSession, onQuickLog, showTabBar = true }) {
  const { isDark } = useTheme();

  // Visual viewport offset for iOS keyboard
  const [viewportOffset, setViewportOffset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handler = () => {
      const offset = window.innerHeight - vv.height;
      setViewportOffset(offset);
    };
    vv.addEventListener('resize', handler);
    vv.addEventListener('scroll', handler);
    return () => {
      vv.removeEventListener('resize', handler);
      vv.removeEventListener('scroll', handler);
    };
  }, []);

  // Timer state
  const [timerState, setTimerState] = useState('idle'); // idle | running | paused | stopped
  const [startedAt, setStartedAt] = useState(null);
  const [pausedElapsed, setPausedElapsed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [mood, setMood] = useState(null);
  const [curiosity, setCuriosity] = useState('');
  const intervalRef = useRef(null);

  // Restore timer from localStorage on mount
  useEffect(() => {
    const saved = loadTimer();
    if (!saved) return;
    if (saved.timerState === 'running') {
      const now = Date.now();
      const currentElapsed = saved.pausedElapsed + (now - saved.startedAt);
      setTimerState('running');
      setStartedAt(saved.startedAt);
      setPausedElapsed(saved.pausedElapsed);
      setElapsed(currentElapsed);
      setExpanded(true);
    } else if (saved.timerState === 'paused') {
      setTimerState('paused');
      setPausedElapsed(saved.pausedElapsed);
      setElapsed(saved.pausedElapsed);
      setExpanded(true);
    } else if (saved.timerState === 'stopped') {
      setTimerState('stopped');
      setPausedElapsed(saved.pausedElapsed);
      setElapsed(saved.pausedElapsed);
      if (saved.note) setNote(saved.note);
      if (Array.isArray(saved.tags)) setTags(saved.tags);
      setExpanded(true);
    }
  }, []);

  // Tick interval
  useEffect(() => {
    if (timerState === 'running' && startedAt) {
      intervalRef.current = setInterval(() => {
        setElapsed(pausedElapsed + (Date.now() - startedAt));
      }, 200);
      return () => clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, startedAt, pausedElapsed]);

  const handleStart = useCallback((prefillNote = '') => {
    if (timerState !== 'idle') return;
    const now = Date.now();
    if (prefillNote) setNote(prefillNote);
    setTimerState('running');
    setStartedAt(now);
    setPausedElapsed(0);
    setElapsed(0);
    setExpanded(true);
    persistTimer({ timerState: 'running', startedAt: now, pausedElapsed: 0 });
  }, [timerState]);

  // Listen for external timer-start events (from Ready, etc.)
  useEffect(() => {
    const handler = (e) => {
      if (timerState === 'idle') {
        handleStart(e.detail?.note || '');
      }
    };
    window.addEventListener('river-start-timer', handler);
    return () => window.removeEventListener('river-start-timer', handler);
  }, [timerState, handleStart]);

  const handlePause = useCallback(() => {
    const currentElapsed = pausedElapsed + (Date.now() - startedAt);
    setTimerState('paused');
    setPausedElapsed(currentElapsed);
    setElapsed(currentElapsed);
    setStartedAt(null);
    persistTimer({ timerState: 'paused', startedAt: null, pausedElapsed: currentElapsed });
  }, [pausedElapsed, startedAt]);

  const handleResume = useCallback(() => {
    const now = Date.now();
    setTimerState('running');
    setStartedAt(now);
    persistTimer({ timerState: 'running', startedAt: now, pausedElapsed });
  }, [pausedElapsed]);

  const handleStop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const finalElapsed = timerState === 'running'
      ? pausedElapsed + (Date.now() - startedAt)
      : pausedElapsed;
    setTimerState('stopped');
    setElapsed(finalElapsed);
    setPausedElapsed(finalElapsed);
    persistTimer({ timerState: 'stopped', startedAt: null, pausedElapsed: finalElapsed, note, tags });
  }, [timerState, pausedElapsed, startedAt, note, tags]);

  // Space key to start/pause/resume timer (guard: skip when in inputs)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== ' ') return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
      e.preventDefault();
      if (timerState === 'idle') handleStart();
      else if (timerState === 'running') handlePause();
      else if (timerState === 'paused') handleResume();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [timerState, handleStart, handlePause, handleResume]);

  const [showRipple, setShowRipple] = useState(false);

  const handleSave = useCallback(() => {
    const minutes = Math.max(1, Math.round(elapsed / 60000));
    haptics.save();
    setShowRipple(true);
    // Let ripple play, then save + collapse
    setTimeout(() => {
      setShowRipple(false);
      onSaveSession({ duration_minutes: minutes, note: note.trim(), tags, mood });
      // Store curiosity prompt for next session
      if (curiosity.trim()) {
        localStorage.setItem('river-curiosity', curiosity.trim());
      }
      // Reset everything
      setTimerState('idle');
      setStartedAt(null);
      setPausedElapsed(0);
      setElapsed(0);
      setExpanded(false);
      setNote('');
      setTags([]);
      setMood(null);
      setCuriosity('');
      clearTimerStorage();
    }, 400);
  }, [elapsed, note, tags, curiosity, onSaveSession]);

  const handleNevermind = useCallback(() => {
    setTimerState('idle');
    setStartedAt(null);
    setPausedElapsed(0);
    setElapsed(0);
    setExpanded(false);
    setNote('');
    setTags([]);
    setMood(null);
    setCuriosity('');
    clearTimerStorage();
  }, []);

  const isActive = timerState !== 'idle';

  // Long-press FAB to open Quick Log (only when idle)
  const longPressRef = useRef(null);
  const longPressFired = useRef(false);
  const handleFABPressStart = useCallback((e) => {
    if (isActive) return;
    longPressFired.current = false;
    longPressRef.current = setTimeout(() => {
      longPressRef.current = null;
      longPressFired.current = true;
      onQuickLog?.();
    }, 500);
  }, [isActive, onQuickLog]);
  const handleFABPressEnd = useCallback(() => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  }, []);
  const handleFABClick = useCallback(() => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return; // Swallow click after long-press
    }
    if (isActive) {
      setExpanded(true);
    } else {
      handleStart();
    }
  }, [isActive, handleStart]);

  // Persist note/tags while in stopped state
  useEffect(() => {
    if (timerState === 'stopped') {
      persistTimer({ timerState: 'stopped', startedAt: null, pausedElapsed, note, tags });
    }
  }, [timerState, note, tags, pausedElapsed]);

  // Escape key to minimize
  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  // ─── Expanded overlay ───
  if (expanded) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Practice timer"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, rgba(12,10,9,0.98) 70%)'
            : 'radial-gradient(ellipse at center, rgba(191,219,254,0.10) 0%, rgba(242,241,237,0.98) 70%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          paddingBottom: viewportOffset > 0 ? `${viewportOffset}px` : undefined,
        }}
      >
        {/* Collapse button */}
        <button
          onClick={() => setExpanded(false)}
          className="absolute top-12 right-5 w-10 h-10 flex items-center justify-center rounded-full text-text-3 hover:bg-dry/60 transition-colors"
          aria-label="Minimize timer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        {/* Screen reader announcements */}
        <div aria-live="polite" className="sr-only">
          {timerState === 'running' && 'Timer running'}
          {timerState === 'paused' && 'Timer paused'}
          {timerState === 'stopped' && 'Session complete'}
        </div>

        {/* Timer display */}
        <div className="text-center mb-12">
          <p className="text-text-3 text-xs font-medium uppercase tracking-widest mb-4">
            {timerState === 'stopped' ? 'Session Complete' : timerState === 'paused' ? 'Paused' : 'Practicing'}
          </p>
          <div className="hero-glow">
            <h1
              className="font-bold text-text leading-none tracking-tight"
              style={{ fontSize: '72px', fontVariantNumeric: 'tabular-nums' }}
            >
              {formatTimer(elapsed)}
            </h1>
          </div>
        </div>

        {/* Soundscape controls */}
        {timerState !== 'stopped' && (
          <div className="w-full max-w-sm mb-8">
            <SoundscapePanel timerState={timerState} />
          </div>
        )}

        {/* Controls */}
        {timerState !== 'stopped' ? (
          <div className="flex items-center gap-5">
            {/* Pause / Resume */}
            <button
              onClick={timerState === 'running' ? handlePause : handleResume}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white active:scale-[0.93] transition-transform"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                boxShadow: '0 4px 24px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              {timerState === 'running' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              )}
            </button>

            {/* Stop */}
            <button
              onClick={handleStop}
              className="w-14 h-14 rounded-full flex items-center justify-center card text-text-2 active:scale-[0.93] transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </button>
          </div>
        ) : (
          /* Stopped — note + save */
          <div className="w-full max-w-sm animate-fade-in-up">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you work on?"
              aria-label="Session note"
              className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3 mb-3"
              autoFocus
            />

            {/* Practice tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PRACTICE_TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTags(prev =>
                      active ? prev.filter(t => t !== tag) : [...prev, tag]
                    )}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active ? 'text-white' : 'card text-text-2 active:scale-[0.95]'
                    }`}
                    style={active ? {
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                      boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                    } : undefined}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Mood — 4 weather icons, no labels */}
            <div className="mb-4">
              <MoodPicker selected={mood} onSelect={setMood} />
            </div>

            <input
              type="text"
              value={curiosity}
              onChange={(e) => setCuriosity(e.target.value)}
              placeholder="What are you curious about next?"
              aria-label="Curiosity for next session"
              className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3/50 italic mb-4"
            />

            <button
              onClick={handleSave}
              className="relative w-full text-white font-semibold py-4 rounded-full text-base active:scale-[0.97] transition-all mb-3 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                boxShadow: '0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              {showRipple && (
                <span
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  aria-hidden="true"
                >
                  <span
                    className="w-16 h-16 rounded-full bg-white/30"
                    style={{ animation: 'save-ripple 0.6s var(--ease-ripple) forwards' }}
                  />
                </span>
              )}
              Save {formatTimer(elapsed)} Session
            </button>

            <button
              onClick={handleNevermind}
              className="w-full py-3 text-text-3 text-sm font-medium active:scale-[0.97] transition-all"
            >
              Never mind
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── FAB (floating action button) ───
  return (
    <button
      onClick={handleFABClick}
      onTouchStart={handleFABPressStart}
      onTouchEnd={handleFABPressEnd}
      onMouseDown={handleFABPressStart}
      onMouseUp={handleFABPressEnd}
      onMouseLeave={handleFABPressEnd}
      onContextMenu={(e) => { if (!isActive) e.preventDefault(); }}
      className={`fixed z-40 flex items-center justify-center active:scale-[0.90] transition-all ${!isActive ? 'animate-pulse-glow' : ''}`}
      style={{
        bottom: showTabBar ? 'calc(88px + env(safe-area-inset-bottom, 0px))' : 'calc(24px + env(safe-area-inset-bottom, 0px))',
        right: '20px',
        width: isActive ? 'auto' : '56px',
        height: '56px',
        borderRadius: '28px',
        padding: isActive ? '0 16px' : '0',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
        boxShadow: isActive
          ? '0 4px 24px rgba(59,130,246,0.4), 0 0 0 4px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
      aria-label={isActive ? 'Open timer' : 'Start practice timer. Long-press for Quick Log.'}
    >
      {isActive ? (
        /* Running/paused — show elapsed time */
        <span
          className="text-white font-bold text-sm"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {timerState === 'paused' && (
            <span className="opacity-60 mr-1">⏸</span>
          )}
          {formatTimerCompact(elapsed)}
        </span>
      ) : (
        /* Idle — play icon */
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <polygon points="8,5 20,12 8,19" />
        </svg>
      )}
    </button>
  );
}
