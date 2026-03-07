# The River — Launch Readiness Checklist

> Shotwell: "132 decisions, ~25 shipped. Where's the deployment pipeline?"

## Pre-Deploy (every push)

- [ ] `npm run build` passes with zero errors
- [ ] No console errors on page load (all 4 tabs)
- [ ] Fonts load from /public/fonts/ (no Google requests)
- [ ] Service worker version bumped in sw.js
- [ ] localStorage health check: green dot in Settings

## Visual States (spot check — 240+ combinations)

Test at minimum:
- [ ] Home: empty state (no sessions)
- [ ] Home: with sessions (river renders)
- [ ] Home: fog horn day (rest day logged)
- [ ] Log: add session flow
- [ ] Tuner: microphone permission flow
- [ ] Dock: chord diagrams render
- [ ] Timer FAB: start → pause → resume → stop → save
- [ ] Timer FAB: "Never mind" flow (was "Discard")
- [ ] Celebration: milestone overlay appears and dismisses
- [ ] Settings: all sections visible

## Themes (each of above in):

- [ ] Dark mode (default)
- [ ] Light mode
- [ ] Sapphire Night

## Accessibility

- [ ] Tab keyboard navigation (Arrow keys, Home/End)
- [ ] Fog horn keyboard access (Enter/Space)
- [ ] Screen reader: all interactive elements labeled
- [ ] Reduced motion: animations respect preference
- [ ] Touch targets: 44px minimum on all buttons

## Data Safety

- [ ] Export/Import round-trip preserves all data
- [ ] Sessions with all fields (note, tags, mood, fog) survive save/reload
- [ ] Storage health dot: green in Settings
- [ ] Timer persists across page reload (localStorage)

## Device Testing

- [ ] Safari iOS (primary target)
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Android Chrome (if available)

---

*Created: Session 11, per Gwynne Shotwell's operational review*
