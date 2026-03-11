import { useEffect, useRef } from 'react';
import { hourglassPath, hourglassDims, timerProgress, valueNoise } from './hourglassGeometry.js';

// ─── Team Alpha — "Digital Vanguard" ───
// Animated noise texture with a rising fill line.
// Bright below the line, dark above. Noise field is alive.
// Think Lieberman's creative coding + Ikeda's precision.
// Single visual element = restrained. Noise = organic.

// ─── Forest palette ───
const BRIGHT_PALETTE = [
  [76, 174, 174],   // verdigris
  [141, 181, 133],  // olivine
  [204, 248, 249],  // mint
  [108, 195, 160],  // mid-blend: verdigris→olivine
  [160, 220, 200],  // mid-blend: olivine→mint
];
const DARK_FILL = [15, 13, 10]; // near-black for unlit regions

// Pick a forest color from noise value (0–1)
function forestColor(n) {
  const idx = n * (BRIGHT_PALETTE.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, BRIGHT_PALETTE.length - 1);
  const frac = idx - lo;
  const a = BRIGHT_PALETTE[lo];
  const b = BRIGHT_PALETTE[hi];
  return [
    a[0] + (b[0] - a[0]) * frac,
    a[1] + (b[1] - a[1]) * frac,
    a[2] + (b[2] - a[2]) * frac,
  ];
}

