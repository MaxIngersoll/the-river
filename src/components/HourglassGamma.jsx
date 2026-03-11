import { useEffect, useRef } from 'react';
import { hourglassPath, hourglassDims, hourglassHalfW, timerProgress, valueNoise } from './hourglassGeometry.js';

// ─── Team Gamma — "Nature & Light" ───
// Turrell + Eliasson + Noguchi synthesis
// The hourglass fills with warm LIGHT, not matter.
// A dark vessel slowly becomes a lantern.
// Color journey: cool teal → verdigris → olivine → warm amber (sunset)
// Subtle noise texture inside (Noguchi's Akari paper lamps)
// The light BREATHES.

// ─── Color palette keyframes (teal → verdigris → olivine → amber) ───
const COLOR_JOURNEY = [
  { t: 0.00, r: 76,  g: 174, b: 174 },  // cool teal — dawn stillness
  { t: 0.30, r: 96,  g: 178, b: 158 },  // verdigris — first warmth
  { t: 0.55, r: 141, g: 181, b: 133 },  // olivine — afternoon light
  { t: 0.80, r: 180, g: 175, b: 112 },  // golden transition
  { t: 1.00, r: 200, g: 170, b: 100 },  // warm amber — sunset lantern
];

function lerpColor(progress) {
  const p = Math.max(0, Math.min(1, progress));
  let i = 0;
  while (i < COLOR_JOURNEY.length - 2 && COLOR_JOURNEY[i + 1].t < p) i++;
  const a = COLOR_JOURNEY[i];
  const b = COLOR_JOURNEY[i + 1];
  const local = (p - a.t) / (b.t - a.t);
  const s = local * local * (3 - 2 * local); // smoothstep
  return [
    Math.round(a.r + (b.r - a.r) * s),
    Math.round(a.g + (b.g - a.g) * s),
    Math.round(a.b + (b.b - a.b) * s),
  ];
}

