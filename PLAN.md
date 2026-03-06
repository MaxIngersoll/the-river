# Implementation Plan: Deep Blue/Indigo Colorway + Live Timer

## Phase 1: Deep Blue/Indigo Colorway Swap

Replace all teal/green colors with a deep blue/indigo palette inspired by Apple Health's Sleep/Mindfulness aesthetic. This touches **50+ color values across 8 files**.

### New Palette

**Light mode** (pale sky → deep navy):
| Token | Hex | Role |
|-------|-----|------|
| water-1 | `#BFDBFE` | Lightest — 0 hours |
| water-2 | `#60A5FA` | Light blue |
| water-3 | `#3B82F6` | Primary accent |
| water-4 | `#2563EB` | Deeper blue |
| water-5 | `#1E40AF` | Darkest — high hours |

**Dark mode** (deep navy → luminous sky — progression inverts for glow-on-dark):
| Token | Hex | Role |
|-------|-----|------|
| water-1 | `#1E3A5F` | Barely visible deep navy |
| water-2 | `#1E40AF` | Dark indigo |
| water-3 | `#2563EB` | Medium blue |
| water-4 | `#3B82F6` | Bright blue |
| water-5 | `#60A5FA` | Luminous sky |

### River Color Arrays (RiverSVG.jsx)

**Light mode** (11 stops, pale→deep as hours increase):
```
0h: #DBEAFE, 0.5h: #BFDBFE, 2h: #93C5FD, 5h: #60A5FA,
10h: #3B82F6, 25h: #2563EB, 50h: #1D4ED8, 100h: #1E40AF,
250h: #1E3A8A, 500h: #172554, 1000h: #0F172A
```

**Dark mode** (11 stops, dark→luminous as hours increase):
```
0h: #0F172A, 0.5h: #172554, 2h: #1E3A8A, 5h: #1E40AF,
10h: #2563EB, 25h: #3B82F6, 50h: #60A5FA, 100h: #93C5FD,
250h: #BFDBFE, 500h: #DBEAFE, 1000h: #EFF6FF
```

### Complete File Checklist

#### 1. `index.css` (~25 values)
- [ ] `--color-water-1` through `--color-water-5` (light mode)
- [ ] `--color-water-1` through `--color-water-5` (dark mode override)
- [ ] Ambient background gradients — body::before (light: 2 radials, dark: 3 radials)
- [ ] Hero glow pseudo-element radial gradients (light + dark)
- [ ] Glass-input focus border color + box-shadow glow (light + dark)
- [ ] Flow pill border color (light + dark)
- [ ] Flow pill dry variant (no change needed — uses card-border)
- [ ] Tab bar active glow gradient (already in TabBar.jsx inline)

#### 2. `RiverSVG.jsx` (~22 values)
- [ ] Light mode 11-element color array
- [ ] Dark mode 11-element color array
- [ ] Today marker glow color (uses water-3)
- [ ] Flow animation ellipse fill (uses water-2)

#### 3. `ProgressRing.jsx` (4 values)
- [ ] Light gradient: stop1 + stop2
- [ ] Dark gradient: stop1 + stop2

#### 4. `HomePage.jsx` (~4 values)
- [ ] Log button gradient (rgba teal → dark teal)
- [ ] Log button box-shadow
- [ ] Flow pill background when flowing

#### 5. `TabBar.jsx` (~3 values)
- [ ] Active tab glow radial gradient
- [ ] Active tab text/icon color (light + dark)

#### 6. `CelebrationOverlay.jsx` (~6 values)
- [ ] Overlay radial gradient (light + dark)
- [ ] Emoji glow ring color
- [ ] Surge bar gradient
- [ ] Dismiss button gradient + shadow

#### 7. `LogPage.jsx` (~4 values)
- [ ] Active preset button gradient + shadow
- [ ] Success checkmark circle gradient

#### 8. `SettingsPage.jsx` (~2 values)
- [ ] Save/apply goal button gradient + shadow

