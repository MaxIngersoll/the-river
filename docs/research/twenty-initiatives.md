# The River — 20 Initiatives from the Decision Mine

**Advisory Panel:** Dan Abramov (React/Engineering), Shirley Wu (D3/Canvas/WebGL), Jiro Ono (Craft Mastery)
**Source:** 132+ decisions from DECISIONS.md, cross-referenced against the built codebase (33 source files)

---

## Panel Discussion

**Abramov:** I went through all 132 decisions and mapped them against what exists in `src/`. Roughly 25-30 have shipped. The rest are approved-but-unbuilt. The biggest structural gap: ShedPage.jsx is 1,170 lines and has already been partially broken up into ChordSection, ScaleSection, CircleSection, QuickRefSection, and ShedHelpers — but the main file still orchestrates everything. The second gap: dozens of Session 11 Competition J decisions about river behavior, ceremony, and polish are pure decisions with zero code behind them. We need to separate "big new systems" from "small decisions that just need an afternoon."

**Wu:** The river visualization is the soul of this app, and right now it's still mostly ambient. Ben Fry's team assignment says it plainly: "Every pixel should be accountable to a data point." The river currently has a soul line, seasonal particles, and a season engine — but it doesn't encode recency, session length, tag variety, or time of day (all decided in Q53, Q54, Q71, and the River Data Viz team brief). That's the single highest-impact visual initiative: making the river tell the truth. After that, the river objects decision (Q8/Q17 — fish, boats, lily pads representing tags) is the most creatively ambitious thing in the backlog.

**Jiro:** I notice 19 decisions about ceremony, celebration, and emotional moments — and most are unbuilt. The session save ripple (Q67), timer micro-messages (Q58), undo toast on delete (Q40), the loading breath (Q41), empty state poetry (Q42), warm error messages (Q43). These are tiny individually but collectively they are the difference between software and craft. The app celebrates milestones already, but it does not yet celebrate *presence*. That is the gap. Also: the mood picker (Q28) is decided and unbuilt — and Max called it "crucial data."

**Abramov:** Let me add the practical filter. Some of these are genuinely small — Q40 (undo toast) is maybe 40 lines. Q42 (empty state) is a string change plus a component. Q72 (time-of-day greeting) is a one-liner. We should batch those. The medium efforts are: mood picker, haptics, session notes, quick log pull-down. The large efforts are: river data encoding, river objects, Omakase mode, swipe navigation.

**Wu:** Agreed. My ranking priority: anything that makes the river responsive to real data comes first because it's the *identity* of the app. Then ceremony polish. Then new features.

**Jiro:** One more thing. DM Serif Display was approved as the ceremony typeface (Q19) and never added. That single font, applied only at threshold moments, would transform the Reading, milestones, and onboarding. It is perhaps the highest ratio of impact to effort in the entire backlog.

---

## The 20 Initiatives (Ranked by Impact)

### Tier A — The River Comes Alive

**1. River Data Encoding**
- **What:** River speed reflects practice recency, depth reflects session length, turbulence reflects tag variety, color temperature reflects time of day.
- **From:** Q31, Q53, Q54, Q71, Team 1 assignment, Ben Fry mandate
- **Effort:** L | **Impact:** High
- **Why now:** The river is currently decorative. This makes it the app's primary information display — the core promise.
- **Technical approach:** Extend RiverSVG.jsx to accept computed data props (recency score, avg session length, tag count, current hour). Map to animation speed, SVG path amplitude, particle density, and color-shift CSS variables.

**2. Mood Picker + River Mood Response**
- **What:** Post-session emoji picker (Energized/Focused/Struggling/Peaceful/Frustrated) that stores mood data and subtly shifts river visuals.
- **From:** Q28 (MAX OVERRIDE), Angelou redesign note
- **Effort:** M | **Impact:** High
- **Why now:** Max called this "crucial data." It's the emotional layer the river currently lacks. Affects river visuals, enables future "you showed up when it was hard" celebrations.
- **Technical approach:** Add mood field to session schema in storage.js. Render 5-icon picker in TimerFAB save flow. Pass mood aggregate to RiverSVG as color warmth modifier.

