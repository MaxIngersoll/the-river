// ─── Shared hourglass geometry for all three prototypes ───

// Noise for organic variation
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

export function smoothstep(t) { return t * t * (3 - 2 * t); }

export function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smoothstep(x - xi), yf = smoothstep(y - yi);
  const ix = xi & 255, iy = yi & 255;
  const a = NOISE_T[NOISE_T[ix] + iy] / 255;
  const b = NOISE_T[NOISE_T[ix + 1] + iy] / 255;
  const c = NOISE_T[NOISE_T[ix] + iy + 1] / 255;
  const d = NOISE_T[NOISE_T[ix + 1] + iy + 1] / 255;
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

// Draw hourglass bezier path onto ctx
export function hourglassPath(ctx, cx, cy, w, h) {
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
export function hourglassHalfW(cy, glassH, glassW, y) {
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

// Standard hourglass dimensions from canvas size
export function hourglassDims(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const glassW = w * 0.8;
  const glassH = h * 0.88;
  const topY = cy - glassH * 0.48;
  const botY = cy + glassH * 0.48;
  const neckY = cy;
  return { cx, cy, glassW, glassH, topY, botY, neckY };
}

// Standard timer progress from elapsed ms
export function timerProgress(elapsed, countdownTarget) {
  const minutes = elapsed / 60000;
  return countdownTarget
    ? Math.min(1, elapsed / (countdownTarget * 60000))
    : Math.min(1, minutes / 30);
}
