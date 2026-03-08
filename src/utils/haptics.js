// Haptic feedback patterns — the river's physical voice
// iOS Safari: navigator.vibrate is unsupported. All calls are no-ops.

const vibrate = (pattern) => {
  try { navigator.vibrate?.(pattern); } catch {}
};

export const haptics = {
  save: () => vibrate(40),
  tagToggle: () => vibrate(10),
  tunerLock: () => vibrate(80),
  milestone: () => vibrate([50, 30, 80]),
  fogHorn: () => vibrate([40, 20, 60]),
};
