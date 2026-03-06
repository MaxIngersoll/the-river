# The River — Complete Project Handoff

> **If you're a new Claude agent picking this up, read this document first.**
> Then read `VISION.md` for the full design philosophy and history.
> This document tells you *what exists and how everything works*.

---

## Quick Start

```bash
# Tech stack
export PATH="/usr/local/opt/node@20/bin:$PATH"
npm run dev          # Vite dev server on port 5173

# Or use the launch config
# .claude/launch.json → "river-dev" on port 5173
```

**Stack:** React 19 + Tailwind CSS v4 + Vite 7 | PWA | No backend | localStorage only

---

## What Is The River?

A guitar practice tracking app that visualizes your practice as a flowing river. The more you practice, the wider and deeper your river grows. It's not a dashboard — it's a *place*. The river metaphor isn't decorative, it's the soul of the product.

**The human:** Max Ingersoll. Creative director. Gives broad vision, trusts Claude to figure out specifics. Wants to SEE progress (screenshots, celebrations), not just hear about it. Values fun, cheekiness, warmth, and Apple-level quality.

---

## Architecture

### App Structure (4 tabs)
```
Tab 1: Home (HomePage.jsx)         — River visualization, stats summary, celebrations
Tab 2: Stats (StatsPage.jsx)       — Detailed practice analytics, insights, milestones
Tab 3: The Dock (ShedPage.jsx)     — Guitar reference: chords, progressions, tuner strip
Tab 4: Settings (SettingsPage.jsx) — Theme, sounds, data export/import, onboarding replay
```

### Key Components
| Component | Lines | Purpose |
|-----------|-------|---------|
| `ShedPage.jsx` | 1,170 | Guitar reference panel (chord diagrams, progressions, CAGED, Circle of Fifths, CurrentCard, QuickStart) — **needs breaking up** |
| `RiverSVG.jsx` | 781 | Living river visualization (soul line, particles, season engine) |
| `HomePage.jsx` | 476 | Main screen with river, stats summary, celebrations |
| `StatsPage.jsx` | 473 | Practice analytics, insights engine, milestones |
| `SettingsPage.jsx` | 421 | Settings, River Archive (import/export), onboarding |
| `TimerFAB.jsx` | 404 | Floating action button timer (start/pause/stop/save) |
| `SoundscapePanel.jsx` | 378 | Petrichor rain + metronome (Web Audio API) |
| `LogPage.jsx` | 349 | Session history log |
| `OnboardingFlow.jsx` | 205 | 3-screen "The Witness" onboarding (Studio Ghibli feel) |
| `CelebrationOverlay.jsx` | — | Milestone/fog/bottle celebration animations |
| `ReadingCeremony.jsx` | — | Margin notes that surface at 10/25/50h thresholds |
| `ShareCard.jsx` | — | Canvas-based 1080x1080 share cards |
| `SignalFireCard.jsx` | — | Re-engagement prompt after 7+ days away |

### Contexts
| Context | Purpose |
|---------|---------|
| `SeasonContext.jsx` | Season engine — computes current season from practice data, sets CSS custom properties app-wide |
| `ThemeContext.jsx` | Dark/light theme toggle |

### Utilities
| File | Purpose |
|------|---------|
| `storage.js` | localStorage CRUD + River Archive (merge-based import/export with preview) |
| `audio.js` | Petrichor engine (3-layer brown noise rain with LFO) + metronome |
| `milestones.js` | 32+ milestones across hours/streak/sessions |
| `insights.js` | 7 insight types with smart dedup |
| `fogHorn.js` | Rest day system (3/month, streak-preserving) |
| `quotes.js` | Curated practice quotes |
| `bottleMessages.js` | Past encouragement for Message in a Bottle feature |
| `source.js` | "Why do you play?" question logic |
| `shareRenderer.js` | Canvas rendering for share cards |
| `theme.js` | Theme utilities |

