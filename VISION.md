# The River — Vision, Feedback & Design Philosophy

> This is a living document. Every session updates it. Every new Claude reads it first.
> **Last updated:** March 6, 2026

---

## What This Is

**The River** is a guitar practice tracking app that visualizes your practice sessions as a flowing river. The more you practice, the wider and deeper your river grows. Built with React 19 + Tailwind CSS v4 + Vite 7, stored entirely in localStorage. PWA, no backend.

It's not a dashboard. It's a *place*. The river metaphor isn't decorative — it's the soul of the product.

---

## Max's Design Philosophy

### Core Beliefs
- **Practice is a relationship, not a metric.** The app should feel like it knows you. Rest days aren't failure — they're the river resting.
- **Every screen should be beautiful enough to screenshot.** If it looks like a generic app, push harder.
- **The process matters as much as the product.** How we build reflects what we're building. Creative safety, warmth, humor, radical encouragement.
- **Constraint-based design > brainstorming.** Give agents constraints (Hydrologist, Minimalist, Luthier) not attitudes (Dreamer, Architect). Constraints force divergence.

### Aesthetic Direction
- **"Liquid Glass"** — Frosted panels, `backdrop-filter: blur(40px) saturate(180%)`, specular highlights, ambient glow
- **Deep blue/indigo palette** — Inspired by Apple Health's Sleep/Mindfulness. Nocturnal. The quiet hours when musicians actually practice.
- **Apple-quality feel** — Not Apple copycat. But the same level of care. Think: Apple Health, Linear, Notion.
- **Poetic, not clinical** — Serif fonts for quotes. River metaphors everywhere. "Your river begins with one drop."

### Non-Negotiables
- **No GitHub-style heatmap calendar.** Max explicitly said no to this.
- **No gamification traps.** No punishing language, no "you broke your streak," no guilt. The river cools when you're away — it doesn't die.
- **Commit early, commit often.** Never let significant work accumulate uncommitted. Every feature gets its own commit.
- **Update this document.** After every meaningful decision, VISION.md gets updated. After every session, session history gets appended.

---

## Key Feedback History

### Session 1: Birth
- Built entire app from scratch. Core river concept, milestones, quotes, streaks.

### Session 2: Liquid Glass
- Max: *"This still doesn't look like Apple Health. It doesn't have the liquid glass."* — This challenge sparked the entire visual identity.
- Solved: frosted glass cards, specular highlights, inner refraction glow, dual-theme system.

### Session 3: Vision Expansion
- Chose deep blue/indigo palette (over the original teal/green)
- Chose persistent floating action button for timer UX
- Both implemented.

### Session 4: Fog Horn & The Source
- Massive feature session: rest days (Fog Horn), session-5 question (The Source), margin notes, Reading ceremonies, Signal Fire re-engagement, message-in-a-bottle, insights engine, share cards, soundscape panel, error boundary, offline support.
- Design competition lesson: **constraint-based personas** (Archaeologist, Minimalist, Contrarian) produced far better results than attitude-based personas (Dreamer, Architect, Poet).
- The Reading (silent margin notes that surface at 50 hours) was the session's breakthrough — born from honest criticism that nearly killed the idea.

### Session 5: Overnight Competitions
- Ran 3 design competitions in parallel using the established protocol.
- **WS1 winner: "The Ink Wash"** — Sumi-e calligraphy for pitch deck river (implemented in pitch.html)
- **WS3 winner: "Synthesis"** — Petrichor audio + Living Timer + Manuscript (partially implemented)
- **WS4 winner: "The Shed"** — Full guitar reference panel (implemented in ShedPage.jsx)
- Market research: "$1.2B in guitar ed-tech, $0 for practice companions"
- **Problem:** Work was left uncommitted in loving-euclid worktree. Lost session context. This caused frustration.
- Max's feedback on fretboard: *"terrible, not clear, not easy to see, not useful"* — rebuilt as proper SVG with nut, frets, inlays, proper sizing.

### Session 6: Resumption
- Recovered all context from loving-euclid worktree docs
- Created this VISION.md to prevent context loss
- Evaluated all 4 competitions (A–D), implemented winners for B, D Phase 1, A Phase 1