export default function HourglassGamma({
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
    // Noise texture buffer — generated once, overlaid each frame
    noiseCanvas: null,
    noiseW: 0,
    noiseH: 0,
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
      // Regenerate noise texture at new size
      state.noiseCanvas = null;
      return true;
    }

    // Generate Noguchi paper texture — a static noise overlay
    function ensureNoiseTexture(w, h) {
      if (state.noiseCanvas && state.noiseW === w && state.noiseH === h) return;
      const nc = document.createElement('canvas');
      nc.width = w;
      nc.height = h;
      const nctx = nc.getContext('2d');
      const imgData = nctx.createImageData(w, h);
      const d = imgData.data;
      // Value noise at multiple scales for paper-like feel
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const n1 = valueNoise(x * 0.08, y * 0.08);
          const n2 = valueNoise(x * 0.2 + 100, y * 0.2 + 100);
          const combined = n1 * 0.6 + n2 * 0.4;
          // Subtle: mostly transparent, slight brightness variation
          const brightness = Math.round(combined * 255);
          d[idx] = brightness;
          d[idx + 1] = brightness;
          d[idx + 2] = brightness;
          d[idx + 3] = Math.round(combined * 30); // very subtle
        }
      }
      nctx.putImageData(imgData, 0, 0);
      state.noiseCanvas = nc;
      state.noiseW = w;
      state.noiseH = h;
    }

    function animate() {
      if (!state.sized) {
        state.sized = sizeCanvas();
        if (!state.sized) { state.frame = requestAnimationFrame(animate); return; }
      }

      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark, countdownTarget: ct } = propsRef.current;
      const isPaused = ts === 'paused';
      const isStopped = ts === 'stopped';
      const { w, h } = state;

      state.time += isPaused ? 0.003 : 0.016;
      const t = state.time;

      // ─── Progress & color ───
      const progress = timerProgress(el, ct);
      const [cr, cg, cb] = lerpColor(progress);

      // ─── Breathing: slow oscillation in brightness ───
      // ~4 second cycle, 3-5% amplitude
      const breathCycle = Math.sin(t * (Math.PI * 2 / 4)) * 0.5 + 0.5; // 0→1 over 4s
      const breathMultiplier = 0.95 + breathCycle * 0.08; // 0.95 → 1.03

      // ─── Hourglass geometry ───
      const { cx, cy, glassW, glassH, topY, botY, neckY } = hourglassDims(w, h);

      // ─── Background: near-black canvas ───
      if (dark) {
        ctx.fillStyle = '#080808';
      } else {
        ctx.fillStyle = '#0c0c0e';
      }
      ctx.fillRect(0, 0, w, h);

      // ─── Ambient glow behind hourglass (the light leaking out) ───
      if (!pr && progress > 0.01) {
        const ambientIntensity = progress * 0.12 * breathMultiplier;
        // Multiple overlapping radials for depth
        const grad1 = ctx.createRadialGradient(cx, botY - glassH * progress * 0.3, 0, cx, cy, glassH * 0.55);
        grad1.addColorStop(0, `rgba(${cr},${cg},${cb},${ambientIntensity * 0.5})`);
        grad1.addColorStop(0.4, `rgba(${cr},${cg},${cb},${ambientIntensity * 0.15})`);
        grad1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, w, h);
      }

      // ─── Hourglass vessel outline ───
      // The outline brightens where light touches it
      const outlineBaseAlpha = 0.08;
      hourglassPath(ctx, cx, cy, glassW, glassH);
      ctx.strokeStyle = `rgba(${Math.round(cr * 0.5 + 60)},${Math.round(cg * 0.5 + 60)},${Math.round(cb * 0.5 + 60)},${outlineBaseAlpha + progress * 0.06})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Illuminated outline: brighter where the light level has reached
      if (progress > 0.01) {
        const glowLineY = botY - (botY - topY) * progress; // how high light has risen
        ctx.save();
        // Clip to area below glow line (where light illuminates the walls)
        ctx.beginPath();
        ctx.rect(0, glowLineY - 30, w, h);
        ctx.clip();
        hourglassPath(ctx, cx, cy, glassW, glassH);
        const wallGlow = 0.12 + progress * 0.18;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${wallGlow * breathMultiplier})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // ─── The Light Fill (clipped to hourglass interior) ───
      ctx.save();
      hourglassPath(ctx, cx, cy, glassW, glassH);
      ctx.clip();

      if (progress > 0.005) {
        // The light rises from the bottom of the hourglass
        // glowTopY = where the light has risen to
        const fillRange = botY - topY;
        const glowTopY = botY - fillRange * progress;
        const fadeZone = Math.min(50, fillRange * 0.15); // soft edge at top of glow

        // === Primary luminous fill: radial gradient emanating from bottom center ===
        const primaryGrad = ctx.createRadialGradient(
          cx, botY, 0,
          cx, botY - fillRange * 0.6, fillRange * 0.6
        );
        const baseAlpha = (0.45 + progress * 0.4) * breathMultiplier;
        primaryGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${Math.min(0.9, baseAlpha)})`);
        primaryGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${baseAlpha * 0.7})`);
        primaryGrad.addColorStop(0.85, `rgba(${cr},${cg},${cb},${baseAlpha * 0.3})`);
        primaryGrad.addColorStop(1, 'rgba(0,0,0,0)');

        // Clip the glow to only appear below the fill line
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, glowTopY - fadeZone, w, botY - glowTopY + fadeZone + 10);
        ctx.clip();

        ctx.fillStyle = primaryGrad;
        ctx.fillRect(0, topY, w, botY - topY);

        // === Secondary glow: off-center radials for depth (light isn't flat) ===
        const offX1 = cx - glassW * 0.12;
        const offX2 = cx + glassW * 0.10;
        const offY = botY - fillRange * progress * 0.4;

        const grad2 = ctx.createRadialGradient(offX1, offY, 0, offX1, offY, fillRange * 0.35);
        grad2.addColorStop(0, `rgba(${Math.min(255, cr + 20)},${Math.min(255, cg + 15)},${Math.min(255, cb + 10)},${baseAlpha * 0.25})`);
        grad2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, topY, w, botY - topY);

        const grad3 = ctx.createRadialGradient(offX2, offY + 15, 0, offX2, offY + 15, fillRange * 0.3);
        grad3.addColorStop(0, `rgba(${Math.min(255, cr + 10)},${Math.min(255, cg + 20)},${cb},${baseAlpha * 0.2})`);
        grad3.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad3;
        ctx.fillRect(0, topY, w, botY - topY);

        // === Soft top edge fade: linear gradient to black at the light boundary ===
        const edgeGrad = ctx.createLinearGradient(0, glowTopY - fadeZone, 0, glowTopY + fadeZone * 0.5);
        edgeGrad.addColorStop(0, 'rgba(0,0,0,0.95)');
        edgeGrad.addColorStop(0.4, 'rgba(0,0,0,0.6)');
        edgeGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = edgeGrad;
        ctx.fillRect(0, glowTopY - fadeZone, w, fadeZone * 1.5);

        ctx.restore(); // un-clip the fill rect

        // === Bright core at the very bottom (hottest point of the lantern) ===
        const coreGrad = ctx.createRadialGradient(cx, botY - 10, 0, cx, botY - 10, glassW * 0.25);
        const coreAlpha = (0.15 + progress * 0.25) * breathMultiplier;
        coreGrad.addColorStop(0, `rgba(${Math.min(255, cr + 40)},${Math.min(255, cg + 30)},${Math.min(255, cb + 20)},${coreAlpha})`);
        coreGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${coreAlpha * 0.3})`);
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, botY - glassW * 0.3, w, glassW * 0.35);

        // === Noguchi paper texture overlay ===
        if (!pr) {
          ensureNoiseTexture(Math.ceil(w), Math.ceil(h));
          if (state.noiseCanvas) {
            ctx.save();
            // Only show texture in the lit area
            ctx.beginPath();
            ctx.rect(0, glowTopY - fadeZone * 0.5, w, botY - glowTopY + fadeZone);
            ctx.clip();
            ctx.globalAlpha = (0.08 + progress * 0.12) * breathMultiplier;
            ctx.globalCompositeOperation = 'overlay';
            ctx.drawImage(state.noiseCanvas, 0, 0, w, h);
            ctx.restore();
          }
        }

        // === Inner glow: scanlines of light for lantern warmth ===
        if (!pr) {
          const scanCount = Math.floor(12 * progress);
          for (let i = 0; i < scanCount; i++) {
            const scanY = botY - (botY - glowTopY) * (i / scanCount);
            const hw = hourglassHalfW(cy, glassH, glassW, scanY);
            const noiseOffset = valueNoise(i * 3.7 + t * 0.15, 42) * 0.3;
            const scanAlpha = (0.015 + noiseOffset * 0.01) * breathMultiplier;
            const scanGrad = ctx.createLinearGradient(cx - hw, scanY, cx + hw, scanY);
            scanGrad.addColorStop(0, 'rgba(0,0,0,0)');
            scanGrad.addColorStop(0.2, `rgba(${Math.min(255, cr + 30)},${Math.min(255, cg + 25)},${Math.min(255, cb + 15)},${scanAlpha})`);
            scanGrad.addColorStop(0.5, `rgba(${Math.min(255, cr + 50)},${Math.min(255, cg + 40)},${Math.min(255, cb + 25)},${scanAlpha * 1.5})`);
            scanGrad.addColorStop(0.8, `rgba(${Math.min(255, cr + 30)},${Math.min(255, cg + 25)},${Math.min(255, cb + 15)},${scanAlpha})`);
            scanGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(cx - hw, scanY - 1.5, hw * 2, 3);
          }
        }
      }

      // ─── Dark void above the glow line ───
      // The area above where light has risen is near-black, creating contrast
      if (progress < 0.98 && progress > 0.01) {
        const fillRange = botY - topY;
        const glowTopY = botY - fillRange * progress;
        const voidGrad = ctx.createLinearGradient(0, topY, 0, glowTopY + 20);
        voidGrad.addColorStop(0, 'rgba(6,6,8,0.92)');
        voidGrad.addColorStop(0.7, 'rgba(6,6,8,0.85)');
        voidGrad.addColorStop(1, 'rgba(6,6,8,0)');
        ctx.fillStyle = voidGrad;
        ctx.fillRect(0, topY, w, glowTopY - topY + 30);
      }

      // ─── When stopped / empty: faint interior outline ───
      if (progress <= 0.005) {
        // Barely visible interior — the dark vessel waiting to be filled
        const emptyGrad = ctx.createLinearGradient(0, topY, 0, botY);
        emptyGrad.addColorStop(0, 'rgba(40,45,50,0.03)');
        emptyGrad.addColorStop(0.5, 'rgba(30,35,40,0.02)');
        emptyGrad.addColorStop(1, 'rgba(40,45,50,0.04)');
        ctx.fillStyle = emptyGrad;
        ctx.fillRect(0, topY, w, botY - topY);
      }

      ctx.restore(); // un-clip hourglass

      // ─── Glass reflection (left edge, subtle) ───
      if (!pr) {
        ctx.save();
        hourglassPath(ctx, cx, cy, glassW, glassH);
        ctx.clip();
        const reflGrad = ctx.createLinearGradient(cx - glassW * 0.42, 0, cx - glassW * 0.30, 0);
        reflGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.015 + progress * 0.02})`);
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(cx - glassW * 0.45, topY, glassW * 0.18, glassH);
        ctx.restore();
      }

      // ─── Outer ambient bloom (light escaping the vessel) ───
      if (!pr && progress > 0.05) {
        const bloomIntensity = progress * 0.06 * breathMultiplier;
        const bloom = ctx.createRadialGradient(cx, cy + glassH * 0.15, glassW * 0.1, cx, cy, glassH * 0.7);
        bloom.addColorStop(0, `rgba(${cr},${cg},${cb},${bloomIntensity})`);
        bloom.addColorStop(0.5, `rgba(${cr},${cg},${cb},${bloomIntensity * 0.3})`);
        bloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bloom;
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
              ? '0 0 80px rgba(200,170,100,0.25), 0 0 160px rgba(141,181,133,0.1)'
              : '0 0 60px rgba(200,170,100,0.2)',
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
