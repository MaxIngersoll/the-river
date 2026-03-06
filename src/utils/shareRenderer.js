// ─── Canvas-based Share Card Renderer ───
// Draws a 1080×1080 square card with river stats for sharing

import {
  getTotalMinutes,
  formatHours,
  calculateStreak,
  getPersonalBests,
  getSessionsByDate,
  addDays,
  today,
  getMinutesForDate,
  getWaterWidth,
  daysBetween,
} from './storage';

// ─── Color palette ───
const COLORS = {
  bg: '#0C0A09',       // deep dark
  bgGrad: '#0F172A',   // dark navy tint
  water: [
    '#1E3A5F', '#1E40AF', '#2563EB', '#3B82F6',
    '#60A5FA', '#93C5FD', '#BFDBFE',
  ],
  textPrimary: '#F2F1ED',
  textSecondary: 'rgba(242,241,237,0.55)',
  textMuted: 'rgba(242,241,237,0.35)',
  accent: '#3B82F6',
  accentGlow: 'rgba(59,130,246,0.25)',
  divider: 'rgba(255,255,255,0.06)',
};

function getColorForHours(h) {
  const thresholds = [0, 0.5, 2, 5, 10, 25, 50];
  let idx = 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (h >= thresholds[i]) { idx = i; break; }
  }
  return COLORS.water[Math.min(idx, COLORS.water.length - 1)];
}