**3. Ceremony Typeface (DM Serif Display)**
- **What:** Load DM Serif Display (self-hosted, 20KB) and apply it exclusively at threshold moments: Reading Ceremony, milestones, onboarding screens, the manifesto.
- **From:** Q19, Q50 (ceremony typeface decision), self-hosted fonts decision
- **Effort:** S | **Impact:** High
- **Why now:** Highest impact-to-effort ratio in the backlog. One font file, a few CSS rules, and every ceremonial moment gains gravitas.
- **Technical approach:** Add font files to `/public/fonts/`. Define `.font-ceremony` class in index.css. Apply to ReadingCeremony.jsx, CelebrationOverlay.jsx, OnboardingFlow.jsx headings.

**4. Session Save Ripple Animation**
- **What:** When a session is saved, the river "drinks" it — a ripple expands outward from center. "The river drinks your practice."
- **From:** Q67 (unanimous 6-0)
- **Effort:** S | **Impact:** High
- **Why now:** Session save is the single most frequent meaningful interaction. It currently has no ceremony. A CSS/SVG ripple animation takes an afternoon and transforms the most common moment.
- **Technical approach:** Add a `<div class="ripple">` overlay triggered on save callback in TimerFAB.jsx. CSS keyframe: scale(0) to scale(3) with opacity fade, 800ms ease-out. Season-colored.

### Tier B — Daily Use Polish

**5. Session Notes (One Optional Line)**
- **What:** Single text input on session save. "A whisper, not a journal."
- **From:** Q33
- **Effort:** S | **Impact:** Medium
- **Why now:** Zero-effort addition to save flow. Enables future "your own notes resurface after 50h" feature (Q73). Unlocks the entire user-content-as-margin-notes pipeline.
- **Technical approach:** Add optional `note` string field to session schema. Render a single `<input>` in TimerFAB save confirmation. Display in LogPage session cards.

**6. Time-of-Day Greeting**
- **What:** "Good morning" / "Afternoon session" / "Late night practice?" on the Home page. Warm, one line.
- **From:** Q72
- **Effort:** S | **Impact:** Medium
- **Why now:** The simplest possible way to make the app feel like it knows you. 10 lines of code.
- **Technical approach:** Compute greeting from `new Date().getHours()` in HomePage.jsx. Render above or below the river. Season-tinted text color.

**7. Undo Toast on Session Delete**
- **What:** Delete a session and get a 10-second "Undo" toast instead of a confirmation modal.
- **From:** Q40 (unanimous 6-0)
- **Effort:** S | **Impact:** Medium
- **Why now:** Current delete flow likely uses a confirm dialog (or nothing). The undo toast is more humane and was the only unanimous 6-0 non-philosophical vote.
- **Technical approach:** On delete, move session to a `_pendingDelete` key. Show toast with 10s countdown. On undo, restore. On timeout, actually delete.

**8. Haptic Micro-Interactions**
- **What:** `navigator.vibrate()` on session save (40ms), tag toggle (5ms), tuner lock-in (80ms), milestone celebration (pattern).
- **From:** Q11 (haptics: yes but restrained)
- **Effort:** S | **Impact:** Medium
- **Why now:** The Fog Horn already uses haptics. Extending to 4-5 key moments makes the entire app feel physically alive. Feature-flag it for devices that support it.
- **Technical approach:** Create `src/utils/haptics.js` with named patterns. Call from TimerFAB, GuitarTuner, CelebrationOverlay. Guard with `'vibrate' in navigator`.

**9. Timer Micro-Messages**
- **What:** Ultra-subtle milestone text at 15m/30m/45m/1h during active timer. Only visible if you look. Never pulls attention.
- **From:** Q58 (MAX OVERRIDE: stealthy, not interruptive)
- **Effort:** S | **Impact:** Medium
- **Why now:** The timer currently shows elapsed time and nothing else. Gentle messages at intervals reward long sessions without interrupting flow.
- **Technical approach:** In TimerFAB.jsx, check elapsed against thresholds. Render a small, low-opacity text below the timer that fades in/out over 3 seconds. `opacity: 0.4`, `font-size: 0.7rem`.

**10. "Never Mind" Rename + Warm Error Messages**
- **What:** Rename "Discard" to "Never mind" throughout. Replace any generic error text with river metaphors ("Something got tangled in the current").
- **From:** Brown decision (shame-aware language), Q43
- **Effort:** S | **Impact:** Medium
- **Why now:** Language is design. These are string changes that shift the entire emotional register of the app.
- **Technical approach:** Global find-and-replace "Discard" with "Never mind." Audit ErrorBoundary.jsx and any catch blocks for generic messages.

