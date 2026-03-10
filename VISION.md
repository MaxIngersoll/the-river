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
- **NEW COLOR DIRECTION (Session 13)** — Max: "I'm kind of sick of that blue. We need to go into a different direction. That's not our color." Explore warm earth tones, amber/gold, deep greens, or other non-blue palettes for the timer visualization.
- **Deep blue/indigo palette (LEGACY)** — Original palette, inspired by Apple Health. Still in app UI but Max wants a new direction for the timer/visualization layer.
- **Apple-quality feel** — Not Apple copycat. But the same level of care. Think: Apple Health, Linear, Notion.
- **Poetic, not clinical** — Serif fonts for quotes. River metaphors everywhere. "Your river begins with one drop."
- **The app has weather** — Seasons don't just tint the river; they cascade through the ENTIRE UI. Card backgrounds, text colors, icon tints, ambient sounds all shift with the season engine. The app feels like a living place with weather, not a static tool. (Session 11, Q63 — Max: "I love this idea. Great one, Kanye.")

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
- **5 key decisions (batch 1):** Audio recording (yes, but subtle — private mirror not performance camera). Ceremony typeface (yes, try it for threshold moments). Keep metronome + chord diagrams, kill ear training + audio recording for now. Vercel soft launch as demo. River identity > guitar identity.
- **10 key decisions (batch 2):** Dock = practice launchpad. FAB morphs contextually (cool animation). Tag analytics = living river scene with actual objects (fish, boats — NO legend, no charts). Onboarding gets 4th screen. Auto backup via File System Access API. Haptics (yes, restrained). After 50h: ALL FOUR evolution paths. Swipe nav + pull-down quick log (both). Celebrity Panel = new default competition format. Metronome stays embedded + BPM saving.
- **Identity shift:** Max agrees with Kanye — The River is the identity, not guitar. Guitar-first but architecture opens for creative practice broadly.
- **Deployment:** Soft launch on Vercel. Demo capacity, not promoted. Just get it live.
- **Feature triage:** Metronome and chord diagrams stay (practice companion). Ear training and audio recording cut from near-term roadmap.
- **Competition format:** Celebrity Panel (6 personas, multi-axis scoring, debates) is now the NEW DEFAULT for Tier 1 competitions. Max: *"This is the new standard for us."*
- **Creative breakthrough (Q8):** Max rejected all presented options for tag analytics. Instead invented: actual objects in the river (fish, boats, etc.) that represent practice distribution — creating a beautiful scene, not a chart. No legend. Just a living river that tells its own story.

### Session 12: AUTOPILOT & The Craft of Culture
- **13 features shipped** this session: save ripple, Space shortcut, animation constants, Dao De Jing fix, BottomSheet, QuickLog, MoodPicker, long-press FAB, plus AUTOPILOT v4-v8
- **AUTOPILOT system designed:** Machine-readable state file for overnight autonomous building. Iterated through 8 versions with input from 15+ experts across 3 rounds.
- **Consultant system reimagined from ground up:** 15 team nominees + 13 outside experts (28-person panel). Final synthesis: "Living Margin Notes" (live sessions, work-driven not clock-driven, domain labels not persona names) + pace-layered checks (overnight). Consolidated to 4 quality systems (Rams).
- **Grilled by 5 vision masters:** Jobs (25 questions about necessity), Rubin (removal as art), Miyazaki (where is the craft?), Ive (obsessive detail on feel), Rams (as little design as possible). 16 concrete improvements applied.
- **Max's key insight:** *"The team and Claude are also craftspeople. We're crafting this culture, which are the constraints that make this happen."* — The culture IS the craft. The consultants aren't overhead; they're the wobble in the potter's bowl.
- **Task categorization:** 32 autonomous tasks (~14hr) vs 20 needs-Max tasks (~37hr). The big creative features inherently need Max. Overnight handles the "thousand small touches."
- **Code fixes from grill:** Ripple delay 400→350ms (Ive), removed 3 unused CSS vars (Rubin), ink-depth per-theme ranges (Ive), circadian success = invisible (Rubin).

