# The River — Implementation Roadmap

> All decisions from Competition J (Session 11) + Max's 15 answers, organized into build phases.
> Created March 7, 2026. This is the master plan that future sessions execute.

---

## Decision Inventory (15 confirmed decisions)

| # | Decision | Source | Phase |
|---|----------|--------|-------|
| 1 | Audio recording: yes but subtle (deferred) | Q1 | 6 |
| 2 | Ceremony typeface for threshold moments | Q2 | 4 |
| 3 | Keep metronome + chords, cut ear training | Q3 | done |
| 4 | Vercel soft launch (demo capacity) | Q4 | 1 |
| 5 | River identity > guitar identity | Q5 | 5 |
| 6 | Dock = practice launchpad | Q6 | 2 |
| 7 | FAB morphs contextually (cool animation) | Q7 | 2 |
| 8 | Tag analytics = living river scene (fish, boats, objects — NO legend) | Q8 | 4 |
| 9 | Onboarding: add 4th explanatory screen | Q9 | 2 |
| 10 | Auto backup via File System Access API | Q10 | 3 |
| 11 | Haptics: yes but restrained | Q11 | 3 |
| 12 | After 50h: ALL FOUR evolution paths | Q12 | 5 |
| 13 | Swipe nav + pull-down quick log (both) | Q13 | 3 |
| 14 | Celebrity Panel = new default competition format | Q14 | done |
| 15 | Metronome: keep embedded, add BPM saving | Q15 | 2 |

---

## Phase 1: Foundation (Infrastructure, No New Features)

> Get the house in order before adding rooms.

### 1A. Vercel Soft Launch
- **What:** Deploy to Vercel as a demo. Not promoted, just live with a URL.
- **How:** `vercel:setup` → `vercel:deploy`. Add `vercel.json` with SPA rewrite. Set up preview deploys for PRs.
- **Effort:** 15 minutes
- **Files:** `vercel.json` (new), `package.json` (build script check)

### 1B. ShedPage Breakup
- **What:** Split ShedPage.jsx (1,170 lines) into proper sub-components.
- **How:** Extract: `ChordDiagramPanel.jsx`, `ProgressionPanel.jsx`, `CurrentCard.jsx`, `QuickStartCards.jsx`, `TuningStrip.jsx`, `CAGEDView.jsx`, `CircleOfFifths.jsx`
- **Why first:** Multiple Phase 2-4 features modify Dock components. Breakup must happen first.
- **Effort:** 1-2 hours
- **Files:** `ShedPage.jsx` → 7+ new component files

### 1C. Design System Formalization
- **What:** Run `figma:create-design-system-rules` to codify 30+ CSS custom properties, spacing, typography, border radius rules, shadow system, animation classes.
- **Why:** Every session re-learns the design system from reading index.css. A rules file makes it instant.
- **Effort:** 30 minutes
- **Files:** `.claude/design-system-rules.md` (new)

---

## Phase 2: Core UX Improvements

> The Dock becomes a launchpad. The FAB becomes alive. Onboarding gets smarter.

### 2A. Dock Identity: Practice Launchpad
- **What:** Restructure The Dock from "reference library you browse" to "context-aware launch into sessions."
- **How:** CurrentCard + QuickStartCards move to top prominence. Chord diagrams, CAGED, Circle of Fifths become secondary (collapsible or swipe-to-reveal). The Dock greets you with "What do you want to practice?" not "Here's a bunch of references."
- **Effort:** 1-2 hours
- **Files:** `ShedPage.jsx` (post-breakup), `CurrentCard.jsx`, `QuickStartCards.jsx`

### 2B. FAB Contextual Morph
- **What:** FAB shows timer when idle, morphs to contextual actions during practice (metronome shortcut, tuner access, stop/save).
- **How:** Animate shape/icon transition using CSS transitions or framer-motion. Morph animation must be distinctive — not just icon swap.
- **Design competition:** Tier 2 Quick for the morph animation design.
- **Effort:** 2-3 hours
- **Files:** `TimerFAB.jsx`, possibly new `FABMorphAnimation.jsx`

### 2C. Onboarding 4th Screen
- **What:** Add a 4th screen to The Witness explaining what The River actually does (features, not just metaphor).
- **How:** New screen after "Your river begins" that briefly shows: timer, practice tracking, chord references, your river growing.
- **Effort:** 30-45 minutes
- **Files:** `OnboardingFlow.jsx`

### 2D. BPM Saving in Metronome
- **What:** Save BPM per session. Track BPM progression over time.
- **How:** Add `bpm` field to session data. Save current BPM when session ends. Display BPM history in stats or on metronome panel.
- **Effort:** 1 hour
- **Files:** `SoundscapePanel.jsx`, `storage.js`, possibly `StatsPage.jsx`

---

## Phase 3: Gesture & Interaction

> Make it feel alive in your hands.

### 3A. Swipe Navigation
- **What:** Horizontal swipe between the 4 tabs (Home, Stats, Dock, Settings).
- **How:** Touch event handlers on the main content area. CSS transform for smooth transitions. Respect the tab bar state.
- **Caution:** Must not interfere with horizontal scrolling within pages (e.g., chord progressions, Circle of Fifths).
- **Effort:** 2-3 hours
- **Files:** `App.jsx`, `TabBar.jsx`, possibly new `SwipeContainer.jsx`

