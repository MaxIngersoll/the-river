import { useEffect, useRef } from 'react';
import { VESSELS, timerProgress, valueNoise, smoothstep, lerpColor } from './vesselGeometry.js';

// ─── The Hearth — "Growing Flame" 🔥 ───
// James Turrell × Brian Eno × Olafur Eliasson × Raven Kwok
// A primal fire inside the glass vessel. Tiny ember at 0%. Warm flame at 100%.
// Kwok-style algorithmic noise for flame texture (structured chaos).
// Color gradient WITHIN the flame: bottom=warmest amber, tip=coolest teal.
// Eno constraint: breathing via noise, not Math.sin.

// Flame-specific colors: warm amber base → cool teal tip
function flameColor(verticalT, progress) {
  // verticalT: 0=base(hot), 1=tip(cool)
  // As progress grows, entire flame shifts warmer (base gets hotter)
  const warmShift = progress * 0.3;
  const adjusted = Math.max(0, verticalT - warmShift);

  // Base (hot): bright amber-gold
  // Mid: warm olivine
  // Tip (cool): teal-green
  const baseR = 220 + progress * 35, baseG = 160 + progress * 15, baseB = 60;
  const tipR = 76, tipG = 174, tipB = 174;
  const midR = 180, midG = 175, midB = 112;

  let r, g, b;
  if (adjusted < 0.5) {
    const t = adjusted * 2;
    r = baseR + (midR - baseR) * smoothstep(t);
    g = baseG + (midG - baseG) * smoothstep(t);
    b = baseB + (midB - baseB) * smoothstep(t);
  } else {
    const t = (adjusted - 0.5) * 2;
    r = midR + (tipR - midR) * smoothstep(t);
    g = midG + (tipG - midG) * smoothstep(t);
    b = midB + (tipB - midB) * smoothstep(t);
  }
  return [Math.round(Math.min(255, r)), Math.round(Math.min(255, g)), Math.round(Math.min(255, b))];
}

// Ember particle system
function createEmbers(count) {
  const embers = [];
  for (let i = 0; i < count; i++) {
    embers.push({
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.8,
      size: 1 + Math.random() * 1.5,
      brightness: 0.4 + Math.random() * 0.6,
    });
  }
  return embers;
}