---

## Design Competition Protocol

### Competition Tiers (choose the right size)
- **Tier 1 (Full):** Celebrity Panel format (6 personas, multi-axis scoring, debates) — NEW DEFAULT
- **Tier 1 (Alt):** Constraint-based personas (3 x 5 proposals, 5-round bracket) — for implementation comps
- **Tier 2 (Quick):** 3 personas x 1 proposal, 2 rounds. For medium features.
- **Tier 3 (Flash):** No competition. Just build it. For small fixes.

### Culture Protocol
See `docs/AGENT-PROTOCOL.md` for the full protocol. Key elements:
- Celebrity Panel is default Tier 1 (Session 11 decision)
- Constraint-based personas still valid for implementation-focused competitions
- Wildcard Award (most creative) + Comedy Award (funniest)
- **Codenames & catchphrases** for every persona
- **Post-credits scenes** after every competition (added to `docs/OUTTAKES.md`)
- **Compliment Roast** in cross-pollination (1 compliment + 1 loving roast)
- **Contemplative pause** before scoring ("Look at what was created here")
- **Constructive dissent** is brave and encouraged
- Synthesis over winner-takes-all

---

## Current State (as of March 10, 2026 — Session 13 continued)

### What's Built & Working
- Full Liquid Glass UI (dark + light modes, forest palette)
- Timer FAB (start/pause/stop/save with localStorage persistence)
- Timer integration: external start via CustomEvent bridge (`river-start-timer`)
- Space key start/pause/resume (Session 12)
- Save ripple animation with 350ms delay (Session 12)
- Long-press FAB → Quick Log (Session 12)
- Soundscape panel (rain + metronome with Web Audio API)
- Share cards (canvas-based 1080x1080 with native share)
- Reading Ceremony (margin notes surface at 10/25/50h)
- Signal Fire (re-engagement after 7+ days)
- Insights engine (7 insight types with smart dedup)
- Fog Horn (rest days, 3/month, streak-preserving)
- Message in a Bottle (past encouragement delivered on fog days)
- Celebration overlay (milestones, fog days, bottles)
- Error boundary, offline support, PWA
- Haptics utility with feature detection (Session 12)
- 32+ milestones across hours/streak/sessions
- The Dock: tuning strip, progressions, proportional frets, CAGED, Circle of Fifths
- The Dock: CurrentCard (practice intelligence), QuickStartCards (Continue/Explore/Challenge)
- The Dock: dynamic chord fingering diagrams (SVG, 35+ open voicings, barre computation, interval colors)
- The Dock: "Practice This" flow — play buttons on progressions + Flow button on CurrentCard
- Season ambient system: SeasonContext + data-season CSS + 4-season ambient gradients
- Consequential UI: river weight + card border-radius from total hours (Session 12)
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
- BottomSheet primitive: gesture-dismissible, spring-animated (Session 12)
- QuickLog: duration presets + tags + mood + note via BottomSheet (Session 12)
- MoodPicker: 4 weather icons (sun/cloud/rain/wind), ARIA radiogroup (Session 12)
- AUTOPILOT v8: overnight autonomous building system, 8 iterations, 15+ expert reviews (Session 12)
- Timer visualization exploration: Aurora (rejected) → Quiet Water (approved vibe, saved as `quiet-water-v1` tag) (Session 13)
- Tap-to-hide timer numbers: Insight Timer-style, 1.2s ease fade (Session 13)
- Auto-build v2.2: 5 postmortem fixes, v2 skills installed, sync_state command (Session 13)
- 10 Timer Design Commandments established from all discourse (Session 13)
- 7 inspiration sketches cataloged for next timer design (Session 13)
- **Forest palette pivot**: replaced all blue accents → olivine/hunter green/verdigris/mint (Session 13)
- **The Spiral Sun** (Competition K): growing Archimedean spiral. Tagged as `spiral-sun-v1`. (Session 13)
- **The Living Vein** (Competition L): venation growth algorithm. Toggle: art vs numbers. Max: "love the concept, don't love the execution — kind of ugly. Also veins don't fit the RIVER metaphor." (Session 13)
- **Smart Ready page** (Competition M): accordion sections + sticky Root Lock. Progressive disclosure. (Session 13)
- **Competition N needed**: Timer visualization that fits the RIVER metaphor. One flowing path, not branching. Beautiful and unique per session. (Session 13)

