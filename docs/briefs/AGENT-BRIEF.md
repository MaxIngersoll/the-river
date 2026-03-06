# The River — Agent Brief

> Everything an agent needs to work autonomously on The River project.
> Read this first. Then check `docs/OVERNIGHT-PLAN.md` for current status.

---

## What Is The River?

A guitar practice tracking app that visualizes your practice sessions as a flowing river. The more you practice, the wider and deeper your river grows. Built as a PWA with React 19 + Tailwind CSS v4 + Vite 7. No backend — everything in localStorage.

### Core Features
- **Practice Timer** — FAB button expands to full-screen stopwatch with rain + metronome audio
- **River Visualization** — Catmull-Rom spline SVG river that grows with total hours
- **Streak Tracking** — Consecutive practice days with "flow" streak pill
- **Fog Horn** — Rest days that protect your streak (long-press streak pill, up to 3/month)
- **Messages in Bottles** — Notes to future self, written during good sessions, delivered on fog days
- **The Source** — "Why did you start?" question at session 5, silent margin notes that accumulate, revealed at The Reading (50 hours)
- **Milestones** — 32 achievement definitions across 4 categories (Hours, Streak, Sessions, Special)
- **Celebration Overlay** — Animated full-screen celebrations for milestones, fog days, and bottle deliveries

### Design Language: "Liquid Glass"
- Frosted translucent glass cards with `backdrop-filter: blur(40px)`
- Specular highlights (bright edges simulating glass catching light)
- Inner refraction glow
- Deep blue/indigo palette (transitioned from original teal)
- Ambient background color bleeding through panels
- Glass tab bar with active glow

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Styling | Tailwind CSS v4 |
| Build | Vite 7 |
| Storage | localStorage (no backend) |
| Audio | Web Audio API (OscillatorNode, BiquadFilterNode, DynamicsCompressor) |
| PWA | Service worker + manifest.json |
| Node | **v20 required** — path: `/usr/local/opt/node@20/bin` |

### Running the Dev Server
```bash
# Via launch.json config (preferred):
# Config name: "river-dev", port 5173
# Or manually:
cd "/Users/Max/Claude/Guitar Tracking App/.claude/worktrees/loving-euclid"
PATH="/usr/local/opt/node@20/bin:$PATH" npx vite --host
```

The dev server runs on `http://localhost:5173`. The pitch deck is at `/pitch.html`.

---

## Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Page routing, session state, timer state
├── index.css                   # Liquid Glass design system
├── contexts/
│   └── ThemeContext.jsx         # Theme context (light/dark/auto)
├── components/
│   ├── HomePage.jsx             # Dashboard: hero stat, flow pill, river preview, sessions
│   ├── LogPage.jsx              # Manual session logging form
│   ├── StatsPage.jsx            # Full river view, stats, personal bests
│   ├── SettingsPage.jsx         # Theme, weekly goal, data management
│   ├── TabBar.jsx               # Glass tab bar
│   ├── TimerFAB.jsx             # Floating action button + expanded timer overlay
│   ├── SoundscapePanel.jsx      # Rain + metronome controls
│   ├── RiverSVG.jsx             # Catmull-Rom river visualization
│   ├── ProgressRing.jsx         # SVG progress ring
│   ├── CelebrationOverlay.jsx   # Milestone/fog/bottle celebrations
│   ├── QuoteCard.jsx            # Motivational quotes
│   ├── ReadingCeremony.jsx      # The Reading at 50 hours
│   ├── ShareCard.jsx            # Shareable stats card
│   ├── SignalFireCard.jsx       # Re-engagement after 7+ day absence
│   ├── SourceQuestion.jsx       # "Why did you start?" question
│   ├── InsightCard.jsx          # Practice insights
│   └── ErrorBoundary.jsx        # Error handling
└── utils/
    ├── storage.js               # localStorage CRUD for sessions
    ├── audio.js                 # Web Audio: rain (brown noise, 3 layers) + metronome (triangle wave)
    ├── milestones.js            # 32 milestone definitions, detection logic
    ├── source.js                # Source question, margin notes, The Reading
    ├── fogHorn.js               # Fog day system (3/month limit)
    ├── bottleMessages.js        # Message in a bottle CRUD
    ├── insights.js              # Practice insight generation
    ├── quotes.js                # Quote database
    ├── shareRenderer.js         # Canvas-based share card renderer
    └── theme.js                 # Theme persistence, system detection

