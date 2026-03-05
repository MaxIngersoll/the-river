import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  today,
  addDays,
  daysBetween,
  getMinutesForDate,
  getWaterWidth,
  getSessionsByDate,
  formatDate,
  formatDuration,
} from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

// Seeded random for consistent organic jitter
function seeded(seed) {
  let x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Catmull-Rom to cubic bezier curve conversion
function curveThrough(points, tension = 5) {
  if (points.length < 2) return '';
  const parts = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    parts.push(
      `C ${p1.x + (p2.x - p0.x) / tension} ${p1.y + (p2.y - p0.y) / tension}, ` +
      `${p2.x - (p3.x - p1.x) / tension} ${p2.y - (p3.y - p1.y) / tension}, ` +
      `${p2.x} ${p2.y}`
    );
  }
  return parts.join(' ');
}

// Light mode: deeper progression (dark colors on light bg)
const WATER_COLORS_LIGHT = [
  { hours: 0,    color: '#D1FAE5' },
  { hours: 0.5,  color: '#A7F3D0' },
  { hours: 2,    color: '#6EE7B7' },
  { hours: 5,    color: '#34D399' },
  { hours: 10,   color: '#2DD4BF' },
  { hours: 25,   color: '#14B8A6' },
  { hours: 50,   color: '#0D9488' },
  { hours: 100,  color: '#0F766E' },
  { hours: 250,  color: '#115E59' },
  { hours: 500,  color: '#134E4A' },
  { hours: 1000, color: '#042F2E' },
];

// Dark mode: luminous & glowing (bright colors against dark bg)
const WATER_COLORS_DARK = [
  { hours: 0,    color: '#064E3B' },   // deep forest (barely visible start)
  { hours: 0.5,  color: '#065F46' },   // forest
  { hours: 2,    color: '#047857' },   // emerald
  { hours: 5,    color: '#059669' },   // bright emerald
  { hours: 10,   color: '#10B981' },   // vivid green
  { hours: 25,   color: '#34D399' },   // mint
  { hours: 50,   color: '#2DD4BF' },   // bright teal
  { hours: 100,  color: '#5EEAD4' },   // luminous teal
  { hours: 250,  color: '#6EE7B7' },   // glowing mint
  { hours: 500,  color: '#A7F3D0' },   // soft glow
  { hours: 1000, color: '#D1FAE5' },   // white-mint radiance
];

function getColorForHours(h, isDark = false) {
  const palette = isDark ? WATER_COLORS_DARK : WATER_COLORS_LIGHT;
  if (h <= 0) return palette[0].color;
  for (let i = palette.length - 1; i >= 0; i--) {
    if (h >= palette[i].hours) return palette[i].color;
  }
  return palette[0].color;
}