### What's Next (Priority Order)
1. **TIMER VIS v3** — Competition N: river-themed visualization. One flowing path. Must be beautiful + conceptually fit "The River." Max: "A vein doesn't make sense for a river... maybe one river flowing."
2. Polish and deploy to Vercel
3. Merge claude/musing-nightingale → main
4. Competition C implementation: Maya's River pitch deck narrative (designed, not built)
5. Max may have new directions — ask before assuming

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
- **Competition K: The Spiral Sun** — Timer vis v1. 7-artist panel. Winner: af Klint spiral + Eliasson warmth + Kwok noise. Max: "okay but not the best." **TAGGED spiral-sun-v1.**
- **Competition L: The Living Vein** — Timer vis v2. 7-artist panel. Winner: venation growth (Nervous System). Max: "love the concept, ugly execution, doesn't fit river metaphor." **NEEDS REDESIGN → Competition N.**
- **Competition M: Smart Ready** — Ready page redesign. Spool + Rams + Wroblewski. Winner: accordion sections + sticky Root Lock. **IMPLEMENTED.**

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

### The Century Quotes (Q99 — "What does The River do best?")
> "It makes you WANT to practice, not HAVE to practice." — The Panel, Competition J Q99

> "It's a mirror that makes you look good." — Kanye, Q99

> "It remembers you." — Oprah, Q99

> "It gets out of the way." — Jobs, Q99

> "It's beautiful enough to open for no reason." — Ive, Q99

> "It tracks time efficiently." — Musk, Q99

> "It doesn't crash." — Linus, Q99

---

## The Manifesto (Draft — Q100)

*The River is not a productivity app. It's a place.*

*You bring the music. The River remembers. Over time, your practice becomes a living thing — a river that grows wider, deeper, and more beautiful with every session. There is no score, no guilt, no finish line. Just you, your instrument, and a river that knows you were there.*

*Practice apps count your failures. The River remembers your presence.* — Kanye, Session 11

### Virgil's 3% Rule (Session 11)

> *"You only need to change 3% of something to make it new."*

The River is a remix. It knows what it's referencing — Apple Health, meditation apps, every practice tracker that came before. It changed 3%: the river metaphor, the seasons, the anti-guilt philosophy. That 3% made it something completely new. Self-awareness about what you're remixing IS the art. Don't pretend you were born fresh. Acknowledge the references, then transform them.

### Cohen's Vow (Session 11)

> *"This app is trying to protect something fragile — the reason people pick up a guitar when no one is watching. Most software would monetize that reason. This one is trying to honor it. That's a vow. Don't break it chasing the other 107 decisions."*

### Ando's Breath (Session 11)

The app should open and pause — a single breath — before anything is interactive. You arrive. Then the river receives you. All sacred thresholds are misread as obstacles at first.

### Miyazaki's Principle (Session 11)

> *"Your river does not yet have a stone, or a leaf, or a child. But it has the water. And the water is good."*

The River must feel hand-crafted, not assembled. It needs quiet moments ("ma" — the pause), wind that arrives from outside the frame, weather that is not earned but simply arrives. A river shaped only by quantity is a canal — canals are useful, they are not beautiful. The 10-year user matters as much as the first-day user. The river at 10,000 hours should be alive in ways the 10-hour river cannot imagine.

