# The River — Overnight Work Plan

> Master coordination document for parallel workstreams.
> Created: March 6, 2026
> Status: **ACTIVE**

---

## Overview

Four workstreams running in parallel overnight while Max sleeps. Each uses the established design competition protocol (constraint-based personas, 5-round brackets, structured feedback). All coordination happens through files in this `docs/` directory.

---

## Workstreams

### WS1: Pitch Deck — Flowing River Visualization
**Status:** `PENDING`
**Competition file:** `competitions/river-viz.md`
**Target file:** `public/pitch.html`
**Goal:** Replace the static 2px river-thread with a living, scroll-responsive river that adapts its shape, color, width, and character per slide. The river IS the narrative spine — it starts as a trickle (Hook), turns turbulent/coral (Wound), calms to amber (Philosophy), centers behind the device (Product), widens with confidence (Proof), and fans into a golden delta (Ask).
**Dependencies:** None. Can start immediately.
**Blocks:** WS2 (demo content should be added after the river is in place)

### WS2: Pitch Deck — Demo Content & Animations
**Status:** `BLOCKED` (waiting on WS1)
**Target file:** `public/pitch.html`
**Goal:** Add 2-3 new slides with CSS-animated device mockups showing:
- The logging flow (start timer → practice → save → river grows)
- Fog Horn activation (long-press streak pill → mist appears → bottle delivered)
- Milestone celebrations (hours hit threshold → celebration overlay → milestone unlocked)
These are pure CSS/HTML animations inside device frames — no screenshots needed, the animations ARE the demo.
**Dependencies:** WS1 must complete first (river changes the whole deck's visual language).

### WS3: App Overhaul — Image, Sound & Timer
**Status:** `PENDING`
**Competition file:** `competitions/app-overhaul.md`
**Target files:** Multiple — `src/utils/audio.js`, `src/components/TimerFAB.jsx`, `src/index.css`, various components
**Goal:** Design competition covering three interconnected problems:
1. **Image** — The overall visual design. Does the Liquid Glass system need evolution? Are there rough edges, inconsistencies, or areas where the design doesn't feel premium?
2. **Sound** — Rain was rewritten to brown noise + 3 layers, metronome to triangle wave + noise burst. Does it go far enough? Are there other soundscape improvements?
3. **Timer** — TimerFAB.jsx exists with start/pause/stop/save flow. Does the UX feel right? Is the expanded view compelling enough?
**Dependencies:** None. Can start immediately.

### WS4: Guitar Reference Documents
**Status:** `PENDING`
**Competition file:** `competitions/guitar-refs.md`
**Target files:** New components + new utility files in `src/`
**Goal:** Design competition to determine:
1. **What reference material to include** — Scale diagrams (pentatonic, major, minor, blues), chord charts (open chords, barre shapes, common progressions), fretboard note maps, tuning reference, interval charts, common strumming patterns, fingerpicking patterns, etc.
2. **How to present it** — Dedicated reference page? Slide-out panel? Searchable? Interactive fretboard? SVG-rendered or static? Does it integrate with the practice timer (e.g., "practice this scale")?
3. **Visual design** — Must fit the Liquid Glass design language. Scale/chord diagrams should be beautiful, not just functional.
**Dependencies:** None. Can start immediately.

---

## Dependency Graph

```
WS1 (River viz) ──────→ WS2 (Demo content)
        ↕ independent
WS3 (App overhaul) ──── runs in parallel
WS4 (Guitar refs)  ──── runs in parallel
```

**Parallel batch 1:** WS1, WS3, WS4 (all competitions + implementation)
**Sequential after WS1:** WS2

---

## File Map — Where Everything Lives

```
docs/
  OVERNIGHT-PLAN.md              ← You are here
  competitions/
    river-viz.md                 ← WS1 competition results
    app-overhaul.md              ← WS3 competition results
    guitar-refs.md               ← WS4 competition results
  briefs/
    AGENT-BRIEF.md               ← Comprehensive instruction doc for any agent

public/
  pitch.html                     ← WS1 + WS2 target (pitch deck)

src/
  utils/audio.js                 ← WS3 target (sound — already rewritten)
  components/TimerFAB.jsx        ← WS3 target (timer)
  components/HomePage.jsx        ← WS3 target (image)
  index.css                      ← WS3 target (design system)
  components/[new].jsx           ← WS4 target (guitar reference components)
  utils/[new].js                 ← WS4 target (guitar reference data)
```

---

## Agent Allocation

| Phase | Task | Model | Rationale |
|-------|------|-------|-----------|
| Competition proposals | 3 agents x 5 ideas each | Sonnet x3 parallel | Generation under constraints |
| Bracket evaluation | Scoring, iteration, feedback | Opus | Judgment + nuance |
| Implementation | Code the winning approach | Sonnet (clear spec) / Opus (ambiguous) | Depends on spec clarity |
| Verification | Build check, visual test | Haiku or direct tools | Cheapest possible |

---

## Status Tracking

| WS | Phase | Status | Last Updated |
|----|-------|--------|--------------|
| WS1 | Competition | `PENDING` | — |
| WS1 | Implementation | `PENDING` | — |
| WS2 | Implementation | `BLOCKED` | — |
| WS3 | Competition | `PENDING` | — |
| WS3 | Implementation | `PENDING` | — |
| WS4 | Competition | `PENDING` | — |
| WS4 | Implementation | `PENDING` | — |

---

## Completion Criteria

- [ ] WS1: River flows through all 11 slides, adapts per slide, smooth scroll interpolation
- [ ] WS2: 2-3 demo slides with animated mockups of logging, fog, milestones
- [ ] WS3: Sound, timer, and image improvements implemented and verified
- [ ] WS4: Guitar reference docs designed, implemented, accessible from the app
- [ ] All changes build successfully (`npm run build`)
- [ ] Visual verification via preview screenshots

---

## Notes for Agents

1. **The design competition protocol** is documented in `DESIGN-COMPETITION-RETROSPECTIVE.md` in the main repo. Key takeaways: use constraint-based personas (not attitude-based), structured feedback (Strength/Weakness/What-if), devil's advocate on consensus, cross-pollination from eliminated ideas.

2. **The app stack**: React 19 + Tailwind CSS v4 + Vite 7. PWA, no backend, localStorage only. Node 20 required (at `/usr/local/opt/node@20/bin`).

3. **Design language**: "Liquid Glass" — frosted glass panels, `backdrop-filter: blur(40px)`, specular highlights, ambient glow, deep blue/indigo palette.

4. **pitch.html** is a standalone HTML file with zero dependencies (no React, no build step). All CSS and JS inline. It runs at `/pitch.html` on the dev server.

5. **The dev server** runs via `.claude/launch.json` config named `river-dev` on port 5173.
