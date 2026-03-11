import { useEffect, useRef } from 'react';

// ─── The Basin v4 — Sand Hourglass ───
// Max: "Try making sand in an hourglass, like a very classic rendition.
// Something rhythmic, pulsing, that shows you it's alive and moving."
//
// Classic hourglass: top sand depletes, thin stream flows through neck,
// bottom mound grows. Tiny grains (1-2px) — barely visible individually,
// collectively mesmerizing. The stream is the heartbeat.

// ─── Noise for organic variation ───
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

// ─── Hourglass geometry ───
function hourglassPath(ctx, cx, cy, w, h) {
  const bulbW = w * 0.42;
  const neckW = w * 0.06;
  const topY = cy - h * 0.48;
  const botY = cy + h * 0.48;
  const neckY = cy;
  const bulge = h * 0.22;

  ctx.beginPath();
  ctx.moveTo(cx - bulbW, topY);
  ctx.lineTo(cx + bulbW, topY);
  ctx.bezierCurveTo(cx + bulbW, topY + bulge, cx + neckW, neckY - bulge, cx + neckW, neckY);
  ctx.bezierCurveTo(cx + neckW, neckY + bulge, cx + bulbW, botY - bulge, cx + bulbW, botY);
  ctx.lineTo(cx - bulbW, botY);
  ctx.bezierCurveTo(cx - bulbW, botY - bulge, cx - neckW, neckY + bulge, cx - neckW, neckY);
  ctx.bezierCurveTo(cx - neckW, neckY - bulge, cx - bulbW, topY + bulge, cx - bulbW, topY);
  ctx.closePath();
}

// Get hourglass half-width at a given Y
function hourglassHalfW(cy, glassH, glassW, y) {
  const bulbW = glassW * 0.42;
  const neckW = glassW * 0.06;
  const topY = cy - glassH * 0.48;
  const botY = cy + glassH * 0.48;
  const neckY = cy;

  if (y <= topY || y >= botY) return bulbW;
  let t, startW, endW;
  if (y < neckY) {
    t = (y - topY) / (neckY - topY);
    startW = bulbW;
    endW = neckW;
  } else {
    t = (y - neckY) / (botY - neckY);
    startW = neckW;
    endW = bulbW;
  }
  return startW + (endW - startW) * smoothstep(t);
}

// ─── Sand colors ───
const SAND = {
  dark: {
    grain: [185, 175, 150],      // warm sand
    grainLight: [210, 200, 175], // highlighted grain
    body: [145, 135, 110],       // sand body fill
    bodyDeep: [95, 85, 65],      // deep shadow in sand
    stream: [175, 165, 140],     // falling stream
  },
  light: {
    grain: [160, 145, 110],
    grainLight: [185, 170, 135],
    body: [175, 160, 125],
    bodyDeep: [135, 120, 90],
    stream: [165, 150, 120],
  },
};