export default function RiverSVG({ sessions, compact = false, daysToShow }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const { isDark } = useTheme();

  const rowHeight = compact ? 16 : 26;
  const labelSpace = compact ? 0 : 52;

  const todayStr = today();
  const byDate = useMemo(() => getSessionsByDate(sessions), [sessions]);

  const startDate = useMemo(() => {
    if (daysToShow) return addDays(todayStr, -(daysToShow - 1));
    const dates = Object.keys(byDate).sort();
    return dates.length > 0 ? dates[0] : todayStr;
  }, [daysToShow, todayStr, byDate]);

  const totalDays = daysBetween(startDate, todayStr) + 1;

  const days = useMemo(() => {
    const result = [];
    let runMins = 0;
    for (const s of sessions) {
      if (s.date < startDate) runMins += s.duration_minutes;
    }
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(startDate, i);
      const mins = getMinutesForDate(sessions, date);
      runMins += mins;
      const d = new Date(date + 'T12:00:00');
      result.push({
        date, index: i, minutes: mins,
        runningHours: runMins / 60,
        isToday: date === todayStr,
        isMonday: d.getDay() === 1,
        isFirstOfMonth: d.getDate() === 1,
        monthLabel: d.toLocaleDateString('en-US', { month: 'long' }),
        weekLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }
    return result;
  }, [sessions, startDate, totalDays, todayStr]);

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Auto-scroll to bottom (today)
  useEffect(() => {
    if (!compact && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [compact, sessions.length, width]);

  const svgWidth = Math.max(width, 100);
  const riverArea = svgWidth - labelSpace;
  const svgHeight = totalDays * rowHeight + rowHeight;
  const centerX = labelSpace + riverArea / 2;
  const maxW = riverArea * 0.86;

  // Generate the organic river shape
  const { riverPath, highlightPath, gradientStops, dryDays } = useMemo(() => {
    if (days.length === 0 || width === 0) {
      return { riverPath: '', highlightPath: '', gradientStops: [], dryDays: [] };
    }

    const left = [];
    const right = [];
    const dry = [];
    const jitterAmt = compact ? 0.8 : 2;

    // Pinch cap at top
    left.push({ x: centerX, y: -rowHeight * 0.5 });
    right.push({ x: centerX, y: -rowHeight * 0.5 });

    for (const day of days) {
      const y = day.index * rowHeight + rowHeight / 2;
      let halfW;

      if (day.minutes > 0) {
        halfW = (getWaterWidth(day.minutes) / 100 * maxW) / 2;
      } else {
        halfW = 1;
        dry.push(day);
      }

      // Organic jitter
      const jx = (seeded(day.index * 137) - 0.5) * jitterAmt;
      const jy = (seeded(day.index * 251) - 0.5) * jitterAmt * 0.5;
      left.push({ x: centerX - halfW + jx, y: y + jy });
      right.push({ x: centerX + halfW - jx, y: y - jy });
    }

    // Pinch cap at bottom
    const lastY = (days.length - 1) * rowHeight + rowHeight;
    left.push({ x: centerX, y: lastY + rowHeight * 0.5 });
    right.push({ x: centerX, y: lastY + rowHeight * 0.5 });

    // Smooth paths
    const leftCurves = curveThrough(left);
    const rightRev = [...right].reverse();
    const rightCurves = curveThrough(rightRev);

    const path = `M ${left[0].x} ${left[0].y} ${leftCurves} ` +
      `L ${rightRev[0].x} ${rightRev[0].y} ${rightCurves} Z`;

    // Center highlight (narrower, for luminous depth effect)
    const hlLeft = left.map(p => ({
      x: centerX - (centerX - p.x) * 0.22,
      y: p.y,
    }));
    const hlRight = right.map(p => ({
      x: centerX + (p.x - centerX) * 0.22,
      y: p.y,
    }));
    const hlLeftCurves = curveThrough(hlLeft);
    const hlRightRev = [...hlRight].reverse();
    const hlRightCurves = curveThrough(hlRightRev);
    const hlPath = `M ${hlLeft[0].x} ${hlLeft[0].y} ${hlLeftCurves} ` +
      `L ${hlRightRev[0].x} ${hlRightRev[0].y} ${hlRightCurves} Z`;

    // Gradient stops with smooth transitions
    const stops = [];
    let prevColor = getColorForHours(0, isDark);
    stops.push({ offset: '0%', color: prevColor });

    for (const day of days) {
      const c = getColorForHours(day.runningHours, isDark);
      if (c !== prevColor) {
        const pct = (day.index * rowHeight + rowHeight / 2) / svgHeight * 100;
        stops.push({ offset: `${Math.max(0, pct - 2).toFixed(1)}%`, color: prevColor });
        stops.push({ offset: `${(pct + 1).toFixed(1)}%`, color: c });
        prevColor = c;
      }
    }
    stops.push({ offset: '100%', color: prevColor });

    return { riverPath: path, highlightPath: hlPath, gradientStops: stops, dryDays: dry };
  }, [days, width, centerX, maxW, rowHeight, svgHeight, compact, isDark]);

  const handleTap = useCallback((day) => {
    if (compact) return;
    if (tooltip?.date === day.date) { setTooltip(null); return; }
    const daySessions = byDate[day.date] || [];
    setTooltip({ ...day, sessions: daySessions });
  }, [compact, tooltip, byDate]);

  // Date labels (non-compact only)
  const dateLabels = useMemo(() => {
    if (compact) return [];
    return days.filter(d => d.isFirstOfMonth || d.isMonday);
  }, [days, compact]);

  // Unique IDs to avoid conflicts between compact and full instances
  const gradId = compact ? 'rg-c' : 'rg-f';
  const glowId = compact ? 'gl-c' : 'gl-f';
  const flowClipId = compact ? 'fc-c' : 'fc-f';

  const todayDay = days.length > 0 ? days[days.length - 1] : null;
  const todayY = todayDay ? todayDay.index * rowHeight + rowHeight / 2 : 0;
  const todayHasPractice = todayDay && todayDay.minutes > 0;
  const todayHalfW = todayHasPractice
    ? (getWaterWidth(todayDay.minutes) / 100 * maxW) / 2 + 10
    : 0;
  const todayColor = todayDay ? getColorForHours(todayDay.runningHours, isDark) : (isDark ? '#065F46' : '#A7F3D0');

  // Flow animation parameters
  const flowStreaks = compact
    ? [
        { rx: maxW * 0.15, ry: rowHeight * 1.2, dur: '3s', opacity: 0.07, offset: 0 },
        { rx: maxW * 0.10, ry: rowHeight * 0.9, dur: '4s', opacity: 0.05, offset: -1.5 },
      ]
    : [
        { rx: maxW * 0.20, ry: rowHeight * 3, dur: '5s',  opacity: 0.08, offset: 0 },
        { rx: maxW * 0.14, ry: rowHeight * 2, dur: '7s',  opacity: 0.06, offset: -2 },
        { rx: maxW * 0.18, ry: rowHeight * 2.5, dur: '9s', opacity: 0.05, offset: -4 },
      ];

  const svgContent = width > 0 && days.length > 0 && (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="block"
    >
      <defs>
        {/* River gradient (deepens over time) */}
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          {gradientStops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>

        {/* Glow filter */}
        <filter id={glowId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={compact ? 4 : 8} result="blur" />
          <feColorMatrix in="blur" type="saturate" values="2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Center highlight gradient */}
        <linearGradient id={`${gradId}-hl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={isDark ? '0.15' : '0.3'} />
          <stop offset="50%" stopColor="white" stopOpacity={isDark ? '0.08' : '0.15'} />
          <stop offset="100%" stopColor="white" stopOpacity={isDark ? '0.12' : '0.25'} />
        </linearGradient>

        {/* Clip path for flow animation */}
        {riverPath && (
          <clipPath id={flowClipId}>
            <path d={riverPath} />
          </clipPath>
        )}

        {/* Today glow filter (stronger) */}
        {!compact && (
          <filter id="today-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="saturate" values="2.5" />
          </filter>
        )}
      </defs>

      {/* Glow layer (behind main shape) */}
      {riverPath && (
        <path
          d={riverPath}
          fill={`url(#${gradId})`}
          opacity={0.3}
          filter={`url(#${glowId})`}
        />
      )}

      {/* Main river shape */}
      {riverPath && (
        <path
          d={riverPath}
          fill={`url(#${gradId})`}
          opacity={0.92}
        />
      )}

      {/* Center luminous highlight */}
      {highlightPath && (
        <path
          d={highlightPath}
          fill={`url(#${gradId}-hl)`}
        />
      )}

      {/* ✨ Flowing water animation — soft light streaks drifting down */}
      {riverPath && (
        <g clipPath={`url(#${flowClipId})`}>
          {flowStreaks.map((streak, i) => (
            <ellipse
              key={i}
              cx={centerX + (i % 2 === 0 ? -1 : 1) * maxW * 0.03}
              cy={0}
              rx={streak.rx}
              ry={streak.ry}
              fill="white"
              opacity={streak.opacity}
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from={`0 ${-streak.ry * 2}`}
                to={`0 ${svgHeight + streak.ry * 2}`}
                dur={streak.dur}
                begin={`${streak.offset}s`}
                repeatCount="indefinite"
              />
            </ellipse>
          ))}
        </g>
      )}

      {/* Dry day markers */}
      {dryDays.map(day => {
        const y = day.index * rowHeight + rowHeight / 2;
        return (
          <line
            key={day.date}
            x1={centerX - maxW * 0.1}
            y1={y}
            x2={centerX + maxW * 0.1}
            y2={y}
            stroke="var(--color-dry-bank)"
            strokeWidth={1}
            strokeDasharray="3 2.5"
            opacity={0.5}
          />
        );
      })}

      {/* 🔵 Today marker — prominent breathing glow with ripples */}
      {todayDay && todayDay.isToday && !compact && todayHasPractice && (
        <g>
          {/* Expanding ripple ring 1 */}
          <ellipse
            cx={centerX}
            cy={todayY}
            rx={4}
            ry={2}
            fill="none"
            stroke={todayColor}
            strokeWidth={1.2}
            opacity={0}
          >
            <animate attributeName="rx" from="6" to={todayHalfW + 24} dur="3s" repeatCount="indefinite" />
            <animate attributeName="ry" from="3" to={rowHeight * 1.2} dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.35" to="0" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* Expanding ripple ring 2 (staggered) */}
          <ellipse
            cx={centerX}
            cy={todayY}
            rx={4}
            ry={2}
            fill="none"
            stroke={todayColor}
            strokeWidth={0.8}
            opacity={0}
          >
            <animate attributeName="rx" from="6" to={todayHalfW + 24} dur="3s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="ry" from="3" to={rowHeight * 1.2} dur="3s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.25" to="0" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </ellipse>

          {/* Soft glow halo */}
          <ellipse
            cx={centerX}
            cy={todayY}
            rx={todayHalfW * 1.1}
            ry={rowHeight * 0.9}
            fill={todayColor}
            filter="url(#today-glow)"
            opacity={0.2}
          >
            <animate attributeName="opacity" values="0.12;0.25;0.12" dur="2.5s" repeatCount="indefinite" />
          </ellipse>

          {/* Inner glow ellipse */}
          <ellipse
            cx={centerX}
            cy={todayY}
            rx={todayHalfW * 0.5}
            ry={rowHeight * 0.4}
            fill={todayColor}
            opacity={0.2}
          >
            <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2s" repeatCount="indefinite" />
          </ellipse>

          {/* Bright center point */}
          <circle
            cx={centerX}
            cy={todayY}
            r={3}
            fill="white"
          >
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Today marker — dry day (gentle invitation pulse) */}
      {todayDay && todayDay.isToday && !compact && !todayHasPractice && (
        <g>
          {/* Soft ring pulse */}
          <circle
            cx={centerX}
            cy={todayY}
            r={4}
            fill="none"
            stroke="var(--color-dry-bank)"
            strokeWidth={1}
            opacity={0}
          >
            <animate attributeName="r" from="3" to="14" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
          </circle>

          {/* Breathing dot */}
          <circle
            cx={centerX}
            cy={todayY}
            r={3}
            fill="var(--color-dry-bank)"
          >
            <animate attributeName="opacity" values="0.25;0.55;0.25" dur="3s" repeatCount="indefinite" />
            <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Compact today indicator — subtle dot */}
      {todayDay && todayDay.isToday && compact && todayHasPractice && (
        <circle
          cx={centerX}
          cy={todayY}
          r={2.5}
          fill="white"
        >
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Date labels */}
      {dateLabels.map(day => (
        <g key={`lbl-${day.date}`}>
          {day.isFirstOfMonth && (
            <line
              x1={labelSpace - 4}
              y1={day.index * rowHeight}
              x2={svgWidth}
              y2={day.index * rowHeight}
              stroke="var(--color-dry-bank)"
              strokeWidth={0.5}
              opacity={0.5}
            />
          )}
          <text
            x={4}
            y={day.index * rowHeight + rowHeight / 2 + 3}
            fontSize={10}
            fill={day.isFirstOfMonth ? 'var(--color-text-2)' : 'var(--color-text-3)'}
            fontWeight={day.isFirstOfMonth ? 500 : 400}
            fontFamily="var(--font-sans)"
          >
            {day.isFirstOfMonth ? day.monthLabel : day.weekLabel}
          </text>
        </g>
      ))}

      {/* Invisible tap targets */}
      {!compact && days.map(day => (
        <rect
          key={`tap-${day.date}`}
          x={0}
          y={day.index * rowHeight}
          width={svgWidth}
          height={rowHeight}
          fill="transparent"
          onClick={() => handleTap(day)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </svg>
  );

  // Compact mode (home page preview)
  if (compact) {
    return (
      <div ref={containerRef} className="w-full overflow-hidden">
        {svgContent}
      </div>
    );
  }

  // Full mode (stats page)
  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={scrollRef}
        className="overflow-y-auto card"
        style={{ maxHeight: '55vh' }}
      >
        {svgContent}

        {/* Today dry prompt */}
        {todayDay && todayDay.isToday && todayDay.minutes === 0 && (
          <div className="text-center py-3">
            <span className="text-text-3 text-xs animate-pulse-glow">
              Add to your river today
            </span>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="fixed inset-0 z-40" onClick={() => setTooltip(null)}>
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 glass card p-5 z-50 w-[260px] animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            <p className="font-medium text-sm text-text">{formatDate(tooltip.date)}</p>
            {tooltip.minutes > 0 ? (
              <>
                <p className="text-water-5 font-bold text-xl mt-1">
                  {formatDuration(tooltip.minutes)}
                </p>
                <p className="text-text-3 text-xs mt-1">
                  {tooltip.sessions.length} session{tooltip.sessions.length !== 1 ? 's' : ''}
                </p>
                {tooltip.sessions.map(s => (
                  <div key={s.id} className="mt-2 border-t border-dry pt-2">
                    <span className="text-text-2 text-xs">{formatDuration(s.duration_minutes)}</span>
                    {s.note && <p className="text-text-3 text-xs mt-0.5">{s.note}</p>}
                  </div>
                ))}
              </>
            ) : (
              <p className="text-text-3 text-sm mt-1">Dry riverbed</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
