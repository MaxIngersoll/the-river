const THEME_KEY = 'river-theme';

/**
 * Get the user's saved theme, or 'system' if none set.
 */
export function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * Save theme preference: 'light', 'dark', 'warm', or 'system'
 */
export function saveTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
}

/**
 * Resolve the effective theme (light, dark, or warm) based on saved preference.
 * 'warm' is always explicit — system preference only toggles light/dark.
 */
export function resolveTheme(preference) {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  if (preference === 'warm') return 'warm';
  // System preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Apply the theme to the document root element.
 */
export function applyTheme(effectiveTheme) {
  const root = document.documentElement;
  // Clear all theme classes
  root.classList.remove('dark', 'warm');

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#0C0A09');
  } else if (effectiveTheme === 'warm') {
    root.classList.add('warm');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#112250');
  } else {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FAF7F2');
  }
}