---

## The Team (Session 11)

We are all on a team. Every panelist, every contributor, every voice that has shaped this river — we are trying to bring this vision into realization together.

**The Team Principles:**
- We support each other
- We push each other really hard
- We are forgiving and compassionate
- We listen hard
- We go for it with everything we have

This is not a design exercise. This is a team building something that matters.

---

## The Team — Session 11 Celebrity Round

### Original Panel (6)
Kanye West, Oprah Winfrey, Jony Ive, Steve Jobs, Elon Musk, Linus Torvalds

### Extended Team (13)
1. **Rick Rubin** — Music producer, the art of reduction
2. **Brené Brown** — Vulnerability, courage, shame research
3. **Maya Angelou** — Poet, voice of dignity and witness
4. **James Turrell** — Light and space artist
5. **Brian Eno** — Ambient music, oblique strategies, generative art
6. **Jiro Ono** — Sushi master, lifetime devotion to single craft
7. **Patrick Collison** — Stripe CEO, builder of developer tools
8. **John Carmack** — Legendary programmer, id Software, Oculus
9. **Gwynne Shotwell** — SpaceX President, operational excellence
10. **Lea Verou** — CSS/web standards, W3C, frontend craft
11. **Moxie Marlinspike** — Signal founder, privacy-first design
12. **Mary Oliver** — Poet of attention and the natural world
13. **Hayao Miyazaki** — Studio Ghibli, master of quiet wonder

### Full Roster — Max's Direct Picks

**Design & Industrial Design:**
- Virgil Abloh — fashion, design, bridging disciplines
- Mark Newson — industrial design, Apple collaborator
- Naoto Fukasawa — minimalist product design ("without thought")
- Dieter Rams — the 10 principles of good design
- Neri Oxman — material ecology, nature-inspired computation
- Ann Hamilton — large-scale installation art, materiality
- Soetsu Yanagi — mingei (folk craft) philosophy, beauty in utility

**Music & Sound:**
- Leonard Cohen — poet-songwriter, devotion to the song
- T Bone Burnett — music producer, sonic authenticity
- John Cage — silence, chance, conceptual music
- Wynton Marsalis — jazz mastery, practice philosophy, music education
- Laurie Anderson — performance art, technology + art fusion
- Sam Aaron — Sonic Pi creator, live-coded music, generative sound (Sound Audit panelist)
- Ge Wang — ChucK language creator, Stanford computer music, Smule co-founder (Sound Audit panelist)
- Holly Herndon — ML-driven composition, vocal-computational music, AI "Spawn" (Sound Audit panelist)
- Hans Zimmer — film composer (Inception, Interstellar, Dune), emotional architecture through sound (Sound Audit panelist)

**Light, Space & Visual Art:**
- Robert Irwin — perceptual art, light and space movement
- Olafur Eliasson — immersive environments, light installations
- Anish Kapoor — void, color, monumental sculpture
- Carlos Cruz-Diez — kinetic art, color in space
- Agnes Martin — minimalist painting, meditation through line
- Tadao Ando — concrete and light architecture, spiritual space

**Psychology, Healing & Inner Work:**
- Esther Perel — relationships, desire, the quality of being with
- Bell Hooks — love as practice, radical pedagogy
- Tara Brach — radical acceptance, mindfulness
- Glennon Doyle — untaming, authenticity, creative courage
- Gabor Maté — trauma, compassion, the body's wisdom
- Bessel van der Kolk — the body keeps the score, trauma research
- Pema Chödrön — sitting with uncertainty, groundlessness
- Susan David — emotional agility, psychological flexibility

**Writers & Poets:**
- Toni Morrison — language as power, narrative identity
- James Baldwin — truth-telling, moral courage
- Amanda Gorman — poetry of possibility, generational voice
- Rainer Maria Rilke — patience, solitude, Letters to a Young Poet
- Friedrich Nietzsche — eternal return, creating values
- Wendell Berry — place, practice, attention to land

