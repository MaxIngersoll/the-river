import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSeason } from '../contexts/SeasonContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
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

// Split timer into parts for separate colon rendering (pulsing colon effect)
function formatTimerParts(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  if (h > 0) {
    return [
      { type: 'digits', value: String(h) },
      { type: 'colon', value: ':' },
      { type: 'digits', value: pad(m) },
      { type: 'colon', value: ':' },
      { type: 'digits', value: pad(s) },
    ];
  }
  return [
    { type: 'digits', value: pad(m) },
    { type: 'colon', value: ':' },
    { type: 'digits', value: pad(s) },
  ];
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

// Timer display mode — symbolic river drop vs classic clock
const TIMER_DISPLAY_KEY = 'river-timer-display-mode';
function getTimerDisplayMode() {
  try { return localStorage.getItem(TIMER_DISPLAY_KEY) || 'symbolic'; } catch { return 'symbolic'; }
}
function setTimerDisplayModeStorage(mode) {
  try { localStorage.setItem(TIMER_DISPLAY_KEY, mode); } catch {}
}

// Smooth organic jitter for river trail meander
function getTrailJitter(i) {
  return Math.sin(i * 0.7) * 0.6 + Math.sin(i * 1.3 + 2.1) * 0.3 + Math.sin(i * 2.7 + 5.3) * 0.1;
}

// Catmull-Rom spline → SVG cubic bezier path
function catmullRomPath(points) {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// The Bloom — concentric rings emanating from luminous core (Fry/Reas synthesis)
function BloomSVG({ elapsed, timerState, prefersReduced, countdownTarget }) {
  const isPaused = timerState === 'paused';
  const isStopped = timerState === 'stopped';

  // Generate rings — one every 12 seconds, expanding outward from center
  const ringInterval = 12000;
  const totalPossible = Math.floor(elapsed / ringInterval) + 1;

  const rings = [];
  for (let i = 0; i < totalPossible; i++) {
    const birthTime = i * ringInterval;
    const age = (elapsed - birthTime) / 1000;
    if (age < 0) continue;

    const maxAge = 420; // 7 min to reach max radius
    const ageT = Math.min(1, age / maxAge);

    // Radius: 3 at birth → 45 at max age
    const baseR = 3 + ageT * 42;
    // Organic wobble — each ring has unique personality (Reas: "systems and emergence")
    const wobble = Math.sin(i * 2.7 + 0.5) * 1.2 + Math.cos(i * 1.3) * 0.6;
    const r = baseR + wobble;

    // Opacity: bright when young (0.6), fades outward (0.05)
    const opacity = Math.max(0.05, 0.6 - ageT * 0.55);
    if (opacity <= 0.05) continue;

    // Stroke width: thick young → thin old
    const strokeWidth = Math.max(0.3, 1.8 - ageT * 1.5);

    // Color: inner water-2, outer water-4, every 4th ring = lavender (Jen: "chromatic bloom")
    let color;
    if (i % 4 === 0 && i > 0) {
      color = 'var(--color-lavender)';
    } else if (ageT < 0.3) {
      color = 'var(--color-water-2)';
    } else if (ageT < 0.6) {
      color = 'var(--color-water-3)';
    } else {
      color = 'var(--color-water-4)';
    }

    rings.push({ r, strokeWidth, opacity, color, key: i });
  }

  // Performance cap: 40 most visible rings
  const visibleRings = rings.slice(-40);

  // Core color deepens with time
  const minutes = elapsed / 60000;
  const coreColor = minutes >= 30 ? 'var(--color-water-5)'
    : minutes >= 15 ? 'var(--color-water-4)'
    : minutes >= 5 ? 'var(--color-water-3)'
    : 'var(--color-water-2)';

  // Mini clock: show remaining (countdown) or elapsed (count-up)
  const displayMs = countdownTarget ? Math.max(0, countdownTarget * 60000 - elapsed) : elapsed;

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full"
      style={{ maxWidth: '360px', height: '55vh', maxHeight: '440px' }}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <filter id="bloom-halo">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="bloom-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Breathing wrapper — all elements breathe together (Fry: 6s cycle, calming) */}
      <g className={!isPaused && !prefersReduced ? 'animate-bloom-breathe' : ''}>

        {/* Rings — expanding outward from center */}
        {visibleRings.map((ring) => (
          <circle
            key={ring.key}
            cx="50" cy="50"
            r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeWidth={ring.strokeWidth}
            opacity={isPaused ? ring.opacity * 0.3 : isStopped ? Math.min(1, ring.opacity * 1.4) : ring.opacity}
            style={{ transition: 'opacity 0.5s ease' }}
          />
        ))}

        {/* Core — 3 layers: halo, aura, white center (Ive: "glow like a star") */}
        <circle cx="50" cy="50" r="8" fill={coreColor} opacity={isPaused ? 0.04 : 0.12} filter="url(#bloom-halo)" />
        <circle cx="50" cy="50" r="4" fill={coreColor} opacity={isPaused ? 0.15 : 0.5} filter="url(#bloom-glow)" />
        <circle cx="50" cy="50" r="2" fill="white" opacity={isPaused ? 0.25 : 0.85} />

        {/* Ripples from core — only when running (Reas: "emergence") */}
        {!isPaused && !isStopped && !prefersReduced && (
          <>
            <circle cx="50" cy="50" r="2" fill="none" stroke={coreColor} strokeWidth="0.4">
              <animate attributeName="r" from="2" to="14" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.45" to="0" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="2" fill="none" stroke={coreColor} strokeWidth="0.4">
              <animate attributeName="r" from="2" to="14" dur="3s" begin="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.45" to="0" dur="3s" begin="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>

      {/* Mini clock — always visible (Wroblewski: "don't make the user guess") */}
      <text
        x="50" y="95"
        textAnchor="middle"
        style={{
          fontSize: '3.8px',
          fontFamily: 'var(--font-sans)',
          fontVariantNumeric: 'tabular-nums',
          fill: 'var(--color-text-3)',
          opacity: 0.4,
        }}
      >
        {formatTimer(displayMs)}
      </text>
      {elapsed < 8000 && (
        <text
          x="50" y="98.5"
          textAnchor="middle"
          style={{
            fontSize: '2.2px',
            fontFamily: 'var(--font-sans)',
            fill: 'var(--color-text-3)',
            opacity: 0.25,
          }}
        >
          tap for fullscreen time
        </text>
      )}
    </svg>
  );
}

export default function TimerFAB({ onSaveSession, onQuickLog, showTabBar = true }) {
  const { isDark } = useTheme();
  const { riverWeight = 300 } = useSeason();
  const prefersReduced = useReducedMotion();

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
  const [showSaveFlow, setShowSaveFlow] = useState(false);
  const [timerDisplayMode, setTimerDisplayModeState] = useState(getTimerDisplayMode);
  const [showClockPeek, setShowClockPeek] = useState(false);
  const [countdownTarget, setCountdownTarget] = useState(null); // null = count-up, number = minutes
  const clockPeekRef = useRef(null);
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
      setShowSaveFlow(true); // Skip pride moment on restore — user already saw it
      setExpanded(true);
    }
  }, []);

  // Progressive color deepening — river deepens as you practice (Jen: drama through time)
  const timerDepthColor = useMemo(() => {
    if (timerState === 'idle') return 'var(--color-text)';
    if (timerState === 'stopped' && showSaveFlow) return 'var(--color-text)';
    const minutes = elapsed / 60000;
    if (minutes >= 30) return 'var(--color-water-5)';
    if (minutes >= 15) return 'var(--color-water-4)';
    if (minutes >= 5) return 'var(--color-water-3)';
    return 'var(--color-water-2)';
  }, [elapsed, timerState, showSaveFlow]);

  // Pulsing colon — heartbeat that calms over time (Wroblewski: 1Hz→0.5Hz)
  const colonPulsing = timerState === 'running' && elapsed >= 5 * 60 * 1000;
  const colonPulseDuration = useMemo(() => {
    if (!colonPulsing) return 1;
    const minutes = elapsed / 60000;
    const t = Math.min(1, Math.max(0, (minutes - 5) / 25));
    return 1 + t; // 1s at 5min → 2s at 30min
  }, [colonPulsing, elapsed]);

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
    setShowSaveFlow(false); // Pride phase first — hold the number (Miner: 800ms pride moment)
    persistTimer({ timerState: 'stopped', startedAt: null, pausedElapsed: finalElapsed, note, tags });
    // After pride moment, reveal save flow
    const delay = prefersReduced ? 0 : 800;
    setTimeout(() => setShowSaveFlow(true), delay);
  }, [timerState, pausedElapsed, startedAt, note, tags, prefersReduced]);

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
    // Let ripple play, then save + collapse (350ms — Ive: 80% of motion in first 250ms with ease-ripple)
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
      setShowSaveFlow(false);
      clearTimerStorage();
    }, 350);
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
    setShowSaveFlow(false);
    setCountdownTarget(null);
    clearTimerStorage();
  }, []);

  // Timer display mode toggle
  const toggleTimerDisplay = useCallback(() => {
    setTimerDisplayModeState(prev => {
      const next = prev === 'symbolic' ? 'clock' : 'symbolic';
      setTimerDisplayModeStorage(next);
      return next;
    });
  }, []);

  // Tap-to-peek: show clock briefly over symbolic view
  const handleClockPeek = useCallback(() => {
    if (timerDisplayMode !== 'symbolic' || timerState === 'stopped') return;
    setShowClockPeek(true);
    if (clockPeekRef.current) clearTimeout(clockPeekRef.current);
    clockPeekRef.current = setTimeout(() => setShowClockPeek(false), 3000);
  }, [timerDisplayMode, timerState]);

  // Cleanup clock peek timeout
  useEffect(() => {
    return () => {
      if (clockPeekRef.current) clearTimeout(clockPeekRef.current);
    };
  }, []);

  // Auto-stop when countdown reaches zero
  useEffect(() => {
    if (countdownTarget && timerState === 'running') {
      const remaining = countdownTarget * 60000 - elapsed;
      if (remaining <= 0) {
        haptics.save();
        handleStop();
      }
    }
  }, [countdownTarget, elapsed, timerState, handleStop]);

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

        {/* Timer display mode toggle — only during running/paused */}
        {timerState !== 'stopped' && timerState !== 'idle' && (
          <button
            onClick={toggleTimerDisplay}
            className="absolute top-12 left-5 w-10 h-10 flex items-center justify-center rounded-full text-text-3 hover:bg-dry/60 transition-colors"
            style={{ opacity: 0.4 }}
            aria-label={timerDisplayMode === 'symbolic' ? 'Switch to clock display' : 'Switch to river display'}
          >
            <span className="text-base">{timerDisplayMode === 'symbolic' ? '⌚' : '💧'}</span>
          </button>
        )}

        {/* Screen reader announcements */}
        <div aria-live="polite" className="sr-only">
          {timerState === 'running' && 'Timer running'}
          {timerState === 'paused' && 'Timer paused'}
          {timerState === 'stopped' && 'Session complete'}
        </div>

        {/* Timer display — Symbolic river or Classic clock */}
        {timerState !== 'stopped' && timerDisplayMode === 'symbolic' ? (
          /* The Bloom — concentric rings from luminous core (Fry/Reas synthesis) */
          <div
            className="flex flex-col items-center justify-center mb-4 relative"
            onClick={handleClockPeek}
            role="timer"
            aria-label={`Practice time: ${formatTimer(elapsed)}`}
          >
            <BloomSVG elapsed={elapsed} timerState={timerState} prefersReduced={prefersReduced} countdownTarget={countdownTarget} />
            {/* Clock peek overlay — tap to reveal for 3s */}
            {showClockPeek && (
              <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                <span
                  className="leading-none"
                  style={{
                    fontSize: '72px',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    fontVariantNumeric: 'tabular-nums',
                    color: timerDepthColor,
                    textShadow: '0 0 40px rgba(59,130,246,0.3)',
                  }}
                >
                  {formatTimer(countdownTarget ? Math.max(0, countdownTarget * 60000 - elapsed) : elapsed)}
                </span>
              </div>
            )}
            {timerState === 'paused' && (
              <p className="text-text-3 text-xs font-medium uppercase tracking-widest mt-2 animate-fade-in">
                Paused
              </p>
            )}
          </div>
        ) : (
          /* Classic clock — Lora running, DM Serif stopped (Ive/Jen synthesis) */
          <div className="text-center mb-12">
            <div className="hero-glow">
              <h1
                className={`leading-none tracking-tight ${
                  timerState === 'stopped' ? 'ceremony-text animate-timer-settle' : ''
                }`}
                style={{
                  fontSize: '80px',
                  fontFamily: timerState === 'stopped' ? undefined : 'var(--font-serif)',
                  fontWeight: 400,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                  color: timerDepthColor,
                  transition: 'color 2s ease',
                }}
              >
                {formatTimerParts(elapsed).map((part, i) =>
                  part.type === 'colon' ? (
                    <span
                      key={i}
                      className={colonPulsing ? 'animate-colon-pulse' : ''}
                      style={colonPulsing ? {
                        animationDuration: `${colonPulseDuration}s`,
                        display: 'inline-block',
                      } : {
                        opacity: timerState === 'paused' ? 0 : 1,
                        transition: 'opacity 0.3s ease',
                        display: 'inline-block',
                      }}
                    >
                      {part.value}
                    </span>
                  ) : (
                    <span key={i}>{part.value}</span>
                  )
                )}
              </h1>
            </div>
            {timerState === 'paused' && (
              <p className="text-text-3 text-xs font-medium uppercase tracking-widest mt-4 animate-fade-in">
                Paused
              </p>
            )}
          </div>
        )}

        {/* Timer mode — count-up or countdown (Fogg: "make it tiny") */}
        {timerState !== 'stopped' && (
          <div className="flex items-center gap-1.5 mb-4">
            {[null, 15, 25, 45, 60].map((mins) => (
              <button
                key={mins ?? 'up'}
                onClick={(e) => { e.stopPropagation(); setCountdownTarget(mins); }}
                className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                  countdownTarget === mins
                    ? 'text-white font-semibold'
                    : 'text-text-3/40'
                }`}
                style={countdownTarget === mins ? {
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.6), rgba(30,64,175,0.7))',
                } : undefined}
              >
                {mins ? `${mins}m` : '\u221E'}
              </button>
            ))}
          </div>
        )}

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
        ) : showSaveFlow ? (
          /* Save flow — staggered entrance (Miner: journal page, not form) */
          <div className="w-full max-w-sm">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you work on?"
              aria-label="Session note"
              className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3 mb-3 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: '0ms', animationFillMode: 'forwards' }}
              autoFocus
            />

            {/* Practice tags — 120ms stagger */}
            <div
              className="flex flex-wrap gap-2 mb-4 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: '120ms', animationFillMode: 'forwards' }}
            >
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

            {/* Mood — 200ms stagger */}
            <div
              className="mb-4 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <MoodPicker selected={mood} onSelect={setMood} />
            </div>

            <input
              type="text"
              value={curiosity}
              onChange={(e) => setCuriosity(e.target.value)}
              placeholder="What are you curious about next?"
              aria-label="Curiosity for next session"
              className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3/50 italic mb-4 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: '260ms', animationFillMode: 'forwards' }}
            />

            <button
              onClick={handleSave}
              className="relative w-full text-white font-semibold py-4 rounded-full text-base active:scale-[0.97] transition-all mb-3 overflow-hidden animate-fade-in-up"
              style={{
                opacity: 0,
                animationDelay: '320ms',
                animationFillMode: 'forwards',
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
              className="w-full py-3 text-text-3 text-sm font-medium active:scale-[0.97] transition-all animate-fade-in-up"
              style={{ opacity: 0, animationDelay: '380ms', animationFillMode: 'forwards' }}
            >
              Never mind
            </button>
          </div>
        ) : null /* Pride phase — timer number visible, save flow hidden */}
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
          className="text-white text-sm"
          style={{ fontVariantNumeric: 'tabular-nums', fontWeight: riverWeight }}
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