// ─── Max grains on screen ───
const MAX_GRAINS = 80;
const GRAIN_GRAVITY = 0.12;

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
    grains: [],        // Falling sand grains: { x, y, vy, size, shade }
    lastSpawn: 0,
    sessionSeed: Date.now() % 10000,
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
        if (!state.sized) { state.frame = requestAnimationFrame(animate); return; }
      }

      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark } = propsRef.current;
      const isPaused = ts === 'paused';
      const isStopped = ts === 'stopped';
      const minutes = el / 60000;
      const { w, h } = state;
      const palette = dark ? SAND.dark : SAND.light;

      state.time += isPaused ? 0.002 : 0.016;
      const t = state.time;

      // ─── Hourglass dimensions ───
      const cx = w / 2;
      const cy = h / 2;
      const glassW = w * 0.8;
      const glassH = h * 0.88;
      const topY = cy - glassH * 0.48;
      const botY = cy + glassH * 0.48;
      const neckY = cy;
      const neckHalfW = glassW * 0.06;

      // ─── Progress: 0 → 1 over session ───
      const progress = countdownTarget
        ? Math.min(1, el / (countdownTarget * 60000))
        : Math.min(1, minutes / 30);

      // Sand levels (Y coordinates)
      // Top sand: starts near top, drops as sand depletes
      const topSandMaxH = (neckY - topY) * 0.85; // max sand height in top bulb
      const topSandH = topSandMaxH * (1 - progress);
      const topSandSurfaceY = neckY - topSandH; // where top sand surface is
      // Bottom sand: starts empty, mound grows
      const botSandMaxH = (botY - neckY) * 0.85;
      const botSandH = botSandMaxH * progress;
      const botSandSurfaceY = botY - botSandH; // where bottom mound top is

      // ─── Background ───
      const warmth = Math.min(1, minutes / 30);
      if (dark) {
        ctx.fillStyle = `rgb(${Math.round(10 + warmth * 8)},${Math.round(8 + warmth * 5)},${Math.round(6 + warmth * 2)})`;
      } else {
        ctx.fillStyle = `rgb(${Math.round(244 - warmth * 4)},${Math.round(242 - warmth * 3)},${Math.round(238 - warmth * 6)})`;
      }
      ctx.fillRect(0, 0, w, h);

      // ─── Hourglass outline ───
      hourglassPath(ctx, cx, cy, glassW, glassH);
      if (dark) {
        ctx.strokeStyle = `rgba(160,155,130,${0.10 + warmth * 0.04})`;
      } else {
        ctx.strokeStyle = `rgba(120,110,80,${0.12 + warmth * 0.04})`;
      }
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ─── Glass highlight (left edge reflection) ───
      if (!pr) {
        ctx.save();
        hourglassPath(ctx, cx, cy, glassW, glassH);
        ctx.clip();
        const reflGrad = ctx.createLinearGradient(cx - glassW * 0.42, 0, cx - glassW * 0.28, 0);
        reflGrad.addColorStop(0, dark ? 'rgba(200,195,170,0.03)' : 'rgba(255,255,255,0.06)');
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(cx - glassW * 0.45, topY, glassW * 0.2, glassH);
        ctx.restore();
      }

      // ─── Draw sand (clipped to hourglass) ───
      ctx.save();
      hourglassPath(ctx, cx, cy, glassW, glassH);
      ctx.clip();

      // === TOP SAND (depleting) ===
      if (topSandH > 0.5) {
        const [br, bg, bb] = palette.body;
        const [dr, dg, db] = palette.bodyDeep;

        // Sand body — gradient from surface (light) to bottom (dark)
        const topGrad = ctx.createLinearGradient(0, topSandSurfaceY, 0, neckY);
        topGrad.addColorStop(0, `rgba(${br},${bg},${bb},0.7)`);
        topGrad.addColorStop(0.7, `rgba(${br},${bg},${bb},0.8)`);
        topGrad.addColorStop(1, `rgba(${dr},${dg},${db},0.85)`);

        // Draw top sand with funnel dip toward center
        ctx.beginPath();
        // Surface: slightly dipped toward center (funnel effect)
        const funnelDepth = Math.min(8, topSandH * 0.15);
        for (let x = 0; x <= w; x += 2) {
          const hw = hourglassHalfW(cy, glassH, glassW, topSandSurfaceY);
          const distFromCenter = Math.abs(x - cx) / hw;
          const funnel = (1 - distFromCenter * distFromCenter) * funnelDepth;
          // Small noise for texture
          const noise = pr ? 0 : (valueNoise(x * 0.05 + t * 0.02, state.sessionSeed * 0.1) - 0.5) * 0.5;
          const sy = topSandSurfaceY + funnel + noise;
          if (x === 0) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        // Close around the bottom of top bulb / neck area
        ctx.lineTo(w, neckY);
        ctx.lineTo(0, neckY);
        ctx.closePath();
        ctx.fillStyle = topGrad;
        ctx.fill();

        // Subtle surface texture — tiny grain dots on surface
        if (!pr) {
          const [gr, gg, gb] = palette.grainLight;
          const hw = hourglassHalfW(cy, glassH, glassW, topSandSurfaceY);
          for (let i = 0; i < 15; i++) {
            const gx = cx + (valueNoise(i * 7.1 + t * 0.01, state.sessionSeed) - 0.5) * hw * 1.6;
            const distC = Math.abs(gx - cx) / hw;
            const funnel = (1 - distC * distC) * funnelDepth;
            const gy = topSandSurfaceY + funnel + (valueNoise(i * 3.7, t * 0.005) - 0.5) * 1;
            ctx.beginPath();
            ctx.arc(gx, gy, 0.5 + valueNoise(i * 2, 0) * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${gr},${gg},${gb},${0.2 + valueNoise(i * 5, t * 0.1) * 0.15})`;
            ctx.fill();
          }
        }
      }

      // === BOTTOM SAND (accumulating mound) ===
      if (botSandH > 0.5) {
        const [br, bg, bb] = palette.body;
        const [dr, dg, db] = palette.bodyDeep;

        // Bottom gradient: surface light, bottom dark
        const botGrad = ctx.createLinearGradient(0, botSandSurfaceY, 0, botY);
        botGrad.addColorStop(0, `rgba(${br},${bg},${bb},0.7)`);
        botGrad.addColorStop(0.5, `rgba(${br},${bg},${bb},0.8)`);
        botGrad.addColorStop(1, `rgba(${dr},${dg},${db},0.85)`);

        // Mound shape: dome higher in center (Miyazaki)
        ctx.beginPath();
        const moundPeak = Math.min(12, botSandH * 0.2);
        for (let x = 0; x <= w; x += 2) {
          const hw = hourglassHalfW(cy, glassH, glassW, botSandSurfaceY);
          const distFromCenter = Math.abs(x - cx) / Math.max(hw, 1);
          // Smooth dome: peak at center, flat at edges
          const dome = Math.max(0, (1 - distFromCenter * distFromCenter)) * moundPeak;
          const noise = pr ? 0 : (valueNoise(x * 0.05 + t * 0.01, state.sessionSeed * 0.1 + 50) - 0.5) * 0.5;
          const sy = botSandSurfaceY - dome + noise;
          if (x === 0) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.lineTo(w, botY + 5);
        ctx.lineTo(0, botY + 5);
        ctx.closePath();
        ctx.fillStyle = botGrad;
        ctx.fill();

        // Surface texture dots on mound
        if (!pr) {
          const [gr, gg, gb] = palette.grainLight;
          const hw = hourglassHalfW(cy, glassH, glassW, botSandSurfaceY);
          for (let i = 0; i < 15; i++) {
            const gx = cx + (valueNoise(i * 7.1 + t * 0.01, state.sessionSeed + 100) - 0.5) * hw * 1.6;
            const distC = Math.abs(gx - cx) / Math.max(hw, 1);
            const dome = Math.max(0, (1 - distC * distC)) * moundPeak;
            const gy = botSandSurfaceY - dome + (valueNoise(i * 3.7 + 50, t * 0.005) - 0.5) * 1;
            ctx.beginPath();
            ctx.arc(gx, gy, 0.5 + valueNoise(i * 2 + 50, 0) * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${gr},${gg},${gb},${0.2 + valueNoise(i * 5 + 50, t * 0.1) * 0.15})`;
            ctx.fill();
          }
        }
      }

      // === FALLING STREAM (the heartbeat) ===
      if (!isStopped && progress > 0 && progress < 1) {
        // Spawn grains at neck
        const spawnRate = isPaused ? 0.15 : 0.04; // seconds between spawns
        if (t - state.lastSpawn > spawnRate && !isPaused) {
          // Spawn 1-3 grains per batch for density
          const batch = 1 + Math.floor(Math.random() * 2);
          for (let b = 0; b < batch && state.grains.length < MAX_GRAINS; b++) {
            const nx = (valueNoise(t * 2 + b * 17, state.sessionSeed) - 0.5) * neckHalfW * 1.2;
            state.grains.push({
              x: cx + nx,
              y: neckY + 1 + Math.random() * 2,
              vy: 0.3 + Math.random() * 0.5,
              size: 0.8 + Math.random() * 1.0,
              shade: Math.random(), // 0=dark, 1=light
            });
          }
          state.lastSpawn = t;
        }

        // Update grains
        for (let i = state.grains.length - 1; i >= 0; i--) {
          const grain = state.grains[i];
          grain.vy += GRAIN_GRAVITY;
          grain.y += grain.vy;
          // Slight horizontal drift (organic)
          grain.x += (valueNoise(grain.y * 0.1 + i, t * 0.5) - 0.5) * 0.3;

          // Hit bottom mound?
          if (grain.y >= botSandSurfaceY - 2) {
            state.grains.splice(i, 1);
            continue;
          }

          // Out of hourglass bounds?
          const hw = hourglassHalfW(cy, glassH, glassW, grain.y);
          if (Math.abs(grain.x - cx) > hw) {
            state.grains.splice(i, 1);
          }
        }

        // Draw the continuous stream line (thin column through neck)
        const [sr, sg, sb] = palette.stream;
        // Faint stream column
        ctx.beginPath();
        const streamW = neckHalfW * 0.6;
        const streamTop = neckY - 2;
        const streamBot = Math.min(botSandSurfaceY - 3, botY);
        ctx.moveTo(cx - streamW, streamTop);
        for (let y = streamTop; y <= streamBot; y += 2) {
          const drift = pr ? 0 : Math.sin(y * 0.08 + t * 2) * 0.5;
          ctx.lineTo(cx - streamW + drift, y);
        }
        for (let y = streamBot; y >= streamTop; y -= 2) {
          const drift = pr ? 0 : Math.sin(y * 0.08 + t * 2) * 0.5;
          ctx.lineTo(cx + streamW + drift, y);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${sr},${sg},${sb},${isPaused ? 0.03 : 0.12})`;
        ctx.fill();

        // Draw individual grains
        for (const grain of state.grains) {
          const [gr, gg, gb] = grain.shade > 0.5 ? palette.grainLight : palette.grain;
          const alpha = 0.5 + grain.shade * 0.3;
          ctx.beginPath();
          ctx.arc(grain.x, grain.y, grain.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${gr},${gg},${gb},${alpha})`;
          ctx.fill();
        }

        // Stream glow (Turrell: grains catch light)
        if (!pr) {
          const glowGrad = ctx.createRadialGradient(cx, neckY + 20, 0, cx, neckY + 20, 25);
          glowGrad.addColorStop(0, `rgba(${sr},${sg},${sb},0.04)`);
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(cx - 30, neckY, 60, 40);
        }
      }

      // === Paused: stream nearly stops, a few frozen grains ===
      if (isPaused && state.grains.length > 5) {
        // Slowly remove grains during pause
        if (Math.random() < 0.02) state.grains.pop();
      }

      ctx.restore(); // unclip hourglass

      // ─── Subtle warm glow around hourglass (ambient) ───
      if (!pr && progress > 0.05) {
        const glowI = Math.min(0.04, progress * 0.04);
        const grad = ctx.createRadialGradient(cx, cy, glassH * 0.2, cx, cy, glassH * 0.6);
        grad.addColorStop(0, `rgba(185,175,150,${glowI})`);
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
