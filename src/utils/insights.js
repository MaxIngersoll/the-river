import {
  today,
  addDays,
  daysBetween,
  getTotalMinutes,
  getSessionsByDate,
  calculateStreak,
  getWeekStats,
  getSettings,
  getPersonalBests,
  formatDuration,
} from './storage';

const INSIGHT_STORAGE_KEY = 'river-last-insight';

function getLastShown() {
  try {
    const raw = localStorage.getItem(INSIGHT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { type: null, date: null };
  } catch {
    return { type: null, date: null };
  }
}

function setLastShown(type) {
  localStorage.setItem(INSIGHT_STORAGE_KEY, JSON.stringify({ type, date: today() }));
}

// ─── Insight generators ───
// Each returns null if not applicable, or { type, emoji, headline, body, priority }

function streakMomentum(sessions) {
  const streak = calculateStreak(sessions);
  if (streak.current === 0) return null;

  if (streak.current >= streak.longest && streak.current >= 3) {
    return {
      type: 'streak-record',
      emoji: '🔥',
      headline: `${streak.current} days flowing`,
      body: `This is your longest streak ever. Every day you show up, the river runs deeper.`,
      priority: 10,
    };
  }

  if (streak.current >= 3 && streak.longest > streak.current) {
    const gap = streak.longest - streak.current;
    return {
      type: 'streak-chase',
      emoji: '🌊',
      headline: `${streak.current} days and building`,
      body: gap <= 3
        ? `${gap} more day${gap === 1 ? '' : 's'} to match your record of ${streak.longest}. You're close.`
        : `Your record is ${streak.longest} days. This streak has momentum.`,
      priority: 8,
    };
  }

  if (streak.current >= 2) {
    return {
      type: 'streak-building',
      emoji: '💧',
      headline: `${streak.current} days in a row`,
      body: `The current is picking up. Keep it flowing.`,
      priority: 5,
    };
  }

  return null;
}

function weekComparison(sessions) {
  const todayStr = today();
  const todayDate = new Date(todayStr + 'T12:00:00');
  const dayOfWeek = todayDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const thisMonday = addDays(todayStr, mondayOffset);
  const lastMonday = addDays(thisMonday, -7);
  const lastSunday = addDays(thisMonday, -1);

  const thisWeekMins = sessions
    .filter(s => s.date >= thisMonday && s.date <= todayStr)
    .reduce((sum, s) => sum + s.duration_minutes, 0);

  const lastWeekMins = sessions
    .filter(s => s.date >= lastMonday && s.date <= lastSunday)
    .reduce((sum, s) => sum + s.duration_minutes, 0);

  if (lastWeekMins === 0 || thisWeekMins === 0) return null;

  const pctChange = Math.round(((thisWeekMins - lastWeekMins) / lastWeekMins) * 100);

  if (pctChange >= 20) {
    return {
      type: 'week-up',
      emoji: '📈',
      headline: `${pctChange}% more this week`,
      body: `Your river is swelling. ${formatDuration(thisWeekMins)} so far, up from ${formatDuration(lastWeekMins)} last week.`,
      priority: 7,
    };
  }

  if (pctChange <= -30) {
    // Frame as invitation, not guilt
    return {
      type: 'week-down',
      emoji: '🌱',
      headline: `Quieter week so far`,
      body: `${formatDuration(thisWeekMins)} this week. Even a short session today would feed the river.`,
      priority: 4,
    };
  }

  return null;
}

function droughtAwareness(sessions) {
  if (sessions.length === 0) return null;

  const byDate = getSessionsByDate(sessions);
  const todayStr = today();

  // Check if practiced today
  if (byDate[todayStr]) return null;

  // Count dry days
  let dryDays = 0;
  let checkDate = addDays(todayStr, -1);
  while (!byDate[checkDate] && dryDays < 30) {
    dryDays++;
    checkDate = addDays(checkDate, -1);
  }

  if (dryDays >= 3 && dryDays < 7) {
    return {
      type: 'drought-short',
      emoji: '🏜️',
      headline: `${dryDays + 1} days since your last session`,
      body: `The riverbed is drying. One session is all it takes to start the flow again.`,
      priority: 6,
    };
  }

  if (dryDays >= 7) {
    return {
      type: 'drought-long',
      emoji: '🌧️',
      headline: `Your river misses you`,
      body: `It's been ${dryDays + 1} days. Every river has dry seasons. The rain always comes back.`,
      priority: 9,
    };
  }

  return null;
}

function personalBestAlert(sessions) {
  if (sessions.length < 3) return null;

  const todayStr = today();
  const yesterdayStr = addDays(todayStr, -1);
  const byDate = getSessionsByDate(sessions);

  // Check yesterday's sessions for personal bests (today's are too immediate)
  const recentDate = byDate[todayStr] ? todayStr : yesterdayStr;
  const recentSessions = byDate[recentDate];
  if (!recentSessions) return null;

  const recentMax = Math.max(...recentSessions.map(s => s.duration_minutes));

  // Compare to all other sessions
  const otherSessions = sessions.filter(s => s.date !== recentDate);
  if (otherSessions.length === 0) return null;
  const previousMax = Math.max(...otherSessions.map(s => s.duration_minutes));

  if (recentMax > previousMax) {
    return {
      type: 'personal-best',
      emoji: '⭐',
      headline: `New personal best`,
      body: `${formatDuration(recentMax)} — your longest session ever. The river surges.`,
      priority: 9,
    };
  }

  // Check if recent session is in top 3
  const allMaxes = sessions.map(s => s.duration_minutes).sort((a, b) => b - a);
  if (allMaxes.length >= 5 && recentMax >= allMaxes[2]) {
    return {
      type: 'top-session',
      emoji: '💪',
      headline: `${formatDuration(recentMax)} — a strong session`,
      body: `That's one of your top three longest ever. Deep water.`,
      priority: 6,
    };
  }

  return null;
}

function totalMilestoneNearing(sessions) {
  const totalHours = getTotalMinutes(sessions) / 60;
  const milestones = [10, 25, 50, 100, 200, 500];

  for (const m of milestones) {
    const remaining = m - totalHours;
    if (remaining > 0 && remaining <= m * 0.15) {
      const remainingMins = Math.round(remaining * 60);
      return {
        type: 'milestone-near',
        emoji: '🎯',
        headline: `${formatDuration(remainingMins)} from ${m} hours`,
        body: `Your river is approaching a new depth. Keep flowing.`,
        priority: 7,
      };
    }
  }

  return null;
}

function weeklyGoalPacing(sessions) {
  const settings = getSettings();
  const goal = settings.weekly_goal_minutes;
  if (!goal || goal <= 0) return null;

  const week = getWeekStats(sessions);
  const progress = week.totalMinutes / goal;
  const todayDate = new Date(today() + 'T12:00:00');
  const dayOfWeek = todayDate.getDay();
  const daysLeft = dayOfWeek === 0 ? 1 : 7 - dayOfWeek + 1; // days remaining including today
  const remaining = goal - week.totalMinutes;

  if (progress >= 1) {
    return {
      type: 'goal-complete',
      emoji: '✅',
      headline: `Weekly goal complete!`,
      body: `${formatDuration(week.totalMinutes)} this week — ${formatDuration(week.totalMinutes - goal)} over your ${formatDuration(goal)} goal.`,
      priority: 8,
    };
  }

  if (remaining > 0 && daysLeft > 0) {
    const dailyNeeded = Math.ceil(remaining / daysLeft);
    if (progress >= 0.7) {
      return {
        type: 'goal-close',
        emoji: '🎯',
        headline: `${formatDuration(remaining)} to hit your goal`,
        body: `${formatDuration(dailyNeeded)} per day for the rest of the week. You're almost there.`,
        priority: 7,
      };
    }
    if (progress >= 0.3 && progress < 0.7) {
      return {
        type: 'goal-pace',
        emoji: '💧',
        headline: `${Math.round(progress * 100)}% of your weekly goal`,
        body: `${formatDuration(dailyNeeded)} a day will get you there. Small drops add up.`,
        priority: 5,
      };
    }
  }

  return null;
}

function tagVariety(sessions) {
  // Look at last 14 days of sessions with tags
  const todayStr = today();
  const twoWeeksAgo = addDays(todayStr, -14);
  const recent = sessions.filter(s => s.date >= twoWeeksAgo && Array.isArray(s.tags) && s.tags.length > 0);

  if (recent.length < 5) return null;

  // Count tag frequency
  const counts = {};
  for (const s of recent) {
    for (const tag of s.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length < 2) return null;

  const [topTag, topCount] = entries[0];
  const totalTagged = recent.length;
  const ratio = topCount / totalTagged;

  if (ratio >= 0.7 && totalTagged >= 5) {
    const others = entries.slice(1).map(([t]) => t);
    const suggestion = others[Math.floor(Math.random() * others.length)];
    return {
      type: 'tag-variety',
      emoji: '\u{1F3B2}',
      headline: `Mostly ${topTag} lately`,
      body: `${Math.round(ratio * 100)}% of recent sessions. Maybe sprinkle in some ${suggestion}?`,
      priority: 4,
    };
  }

  return null;
}

// ─── Main export ───

export function getTopInsight(sessions) {
  if (sessions.length === 0) return null;

  const generators = [
    streakMomentum,
    weekComparison,
    weeklyGoalPacing,
    droughtAwareness,
    personalBestAlert,
    totalMilestoneNearing,
    tagVariety,
  ];

  const insights = generators
    .map(fn => fn(sessions))
    .filter(Boolean)
    .sort((a, b) => b.priority - a.priority);

  if (insights.length === 0) return null;

  // Try to avoid showing the same type twice in a row
  const lastShown = getLastShown();
  const todayStr = today();

  if (lastShown.date === todayStr && insights.length > 1) {
    const different = insights.find(i => i.type !== lastShown.type);
    if (different) return different;
  }

  return insights[0];
}

// Call this after rendering to persist which insight was shown
export function markInsightShown(type) {
  setLastShown(type);
}
