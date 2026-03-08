# The River -- Implementation Batches

**Panel:** Dan Abramov, Amelia Wattenberger, Matt DesLauriers, Lea Verou, John Carmack, Jiro Ono, Wynton Marsalis
**Date:** March 8, 2026

---

## 1. Carmack Opens: Prioritization Framework

**Carmack:** Twenty items. Let's be honest about what actually ships. I'm sorting by one question: *does this make the user's next session better?* Not "eventually." Not "in theory." Tuesday.

Three filters:
1. **Ships in under 30 minutes?** Do it today. No planning needed.
2. **Blocks something else?** It goes first regardless of sexiness.
3. **Requires design decisions we haven't made?** Push it. Don't design mid-build.

What blocks what: The ceremony typeface (#3) is a dependency for empty state poetry (#16), onboarding (#13), and the reading ceremony polish. Ship the font first. The session schema in `storage.js` is a dependency for mood picker (#2), session notes (#5), and quick log (#11). Extend the schema once. The `haptics.js` utility (#8) is a dependency for the save ripple (#4) and every future interaction.

What gets cut from near-term: River Data Encoding (#1) and Tags + River Objects (#12) are L-effort items that need Canvas architecture decisions. They're Batch 4. FAB morphing (#17) is cool but nobody asked for it this week. Onboarding 4th screen (#13) -- you have zero users in onboarding right now. Push it.

## 2. Jiro Filters: What Is Worthy

**Jiro:** Of these twenty, twelve are about making the *existing* experience beautiful. That is where the knife should cut first. The app already works. Now it must feel inevitable.

**Worthy of immediate attention:** The ceremony typeface (#3). The warm language pass (#10). The time-of-day greeting (#6). The session save ripple (#4). These are not features. They are manners. An app without manners is just software.

**Worthy but requires patience:** The mood picker (#2). The river data encoding (#1). These are the soul of the app. Do not rush them. Build the small courtesies first, then the deep intelligence.

**Noise for now:** Favorites (#20), contextual FAB (#17), per-tag BPM (#19). These solve problems you do not yet have. Smart routing (#18) is already built -- I see it in `App.jsx` line 23. Cross it off.

## 3. Wynton Reality-Checks

**Wynton:** I'm looking at this from behind a music stand. What does a guitarist need from this app at 10pm when they just put the guitar down?

They need the app to *receive* their practice. That's the save moment. Right now: type a note, pick tags, press save. Fine. But it doesn't feel like the app *took it in*. The save ripple (#4) and haptic feedback (#8) fix that. Those are first.

They need to feel recognized. The time-of-day greeting (#6) and timer micro-messages (#9) do this. "Late night practice?" when you're playing at midnight -- that's the app being your friend.

Session notes (#5) are already built -- I see a note input in TimerFAB.jsx line 311. That input already exists, and App.jsx line 140 passes `note` to `addSession`. Check it off. The *curiosity* field (line 347) is the real session notes feature. It's done.

The mood picker (#2) I care about deeply. But it has to go in the save flow, and the save flow is already good. Don't break what works to add feelings. Add a single row of 5 icons below the tags. That's it.

## 4. The Builders Plan

### Initiative #3: Ceremony Typeface
**Dan:** The font is already loaded. Look at `index.css` line 6: `@font-face` for DM Serif Display. The CSS variable `--font-ceremony` exists (line 66). The class `.ceremony-text` exists (line 145). It's already applied to CelebrationOverlay, ReadingCeremony, OnboardingFlow. **This is done.** Cross it off.

### Initiative #6: Time-of-Day Greeting
**Dan:** Already built. `HomePage.jsx` line 28: `getGreeting()` returns river-themed greetings by hour. It's rendered. **Done.** Next.

### Initiative #18: Smart Routing
**Dan:** Already built. `App.jsx` line 23-27: checks if practiced today, routes to `home` or `shed`. **Done.**

### Initiative #5: Session Notes
**Dan:** Already built. `TimerFAB.jsx` line 311-318: note input. Line 347-352: curiosity input. `App.jsx` line 140: `{ duration_minutes, note, tags }` saved. **Done.**

### Initiative #7: Undo Toast
**Dan:** Already built. `App.jsx` lines 164-214: full soft-delete with 10s timeout, undo callback. `UndoToast` component at line 343. **Done.**

**Carmack:** So of the 20, five are already shipped. That's what happens when you don't audit before planning. Fifteen remain. Let's build.

---

### Initiative #10: Warm Language Pass
- **Files:** Global search-and-replace across `src/`
- **What exists:** "Never mind" is already used in TimerFAB.jsx (line 370). ErrorBoundary.jsx line 39 already says "The river hit a snag." Good.
- **Remaining work:** Audit every `catch` block and user-facing error string. Replace any "Error" / "Failed" / "Something went wrong" with river metaphors. Check `LogPage.jsx`, `SettingsPage.jsx`, `storage.js` error paths.
- **Lines:** ~20 string changes
- **Risk:** None. String changes only.

### Initiative #8: Haptic Micro-Interactions
- **Create:** `src/utils/haptics.js`
- **Signature:**
  ```js
  export const haptics = {
    save: () => navigator.vibrate?.(40),
    tagToggle: () => navigator.vibrate?.(5),
    tunerLock: () => navigator.vibrate?.(80),
    milestone: () => navigator.vibrate?.([40, 30, 80, 30, 120]),
    fogHorn: () => navigator.vibrate?.([40, 20, 60]),
  };
  ```
- **Modify:** `TimerFAB.jsx` (save handler), `GuitarTuner.jsx` (lock-in detection), `CelebrationOverlay.jsx` (on mount), tag toggle buttons in TimerFAB
- **Lines:** ~30 (new file) + ~10 (call sites)
- **Risk:** `navigator.vibrate` doesn't exist on iOS Safari. Guard with feature detection. The fogHorn in `App.jsx` line 68 already does this pattern -- extract it.

### Initiative #4: Session Save Ripple
- **Modify:** `TimerFAB.jsx` -- add ripple overlay on save
- **Approach:** CSS-only. On save callback, set a `showRipple` state. Render a `<div>` with `@keyframes ripple-out`: `scale(0) opacity(0.6)` to `scale(3) opacity(0)` over 800ms. Season-colored via `var(--season-primary)`.
- **Add to `index.css`:**
  ```css
  @keyframes ripple-out {
    0% { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(3); opacity: 0; }
  }
  ```
- **Lines:** ~25 CSS + ~15 JSX
- **Risk:** Must not block the save flow. Fire-and-forget animation. Use `onAnimationEnd` to clean up.

### Initiative #9: Timer Micro-Messages
- **Modify:** `TimerFAB.jsx`
- **Approach:** Array of `{ threshold: 15*60*1000, message: "Fifteen minutes in. You showed up." }`. In the expanded timer view, when `elapsed` crosses a threshold, render a small text below the time display. `opacity: 0.4`, `fontSize: '0.7rem'`, fade in over 2s using CSS transition on opacity.
- **State:** `const [microMsg, setMicroMsg] = useState(null)` -- computed from elapsed in a `useEffect`.
- **Messages:** 15m: "You showed up." / 30m: "The river deepens." / 45m: "This is the work." / 60m: "An hour. Respect."
- **Lines:** ~30
- **Risk:** Must not re-render the timer display unnecessarily. Memoize threshold check.

### Initiative #16: Empty State Poetry
- **Modify:** `HomePage.jsx`
- **Where:** Check `sessions.length === 0` before rendering RiverSVG. Show a styled empty state with `.ceremony-text`: "A dry riverbed, waiting for rain."
- **Lines:** ~20
- **Risk:** None.

### Initiative #15: Keyboard Shortcuts
- **Modify:** `App.jsx` -- add global `useEffect` keydown listener
- **Space:** Toggle timer (dispatch `CustomEvent('river-start-timer')` or expose a ref)
- **TabBar.jsx:** Already has arrow key navigation (line 53-79). Already has WAI-ARIA roles (line 87-98). **Partially done.**
- **Remaining:** Global Space handler in App.jsx. Wire it to TimerFAB start/pause.
- **Lines:** ~20
- **Risk:** Must not capture Space when user is typing in an input. Check `document.activeElement.tagName`.

### Initiative #2: Mood Picker
- **Modify:** `TimerFAB.jsx` -- add 5 emoji buttons between tags and save button
- **Modify:** `storage.js` -- add `mood` field to session schema (optional string)
- **Modify:** `App.jsx` -- pass mood through `handleTimerSave`
- **State:** `const [mood, setMood] = useState(null)` in TimerFAB
- **Icons:** Energized (lightning), Focused (target), Struggling (wave), Peaceful (leaf), Frustrated (wind) -- use simple SVG, not emoji
- **Schema change:** `{ id, date, duration_minutes, note, tags, curiosity, mood }`
- **Lines:** ~60 (TimerFAB) + ~5 (storage) + ~5 (App)
- **Risk:** Medium. Touches the save flow. Must not break existing sessions without mood field.

### Initiative #14: Reduced Motion Support
- **Modify:** `RiverSVG.jsx`, `CelebrationOverlay.jsx`, `OnboardingFlow.jsx`, `App.jsx` (page transitions), `TimerFAB.jsx` (ripple)
- **Approach:** `useReducedMotion()` hook already exists. Import it in each component. When true: skip `requestAnimationFrame` in RiverSVG (show static river), disable particle system, replace CSS transitions with instant state changes, skip save ripple.
- **Lines:** ~40 across 5 files
- **Risk:** Must test that static river fallback still looks good. RiverSVG needs a `prefersReduced` prop path.

### Initiative #11: Quick Log Bottom Sheet
- **Create:** `src/components/QuickLogSheet.jsx`
- **Trigger:** Pull-down gesture on HomePage or a "+" button near the greeting
- **UI:** Bottom sheet (CSS `transform: translateY()` with touch gesture), pre-filled duration (round to nearest 15m from recent average), tag row, single "Save" button
- **State:** Local state in QuickLogSheet. Calls `onSaveSession` prop (same as TimerFAB).
- **Lines:** ~150
- **Dependencies:** Needs the same `addSession` path as TimerFAB. Must not duplicate logic.
- **Risk:** Touch gesture handling on iOS Safari. Use `touch-action: none` on the drag handle. Consider a simpler button trigger for v1.

### Initiative #1: River Data Encoding
- **Modify:** `RiverSVG.jsx` (major refactor)
- **New props:** `recencyScore` (0-1), `avgSessionLength`, `tagCount`, `currentHour`
- **Computed in:** `HomePage.jsx` -- derive metrics from `sessions` array
- **Visual mapping:**
  - Speed: `recencyScore` maps to animation duration (2s fast to 8s slow)
  - Depth/amplitude: `avgSessionLength` maps to soul line amplitude (5px to 25px)
  - Turbulence: `tagCount` maps to noise frequency on the bezier control points
  - Color temp: `currentHour` maps to warm (golden, evening) vs cool (blue, morning) overlay via CSS `mix-blend-mode`
- **Lines:** ~120 new logic in RiverSVG + ~30 computation in HomePage
- **Risk:** Performance. Must profile on iPhone SE. The soul line animation is already in `requestAnimationFrame` -- adding data-driven parameters to the existing loop is the right approach (not a second loop).

**Amelia (Wattenberger):** On the river data encoding -- keep it SVG for now. You have 781 lines in RiverSVG and it works. Canvas rewrite is a Batch 4 conversation. For the data encoding, compute 4 numbers in HomePage, pass them as props, and let the existing animation loop consume them. The soul line's bezier control points already use `Math.sin` -- multiply the amplitude by your depth factor. Speed is just the `requestAnimationFrame` time divisor. This is arithmetic, not architecture.

**Matt (DesLauriers):** For animations: the save ripple (#4) must be CSS-only. No JS animation loop for a one-shot effect. The timer micro-messages (#9) use CSS opacity transition -- `transition: opacity 2s ease-in`. The page transitions in App.jsx (150ms exit, 300ms enter) are fine as-is. The mood picker icons should have `transform: scale` on tap with a 150ms spring feel -- use `transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot). The river data encoding speed changes should lerp over 2 seconds, never snap. Use a `useRef` to store current speed and interpolate toward target in the rAF loop.

**Lea (Verou):** Accessibility audit:
- Mood picker: each icon needs `role="radio"`, the group needs `role="radiogroup"`, `aria-label="Session mood"`. Arrow keys to navigate.
- Save ripple: add `aria-hidden="true"`. Respect `prefers-reduced-motion` -- skip the animation.
- Timer micro-messages: use `aria-live="polite"` so screen readers announce them.
- Quick Log: the bottom sheet needs `role="dialog"`, `aria-modal="true"`, focus trap, Escape to close.
- Empty state: the poem needs `role="status"` so it's announced on first visit.
- Keyboard shortcuts: document them in Settings. Add a visible hint somewhere.

Browser support note: `navigator.vibrate()` is NOT supported on iOS Safari. The haptics utility must be a no-op on iOS. Consider using the Web Audio API to generate a very short click sound as a fallback, or just accept that iOS gets no haptics.

---

## 5. Implementation Batches

### Batch 1: Ship Today (each <30 min)

**Order of operations** (sequential -- each builds on the last):

**1a. Haptics utility** (~15 min)
- Create `src/utils/haptics.js` with named patterns
- Extract existing vibrate call from `App.jsx` line 68
- Wire into: TimerFAB save, tag toggle, CelebrationOverlay mount
- Guard: `if ('vibrate' in navigator) { ... }`
- Files: create `haptics.js`, modify `TimerFAB.jsx`, `App.jsx`, `CelebrationOverlay.jsx`

**1b. Warm language pass** (~15 min, parallel with 1a)
- Audit all user-facing strings in `src/components/*.jsx` and `src/utils/*.js`
- Replace any remaining "discard" / "error" / "failed" with warm river language
- ErrorBoundary is already warm. Check LogPage, SettingsPage, storage.js.
- Files: modify `LogPage.jsx`, `SettingsPage.jsx`, `storage.js` (error messages only)

**1c. Empty state poetry** (~15 min, parallel with 1a)
- In `HomePage.jsx`: when `sessions.length === 0`, render ceremony-text message
- Text: "A dry riverbed, waiting for rain" with `.ceremony-text` class
- Below: softer text "Start your first session to see the river flow"
- Add `role="status"` for screen reader announcement
- Files: modify `HomePage.jsx`

**1d. Session save ripple** (~20 min, after 1a)
- Add `@keyframes ripple-out` to `index.css`
- In `TimerFAB.jsx`: `const [showRipple, setShowRipple] = useState(false)`
- On save: `setShowRipple(true)`, fire haptics.save(), proceed with save
- Render ripple div with `position: fixed`, `inset: 0`, `pointer-events: none`
- Background: `radial-gradient(circle, var(--season-primary) 0%, transparent 70%)`
- `onAnimationEnd={() => setShowRipple(false)}`
- Check `useReducedMotion()` -- skip if true
- Files: modify `TimerFAB.jsx`, `index.css`

**1e. Timer micro-messages** (~20 min, parallel with 1d)
- In `TimerFAB.jsx`: define threshold array
- In expanded timer view, render micro-message below elapsed time
- Style: `text-text-3 text-[11px] opacity-40`, `transition: opacity 2s`
- Add `aria-live="polite"` to the message container
- Files: modify `TimerFAB.jsx`

**1f. Global keyboard shortcut (Space)** (~10 min)
- In `App.jsx`: add `useEffect` with keydown listener
- Space toggles timer (dispatch `CustomEvent('river-toggle-timer')`)
- Guard: skip if `activeElement` is `INPUT`, `TEXTAREA`, or `SELECT`
- In `TimerFAB.jsx`: listen for `river-toggle-timer` event
- Files: modify `App.jsx`, `TimerFAB.jsx`

**Commit after Batch 1.**

---

### Batch 2: Ship Tomorrow (1-2 hours each)

**2a. Mood picker** (~90 min)
- Extend session schema: add optional `mood` string field to `storage.js`
- In `TimerFAB.jsx`: add `const [mood, setMood] = useState(null)`
- Render 5 mood buttons between tags section and curiosity input
- Icons: simple inline SVGs (lightning, target, wave, leaf, wind)
- ARIA: `role="radiogroup"` wrapper, each button `role="radio"`, arrow key navigation
- Pass mood through save: `onSaveSession({ duration_minutes, note, tags, mood })`
- Modify `App.jsx` `handleTimerSave` to include mood in `addSession` call
- Visual: selected mood gets `scale(1.15)` with spring cubic-bezier, season-tinted background
- Display mood in `LogPage.jsx` session cards (small icon next to duration)
- Files: modify `TimerFAB.jsx`, `App.jsx`, `storage.js`, `LogPage.jsx`

**2b. Reduced motion support** (~60 min, parallel with 2a)
- `RiverSVG.jsx`: import `useReducedMotion`. When true, render static SVG (no rAF loop, no particles, fixed soul line position). Show river shape but no movement.
- `CelebrationOverlay.jsx`: skip entrance animation, show content immediately
- `OnboardingFlow.jsx`: skip page transitions, instant slide changes
- `App.jsx`: when reduced motion, set page transition durations to 0
- `TimerFAB.jsx`: skip save ripple, skip pulse-glow animation on FAB
- Add `.reduce-motion` utility class to `index.css` that sets `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important;`
- Files: modify `RiverSVG.jsx`, `CelebrationOverlay.jsx`, `OnboardingFlow.jsx`, `App.jsx`, `TimerFAB.jsx`, `index.css`

**Commit after Batch 2.**

---

### Batch 3: Ship This Week (focused sessions)

**3a. Quick Log bottom sheet** (~2 hours)
- Create `src/components/QuickLogSheet.jsx`
- Trigger: button in HomePage header area (not pull-down gesture for v1 -- simpler, more accessible)
- UI: slide-up panel (`transform: translateY(100%)` to `translateY(0)` with 300ms ease-out)
- Pre-fill: duration slider (15/30/45/60 min, default from recent session average), date (today), tags (from last session)
- Single "Save" button calls same `onSaveSession` prop as TimerFAB
- ARIA: `role="dialog"`, `aria-modal="true"`, focus trap (first focusable element on open, return focus on close), Escape to close
- Backdrop: `rgba(0,0,0,0.4)` with blur
- Wire into `App.jsx` and `HomePage.jsx`
- Files: create `QuickLogSheet.jsx`, modify `HomePage.jsx`, `App.jsx`

**3b. River data encoding** (~3 hours)
- Compute in `HomePage.jsx`:
  ```js
  const recencyScore = computeRecency(sessions); // 0-1, days since last / 14, clamped
  const avgLength = avgSessionMinutes(sessions); // mean of last 10 sessions
  const tagVariety = uniqueTagsLast10(sessions); // count of unique tags / 5
  const hourOfDay = new Date().getHours(); // 0-23
  ```
- Pass as props to `RiverSVG`: `<RiverSVG recency={recencyScore} depth={avgLength} variety={tagVariety} hour={hourOfDay} />`
- In `RiverSVG.jsx`:
  - `animationSpeed`: lerp between 2s (high recency) and 8s (low recency) -- applied to rAF time divisor
  - `soulLineAmplitude`: map avgLength (0-60min) to amplitude (5px-25px)
  - `turbulence`: multiply bezier control point jitter by variety factor
  - `colorTemp`: apply warm/cool filter -- CSS `filter: hue-rotate()` based on hour (evening = +15deg warm, morning = -10deg cool)
- Use `useRef` for current values, lerp toward targets in rAF loop (Matt's recommendation)
- Respect `useReducedMotion` -- show static values, no lerp
- Files: modify `HomePage.jsx`, `RiverSVG.jsx`

**Commit after Batch 3.**

---

### Batch 4: Next Sprint (design + build)

**4a. Tags + River Objects** (~5 hours, needs Tier 2 competition)
- Define 6 core tags as constants (may differ from current 5 in `PRACTICE_TAGS`)
- Design SVG sprites for each: fish (technique), boat (songs), lily pad (theory), lantern (improv), jumping fish (ear training), dragonfly (creativity)
- Integrate into RiverSVG: compute tag distribution from last 30 sessions, render proportional objects along river path
- Touch interaction: tap object to see tag name + hours
- This needs a design competition (Tier 2) before building

**4b. Onboarding 4th screen** (~2 hours)
- Add interactive demo screen to `OnboardingFlow.jsx`
- Mini RiverSVG that responds to taps (width grows per tap)
- Poetic overlay text bridging metaphor and function
- Depends on river data encoding being stable

**4c. Canvas river rewrite** (future -- Amelia's call)
- Only if SVG performance degrades on data-encoded river with objects
- Profile first on iPhone SE before committing to rewrite
- Keep SVG as fallback for reduced-motion users

**4d. Contextual FAB morphing** (~3 hours)
- FAB icon/action changes based on active tab
- Long-press radial menu (300ms timeout)
- Needs careful UX design -- Tier 2 competition recommended

**4e. Favorites system** (~3 hours)
- Heart toggle on chords, progressions, scales in ShedPage sub-components
- localStorage: `river-favorites` key
- Filter/sort favorites to top of each section
- Modify `ChordSection.jsx`, `ScaleSection.jsx`, `ShedPage.jsx`

---

## 6. Dependency Graph

```
Batch 1 (all independent except):
  1a haptics.js ──> 1d save ripple (uses haptics.save)

Batch 2 (independent of each other, needs Batch 1):
  2a mood picker
  2b reduced motion

Batch 3 (sequential):
  3a quick log (independent)
  3b river data encoding (benefits from reduced motion being done)

Batch 4 (needs Batch 3):
  4a tags+objects (needs river data encoding)
  4b onboarding (needs river data encoding)
  4c canvas rewrite (needs tags+objects to know if SVG can handle it)
```

## 7. Already Done (Cross Off the List)

| # | Initiative | Status |
|---|-----------|--------|
| 3 | Ceremony Typeface | SHIPPED -- `index.css` line 6, `.ceremony-text` class |
| 5 | Session Notes | SHIPPED -- `TimerFAB.jsx` lines 311-352 |
| 6 | Time-of-Day Greeting | SHIPPED -- `HomePage.jsx` lines 28-35 |
| 7 | Undo Toast | SHIPPED -- `App.jsx` lines 164-214, `UndoToast` component |
| 18 | Smart Routing | SHIPPED -- `App.jsx` lines 23-27 |

**5 of 20 initiatives already done. 15 remain. 6 ship today. 2 ship tomorrow. 2 ship this week. 5 need design work.**

---

*Carmack: "Five were already done. That's the most important finding. Audit before you plan."*

*Jiro: "The small courtesies first. The deep intelligence can wait until the manners are perfect."*

*Wynton: "Make the save moment feel like the app took a breath with you. Everything else follows."*
