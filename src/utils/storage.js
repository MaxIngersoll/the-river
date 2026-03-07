const STORAGE_KEY = 'river-practice-data';

// In-memory cache to avoid repeated JSON.parse on every getData() call
let _dataCache = null;

export const PRACTICE_TAGS = ['Technique', 'Songs', 'Theory', 'Improv', 'Ear Training'];

export const TAG_COLORS = {
  'Technique': 'var(--color-water-3)',
  'Songs': 'var(--color-coral)',
  'Theory': 'var(--color-lavender)',
  'Improv': 'var(--color-amber)',
  'Ear Training': 'var(--color-forest)',
};

export function isValidSession(s) {
  return (
    s &&
    typeof s === 'object' &&
    typeof s.id === 'string' &&
    typeof s.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
    typeof s.duration_minutes === 'number' &&
    s.duration_minutes > 0 &&
    s.duration_minutes <= 1440
  );
}

export function isFogSession(s) {
  return (
    s &&
    typeof s === 'object' &&
    typeof s.id === 'string' &&
    typeof s.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
    s.fog === true &&
    s.duration_minutes === 0
  );
}

function loadData() {
  if (_dataCache) return _dataCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;

    // Validate and filter sessions
    if (Array.isArray(data.sessions)) {
      const before = data.sessions.length;
      data.sessions = data.sessions.filter(s => isValidSession(s) || isFogSession(s));
      if (data.sessions.length < before) {
        console.warn(`[River] Dropped ${before - data.sessions.length} corrupt session(s)`);
        saveData(data);
      }
    } else {
      data.sessions = [];
    }

    // Ensure settings exist
    if (!data.settings || typeof data.settings !== 'object') {
      data.settings = { weekly_goal_minutes: 300, first_session_date: null };
    }
    if (!Array.isArray(data.milestones)) {
      data.milestones = [];
    }
    if (!data.source || typeof data.source !== 'object') {
      data.source = { answer: null, answered_at: null, margin_notes: [], readings_completed: [] };
    }

    _dataCache = data;
    return data;
  } catch {
    console.warn('[River] localStorage data corrupted, resetting');
    return null;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    _dataCache = data;
  } catch (e) {
    console.error('[River] Failed to save data:', e.message);
    return false;
  }
  return true;
}

function getDefaultData() {
  return {
    sessions: [],
    milestones: [],
    settings: {
      weekly_goal_minutes: 300,
      first_session_date: null,
    },
    source: {
      answer: null,
      answered_at: null,
      margin_notes: [],
      readings_completed: [],
    },
  };
}

export function getData() {
  return loadData() || getDefaultData();
}

// Shotwell: "If localStorage corrupts, how do you know?"
export function getStorageHealth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, sessions: 0, bytes: 0, pctFull: 0 };
    const bytes = new Blob([raw]).size;
    const data = JSON.parse(raw);
    const sessions = Array.isArray(data.sessions) ? data.sessions.length : 0;
    return { ok: true, sessions, bytes, pctFull: Math.round((bytes / 5_000_000) * 100) };
  } catch {
    return { ok: false, error: 'corrupt', sessions: 0, bytes: 0, pctFull: 0 };
  }
}

export function setData(data) {
  saveData(data);
}

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function addSession(session) {
  const data = getData();
  const newSession = {
    id: generateId(),
    date: session.date,
    duration_minutes: session.duration_minutes,
    note: session.note || '',
    tags: Array.isArray(session.tags) ? session.tags : [],
    fog: session.fog || false,
    instrument: session.instrument || 'guitar',
    created_at: new Date().toISOString(),
  };
  data.sessions.push(newSession);
  if (!data.settings.first_session_date || session.date < data.settings.first_session_date) {
    data.settings.first_session_date = session.date;
  }
  setData(data);
  return newSession;
}

export function updateSession(id, updates) {
  const data = getData();
  const idx = data.sessions.findIndex(s => s.id === id);
  if (idx === -1) return null;
  data.sessions[idx] = { ...data.sessions[idx], ...updates };
  setData(data);
  return data.sessions[idx];
}

export function deleteSession(id) {
  const data = getData();
  data.sessions = data.sessions.filter(s => s.id !== id);
  // Recalculate first_session_date
  if (data.sessions.length > 0) {
    const dates = data.sessions.map(s => s.date).sort();
    data.settings.first_session_date = dates[0];
  } else {
    data.settings.first_session_date = null;
  }
  setData(data);
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
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
  _dataCache = null;
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
  const d1 = new Date(dateStr1 + 'T12:00:00');
  const d2 = new Date(dateStr2 + 'T12:00:00');
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

  const weekSessions = sessions.filter(s => s.date >= monday && s.date <= todayStr && !s.fog);
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

  // Best week: 7-day sliding window using daily totals map
  const dates = Object.keys(byDate).sort();
  let bestWeek = 0;
  if (dates.length > 0) {
    // Build daily totals
    const dailyMins = {};
    for (const s of sessions) {
      dailyMins[s.date] = (dailyMins[s.date] || 0) + s.duration_minutes;
    }
    // Sliding window over the date range
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const totalSpan = daysBetween(firstDate, lastDate);
    let windowSum = 0;
    // Initialize first 7 days
    for (let i = 0; i < Math.min(7, totalSpan + 1); i++) {
      const d = addDays(firstDate, i);
      windowSum += dailyMins[d] || 0;
    }
    bestWeek = windowSum;
    // Slide the window
    for (let i = 7; i <= totalSpan; i++) {
      const addDate = addDays(firstDate, i);
      const dropDate = addDays(firstDate, i - 7);
      windowSum += dailyMins[addDate] || 0;
      windowSum -= dailyMins[dropDate] || 0;
      if (windowSum > bestWeek) bestWeek = windowSum;
    }
  }

  return { longestSession, longestStreak, bestWeek };
}

// ========================================
// River Archive — Export / Import
// Competition F synthesis implementation
// ========================================

export function exportRiverData() {
  const data = getData();
  const sessions = [...data.sessions].sort((a, b) => a.date.localeCompare(b.date));
  const totalMins = getTotalMinutes(sessions);
  const dates = sessions.map(s => s.date).sort();

  return {
    _meta: {
      app: 'The River',
      version: '2.1',
      exported_at: new Date().toISOString(),
      total_hours: Math.round(totalMins / 60 * 10) / 10,
      sessions_count: sessions.length,
      date_range: dates.length > 0
        ? { first: dates[0], last: dates[dates.length - 1] }
        : null,
    },
    sessions,
    settings: data.settings,
    milestones: data.milestones || [],
    source: data.source || null,
  };
}

export function previewImport(incoming) {
  if (!incoming || !Array.isArray(incoming.sessions)) {
    return { valid: false, error: 'No sessions found in file' };
  }

  const validSessions = incoming.sessions.filter(s => isValidSession(s) || isFogSession(s));
  const existing = getData();
  const existingIds = new Set(existing.sessions.map(s => s.id));

  const newSessions = validSessions.filter(s => !existingIds.has(s.id));
  const duplicates = validSessions.length - newSessions.length;
  const totalNewMins = newSessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  return {
    valid: true,
    newSessions,
    duplicateCount: duplicates,
    totalNewMinutes: totalNewMins,
    droppedCount: incoming.sessions.length - validSessions.length,
  };
}

export function mergeImport(newSessions) {
  const data = getData();
  data.sessions = [...data.sessions, ...newSessions];
  // Recalculate first_session_date
  const allDates = data.sessions.map(s => s.date).sort();
  if (allDates.length > 0) {
    data.settings.first_session_date = allDates[0];
  }
  setData(data);
  return data;
}
