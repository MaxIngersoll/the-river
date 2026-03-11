import { useEffect, useRef } from 'react';

// ─── The Basin — Water Hourglass Timer Visualization ───
// Competition N synthesis. Max: "A beautiful hourglass. Drip, drip, drip.
// The screen fills up like an hourglass with sand, but it's water."
//
// Water drops fall from top. Each creates a ripple when it hits the surface.
// Water level rises over your practice session. Gentle waves on the surface.
// Breathing: the whole system pulses subtly. Unique per session (noise seed).
// By 30 minutes, the basin is full — you've filled your cup.

// ─── Noise (for organic variation) ───
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

// ─── Drop physics ───
const DROP_INTERVAL_BASE = 2.5;  // seconds between drops at start
const DROP_INTERVAL_MIN = 0.8;   // seconds between drops at 30 min
const DROP_RADIUS_MIN = 3;
const DROP_RADIUS_MAX = 6;
const GRAVITY = 0.15;
const MAX_RIPPLES = 8;

// ─── Color palette ───
const COLORS = {
  dark: {
    dropFill: [76, 174, 174],       // verdigris
    dropHighlight: [204, 248, 249], // mint
    waterTop: [76, 174, 174, 0.35], // verdigris translucent
    waterMid: [64, 89, 48, 0.5],    // hunter green
    waterBottom: [41, 30, 32, 0.7], // raisin black deep
    ripple: [141, 181, 133],        // olivine
    surfaceSheen: [204, 248, 249],  // mint shimmer
  },
  light: {
    dropFill: [60, 140, 130],
    dropHighlight: [120, 200, 190],
    waterTop: [60, 140, 130, 0.3],
    waterMid: [50, 100, 40, 0.4],
    waterBottom: [30, 60, 25, 0.6],
    ripple: [80, 140, 70],
    surfaceSheen: [120, 200, 190],
  },
};

