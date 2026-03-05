/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSavedTheme, saveTheme, resolveTheme, applyTheme } from '../utils/theme';

const ThemeContext = createContext({
  theme: 'system',      // user preference: 'light' | 'dark' | 'system'
  effective: 'light',   // resolved: 'light' | 'dark'
  setTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getSavedTheme());
  const [effective, setEffective] = useState(() => resolveTheme(getSavedTheme()));

  const setTheme = useCallback((mode) => {
    saveTheme(mode);
    setThemeState(mode);
    const eff = resolveTheme(mode);
    setEffective(eff);
    applyTheme(eff);
  }, []);

  // Apply on mount
  useEffect(() => {
    applyTheme(effective);
  }, [effective]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const eff = e.matches ? 'dark' : 'light';
      setEffective(eff);
      applyTheme(eff);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, effective, setTheme, isDark: effective === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