public/
├── pitch.html                   # Standalone pitch deck (11 slides, zero deps)
├── manifest.json                # PWA manifest
├── sw.js                        # Service worker
├── icon.svg, icon-192.png, icon-512.png
├── offline.html                 # Offline fallback
└── vite.svg

docs/
├── OVERNIGHT-PLAN.md            # Master coordination (start here for status)
├── competitions/
│   ├── river-viz.md             # WS1: Pitch deck river visualization
│   ├── app-overhaul.md          # WS3: Image + sound + timer
│   └── guitar-refs.md           # WS4: Guitar reference documents
└── briefs/
    └── AGENT-BRIEF.md           # You are here
```

---

## The Four Workstreams

### WS1: Pitch Deck — Flowing River Visualization
**What:** Replace the static 2px river-thread in `pitch.html` with a living, scroll-responsive river.
**Where:** `public/pitch.html` (standalone HTML, all inline CSS/JS)
**Competition brief:** `docs/competitions/river-viz.md`
**Key insight:** The river changes character per slide — thin/calm at the Hook, turbulent/coral at the Wound, amber at Philosophy, wide/strong at Proof, golden delta at the Ask.

### WS2: Pitch Deck — Demo Content
**What:** Add animated CSS mockups showing logging, Fog Horn, and milestone features.
**Where:** `public/pitch.html`
**Blocked by:** WS1 (add demos after the river is in place)
**Approach:** CSS-animated device frames showing step-by-step feature flows. No screenshots — the animations ARE the demo.

### WS3: App Overhaul — Image, Sound & Timer
**What:** Comprehensive improvement to visual design, audio quality, and timer UX.
**Where:** Multiple files in `src/`
**Competition brief:** `docs/competitions/app-overhaul.md`
**Key files:**
- `src/utils/audio.js` — Sound (recently rewritten, may need more work)
- `src/components/TimerFAB.jsx` — Timer UX
- `src/index.css` — Design system
- Various components for visual improvements

### WS4: Guitar Reference Documents
**What:** Add scale diagrams, chord charts, fretboard maps, and other reference material.
**Where:** New components + utils in `src/`
**Competition brief:** `docs/competitions/guitar-refs.md`
**Key insight:** This is about what a guitarist actually needs mid-practice. Scales (pentatonic minor, major, blues), open chords, barre shapes, common progressions, fretboard note map, circle of fifths, strumming patterns. All SVG-rendered, all fitting the Liquid Glass aesthetic.

---

## Design Competition Protocol

Each workstream uses a structured design competition. The protocol is documented in detail in the main repo at `DESIGN-COMPETITION-RETROSPECTIVE.md`. Key points:

### Constraint-Based Personas (Not Attitude-Based)
Each competition has 3 personas defined by **constraints**, not attitudes. The Fog Horn competition used attitude-based personas (Dreamer, Architect, Poet) and they converged. The Source competition used constraint-based personas (Archaeologist, Minimalist, Contrarian) and produced dramatically more diverse output. Always use constraints.

### 5-Round Bracket
```
R1: 15 proposals scored → top 8 advance
R2: 8 iterate with structured feedback (Strength / Weakness / What-if)
R3: Re-score → top 4 advance
R4: 4 iterate with devil's advocate + cross-pollination
R5: Final score → winner declared (consider synthesis if complementary)
```

### Structured Feedback Format
For each proposal in iteration rounds:
- **Strength:** What works well
- **Weakness:** What falls short
- **What-if:** A specific suggestion that could elevate it

### Devil's Advocate
When judges converge on a favorite, explicitly argue against it. This is how The Reading was invented — Sara's devastating critique of C4 forced the breakthrough.

### Cross-Pollination
When proposals are eliminated, their best ideas are offered to survivors. Good ideas outlive the proposals that carry them.

### Scoring
50 points total. 5 virtual judges, each giving 1-10. Use the full range — a 2 is legitimate if the proposal is genuinely bad. Don't compress scores into 7-9.

---

## Audio System Deep Dive

`src/utils/audio.js` was recently rewritten. Current implementation:

### Rain
- Brown noise generated from white noise with leaky integration (`leaky = 0.99`)
- Stereo: separate left/right channels, 12-second buffers
- 3 parallel filter layers:
  - **Low rumble:** Lowpass 400Hz (Q 0.5) at 50% gain
  - **Mid splatter:** Bandpass 1800Hz (Q 0.8) at 30% gain, LFO on frequency (0.15Hz ±500Hz)
  - **High shimmer:** Highpass 4000Hz (Q 0.3) → Lowpass 8000Hz shelf, at 15% gain
- Master LFO on combined gain (0.08Hz, ±5%)
- DynamicsCompressor (threshold -18, knee 12, ratio 4)
- Fade-in 1.5s, fade-out 0.8s

### Metronome
- Triangle wave oscillator (1200Hz accent, 800Hz regular)
- Noise burst through bandpass (1000Hz, Q 2)
- Triangle at 60% gain, noise at 35%
- Exponential decay envelopes (25-35ms duration)
- Scheduled via `AudioContext.currentTime` lookahead

---

## Milestone System

`src/utils/milestones.js` — 32 milestones in 4 categories:

**Hours (9):** First Drop (1h), The Stream Begins (10h), Finding the Current (25h), Deep Water (100h), The River Widens (250h), Ocean Bound (500h), The Endless River (1000h)

**Streak (9):** First Ripple (3 days), The Current Holds (7 days), Habit Formed (21 days), Monthly Tide (30 days), The Eternal River (365 days)

**Sessions (5):** First Session, 10 sessions, 50, 100, 500

**Special:** Comeback (session after 7+ day gap)

---

## What "Premium" Means for This App

This is an app built by a musician for musicians. "Premium" doesn't mean corporate polish — it means:
- **Intentional:** Every pixel serves a purpose
- **Atmospheric:** The app should feel like a place, not a tool
- **Respectful:** No notifications, no gamification tricks, no social pressure
- **Beautiful:** The kind of thing you'd show someone not because of what it does, but because of how it looks

The Liquid Glass aesthetic was inspired by Apple Health's mindfulness section — dark, glowing, serene. The river metaphor runs through everything: practice "flows," streaks are "currents," rest days are "fog," milestones are natural features of a river journey.

---

## Environment Notes

- **Working directory:** `/Users/Max/Claude/Guitar Tracking App/.claude/worktrees/loving-euclid`
- **Node 20 path:** `/usr/local/opt/node@20/bin` (system node is 7.7.3 — DO NOT use it)
- **Dev server:** Via `.claude/launch.json`, name `river-dev`, port 5173
- **Git branch:** `claude/loving-euclid`
- **This is a git worktree** — the main repo is at the same path

---

## How to Verify Changes

1. Start the dev server (`river-dev` via launch.json)
2. Check for build errors in server logs
3. Use preview tools to screenshot and verify visual changes
4. For pitch.html: navigate to `http://localhost:5173/pitch.html`
5. For the app: navigate to `http://localhost:5173`
6. Test at 1280x800 (desktop/presentation) and 375x812 (mobile)

---

## How to Update Status

After completing work on a workstream:
1. Update the competition file in `docs/competitions/` with results
2. Update the status table in `docs/OVERNIGHT-PLAN.md`
3. If the workstream is implementation, verify the build passes
4. Note any decisions or trade-offs made

---

## Existing Reference Documents

| Document | Location | Contents |
|----------|----------|----------|
| Design Competition Retrospective | `DESIGN-COMPETITION-RETROSPECTIVE.md` (main repo root) | Full methodology, Fog Horn + Source competition details |
| Efficiency Log | `EFFICIENCY-LOG.md` (main repo root) | Token/cost tracking, model allocation guidelines |
| Project Handoff | `HANDOFF.md` (worktree root) | Project history, architecture, how we work |
| Implementation Plan | `PLAN.md` (worktree root) | Original plan for colorway + timer (mostly complete) |