### Mapping: Old → New (inline rgba reference)

| Old (teal) | New (blue) | Context |
|-----------|-----------|---------|
| `rgba(45,212,191,*)` | `rgba(59,130,246,*)` | Primary accent (water-3) |
| `rgba(20,184,166,*)` | `rgba(37,99,235,*)` | Secondary accent (water-4) |
| `rgba(167,243,208,*)` | `rgba(191,219,254,*)` | Light wash (water-1) |
| `rgba(94,234,212,*)` | `rgba(96,165,250,*)` | Mid accent (water-2) |
| `rgba(17,94,89,*)` | `rgba(30,64,175,*)` | Dark accent (water-5) |
| `#14B8A6` | `#3B82F6` | Solid primary |
| `#0F766E` | `#2563EB` | Solid dark |
| `#5EEAD4` | `#60A5FA` | Solid light |
| `#2DD4BF` | `#3B82F6` | Solid mid |
| `#115E59` | `#1E40AF` | Solid darkest |
| `#A7F3D0` | `#BFDBFE` | Solid palest |
| `#6EE7B7` | `#93C5FD` | Solid pale-mid |
| `#34D399` | `#60A5FA` | Solid vivid |

---

## Phase 2: Floating Action Button Live Timer

### New files
- `src/components/TimerFAB.jsx` — FAB + expanded timer overlay

### TimerFAB States

**Idle (no timer running):**
- 56px circle, bottom-right, 16px above tab bar
- Blue gradient fill matching primary accent
- Play icon (triangle)
- Subtle pulse-glow animation to invite interaction

**Running (minimized):**
- Same position, but shows elapsed time in small text (e.g. "12:34")
- Pulsing blue glow ring to indicate active timer
- Tap to expand

**Expanded (full-screen overlay):**
- Spring animation from FAB position to full screen
- Glass-morphism overlay matching app's design language
- Large monospace HH:MM:SS display with hero-glow
- Controls: Pause/Resume button + Stop button (glass-styled)
- Tap outside or collapse button to minimize (timer keeps running)
- On Stop: note field slides in, then "Save Session" gradient button

### Timer State (App.jsx)
```
{
  timerState: 'idle' | 'running' | 'paused',
  timerStartedAt: timestamp | null,
  timerPausedElapsed: ms | null,  // accumulated time before current run
  timerExpanded: boolean
}
```

### Persistence
- Active timer state saved to localStorage on every state change
- On app load: check for active timer, restore if found
- Prevents losing a session if user accidentally closes tab

### Visibility Rules
- FAB visible on ALL pages when timer is running (including Settings)
- FAB visible on Home, Log, Stats when idle (hidden on Settings only when idle)

### App.jsx Changes
- Add timer state + handlers (start, pause, resume, stop, save)
- Pass timer props to TimerFAB
- Render TimerFAB conditionally
- On save: `addSession()` → `checkNewMilestones()` → celebration

---

## Phase 3 Ideas (Future — Not Executing Now)

1. **Practice Heatmap** — GitHub-style calendar, each day colored by duration
2. **River Timelapse** — Animated replay of river growing from day 1 to now
3. **Weekly Insights** — "You practiced 23% more this week" / streak alerts
4. **Shareable River Card** — Generate beautiful image with stats (Spotify Wrapped style)
5. **Ambient Practice Mode** — Optional background sounds while timer runs (rain, metronome, river flowing)

---

## Execution Order

1. Phase 1 first — pure find-and-replace, no structural changes, easy to verify
2. Visual check in both themes after Phase 1
3. Phase 2 — new component + App.jsx wiring
4. Test full timer flow: start → pause → resume → stop → note → save
5. Verify celebration triggers after timed session save

## Verification
- `npm run build` passes after each phase
- Visual check in light + dark mode
- All buttons, pills, glows, gradients are blue/indigo (no stray teal)
- Timer persists across page navigation
- Timer restores after page refresh
- Timer save creates proper session entry
