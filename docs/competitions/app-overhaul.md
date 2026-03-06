# WS3: App Overhaul — Image, Sound & Timer — Design Competition

> How should the app's visual design, audio, and timer experience evolve?

---

## The Brief

The River is a guitar practice tracking app built with React 19 + Tailwind CSS v4. It uses a "Liquid Glass" design system (frosted glass panels, backdrop-filter blur, ambient glow, deep blue/indigo palette). The app has a timer (TimerFAB.jsx), rain + metronome audio (audio.js), and several feature pages.

The user wants a **comprehensive overhaul** of three interconnected aspects:

### 1. Image (Visual Design)
The Liquid Glass system was built rapidly. Questions to investigate:
- Are there rough edges, inconsistencies, or areas that don't feel premium?
- Does the glass effect work everywhere or does it feel heavy/samey on some pages?
- Is the color palette cohesive? Are there stray colors or confusing visual hierarchy?
- Does the app feel modern and distinctive, or generic?
- What about micro-interactions, transitions, loading states?
- Mobile-first PWA — does it feel native?

### 2. Sound (Audio Experience)
The audio system (`src/utils/audio.js`) was recently rewritten:
- **Rain**: Brown noise (stereo, 12s buffer), 3 parallel layers (low rumble 400Hz LP, mid splatter 1800Hz BP, high shimmer 4kHz HP), LFO modulation, DynamicsCompressor
- **Metronome**: Triangle wave (1200Hz accent, 800Hz regular) + bandpass-filtered noise burst, exponential decay envelopes

Questions to investigate:
- Is the rain convincing? Should there be more variation (thunder, distant rumble, intensity changes)?
- Does the metronome sound woody/percussive enough, or still too electronic?
- Should there be other soundscape options (forest, ocean, cafe, white noise)?
- How does sound interact with the timer UX? Fade-in on start? Fade-out on pause?
- Volume controls? Sound presets?

### 3. Timer (Practice Timer UX)
`src/components/TimerFAB.jsx` implements a floating action button that expands to a full-screen timer overlay:
- Idle → Running (minimized, shows elapsed time) → Expanded (full-screen with controls) → Save
- State persisted in localStorage across page navigation

Questions to investigate:
- Does the FAB feel natural? Is the expand/collapse animation smooth?
- Is the full-screen timer view visually compelling for long practice sessions?
- Should the timer show more info during practice (current streak context, milestones approaching)?
- How do rain/metronome controls integrate with the timer view?
- What about the "save session" flow — note entry, duration confirmation?

### Technical Constraints
- React 19 + Tailwind CSS v4 + Vite 7
- PWA, no backend, localStorage only
- Node 20 at `/usr/local/opt/node@20/bin`
- Must maintain existing data format compatibility
- All existing features must continue working

### Key Files
```
src/utils/audio.js           — Audio engine (rain + metronome synthesis)
src/components/TimerFAB.jsx  — Timer floating action button + overlay
src/components/HomePage.jsx  — Main dashboard
src/components/LogPage.jsx   — Manual session logging
src/components/StatsPage.jsx — Statistics and river visualization
src/components/SoundscapePanel.jsx — Sound controls panel
src/index.css                — Design system (Liquid Glass)
src/App.jsx                  — App shell, routing, state management
```

---

## Constraint-Based Personas

### The Audiophile
**Constraint:** Must focus primarily on sound design. Every proposal must include specific Web Audio API implementation details — oscillator types, filter frequencies, envelope shapes, buffer sizes. The sound must be so good that users WANT to practice just to hear it. Visual/timer changes are secondary.

### The Interaction Designer
**Constraint:** Must focus primarily on the timer UX and micro-interactions. Every proposal must include specific animation curves, state transitions, and touch targets. The timer experience must feel so fluid that starting practice is effortless and stopping feels reluctant. Sound/visual changes are secondary.

### The Art Director
**Constraint:** Must focus primarily on visual cohesion and premium feel. Every proposal must include specific color values, spacing units, and component-level design changes. The app must look like it costs $50M to build. Sound/timer changes are secondary.

---

## Competition Structure

```
Round 1: Each persona proposes 5 approaches (15 total)
         Score all 15, top 8 advance
Round 2: Top 8 iterate with structured feedback
Round 3: Re-score, top 4 advance
Round 4: Top 4 iterate with cross-pollination + devil's advocate
Round 5: Final scoring, winner declared
         Consider synthesis if top approaches are complementary
```

**Important:** Because these three domains (image, sound, timer) are interconnected, the final winner may be a synthesis of the best ideas across personas — unlike the previous competitions where synthesis was rejected. Keep this possibility open.

---

## Evaluation Criteria (50 points total)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Holistic Improvement | 12 | Does the proposal elevate the entire experience, not just one aspect? |
| Sound Quality | 8 | Is the audio convincing, pleasant, and additive to the practice experience? |
| Timer UX | 8 | Is starting/stopping/saving practice effortless and satisfying? |
| Visual Polish | 8 | Does the app look and feel premium, consistent, and distinctive? |
| Technical Feasibility | 7 | Can this be implemented without major architectural changes? |
| Implementation Cost | 7 | How much code needs to change? Lower is better, all else equal. |

---

## Special Awards

These are awarded regardless of who wins the bracket. They exist to honor the qualities that push the whole team forward.

### The Wildcard Award — Most Creative Idea
For the proposal that made everyone stop and say "wait, you can DO that?" The idea that nobody else would have thought of. It doesn't have to be practical. It just has to expand what we thought was possible.

### The Comedy Award — Funniest Idea
For the proposal (or moment within a proposal) that genuinely made people laugh. Humor is a sign of intelligence and creative safety. If nobody's laughing, we're not reaching far enough.

*Both awards are announced during the final round, with specific callouts for what made them special. Winners get their ideas documented as "worth revisiting" even if they didn't win the bracket.*

---

## Results

*To be filled during competition execution.*