### Tier C — New Capabilities

**11. Quick Log (Pull-Down Bottom Sheet)**
- **What:** Pull-down gesture on Home opens a bottom sheet for fast session logging without the timer. Smart defaults from time-of-day and history. One tap to confirm.
- **From:** Q13 (swipe + pull-down), Q18 (smart default 1-tap)
- **Effort:** M | **Impact:** High
- **Why now:** Many practice sessions happen without a timer. "I just played for 20 minutes" needs a 3-second entry path, not a tab switch.
- **Technical approach:** New `QuickLogSheet.jsx` component. Render as a transform-based bottom sheet on Home. Pre-fill duration from recent average, tags from last session. Single "Save" button.

**12. Tags: 6 Core + Sub-Tags + River Objects**
- **What:** Implement the decided 6 core tags that power river objects. Optional sub-tags for personal notes. Objects (fish, boats, lily pads, lanterns, jumping fish) appear in the river representing tag distribution.
- **From:** Q22 (tags hybrid), Q8/Q17 (river objects), Q38 (tag analytics = living scene)
- **Effort:** L | **Impact:** High
- **Why now:** Tags exist but are barely used. River objects are the most creatively ambitious visual decision in the backlog. Together they make the river a living ecosystem.
- **Technical approach:** Define 6 core tags in a constant. Map each to an SVG object sprite. In RiverSVG.jsx, compute tag distribution from sessions and render proportional objects along the river. Untagged sessions = the water itself.

**13. Onboarding 4th Screen (Interactive Demo)**
- **What:** Add a 4th onboarding screen where tapping makes a river grow, with poetic descriptions of what the app does.
- **From:** Q9, Q27 (MAX OVERRIDE: combine interactive demo + poetic text)
- **Effort:** M | **Impact:** Medium
- **Why now:** The current 3-screen Witness onboarding is beautiful but doesn't explain what the app *does*. The 4th screen bridges metaphor and function.
- **Technical approach:** Add a screen to OnboardingFlow.jsx with a mini RiverSVG that responds to taps (width grows on each tap). Overlay text: "A timer that breathes with you. A river that remembers."

**14. Reduced Motion Support**
- **What:** Full `prefers-reduced-motion` support: disable river animation, particle systems, crossfades, and all non-essential motion.
- **From:** Q83 (unanimous 6-0), useReducedMotion hook already exists
- **Effort:** M | **Impact:** Medium
- **Why now:** The hook exists but isn't wired to most animations. RiverSVG, CelebrationOverlay, OnboardingFlow, and page transitions all need to check it. This is respect, not a feature.
- **Technical approach:** Import `useReducedMotion` in every component with animation. Conditionally disable `requestAnimationFrame` loops, CSS transitions, and particle rendering. Provide static river fallback.

**15. Keyboard Shortcuts**
- **What:** Space = start/pause timer, Left/Right arrows = switch tabs. WAI-ARIA tab navigation (already partially built).
- **From:** Q38 (keyboard shortcuts), Verou decision (WAI-ARIA tabs)
- **Effort:** S | **Impact:** Medium
- **Why now:** TabBar.jsx exists. Adding `onKeyDown` handlers for arrow keys and a global Space listener is small work with outsized desktop UX benefit.
- **Technical approach:** Add `useEffect` keydown listener in App.jsx for Space (timer toggle) and Tab navigation. Extend TabBar with `role="tablist"`, roving tabindex, arrow key support per WAI-ARIA pattern.

**16. Empty State Poetry + Loading Breath**
- **What:** First-time river shows "A dry riverbed waiting for rain" instead of nothing. App load shows a subtle breathing river animation for one beat before interactive.
- **From:** Q42 (empty state), Q41 (loading breath), Ando's Breath principle
- **Effort:** S | **Impact:** Medium
- **Why now:** These are the first and most frequent impressions. A poetic empty state and a loading breath are the difference between an app and a place.
- **Technical approach:** In HomePage, check if sessions.length === 0 and render a styled message with ceremony typeface. In App.jsx, add a 1-second `useState` delay with a fade-in animation before rendering main content.

