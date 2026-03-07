# The River — Vision, Feedback & Design Philosophy

> This is a living document. Every session updates it. Every new Claude reads it first.
> **Last updated:** March 7, 2026

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
- **The River identity transcends guitar** — it's for creative practice broadly (guitar-first, instrument-aware).
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

### Session 8: Three Features + Four Competitions + Internal Audit
- **Competition E:** Chord diagrams + timer integration. Winner: "Luthier's Blueprint". **IMPLEMENTED.**
- **Competition F:** Atmosphere + onboarding + data safety. Winner: "Thermal Drift" synthesis. **IMPLEMENTED.**
- **Competition G:** Milestone PDF ("The River Medal"). Trophy/diploma style. **IMPLEMENTED.**
- **Competition H:** Internal audit of workflow. Expert panel review (7 experts). **IMPLEMENTED.**
- **Features:** Chord diagrams, timer integration, season CSS vars, onboarding flow, River Archive, milestone PDF
- **Process upgrades:** Competition tiers, Bridge Notes, DECISIONS.md, Outtakes Reel, fun protocols
- **Max's milestone:** First real practice session — 67:52 logged. "I enjoyed my use of it."
- **Stale docs cleaned:** Deleted HANDOFF.md, PLAN.md, EXECUTION-PLAN.md, OVERNIGHT-PLAN/REPORT.md

### Session 9: Documentation & GitHub Safety
- Discovered 22 commits existed only locally — none pushed to GitHub
- Pushed `claude/musing-nightingale` branch and merged all work into `main`
- Wrote comprehensive `HANDOFF.md` — complete technical reference for any new agent
- Updated all documentation: Bridge Notes, VISION.md, MEMORY.md
- **Lesson reinforced:** "Commit early, commit often" includes PUSHING to remote