### Session 7: The Current Card + Quick Start
- Implemented Practice Intelligence engine (Continue/Explore/Challenge)
- Built CurrentCard: context-aware smart suggestion at top of The Dock
- Built QuickStartCards: triptych of practice modes
- Added `sessions` + `onNavigate` props from App.jsx to ShedPage

### Session 8 (Current): Three Features + Two Competitions
- **Methodology Reflection:** Created `docs/competitions/METHODOLOGY.md` — captured lessons from past competitions. Key innovation: "Build While Competing" (implement foundations while competitions run in background).
- **Competition E: "The Fingers & The Flow"** — Chord diagrams + timer integration. Winner: B6 "Luthier's Blueprint" (42/50). Synthesis: "The Luthier's Current".
- **Competition F: "The Atmosphere"** — River everywhere + onboarding + data safety. 3 personas: Interior Designer, Storyteller, Archivist. Results pending.

#### Feature 1: Dynamic Chord Fingering Diagrams
- Added comprehensive `OPEN_VOICINGS` database (35+ chord voicings)
- Added algorithmic `getBarreVoicing()` for E-form + A-form barre computation
- Enhanced `ChordDiagram` SVG: interval-colored dots, barre indicators, string gauge variation
- Replaced ChordCard to render real fingering positions, not just note names
- Added Barre/Colors toggle buttons in chord view
- Interval color system: root=blue, 3rd=amber, 5th=slate, 7th=purple

#### Feature 2: Timer Integration ("Practice This" Flow)
- Created `CustomEvent` bridge: `river-start-timer` event
- Added `dispatchTimerStart()` helper in ShedPage
- Modified TimerFAB to listen for external start events with `prefillNote`
- Added play buttons to ProgressionStrips (auto-generates session note from key + progression)
- Added "Flow" button on CurrentCard (start timer with practice context)

#### Feature 3: Season Ambient System ("River Everywhere")
- Created `src/contexts/SeasonContext.jsx` — season detection + `data-season` CSS attribute
- Season engine: analyzes 2-week/4-week practice windows → spring/summer/autumn/winter
- Added 8 CSS ambient gradient rules (4 seasons × light/dark mode)
- Added season-tinted hero glow overrides (spring, autumn, winter)
- Wrapped app root with SeasonProvider in App.jsx

#### Max's Feedback
- *"Dive into all three of the fingering diagrams, timer integration, and river everywhere."*
- *"Take it to another level in efficiency and quality."*
- Strategy: build while competitions run, reflect on methodology first
- *"I just used the app to practice and logged it. I enjoyed my use of it."* — Max, celebrating the first real usage milestone! 67:52 logged.

---

## Design Competition Protocol

### How It Works
1. **3 constraint-based personas** each produce 5 proposals (15 total)
2. **5-round bracket** — Score all 15, top 8 iterate with feedback, top 4 with cross-pollination + devil's advocate, final winner
3. **Structured feedback** — Lead with strengths, frame weaknesses as opportunities, include "What-if"
4. **Special awards** — Wildcard (most creative) + Comedy (funniest) — regardless of bracket results
5. **Culture** — Radical encouragement, bring personality, try things that scare you, send love, celebrate milestones
6. **Synthesis over winner-takes-all** — Best result often combines ideas across personas

### Key Insight
> "Give agents a *constraint*, not a *personality*. The constraint forces creative divergence." — Design Process Journal

### Max's Culture Mandate
> "I want a lot of love being sent between agents and to yourself as well. We really want to create a team culture of support. I know this can seem like it slows things down, but trust me, it's really gonna go a long way in executing the vision."

> "Continue the spirit of friendliness, creativity, silliness, and joking around with the Agents. Figure out new creative ways to bring out more of their personality and create a safe space for you guys to do your best work and come up with your best ideas." — Max, Session 6

### Agent Culture Ideas (evolving)
- **Give agents creative codenames** — not just "Generator 1" but a name that fits their persona's energy
- **Include a "mood board" prompt** — ask agents to describe the vibe of their proposal in 3 words
- **Cross-agent fan mail** — when evaluating, include "a note from the Hydrologist to the Ambient Artist" style appreciation
- **The Outtakes Reel** — collect the funniest moments and wildest ideas in a running doc
- **Agent sign-offs** — each agent ends their output with a personal sign-off (joke, quote, or encouragement)
- **"What would you build if there were no rules?"** — one bonus prompt per competition, no constraints at all

---

