import { useMemo, useState, useCallback, useRef } from 'react';
import {
  getTotalMinutes,
  formatHours,
  formatDuration,
  calculateStreak,
  getWeekStats,
  getSettings,
  today,
  TAG_COLORS,
  PRACTICE_TAGS,
} from '../utils/storage';
import { getDailyQuoteCached } from '../utils/quotes';
import { todayIsFogDay } from '../utils/fogHorn';
import QuoteCard from './QuoteCard';
import InsightCard from './InsightCard';
import SignalFireCard from './SignalFireCard';
import RiverSVG from './RiverSVG';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'The river flows in stillness';
  if (h < 12) return 'Morning dew on the strings';
  if (h < 17) return 'The afternoon current calls';
  if (h < 21) return 'Evening tide is yours';
  return 'Night waters run deep';
}

function getLastPracticedText(sessions, todayStr) {
  if (sessions.length === 0) return null;
  // Find most recent session by created_at or date
  const sorted = [...sessions].sort((a, b) => (b.created_at || b.date).localeCompare(a.created_at || a.date));
  const last = sorted[0];
  if (last.date === todayStr) {
    // How many hours ago?
    if (last.created_at) {
      const hoursAgo = Math.floor((Date.now() - new Date(last.created_at).getTime()) / 3600000);
      if (hoursAgo < 1) return 'Just now';
      if (hoursAgo === 1) return '1 hour ago';
      if (hoursAgo < 12) return `${hoursAgo} hours ago`;
    }
    return 'Today';
  }
  const daysAgo = Math.round((new Date(todayStr + 'T12:00:00') - new Date(last.date + 'T12:00:00')) / 86400000);
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 7) return `${daysAgo} days ago`;
  return `${Math.floor(daysAgo / 7)} week${Math.floor(daysAgo / 7) === 1 ? '' : 's'} ago`;
}