### Session 10: The Sapphire Sessions
- **Competition I:** Mega Tier 1 — colorway + tuner + quote. 5 personas (3 wild, 2 sober), 25 proposals.
- **Sapphire Night theme:** New warm dark theme (#112250 Royal Blue, #E0C58F gold accents). Liquid Gold glass cards.
- **Guitar Tuner:** Real microphone-based pitch detection (pitchy library). Chronograph dial, Quick Tune + Guide Me modes, 5 alternate tunings.
- **Milne Quote:** "Rivers know this: there is no hurry." Always visible above tab bar.
- **The Penguin:** Won the Wildcard Award. Two pixels of gold border. A legend.

### Session 11: Competition J — The Big Questions
- **Competition J:** Tier 1 philosophical competition — 10 questions about The River's identity and future direction.
- **5 key decisions:** Audio recording (yes, but subtle — private mirror not performance camera). Ceremony typeface (yes, try it for threshold moments). Keep metronome + chord diagrams, kill ear training + audio recording for now. Vercel soft launch as demo. River identity > guitar identity.
- **Identity shift:** Max agrees with Kanye — The River is the identity, not guitar. Guitar-first but architecture opens for creative practice broadly.
- **Deployment:** Soft launch on Vercel. Demo capacity, not promoted. Just get it live.
- **Feature triage:** Metronome and chord diagrams stay (practice companion). Ear training and audio recording cut from near-term roadmap.

---

## Design Competition Protocol

### Competition Tiers (choose the right size)
- **Tier 1 (Full):** 3 personas x 5 proposals, 5-round bracket. For major features.
- **Tier 2 (Quick):** 3 personas x 1 proposal, 2 rounds. For medium features.
- **Tier 3 (Flash):** No competition. Just build it. For small fixes.

### Culture Protocol
See `docs/AGENT-PROTOCOL.md` for the full protocol. Key elements:
- Constraint-based personas (not attitude-based)
- Wildcard Award (most creative) + Comedy Award (funniest)
- **Codenames & catchphrases** for every persona
- **Post-credits scenes** after every competition (added to `docs/OUTTAKES.md`)
- **Compliment Roast** in cross-pollination (1 compliment + 1 loving roast)
- **Contemplative pause** before scoring ("Look at what was created here")
- **Constructive dissent** is brave and encouraged
- Synthesis over winner-takes-all

---

## Current State (as of March 7, 2026)

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
- Sapphire Night warm theme (third theme option, deep navy + gold accents, Liquid Gold glass)
- Guitar Tuner: pitchy McLeod pitch detection, chronograph dial, Quick Tune + Guide Me, 5 tunings
- Milne quote whisper above tab bar: "Rivers know this: there is no hurry."

### What's Next (Priority Order)
1. Vercel soft launch — deploy as demo capacity, get it live with a URL
2. Ceremony typeface — try a single high-contrast serif for threshold moments (Reading, milestones, onboarding)
3. Refine chord diagrams based on Competition E synthesis ("The Luthier's Current")
4. Polish: ShedPage.jsx breakup (1,170 lines → sub-components), mobile audit, accessibility
5. Architecture: begin opening identity beyond guitar — instrument-aware, creative practice broadly
6. Competition C implementation: Maya's River pitch deck narrative (designed, not built)
7. Real device testing: PWA install flow, touch interactions
8. Max may have new directions — ask before assuming

### Competition Results
- **Competition A: The Dock** — WINNER: "The Current" + "The Dock" synthesis. **IMPLEMENTED (Phase 1 + 2).** Renamed Shed→Dock, tuning strip, progressions, proportional frets, CurrentCard, QuickStartCards.
- **Competition B: Light Theme** — WINNER: "River Glass" synthesis. **IMPLEMENTED.** Cool-tinted glass, dark border Mach bands, WCAG AA fixes.
- **Competition C: Pitch Deck** — WINNER: "Maya's River" synthesis. **AWAITING IMPLEMENTATION.**
- **Competition D: Living River** — WINNER: 3-layer synthesis. **IMPLEMENTED (Phase 1).** Soul line, seasonal particles, season engine.
- **Competition E: Fingers & Flow** — WINNER: B6 "Luthier's Blueprint" (42/50). Synthesis: "The Luthier's Current". **IMPLEMENTED (Phase 1).** Chord diagrams, timer integration, interval colors, barre support.
- **Competition F: Atmosphere** — WINNER: "Thermal Drift" synthesis. **IMPLEMENTED.** Season CSS vars, OnboardingFlow, River Archive.
- **Competition G: Milestone PDF** — WINNER: "The River Medal" (Goldsmith synthesis). **IMPLEMENTED.** Trophy/diploma style celebration PDF.
- **Competition H: Internal Audit** — WINNER: Synthesis of 6 improvements + 7-expert panel review. **IMPLEMENTED.** Competition tiers, Bridge Notes, DECISIONS.md, Outtakes Reel, fun protocols, stale doc cleanup.
- **Competition I: The Sapphire Sessions** — WINNERS: "Earned Sapphire" (colorway), "Quick Chronograph" (tuner), "Tab Bar Whisper" (quote). **IMPLEMENTED.** Sapphire Night theme, guitar tuner, Milne quote.
- **Competition J: The Big Questions** — Tier 1 philosophical competition. 10 questions on identity and direction. 5 key decisions: audio recording (yes, subtle), ceremony typeface (yes, try it), keep metronome/kill ear training, Vercel demo launch, River > guitar identity. **DECISIONS RECORDED.**

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

> "Running a Tier 1 competition for a PDF is like hiring an orchestra to play happy birthday." — The Team Captain, Competition H

> "A river doesn't stop to report its progress. It flows, and you check in at the bends." — Dr. Maya Chen, Expert Panel

---

*This document is the first thing any new session should read. Update it. Commit it. Never let context get lost again.*
*For a complete technical reference, read `HANDOFF.md`. For laughs, read `docs/OUTTAKES.md`. For decisions, read `docs/DECISIONS.md`. For session context, read `docs/sessions/`.*