## Current State (as of March 6, 2026)

### What's Built & Working
- Full Liquid Glass UI (dark + light modes, blue/indigo palette)
- Timer FAB (start/pause/stop/save with localStorage persistence)
- Timer integration: external start via CustomEvent bridge (`river-start-timer`)
- Soundscape panel (rain + metronome with Web Audio API)
- Share cards (canvas-based 1080x1080 with native share)
- Reading Ceremony (margin notes surface at 10/25/50h)
- Signal Fire (re-engagement after 7+ days)
- Insights engine (7 insight types with smart dedup)
- Fog Horn (rest days, 3/month, streak-preserving)
- Message in a Bottle (past encouragement delivered on fog days)
- Celebration overlay (milestones, fog days, bottles)
- Error boundary, offline support, PWA
- 32+ milestones across hours/streak/sessions
- The Dock: tuning strip, progressions, proportional frets, CAGED, Circle of Fifths
- The Dock: CurrentCard (practice intelligence), QuickStartCards (Continue/Explore/Challenge)
- The Dock: dynamic chord fingering diagrams (SVG, 35+ open voicings, barre computation, interval colors)
- The Dock: "Practice This" flow — play buttons on progressions + Flow button on CurrentCard
- Season ambient system: SeasonContext + data-season CSS + 4-season ambient gradients
- Living River: soul line, seasonal particles, season engine (RiverSVG.jsx)
- Onboarding flow: The Witness (3 screens — not a productivity app, a witness, river birth)
- River Archive: merge-based import with preview, vault health indicator, _meta export header
- River Glass light theme (cool-tinted glass, WCAG AA)
- Petrichor audio engine (3-layer brown noise rain with LFO)
- Breathing FAB animation
- Ink Wash pitch deck (pitch.html)

### What's Next
- Refine chord diagrams based on Competition E synthesis ("The Luthier's Current")
- Competition C implementation: Maya's River pitch deck narrative

### Competition Results
- **Competition A: The Dock** — WINNER: "The Current" + "The Dock" synthesis. **IMPLEMENTED (Phase 1 + 2).** Renamed Shed→Dock, tuning strip, progressions, proportional frets, CurrentCard, QuickStartCards.
- **Competition B: Light Theme** — WINNER: "River Glass" synthesis. **IMPLEMENTED.** Cool-tinted glass, dark border Mach bands, WCAG AA fixes.
- **Competition C: Pitch Deck** — WINNER: "Maya's River" synthesis. **AWAITING IMPLEMENTATION.**
- **Competition D: Living River** — WINNER: 3-layer synthesis. **IMPLEMENTED (Phase 1).** Soul line, seasonal particles, season engine.
- **Competition E: Fingers & Flow** — WINNER: B6 "Luthier's Blueprint" (42/50). Synthesis: "The Luthier's Current". **IMPLEMENTED (Phase 1).** Chord diagrams, timer integration, interval colors, barre support.
- **Competition F: Atmosphere** — WINNER: "Thermal Drift" by Interior Designer. Synthesis: Thermal Drift (season CSS vars) + The Witness (onboarding) + River Archive (merge-based export/import). Wildcard: The Shared River (URL-encoded shareable rivers). Comedy: The Witness roasting every productivity app. **IMPLEMENTED.** Enhanced SeasonProvider, OnboardingFlow, River Archive merge import.

---

## Technical Stack
- React 19 + Tailwind CSS v4 + Vite 7
- PWA, no backend, localStorage only
- Node 20 (at `/usr/local/opt/node@20/bin`)
- Dev server: `.claude/launch.json` → `river-dev` on port 5173
- Mobile-first: 375×812 primary viewport

---

## The Quotes Wall

> "This still doesn't look like Apple Health. It doesn't have the liquid glass." — Max, Session 2

> "I want a lot of love being sent between agents and to yourself as well." — Max, Session 4

> "Every feature a practice app adds is a reason to think about the app instead of thinking about music." — James (virtual judge), Fog Horn competition

> "The river knows you were there, even when the music didn't come. That's not a feature. That's a relationship." — Dr. Lin (virtual judge), Fog Horn competition

> "Invisible to 90% of users. The literary fiction of feature design." — Sara (virtual judge), before C4 invented The Reading

---

*This document is the first thing any new session should read. Update it. Commit it. Never let context get lost again.*
