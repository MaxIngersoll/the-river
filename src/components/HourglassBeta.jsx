import { useEffect, useRef } from 'react';
import { hourglassPath, hourglassDims, hourglassHalfW, timerProgress, valueNoise, smoothstep } from './hourglassGeometry.js';

// ─── Team Beta — "Classic Elegance" ───
// Hara + Rams synthesis. Less but better.
// Clean hourglass outline. Warm sand fills from bottom.
// The top edge of the fill is a watercolor bleed — ink soaking upward.
// A barely-visible pulse in the bleed edge = the heartbeat.
// No particles. No drops. No grains. Just shape + fill + bleed.

// Sand body colors
const FILL = {
  dark:  [165, 155, 130],
  light: [145, 135, 110],
};

// Hourglass outline color
const OUTLINE = [140, 135, 120];

export default function HourglassBeta({
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
        if (!state.sized) { state.frame = requestAnimationFrame(animate); return; }
      }

      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark, countdownTarget: ct } = propsRef.current;
      const isPaused = ts === 'paused';
      const { w, h } = state;

      // Time advances slowly when paused
      state.time += isPaused ? 0.002 : 0.016;
      const t = state.time;

      // ─── Geometry ───
      const { cx, cy, glassW, glassH, topY, botY, neckY } = hourglassDims(w, h);

      // ─── Progress: 0 → 1 ───
      const progress = timerProgress(el, ct);

      // ─── Fill level ───
      // Sand fills from bottom. fillY = where the fill top is.
      // At progress=0, fillY = botY (empty). At progress=1, fillY = topY (full).
      const fillY = botY - (botY - topY) * progress;

      // ─── Colors ───
      const [fr, fg, fb] = dark ? FILL.dark : FILL.light;
      const [or, og, ob] = OUTLINE;

      // ─── Clear ───
      ctx.clearRect(0, 0, w, h);

      // ─── Subtle warm background (barely perceptible) ───
      const warmth = Math.min(1, progress);
      if (dark) {
        ctx.fillStyle = `rgb(${Math.round(10 + warmth * 5)},${Math.round(8 + warmth * 3)},${Math.round(6 + warmth * 1)})`;
      } else {
        ctx.fillStyle = `rgb(${Math.round(247 - warmth * 3)},${Math.round(245 - warmth * 2)},${Math.round(241 - warmth * 4)})`;
      }
      ctx.fillRect(0, 0, w, h);

      // ─── Hourglass outline (etched glass) ───
      hourglassPath(ctx, cx, cy, glassW, glassH);
      ctx.strokeStyle = `rgba(${or},${og},${ob},0.12)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // ─── Sand fill, clipped to hourglass ───
      if (progress > 0.001) {
        ctx.save();
        hourglassPath(ctx, cx, cy, glassW, glassH);
        ctx.clip();

        // Heartbeat pulse — ~3 second cycle, 2-3px amplitude
        const pulsePhase = Math.sin(t * 2.1) * 0.5 + 0.5; // 0→1, period ~3s
        const pulseOffset = pr ? 0 : pulsePhase * 2.5; // 0 to 2.5px

        // The bleed zone: ~35px of gradient from solid to transparent
        const BLEED_ZONE = 35;

        // Draw the fill in horizontal scanlines for the watercolor bleed effect.
        // Below the bleed zone: solid fill.
        // Within the bleed zone: alpha fades out with noise-driven irregularity.

        const scanTop = Math.max(topY, fillY - BLEED_ZONE - 5);
        const scanBot = botY + 1;

        for (let y = scanBot; y >= scanTop; y -= 1) {
          // How far above the fill line is this scanline?
          const distAboveFill = fillY - y;

          let alpha;
          if (distAboveFill < -BLEED_ZONE) {
            // Well below fill line — fully solid
            alpha = 1;
          } else if (distAboveFill < 0) {
            // Below fill line but within lower transition — nearly solid
            alpha = 0.85 + 0.15 * smoothstep(Math.abs(distAboveFill) / BLEED_ZONE);
          } else {
            // Above fill line — the bleed zone
            // Base falloff
            let baseFade = 1 - smoothstep(distAboveFill / BLEED_ZONE);

            // Noise-driven irregularity — some columns bleed higher
            // Use x-position sampling across the hourglass width
            const noiseScale = 0.08;
            const noiseTime = t * 0.15;
            // Sample noise at this y-level to vary the bleed height
            const bleedNoise = pr ? 0 : (valueNoise(y * noiseScale + noiseTime, 42) - 0.5) * 0.4;

            // Pulse shifts the bleed edge upward
            const effectiveDist = distAboveFill - pulseOffset;
            baseFade = 1 - smoothstep(Math.max(0, effectiveDist) / BLEED_ZONE);

            alpha = Math.max(0, baseFade + bleedNoise * baseFade);
          }

          if (alpha <= 0.005) continue;

          // Get the hourglass width at this y
          const hw = hourglassHalfW(cy, glassH, glassW, y);
          if (hw <= 0) continue;

          // Per-scanline noise variation for watercolor texture
          const lineNoise = pr ? 0 : (valueNoise(y * 0.12 + t * 0.05, 17) - 0.5) * 0.06;
          const finalAlpha = Math.min(1, Math.max(0, (alpha + lineNoise) * 0.85));

          ctx.fillStyle = `rgba(${fr},${fg},${fb},${finalAlpha.toFixed(3)})`;
          ctx.fillRect(cx - hw, y, hw * 2, 1.2);
        }

        // ─── Watercolor bleed edge detail ───
        // Draw a few wispy tendrils above the main bleed for organic feel
        if (!pr && progress > 0.01) {
          const tendrilCount = 7;
          for (let i = 0; i < tendrilCount; i++) {
            // Each tendril is at a fixed x-position across the hourglass
            const frac = (i + 0.5) / tendrilCount; // 0.07 to 0.93
            const tendrilX = cx + (frac - 0.5) * glassW * 0.7;
            const hw = hourglassHalfW(cy, glassH, glassW, fillY);

            // Only draw if within hourglass bounds
            if (Math.abs(tendrilX - cx) > hw * 0.9) continue;

            // Each tendril reaches a different height above the fill
            const tendrilSeed = i * 13.7;
            const tendrilHeight = 8 + valueNoise(tendrilSeed, t * 0.08) * 20;
            const tendrilWidth = 2 + valueNoise(tendrilSeed + 5, t * 0.06) * 4;

            // Pulse affects tendrils more
            const tendrilPulse = pulseOffset * 1.3;

            for (let dy = 0; dy < tendrilHeight + tendrilPulse; dy += 1) {
              const ty = fillY - dy;
              if (ty < topY) break;

              const fade = 1 - smoothstep(dy / (tendrilHeight + tendrilPulse));
              const wobble = Math.sin(dy * 0.3 + t * 0.8 + i * 2) * 1.5;
              const tAlpha = fade * 0.15 * (1 - dy / (tendrilHeight + tendrilPulse + 10));

              if (tAlpha < 0.005) continue;

              ctx.fillStyle = `rgba(${fr},${fg},${fb},${tAlpha.toFixed(3)})`;
              ctx.fillRect(tendrilX + wobble - tendrilWidth / 2, ty, tendrilWidth, 1.2);
            }
          }
        }

        ctx.restore();
      }

      // ─── Faint glass reflection (left edge, etched look) ───
      if (!pr) {
        ctx.save();
        hourglassPath(ctx, cx, cy, glassW, glassH);
        ctx.clip();
        const reflGrad = ctx.createLinearGradient(cx - glassW * 0.42, 0, cx - glassW * 0.30, 0);
        reflGrad.addColorStop(0, dark ? 'rgba(180,175,160,0.025)' : 'rgba(255,255,255,0.04)');
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(cx - glassW * 0.45, topY, glassW * 0.2, glassH);
        ctx.restore();
      }

      state.frame = requestAnimationFrame(animate);
    }

    state.frame = requestAnimationFrame(animate);
    return () => { if (state.frame) cancelAnimationFrame(state.frame); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      onKeyDown={(e) => { if (!isStopped && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onToggleNumbers(); } }}
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
