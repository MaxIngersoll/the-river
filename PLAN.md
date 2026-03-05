# Implementation Plan: Colorway + Live Timer

## Phase 1: Deep Blue/Indigo Colorway Swap

Replace all teal/green colors with a deep blue/indigo palette inspired by Apple Health's Sleep/Mindfulness aesthetic.

### New Palette

**Light mode** (pale sky → deep navy):
- water-1: `#BFDBFE` (pale sky blue)
- water-2: `#60A5FA` (medium blue)
- water-3: `#3B82F6` (blue — primary accent)
- water-4: `#2563EB` (deeper blue)
- water-5: `#1E40AF` (dark indigo)

**Dark mode** (luminous — glows against dark):
- water-1: `#93C5FD` (bright sky)
- water-2: `#60A5FA` (bright blue)
- water-3: `#3B82F6` (blue)
- water-4: `#93C5FD` (luminous sky)
- water-5: `#60A5FA` (bright blue)

### Files to update (7 files, ~35 color values):
1. **index.css** — CSS variables + all rgba gradients (ambient glow, hero glow, focus rings, flow pill)
2. **RiverSVG.jsx** — Both 11-element color arrays (light & dark palettes)
3. **ProgressRing.jsx** — 2 gradient stops
4. **HomePage.jsx** — Button gradient, shadow, flow pill bg
5. **TabBar.jsx** — Active tab glow gradient
6. **CelebrationOverlay.jsx** — Overlay gradient, button gradient
7. **LogPage.jsx** — Success button gradient

## Phase 2: Floating Action Button Live Timer

### New component: `TimerFAB.jsx`
- Renders a glowing blue FAB (56px circle) in bottom-right corner, above tab bar
- Shows on Home, Log, Stats pages (hidden on Settings)
- Tap → expands to full-screen timer overlay with spring animation

### Timer overlay UI:
- Large digital clock display (MM:SS) with monospace font
- Elapsed time in the hero-glow style
- Controls: Play/Pause button + Stop button (glass-styled)
- Optional note field (glass-input) shown after stopping
- "Save Session" gradient button to commit

### State management:
- Timer state lives in `App.jsx` (startTime, isRunning, isPaused, elapsed)
- Uses `useRef` for interval to avoid stale closures
- Persists across tab switches (state in parent, not in TimerFAB)
- On save: calls `addSession()` → `checkNewMilestones()` → may trigger celebration

### App.jsx changes:
- Add timer state: `{ isRunning, isPaused, startTime, pausedElapsed }`
- Pass timer props to TimerFAB
- Pass `addSession` and `checkNewMilestones` callbacks
- Render TimerFAB when not on Settings page

## Verification
- Build + lint after each phase
- Visual check in both light and dark modes
- Test timer: start → pause → resume → stop → save flow
