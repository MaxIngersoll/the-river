import { useEffect, useRef } from 'react';
import { VESSELS, timerProgress, valueNoise, lerpColor } from './vesselGeometry.js';

// ─── The Refinery — "Light with an Edge" ───
// Dieter Rams × Agnes Martin × Kenya Hara
// Gamma was 95% right. The fix: give the light a defined, rising BOUNDARY.
// A luminous horizon line — liminal, like dusk. Below: full warmth. Above: void.
// The simplest possible answer to "make it climb."

export default function HourglassRefinery({
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
          const n1 = valueNoise(x * 0.08, y * 0.08);
          const n2 = valueNoise(x * 0.2 + 100, y * 0.2 + 100);
          const combined = n1 * 0.6 + n2 * 0.4;
          const brightness = Math.round(combined * 255);
          d[idx] = brightness; d[idx + 1] = brightness; d[idx + 2] = brightness;
          d[idx + 3] = Math.round(combined * 30);
        }
      }
      nctx.putImageData(imgData, 0, 0);
      state.noiseCanvas = nc; state.noiseW = w; state.noiseH = h;
    }

    // Build a clip path tracing the noise-displaced horizon, closing below
    function traceHorizonClip(horizonY, t, breathOffset) {
      const { cx, glassW, glassH, botY } = vc.dims(state.w, state.h);
      const leftX = cx - glassW * 0.5;
      const rightX = cx + glassW * 0.5;
      const step = 3;
      const breathY = breathOffset;

      ctx.beginPath();
      // Trace the horizon from left to right with noise displacement
      for (let x = leftX; x <= rightX; x += step) {
        const noiseDisp = (valueNoise(x * 0.06 + t * 0.3, 42) - 0.5) * 24;
        const y = horizonY + noiseDisp + breathY;
        if (x === leftX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Close below — everything under the horizon
      ctx.lineTo(rightX, botY + 10);
      ctx.lineTo(leftX, botY + 10);
      ctx.closePath();
    }

    // Draw the luminous horizon seam
    function drawHorizonSeam(horizonY, t, breathOffset, cr, cg, cb, breathMult) {
      const { cx, glassW } = vc.dims(state.w, state.h);
      const leftX = cx - glassW * 0.5;
      const rightX = cx + glassW * 0.5;
      const step = 3;
      const breathY = breathOffset;

      // Build the path
      const points = [];
      for (let x = leftX; x <= rightX; x += step) {
        const noiseDisp = (valueNoise(x * 0.06 + t * 0.3, 42) - 0.5) * 24;
        points.push({ x, y: horizonY + noiseDisp + breathY });
      }

      // Outer glow stroke (wide, soft)
      ctx.save();
      ctx.beginPath();
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(${Math.min(255, cr + 50)},${Math.min(255, cg + 40)},${Math.min(255, cb + 25)},${0.25 * breathMult})`;
      ctx.lineWidth = 5;
      ctx.shadowColor = `rgba(${Math.min(255, cr + 60)},${Math.min(255, cg + 50)},${Math.min(255, cb + 30)},0.3)`;
      ctx.shadowBlur = 2;
      ctx.stroke();
      ctx.restore();

      // Inner bright core (thin, intense)
      ctx.save();
      ctx.beginPath();
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(${Math.min(255, cr + 70)},${Math.min(255, cg + 55)},${Math.min(255, cb + 40)},${0.5 * breathMult})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = `rgba(${Math.min(255, cr + 80)},${Math.min(255, cg + 60)},${Math.min(255, cb + 45)},0.4)`;
      ctx.shadowBlur = 1;
      ctx.stroke();
      ctx.restore();
    }

    function animate() {
      if (!state.sized) {
        state.sized = sizeCanvas();
        if (!state.sized) { state.frame = requestAnimationFrame(animate); return; }
      }
      const { elapsed: el, timerState: ts, prefersReduced: pr, isDark: dark, countdownTarget: ct } = propsRef.current;
      const isPaused = ts === 'paused';
      const { w, h } = state;
      state.time += isPaused ? 0.003 : 0.016;
      const t = state.time;

      const progress = timerProgress(el, ct);
      const [cr, cg, cb] = lerpColor(progress);
      const breathCycle = Math.sin(t * (Math.PI * 2 / 4)) * 0.5 + 0.5;
      const breathMultiplier = 0.95 + breathCycle * 0.08;
      // Horizon breathes more than the fill (±2.5px)
      const horizonBreathOffset = pr ? 0 : (breathCycle - 0.5) * 5;

      const { cx, cy, glassW, glassH, topY, botY } = vc.dims(w, h);
      const fillRange = botY - topY;

      ctx.fillStyle = dark ? '#080808' : '#0c0c0e';
      ctx.fillRect(0, 0, w, h);

      // Ambient glow behind hourglass
      if (!pr && progress > 0.01) {
        const ambientI = progress * 0.12 * breathMultiplier;
        const glowY = botY - fillRange * progress * 0.3;
        const grad = ctx.createRadialGradient(cx, glowY, 0, cx, cy, glassH * 0.55);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${ambientI * 0.5})`);
        grad.addColorStop(0.4, `rgba(${cr},${cg},${cb},${ambientI * 0.15})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Vessel outline
      vc.path(ctx, cx, cy, glassW, glassH);
      ctx.strokeStyle = `rgba(${Math.round(cr * 0.5 + 60)},${Math.round(cg * 0.5 + 60)},${Math.round(cb * 0.5 + 60)},${0.08 + progress * 0.06})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Illuminated outline below horizon
      const horizonY = botY - fillRange * progress;
      if (progress > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, horizonY - 30, w, h);
        ctx.clip();
        vc.path(ctx, cx, cy, glassW, glassH);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(0.12 + progress * 0.18) * breathMultiplier})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // ─── Main vessel clip ───
      ctx.save();
      vc.path(ctx, cx, cy, glassW, glassH);
      ctx.clip();

      if (progress > 0.005) {
        const fadeZone = Math.min(50, fillRange * 0.15);

        // ─── Horizon clip: light only appears BELOW the noise-displaced line ───
        ctx.save();
        traceHorizonClip(horizonY, t, horizonBreathOffset);
        ctx.clip();

        // Primary luminous fill (Gamma's system)
        const primaryGrad = ctx.createRadialGradient(cx, botY, 0, cx, botY - fillRange * 0.6, fillRange * 0.6);
        const baseAlpha = (0.45 + progress * 0.4) * breathMultiplier;
        primaryGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${Math.min(0.9, baseAlpha)})`);
        primaryGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${baseAlpha * 0.7})`);
        primaryGrad.addColorStop(0.85, `rgba(${cr},${cg},${cb},${baseAlpha * 0.3})`);
        primaryGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = primaryGrad;
        ctx.fillRect(0, topY, w, botY - topY);

        // Off-center secondary glows (depth)
        const offX1 = cx - glassW * 0.12;
        const offY = botY - fillRange * progress * 0.4;
        const grad2 = ctx.createRadialGradient(offX1, offY, 0, offX1, offY, fillRange * 0.35);
        grad2.addColorStop(0, `rgba(${Math.min(255, cr + 20)},${Math.min(255, cg + 15)},${Math.min(255, cb + 10)},${baseAlpha * 0.25})`);
        grad2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, topY, w, botY - topY);

        const offX2 = cx + glassW * 0.10;
        const grad3 = ctx.createRadialGradient(offX2, offY + 15, 0, offX2, offY + 15, fillRange * 0.3);
        grad3.addColorStop(0, `rgba(${Math.min(255, cr + 10)},${Math.min(255, cg + 20)},${cb},${baseAlpha * 0.2})`);
        grad3.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad3;
        ctx.fillRect(0, topY, w, botY - topY);

        // Bright core at bottom
        const coreGrad = ctx.createRadialGradient(cx, botY - 10, 0, cx, botY - 10, glassW * 0.25);
        const coreAlpha = (0.15 + progress * 0.25) * breathMultiplier;
        coreGrad.addColorStop(0, `rgba(${Math.min(255, cr + 40)},${Math.min(255, cg + 30)},${Math.min(255, cb + 20)},${coreAlpha})`);
        coreGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${coreAlpha * 0.3})`);
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, botY - glassW * 0.3, w, glassW * 0.35);

        // Noguchi paper texture
        if (!pr) {
          ensureNoiseTexture(Math.ceil(w), Math.ceil(h));
          if (state.noiseCanvas) {
            ctx.save();
            ctx.globalAlpha = (0.08 + progress * 0.12) * breathMultiplier;
            ctx.globalCompositeOperation = 'overlay';
            ctx.drawImage(state.noiseCanvas, 0, 0, w, h);
            ctx.restore();
          }
        }

        // Scanlines for lantern warmth
        if (!pr) {
          const scanCount = Math.floor(12 * progress);
          for (let i = 0; i < scanCount; i++) {
            const scanY = botY - (botY - horizonY) * (i / scanCount);
            const hw = vc.halfW(cy, glassH, glassW, scanY);
            const noiseOff = valueNoise(i * 3.7 + t * 0.15, 42) * 0.3;
            const scanAlpha = (0.015 + noiseOff * 0.01) * breathMultiplier;
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

        ctx.restore(); // un-clip horizon

        // ─── Void above the horizon (Kenya Hara's emptiness) ───
        if (progress < 0.98) {
          const voidGrad = ctx.createLinearGradient(0, topY, 0, horizonY + horizonBreathOffset + 20);
          voidGrad.addColorStop(0, 'rgba(6,6,8,0.96)');
          voidGrad.addColorStop(0.75, 'rgba(6,6,8,0.90)');
          voidGrad.addColorStop(1, 'rgba(6,6,8,0)');
          ctx.fillStyle = voidGrad;
          ctx.fillRect(0, topY, w, horizonY - topY + horizonBreathOffset + 30);
        }

        // ─── The luminous horizon seam (Agnes Martin's line) ───
        if (!pr && progress > 0.005 && progress < 0.995) {
          drawHorizonSeam(horizonY, t, horizonBreathOffset, cr, cg, cb, breathMultiplier);
        }
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

      ctx.restore(); // un-clip vessel

      // Glass reflection
      if (!pr) {
        ctx.save();
        vc.path(ctx, cx, cy, glassW, glassH);
        ctx.clip();
        const reflGrad = ctx.createLinearGradient(cx - glassW * 0.42, 0, cx - glassW * 0.30, 0);
        reflGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.015 + progress * 0.02})`);
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(cx - glassW * 0.45, topY, glassW * 0.18, glassH);
        ctx.restore();
      }

      // Outer bloom
      if (!pr && progress > 0.05) {
        const bloomI = progress * 0.06 * breathMultiplier;
        const bloom = ctx.createRadialGradient(cx, cy + glassH * 0.15, glassW * 0.1, cx, cy, glassH * 0.7);
        bloom.addColorStop(0, `rgba(${cr},${cg},${cb},${bloomI})`);
        bloom.addColorStop(0.5, `rgba(${cr},${cg},${cb},${bloomI * 0.3})`);
        bloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, w, h);
      }

      state.frame = requestAnimationFrame(animate);
    }

    state.frame = requestAnimationFrame(animate);
    return () => { if (state.frame) cancelAnimationFrame(state.frame); };
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
