import {
  getTotalMinutes,
  formatHours,
  formatDuration,
  getWeekStats,
  getPersonalBests,
  getSettings,
  daysBetween,
  today,
} from '../utils/storage';
import { getQuoteByCategory } from '../utils/quotes';
import QuoteCard from './QuoteCard';
import RiverSVG from './RiverSVG';
import ProgressRing from './ProgressRing';

export default function StatsPage({ sessions }) {
  const totalMinutes = getTotalMinutes(sessions);
  const weekStats = getWeekStats(sessions);
  const bests = getPersonalBests(sessions);
  const settings = getSettings();
  const hasSessions = sessions.length > 0;

  const daysSinceFirst = settings.first_session_date
    ? daysBetween(settings.first_session_date, today()) + 1
    : 0;

  const weekProgress = Math.min(
    weekStats.totalMinutes / settings.weekly_goal_minutes,
    1
  );

  // Empty state
  if (!hasSessions) {
    return (
      <div className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
        <h1 className="text-2xl font-bold text-text mb-1">Your River</h1>
        <p className="text-text-3 text-sm mb-8">Practice flows, patterns emerge</p>

        <div className="card p-6 mb-6">
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-[2px] h-20 bg-gradient-to-b from-transparent via-dry-bank to-transparent opacity-40" />
            <div className="w-2 h-2 rounded-full bg-dry-bank opacity-30" />
            <div className="w-[2px] h-16 bg-gradient-to-b from-transparent via-dry-bank to-transparent opacity-25" />
          </div>
          <p className="text-center text-text-2 text-sm font-medium">
            Your river starts here
          </p>
        </div>

        <QuoteCard
          quote={{
            text: "Do you have the patience to wait until your mud settles and the water is clear?",
            author: "Lao Tzu",
            source: "Tao Te Ching",
          }}
        />
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1">Your River</h1>
        <div className="flex items-center gap-3 text-text-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-water-3" />
            {formatHours(totalMinutes)}
          </span>
          <span>{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
          <span>{daysSinceFirst} day{daysSinceFirst !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Full river visualization */}
      <div className="mb-6">
        <RiverSVG sessions={sessions} />
      </div>

      {/* Weekly progress — Apple Health ring style */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0">
            <ProgressRing progress={weekProgress} size={80} strokeWidth={8} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-2">
              This Week
            </h3>
            <p className="text-text font-bold text-2xl leading-tight">
              {formatDuration(weekStats.totalMinutes)}
            </p>
            <p className="text-text-3 text-xs mt-1">
              of {formatDuration(settings.weekly_goal_minutes)} goal
              {weekProgress >= 1 && (
                <span className="text-water-4 font-medium ml-1">
                  {'\u2713'} Complete
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Weekly breakdown */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-card-border">
          <div className="text-center">
            <p className="text-text font-semibold text-sm">{weekStats.sessionCount}</p>
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-0.5">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-text font-semibold text-sm">{formatDuration(weekStats.dailyAvg)}</p>
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-0.5">Daily Avg</p>
          </div>
          <div className="text-center">
            <p className="text-text font-semibold text-sm">{weekStats.activeDays || 0}</p>
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-0.5">Active Days</p>
          </div>
        </div>
      </div>

      {/* Personal bests */}
      <div className="mb-6">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3 px-1">
          Personal Bests
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-3 text-center">
            <div className="text-amber text-lg mb-1">{'\u{1F3AF}'}</div>
            <p className="text-text font-bold text-base leading-tight">
              {formatDuration(bests.longestSession)}
            </p>
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-1">
              Longest
            </p>
          </div>
          <div className="card p-3 text-center">
            <div className="text-amber text-lg mb-1">{'\u{1F525}'}</div>
            <p className="text-text font-bold text-base leading-tight">
              {bests.longestStreak}d
            </p>
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-1">
              Best Flow
            </p>
          </div>
          <div className="card p-3 text-center">
            <div className="text-amber text-lg mb-1">{'\u26A1'}</div>
            <p className="text-text font-bold text-base leading-tight">
              {formatDuration(bests.bestWeek)}
            </p>
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-1">
              Best Week
            </p>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="mb-4">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3 px-1">
          Words to Practice By
        </h3>
        <QuoteCard
          quote={getQuoteByCategory('systems', 'growth')}
          showRefresh
        />
      </div>
    </div>
  );
}
