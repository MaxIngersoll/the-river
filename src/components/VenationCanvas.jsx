import { useEffect, useRef } from 'react';

// ─── The Living Vein — Venation Growth Timer Visualization ───
// Competition L winner. 7-artist panel. Nervous System + Lieberman + Kurokawa synthesis.
//
// Space Colonization Algorithm (leaf venation): branches grow toward scattered
// auxin attractors. Raven Kwok's fbm noise makes branches organic. Lieberman's
// breathing gives the whole structure life. Kurokawa's color journey maps
// generation depth to the forest palette.
//
// Progressive disclosure: nothing for 30s, then a single branch begins to grow.
// By 30 minutes, the canvas fills with an intricate venation pattern.
// Every branch is earned through practice time.

// ─── Value noise with fBm (shared with TimerFAB) ───
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

// ─── Forest palette by generation depth ───
// Ethereal: visible but soft, like veins emerging from darkness
const VEIN_PALETTE_DARK = [
  [90, 140, 75],    // gen 0: muted forest (trunk)
  [110, 165, 100],  // gen 1: olivine
  [85, 160, 145],   // gen 2: teal-green
  [76, 174, 174],   // gen 3: verdigris
  [110, 195, 185],  // gen 4: light teal
  [160, 225, 220],  // gen 5+: pale mint (tips)
];

const VEIN_PALETTE_LIGHT = [
  [50, 90, 38],     // gen 0: deep hunter (trunk)
  [60, 105, 48],    // gen 1: hunter green
  [75, 125, 60],    // gen 2: mid forest
  [60, 130, 120],   // gen 3: teal
  [55, 115, 110],   // gen 4: deep teal
  [65, 140, 130],   // gen 5+: teal bright
];

function getVeinColor(generation, isDark) {
  const palette = isDark ? VEIN_PALETTE_DARK : VEIN_PALETTE_LIGHT;
  const idx = Math.min(generation, palette.length - 1);
  return palette[idx];
}

// ─── Growth parameters ───
const MAX_SEGMENTS = 1800;
const AUXIN_COUNT = 300;
const ATTRACTION_RADIUS = 140;
const KILL_RADIUS = 8;
const STEP_SIZE = 3.5;
const BRANCH_CHANCE = 0.22;
const BRANCH_EVERY = 8; // check for branching every N growth steps

// How many growth steps per animation frame, based on elapsed minutes
function growthRate(minutes) {
  if (minutes < 0.5) return 0;     // 30s silence — progressive disclosure
  if (minutes < 2) return 1;
  if (minutes < 5) return 2;
  if (minutes < 10) return 3;
  if (minutes < 20) return 4;
  if (minutes < 30) return 5;
  return 1;                         // slow maintenance growth
}

// Target total segments for a given elapsed time (for catch-up on restore)
function targetSegments(minutes) {
  if (minutes < 0.5) return 0;
  if (minutes < 2) return Math.round((minutes - 0.5) * 60 * 1);   // ~90
  if (minutes < 5) return 90 + Math.round((minutes - 2) * 60 * 2);  // ~450
  if (minutes < 10) return 450 + Math.round((minutes - 5) * 60 * 3); // ~1350
  if (minutes < 20) return Math.min(MAX_SEGMENTS, 1350 + Math.round((minutes - 10) * 60 * 4));
  return MAX_SEGMENTS;
}

// ─── Initialize venation state ───
function initVenation(cx, cy, maxRadius) {
  const branches = [{ x: cx, y: cy, parentIdx: -1, generation: 0 }];

  // Start with 4 tips in cardinal directions for even radial growth
  const tips = [];
  const initialDirs = [
    [0, -1],   // up
    [1, 0],    // right
    [0, 1],    // down
    [-1, 0],   // left
  ];
  for (const [dx, dy] of initialDirs) {
    const tipX = cx + dx * STEP_SIZE * 2;
    const tipY = cy + dy * STEP_SIZE * 2;
    const idx = branches.length;
    branches.push({ x: tipX, y: tipY, parentIdx: 0, generation: 0 });
    tips.push({ x: tipX, y: tipY, branchIdx: idx, generation: 0, steps: 0 });
  }

  // Scatter auxin attractors evenly across a circular region
  const auxins = [];
  const seed = 137;
  let rng = seed;
  for (let i = 0; i < AUXIN_COUNT; i++) {
    rng = (rng * 16807) % 2147483647;
    const angle = (rng / 2147483647) * Math.PI * 2;
    rng = (rng * 16807) % 2147483647;
    // Mix of near and far auxins for gradual spreading
    const rFactor = 0.15 + Math.sqrt(rng / 2147483647) * 0.75;
    const r = rFactor * maxRadius;
    auxins.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      active: true,
    });
  }

  return { branches, tips, auxins };
}

