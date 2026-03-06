/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useEffect } from 'react';
import { getSessions, today, addDays } from '../utils/storage';

const SeasonContext = createContext({ season: 'summer' });

// Same algorithm as RiverSVG.jsx detectSeason — single source of truth
function detectSeason(sessions) {
  if (!sessions || sessions.length === 0) return 'spring';
  const now = new Date();
  const twoWeeksAgo = new Date(now - 14 * 86400000);
  const fourWeeksAgo = new Date(now - 28 * 86400000);

  const recent = sessions.filter(s => new Date(s.date + 'T12:00:00') >= twoWeeksAgo && !s.fog);
  const older = sessions.filter(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d >= fourWeeksAgo && d < twoWeeksAgo && !s.fog;
  });

  const recentMins = recent.reduce((sum, s) => sum + s.duration_minutes, 0);
  const olderMins = older.reduce((sum, s) => sum + s.duration_minutes, 0);
  const recentDays = new Set(recent.map(s => s.date)).size;

  if (recentDays === 0) return 'winter';
  if (olderMins === 0 && recentMins > 0) return 'spring';
  if (recentMins > olderMins * 1.2 && recentDays >= 5) return 'summer';
  if (recentMins < olderMins * 0.7) return 'autumn';
  return 'summer';
}

export function SeasonProvider({ children, sessions }) {
  const season = useMemo(() => detectSeason(sessions), [sessions]);

  // Set data-season attribute on <html> for CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
    return () => document.documentElement.removeAttribute('data-season');
  }, [season]);

  return (
    <SeasonContext.Provider value={{ season }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  return useContext(SeasonContext);
}
