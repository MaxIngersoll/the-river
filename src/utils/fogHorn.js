import { addSession, today } from './storage';

const FOG_LIMIT = 3;

function currentYearMonth() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function getFogDaysThisMonth(sessions) {
  const { year, month } = currentYearMonth();
  return sessions.filter((s) => {
    if (!s.fog) return false;
    const d = new Date(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;
}

export function canAddFogDay(sessions) {
  const used = getFogDaysThisMonth(sessions);
  return { allowed: used < FOG_LIMIT, used, limit: FOG_LIMIT };
}

export function todayIsFogDay(sessions) {
  const t = today();
  return sessions.some((s) => s.fog && s.date === t);
}

export function addFogDay() {
  return addSession({
    date: today(),
    duration_minutes: 0,
    fog: true,
    note: '',
    tags: [],
  });
}