export default function HourglassHearth({
  elapsed, timerState, prefersReduced, countdownTarget, isDark,
  numbersHidden, onToggleNumbers, colonPulsing, colonPulseDuration,
  timerDepthColor, formatTimerParts, formatTimer,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    frame: null, time: 0, sized: false, w: 0, h: 0,
    embers: createEmbers(4),
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
      return true;
    }

    // Eno breathing: noise-driven, not sinusoidal
    function breathe(t) {
      const n1 = valueNoise(t * 0.4, 7.3);
      const n2 = valueNoise(t * 0.15, 42.1);
      return 0.92 + (n1 * 0.6 + n2 * 0.4) * 0.14;
    }

    // Flame width at a given vertical position within the flame
    // t: 0=base, 1=tip. Returns multiplier 0-1.
    function flameWidthCurve(t) {
      // Teardrop shape: wide at base, pointed at tip
      if (t < 0.1) return smoothstep(t / 0.1) * 0.95; // base taper
      if (t > 0.7) {
        const tipT = (t - 0.7) / 0.3;
        return (1 - smoothstep(tipT)) * 0.7;
      }
      // Middle: gentle bell
      const midT = (t - 0.1) / 0.6;
      return 0.95 - midT * 0.25;
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
      const breath = pr ? 1 : breathe(t);

      const { cx, cy, glassW, glassH, topY, botY, neckY } = vc.dims(w, h);
      const fillRange = botY - neckY;

      // Flame height grows with progress (bottom bulb only for now)
      const flameMaxH = fillRange * 0.95;
      const flameH = Math.max(8, flameMaxH * Math.max(0.05, progress));
      const flameBaseY = botY - 4; // flame sits at bottom
      const flameTipY = flameBaseY - flameH;
      const flameMaxW = glassW * 0.20 * (0.4 + progress * 0.6);

      ctx.fillStyle = dark ? '#080808' : '#0c0c0e';
      ctx.fillRect(0, 0, w, h);

      // Ambient glow behind vessel — fire-warm
      if (!pr && progress > 0.01) {
        const glowI = progress * 0.10 * breath;
        const glowGrad = ctx.createRadialGradient(cx, botY - flameH * 0.4, 0, cx, cy, glassH * 0.6);
        glowGrad.addColorStop(0, `rgba(${Math.min(255, cr + 30)},${Math.min(255, cg + 10)},${cb},${glowI * 0.5})`);
        glowGrad.addColorStop(0.4, `rgba(${cr},${cg},${cb},${glowI * 0.15})`);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Vessel outline
      vc.path(ctx, cx, cy, glassW, glassH);
      ctx.strokeStyle = `rgba(${Math.round(cr * 0.4 + 50)},${Math.round(cg * 0.4 + 50)},${Math.round(cb * 0.4 + 50)},${0.06 + progress * 0.04})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Illuminated outline near flame
      if (progress > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, flameTipY - 20, w, botY - flameTipY + 40);
        ctx.clip();
        vc.path(ctx, cx, cy, glassW, glassH);
        ctx.strokeStyle = `rgba(${Math.min(255, cr + 30)},${Math.min(255, cg + 15)},${cb},${(0.10 + progress * 0.15) * breath})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // ─── Clip to vessel ───
      ctx.save();
      vc.path(ctx, cx, cy, glassW, glassH);
      ctx.clip();

      if (progress > 0.005) {
        // Layer 1: Outer flame glow (soft radial)
        const outerGlowR = flameMaxW * 2.5;
        const outerGrad = ctx.createRadialGradient(cx, flameBaseY - flameH * 0.3, 0, cx, flameBaseY - flameH * 0.3, outerGlowR);
        const outerAlpha = (0.12 + progress * 0.18) * breath;
        outerGrad.addColorStop(0, `rgba(${Math.min(255, cr + 40)},${Math.min(255, cg + 20)},${cb},${outerAlpha})`);
        outerGrad.addColorStop(0.4, `rgba(${cr},${cg},${cb},${outerAlpha * 0.35})`);
        outerGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = outerGrad;
        ctx.fillRect(0, topY, w, botY - topY);

        // Layer 2: Flame body — vertical slices with noise-displaced edges (Kwok)
        const sliceCount = Math.max(12, Math.floor(flameH / 3));
        const sliceH = flameH / sliceCount;

        for (let i = 0; i < sliceCount; i++) {
          const sliceY = flameBaseY - i * sliceH;
          const vertT = i / sliceCount; // 0=base, 1=tip

          // Width with noise displacement
          const baseWidth = flameMaxW * flameWidthCurve(vertT);
          const noiseDisp = (valueNoise(vertT * 4 + t * 1.2, t * 0.3 + i * 0.7) - 0.5) * flameMaxW * 0.35;
          const flutter = isPaused
            ? (valueNoise(i * 0.3 + t * 0.2, 99) - 0.5) * 2
            : (valueNoise(i * 0.5 + t * 2.5, 99) - 0.5) * 5;

          const halfW = Math.max(1, (baseWidth + noiseDisp) * breath);
          const centerX = cx + flutter;

          // Color varies vertically within flame
          const [fr, fg, fb] = flameColor(vertT, progress);
          const sliceAlpha = (0.4 + progress * 0.45) * breath * (1 - vertT * 0.3);

          ctx.fillStyle = `rgba(${fr},${fg},${fb},${sliceAlpha})`;
          ctx.fillRect(centerX - halfW, sliceY - sliceH * 0.6, halfW * 2, sliceH * 1.2);
        }

        // Layer 3: Bright inner core (narrow, intense)
        ctx.save();
        ctx.beginPath();
        const coreW = flameMaxW * 0.35;
        const coreTipY = flameTipY + flameH * 0.15;
        // Bezier flame shape
        ctx.moveTo(cx - coreW * 0.6, flameBaseY);
        ctx.bezierCurveTo(
          cx - coreW * 0.8, flameBaseY - flameH * 0.3,
          cx - coreW * 0.2, coreTipY + flameH * 0.15,
          cx + (valueNoise(t * 0.8, 13) - 0.5) * 4, coreTipY
        );
        ctx.bezierCurveTo(
          cx + coreW * 0.2, coreTipY + flameH * 0.15,
          cx + coreW * 0.8, flameBaseY - flameH * 0.3,
          cx + coreW * 0.6, flameBaseY
        );
        ctx.closePath();

        const coreGrad = ctx.createLinearGradient(0, flameBaseY, 0, coreTipY);
        const coreAlpha = (0.35 + progress * 0.4) * breath;
        const [br, bg, bb] = flameColor(0, progress); // brightest (base color)
        coreGrad.addColorStop(0, `rgba(${Math.min(255, br + 30)},${Math.min(255, bg + 20)},${Math.min(255, bb + 15)},${coreAlpha})`);
        coreGrad.addColorStop(0.5, `rgba(${Math.min(255, br + 15)},${Math.min(255, bg + 10)},${bb},${coreAlpha * 0.6})`);
        coreGrad.addColorStop(1, `rgba(${cr},${cg},${cb},${coreAlpha * 0.1})`);
        ctx.fillStyle = coreGrad;
        ctx.fill();
        ctx.restore();

        // Layer 4: Kwok noise texture (structured chaos)
        if (!pr) {
          const ts = 8, ta = (0.04 + progress * 0.08) * breath;
          for (let y = flameBaseY; y > flameTipY; y -= ts) {
            const vt = (flameBaseY - y) / flameH;
            const bw = flameMaxW * flameWidthCurve(vt) * breath;
            if (bw < 2) continue;
            for (let x = cx - bw; x < cx + bw; x += ts) {
              const n = valueNoise(x * 0.08 + t * 0.5, y * 0.08 - t * 1.2);
              if (n > 0.55) {
                const [fr, fg, fb] = flameColor(vt, progress);
                ctx.fillStyle = `rgba(${Math.min(255, fr + 40)},${Math.min(255, fg + 30)},${Math.min(255, fb + 20)},${(n - 0.55) * 2.2 * ta})`;
                ctx.fillRect(x, y, ts * 0.7, ts * 0.7);
              }
            }
          }
        }

        // Hot base glow (ember bed)
        const baseGrad = ctx.createRadialGradient(cx, botY - 3, 0, cx, botY - 3, glassW * 0.18);
        const baseAlpha = (0.15 + progress * 0.25) * breath;
        const [ebr, ebg, ebb] = flameColor(0, progress);
        baseGrad.addColorStop(0, `rgba(${Math.min(255, ebr + 30)},${Math.min(255, ebg + 15)},${ebb},${baseAlpha})`);
        baseGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${baseAlpha * 0.3})`);
        baseGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(cx - glassW * 0.25, botY - glassW * 0.2, glassW * 0.5, glassW * 0.25);

        // Rising embers (Eliasson: warmth particles)
        if (!pr && progress > 0.08) {
          state.embers.forEach((ember) => {
            const cycle = ((t * ember.speed + ember.phase) % 1);
            if (cycle > 0.85) return; // fade out near top

            const ey = flameTipY + (flameBaseY - flameTipY) * (1 - cycle);
            const driftX = cx + ember.drift * flameMaxW * 0.6 +
              (valueNoise(t * 0.6 + ember.phase, ey * 0.02) - 0.5) * 8;

            const fadeIn = cycle < 0.1 ? cycle / 0.1 : 1;
            const fadeOut = cycle > 0.7 ? (0.85 - cycle) / 0.15 : 1;
            const alpha = ember.brightness * fadeIn * fadeOut * (0.3 + progress * 0.5) * breath;

            const [er, eg, eb] = flameColor(cycle * 0.6, progress);
            ctx.beginPath();
            ctx.arc(driftX, ey, ember.size * (0.5 + progress * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(255, er + 50)},${Math.min(255, eg + 30)},${Math.min(255, eb + 20)},${alpha})`;
            ctx.fill();
          });
        }
      }

      // Empty state — faint warmth suggestion
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
        reflGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.012 + progress * 0.018})`);
        reflGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(cx - glassW * 0.45, topY, glassW * 0.18, glassH);
        ctx.restore();
      }

      // Outer bloom
      if (!pr && progress > 0.05) {
        const bloomI = progress * 0.05 * breath;
        const bloom = ctx.createRadialGradient(cx, botY - flameH * 0.4, glassW * 0.05, cx, cy, glassH * 0.65);
        bloom.addColorStop(0, `rgba(${Math.min(255, cr + 20)},${Math.min(255, cg + 10)},${cb},${bloomI})`);
        bloom.addColorStop(0.5, `rgba(${cr},${cg},${cb},${bloomI * 0.3})`);
        bloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, w, h);
      }

      state.frame = requestAnimationFrame(animate);
    }

    state.frame = requestAnimationFrame(animate);
    const onResize = () => { state.sized = false; };
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
