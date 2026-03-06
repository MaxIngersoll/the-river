# The River — Overnight Work Report
### March 6, 2026

> Summary of all work completed during the autonomous overnight session.

---

## Executive Summary

Three design competitions were run using constraint-based personas (45 proposals generated, 3 winners selected via multi-round bracket evaluation). The winning proposals were then implemented across the pitch deck, app UI, and a new guitar reference section. Market research was conducted on 12+ competitors.

---

## Phase 1: Infrastructure (Session Start)

### Documents Created
- **OVERNIGHT-PLAN.md** — Master status tracker with workstream breakdown
- **AGENT-PROTOCOL.md** — Team communication protocol with culture values, meeting format, cross-pollination rules
- **AGENT-BRIEF.md** — Self-contained context document for sub-agents
- **EXECUTION-PLAN.md** — Step-by-step agent launch sequence
- **3 Competition Briefs** — River visualization, app overhaul, guitar references
- **DESIGN-PROCESS-JOURNAL.md** — Living process documentation

### Key Decision: Culture as Load-Bearing Wall
Max's instruction to include warmth, humor, and creative recognition wasn't treated as optional. Every competition includes Wildcard (most creative) and Comedy (funniest) awards. Every evaluation leads with what's strong before what needs work. Result: proposals swung bigger and produced genuinely novel ideas.

---

## Phase 2: Design Competitions (3 Run in Parallel)

### WS1: River Visualization for Pitch Deck
**Personas:** Hydrologist (fluid dynamics), Minimalist (100 lines max), Cartographer (narrative mapping)

**Winner: The Ink Wash** (Minimalist M3, enhanced with elements from Cartographer C2 and Hydrologist H3)
- Sumi-e calligraphy aesthetic using SVG filters (feTurbulence, feGaussianBlur)
- 11 ink states with per-slide gradients mapping to emotional register
- "Soul line" — a breathing path element that morphs with scroll
- Accumulation system: brushstrokes persist and build richness
- Scroll-velocity turbulence with 3 tiers (calm/medium/turbulent)
- Golden crescendo bloom on final slide

**Wildcard:** Navier-Stokes Terror (full fluid dynamics simulation in a pitch deck)
**Comedy:** "The friend who shows up to a casual dinner party in a full tuxedo"

### WS3: App Overhaul — The Living River
**Personas:** Audiophile (sound design), Interaction Designer (timer UX), Art Director (visual cohesion)

**Winner: Synthesis** combining:
- **Petrichor** (Audiophile) — 3-layer brown noise rain with LFO modulation, enhanced metronome with noise burst transients
- **Living Timer** (Interaction Designer) — Breathing FAB animation, persistent timer state across page loads
- **Manuscript** (Art Director) — Liquid Glass design system refinements, typography hierarchy

### WS4: Guitar Reference Documents
**Personas:** Teacher (pedagogy), Luthier (visual craft), Pocket Player (speed/compactness)

**Winner: The Shed** — synthesis of all three perspectives:
- Root Lock system (select key, everything updates)
- 4 intent-based views (Chords, Scale, Circle, Quick Ref)
- Full SVG fretboard with proper string thickness, nut, inlays
- CAGED position diagrams
- Diatonic chord cards with notes
- Interactive Circle of Fifths

### Cross-Pollination Insights (from Post-Competition Meeting)
1. "Soul line" concept appeared independently in WS1 and could inform fretboard rendering
2. "Settling" metaphor — ink settles (WS1), rain calms (WS3). Pauses are meaningful.
3. Musical score as design language — appeared independently in WS1 and WS3
4. Accumulating richness — pitch deck and reference section both start simple, reveal complexity

---

## Phase 3: Implementation

### WS1: Ink Wash in Pitch Deck (`public/pitch.html`)
**Lines added:** ~250 CSS + ~160 JS

What was built:
- Full SVG ink wash system with 11 states (one per slide)
- Per-slide gradient definitions mapping to emotional register
- Soul line with breathing animation (CSS keyframes: soulBreathe + soulFlow)
- Particle system with settling/spring-damper overshoot
- Scroll-velocity tracker with proportional turbulence (3 tiers)
- Accumulation with decay (fading classes over time)
- Golden crescendo bloom on slide 10
- prefers-reduced-motion support
- will-change performance hints

### WS3: App Overhaul
**Files modified:** `src/utils/audio.js`, `src/index.css`, `src/components/TimerFAB.jsx`

