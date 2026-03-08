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

// ─── Value noise with fBm — artifact-free, smooth ───
const NOISE_T = (() => {
  const t = new Uint8Array(512);
  const p = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  let seed = 42;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) t[i] = p[i & 255];
  return t;
})();

function smoothstep(t) { return t * t * (3 - 2 * t); }

function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smoothstep(x - xi), yf = smoothstep(y - yi);
  const ix = xi & 255, iy = yi & 255;
  const a = NOISE_T[NOISE_T[ix] + iy] / 255;
  const b = NOISE_T[NOISE_T[ix + 1] + iy] / 255;
  const c = NOISE_T[NOISE_T[ix] + iy + 1] / 255;
  const d = NOISE_T[NOISE_T[ix + 1] + iy + 1] / 255;
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

function fbm(x, y) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 3; i++) {
    val += amp * (valueNoise(x * freq, y * freq) - 0.5);
    freq *= 2.1;
    amp *= 0.5;
  }
  return val;
}

// ─── The Quiet Water — Turrell/Eno/Rams synthesis ───
// "Ambient means it can be ignored AND attended to." — Brian Eno
// "Light so slow you can't tell it's moving." — James Turrell
// "Less, but better." — Dieter Rams
//
// 2 slow, soft currents through gentle noise. No particles. No chaos.
// The timer number IS the design. Everything else is atmosphere.

function createCurrent(w, h, index) {
  return {
    points: [{ x: w * (0.15 + index * 0.35), y: h * (0.2 + Math.random() * 0.6) }],
    maxPoints: 160,
    speed: 0.3 + Math.random() * 0.15, // slow but visible flow
    noiseOffX: index * 137.3 + Math.random() * 300,
    noiseOffY: index * 89.7 + Math.random() * 300,
    colorIndex: index,
    width: 10 + Math.random() * 10,
  };
}

