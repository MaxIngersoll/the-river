import {
  getTotalMinutes,
  formatHours,
  formatDuration,
  calculateStreak,
  today,
} from '../utils/storage';
import { getDailyQuote } from '../utils/quotes';
import QuoteCard from './QuoteCard';
import RiverSVG from './RiverSVG';

export default function HomePage({ sessions, onNavigate }) {
  const totalMinutes = getTotalMinutes(sessions);
  const streak = calculateStreak(sessions);
  const todayStr = today();
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const dailyQuote = getDailyQuote();
  const hasSessions = sessions.length > 0;
  const todayMinutes = todaySessions.reduce((s, x) => s + x.duration_minutes, 0);

  // Empty state
  if (!hasSessions) {
    return (
      <div className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
        {/* Hero with ambient glow */}
        <div className="text-center mb-10 hero-glow">
          <p className="text-text-3 text-xs font-medium uppercase tracking-widest mb-3">
            Total Practice
          </p>
          <h1 className="text-[64px] font-bold text-text leading-none tracking-tight">
            0h 0m
          </h1>
        </div>

        {/* Dry riverbed visual */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-[2px] h-16 bg-gradient-to-b from-transparent via-dry-bank to-transparent opacity-40" />
            <div className="w-2 h-2 rounded-full bg-dry-bank opacity-30" />
            <div className="w-[2px] h-12 bg-gradient-to-b from-transparent via-dry-bank to-transparent opacity-30" />
            <div className="w-2 h-2 rounded-full bg-dry-bank opacity-20" />
            <div className="w-[2px] h-8 bg-gradient-to-b from-transparent via-dry-bank to-transparent opacity-20" />
          </div>
          <p className="text-center text-text-2 text-sm font-medium mt-2">
            Your river begins with one drop
          </p>
        </div>

        {/* Quote */}
        <div className="mb-8">
          <QuoteCard
            quote={{
              text: "A journey of a thousand miles begins with a single step.",
              author: "Lao Tzu",
              source: "Tao Te Ching",
            }}
          />
        </div>

        {/* CTA — glassy button */}
        <button
          onClick={() => onNavigate('log')}
          className="w-full font-medium py-4 rounded-full text-base active:scale-[0.97] transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(17,94,89,0.95))',
            color: 'white',
            boxShadow: '0 4px 20px rgba(20,184,166,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          Log Your First Session
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
      {/* Settings gear */}
      <div className="flex justify-end -mb-6">
        <button
          onClick={() => onNavigate('settings')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-dry/60 transition-colors text-text-3"
          aria-label="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Hero stat with ambient glow */}
      <div className="text-center mb-2 hero-glow">
        <p className="text-text-3 text-xs font-medium uppercase tracking-widest mb-3">
          Total Practice
        </p>
        <h1 className="text-[64px] font-bold text-text leading-none tracking-tight">
          {formatHours(totalMinutes)}
        </h1>
      </div>

      {/* Flow status pill — glassy */}
      <div className="flex justify-center mb-8">
        {streak.current > 0 ? (
          <div className="flow-pill inline-flex items-center gap-2 bg-water-1/20 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-water-4 animate-pulse-glow" />
            <span className="text-water-5 font-semibold text-sm">
              {streak.current} day flow
            </span>
          </div>
        ) : (
          <div className="flow-pill-dry inline-flex items-center gap-2 bg-dry/40 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-dry-bank" />
            <span className="text-text-3 font-medium text-sm">
              Start a new flow
            </span>
          </div>
        )}
      </div>

      {/* Today's stats row — staggered glass capsules */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { value: todayMinutes > 0 ? formatDuration(todayMinutes) : '—', label: 'Today' },
          { value: streak.current, label: 'Streak' },
          { value: sessions.length, label: 'Sessions' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="card p-3 text-center opacity-0"
            style={{ animation: `fade-in-up 0.4s ease-out ${0.1 + i * 0.08}s forwards` }}
          >
            <p className="text-text font-bold text-lg leading-tight">
              {stat.value}
            </p>
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* River preview (last 28 days) */}
      <div
        className="card p-4 mb-6 cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => onNavigate('stats')}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider">
            Last 28 Days
          </h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-3">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <RiverSVG sessions={sessions} compact daysToShow={28} />
      </div>

      {/* Daily quote */}
      <div className="mb-6">
        <QuoteCard quote={dailyQuote} />
      </div>

      {/* Today's sessions */}
      {todaySessions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3">
            Today&apos;s Sessions
          </h3>
          <div className="space-y-3">
            {todaySessions.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-water-3 opacity-60" />
                <div className="flex-1 min-w-0">
                  <span className="text-text font-semibold text-sm">
                    {formatDuration(s.duration_minutes)}
                  </span>
                  {s.note && (
                    <p className="text-text-3 text-xs truncate mt-0.5">
                      {s.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
