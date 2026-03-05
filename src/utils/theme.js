const THEME_KEY = 'river-theme';

/**
 * Get the user's saved theme, or 'system' if none set.
 */
export function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'system';
  } catch {
    return 'system';
  }
}

/**
 * Save theme preference: 'light', 'dark', or 'system'
 */
export function saveTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
}

/**
 * Resolve the effective theme (light or dark) based on saved preference.
 */
export function resolveTheme(preference) {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
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
  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
    // Update meta theme-color for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#0C0A09');
  } else {
    root.classList.remove('dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FAF7F2');
  }
}
