// ─── Vessel geometry for lantern timer shapes ───
// Each vessel defines: path (draw outline), halfW (width at Y), dims (bounding box)
// The Gamma lighting system is shape-agnostic — these are the only shape-specific functions.

import { smoothstep, valueNoise, timerProgress, hourglassPath, hourglassHalfW, hourglassDims } from './hourglassGeometry.js';
export { smoothstep, valueNoise, timerProgress };

// ─── Shared color system for Competition Q prototypes ───
export const COLOR_JOURNEY = [
  { t: 0.00, r: 76,  g: 174, b: 174 },
  { t: 0.30, r: 96,  g: 178, b: 158 },
  { t: 0.55, r: 141, g: 181, b: 133 },
  { t: 0.80, r: 180, g: 175, b: 112 },
  { t: 1.00, r: 200, g: 170, b: 100 },
];

export function lerpColor(progress) {
  const p = Math.max(0, Math.min(1, progress));
  let i = 0;
  while (i < COLOR_JOURNEY.length - 2 && COLOR_JOURNEY[i + 1].t < p) i++;
  const a = COLOR_JOURNEY[i];
  const b = COLOR_JOURNEY[i + 1];
  const local = (p - a.t) / (b.t - a.t);
  const s = local * local * (3 - 2 * local);
  return [
    Math.round(a.r + (b.r - a.r) * s),
    Math.round(a.g + (b.g - a.g) * s),
    Math.round(a.b + (b.b - a.b) * s),
  ];
}

// ═══════════════════════════════════════════════
// 1. URN 🏺 — Classical amphora
// ═══════════════════════════════════════════════

function urnDims(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const glassW = w * 0.78;
  const glassH = h * 0.88;
  const topY = cy - glassH * 0.48;
  const botY = cy + glassH * 0.48;
  return { cx, cy, glassW, glassH, topY, botY };
}

function urnPath(ctx, cx, cy, w, h) {
  // Proportions
  const lipW = w * 0.14;    // flared lip at top
  const neckW = w * 0.08;   // narrow neck
  const bellyW = w * 0.42;  // widest point
  const topY = cy - h * 0.48;
  const botY = cy + h * 0.48;
  const lipH = h * 0.04;    // lip height
  const neckTopY = topY + lipH;
  const neckBotY = topY + h * 0.18; // neck ends
  const bellyY = cy + h * 0.12;     // widest point (~60% down)

  ctx.beginPath();
  // Right side: lip → neck → shoulder → belly → base
  ctx.moveTo(cx - lipW, topY);
  ctx.lineTo(cx + lipW, topY);
  // Lip curves inward to neck
  ctx.bezierCurveTo(cx + lipW, neckTopY, cx + neckW, neckTopY, cx + neckW, neckTopY + lipH);
  // Neck straight down
  ctx.lineTo(cx + neckW, neckBotY);
  // Shoulder flares out to belly
  ctx.bezierCurveTo(cx + neckW + (bellyW - neckW) * 0.6, neckBotY, cx + bellyW, bellyY - h * 0.15, cx + bellyW, bellyY);
  // Belly curves down to base
  ctx.bezierCurveTo(cx + bellyW, botY - h * 0.12, cx + bellyW * 0.5, botY, cx, botY);
  // Left side (mirror)
  ctx.bezierCurveTo(cx - bellyW * 0.5, botY, cx - bellyW, botY - h * 0.12, cx - bellyW, bellyY);
  ctx.bezierCurveTo(cx - bellyW, bellyY - h * 0.15, cx - neckW - (bellyW - neckW) * 0.6, neckBotY, cx - neckW, neckBotY);
  ctx.lineTo(cx - neckW, neckTopY + lipH);
  ctx.bezierCurveTo(cx - neckW, neckTopY, cx - lipW, neckTopY, cx - lipW, topY);
  ctx.closePath();
}

function urnHalfW(cy, glassH, glassW, y) {
  const lipW = glassW * 0.14;
  const neckW = glassW * 0.08;
  const bellyW = glassW * 0.42;
  const topY = cy - glassH * 0.48;
  const botY = cy + glassH * 0.48;
  const lipH = glassH * 0.04;
  const neckTopY = topY + lipH;
  const neckBotY = topY + glassH * 0.18;
  const bellyY = cy + glassH * 0.12;

  if (y <= topY) return lipW;
  if (y >= botY) return 0;
  // Lip region
  if (y < neckTopY + lipH) {
    const t = (y - topY) / (neckTopY + lipH - topY);
    return lipW + (neckW - lipW) * smoothstep(t);
  }
  // Neck region
  if (y < neckBotY) return neckW;
  // Shoulder to belly
  if (y < bellyY) {
    const t = (y - neckBotY) / (bellyY - neckBotY);
    return neckW + (bellyW - neckW) * smoothstep(t);
  }
  // Belly to base
  const t = (y - bellyY) / (botY - bellyY);
  return bellyW * (1 - smoothstep(t) * 0.9);
}

