import { useState, useMemo, useCallback } from 'react';
import {
  getTotalMinutes,
  formatHours,
  formatDuration,
  formatDate,
  getWeekStats,
  getPersonalBests,
  getSettings,
  getMilestones,
  getSessionsByDate,
  daysBetween,
  today,
  TAG_COLORS,
} from '../utils/storage';
import { getQuoteByCategory } from '../utils/quotes';
import QuoteCard from './QuoteCard';
import RiverSVG from './RiverSVG';
import ProgressRing from './ProgressRing';
import ShareCard from './ShareCard';

export default function StatsPage({ sessions, onSessionUpdate, onSessionDelete, embedded }) {
  const [showShare, setShowShare] = useState(false);
  const settings = getSettings();
  const hasSessions = sessions.length > 0;

  const { totalMinutes, weekStats, bests, daysSinceFirst, weekProgress } = useMemo(() => {
    const total = getTotalMinutes(sessions);
    const week = getWeekStats(sessions);
    const pb = getPersonalBests(sessions);
    const daysFirst = settings.first_session_date
      ? daysBetween(settings.first_session_date, today()) + 1
      : 0;
    const wp = settings.weekly_goal_minutes > 0 ? Math.min(week.totalMinutes / settings.weekly_goal_minutes, 1) : 0;
    return { totalMinutes: total, weekStats: week, bests: pb, daysSinceFirst: daysFirst, weekProgress: wp };
  }, [sessions, settings.first_session_date, settings.weekly_goal_minutes]);

  // Empty state — skip when embedded (parent handles empty)
  if (!hasSessions) {
    if (embedded) return null;
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
    <div className={embedded ? "px-5 pb-24 max-w-lg mx-auto relative z-10" : "px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10"}>
      {/* Header — hidden when embedded in River tab */}
      {!embedded && (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text mb-1">Your River</h1>
          <button
            onClick={() => setShowShare(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-dry/60 transition-colors text-text-3"
            aria-label="Share your river"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 text-text-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-water-3" />
            {formatHours(totalMinutes)}
          </span>
          <span>{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
          <span>{daysSinceFirst} day{daysSinceFirst !== 1 ? 's' : ''}</span>
        </div>
      </div>
      )}

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

      {/* Milestones trophy case */}
      <MilestoneWall />

      {/* Session History */}
      <SessionHistory
        sessions={sessions}
        onUpdate={onSessionUpdate}
        onDelete={onSessionDelete}
      />

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

      {/* Share overlay */}
      {showShare && (
        <ShareCard sessions={sessions} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

// ─── Milestones Trophy Case ───

function MilestoneWall() {
  const milestones = getMilestones();

  const sorted = useMemo(() =>
    [...milestones].sort((a, b) =>
      (b.unlocked_at || '').localeCompare(a.unlocked_at || '')
    ),
    [milestones]
  );

  if (sorted.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3 px-1">
          Milestones
        </h3>
        <div className="card p-5 text-center">
          <p className="text-text-3 text-sm italic">
            Your first milestone awaits just around the bend...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3 px-1">
        Milestones
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {sorted.map((m) => (
          <div key={m.id} className="card p-3 text-center">
            <div className="text-2xl mb-1">{m.emoji}</div>
            <p className="text-text font-semibold text-[11px] leading-tight">{m.label}</p>
            {m.unlocked_at && (
              <p className="text-text-3 text-[9px] mt-1">
                {new Date(m.unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Session History Browser ───

function SessionHistory({ sessions, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const groupedDates = useMemo(() => {
    const filtered = searchQuery.trim()
      ? sessions.filter(s => {
          const q = searchQuery.toLowerCase();
          return (s.note && s.note.toLowerCase().includes(q)) ||
                 (Array.isArray(s.tags) && s.tags.some(t => t.toLowerCase().includes(q)));
        })
      : sessions;
    const byDate = getSessionsByDate(filtered);
    return Object.keys(byDate)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({
        date,
        label: formatDate(date),
        sessions: byDate[date],
        total: byDate[date].reduce((sum, s) => sum + s.duration_minutes, 0),
      }));
  }, [sessions, searchQuery]);

  const PAGE_SIZE = 10;
  const visibleDates = expanded ? groupedDates : groupedDates.slice(0, PAGE_SIZE);

  const startEdit = useCallback((session) => {
    setEditingId(session.id);
    setEditNote(session.note || '');
    setEditDuration(String(session.duration_minutes));
    setConfirmDeleteId(null);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingId && onUpdate) {
      const mins = Math.min(480, Math.max(1, parseInt(editDuration, 10) || 1));
      onUpdate(editingId, { note: editNote.trim(), duration_minutes: mins });
      setEditingId(null);
      setEditNote('');
      setEditDuration('');
    }
  }, [editingId, editNote, editDuration, onUpdate]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditNote('');
    setConfirmDeleteId(null);
  }, []);

  const handleDelete = useCallback((id) => {
    if (confirmDeleteId === id) {
      if (onDelete) onDelete(id);
      setConfirmDeleteId(null);
      setEditingId(null);
    } else {
      setConfirmDeleteId(id);
    }
  }, [confirmDeleteId, onDelete]);

  if (groupedDates.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3 px-1">
        Session History
      </h3>

      {/* Search bar */}
      {sessions.length > 5 && (
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setExpanded(false); }}
            placeholder="Search notes..."
            className="glass-input w-full px-3 py-2 text-xs text-text placeholder-text-3"
            aria-label="Search session notes"
          />
        </div>
      )}

      <div className="space-y-2">
        {visibleDates.map(({ date, label, sessions: daySessions, total }) => (
          <div key={date} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text font-semibold text-sm">{label}</span>
              <span className="text-text-3 text-xs">{formatDuration(total)}</span>
            </div>
            <div className="space-y-2">
              {daySessions.map((s) => (
                <div key={s.id}>
                  {editingId === s.id ? (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-6 rounded-full bg-water-3 opacity-60 flex-shrink-0" />
                        <input
                          type="number"
                          value={editDuration}
                          onChange={(e) => setEditDuration(e.target.value)}
                          min="1"
                          max="480"
                          className="glass-input w-16 px-2 py-1 text-xs text-text font-medium text-center"
                          aria-label="Duration in minutes"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                        <span className="text-text-3 text-[10px]">min</span>
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
                    <button
                      onClick={() => startEdit(s)}
                      className="flex items-center gap-2 w-full text-left rounded-lg -mx-1 px-1 py-1 hover:bg-dry/40 transition-colors group"
                    >
                      <div className="w-1 h-6 rounded-full bg-water-3 opacity-60 flex-shrink-0" />
                      <span className="text-text-2 text-xs font-medium">
                        {formatDuration(s.duration_minutes)}
                      </span>
                      {Array.isArray(s.tags) && s.tags.length > 0 && (
                        <div className="flex gap-1 flex-shrink-0">
                          {s.tags.map(tag => (
                            <span
                              key={tag}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: TAG_COLORS[tag] || 'var(--color-text-3)' }}
                              title={tag}
                            />
                          ))}
                        </div>
                      )}
                      {s.note && (
                        <span className="text-text-3 text-xs truncate">
                          {s.note}
                        </span>
                      )}
                      <div className="flex-1" />
                      <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none"
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
        ))}
      </div>

      {groupedDates.length > PAGE_SIZE && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 py-2.5 rounded-full text-xs font-medium text-text-3 hover:text-text-2 transition-colors"
        >
          {expanded
            ? 'Show less'
            : `Show all ${groupedDates.length} days`
          }
        </button>
      )}
    </div>
  );
}