// ─── One growth step ───
function growStep(state, cx, cy, time) {
  const { branches, tips, auxins } = state;
  if (branches.length >= MAX_SEGMENTS || tips.length === 0) return;

  const newTips = [];

  for (let ti = tips.length - 1; ti >= 0; ti--) {
    const tip = tips[ti];

    // Find nearest active auxin within attraction radius
    let nearDist = Infinity;
    let nearIdx = -1;
    for (let ai = 0; ai < auxins.length; ai++) {
      if (!auxins[ai].active) continue;
      const dx = auxins[ai].x - tip.x;
      const dy = auxins[ai].y - tip.y;
      const dist = dx * dx + dy * dy; // squared for speed
      if (dist < nearDist) {
        nearDist = dist;
        nearIdx = ai;
      }
    }

    nearDist = Math.sqrt(nearDist);

    if (nearIdx === -1 || nearDist > ATTRACTION_RADIUS) {
      // No nearby auxin — this tip dies
      tips.splice(ti, 1);
      continue;
    }

    // Grow toward auxin
    const auxin = auxins[nearIdx];
    const dx = auxin.x - tip.x;
    const dy = auxin.y - tip.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.1) continue;

    const dirX = dx / len;
    const dirY = dy / len;

    // Noise displacement (Raven Kwok: organic curves, not zigzag)
    const nx = fbm(tip.x * 0.008 + time * 0.05, tip.y * 0.008) * 1.5;
    const ny = fbm(tip.x * 0.008 + 50, tip.y * 0.008 + time * 0.05) * 1.5;

    const newX = tip.x + dirX * STEP_SIZE + nx;
    const newY = tip.y + dirY * STEP_SIZE + ny;

    // Add branch segment
    const newIdx = branches.length;
    branches.push({
      x: newX,
      y: newY,
      parentIdx: tip.branchIdx,
      generation: tip.generation,
    });

    // Update tip
    tip.x = newX;
    tip.y = newY;
    tip.branchIdx = newIdx;
    tip.steps++;

    // Kill auxin if close enough
    if (nearDist < KILL_RADIUS) {
      auxins[nearIdx].active = false;
    }

    // Branching — create new tip splitting off
    if (tip.steps % BRANCH_EVERY === 0 && tip.generation < 5) {
      // Use deterministic randomness based on position
      const branchSeed = Math.abs(fbm(newX * 0.1, newY * 0.1));
      if (branchSeed < BRANCH_CHANCE) {
        // Perpendicular direction with some noise
        const perpX = -dirY;
        const perpY = dirX;
        const side = fbm(newX, newY) > 0 ? 1 : -1;
        newTips.push({
          x: newX + perpX * side * STEP_SIZE,
          y: newY + perpY * side * STEP_SIZE,
          branchIdx: newIdx,
          generation: tip.generation + 1,
          steps: 0,
        });
      }
    }

    // Stop after max segments
    if (branches.length >= MAX_SEGMENTS) break;
  }

  // Add new branch tips
  for (const nt of newTips) {
    tips.push(nt);
  }
}


// ─── React Component ───