function QuietWaterCanvas({ elapsed, timerState, prefersReduced, countdownTarget, isDark, numbersHidden, onToggleNumbers }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ currents: [], frame: null, time: 0 });
  const propsRef = useRef({ elapsed: 0, timerState: 'running', prefersReduced: false, isDark: true });
  propsRef.current = { elapsed, timerState, prefersReduced, isDark };

  const palette = useMemo(() => ({
    bg: isDark ? [13, 12, 11] : [242, 240, 236],
    // Deep, quiet water colors — only 2-3 hues
    currents: isDark
      ? [[30, 70, 160], [45, 95, 200], [25, 55, 130]]
      : [[70, 140, 230], [50, 110, 200], [90, 155, 240]],
    glow: isDark ? [35, 80, 180] : [80, 145, 235],
  }), [isDark]);
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const state = stateRef.current;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width, h = rect.height;

    // Start with 2 currents (Rams: less but better)
    state.currents = [createCurrent(w, h, 0), createCurrent(w, h, 1)];

    function animate() {
      const { elapsed: el, timerState: ts, prefersReduced: pr } = propsRef.current;
      const pal = paletteRef.current;
      const isPaused = ts === 'paused';
      const minutes = el / 60000;

      // Time moves slowly — Turrell: barely perceptible change
      state.time += isPaused ? 0.001 : 0.004;
      const t = state.time;

      // ─── Full clear ───
      const [br, bg, bb] = pal.bg;
      ctx.fillStyle = `rgb(${br},${bg},${bb})`;
      ctx.fillRect(0, 0, w, h);

      // ─── Single soft ambient glow (barely visible) ───
      if (!pr) {
        const gx = w * 0.5 + Math.sin(t * 0.15) * w * 0.15;
        const gy = h * 0.45 + Math.cos(t * 0.12) * h * 0.1;
        const gSize = Math.min(w, h) * 0.6;
        const [gr, gg, gb] = pal.glow;
        // Glow intensity deepens with practice time (Jen: drama through time)
        const glowOp = isPaused ? 0.03 : Math.min(0.12, 0.05 + minutes * 0.003);
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gSize);
        grad.addColorStop(0, `rgba(${gr},${gg},${gb},${glowOp})`);
        grad.addColorStop(0.5, `rgba(${gr},${gg},${gb},${glowOp * 0.4})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // ─── After 10 min, a third current emerges (reward for staying) ───
      if (minutes > 10 && state.currents.length < 3) {
        state.currents.push(createCurrent(w, h, 2));
      }

      // ─── Update & draw currents — the heart of The Quiet Water ───
      for (const current of state.currents) {
        const head = current.points[current.points.length - 1];

        // Use atan2(fbm, fbm) for smooth, sweeping curves — no jitter
        const nx = fbm(head.x * 0.002 + current.noiseOffX + t * 0.05, head.y * 0.002 + current.noiseOffY);
        const ny = fbm(head.x * 0.002 + current.noiseOffX, head.y * 0.002 + current.noiseOffY + t * 0.04);
        const angle = Math.atan2(ny, nx);

        // Breathing: imperceptible oscillation
        const breathe = 1 + Math.sin(t * 0.4) * 0.05;
        const speed = (isPaused ? 0.04 : current.speed * breathe);

        current.points.push({
          x: head.x + Math.cos(angle) * speed,
          y: head.y + Math.sin(angle) * speed,
        });
        if (current.points.length > current.maxPoints) current.points.shift();

        // Gentle edge wrap
        const last = current.points[current.points.length - 1];
        if (last.x < -30) last.x = w + 25;
        if (last.x > w + 30) last.x = -25;
        if (last.y < -30) last.y = h + 25;
        if (last.y > h + 30) last.y = -25;

        const pts = current.points;
        if (pts.length < 4) continue;

        const [cr, cg, cb] = pal.currents[current.colorIndex % pal.currents.length];

        // Glow behind the current (Turrell: light has thingness)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = `rgba(${cr},${cg},${cb},${isPaused ? 0.08 : 0.3})`;
        ctx.shadowBlur = current.width * 4;

        // Draw smooth quadratic curve: tail (barely visible) → head (softly luminous)
        const baseOp = isPaused ? 0.06 : 0.25;
        for (let j = 2; j < pts.length; j++) {
          const segT = j / pts.length;
          // Quadratic ease-in: gentle gradient, visible enough to see the flow shape
          const opacity = segT * segT * baseOp;
          if (opacity < 0.005) continue; // skip nearly invisible segments

          const lw = current.width * (0.25 + segT * 0.75);
          ctx.lineWidth = lw;
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${opacity})`;
          ctx.beginPath();
          const p0 = pts[j - 2], p1 = pts[j - 1], p2 = pts[j];
          ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
          ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      state.frame = requestAnimationFrame(animate);
    }

    state.frame = requestAnimationFrame(animate);
    return () => { if (state.frame) cancelAnimationFrame(state.frame); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayMs = countdownTarget ? Math.max(0, countdownTarget * 60000 - elapsed) : elapsed;

  // Compute timer opacity: hidden (tap-to-hide) → 0, paused → 0.15, normal → 0.7
  const timerOpacity = numbersHidden ? 0 : (timerState === 'paused' ? 0.15 : 0.7);

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: 'min(calc(100vw - 48px), 380px)', height: '55vh', maxHeight: '460px' }}
      onClick={onToggleNumbers}
      role="button"
      aria-label={numbersHidden ? 'Show timer' : 'Hide timer'}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleNumbers(); } }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ borderRadius: '20px' }}
        aria-hidden="true"
      />
      {/* Timer — tap anywhere to fade in/out (Insight Timer style) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="leading-none"
          style={{
            fontSize: '68px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            opacity: timerOpacity,
            transition: 'opacity 1.2s ease', // slow, breath-like fade
            textShadow: isDark
              ? '0 0 80px rgba(35,75,170,0.2), 0 0 160px rgba(35,75,170,0.08)'
              : '0 0 60px rgba(70,140,230,0.15)',
          }}
        >
          {formatTimer(displayMs)}
        </span>
        {timerState === 'paused' && !numbersHidden && (
          <p className="text-text-3 text-xs font-medium uppercase tracking-widest mt-3 animate-fade-in" style={{ opacity: 0.4 }}>
            Paused
          </p>
        )}
      </div>
    </div>
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
  const [timerNumbersHidden, setTimerNumbersHidden] = useState(false); // Insight Timer: tap to hide numbers
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
      setTimerNumbersHidden(false);
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
    setTimerNumbersHidden(false);
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

        {/* Timer display — The Quiet Water or Classic clock */}
        {timerState !== 'stopped' && timerDisplayMode === 'symbolic' ? (
          /* The Quiet Water — gentle currents through noise field (Turrell/Eno/Rams synthesis) */
          <div
            className="flex flex-col items-stretch justify-center mb-4 relative"
            role="timer"
            aria-label={`Practice time: ${formatTimer(elapsed)}`}
          >
            <QuietWaterCanvas
              elapsed={elapsed}
              timerState={timerState}
              prefersReduced={prefersReduced}
              countdownTarget={countdownTarget}
              isDark={isDark}
              numbersHidden={timerNumbersHidden}
              onToggleNumbers={() => setTimerNumbersHidden(h => !h)}
            />
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
