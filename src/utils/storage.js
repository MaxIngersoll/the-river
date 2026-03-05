const STORAGE_KEY = 'river-practice-data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDefaultData() {
  return {
    sessions: [],
    milestones: [],
    settings: {
      weekly_goal_minutes: 300,
      first_session_date: null,
    },
  };
}

export function getData() {
  return loadData() || getDefaultData();
}

export function setData(data) {
  saveData(data);
}

export function addSession(session) {
  const data = getData();
  const newSession = {
    id: crypto.randomUUID(),
    date: session.date,
    duration_minutes: session.duration_minutes,
    note: session.note || '',
    created_at: new Date().toISOString(),
  };
  data.sessions.push(newSession);
  if (!data.settings.first_session_date || session.date < data.settings.first_session_date) {
    data.settings.first_session_date = session.date;
  }
  setData(data);
  return newSession;
}

export function getSessions() {
  return getData().sessions;
}

export function getSettings() {
  return getData().settings;
}

export function getMilestones() {
  return getData().milestones;
}

export function setMilestones(milestones) {
  const data = getData();
  data.milestones = milestones;
  setData(data);
}

export function updateSettings(updates) {
  const data = getData();
  data.settings = { ...data.settings, ...updates };
  setData(data);
  return data.settings;
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}

// Date helpers
export function today() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// Stats helpers
export function getTotalMinutes(sessions) {
  return sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
}

export function getTotalHours(sessions) {
  return getTotalMinutes(sessions) / 60;
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatHours(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0 && m === 0) return '0h 0m';
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h} hours`;
  return `${h}h ${m}m`;
}

export function getSessionsByDate(sessions) {
  const map = {};
  for (const s of sessions) {
    if (!map[s.date]) map[s.date] = [];
    map[s.date].push(s);
  }
  return map;
}

export function getMinutesForDate(sessions, date) {
  return sessions
    .filter(s => s.date === date)
    .reduce((sum, s) => sum + s.duration_minutes, 0);
}

// Streak calculation
export function calculateStreak(sessions) {
  if (sessions.length === 0) return { current: 0, longest: 0 };

  const byDate = getSessionsByDate(sessions);
  const todayStr = today();
  const yesterdayStr = addDays(todayStr, -1);

  // Current streak: count back from today or yesterday
  let current = 0;
  let startDate = todayStr;

  if (byDate[todayStr]) {
    startDate = todayStr;
  } else if (byDate[yesterdayStr]) {
    startDate = yesterdayStr;
  } else {
    // No practice today or yesterday
    return { current: 0, longest: calculateLongestStreak(byDate) };
  }

  let checkDate = startDate;
  while (byDate[checkDate]) {
    current++;
    checkDate = addDays(checkDate, -1);
  }

  return { current, longest: Math.max(current, calculateLongestStreak(byDate)) };
}

function calculateLongestStreak(byDate) {
  const dates = Object.keys(byDate).sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) === 1) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 1;
    }
  }
  return longest;
}

// River helpers
export function getWaterWidth(minutes) {
  if (minutes === 0) return 0;
  if (minutes <= 10) return 15;
  if (minutes <= 20) return 25;
  if (minutes <= 30) return 35;
  if (minutes <= 45) return 50;
  if (minutes <= 60) return 65;
  if (minutes <= 90) return 75;
  return 85;
}

export function getWaterColor(totalHours) {
  if (totalHours < 10) return 'var(--color-water-1)';
  if (totalHours < 50) return 'var(--color-water-2)';
  if (totalHours < 100) return 'var(--color-water-3)';
  if (totalHours < 200) return 'var(--color-water-4)';
  return 'var(--color-water-5)';
}

// Week stats
export function getWeekStats(sessions) {
  const todayStr = today();
  const todayDate = new Date(todayStr + 'T12:00:00');
  const dayOfWeek = todayDate.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = addDays(todayStr, mondayOffset);

  const weekSessions = sessions.filter(s => s.date >= monday && s.date <= todayStr);
  const totalMinutes = getTotalMinutes(weekSessions);
  const sessionCount = weekSessions.length;
  const daysWithPractice = new Set(weekSessions.map(s => s.date)).size;
  const dailyAvg = daysWithPractice > 0 ? Math.round(totalMinutes / daysWithPractice) : 0;

  return { totalMinutes, sessionCount, dailyAvg, activeDays: daysWithPractice };
}

// Personal bests
export function getPersonalBests(sessions) {
  if (sessions.length === 0) {
    return { longestSession: 0, longestStreak: 0, bestWeek: 0 };
  }

  const longestSession = Math.max(...sessions.map(s => s.duration_minutes));
  const byDate = getSessionsByDate(sessions);
  const longestStreak = calculateLongestStreak(byDate);

  // Best week: find the 7-day window with most minutes
  const dates = Object.keys(byDate).sort();
  let bestWeek = 0;
  if (dates.length > 0) {
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    let windowStart = firstDate;
    while (windowStart <= lastDate) {
      const windowEnd = addDays(windowStart, 6);
      const windowMinutes = sessions
        .filter(s => s.date >= windowStart && s.date <= windowEnd)
        .reduce((sum, s) => sum + s.duration_minutes, 0);
      bestWeek = Math.max(bestWeek, windowMinutes);
      windowStart = addDays(windowStart, 1);
    }
  }

  return { longestSession, longestStreak, bestWeek };
}