### Tier D — Future Foundation

**17. Contextual FAB Morphing**
- **What:** FAB shows timer normally, morphs to contextual actions based on current tab. Long-press opens radial quick-action menu (Timer, Quick Log, Tuner, Metronome).
- **From:** Q7 (FAB morphs contextually), Q69 (long-press radial menu)
- **Effort:** M | **Impact:** Medium
- **Why now:** The FAB is currently single-purpose. Morphing makes it the smartest button in the app. Long-press radial is a delightful power-user discovery.
- **Technical approach:** Pass `activeTab` to TimerFAB. Change icon/action based on tab. Add long-press handler (300ms timeout) that renders a radial CSS menu with 4 options.

**18. Smart Routing on Launch**
- **What:** If you practiced today, open to Home (reflect). If you haven't, open to Ready/Dock (act).
- **From:** Q23
- **Effort:** S | **Impact:** Medium
- **Why now:** Simple conditional in App.jsx. Makes the app feel intelligent from the first tap of each day.
- **Technical approach:** In App.jsx initial state, check if any session exists with today's date. Set initial tab index accordingly.

**19. Per-Tag BPM Memory in Metronome**
- **What:** Metronome remembers last BPM per tag. Scales at 120, songs at 80. It remembers.
- **From:** Q55
- **Effort:** S | **Impact:** Medium
- **Why now:** The metronome exists in SoundscapePanel. Adding a `bpmByTag` object to localStorage and reading it when a tag is selected is trivial but deeply personal.
- **Technical approach:** Store `{ scales: 120, songs: 80, ... }` in localStorage. On tag selection in practice flow, set metronome BPM from stored value. Update on change.

**20. Favorites System for Chords/Progressions**
- **What:** Heart icon on chords, scales, and progressions. Favorites surface at top of their sections for quick access.
- **From:** Q76 (MAX OVERRIDE: no per-chord history, YES to favorites)
- **Effort:** M | **Impact:** Medium
- **Why now:** The Dock has rich content (35+ chord voicings, progressions, CAGED, Circle of Fifths) but no personalization. Favorites turn a reference library into *your* library.
- **Technical approach:** Store `favorites: { chords: ['Am', 'G7'], progressions: [0, 3], scales: ['pentatonic'] }` in localStorage. Add heart toggle to ChordSection, progression cards. Filter/sort favorites to top.

---

## Summary Table

| # | Initiative | Effort | Impact | Decisions |
|---|-----------|--------|--------|-----------|
| 1 | River Data Encoding | L | High | Q31,Q53,Q54,Q71 |
| 2 | Mood Picker + River Response | M | High | Q28 |
| 3 | Ceremony Typeface | S | High | Q19,Q50 |
| 4 | Session Save Ripple | S | High | Q67 |
| 5 | Session Notes | S | Medium | Q33 |
| 6 | Time-of-Day Greeting | S | Medium | Q72 |
| 7 | Undo Toast | S | Medium | Q40 |
| 8 | Haptic Micro-Interactions | S | Medium | Q11 |
| 9 | Timer Micro-Messages | S | Medium | Q58 |
| 10 | Warm Language Pass | S | Medium | Brown, Q43 |
| 11 | Quick Log Bottom Sheet | M | High | Q13,Q18 |
| 12 | Tags + River Objects | L | High | Q22,Q8,Q17 |
| 13 | Onboarding 4th Screen | M | Medium | Q9,Q27 |
| 14 | Reduced Motion Support | M | Medium | Q83 |
| 15 | Keyboard Shortcuts | S | Medium | Q38, Verou |
| 16 | Empty State + Loading Breath | S | Medium | Q41,Q42 |
| 17 | Contextual FAB | M | Medium | Q7,Q69 |
| 18 | Smart Routing | S | Medium | Q23 |
| 19 | Per-Tag BPM Memory | S | Medium | Q55 |
| 20 | Favorites System | M | Medium | Q76 |

**Quick wins (S effort, can batch in a day):** 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 18, 19
**Medium builds (1-2 days each):** 2, 11, 13, 14, 17, 20
**Large builds (multi-day):** 1, 12

---

*Generated: March 8, 2026 — Advisory Panel: Abramov, Wu, Jiro*