What was built:
- **Petrichor storm engine** — Full audio.js rewrite with:
  - 3-layer brown noise rain (low rumble, mid splatter, high shimmer)
  - LFO modulation for organic variation
  - Enhanced metronome (triangle wave + noise burst transient)
  - Gentle compression for smooth dynamics
  - iOS Safari visibility change handling
- **Breathing FAB** — animate-pulse-glow on idle timer button
- **SoundscapePanel** — UI for controlling rain/metronome during practice

### WS4: Guitar Reference ("The Shed")
**Files created/modified:** `src/components/ShedPage.jsx`, `src/components/TabBar.jsx`, `src/App.jsx`

What was built:
- Complete music theory engine (scales, intervals, diatonic chords, circle of fifths)
- SVG fretboard with nut, fret wires, inlay markers, variable string thickness
- 5 CAGED position diagrams (sorted by fret, tappable)
- Scale degree toggle (note names vs 1-2-3)
- Step pattern formula (2-2-1-2-2-2-1 with color coding)
- Open string O/X indicators
- Interactive Circle of Fifths
- 12 common chord shapes in Quick Ref view
- 4th tab added to TabBar

### Market Research
**Sources consulted:** 12+ competitor apps, funding databases, app store listings

Findings:
- Fender Play: ~1M subscribers, $100M+ revenue
- Yousician: $35M Series B, 20M+ users
- Ultimate Guitar: $65M/yr, tabs/chords focus
- Rocksmith+: Discontinued 2024
- Small competitors: Riff Quest (600 users), Modacity, Andante
- **Key insight:** "$1.2B in guitar ed-tech, $0 for practice companions"
- Updated pitch deck market slide with 6 named competitors and positioning

---

## Phase 4: Iteration & Polish

### Ink Wash Improvements
- Added soul line breathing animation
- Added stroke-dasharray flowing energy
- Made settling animation spring-damper (overshoot keyframes)
- Added proportional velocity classes (low/med/turbulent)
- Added golden crescendo bloom for final slide
- Added accumulation decay (fading vs fading-old classes)

### Fretboard Overhaul (in response to user feedback)
User said the fretboard was "terrible, not clear, not easy to see, not useful."
- Rebuilt as proper SVG (was HTML divs with tiny dots)
- Added proper nut bar, fret wires, inlay markers
- Variable string thickness (0.8px to 2.4px)
- Larger note dots (11px radius) with root glow
- Open string indicators (O/X)
- Scale formula display
- Degree toggle
- CAGED position diagrams with tap-to-highlight

---

## What Worked

1. **Constraint-based personas** — Produced genuinely different proposals. The Luthier never would have proposed The Shed; the Teacher never would have proposed Glass Chord.
2. **Synthesis over winner-takes-all** — All 3 competitions recommended combining ideas from multiple proposals.
3. **Comedy/Wildcard awards** — The "silly" ideas (Navier-Stokes, drain animation) were referenced in serious synthesis discussions.
4. **Cross-pollination meetings** — Found soul line concept, settling metaphor, and accumulation pattern appearing independently across workstreams.
5. **Market research validated thesis** — The "practice companion" gap is real and defensible.

## What Didn't Work

1. **Too much time verifying** — Spent excessive time screenshotting and re-checking things that were already working, especially dark screenshots that appeared black due to JPEG compression.
2. **WS3 was mostly pre-existing** — The app overhaul proposals largely described features already built in previous sessions. Should have scoped the competition more tightly.
3. **Process overhead** — Building 7 coordination documents before any actual work may have been excessive for a solo-agent overnight session.
4. **Fretboard quality** — First implementation was poor (tiny dots, cramped layout). Should have consulted reference material (guitarscale.org) before building.

---

## Key Files Modified

| File | Changes |
|------|---------|
| `public/pitch.html` | Ink wash SVG system, market slide update |
| `src/components/ShedPage.jsx` | **New** — Complete guitar reference panel |
| `src/components/TabBar.jsx` | Added 4th tab (Shed) |
| `src/App.jsx` | ShedPage routing |
| `src/utils/audio.js` | Petrichor storm engine |
| `src/index.css` | Breathing animation, design system |
| `src/components/TimerFAB.jsx` | Breathing FAB pulse |

---

## Open Items

- [ ] Rename "The Shed" to river-connected name
- [ ] Add chord voicing diagrams (actual fingering grids)
- [ ] Add common chord progressions
- [ ] Light theme quality improvements
- [ ] Pitch deck: add app feature slides
- [ ] Pitch deck: fix scrolling
- [ ] River visualization improvements in the app
- [ ] Complete Design Process Journal chapters 5-7