export default function WaterHourglassCanvas({
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
    drops: [],        // Active falling drops: { x, y, vy, radius, born }
    ripples: [],       // Active ripples: { x, radius, maxRadius, alpha, born }
    lastDropTime: 0,
    sessionSeed: Date.now() % 10000, // Unique per session
    sized: false,
    w: 0, h: 0,
  });
  const propsRef = useRef({});
  propsRef.current = { elapsed, timerState, prefersReduced, isDark };

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
      if (!state.sized) {
        state.sized = sizeCanvas();
        if (!state.sized) {
          state.frame = requestAnimationFrame(animate);
          return;
        }
      }

      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark } = propsRef.current;
      const isPaused = ts === 'paused';
      const isStopped = ts === 'stopped';
      const minutes = el / 60000;
      const { w, h } = state;
      const palette = dark ? COLORS.dark : COLORS.light;

      state.time += isPaused ? 0.003 : 0.016;
      const t = state.time;

      // ─── Water level: 0 (empty) → 0.75 (3/4 full at 30 min) ───
      const targetLevel = countdownTarget
        ? Math.min(0.85, el / (countdownTarget * 60000) * 0.85)
        : Math.min(0.75, minutes / 30 * 0.75);
      const waterLevel = targetLevel;

      // Water surface Y coordinate (from bottom)
      const surfaceBaseY = h - waterLevel * h;

      // ─── Background: warm dark with subtle warmth over time ───
      const warmth = Math.min(1, minutes / 30);
      let bgR, bgG, bgB;
      if (dark) {
        bgR = Math.round(10 + warmth * 12);
        bgG = Math.round(8 + warmth * 6);
        bgB = Math.round(6 + warmth * 2);
      } else {
        bgR = Math.round(242 - warmth * 6);
        bgG = Math.round(240 - warmth * 4);
        bgB = Math.round(236 - warmth * 8);
      }
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
      ctx.fillRect(0, 0, w, h);

      // ─── Spawn drops ───
      if (!isPaused && !isStopped && minutes > 0) {
        const interval = DROP_INTERVAL_BASE - (minutes / 30) * (DROP_INTERVAL_BASE - DROP_INTERVAL_MIN);
        if (t - state.lastDropTime > interval) {
          // Drop spawns at a noise-varied X position near center
          const noiseX = valueNoise(t * 0.5 + state.sessionSeed, 0) - 0.5;
          const dropX = w * 0.5 + noiseX * w * 0.3;
          const radiusNoise = valueNoise(t * 0.3 + 100, state.sessionSeed);
          const dropRadius = DROP_RADIUS_MIN + radiusNoise * (DROP_RADIUS_MAX - DROP_RADIUS_MIN);

          state.drops.push({
            x: dropX,
            y: -dropRadius * 2,
            vy: 0,
            radius: dropRadius,
            born: t,
          });
          state.lastDropTime = t;
        }
      }

      // ─── Update drops ───
      for (let i = state.drops.length - 1; i >= 0; i--) {
        const drop = state.drops[i];
        drop.vy += GRAVITY;
        drop.y += drop.vy;

        // Hit water surface?
        if (drop.y + drop.radius >= surfaceBaseY) {
          // Create ripple
          if (state.ripples.length < MAX_RIPPLES) {
            state.ripples.push({
              x: drop.x,
              radius: 0,
              maxRadius: drop.radius * 8 + 10,
              alpha: 0.7,
              born: t,
            });
          }
          state.drops.splice(i, 1);
        }
      }

      // ─── Update ripples ───
      for (let i = state.ripples.length - 1; i >= 0; i--) {
        const ripple = state.ripples[i];
        const age = t - ripple.born;
        ripple.radius = ripple.maxRadius * Math.min(1, age * 1.5);
        ripple.alpha = 0.7 * Math.max(0, 1 - age * 0.8);
        if (ripple.alpha <= 0.01) {
          state.ripples.splice(i, 1);
        }
      }

      // ─── Draw water body ───
      if (waterLevel > 0.001) {
        // Breathing: surface gently rises and falls
        const breathOffset = pr ? 0 : Math.sin(t * 0.6) * 2;

        // Wave surface path
        ctx.beginPath();
        const waveY = surfaceBaseY + breathOffset;

        ctx.moveTo(0, waveY);
        // Draw wavy surface
        for (let x = 0; x <= w; x += 2) {
          const wave1 = Math.sin(x * 0.02 + t * 0.8) * 3;
          const wave2 = Math.sin(x * 0.035 + t * 0.5 + 1.5) * 1.5;
          const noiseWave = pr ? 0 : (valueNoise(x * 0.01 + t * 0.2, state.sessionSeed * 0.01) - 0.5) * 2;
          ctx.lineTo(x, waveY + wave1 + wave2 + noiseWave);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        // Water gradient (top=translucent, bottom=deep)
        const waterGrad = ctx.createLinearGradient(0, waveY, 0, h);
        const [tr, tg, tb, ta] = palette.waterTop;
        const [mr, mg, mb, ma] = palette.waterMid;
        const [br2, bg2, bb2, ba] = palette.waterBottom;
        waterGrad.addColorStop(0, `rgba(${tr},${tg},${tb},${ta})`);
        waterGrad.addColorStop(0.4, `rgba(${mr},${mg},${mb},${ma})`);
        waterGrad.addColorStop(1, `rgba(${br2},${bg2},${bb2},${ba})`);
        ctx.fillStyle = waterGrad;
        ctx.fill();

        // Surface sheen / highlight line
        if (!pr) {
          const [sr, sg, sb] = palette.surfaceSheen;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 2) {
            const wave1 = Math.sin(x * 0.02 + t * 0.8) * 3;
            const wave2 = Math.sin(x * 0.035 + t * 0.5 + 1.5) * 1.5;
            const noiseWave = (valueNoise(x * 0.01 + t * 0.2, state.sessionSeed * 0.01) - 0.5) * 2;
            const sy = waveY + wave1 + wave2 + noiseWave;
            if (x === 0) ctx.moveTo(x, sy);
            else ctx.lineTo(x, sy);
          }
          ctx.strokeStyle = `rgba(${sr},${sg},${sb},${0.15 + Math.sin(t * 0.4) * 0.05})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // ─── Draw ripples on surface ───
      for (const ripple of state.ripples) {
        const [rr, rg, rb] = palette.ripple;
        const breathOffset = pr ? 0 : Math.sin(t * 0.6) * 2;
        const ry = surfaceBaseY + breathOffset;

        // Elliptical ripple (perspective: wider than tall)
        ctx.beginPath();
        ctx.ellipse(ripple.x, ry, ripple.radius, ripple.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rr},${rg},${rb},${ripple.alpha * 0.5})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner ripple
        if (ripple.radius > 5) {
          ctx.beginPath();
          ctx.ellipse(ripple.x, ry, ripple.radius * 0.5, ripple.radius * 0.15, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rr},${rg},${rb},${ripple.alpha * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // ─── Draw falling drops ───
      for (const drop of state.drops) {
        const [dr, dg, db] = palette.dropFill;
        const [hr, hg, hb] = palette.dropHighlight;

        // Drop shape: teardrop (circle + pointed top)
        const { x, y, radius } = drop;

        // Main drop body
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dr},${dg},${db},0.8)`;
        ctx.fill();

        // Highlight (light reflection on drop)
        ctx.beginPath();
        ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hr},${hg},${hb},0.5)`;
        ctx.fill();

        // Subtle glow
        if (!pr) {
          ctx.shadowColor = `rgba(${dr},${dg},${db},0.4)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dr},${dg},${db},0.3)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ─── Ambient glow from water surface ───
      if (!pr && waterLevel > 0.05) {
        const glowIntensity = Math.min(0.08, waterLevel * 0.1);
        const grad = ctx.createRadialGradient(
          w * 0.5, surfaceBaseY, 0,
          w * 0.5, surfaceBaseY, w * 0.5
        );
        const [sr, sg, sb] = palette.surfaceSheen;
        grad.addColorStop(0, `rgba(${sr},${sg},${sb},${glowIntensity})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

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
          opacity: numbersHidden ? 1 : 0.2,
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