// Seeded random (same as RiverSVG)
function seeded(seed) {
  let x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ─── Main export ───
export function renderShareCard(sessions) {
  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // ─── Background ───
  const bgGrad = ctx.createLinearGradient(0, 0, 0, SIZE);
  bgGrad.addColorStop(0, COLORS.bg);
  bgGrad.addColorStop(0.4, COLORS.bgGrad);
  bgGrad.addColorStop(1, COLORS.bg);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle radial glow behind river
  const radGrad = ctx.createRadialGradient(SIZE / 2, SIZE * 0.48, 0, SIZE / 2, SIZE * 0.48, SIZE * 0.4);
  radGrad.addColorStop(0, COLORS.accentGlow);
  radGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const totalMinutes = getTotalMinutes(sessions);
  const streak = calculateStreak(sessions);
  const bests = getPersonalBests(sessions);
  const totalHours = totalMinutes / 60;

  // ─── Header ───
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('MY RIVER', SIZE / 2, 72);
  ctx.letterSpacing = '0px';

  // Total time — large hero number
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '700 72px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(formatHours(totalMinutes), SIZE / 2, 148);

  // Subtitle
  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = '400 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const daysActive = sessions.length > 0
    ? new Set(sessions.map(s => s.date)).size
    : 0;
  ctx.fillText(
    `${sessions.length} sessions across ${daysActive} days`,
    SIZE / 2,
    180
  );

  // ─── Mini river visualization (last 60 days) ───
  drawMiniRiver(ctx, sessions, SIZE);

  // ─── Stats row ───
  const statsY = 770;

  // Divider
  ctx.strokeStyle = COLORS.divider;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, statsY - 30);
  ctx.lineTo(SIZE - 80, statsY - 30);
  ctx.stroke();

  const stats = [
    { value: streak.current > 0 ? `${streak.current}d` : '—', label: 'STREAK' },
    { value: `${bests.longestStreak}d`, label: 'BEST FLOW' },
    { value: fmtMin(bests.longestSession), label: 'LONGEST' },
    { value: fmtMin(bests.bestWeek), label: 'BEST WEEK' },
  ];

  const colW = (SIZE - 160) / stats.length;
  stats.forEach((stat, i) => {
    const x = 80 + colW * i + colW / 2;

    ctx.fillStyle = COLORS.textPrimary;
    ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(stat.value, x, statsY + 8);

    ctx.fillStyle = COLORS.textMuted;
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(stat.label, x, statsY + 32);
    ctx.letterSpacing = '0px';
  });

  // ─── Bottom divider ───
  ctx.strokeStyle = COLORS.divider;
  ctx.beginPath();
  ctx.moveTo(80, 860);
  ctx.lineTo(SIZE - 80, 860);
  ctx.stroke();

  // ─── Motivational line ───
  const quotes = [
    'Every drop builds the river.',
    'The current grows stronger.',
    'Deep water runs quiet.',
    'Flow by flow, the river deepens.',
    'Consistency is the source.',
  ];
  // Pick based on total hours for consistency
  const quoteIdx = Math.floor(totalHours * 7) % quotes.length;

  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = 'italic 400 18px Georgia, "Times New Roman", serif';
  ctx.fillText(quotes[quoteIdx], SIZE / 2, 900);

  // ─── Branding ───
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('THE RIVER', SIZE / 2, 1000);
  ctx.letterSpacing = '0px';

  // Small accent dot
  ctx.beginPath();
  ctx.arc(SIZE / 2, 1025, 3, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.accent;
  ctx.fill();

  return canvas;
}

// ─── Mini river drawing ───
function drawMiniRiver(ctx, sessions, SIZE) {
  const DAYS = 60;
  const todayStr = today();
  const startDate = addDays(todayStr, -(DAYS - 1));

  const riverTop = 220;
  const riverBottom = 710;
  const riverHeight = riverBottom - riverTop;
  const rowH = riverHeight / DAYS;
  const centerX = SIZE / 2;
  const maxHalfW = SIZE * 0.28;

  // Build day data
  const days = [];
  let runMins = 0;
  for (const s of sessions) {
    if (s.date < startDate) runMins += s.duration_minutes;
  }

  for (let i = 0; i < DAYS; i++) {
    const date = addDays(startDate, i);
    const mins = getMinutesForDate(sessions, date);
    runMins += mins;
    days.push({ date, index: i, minutes: mins, runningHours: runMins / 60 });
  }

  // Build left and right edge points
  const leftPts = [];
  const rightPts = [];

  // Top cap
  leftPts.push([centerX, riverTop - rowH]);
  rightPts.push([centerX, riverTop - rowH]);

  for (const day of days) {
    const y = riverTop + day.index * rowH + rowH / 2;
    let halfW;
    if (day.minutes > 0) {
      halfW = (getWaterWidth(day.minutes) / 100) * maxHalfW;
    } else {
      halfW = 1.5;
    }
    const jx = (seeded(day.index * 137) - 0.5) * 3;
    leftPts.push([centerX - halfW + jx, y]);
    rightPts.push([centerX + halfW - jx, y]);
  }

  // Bottom cap
  const bottomY = riverTop + DAYS * rowH;
  leftPts.push([centerX, bottomY + rowH]);
  rightPts.push([centerX, bottomY + rowH]);

  // Create gradient
  const grad = ctx.createLinearGradient(0, riverTop, 0, riverBottom);
  let prevColor = getColorForHours(0);
  grad.addColorStop(0, prevColor);
  for (const day of days) {
    const c = getColorForHours(day.runningHours);
    if (c !== prevColor) {
      const pct = (day.index * rowH) / riverHeight;
      grad.addColorStop(Math.max(0, pct - 0.02), prevColor);
      grad.addColorStop(Math.min(1, pct + 0.01), c);
      prevColor = c;
    }
  }
  grad.addColorStop(1, prevColor);

  // Draw glow layer
  ctx.save();
  ctx.filter = 'blur(12px)';
  ctx.globalAlpha = 0.35;
  drawSmoothPath(ctx, leftPts, rightPts);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Draw main river
  ctx.globalAlpha = 0.92;
  drawSmoothPath(ctx, leftPts, rightPts);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Center highlight
  ctx.globalAlpha = 0.12;
  const hlLeft = leftPts.map(([x, y]) => [centerX - (centerX - x) * 0.25, y]);
  const hlRight = rightPts.map(([x, y]) => [centerX + (x - centerX) * 0.25, y]);
  drawSmoothPath(ctx, hlLeft, hlRight);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.globalAlpha = 1;

  // Dry day dashes
  for (const day of days) {
    if (day.minutes === 0) {
      const y = riverTop + day.index * rowH + rowH / 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(centerX - maxHalfW * 0.15, y);
      ctx.lineTo(centerX + maxHalfW * 0.15, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Today glow dot
  const lastDay = days[days.length - 1];
  if (lastDay && lastDay.minutes > 0) {
    const ty = riverTop + lastDay.index * rowH + rowH / 2;
    const tc = getColorForHours(lastDay.runningHours);

    // Glow
    const glow = ctx.createRadialGradient(centerX, ty, 0, centerX, ty, 20);
    glow.addColorStop(0, tc);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(centerX - 20, ty - 20, 40, 40);
    ctx.globalAlpha = 1;

    // Bright dot
    ctx.beginPath();
    ctx.arc(centerX, ty, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Date markers along left edge
  ctx.textAlign = 'right';
  ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  for (const day of days) {
    const d = new Date(day.date + 'T12:00:00');
    if (d.getDate() === 1) {
      const y = riverTop + day.index * rowH + rowH / 2;
      ctx.fillStyle = COLORS.textMuted;
      ctx.fillText(
        d.toLocaleDateString('en-US', { month: 'short' }),
        centerX - maxHalfW - 16,
        y + 4
      );
      // Subtle tick
      ctx.strokeStyle = COLORS.divider;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(centerX - maxHalfW - 8, y);
      ctx.lineTo(centerX - maxHalfW - 2, y);
      ctx.stroke();
    }
  }
  ctx.textAlign = 'center';
}

// ─── Smooth Bezier path from left/right point arrays ───
function drawSmoothPath(ctx, leftPts, rightPts) {
  ctx.beginPath();

  // Left side (top to bottom)
  if (leftPts.length < 2) return;
  ctx.moveTo(leftPts[0][0], leftPts[0][1]);
  for (let i = 0; i < leftPts.length - 1; i++) {
    const p0 = leftPts[Math.max(0, i - 1)];
    const p1 = leftPts[i];
    const p2 = leftPts[i + 1];
    const p3 = leftPts[Math.min(leftPts.length - 1, i + 2)];
    const t = 5;
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / t, p1[1] + (p2[1] - p0[1]) / t,
      p2[0] - (p3[0] - p1[0]) / t, p2[1] - (p3[1] - p1[1]) / t,
      p2[0], p2[1]
    );
  }

  // Right side (bottom to top)
  const rRev = [...rightPts].reverse();
  ctx.lineTo(rRev[0][0], rRev[0][1]);
  for (let i = 0; i < rRev.length - 1; i++) {
    const p0 = rRev[Math.max(0, i - 1)];
    const p1 = rRev[i];
    const p2 = rRev[i + 1];
    const p3 = rRev[Math.min(rRev.length - 1, i + 2)];
    const t = 5;
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / t, p1[1] + (p2[1] - p0[1]) / t,
      p2[0] - (p3[0] - p1[0]) / t, p2[1] - (p3[1] - p1[1]) / t,
      p2[0], p2[1]
    );
  }

  ctx.closePath();
}

// Format minutes compactly
function fmtMin(minutes) {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}m`;
}

// ─── Export as blob for sharing ───
export function shareCardToBlob(sessions) {
  return new Promise((resolve) => {
    const canvas = renderShareCard(sessions);
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