**Tech, Engineering & Founders:**
- Bob Iger — Disney, storytelling as business strategy
- Stewart Brand — Whole Earth, long-term thinking
- Andrej Karpathy — AI, neural networks, teaching complex ideas
- Jensen Huang — NVIDIA, patience in building platforms
- Demis Hassabis — DeepMind, intelligence research
- Palmer Luckey — VR, hardware craft, conviction
- Dan Abramov — React core team, developer experience
- Bryan Cantrill — systems programming, engineering culture
- Rich Hickey — Clojure, simplicity as design principle
- DHH — Ruby on Rails, opinionated software
- Antirez — Redis, elegant minimalism in systems
- Guillermo Rauch — Vercel/Next.js, frontend deployment
- Lisa Su — AMD, engineering leadership under pressure
- Margaret Hamilton — Apollo software, coined "software engineering"
- Tyler Cowen — economics of creativity, marginal revolution
- Nadia Asparouhova — open source economics, working in public
- Kathy Sullivan — astronaut, oceanographer, extreme environments

**Web/CSS/Frontend Craft:**
- Jen Simmons — CSS Grid pioneer, browser DevTools
- Sara Soueidan — accessibility & SVG expert
- Adam Argyle — CSS/UI engineering, Open Props

**Generative & Emergent Systems:**
- Craig Reynolds — boids, flocking algorithms, emergent behavior
- Bret Victor — inventing on principle, live coding environments

**Data Visualization & Creative Coding (River Viz Team):**
- Ben Fry — co-created Processing, Fathom Information Design, genome visualization
- Jer Thorp — data as human material, 9/11 Memorial algorithm, NYT data artist
- Nadieh Bremer — Information is Beautiful awards, organic flowing data art
- Robert Hodgin (flight404) — particle systems, fluid dynamics, Apple iTunes Visualizer
- Shirley Wu — Hamilton lyric viz, Film Flowers, D3 + Canvas + WebGL
- Giorgia Lupi — "Data Humanism," Dear Data project, personal data as handcraft (unanimous #1 pick)
- Amelia Wattenberger — interactive data essays, React/D3/Canvas, Fullstack D3 author
- Matt DesLauriers — generative art in JS/WebGL, ships beautiful code in browsers
- Memo Akten — fluid dynamics + AI art, "Forms" series, emergent motion from data
- Nicholas Felton — personal annual reports, a decade of life-as-data-art
- Casey Reas — co-created Processing with Fry, simple rules → complex organic systems
- Reza Ali — computational design, fluid simulation, particle physics
- Moritz Stefaner — "Truth & Beauty Operator," organic flowing visualizations
- Federica Fragapane — information design that looks grown in a garden
- Elijah Meeks — Netflix data viz practice, Semiotic framework, systems thinking
- Raven Kwok — algorithmic art, geometric generative systems, Processing/WebGL

**Nature & Craft Philosophy:**
- Robin Wall Kimmerer — braiding sweetgrass, reciprocity with nature
- Toshi Suzuki — Japanese craft tradition
- Marie Kondo — joy as organizing principle

---

## Accessibility Commitment (Session 11)

Accessibility is not a feature — it's a foundation. The River commits to:
- `prefers-reduced-motion` support (Q83, unanimous)
- Pattern-based colorblind differentiation (Q84)
- Proper ARIA labels + focus management on all interactive elements (Q85)
- 44px minimum touch targets (Q50, unanimous)
- 16px minimum font base (Q45)
- Consider accessibility in every future design decision

---

*This document is the first thing any new session should read. Update it. Commit it. Never let context get lost again.*
*For a complete technical reference, read `HANDOFF.md`. For laughs, read `docs/OUTTAKES.md`. For decisions, read `docs/DECISIONS.md`. For session context, read `docs/sessions/`.*