// ═══════════════════════════════════════════════
// 2. ORB ○ — Simple ellipse
// ═══════════════════════════════════════════════

function orbDims(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const glassW = w * 0.78;
  const glassH = h * 0.82;
  const ry = glassH * 0.48;
  const topY = cy - ry;
  const botY = cy + ry;
  return { cx, cy, glassW, glassH, topY, botY };
}

function orbPath(ctx, cx, cy, w, h) {
  const rx = w * 0.40;
  const ry = h * 0.40;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.closePath();
}

function orbHalfW(cy, glassH, glassW, y) {
  const ry = glassH * 0.48;
  const rx = glassW * 0.40;
  const dy = y - cy;
  if (Math.abs(dy) >= ry) return 0;
  // Circle equation: x = rx * sqrt(1 - (dy/ry)²)
  return rx * Math.sqrt(1 - (dy * dy) / (ry * ry));
}

// ═══════════════════════════════════════════════
// 3. LANTERN ◻ — Noguchi Akari capsule
// ═══════════════════════════════════════════════

function lanternDims(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const glassW = w * 0.72;
  const glassH = h * 0.88;
  const topY = cy - glassH * 0.48;
  const botY = cy + glassH * 0.48;
  return { cx, cy, glassW, glassH, topY, botY };
}

function lanternPath(ctx, cx, cy, w, h) {
  const maxW = w * 0.36;      // half-width at widest (center)
  const endW = maxW * 0.82;   // half-width at top/bottom (10% narrower each side)
  const topY = cy - h * 0.42;
  const botY = cy + h * 0.42;
  const cornerR = maxW * 0.6; // large corner radius for capsule feel

  ctx.beginPath();
  // Start top-left, going clockwise
  ctx.moveTo(cx - endW, topY + cornerR);
  // Top-left corner
  ctx.bezierCurveTo(cx - endW, topY, cx - endW * 0.5, topY, cx, topY);
  // Top-right corner
  ctx.bezierCurveTo(cx + endW * 0.5, topY, cx + endW, topY, cx + endW, topY + cornerR);
  // Right side: slight outward bow at center
  ctx.bezierCurveTo(cx + endW + (maxW - endW) * 2, cy - h * 0.1, cx + endW + (maxW - endW) * 2, cy + h * 0.1, cx + endW, botY - cornerR);
  // Bottom-right corner
  ctx.bezierCurveTo(cx + endW, botY, cx + endW * 0.5, botY, cx, botY);
  // Bottom-left corner
  ctx.bezierCurveTo(cx - endW * 0.5, botY, cx - endW, botY, cx - endW, botY - cornerR);
  // Left side: slight outward bow at center
  ctx.bezierCurveTo(cx - endW - (maxW - endW) * 2, cy + h * 0.1, cx - endW - (maxW - endW) * 2, cy - h * 0.1, cx - endW, topY + cornerR);
  ctx.closePath();
}

function lanternHalfW(cy, glassH, glassW, y) {
  const maxW = glassW * 0.36;
  const endW = maxW * 0.82;
  const topY = cy - glassH * 0.42;
  const botY = cy + glassH * 0.42;

  if (y <= topY || y >= botY) return 0;
  // Vertical position 0→1
  const t = (y - topY) / (botY - topY);
  // Bell curve: widest at center, narrower at edges
  // Using sin curve for smooth taper
  const bellFactor = Math.sin(t * Math.PI);
  return endW + (maxW - endW) * bellFactor;
}

// ═══════════════════════════════════════════════
// VESSELS registry
// ═══════════════════════════════════════════════

export const VESSELS = {
  hourglass: { path: hourglassPath, halfW: hourglassHalfW, dims: hourglassDims },
  urn:       { path: urnPath, halfW: urnHalfW, dims: urnDims },
  orb:       { path: orbPath, halfW: orbHalfW, dims: orbDims },
  lantern:   { path: lanternPath, halfW: lanternHalfW, dims: lanternDims },
};
