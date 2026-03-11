import { useEffect, useRef } from 'react';
import { VESSELS, timerProgress, valueNoise, lerpColor } from './vesselGeometry.js';

// ─── The Foundry — "Luminous Substance" ───
// Neri Oxman × flight404 × Soetsu Yanagi
// A real substance rising: glowing honey, molten amber.
// Curved meniscus, micro-ripples, thin bright stream through neck.
// Subsurface glow where material meets glass. Physical. Viscous. Alive.

export default function HourglassFoundry({
  elapsed, timerState, prefersReduced, countdownTarget, isDark,
  numbersHidden, onToggleNumbers, colonPulsing, colonPulseDuration,
  timerDepthColor, formatTimerParts, formatTimer,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    frame: null, time: 0, sized: false, w: 0, h: 0,
    noiseCanvas: null, noiseW: 0, noiseH: 0,
  });
  const propsRef = useRef({});
  propsRef.current = { elapsed, timerState, prefersReduced, isDark, countdownTarget };

  const vc = VESSELS.hourglass;

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
      state.noiseCanvas = null;
      return true;
    }

    function ensureNoiseTexture(w, h) {
      if (state.noiseCanvas && state.noiseW === w && state.noiseH === h) return;
      const nc = document.createElement('canvas');
      nc.width = w; nc.height = h;
      const nctx = nc.getContext('2d');
      const imgData = nctx.createImageData(w, h);
      const d = imgData.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const n1 = valueNoise(x * 0.04, y * 0.06);
          const n2 = valueNoise(x * 0.15 + 200, y * 0.15 + 200);
          const combined = n1 * 0.65 + n2 * 0.35;
          const brightness = Math.round(combined * 255);
          d[idx] = brightness; d[idx + 1] = brightness; d[idx + 2] = brightness;
          d[idx + 3] = Math.round(combined * 40);
        }
      }
      nctx.putImageData(imgData, 0, 0);
      state.noiseCanvas = nc; state.noiseW = w; state.noiseH = h;
    }

    function animate() {
      if (!state.sized) {
        state.sized = sizeCanvas();
        if (!state.sized) { state.frame = requestAnimationFrame(animate); return; }
      }
      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark, countdownTarget: ct } = propsRef.current;
      const isPaused = ts === 'paused';
      const isRunning = ts === 'running';
      const { w, h } = state;
      state.time += isPaused ? 0.003 : 0.016;
      const t = state.time;

      const progress = timerProgress(el, ct);
      const [cr, cg, cb] = lerpColor(progress);
      const breathPhase = Math.sin(t * (Math.PI * 2 / 4));
      const breathMultiplier = 1 + breathPhase * 0.04;

      const { cx, cy, glassW, glassH, topY, botY, neckY } = vc.dims(w, h);
      const fillRange = botY - neckY;
      const rawFillY = botY - fillRange * progress;
      const breathOffset = pr ? 0 : breathPhase * fillRange * 0.04;
      const fillY = rawFillY - breathOffset;

      ctx.fillStyle = dark ? '#080808' : '#0c0c0e';
      ctx.fillRect(0, 0, w, h);

      // Ambient bloom behind hourglass
      if (!pr && progress > 0.01) {
        const bloomStrength = progress * 0.10 * breathMultiplier;
        const bloom = ctx.createRadialGradient(cx, (fillY + botY) * 0.5, 0, cx, cy, glassH * 0.6);
        bloom.addColorStop(0, `rgba(${cr},${cg},${cb},${bloomStrength * 0.6})`);
        bloom.addColorStop(0.35, `rgba(${cr},${cg},${cb},${bloomStrength * 0.2})`);
        bloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, w, h);
      }

      // Vessel outline
      vc.path(ctx, cx, cy, glassW, glassH);
      ctx.strokeStyle = `rgba(${Math.round(cr * 0.4 + 50)},${Math.round(cg * 0.4 + 50)},${Math.round(cb * 0.4 + 50)},${0.06 + progress * 0.04})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Subsurface glow near fill level
      if (progress > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, fillY - 40, w, botY - fillY + 80);
        ctx.clip();
        vc.path(ctx, cx, cy, glassW, glassH);
        ctx.strokeStyle = `rgba(${Math.min(255, cr + 30)},${Math.min(255, cg + 20)},${Math.min(255, cb + 10)},${(0.15 + progress * 0.20) * breathMultiplier})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        vc.path(ctx, cx, cy, glassW, glassH);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(0.15 + progress * 0.20) * breathMultiplier * 0.4})`;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();
      }

      // Clip to hourglass
      ctx.save();
      vc.path(ctx, cx, cy, glassW, glassH);
      ctx.clip();

      if (progress > 0.005) {
        const surfaceY = fillY;

        // Primary body gradient
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, surfaceY - 8, w, botY - surfaceY + 16);
        ctx.clip();

        const bodyAlpha = (0.5 + progress * 0.35) * breathMultiplier;
        const bodyGrad = ctx.createRadialGradient(cx, botY + 10, 0, cx, botY - fillRange * 0.5, fillRange * 0.7);
        bodyGrad.addColorStop(0, `rgba(${Math.min(255, cr + 25)},${Math.min(255, cg + 15)},${Math.min(255, cb + 5)},${Math.min(0.92, bodyAlpha * 1.1)})`);
        bodyGrad.addColorStop(0.4, `rgba(${cr},${cg},${cb},${bodyAlpha * 0.85})`);
        bodyGrad.addColorStop(0.75, `rgba(${cr},${cg},${cb},${bodyAlpha * 0.55})`);
        bodyGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(0, topY, w, botY - topY);

        // Off-center warmth pockets
        const pocketY = botY - fillRange * progress * 0.35;
        const lp = ctx.createRadialGradient(cx - glassW * 0.10, pocketY, 0, cx - glassW * 0.10, pocketY, fillRange * 0.3);
        lp.addColorStop(0, `rgba(${Math.min(255, cr + 15)},${Math.min(255, cg + 10)},${cb},${bodyAlpha * 0.2})`);
        lp.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = lp;
        ctx.fillRect(0, topY, w, botY - topY);

        const rp = ctx.createRadialGradient(cx + glassW * 0.08, pocketY + 12, 0, cx + glassW * 0.08, pocketY + 12, fillRange * 0.25);
        rp.addColorStop(0, `rgba(${cr},${Math.min(255, cg + 15)},${Math.min(255, cb + 10)},${bodyAlpha * 0.15})`);
        rp.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rp;
        ctx.fillRect(0, topY, w, botY - topY);

        // Hot bottom core
        const coreGrad = ctx.createRadialGradient(cx, botY - 5, 0, cx, botY - 5, glassW * 0.22);
        const coreAlpha = (0.18 + progress * 0.22) * breathMultiplier;
        coreGrad.addColorStop(0, `rgba(${Math.min(255, cr + 45)},${Math.min(255, cg + 35)},${Math.min(255, cb + 20)},${coreAlpha})`);
        coreGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${coreAlpha * 0.3})`);
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(cx - glassW * 0.3, botY - glassW * 0.25, glassW * 0.6, glassW * 0.3);
        ctx.restore();

        // Meniscus with capillary action + micro-ripples
        if (!pr) {
          const halfWAtSurface = vc.halfW(cy, glassH, glassW, surfaceY);
          const meniscusH = Math.min(8, halfWAtSurface * 0.06);
          const leftX = cx - halfWAtSurface;
          const rightX = cx + halfWAtSurface;
          const steps = 40;
          const stepW = (rightX - leftX) / steps;

          ctx.save();
          ctx.beginPath();
          ctx.rect(0, surfaceY - 20, w, 40);
          ctx.clip();
          ctx.beginPath();
          for (let i = 0; i <= steps; i++) {
            const x = leftX + i * stepW;
            const frac = i / steps;
            const edgeFactor = 4 * (frac - 0.5) * (frac - 0.5);
            const meniscusRise = meniscusH * edgeFactor;
            const ripple = (valueNoise(x * 0.1 + t * 0.4, surfaceY * 0.1 + t * 0.2) - 0.5) * 2.5;
            const yPos = surfaceY - meniscusRise + ripple;
            if (i === 0) ctx.moveTo(x, yPos); else ctx.lineTo(x, yPos);
          }
          ctx.lineTo(rightX, surfaceY + 8);
          ctx.lineTo(leftX, surfaceY + 8);
          ctx.closePath();
          const menGrad = ctx.createLinearGradient(0, surfaceY - meniscusH - 3, 0, surfaceY + 5);
          menGrad.addColorStop(0, `rgba(${Math.min(255, cr + 35)},${Math.min(255, cg + 25)},${Math.min(255, cb + 15)},${0.6 * breathMultiplier})`);
          menGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${0.75 * breathMultiplier})`);
          menGrad.addColorStop(1, `rgba(${cr},${cg},${cb},${0.85 * breathMultiplier})`);
          ctx.fillStyle = menGrad;
          ctx.fill();

          // Highlight line along ridge
          ctx.beginPath();
          for (let i = 0; i <= steps; i++) {
            const x = leftX + i * stepW;
            const frac = i / steps;
            const edgeFactor = 4 * (frac - 0.5) * (frac - 0.5);
            const meniscusRise = meniscusH * edgeFactor;
            const ripple = (valueNoise(x * 0.1 + t * 0.4, surfaceY * 0.1 + t * 0.2) - 0.5) * 2.5;
            if (i === 0) ctx.moveTo(x, surfaceY - meniscusRise + ripple);
            else ctx.lineTo(x, surfaceY - meniscusRise + ripple);
          }
          ctx.strokeStyle = `rgba(${Math.min(255, cr + 60)},${Math.min(255, cg + 50)},${Math.min(255, cb + 35)},${(0.25 + progress * 0.15) * breathMultiplier})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        // Noise texture overlay
        if (!pr) {
          ensureNoiseTexture(Math.ceil(w), Math.ceil(h));
          if (state.noiseCanvas) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, surfaceY - 5, w, botY - surfaceY + 10);
            ctx.clip();
            ctx.globalAlpha = (0.06 + progress * 0.10) * breathMultiplier;
            ctx.globalCompositeOperation = 'overlay';
            ctx.drawImage(state.noiseCanvas, 0, 0, w, h);
            ctx.restore();
          }
        }

        // Soft top fade
        const fadeH = Math.min(25, fillRange * 0.08);
        const fadeGrad = ctx.createLinearGradient(0, surfaceY - fadeH, 0, surfaceY + fadeH * 0.3);
        fadeGrad.addColorStop(0, 'rgba(8,8,8,0.9)');
        fadeGrad.addColorStop(0.5, 'rgba(8,8,8,0.4)');
        fadeGrad.addColorStop(1, 'rgba(8,8,8,0)');
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(0, surfaceY - fadeH, w, fadeH * 1.5);
      }

      // Stream through the neck
      if (!pr && progress > 0.01 && progress < 0.98 && (isRunning || isPaused)) {
        const streamStartY = neckY - glassH * 0.08;
        const streamEndY = Math.min(fillY + 3, neckY + glassH * 0.15);
        if (streamEndY > streamStartY) {
          const streamSteps = 30;
          const streamStepH = (streamEndY - streamStartY) / streamSteps;
          ctx.save();
          ctx.beginPath();
          for (let i = 0; i <= streamSteps; i++) {
            const sy = streamStartY + i * streamStepH;
            const frac = i / streamSteps;
            const baseW = 1.2 + frac * 1.5;
            const drift = isPaused
              ? Math.sin(sy * 0.05 + t * 0.3) * 1.2
              : Math.sin(sy * 0.08 + t * 2.5) * 1.8 + Math.sin(sy * 0.03 + t * 1.2) * 0.8;
            if (i === 0) ctx.moveTo(cx + drift + baseW * 0.5, sy);
            else ctx.lineTo(cx + drift + baseW * 0.5, sy);
          }
          for (let i = streamSteps; i >= 0; i--) {
            const sy = streamStartY + i * streamStepH;
            const frac = i / streamSteps;
            const baseW = 1.2 + frac * 1.5;
            const drift = isPaused
              ? Math.sin(sy * 0.05 + t * 0.3) * 1.2
              : Math.sin(sy * 0.08 + t * 2.5) * 1.8 + Math.sin(sy * 0.03 + t * 1.2) * 0.8;
            ctx.lineTo(cx + drift - baseW * 0.5, sy);
          }
          ctx.closePath();
          const streamGrad = ctx.createLinearGradient(0, streamStartY, 0, streamEndY);
          const streamAlpha = (isRunning ? 0.7 : 0.3) * breathMultiplier;
          streamGrad.addColorStop(0, `rgba(${Math.min(255, cr + 50)},${Math.min(255, cg + 40)},${Math.min(255, cb + 25)},${streamAlpha})`);
          streamGrad.addColorStop(1, `rgba(${cr},${cg},${cb},${streamAlpha * 0.4})`);
          ctx.fillStyle = streamGrad;
          ctx.fill();

          // Splash glow at impact
          if (fillY < neckY + glassH * 0.14) {
            const splashGrad = ctx.createRadialGradient(cx, fillY, 0, cx, fillY, 8);
            splashGrad.addColorStop(0, `rgba(${Math.min(255, cr + 40)},${Math.min(255, cg + 30)},${Math.min(255, cb + 20)},${0.25 * breathMultiplier})`);
            splashGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = splashGrad;
            ctx.fillRect(cx - 10, fillY - 10, 20, 20);
          }
          ctx.restore();
        }
      }

      // Top bulb draining
      if (progress > 0.01 && progress < 0.98) {
        const topFillLevel = 1 - progress;
        const topRange = neckY - topY;
        const topSurfaceY = neckY - topRange * topFillLevel;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, topSurfaceY - 5, w, neckY - topSurfaceY + 10);
        ctx.clip();
        const topAlpha = (0.25 + topFillLevel * 0.25) * breathMultiplier;
        const topGrad = ctx.createLinearGradient(0, topSurfaceY, 0, neckY);
        topGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${topAlpha * 0.3})`);
        topGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${topAlpha * 0.6})`);
        topGrad.addColorStop(1, `rgba(${cr},${cg},${cb},${topAlpha * 0.5})`);
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, topSurfaceY, w, neckY - topSurfaceY);
        ctx.restore();
      }

      // Dark void above fill in bottom bulb
      if (progress > 0.01 && progress < 0.95) {
        const voidGrad = ctx.createLinearGradient(0, neckY, 0, fillY + 15);
        voidGrad.addColorStop(0, 'rgba(6,6,8,0.88)');
        voidGrad.addColorStop(0.6, 'rgba(6,6,8,0.7)');
        voidGrad.addColorStop(1, 'rgba(6,6,8,0)');
        ctx.fillStyle = voidGrad;
        ctx.fillRect(0, neckY, w, fillY - neckY + 20);
      }

      // Empty state
      if (progress <= 0.005) {
        const emptyGrad = ctx.createLinearGradient(0, topY, 0, botY);
        emptyGrad.addColorStop(0, 'rgba(40,45,50,0.03)');
        emptyGrad.addColorStop(0.5, 'rgba(30,35,40,0.02)');
        emptyGrad.addColorStop(1, 'rgba(40,45,50,0.04)');
        ctx.fillStyle = emptyGrad;
        ctx.fillRect(0, topY, w, botY - topY);
      }

      ctx.restore(); // un-clip

      // Glass reflection
      if (!pr) {
        ctx.save();
        vc.path(ctx, cx, cy, glassW, glassH);
        ctx.clip();
        const reflGrad = ctx.createLinearGradient(cx - glassW * 0.42, 0, cx - glassW * 0.30, 0);
        reflGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.012 + progress * 0.018})`);
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(cx - glassW * 0.45, topY, glassW * 0.18, glassH);
        ctx.restore();
      }

      // Outer bloom
      if (!pr && progress > 0.05) {
        const bloomAlpha = progress * 0.055 * breathMultiplier;
        const bloom = ctx.createRadialGradient(cx, (fillY + botY) * 0.5, glassW * 0.08, cx, cy, glassH * 0.65);
        bloom.addColorStop(0, `rgba(${cr},${cg},${cb},${bloomAlpha})`);
        bloom.addColorStop(0.5, `rgba(${cr},${cg},${cb},${bloomAlpha * 0.3})`);
        bloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, w, h);
      }

      state.frame = requestAnimationFrame(animate);
    }

    state.frame = requestAnimationFrame(animate);
    const onResize = () => { state.sized = false; state.noiseCanvas = null; };
    window.addEventListener('resize', onResize);
    return () => { if (state.frame) cancelAnimationFrame(state.frame); window.removeEventListener('resize', onResize); };
  }, []);

  const displayMs = countdownTarget ? Math.max(0, countdownTarget * 60000 - elapsed) : elapsed;
  const isStopped = timerState === 'stopped';
  const timerOpacity = isStopped ? 0.9 : (numbersHidden ? 0 : (timerState === 'paused' ? 0.4 : 0.85));

  return (
    <div className="relative cursor-pointer"
      style={{ width: 'min(calc(100vw - 48px), 380px)', height: '55vh', maxHeight: '460px' }}
      onClick={isStopped ? undefined : onToggleNumbers}
      role="button" aria-label={numbersHidden ? 'Show timer' : 'Hide timer'} tabIndex={0}
      onKeyDown={(e) => { if (!isStopped && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onToggleNumbers(); } }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
        style={{ borderRadius: '20px', opacity: numbersHidden ? 1 : 0.25, transition: 'opacity 1.2s ease' }}
        aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="leading-none" style={{
          fontSize: isStopped ? '80px' : '68px',
          fontFamily: isStopped ? 'var(--font-ceremony)' : 'var(--font-serif)',
          fontWeight: 400, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
          color: isStopped ? 'var(--color-text)' : timerDepthColor, opacity: timerOpacity,
          transition: 'opacity 1.2s ease, color 2s ease, font-size 0.6s ease',
          textShadow: isDark ? '0 0 80px rgba(200,170,100,0.25), 0 0 160px rgba(141,181,133,0.1)' : '0 0 60px rgba(200,170,100,0.2)',
        }}>
          {formatTimerParts(displayMs).map((part, i) =>
            part.type === 'colon' ? (
              <span key={i} className={colonPulsing ? 'animate-colon-pulse' : ''}
                style={colonPulsing ? { animationDuration: `${colonPulseDuration}s`, display: 'inline-block' }
                  : { opacity: timerState === 'paused' ? 0 : 1, transition: 'opacity 0.3s ease', display: 'inline-block' }}>
                {part.value}
              </span>
            ) : (<span key={i}>{part.value}</span>)
          )}
        </span>
        {timerState === 'paused' && !numbersHidden && (
          <p className="text-text-3 text-xs font-medium uppercase tracking-widest mt-3 animate-fade-in" style={{ opacity: 0.4 }}>Paused</p>
        )}
      </div>
    </div>
  );
}