export default function HomePage({ sessions, onNavigate, onSessionUpdate, onSessionDelete, onFogHorn, signalFireNote, onSignalFireDismiss }) {
  const todayStr = today();
  const dailyQuote = getDailyQuoteCached();
  const hasSessions = sessions.length > 0;

  const settings = getSettings();

  const { totalMinutes, streak, todaySessions, todayMinutes, weekStats, weekProgress } = useMemo(() => {
    const total = getTotalMinutes(sessions);
    const s = calculateStreak(sessions);
    const todays = sessions.filter((x) => x.date === todayStr && !x.fog);
    const todayMins = todays.reduce((sum, x) => sum + x.duration_minutes, 0);
    const week = getWeekStats(sessions);
    const wp = settings.weekly_goal_minutes > 0 ? Math.min(week.totalMinutes / settings.weekly_goal_minutes, 1) : 0;
    return { totalMinutes: total, streak: s, todaySessions: todays, todayMinutes: todayMins, weekStats: week, weekProgress: wp };
  }, [sessions, todayStr, settings.weekly_goal_minutes]);

  const todayIsFog = useMemo(() => todayIsFogDay(sessions), [sessions]);

  // Long-press fog horn handler
  const longPressTimer = useRef(null);
  const handlePressStart = useCallback((e) => {
    if (todayMinutes > 0 || todayIsFog) return; // only on dry days with no practice
    e.preventDefault();
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      onFogHorn?.();
    }, 600);
  }, [todayMinutes, todayIsFog, onFogHorn]);
  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

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
            background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
            color: 'white',
            boxShadow: '0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
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
          {getGreeting()}
        </p>
        <h1 className="text-[64px] font-bold text-text leading-none tracking-tight">
          {formatHours(totalMinutes)}
        </h1>
        {(() => {
          const lastText = getLastPracticedText(sessions, todayStr);
          return lastText ? (
            <p className="text-text-3 text-[10px] uppercase tracking-wider mt-2">
              Last practiced: {lastText}
            </p>
          ) : null;
        })()}
      </div>

      {/* Flow status pill — glassy, long-press for fog horn */}
      <div className="flex justify-center mb-8">
        {streak.current > 0 ? (
          <div
            className={`flow-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full select-none ${
              todayIsFog ? 'bg-dry/30' : todayMinutes === 0 ? 'bg-amber/15' : 'bg-water-1/20'
            }`}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse-glow ${
              todayIsFog ? 'bg-dry-bank' : todayMinutes === 0 ? 'bg-amber' : 'bg-water-4'
            }`} />
            <span className={`font-semibold text-sm ${
              todayIsFog ? 'text-text-3' : todayMinutes === 0 ? 'text-amber' : 'text-water-5'
            }`}>
              {todayIsFog
                ? `${streak.current} day flow \u{1F32B}\u{FE0F}`
                : `${streak.current} day flow ${todayMinutes === 0 ? '\u23F3' : streak.current >= 30 ? '\u{1F525}' : streak.current >= 7 ? '\u2728' : ''}`
              }
            </span>
          </div>
        ) : (
          <div
            className="flow-pill-dry inline-flex items-center gap-2 bg-dry/40 px-4 py-1.5 rounded-full select-none"
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="w-2 h-2 rounded-full bg-dry-bank" />
            <span className="text-text-3 font-medium text-sm">
              {streak.longest > 0
                ? `Record: ${streak.longest}d — start a new flow`
                : 'Start a new flow'
              }
            </span>
          </div>
        )}
      </div>

      {/* Evening nudge — gentle reminder if no practice today after 6pm (suppressed on fog days) */}
      {todayMinutes === 0 && !todayIsFog && new Date().getHours() >= 18 && (
        <p className="text-center text-text-3 text-xs italic mb-4 animate-fade-in">
          There&apos;s still time to add to your river today
        </p>
      )}

      {/* Today's stats row — staggered glass capsules */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { value: todayMinutes > 0 ? formatDuration(todayMinutes) : '—', label: 'Today' },
          { value: streak.current, label: 'Streak' },
          { value: `${Math.round(weekProgress * 100)}%`, label: 'Week Goal' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="card p-3 text-center opacity-0"
            style={{ animation: `fade-in-up 0.4s ease-out ${0.1 + i * 0.08}s forwards` }}
          >
            <p className={`font-bold text-lg leading-tight ${
              stat.label === 'Week Goal' && weekProgress >= 1 ? 'text-water-4' : 'text-text'
            }`}>
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

      {/* Signal Fire or Weekly insight */}
      {signalFireNote ? (
        <SignalFireCard note={signalFireNote} onDismiss={onSignalFireDismiss} />
      ) : (
        <InsightCard sessions={sessions} />
      )}

      {/* Daily quote */}
      <div className="mb-6">
        <QuoteCard quote={dailyQuote} />
      </div>

      {/* Today's sessions */}
      {todaySessions.length > 0 && (
        <TodaySessions
          sessions={todaySessions}
          onUpdate={onSessionUpdate}
          onDelete={onSessionDelete}
        />
      )}
    </div>
  );
}

// ─── Inline editable session list ───

function TodaySessions({ sessions, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const startEdit = useCallback((session) => {
    setEditingId(session.id);
    setEditNote(session.note || '');
    setEditDuration(String(session.duration_minutes));
    setEditTags(Array.isArray(session.tags) ? [...session.tags] : []);
    setConfirmDeleteId(null);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingId) {
      const mins = Math.min(480, Math.max(1, parseInt(editDuration, 10) || 1));
      onUpdate(editingId, { note: editNote.trim(), duration_minutes: mins, tags: editTags });
      setEditingId(null);
      setEditNote('');
      setEditDuration('');
      setEditTags([]);
    }
  }, [editingId, editNote, editDuration, editTags, onUpdate]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditNote('');
    setConfirmDeleteId(null);
  }, []);

  const handleDelete = useCallback((id) => {
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
      setEditingId(null);
    } else {
      setConfirmDeleteId(id);
    }
  }, [confirmDeleteId, onDelete]);

  return (
    <div className="card p-4">
      <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3">
        Today&apos;s Sessions
      </h3>
      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id}>
            {editingId === s.id ? (
              /* Edit mode */
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-8 rounded-full bg-water-3 opacity-60 flex-shrink-0" />
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    min="1"
                    max="480"
                    className="glass-input w-16 px-2 py-1 text-sm text-text font-semibold text-center"
                    aria-label="Duration in minutes"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <span className="text-text-3 text-xs">min</span>
                </div>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Add a note..."
                  maxLength={280}
                  className="glass-input w-full px-3 py-2 text-xs text-text placeholder-text-3 mb-2"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  aria-label="Edit session note"
                />
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRACTICE_TAGS.map(tag => {
                    const active = editTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setEditTags(prev =>
                          active ? prev.filter(t => t !== tag) : [...prev, tag]
                        )}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                          active ? 'text-white' : 'text-text-3'
                        }`}
                        style={active ? {
                          background: TAG_COLORS[tag] || 'var(--color-water-3)',
                        } : {
                          background: 'rgba(128,128,128,0.1)',
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white active:scale-[0.95] transition-all"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium text-text-3 active:scale-[0.95] transition-all"
                  >
                    Cancel
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleDelete(s.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium active:scale-[0.95] transition-all ${
                      confirmDeleteId === s.id
                        ? 'bg-coral text-white'
                        : 'text-coral'
                    }`}
                  >
                    {confirmDeleteId === s.id ? 'Confirm' : 'Delete'}
                  </button>
                </div>
              </div>
            ) : (
              /* View mode — tap to edit */
              <button
                onClick={() => startEdit(s)}
                className="flex items-center gap-3 w-full text-left rounded-xl -mx-1 px-1 py-1 hover:bg-dry/40 transition-colors group"
              >
                <div className="w-1 h-8 rounded-full bg-water-3 opacity-60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-text font-semibold text-sm">
                      {formatDuration(s.duration_minutes)}
                    </span>
                    {Array.isArray(s.tags) && s.tags.length > 0 && (
                      <div className="flex gap-1">
                        {s.tags.map(tag => (
                          <span
                            key={tag}
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: TAG_COLORS[tag] || 'var(--color-text-3)' }}
                            title={tag}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {s.note && (
                    <p className="text-text-3 text-xs truncate mt-0.5">
                      {s.note}
                    </p>
                  )}
                </div>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-text-3 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
