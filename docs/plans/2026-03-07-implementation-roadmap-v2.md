# The River — Implementation Roadmap v2

> Rebuilt from v1 with actual file-level dependency analysis, parallel execution batches,
> and realistic effort estimates based on reading every source file.
> Created March 7, 2026.

---

## Executive Summary: What Changed from v1

**v1 organized by abstract phases.** v2 organizes by **files touched**, **real dependencies**, and **parallelism**.

Key differences:

1. **70 decisions, not 15.** v1 tracked 15 decisions from Competition J's first batch. Session 11 actually produced **70 decisions** (Q1-Q70). v2 accounts for all of them.
2. **File-centric batching.** v1 said "Phase 2: Core UX." v2 says "Batch B: everything that touches App.jsx + TabBar.jsx." This eliminates context-switching between related changes.
3. **Realistic estimates.** v1's "15 minutes for Vercel" is correct. v1's "2-3 hours for swipe nav" is wildly optimistic given the touch-conflict with horizontal scroll in ShedPage's chord progressions, Circle of Fifths, and CAGED views. Real estimate: 4-6 hours.
4. **36 features identified** (vs v1's 18). Many v1 "features" are actually 2-3 separate pieces of work.
5. **Parallel execution map.** v2 identifies 4 agent-parallelizable batches where 3+ independent features can be built simultaneously.
6. **Speed run variant.** If Max says "ship it all today," here is the optimal ordering.

---

## Complete Decision Inventory (70 decisions, grouped by implementation cluster)

### Cluster A: Already Done (2)
| # | Decision | Status |
|---|----------|--------|
| Q3 | Keep metronome + chords, cut ear training | done |
| Q14 | Celebrity Panel = new default competition format | done (process, not code) |

### Cluster B: Schema / Data Layer (5)
| # | Decision | Effort | Files |
|---|----------|--------|-------|
| Q24 | Add `instrument: "guitar"` to session schema | FREE (already done in storage.js line 133) | none |
| Q33 | Session notes: one optional line | FREE (already exists — `note` field in addSession) | none |
| Q60 | Export: JSON primary + CSV secondary | 20 min | `storage.js` |
| Q55 | Per-tag BPM memory in metronome | 45 min | `storage.js`, `SoundscapePanel.jsx` |
| Q22 | Tags: 6 core + optional sub-tags | 1.5 hr | `storage.js`, `TimerFAB.jsx`, `HomePage.jsx` |

### Cluster C: CSS-Only / Near-CSS Changes (14)
| # | Decision | Effort | Files |
|---|----------|--------|-------|
| Q44 | Animation timing: snappy 150ms / ceremony 800ms | 15 min | `index.css` |
| Q45 | Font base: 16px minimum | FREE (already set — line 117 of index.css) | none |
| Q48 | Scroll: elastic bounce | FREE (already set — `overscroll-behavior: none` at line 89; change to `auto`) | `index.css` |
| Q46 | FAB position: bottom-right | FREE (already implemented — TimerFAB line 369) | none |
| Q47 | Tab bar: icons + labels always | FREE (already implemented — TabBar.jsx) | none |
| Q50 | Touch targets: 44px minimum | 20 min audit | multiple components |
| Q49 | Page transitions: crossfade 200ms | 5 min (already close — currently 150ms exit + 300ms enter) | `index.css` |
| Q36 | Dark mode as true default | 10 min | `ThemeContext.jsx` |
| Q68 | Active tab: season-colored glow | 15 min | `TabBar.jsx`, `index.css` |
| Q65 | Milne quote: fixed forever | FREE (already implemented — TabBar.jsx line 53) | none |
| Q37 | No push notifications | FREE (no code needed — just don't build it) | none |
| Q39 | No data viz beyond the river | FREE (architectural constraint, not code) | none |
| Q32 | No numeric goals | FREE (already no goals UI — just weekly goal % which is opt-in) | none |
| Q66 | Theme picker: visual preview cards | 30 min | `SettingsPage.jsx` |

### Cluster D: Small Component Changes (12)
| # | Decision | Effort | Files |
|---|----------|--------|-------|
| Q40 | Undo on session delete: 10s toast | FREE (already implemented — App.jsx UndoToast) | none |
| Q38 | Keyboard shortcuts: space=timer, arrows=tabs | 30 min | `App.jsx` |
| Q61 | Total hours: visible on Home, not hero | 15 min | `HomePage.jsx` |
| Q56 | Longest session PB: celebrate, don't display | 20 min | `milestones.js`, `CelebrationOverlay.jsx` |
| Q57 | Practice suggestions: stable with daily rotation | 30 min | `ShedPage.jsx` (PracticeIntelligence section) |
| Q62 | Backup health: subtle green dot in Settings | 15 min | `SettingsPage.jsx` |
| Q43 | Error messaging: warm and human | 20 min | `ErrorBoundary.jsx` |
| Q41 | Loading: minimal breathing river | 30 min | new `LoadingScreen.jsx`, `App.jsx` |
| Q42 | Empty state: poetic invitation | FREE (already poetic — "Your river begins with one drop" at HomePage.jsx line 109) | none |
| Q25 | Streaks: hide number, show warmth | 30 min | `HomePage.jsx` |
| Q58 | Timer micro-messages: ultra-subtle milestones | 45 min | `TimerFAB.jsx` |
| Q70 | Pull-to-refresh: river breathes | 45 min | `HomePage.jsx` |

### Cluster E: Medium Features (10)
| # | Decision | Effort | Files |
|---|----------|--------|-------|
| Q9/Q27 | Onboarding 4th screen: interactive demo + poetic | 1 hr | `OnboardingFlow.jsx` |
| Q15 | BPM saving in metronome | 1 hr | `SoundscapePanel.jsx`, `storage.js` |
| Q28 | Mood picker: emoji + affects river + celebrates hard days | 2 hr | `TimerFAB.jsx`, `storage.js`, `RiverSVG.jsx`, `HomePage.jsx` |
| Q29 | Practice Intelligence: strengths-based | 1 hr | `ShedPage.jsx` (lines 706-767) |
| Q59 | Session log: infinite scroll + month headers | 1.5 hr | `LogPage.jsx` (currently 349 lines, needs restructure) |
| Q23 | Smart routing on launch | FREE (already implemented — App.jsx lines 23-28) | none |
| Q67 | Session save: river absorbs with ripple | 1 hr | `App.jsx`, `RiverSVG.jsx`, `HomePage.jsx` |
| Q11 | Haptics: restrained at key moments | 30 min | new `src/utils/haptics.js`, touch points |
| Q10 | Auto backup via File System Access API | 2.5 hr | `storage.js`, `SettingsPage.jsx` |
| Q6/Q16 | Dock = launchpad + tabs/search/accordion | 2 hr | `ShedPage.jsx` (post-breakup) |

### Cluster F: Large Features — Require Competition or New Architecture (9)
| # | Decision | Effort | Files | Competition? |
|---|----------|--------|-------|-------------|
| Q7/Q69 | FAB contextual morph + long-press radial menu | 3-4 hr | `TimerFAB.jsx` | Tier 2 Quick |
| Q8/Q17 | Living River Scene (tag analytics as objects) | 5-8 hr | `RiverSVG.jsx`, new `RiverObjects.jsx`, new `tagToObject.js` | **Tier 1 Celebrity** |
| Q13 | Swipe nav between tabs | 4-6 hr | `App.jsx`, `TabBar.jsx`, new `SwipeContainer.jsx` | Tier 3 Flash |
| Q13 | Pull-up Quick Log bottom sheet | 3-4 hr | new `QuickLogSheet.jsx`, `App.jsx`, `storage.js` | Tier 3 Flash |
| Q2/Q19 | Ceremony typeface: DM Serif Display | 1 hr | `index.css`, `ReadingCeremony.jsx`, `CelebrationOverlay.jsx`, `OnboardingFlow.jsx`, `ShareCard.jsx` | Tier 3 Flash |
| Q12/Q20 | 50h+ evolution: all 4 paths | 5-7 hr | `ReadingCeremony.jsx`, `milestones.js`, new files | Tier 2 Quick |
| Q5/Q24 | Architecture opening: beyond guitar | 2-3 hr | new `src/config/instrument.js`, `ShedPage.jsx` sub-components | Tier 3 Flash |
| Q4/Q30 | Vercel demo: video hero + Begin button | 2 hr | `vercel.json` (new), `public/index.html`, landing page | Tier 3 Flash |
| Q1 | Audio recording (deferred) | 8+ hr | new architecture | Tier 1 (later) |

### Cluster G: River Visual Enhancements (8)
| # | Decision | Effort | Files |
|---|----------|--------|-------|
| Q51 | River memory: golden milestone markers | 1 hr | `RiverSVG.jsx` |
| Q52 | New river = thin trickle with mist | 30 min | `RiverSVG.jsx` |
| Q53 | River responds to time of day | 30 min | `RiverSVG.jsx`, `SeasonContext.jsx` |
| Q31 | River speed tied to practice recency | 30 min | `RiverSVG.jsx` |
| Q54 | River sound syncs with visual speed | 45 min | `RiverSVG.jsx`, `audio.js` |
| Q63 | Seasons cascade through ENTIRE UI | 1.5 hr | `index.css`, `SeasonContext.jsx` |
| Q64 | Celebrations: river-themed (not confetti) | 1 hr | `CelebrationOverlay.jsx` |
| Q21/Q34 | River/seasonal ambient sounds | 2-3 hr | `audio.js`, `SeasonContext.jsx` |

---

## Dependency Graph

```
                    ┌─────────────────────────┐
                    │  1B. ShedPage Breakup    │
                    │  (CRITICAL PATH GATE)    │
                    └────────┬────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              v              v              v
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ Dock as     │  │ Chord      │  │ Practice   │
     │ Launchpad   │  │ Refinement │  │ Intelligence│
     │ (Q6/Q16)    │  │ (E synth)  │  │ (Q29)      │
     └────────────┘  └────────────┘  └────────────┘

  ┌──────────────────────────────────────────────────────┐
  │ INDEPENDENT OF SHEDPAGE BREAKUP (can start anytime)  │
  │                                                      │
  │  1A. Vercel Deploy          (standalone)             │
  │  1C. Design System Doc      (standalone)             │
  │  CSS Polish Pass            (index.css only)         │
  │  Haptics utility            (new file)               │
  │  Keyboard shortcuts         (App.jsx only)           │
  │  Onboarding 4th screen      (OnboardingFlow.jsx)     │
  │  Ceremony typeface          (index.css + ceremonies)  │
  │  River visual enhancements  (RiverSVG.jsx)           │
  │  BPM saving                 (SoundscapePanel.jsx)    │
  │  Export CSV                 (storage.js)             │
  │  Session log restructure    (LogPage.jsx)            │
  │  Timer micro-messages       (TimerFAB.jsx)           │
  │  Theme picker cards         (SettingsPage.jsx)       │
  │  Mood picker                (TimerFAB.jsx)           │
  └──────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────┐
  │ SEQUENTIAL DEPENDENCIES                              │
  │                                                      │
  │  Ceremony typeface ──→ 50h+ evolution (uses it)      │
  │  Haptics utility   ──→ FAB morph (uses haptics)      │
  │  Tag system (Q22)  ──→ Living River Scene (Q8/Q17)   │
  │  ShedPage breakup  ──→ Dock launchpad (Q6/Q16)       │
  │  ShedPage breakup  ──→ Swipe nav (gesture conflicts) │
  │  BPM saving (Q15)  ──→ Per-tag BPM (Q55)            │
  │  Mood picker (Q28) ──→ River mood visuals            │
  └──────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────┐
  │ COMPETITION BLOCKERS (design must precede build)     │
  │                                                      │
  │  Tier 1: Living River Scene (Q8/Q17)                 │
  │  Tier 2: FAB Morph Animation (Q7/Q69)               │
  │  Tier 2: 50h+ Evolution Ceremonies (Q12/Q20)         │
  │  Everything else: Tier 3 Flash (just build it)       │
  └──────────────────────────────────────────────────────┘
```

---

## Features That Are FREE (Already Done or < 5 Lines)

These cost zero or near-zero effort. They should be verified and checked off immediately:

| Decision | Why It's Free | Action |
|----------|---------------|--------|
| Q24 instrument field | `storage.js` line 133 already has `instrument: session.instrument \|\| 'guitar'` | Verify and mark done |
| Q33 session notes | `note` field already exists on every session | Mark done |
| Q23 smart routing | App.jsx lines 23-28 already route by practiced-today | Mark done |
| Q40 undo toast | UndoToast component exists in App.jsx lines 330-379 | Mark done |
| Q45 16px font base | index.css line 117: `font-size: 16px` on inputs | Mark done |
| Q46 FAB bottom-right | TimerFAB line 369: `right: '20px'` | Mark done |
| Q47 icons + labels | TabBar.jsx has both icon SVG and label text | Mark done |
| Q65 Milne quote fixed | TabBar.jsx line 53 | Mark done |
| Q42 poetic empty state | HomePage.jsx line 109: "Your river begins with one drop" | Mark done |
| Q37 no push notifications | Nothing to build | Mark done |
| Q39 no data viz beyond river | Architectural constraint | Mark done |
| Q32 no numeric goals | No goals UI exists | Mark done |
| Q36 dark mode default | 1 line change in ThemeContext.jsx | 10 min |

**13 of 70 decisions are already done or free.** This means 57 remain.

---

## Parallel Execution Batches

### Batch 0: Instant Wins (1 agent, 30 minutes)
*Zero-risk changes that can ship immediately.*

| Task | File | Time |
|------|------|------|
| Verify 13 FREE decisions above | multiple | 10 min |
| Dark mode as true default (Q36) | `ThemeContext.jsx` | 5 min |
| Elastic bounce scroll (Q48) | `index.css` line 89 | 2 min |
| Page transition timing (Q49) | `index.css` | 5 min |
| Animation timing audit (Q44) | `index.css` | 10 min |

### Batch 1: Infrastructure (1 agent, 2 hours) — CRITICAL PATH
*Must complete before Batches 3+*

| Task | File | Time |
|------|------|------|
| **ShedPage breakup** | `ShedPage.jsx` -> 7+ files | 1.5 hr |
| Design system doc | new `.claude/design-system-rules.md` | 30 min |

**ShedPage Breakup Plan (precise):**
The 1,170 lines divide cleanly at these boundaries (identified from grep):
- Lines 4-108: Music theory data + functions -> `src/utils/musicTheory.js`
- Lines 110-135: Progressions + intents -> stays in `musicTheory.js`
- Lines 138-309: `FretboardDiagram` -> `src/components/dock/FretboardDiagram.jsx`
- Lines 310-364: `PositionDiagram` -> `src/components/dock/PositionDiagram.jsx`
- Lines 365-428: `ChordCard` + `CircleOfFifths` -> `src/components/dock/CircleOfFifths.jsx`
- Lines 429-596: Chord voicing DB + `ChordDiagram` -> `src/components/dock/ChordDiagram.jsx`
- Lines 597-646: `TuningStrip` -> `src/components/dock/TuningStrip.jsx`
- Lines 648-767: `ProgressionStrips` + PracticeIntelligence -> `src/components/dock/ProgressionPanel.jsx`
- Lines 769-893: `QuickStartCards` + `CurrentCard` -> `src/components/dock/CurrentCard.jsx` + `QuickStartCards.jsx`
- Lines 896-end: Main `ShedPage` layout -> stays as `ShedPage.jsx` (thin shell, ~100 lines)

**Risk:** High-confidence refactor. All functions are already isolated with clear boundaries. No shared mutable state between sections. Imports are clean (only `storage.js` and React).

### Batch 2: Parallel Agent Sprint (3+ agents, ~2 hours each)
*These touch DIFFERENT files and can run simultaneously.*

| Agent | Tasks | Files | Time |
|-------|-------|-------|------|
| **Agent A: Timer+FAB** | Timer micro-messages (Q58), Mood picker (Q28), BPM saving (Q15) | `TimerFAB.jsx`, `SoundscapePanel.jsx`, `storage.js` | 2.5 hr |
| **Agent B: Home+River** | Streak warmth (Q25), Pull-to-refresh (Q70), River time-of-day (Q53), River speed (Q31), New river trickle (Q52), Total hours subtle (Q61) | `HomePage.jsx`, `RiverSVG.jsx` | 2.5 hr |
| **Agent C: Settings+Infra** | Theme preview cards (Q66), Backup health dot (Q62), CSV export (Q60), Auto backup (Q10), Warm error messages (Q43) | `SettingsPage.jsx`, `storage.js`, `ErrorBoundary.jsx` | 3 hr |
| **Agent D: Ceremonies+Onboarding** | Ceremony typeface application (Q2/Q19), Onboarding 4th screen (Q9/Q27), River-themed celebrations (Q64), Loading screen (Q41) | `OnboardingFlow.jsx`, `CelebrationOverlay.jsx`, `ReadingCeremony.jsx`, `index.css` | 2 hr |

### Batch 3: Post-Breakup Features (2 agents, after Batch 1)
*Depend on ShedPage being broken up.*

| Agent | Tasks | Files | Time |
|-------|-------|-------|------|
| **Agent E: Dock Redesign** | Dock as launchpad (Q6), Tabs/search/accordion (Q16), Practice Intelligence strengths-based (Q29), Suggestion stability (Q57) | `ShedPage.jsx` shell, `CurrentCard.jsx`, `QuickStartCards.jsx` | 3 hr |
| **Agent F: Navigation** | Keyboard shortcuts (Q38), Swipe nav (Q13a) | `App.jsx`, `TabBar.jsx`, new `SwipeContainer.jsx` | 4-6 hr |

### Batch 4: Competition-Dependent Features (sequential)
*These require design competitions before building.*

| Feature | Competition | Build Time | Depends On |
|---------|-------------|------------|------------|
| FAB Morph + Radial Menu (Q7/Q69) | Tier 2 Quick (1 hr) | 3-4 hr | Haptics utility |
| Living River Scene (Q8/Q17) | **Tier 1 Celebrity (2-3 hr)** | 5-8 hr | Tag system (Q22), RiverSVG breakout |
| 50h+ Evolution (Q12/Q20) | Tier 2 Quick (1 hr) | 5-7 hr | Ceremony typeface |

### Batch 5: Late-Stage Features (after everything else)

| Task | Time | Files |
|------|------|-------|
| Quick Log bottom sheet (Q13b/Q18) | 3-4 hr | new `QuickLogSheet.jsx`, `App.jsx` |
| River/seasonal ambient sounds (Q21/Q34) | 2-3 hr | `audio.js`, `SeasonContext.jsx` |
| Seasons cascade ENTIRE UI (Q63) | 1.5 hr | `index.css`, `SeasonContext.jsx` |
| Golden milestone markers in river (Q51) | 1 hr | `RiverSVG.jsx` |
| Share cards: milestone-only with river (Q26) | 1 hr | `ShareCard.jsx` |
| Architecture opening: beyond guitar (Q5) | 2-3 hr | new `instrument.js` |
| Vercel demo landing page (Q4/Q30) | 2 hr | new files |

### Batch 6: Deferred
| Feature | Why Deferred |
|---------|-------------|
| Audio recording (Q1) | Max said "deferred," requires new architecture |
| Competition C: pitch deck narrative | Not blocking anything |
| Multi-instrument UI (Q24 beyond schema) | Schema is done, UI is far future |

---

## The Speed Run

If Max says "ship everything in one marathon session," here is the optimal ordering. This assumes a single agent working sequentially, choosing the order that **minimizes wasted context switches** and **unblocks the most downstream work earliest**.

### Phase S1: Sweep (30 min)
Mark 13 FREE decisions as done. Apply 5 CSS one-liners (Q36, Q48, Q49, Q44, Q50-audit).

### Phase S2: The Big Breakup (1.5 hr)
ShedPage.jsx -> 10 files. This unblocks everything in Batches 3-5.

### Phase S3: Data Layer (1 hr)
All storage.js changes in one pass: CSV export (Q60), tag system update (Q22), BPM field (Q15/Q55), mood field for Q28.

### Phase S4: Timer + FAB Cluster (2 hr)
All TimerFAB.jsx changes in one pass: micro-messages (Q58), mood picker (Q28), haptics integration. Then SoundscapePanel.jsx: BPM saving (Q15), per-tag BPM (Q55).

### Phase S5: Home + River Cluster (2.5 hr)
All HomePage.jsx changes: streak warmth (Q25), total hours subtle (Q61), pull-to-refresh (Q70). Then RiverSVG.jsx: time-of-day (Q53), speed-from-recency (Q31), trickle (Q52), river-absorbs-ripple (Q67).

### Phase S6: Ceremony Cluster (2 hr)
Ceremony typeface in index.css (Q2/Q19). Apply to: ReadingCeremony, CelebrationOverlay (river-themed, Q64), OnboardingFlow (4th screen, Q9/Q27), ShareCard. Loading screen (Q41).

### Phase S7: Settings + Infrastructure (2 hr)
SettingsPage.jsx: theme preview cards (Q66), backup health dot (Q62), auto backup (Q10). ErrorBoundary.jsx: warm messages (Q43). App.jsx: keyboard shortcuts (Q38).

### Phase S8: Dock Redesign (2 hr)
Post-breakup ShedPage shell: launchpad layout (Q6), tabs/search/accordion (Q16). CurrentCard: strengths-based intelligence (Q29). Suggestion stability (Q57).

### Phase S9: Navigation (4 hr)
Swipe container (Q13a). Quick Log bottom sheet (Q13b/Q18). This is the most complex single feature.

### Phase S10: Competitions + Build (8-12 hr)
Run Tier 2 Quick for FAB morph -> build it (4 hr total). Run Tier 1 Celebrity for Living River Scene -> build it (8 hr total). Run Tier 2 Quick for 50h+ evolution -> build it (6 hr total).

### Phase S11: Polish + Late Stage (4 hr)
River visual enhancements cluster (Q51, Q54, Q63). Ambient sounds (Q21/Q34). Season cascade (Q63). Vercel deploy + landing page (Q4/Q30).

**Speed Run Total: ~30 hours** (not counting competition deliberation time).
With 3 parallel agents on Batches 2-3: ~18 hours calendar time.

---

## Competition Tiers: Actual Assessment

v1 said 2 competitions were needed. After analyzing all 70 decisions:

| Feature | v1 Said | v2 Says | Rationale |
|---------|---------|---------|-----------|
| Living River Scene (Q8/Q17) | Tier 1 | **Tier 1 Celebrity** (agree) | Max's most creative decision. The "fish and boats" concept is entirely new visual language. Needs full treatment. |
| FAB Morph (Q7/Q69) | Tier 2 Quick | **Tier 2 Quick** (agree) | Animation design matters but scope is contained. 3 proposals, 2 rounds. |
| 50h+ Evolution (Q12/Q20) | not listed | **Tier 2 Quick** | 4 evolution paths need coherent design. But the margin note system already exists, so it's extension not invention. |
| Dock Launchpad (Q6/Q16) | not listed | **Tier 3 Flash** | Max already described exactly what he wants. Tabs + search + accordion. Just build it. |
| Swipe Nav (Q13) | not listed | **Tier 3 Flash** | Engineering problem, not design problem. The gesture handling is the hard part. |
| Everything else | — | **Tier 3 Flash** | Clear requirements from Q1-Q70. No ambiguity. Just build. |

**Total competition time: ~4 hours** (1 Tier 1 + 2 Tier 2). Down from potentially 10+ hours if we over-competed.

---

## Risk Assessment

### High Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Swipe nav breaks horizontal scrolling** | Chord progressions, Circle of Fifths, CAGED all have horizontal scroll. Swipe between tabs will conflict. | Must use touch-start direction detection (horizontal > vertical = page swipe, else scroll). Test with ALL scroll containers. Budget 6 hours, not 3. |
| **File System Access API browser support** | Only Chrome/Edge. Safari: no. Firefox: no. | Graceful fallback to manual export (already exists). Show API availability in Settings. |
| **Living River Scene performance** | SVG objects (fish, boats) in an already complex RiverSVG (781 lines) could cause jank on mobile. | Use `will-change`, minimize repaints, consider canvas for objects layer. Performance test on real device. |
| **ShedPage breakup introduces regressions** | 1,170 lines being split means lots of import paths changing. | Extract one component at a time. Test after each extraction. Commit after each. |

### Medium Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Ceremony typeface loading** | DM Serif Display (20KB) adds to initial load. | Preload with `<link rel="preload">`. Font-display: swap. Only loads once. |
| **Quick Log bottom sheet z-index wars** | The app already has FAB (z-40), tab bar (z-30), celebrations (z-50), onboarding (z-200). A bottom sheet needs its own z-layer. | Establish z-index scale in design system doc. |
| **Mood picker adds complexity to session save flow** | Timer stop -> note + tags + mood + save is getting heavy. | Keep mood as one-tap emoji row. Do not add a separate screen. |

### Low Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| All CSS-only changes | Minimal regression risk | Batch them, visual test once |
| Keyboard shortcuts | Only affects desktop | Standard patterns, low risk |
| Haptics utility | Feature-detects, no-ops gracefully | Already pattern in CelebrationOverlay line 30 |

---

## Force Multiplier Features

These features, if built first, make all subsequent features easier or better:

1. **ShedPage Breakup** (Batch 1): Unblocks 5+ features and makes every future Dock change safer and faster. This is the single highest-leverage task.

2. **Haptics Utility** (`src/utils/haptics.js`): A 20-line utility that every interactive feature will use. Build once, import everywhere. Currently haptics are inline (`navigator.vibrate?.([50, 30, 80])` in CelebrationOverlay, `[40, 20, 60]` in App.jsx). Centralizing prevents inconsistency.

3. **Design System Doc** (Batch 1): Every future agent session starts faster. The current design system is implicit (scattered across 817 lines of index.css). Making it explicit saves 15-30 minutes per session.

4. **Tag System Upgrade (Q22)**: The 6-core-tag system powers the Living River Scene (Q8), BPM memory (Q55), Practice Intelligence (Q29), and mood analysis. Getting the data model right early prevents refactors later.

5. **Animation Timing Constants**: Defining `--timing-interaction: 150ms` and `--timing-ceremony: 800ms` as CSS custom properties means all future animations automatically use the right speed.

---

## Reuse Opportunities

| Existing Pattern | Can Be Reused For |
|------------------|-------------------|
| `UndoToast` (App.jsx) | Any confirmation toast (session save, backup complete, export done) |
| `CelebrationOverlay` animation system | River-themed celebrations (Q64), session save ripple (Q67) |
| `ReadingCeremony` phase system | 50h+ evolution ceremonies (Q12) — same intro/notes/closing structure |
| `SoundscapePanel` audio architecture | River ambient sounds (Q21/Q34) — same Web Audio API patterns |
| `SeasonContext` CSS variable cascade | Season-colored tab glow (Q68), UI-wide season cascade (Q63) |
| `SignalFireCard` re-engagement pattern | Any contextual card that appears and dismisses |
| `.card` + `.glass` CSS classes | Quick Log bottom sheet, FAB radial menu, theme preview cards |
| `CustomEvent('river-start-timer')` bridge | Any cross-component communication (Quick Log -> save, etc.) |
| `loadPrefs`/`savePrefs` pattern (SoundscapePanel) | BPM memory, mood history, any per-feature preferences |

---

## CSS-Only Polish Pass (Single Commit)

These can all be batched into one `index.css` editing session:

1. Elastic bounce scroll (Q48): Change `overscroll-behavior: none` to `overscroll-behavior-y: auto`
2. Page transition timing (Q49): Adjust exit 150ms->100ms, enter 300ms->200ms
3. Animation timing constants (Q44): Add `--timing-interaction` and `--timing-ceremony` vars
4. Active tab season glow (Q68): Add season-aware glow to `.glass` tab bar active state
5. Touch target audit (Q50): Verify all buttons meet 44px minimum
6. Ceremony typeface class refinement (Q2): `.ceremony-text` already exists at line 109, verify usage
7. Font preload for DM Serif Display

**Total: 45 minutes, 1 file, 1 commit.**

---

## Total Time Estimate with Confidence Intervals

### By Category
| Category | Optimistic | Expected | Pessimistic |
|----------|-----------|----------|-------------|
| FREE decisions (verify) | 10 min | 15 min | 30 min |
| CSS polish pass | 30 min | 45 min | 1.5 hr |
| ShedPage breakup | 1 hr | 1.5 hr | 3 hr |
| Small component changes (12) | 3 hr | 5 hr | 8 hr |
| Medium features (10) | 8 hr | 13 hr | 20 hr |
| Competitions (3) | 3 hr | 5 hr | 8 hr |
| Large features post-competition (3) | 10 hr | 16 hr | 24 hr |
| Late-stage features | 6 hr | 10 hr | 15 hr |
| **TOTAL** | **31 hr** | **51 hr** | **80 hr** |

### By Execution Strategy
| Strategy | Calendar Time | Agent-Hours |
|----------|--------------|-------------|
| Single agent, sequential | 51 hr (7 sessions) | 51 hr |
| 3 parallel agents | 30 hr (4 sessions) | 60 hr |
| Speed run (1 agent, no breaks) | 30 hr | 30 hr |
| Speed run (3 agents) | **18 hr (2-3 sessions)** | 40 hr |

### What "Done" Means
All 70 decisions implemented or explicitly deferred. App deployed on Vercel. ShedPage under 200 lines. All competitions run. Living River Scene alive with fish and boats. The river has weather, sound, and ceremony.

---

## Recommended Execution Order

If executing session-by-session (the normal mode):

**Session 12:** Batch 0 (instant wins) + Batch 1 (ShedPage breakup + design system). Then start Batch 2 Agent A (Timer/FAB cluster). Commit after every sub-task. Push at session end. *~3-4 hours.*

**Session 13:** Complete Batch 2 (all 4 agent tracks, or as many as fit). Focus on Home+River and Settings+Infra. *~4-5 hours.*

**Session 14:** Batch 3 (Dock redesign post-breakup). Run Tier 2 Quick competition for FAB morph, then build it. *~4-5 hours.*

**Session 15:** Run Tier 1 Celebrity competition for Living River Scene. Build it. This is the session's main event. *~6-8 hours.*

**Session 16:** Navigation (swipe + Quick Log). Run Tier 2 Quick for 50h+ evolution. *~5-6 hours.*

**Session 17:** 50h+ evolution build. Late-stage features. Vercel deploy. Final polish. *~4-5 hours.*

---

*This roadmap was built by reading every source file, every decision, and every line of the v1 plan.*
*Confidence: 80% that expected estimates are within 1.5x of actual.*
*March 7, 2026 — Session 11, v2*