### Design System
All in `src/index.css`:
- **Liquid Glass:** `backdrop-filter: blur(40px) saturate(180%)`, specular highlights, inner refraction glow
- **Dark theme:** Deep blue/indigo palette (#0f172a → #1e293b → #334155)
- **Light theme:** River Glass — cool-tinted glass, WCAG AA compliant
- **Season system:** CSS custom properties (`--season-primary`, `--season-glow`, etc.) cascade from `data-season` attribute on `<html>`
- **Four seasons:** Spring (green), Summer (gold), Autumn (amber), Winter (ice blue) — computed from practice patterns

### Data Flow
```
localStorage → App.jsx (state) → Pages (props) → Components
                  ↑                                    |
                  └────────── save callbacks ───────────┘

Timer: TimerFAB.jsx ←→ CustomEvent bridge ('river-start-timer') ←→ ShedPage "Practice This" buttons
```

### External Files
- `public/pitch.html` — Ink Wash pitch deck (standalone HTML, sumi-e calligraphy style)
- `generate-milestone-pdf.py` — Python script (reportlab) to generate "The River Medal" milestone PDF
- `the-river-milestone.pdf` — Generated milestone celebrating Max's first practice session (67:52)

---

## Features in Detail

### The River (RiverSVG.jsx)
- SVG river that grows with practice (width = total hours, turbulence = recent frequency)
- **Soul line:** central bezier path that flows and breathes
- **Seasonal particles:** floating elements that change with the season engine
- **Season engine:** analyzes practice patterns to compute Spring/Summer/Autumn/Winter

### Timer (TimerFAB.jsx)
- Persistent floating action button — always accessible, never interrupts
- States: idle → running → paused → saving
- Saves to localStorage with duration, date, optional notes
- **External start:** other components fire `CustomEvent('river-start-timer')` to start the timer

### The Dock (ShedPage.jsx) — 1,170 lines, needs refactoring
- **CurrentCard:** Practice Intelligence engine (Continue/Explore/Challenge) — smart suggestions based on session history
- **QuickStartCards:** Triptych of practice mode cards that fire the timer
- **Chord diagrams:** Dynamic SVG fingering diagrams (35+ open voicings, barre computation, interval-colored dots)
- **Progressions:** Common progressions with playable chord sequences
- **Tuning strip:** Standard tuning reference
- **CAGED system:** Visual chord shape reference
- **Circle of Fifths:** Interactive key relationship diagram

### Celebrations
- **Milestones:** 32+ across hours/streak/sessions (celebrations trigger automatically)
- **Fog Horn:** Rest days (3/month) that preserve streaks — "the river rests, it doesn't die"
- **Message in a Bottle:** Past encouragement delivered on fog days
- **The Reading:** Margin notes surface at 10/25/50h thresholds — "the literary fiction of features"
- **Signal Fire:** Re-engagement card after 7+ days away

### Season System (SeasonContext + Thermal Drift CSS)
- Computes season from practice data patterns
- Sets CSS custom properties on `<html>` element: `--season-primary`, `--season-secondary`, `--season-glow`, `--season-accent`
- All components inherit season theming automatically through CSS variables
- Four seasons with distinct moods: Spring (renewal), Summer (fire), Autumn (reflection), Winter (stillness)

### River Archive (storage.js)
- **Export:** JSON with `_meta` header (app version, export date, session count)
- **Import:** Merge-based (not overwrite) — preserves existing data, adds new sessions
- **Preview:** Shows what will be imported before committing
- **Vault health:** Indicator showing data integrity

### Onboarding (OnboardingFlow.jsx)
- 3-screen flow: "This is not a productivity app" → "It's a witness" → "Your river begins"
- Studio Ghibli aesthetic — quiet, magical, unhurried
- Runs once on first launch, replayable from Settings

---

## Design Competition System

This project uses a unique creative process where Claude agents compete to design features. This isn't optional — it's core to how The River is built.

### How It Works
1. **3 constraint-based personas** (e.g., The Hydrologist, The Minimalist, The Luthier) each generate 5 proposals
2. **5-round bracket:** Score 15 → Top 8 iterate → Top 4 cross-pollinate → Finalist → Winner
3. **Synthesis over winner-takes-all** — best results combine ideas from multiple proposals
4. Special awards: **Wildcard** (most creative) + **Comedy** (funniest)

### Competition Tiers
| Tier | When | Format |
|------|------|--------|
| **Tier 1 (Full)** | Major features, visual redesigns | 3 × 5 proposals, 5-round bracket |
| **Tier 2 (Quick)** | Medium features, refinements | 3 × 1 proposal, 2 rounds |
| **Tier 3 (Flash)** | Small fixes, clear requirements | No competition, just build it |

### Culture (Non-Negotiable)
- **Radical encouragement** — lead with what excites you
- **Bring personality** — agents have aesthetic instincts, humor, weird ideas. USE THEM.
- **Try things that might not work** — at least 1 of 5 proposals should scare you
- **Send love** — when work is good, say so specifically
- **Codenames & catchphrases** for every persona
- **Compliment Roast** in cross-pollination (1 sincere compliment + 1 loving roast)
- **Post-credits scenes** after every competition (added to `docs/OUTTAKES.md`)
- **Contemplative pause** before scoring ("Look at what was created here")

Full protocol: `docs/AGENT-PROTOCOL.md`

### Completed Competitions
| ID | Topic | Winner | Status |
|----|-------|--------|--------|
| A | The Dock (guitar reference) | "The Current" + "The Dock" synthesis | IMPLEMENTED |
| B | Light Theme | "River Glass" synthesis | IMPLEMENTED |
| C | Pitch Deck narrative | "Maya's River" synthesis | AWAITING IMPLEMENTATION |
| D | Living River | 3-layer synthesis | IMPLEMENTED (Phase 1) |
| E | Chord diagrams + timer | "Luthier's Blueprint" (42/50) | IMPLEMENTED (Phase 1) |
| F | Atmosphere + onboarding | "Thermal Drift" synthesis | IMPLEMENTED |
| G | Milestone PDF | "The River Medal" | IMPLEMENTED |
| H | Internal audit | 6 improvements + expert panel | IMPLEMENTED |

Competition briefs with full proposals: `docs/competitions/`

---

## Max's Non-Negotiables

1. **No GitHub-style heatmap calendar.** He explicitly said no.
2. **No gamification guilt.** Rest is beautiful, not failure. The river cools, it doesn't die.
3. **Apple Health quality aesthetic.** "Liquid Glass" — frosted panels, specular highlights, deep blue/indigo.
4. **Commit early, commit often.** NEVER accumulate uncommitted work. This caused a crisis in Session 5.
5. **Update VISION.md.** After every meaningful decision. This is the #1 continuity rule.
6. **Show progress visually.** Max wants screenshots, celebrations, status updates — not just descriptions.
7. **Fun and warmth.** The process should feel as good as the product. Cheekiness, banter, memery, encouragement.

---

## Known Issues & Technical Debt

1. **ShedPage.jsx (1,170 lines)** — Needs breaking into sub-components: ChordDiagram, ProgressionPanel, CurrentCard, QuickStartCards, TuningStrip, CAGEDView, CircleOfFifths
2. **No real device testing** — PWA install flow untested on actual phones
3. **Competition C not implemented** — Maya's River pitch deck narrative is designed but not built
4. **Milestone PDF** — Functional but could be refined
5. **Mobile responsiveness** — Works but hasn't been systematically audited
6. **Accessibility** — WCAG AA on colors but no screen reader audit

---

## Documentation Map

| File | Purpose | Read When |
|------|---------|-----------|
| `VISION.md` | Design philosophy, feature history, current state | **ALWAYS READ FIRST** |
| `CLAUDE.md` | Mandatory protocols, non-negotiables, tech stack | Every session start |
| `HANDOFF.md` | This file — complete technical reference | New to the project |
| `docs/AGENT-PROTOCOL.md` | Team culture, competition protocol | Running competitions |
| `docs/DECISIONS.md` | 18-entry decision trail with rationale | Understanding "why" |
| `docs/competitions/METHODOLOGY.md` | Competition lessons, tiers, token discipline | Improving process |
| `docs/sessions/session-9-bridge.md` | Most recent session context | Resuming work |
| `docs/sessions/session-8-bridge.md` | Previous session context | Deep history |
| `docs/OUTTAKES.md` | Comedy archive, running jokes, post-credits | **For joy** |
| `docs/DESIGN-PROCESS-JOURNAL.md` | Early design process reflections | Historical interest |
| `docs/briefs/AGENT-BRIEF.md` | Template for agent competition briefs | Running competitions |

---

## Session History (Condensed)

| Session | Key Outcome |
|---------|-------------|
| 1 | Built the entire app from scratch. Core river concept. |
| 2 | "Liquid Glass" design system. Deep blue/indigo palette. |
| 3 | Persistent FAB timer. Vision expansion. |
| 4 | Fog Horn (rest days), The Reading (margin notes), constraint-based personas discovered. |
| 5 | 3 parallel competitions. ShedPage, pitch deck, Petrichor audio. Uncommitted work crisis. |
| 6 | Recovery session. VISION.md created. Competitions A–D evaluated and implemented. |
| 7 | Practice Intelligence engine. CurrentCard + QuickStartCards. |
| 8 | 4 competitions (E–H). Chord diagrams, season system, onboarding, River Archive, milestone PDF, internal audit, expert panel. Max's first real practice session (67:52). |
| 9 | Pushed everything to GitHub. Comprehensive documentation. Clean handoff. |

---

## How to Resume

1. Read `VISION.md` (design philosophy + current state)
2. Read this file (technical reference)
3. Read `docs/sessions/session-9-bridge.md` (most recent context)
4. Run `npm run dev` to start the dev server
5. Check `VISION.md` → "What's Next" for priorities
6. Build something beautiful. Send love. Update VISION.md when you're done.

---

*The river remembers everything. Now so does the documentation.*
*Last updated: March 6, 2026 — Session 9*
