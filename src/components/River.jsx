import { useRef, useEffect, useState } from 'react';
import {
  today,
  addDays,
  daysBetween,
  getMinutesForDate,
  getWaterWidth,
  getWaterColor,
  formatDate,
  formatDuration,
  getSessionsByDate,
} from '../utils/storage';

function RiverRow({
  date,
  minutes,
  runningHours,
  isToday,
  rowHeight,
  compact,
  onTap,
}) {
  const width = getWaterWidth(minutes);
  const color = getWaterColor(runningHours);
  const isDry = minutes === 0;

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{ height: `${rowHeight}px` }}
      onClick={() => !compact && onTap?.(date, minutes)}
    >
      {isDry ? (
        <div
          className="border-t border-dashed"
          style={{
            width: '30%',
            borderColor: 'var(--color-dry-bank)',
          }}
        />
      ) : (
        <div
          className="rounded transition-all duration-300"
          style={{
            width: `${width}%`,
            height: `${Math.max(rowHeight - 4, 4)}px`,
            backgroundColor: color,
            borderRadius: '4px',
            ...(isToday
              ? { boxShadow: `0 0 12px ${color}` }
              : {}),
          }}
        />
      )}
    </div>
  );
}

function DateLabel({ text, bold }) {
  return (
    <div
      className={`absolute left-0 top-1/2 -translate-y-1/2 text-[10px] pl-1 ${
        bold ? 'text-text-2 font-medium' : 'text-text-3'
      }`}
    >
      {text}
    </div>
  );
}

export default function River({
  sessions,
  compact = false,
  daysToShow,
}) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const rowHeight = compact ? 20 : 32;

  const todayStr = today();
  const byDate = getSessionsByDate(sessions);

  // Determine date range
  let startDate;
  if (daysToShow) {
    startDate = addDays(todayStr, -(daysToShow - 1));
  } else {
    const dates = Object.keys(byDate).sort();
    startDate = dates.length > 0 ? dates[0] : todayStr;
  }

  const totalDays = daysBetween(startDate, todayStr) + 1;

  // Build day rows with running total
  const rows = [];
  let runningMinutes = 0;

  // Count minutes before startDate for running total
  for (const s of sessions) {
    if (s.date < startDate) {
      runningMinutes += s.duration_minutes;
    }
  }

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(startDate, i);
    const dayMinutes = getMinutesForDate(sessions, date);
    runningMinutes += dayMinutes;

    const d = new Date(date + 'T12:00:00');
    const dayOfWeek = d.getDay();
    const dayOfMonth = d.getDate();
    const isMonday = dayOfWeek === 1;
    const isFirstOfMonth = dayOfMonth === 1;

    rows.push({
      date,
      minutes: dayMinutes,
      runningHours: runningMinutes / 60,
      isToday: date === todayStr,
      isMonday,
      isFirstOfMonth,
      monthLabel: d.toLocaleDateString('en-US', { month: 'long' }),
      weekLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }

  // Auto-scroll to bottom on mount
  useEffect(() => {
    if (!compact && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [compact, sessions.length]);

  const handleTap = (date, minutes) => {
    if (tooltip?.date === date) {
      setTooltip(null);
      return;
    }
    const daySessions = byDate[date] || [];
    setTooltip({ date, minutes, sessions: daySessions });
  };

  if (compact) {
    return (
      <div className="bg-card rounded-[20px] border border-card-border p-3 shadow-sm">
        {rows.map((row) => (
          <RiverRow
            key={row.date}
            date={row.date}
            minutes={row.minutes}
            runningHours={row.runningHours}
            isToday={row.isToday}
            rowHeight={rowHeight}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-y-auto bg-card rounded-[20px] border border-card-border shadow-sm"
        style={{ maxHeight: '60vh' }}
      >
        <div className="relative" style={{ paddingLeft: '60px', paddingRight: '12px' }}>
          {rows.map((row) => (
            <div key={row.date} className="relative">
              {!compact && row.isFirstOfMonth && (
                <>
                  <div className="absolute left-[-56px] top-0 w-[calc(100%+68px)] border-t border-dry-bank" />
                  <DateLabel text={row.monthLabel} bold />
                </>
              )}
              {!compact && row.isMonday && !row.isFirstOfMonth && (
                <DateLabel text={row.weekLabel} />
              )}
              <RiverRow
                date={row.date}
                minutes={row.minutes}
                runningHours={row.runningHours}
                isToday={row.isToday}
                rowHeight={rowHeight}
                onTap={handleTap}
              />
            </div>
          ))}

          {/* Today indicator when dry */}
          {rows.length > 0 && rows[rows.length - 1].minutes === 0 && (
            <div className="text-center pb-3 pt-1">
              <span className="text-text-3 text-xs animate-pulse-glow">
                Add to your river today
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="fixed inset-0 z-40" onClick={() => setTooltip(null)}>
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-[16px] border border-card-border p-4 shadow-lg z-50 w-[260px] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-medium text-sm text-text">{formatDate(tooltip.date)}</p>
            {tooltip.minutes > 0 ? (
              <>
                <p className="text-water-5 font-bold text-lg mt-1">
                  {formatDuration(tooltip.minutes)}
                </p>
                <p className="text-text-3 text-xs mt-1">
                  {tooltip.sessions.length} session{tooltip.sessions.length !== 1 ? 's' : ''}
                </p>
                {tooltip.sessions.map((s) => (
                  <div key={s.id} className="mt-2 border-t border-dry pt-2">
                    <span className="text-text-2 text-xs">{formatDuration(s.duration_minutes)}</span>
                    {s.note && (
                      <p className="text-text-3 text-xs mt-0.5">{s.note}</p>
                    )}
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