export default function HourglassAlpha({
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
    sized: false,
    w: 0,
    h: 0,
  });
  const propsRef = useRef({});
  propsRef.current = { elapsed, timerState, prefersReduced, isDark, countdownTarget };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const state = stateRef.current;

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
      return true;
    }

    function animate() {
      // Lazy sizing
      if (!state.sized) {
        state.sized = sizeCanvas();
        if (!state.sized) {
          state.frame = requestAnimationFrame(animate);
          return;
        }
      }

      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark, countdownTarget: cdTarget } = propsRef.current;
      const isPaused = ts === 'paused';
      const isStopped = ts === 'stopped';
      const { w, h } = state;

      // Time advances slowly for noise animation; slower when paused
      state.time += isPaused ? 0.003 : 0.016;
      const t = state.time;

      // ─── Hourglass dimensions ───
      const { cx, cy, glassW, glassH, topY, botY, neckY } = hourglassDims(w, h);

      // ─── Progress: fill line rises from bottom to top ───
      const progress = timerProgress(el, cdTarget);

      // Fill line Y: at botY when progress=0, at topY when progress=1
      const fillLineY = botY - progress * (botY - topY);

      // Transition zone half-width (soft gradient edge)
      const transitionHalf = 20;

      // Breathing: slow brightness oscillation (~3%)
      const breathe = 1.0 + Math.sin(t * 0.4) * 0.03;

      // ─── Background ───
      const [dr, dg, db] = DARK_FILL;
      ctx.fillStyle = `rgb(${dr},${dg},${db})`;
      ctx.fillRect(0, 0, w, h);

      // ─── Clip to hourglass shape ───
      ctx.save();
      hourglassPath(ctx, cx, cy, glassW, glassH);
      ctx.clip();

      // ─── Noise field rendering ───
      // Step size: 3px for performance
      const step = pr ? 6 : 3;
      const noiseScale = 0.035; // spatial frequency of noise
      const timeScale = 0.008;  // how fast noise drifts

      // Noise offset drifts slowly over time (alive)
      const tOffsetX = t * timeScale * 60;
      const tOffsetY = t * timeScale * 40;

      // We'll draw rectangles (step x step) for each cell
      for (let py = topY; py < botY; py += step) {
        for (let px = cx - glassW * 0.5; px < cx + glassW * 0.5; px += step) {
          // Sample noise at this cell
          const nx = px * noiseScale + tOffsetX;
          const ny = py * noiseScale + tOffsetY;
          const n = valueNoise(nx, ny);

          // Second octave for richness (half amplitude, double frequency)
          const n2 = valueNoise(nx * 2.1 + 100, ny * 2.1 + 100) * 0.5;
          const noiseCombined = (n + n2) / 1.5; // normalized ~0-1

          // Distance from fill line (positive = below = bright region)
          const distFromFill = fillLineY - py;
          // Blend factor: 1 = fully bright (below), 0 = fully dark (above)
          let brightFactor;
          if (distFromFill > transitionHalf) {
            brightFactor = 1.0;
          } else if (distFromFill < -transitionHalf) {
            brightFactor = 0.0;
          } else {
            // Smooth transition in the gradient zone
            brightFactor = (distFromFill + transitionHalf) / (transitionHalf * 2);
            brightFactor = brightFactor * brightFactor * (3 - 2 * brightFactor); // smoothstep
          }

          // Apply breathing to brightness
          brightFactor *= breathe;

          // Color: forest palette for bright, near-black for dark
          // Luminance = brightFactor modulated by noise for organic texture
          const [fr, fg, fb] = forestColor(noiseCombined);
          const lum = brightFactor * (0.7 + noiseCombined * 0.3);
          const cr = Math.round(dr + (fr - dr) * lum);
          const cg = Math.round(dg + (fg - dg) * lum);
          const cb = Math.round(db + (fb - db) * lum);

          ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
          ctx.fillRect(px, py, step, step);
        }
      }

      // ─── Fill line glow: a faint luminous seam ───
      if (progress > 0.005 && progress < 0.995) {
        const glowGrad = ctx.createLinearGradient(0, fillLineY - 30, 0, fillLineY + 10);
        glowGrad.addColorStop(0, 'rgba(76,174,174,0)');
        glowGrad.addColorStop(0.4, `rgba(160,230,220,${0.12 * breathe})`);
        glowGrad.addColorStop(0.6, `rgba(204,248,249,${0.18 * breathe})`);
        glowGrad.addColorStop(1, 'rgba(76,174,174,0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(cx - glassW * 0.5, fillLineY - 30, glassW, 40);
      }

      ctx.restore(); // unclip

      // ─── Hourglass outline (etched glass) ───
      hourglassPath(ctx, cx, cy, glassW, glassH);
      ctx.strokeStyle = dark
        ? `rgba(76,174,174,${0.12 + progress * 0.04})`
        : `rgba(60,130,130,${0.15 + progress * 0.04})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ─── Glass highlight (left edge reflection, etched look) ───
      if (!pr) {
        ctx.save();
        hourglassPath(ctx, cx, cy, glassW, glassH);
        ctx.clip();
        const reflGrad = ctx.createLinearGradient(cx - glassW * 0.42, 0, cx - glassW * 0.28, 0);
        reflGrad.addColorStop(0, `rgba(204,248,249,${0.03 * breathe})`);
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(cx - glassW * 0.45, topY, glassW * 0.2, glassH);
        ctx.restore();
      }

      // ─── Subtle ambient glow around hourglass ───
      if (!pr && progress > 0.03) {
        const glowI = Math.min(0.06, progress * 0.06);
        const ambGrad = ctx.createRadialGradient(cx, cy, glassH * 0.15, cx, cy, glassH * 0.55);
        ambGrad.addColorStop(0, `rgba(76,174,174,${glowI * breathe})`);
        ambGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ambGrad;
        ctx.fillRect(0, 0, w, h);
      }

      state.frame = requestAnimationFrame(animate);
    }

    state.frame = requestAnimationFrame(animate);
    return () => {
      if (state.frame) cancelAnimationFrame(state.frame);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Timer display ───
  const displayMs = countdownTarget ? Math.max(0, countdownTarget * 60000 - elapsed) : elapsed;
  const isStopped = timerState === 'stopped';
  const timerOpacity = isStopped ? 0.9 : (numbersHidden ? 0 : (timerState === 'paused' ? 0.4 : 0.85));

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: 'min(calc(100vw - 48px), 380px)', height: '55vh', maxHeight: '460px' }}
      onClick={isStopped ? undefined : onToggleNumbers}
      role="button"
      aria-label={numbersHidden ? 'Show timer' : 'Hide timer'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isStopped && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggleNumbers();
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          borderRadius: '20px',
          opacity: numbersHidden ? 1 : 0.25,
          transition: 'opacity 1.2s ease',
        }}
        aria-hidden="true"
      />
      {/* Timer overlay */}
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
