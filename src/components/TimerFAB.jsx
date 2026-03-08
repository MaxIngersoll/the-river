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

// ─── Simplex-style 2D noise (compact, no dependency) ───
// Classic Perlin-inspired gradient noise — 3% rule: take the well-known algorithm, adapt to our palette
const NOISE_PERM = (() => {
  const p = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates shuffle with fixed seed for determinism
  let seed = 42;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807 + 0) % 2147483647;
    const j = seed % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p]; // double for overflow
})();

const NOISE_GRAD = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }

function noise2D(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const u = fade(xf), v = fade(yf);
  const aa = NOISE_PERM[NOISE_PERM[X] + Y], ab = NOISE_PERM[NOISE_PERM[X] + Y + 1];
  const ba = NOISE_PERM[NOISE_PERM[X + 1] + Y], bb = NOISE_PERM[NOISE_PERM[X + 1] + Y + 1];
  const g = (hash, dx, dy) => { const gr = NOISE_GRAD[hash & 7]; return gr[0] * dx + gr[1] * dy; };
  return lerp(
    lerp(g(aa, xf, yf), g(ba, xf - 1, yf), u),
    lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u),
    v
  );
}

// ─── The Flow — Perlin noise particle flow field (Fry/Reas/Abloh synthesis) ───
// Particles born at center, flowing outward through noise field.
// Each particle IS a moment of practice. Your time becomes visible as flowing light.
function FlowCanvas({ elapsed, timerState, prefersReduced, countdownTarget, isDark }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef(null);
  const timeRef = useRef(0);
  const lastSpawnRef = useRef(0);

  // Resolve CSS colors for canvas (can't use var() in canvas)
  const colors = useMemo(() => {
    if (isDark) {
      return {
        water1: 'rgba(30, 58, 95, 0.9)',
        water2: 'rgba(50, 90, 210, 0.9)',    // brighter blue
        water3: 'rgba(60, 120, 250, 0.85)',
        water4: 'rgba(80, 150, 255, 0.8)',
        water5: 'rgba(120, 180, 255, 0.75)',
        lavender: 'rgba(200, 185, 255, 0.7)',
        glow: 'rgba(59, 130, 246, 0.25)',
      };
    }
    return {
      water1: 'rgba(150, 200, 254, 0.9)',
      water2: 'rgba(80, 150, 250, 0.85)',
      water3: 'rgba(50, 120, 246, 0.8)',
      water4: 'rgba(37, 99, 235, 0.75)',
      water5: 'rgba(30, 64, 175, 0.7)',
      lavender: 'rgba(167, 139, 250, 0.65)',
      glow: 'rgba(59, 130, 246, 0.15)',
    };
  }, [isDark]);

  // Color based on particle age and elapsed time
  const getParticleColor = useCallback((age, minutes) => {
    // Every 7th particle gets lavender accent
    if (age > 0.5 && Math.random() < 0.003) return colors.lavender;
    if (minutes >= 30) return colors.water5;
    if (minutes >= 15) return colors.water4;
    if (minutes >= 5) return colors.water3;
    return colors.water2;
  }, [colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Size canvas to container
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const isPaused = timerState === 'paused';
    const isRunning = timerState === 'running';
    const minutes = elapsed / 60000;

    // Spawn rate increases with time (more particles = richer flow)
    const spawnRate = Math.min(8, 1 + minutes * 0.3); // 1/frame → 8/frame over 23min
    const maxParticles = prefersReduced ? 40 : Math.min(300, 60 + minutes * 8);
    const noiseScale = 0.008; // How zoomed-in the flow field is
    const noiseZ = elapsed * 0.00003; // Slowly evolving field (Reas: emergence over time)

    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const cx = w / 2;
    const cy = h / 2;

    function spawnParticle() {
      // Born near center with slight randomness
      const angle = Math.random() * Math.PI * 2;
      const dist = 4 + Math.random() * 12;
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 180 + Math.random() * 220, // ~3-7 seconds at 60fps
        size: 1.8 + Math.random() * 2.5,
        hueShift: Math.random(), // for color variety
      };
    }

    function animate() {
      const particles = particlesRef.current;

      // Semi-transparent clear for trail effect (Hodgin: luminous trails)
      // Lower alpha = longer trails. 0.03 gives beautiful ghostly persistence.
      ctx.fillStyle = isDark ? 'rgba(12, 10, 9, 0.035)' : 'rgba(237, 234, 228, 0.04)';
      ctx.fillRect(0, 0, w, h);

      // Spawn new particles (only when running)
      if (isRunning && !prefersReduced) {
        const now = performance.now();
        if (now - lastSpawnRef.current > 50) { // ~20 spawns/sec max
          const count = Math.ceil(spawnRate);
          for (let i = 0; i < count && particles.length < maxParticles; i++) {
            particles.push(spawnParticle());
          }
          lastSpawnRef.current = now;
        }
      }

      // Update and draw particles
      timeRef.current += 0.01;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Remove dead particles
        if (p.life > p.maxLife || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          particles.splice(i, 1);
          continue;
        }

        // Flow field force from Perlin noise
        const noiseVal = noise2D(p.x * noiseScale + noiseZ, p.y * noiseScale + noiseZ);
        const angle = noiseVal * Math.PI * 4; // Full rotation range

        // Outward drift from center (gentle, not explosive)
        const dx = p.x - cx, dy = p.y - cy;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        const outwardForce = 0.02 + distFromCenter * 0.0001;
        const outAngle = Math.atan2(dy, dx);

        // Combine flow field + outward drift
        const speed = isPaused ? 0.2 : 0.8 + minutes * 0.015;
        p.vx += (Math.cos(angle) * 0.5 + Math.cos(outAngle) * outwardForce) * speed;
        p.vy += (Math.sin(angle) * 0.5 + Math.sin(outAngle) * outwardForce) * speed;

        // Damping (prevents runaway velocity)
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Opacity: fade in, sustain, fade out
        const lifeT = p.life / p.maxLife;
        let opacity;
        if (lifeT < 0.1) opacity = lifeT / 0.1; // Fade in
        else if (lifeT > 0.7) opacity = (1 - lifeT) / 0.3; // Fade out
        else opacity = 1;
        opacity *= isPaused ? 0.25 : 0.85;

        // Color deepens with practice time
        const color = getParticleColor(lifeT, minutes);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (isPaused ? 0.6 : 1), 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${opacity})`);
        ctx.fill();
      }

      // Center glow — soft ambient light (not a staring eye — spread wide, no hard edge)
      if (!prefersReduced) {
        const glowSize = 60 + Math.sin(timeRef.current * 0.3) * 10;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
        gradient.addColorStop(0, colors.glow.replace(/[\d.]+\)$/, `${isPaused ? 0.05 : 0.15})`));
        gradient.addColorStop(0.4, colors.glow.replace(/[\d.]+\)$/, `${isPaused ? 0.02 : 0.06})`));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - glowSize, cy - glowSize, glowSize * 2, glowSize * 2);
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    // Start animation
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [elapsed, timerState, prefersReduced, isDark, colors, getParticleColor]);

  const displayMs = countdownTarget ? Math.max(0, countdownTarget * 60000 - elapsed) : elapsed;

  return (
    <div className="relative w-full" style={{ maxWidth: '360px', height: '55vh', maxHeight: '440px' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-2xl"
        aria-hidden="true"
      />
      {/* Time display — integrated into the flow, not layered awkwardly */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="leading-none"
          style={{
            fontSize: '64px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            opacity: timerState === 'paused' ? 0.25 : 0.7,
            transition: 'opacity 0.5s ease',
            textShadow: isDark ? '0 0 40px rgba(59,130,246,0.2)' : '0 0 30px rgba(191,219,254,0.3)',
          }}
        >
          {formatTimer(displayMs)}
        </span>
        {timerState === 'paused' && (
          <p className="text-text-3 text-xs font-medium uppercase tracking-widest mt-3 animate-fade-in" style={{ opacity: 0.5 }}>
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

        {/* Timer display — The Flow (particle field) or Classic clock */}
        {timerState !== 'stopped' && timerDisplayMode === 'symbolic' ? (
          /* The Flow — particles flowing through Perlin noise (Fry/Reas/Abloh synthesis) */
          <div
            className="flex flex-col items-center justify-center mb-4 relative"
            role="timer"
            aria-label={`Practice time: ${formatTimer(elapsed)}`}
          >
            <FlowCanvas
              elapsed={elapsed}
              timerState={timerState}
              prefersReduced={prefersReduced}
              countdownTarget={countdownTarget}
              isDark={isDark}
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
