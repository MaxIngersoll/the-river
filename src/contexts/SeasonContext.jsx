/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useEffect } from 'react';
import { getTotalHours } from '../utils/storage';

const SeasonContext = createContext({
  season: 'spring',
  hue: 200,
  saturation: 40,
  warmth: 0.5,
});

// Season visual config — Thermal Drift from Competition F
const SEASON_CONFIG = {
  spring:  { hue: 160, saturation: 45, warmth: 0.5, glowOpacity: 0.12, driftSpeed: 90 },
  summer:  { hue: 215, saturation: 50, warmth: 0.6, glowOpacity: 0.15, driftSpeed: 120 },
  autumn:  { hue: 35,  saturation: 40, warmth: 0.7, glowOpacity: 0.10, driftSpeed: 75 },
  winter:  { hue: 220, saturation: 15, warmth: 0.3, glowOpacity: 0.08, driftSpeed: 180 },
};

// Detect practice season from session history
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

  // Thermal Drift: blend config and set CSS custom properties
  const config = useMemo(() => {
    const target = SEASON_CONFIG[season] || SEASON_CONFIG.spring;

    // Try to blend from previous season for smooth transitions
    try {
      const stored = localStorage.getItem('river-season-state');
      const state = stored ? JSON.parse(stored) : null;

      if (state && state.current !== season) {
        const prev = SEASON_CONFIG[state.current] || target;
        const blend = Math.min(1, (state.blendFactor || 0) + 0.25);
        localStorage.setItem('river-season-state', JSON.stringify({ current: season, blendFactor: blend }));

        const lerp = (a, b, t) => a + (b - a) * t;
        return {
          season,
          hue: Math.round(lerp(prev.hue, target.hue, blend)),
          saturation: Math.round(lerp(prev.saturation, target.saturation, blend)),
          warmth: lerp(prev.warmth, target.warmth, blend),
          glowOpacity: lerp(prev.glowOpacity, target.glowOpacity, blend),
          driftSpeed: Math.round(lerp(prev.driftSpeed, target.driftSpeed, blend)),
        };
      }

      localStorage.setItem('river-season-state', JSON.stringify({ current: season, blendFactor: 1 }));
    } catch { /* ignore storage errors */ }

    return { season, ...target };
  }, [season]);

  // Consequential UI — derived from practice hours
  const totalHours = useMemo(() => getTotalHours(sessions), [sessions]);
  const riverWeight = useMemo(() => Math.min(300 + Math.floor(totalHours / 5) * 10, 600), [totalHours]);
  const cardRadius = useMemo(() => 8 + Math.min(totalHours, 200) / 200 * 16, [totalHours]);

  // Apply CSS custom properties to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-season', season);
    root.style.setProperty('--season-hue', config.hue);
    root.style.setProperty('--season-saturation', `${config.saturation}%`);
    root.style.setProperty('--season-warmth', config.warmth);
    root.style.setProperty('--season-glow-opacity', config.glowOpacity);
    root.style.setProperty('--season-drift-speed', `${config.driftSpeed}s`);
    root.style.setProperty('--river-weight', riverWeight);
    root.style.setProperty('--card-radius', `${cardRadius}px`);

    return () => {
      root.removeAttribute('data-season');
      root.style.removeProperty('--season-hue');
      root.style.removeProperty('--season-saturation');
      root.style.removeProperty('--season-warmth');
      root.style.removeProperty('--season-glow-opacity');
      root.style.removeProperty('--season-drift-speed');
      root.style.removeProperty('--river-weight');
      root.style.removeProperty('--card-radius');
    };
  }, [season, config, riverWeight, cardRadius]);

  return (
    <SeasonContext.Provider value={config}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  return useContext(SeasonContext);
}