### 3B. Pull-Down Quick Log
- **What:** Bottom sheet (pull up from bottom) for quick session logging without navigating to timer.
- **How:** Swipe up from bottom edge → bottom sheet slides up with: duration picker, tag selector, save button. No timer needed — for logging sessions after the fact.
- **Effort:** 2-3 hours
- **Files:** New `QuickLogSheet.jsx`, `App.jsx`

### 3C. Haptic Feedback
- **What:** `navigator.vibrate()` at key interaction moments.
- **Where (restrained):** Timer start/stop, milestone celebrations, FAB morph, saving a session, fog horn activation. NOT on every tap.
- **How:** Utility function `haptic(type)` with types: `tap` (10ms), `success` (pattern), `milestone` (pattern). Feature-detect and no-op on unsupported devices.
- **Effort:** 30-45 minutes
- **Files:** New `src/utils/haptics.js`, touch points across components

---

## Phase 4: Visual Evolution

> The river becomes a living scene. Typography gets ceremonial.

### 4A. Ceremony Typeface
- **What:** A single high-contrast serif font for threshold moments only.
- **Where:** The Reading ceremony, milestone celebrations, onboarding titles, share cards.
- **How:** Import one display serif (e.g., Playfair Display, Cormorant Garamond). Apply via CSS class `.ceremony-text`. Use sparingly — it should feel special when it appears.
- **Effort:** 1 hour
- **Files:** `index.css`, `ReadingCeremony.jsx`, `CelebrationOverlay.jsx`, `OnboardingFlow.jsx`, `ShareCard.jsx`

### 4B. Living River Scene (Tag Analytics)
- **What:** Practice tags represented as actual objects IN the river — fish for scales, boats for songs, birds for theory, etc. The river becomes a scene, not a chart.
- **How:** SVG objects positioned along the river. Object types mapped to tags. Density = time spent. Objects drift, swim, float with river animations. NO legend. The beauty IS the data.
- **Design competition:** Tier 1 (Celebrity Panel) — this is a major visual feature.
- **Effort:** 4-6 hours (after competition)
- **Files:** `RiverSVG.jsx`, new `RiverObjects.jsx`, new `src/utils/tagToObject.js`

### 4C. Chord Diagram Refinement
- **What:** Polish from Competition E "Luthier's Current" synthesis.
- **How:** Review Competition E brief for unimplemented synthesis elements. Refine SVG rendering, interaction patterns, visual consistency.
- **Effort:** 1-2 hours
- **Files:** Chord-related components (post-breakup)

---

## Phase 5: Deep Features

> The river evolves. The identity opens.

### 5A. 50h+ Evolution (ALL FOUR paths)
1. **New ceremonies:** Beyond The Reading — new margin notes, new threshold events at 75h, 100h, 150h.
2. **User-generated margin notes:** Let users write their own margin notes that surface for them later.
3. **River writes back:** The river itself generates reflections based on practice patterns ("You've been drawn to minor keys lately...").
4. **More margin notes:** Expand the margin note library with new quotes, reflections, observations.
- **Effort:** 4-6 hours total
- **Files:** `ReadingCeremony.jsx`, `milestones.js`, new `userNotes.js`, new `riverReflections.js`

### 5B. Architecture Opening: Beyond Guitar
- **What:** Begin making The River instrument-aware. Guitar-first, but the architecture shouldn't assume guitar.
- **How:** Abstract guitar-specific references behind an instrument config. "The Dock" becomes instrument-contextual. Tags, progressions, chord diagrams become pluggable.
- **This is prep work, not a feature release.** No UI changes visible to users yet.
- **Effort:** 2-3 hours
- **Files:** New `src/config/instrument.js`, updates to `ShedPage.jsx` sub-components

### 5C. Auto Backup (File System Access API)
- **What:** Automatic periodic backup to user's local file system.
- **How:** Use File System Access API to get a directory handle. On session save, write backup JSON to that directory. Show last backup date in Settings.
- **Caution:** File System Access API requires user gesture to grant permission initially. Not supported in all browsers — graceful fallback to manual export.
- **Effort:** 2-3 hours
- **Files:** `storage.js`, `SettingsPage.jsx`

---

## Phase 6: Deferred / Later

> Good ideas that aren't urgent.

### 6A. Audio Recording (Subtle, Private Mirror)
- **What:** Record practice audio. Private mirror, not performance camera.
- **When:** After core features are solid. Not near-term.

### 6B. Competition C: Pitch Deck Narrative
- **What:** Implement "Maya's River" narrative for pitch.html.
- **When:** Before any public sharing or investor conversations.

---

## Execution Notes

### Competition Required For:
- **4B (Living River Scene):** Tier 1 Celebrity Panel — this is Max's most creative decision and deserves the full treatment.
- **2B (FAB Morph):** Tier 2 Quick — animation design matters but scope is contained.

### Dependencies:
```
Phase 1B (ShedPage breakup) → Phase 2A (Dock launchpad), 2B (FAB morph), 4C (chord refinement)
Phase 1A (Vercel) → independent, can happen anytime
Phase 2B (FAB morph) → Phase 3C (haptics on morph)
Phase 4A (ceremony typeface) → Phase 5A (new ceremonies use it)
```

### Principles:
- One phase at a time. Don't parallelize phases.
- Commit after every sub-task. Push after every phase.
- Screenshot after every visual change.
- Update VISION.md after every phase completion.
- 5 questions to Max between phases (not 10).
- Celebrity Panel for major visual decisions. Constraint-based for implementation comps.

---

*This roadmap was synthesized from Competition J: "Big Dog's Gotta Eat" (6 celebrity personas) and Max's 15 decisions.*
*March 7, 2026 — Session 11*