export default function VenationCanvas({
  elapsed,
  timerState,
  prefersReduced,
  countdownTarget,
  isDark,
  numbersHidden,
  onToggleNumbers,
  colonPulsing,
  colonPulseDuration,
  timerDepthColor,
  formatTimerParts,
  formatTimer,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    frame: null,
    time: 0,
    venation: null,
    cx: 0,
    cy: 0,
    maxRadius: 0,
    lastSegmentCount: 0,
  });
  const propsRef = useRef({});
  propsRef.current = { elapsed, timerState, prefersReduced, isDark };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const state = stateRef.current;
    let sized = false;

    function sizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      state.w = rect.width;
      state.h = rect.height;
      state.cx = rect.width / 2;
      state.cy = rect.height / 2;
      state.maxRadius = Math.min(rect.width, rect.height) * 0.42;

      // Initialize venation when we have real dimensions
      if (!state.venation) {
        state.venation = initVenation(state.cx, state.cy, state.maxRadius);

        // Catch-up: if timer was restored from localStorage with significant elapsed time,
        // run enough growth steps to fill the tree to the expected density
        const initialMinutes = propsRef.current.elapsed / 60000;
        if (initialMinutes > 0.5) {
          const target = targetSegments(initialMinutes);
          let catchupTime = 0.5;
          while (state.venation.branches.length < target && catchupTime < 100) {
            for (let i = 0; i < 50; i++) {
              growStep(state.venation, state.cx, state.cy, catchupTime);
            }
            catchupTime += 0.1;
          }
        }
      }

      return true;
    }

    function animate() {
      // Lazy canvas sizing — wait for parent to have real dimensions
      if (!sized) {
        sized = sizeCanvas();
        if (!sized) {
          state.frame = requestAnimationFrame(animate);
          return;
        }
      }

      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark } = propsRef.current;
      const isPaused = ts === 'paused';
      const minutes = el / 60000;
      const { w, h, cx, cy, maxRadius } = state;

      state.time += isPaused ? 0.0003 : 0.001;

      // ─── Background: Eliasson's Slow Sun (warmth over 30min) ───
      const warmth = Math.min(1, minutes / 30);
      let bgR, bgG, bgB;
      if (dark) {
        bgR = Math.round(10 + warmth * 16);
        bgG = Math.round(8 + warmth * 10);
        bgB = Math.round(6 + warmth * 2);
      } else {
        bgR = Math.round(242 - warmth * 8);
        bgG = Math.round(240 - warmth * 6);
        bgB = Math.round(236 - warmth * 10);
      }
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
      ctx.fillRect(0, 0, w, h);

      // Warm ambient glow
      if (!pr && minutes > 1) {
        const gi = Math.min(0.06, (minutes - 1) * 0.002);
        const gr = maxRadius * (0.5 + warmth * 0.5);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
        if (dark) {
          grad.addColorStop(0, `rgba(100,160,100,${gi})`);
          grad.addColorStop(0.5, `rgba(64,89,48,${gi * 0.3})`);
        } else {
          grad.addColorStop(0, `rgba(141,181,133,${gi * 0.5})`);
          grad.addColorStop(0.5, `rgba(100,140,90,${gi * 0.2})`);
        }
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // ─── Grow the venation structure ───
      if (!isPaused && state.venation) {
        const rate = growthRate(minutes);
        for (let i = 0; i < rate; i++) {
          growStep(state.venation, cx, cy, state.time);
        }
      }

      // ─── Lieberman's Breathing: entire structure inhales/exhales ───
      const breathPhase = Math.sin(state.time * 0.8) * 0.003;
      const breathScale = 1 + (pr ? 0 : breathPhase);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(breathScale, breathScale);
      ctx.translate(-cx, -cy);

      // ─── Draw all branch segments ───
      if (state.venation) {
        const { branches } = state.venation;

        for (let i = 1; i < branches.length; i++) {
          const seg = branches[i];
          const parent = branches[seg.parentIdx];
          if (!parent) continue;

          const [cr, cg, cb] = getVeinColor(seg.generation, dark);

          // Line width thins with generation (trunk=thick, tips=thin)
          const lineW = Math.max(0.8, 2.8 - seg.generation * 0.35);

          // Opacity: ethereal baseline — visible but soft
          const age = i / branches.length;
          const baseOpacity = dark ? 0.6 : 0.45;
          const opacity = baseOpacity + (1 - age) * 0.15;

          ctx.beginPath();
          ctx.moveTo(parent.x, parent.y);
          ctx.lineTo(seg.x, seg.y);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${opacity})`;
          ctx.lineWidth = lineW;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // ─── Active tip glow (Kurokawa: gentle shimmer at growth points) ───
        if (!pr) {
          const { tips: activeTips } = state.venation;
          for (const tip of activeTips) {
            const [cr, cg, cb] = getVeinColor(tip.generation, dark);
            const pulseAlpha = 0.3 + Math.sin(state.time * 2.5 + tip.x * 0.08) * 0.15;

            // Soft glow
            ctx.shadowColor = `rgba(${cr},${cg},${cb},0.35)`;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${pulseAlpha})`;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      ctx.restore();

      state.frame = requestAnimationFrame(animate);
    }

    state.frame = requestAnimationFrame(animate);
    return () => { if (state.frame) cancelAnimationFrame(state.frame); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayMs = countdownTarget ? Math.max(0, countdownTarget * 60000 - elapsed) : elapsed;
  const isStopped = timerState === 'stopped';
  // Toggle: numbers visible → art dim. Art visible → numbers gone.
  const timerOpacity = isStopped ? 0.9 : (numbersHidden ? 0 : (timerState === 'paused' ? 0.4 : 0.85));

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: 'min(calc(100vw - 48px), 380px)', height: '55vh', maxHeight: '460px' }}
      onClick={isStopped ? undefined : onToggleNumbers}
      role="button"
      aria-label={numbersHidden ? 'Show timer' : 'Hide timer'}
      tabIndex={0}
      onKeyDown={(e) => { if (!isStopped && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onToggleNumbers(); } }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          borderRadius: '20px',
          opacity: numbersHidden ? 1 : 0.15,
          transition: 'opacity 1.2s ease',
        }}
        aria-hidden="true"
      />
      {/* Timer overlay — tap to fade in/out */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="leading-none"
          style={{
            fontSize: isStopped ? '80px' : '68px',
            fontFamily: isStopped ? 'var(--font-ceremony)' : 'var(--font-serif)',
            fontWeight: 400,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            color: isStopped ? 'var(--color-text)' : timerDepthColor,
            opacity: timerOpacity,
            transition: 'opacity 1.2s ease, color 2s ease, font-size 0.6s ease',
            textShadow: isDark
              ? '0 0 80px rgba(100,160,100,0.2), 0 0 160px rgba(64,89,48,0.08)'
              : '0 0 60px rgba(100,145,90,0.15)',
          }}
        >
          {formatTimerParts(displayMs).map((part, i) =>
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
