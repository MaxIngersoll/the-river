# WS4: Guitar Reference Documents — Design Competition

> What reference material should a guitarist always have at hand, and how should we present it?

---

## The Brief

The River is a practice tracking app, but guitarists need more than a timer — they need quick access to the reference material they consult constantly during practice. Scale diagrams, chord shapes, fretboard maps. Currently, The River has none of this. The user wants to add "handy diagrams of the most important guitar reference documents."

This competition determines **what** to include and **how** to present it within the app's Liquid Glass design language.

### What Guitarists Actually Reference During Practice

**Scales (highest priority):**
- Pentatonic minor (the most-used scale in rock/blues — 5 box positions)
- Pentatonic major (same shapes, different root)
- Major scale (7 positions / 3-note-per-string patterns)
- Natural minor scale
- Blues scale (pentatonic + b5)
- Modes (Dorian, Mixolydian at minimum — most commonly used)

**Chords:**
- Open chords (C, A, G, E, D, Am, Em, Dm — the "CAGED" foundation)
- Barre chord shapes (E-form, A-form — the two essential movable shapes)
- Common progressions (I-IV-V, I-V-vi-IV, 12-bar blues, ii-V-I)
- Chord construction reference (how to build major, minor, 7th, sus, etc.)

**Fretboard:**
- Full fretboard note map (all natural notes, sharps/flats)
- Octave patterns
- Interval relationships (whole step, half step, where intervals fall)
- String tuning reference (standard, drop D, open G, DADGAD)

**Rhythm / Technique:**
- Common strumming patterns (with notation)
- Basic fingerpicking patterns (Travis picking, arpeggios)
- Rhythm notation guide (whole, half, quarter, eighth, triplets, dotted)

**Theory Quick Reference:**
- Circle of fifths
- Key signatures (which sharps/flats in which key)
- Nashville number system basics
- Common chord-scale relationships

### Critical UX Requirement: Accessible During Practice
**The reference material MUST be usable while the practice timer is running.** A guitarist mid-session who needs to check a scale shape shouldn't have to stop their timer, navigate to a different page, find the diagram, then navigate back. The winning proposal must solve this — whether that's an overlay, a split view, a swipe-up panel, or something nobody's thought of yet. The timer stays visible/accessible. The music doesn't stop.

This also means the reference docs should integrate with the logging flow. When you're saving a session, you might want to tag it with what scale/chord/technique you practiced. The reference system and the session system should talk to each other.

### Design Constraints
- Must fit the Liquid Glass design language (frosted panels, blue/indigo palette, ambient glow)
- Must be beautiful, not just functional — this is a premium app, not a textbook
- Must be quick to access during practice (no more than 2 taps from the timer)
- Must be usable WITH the timer running (not instead of it)
- Must work on mobile viewport (375px primary) — fretboard diagrams need careful layout
- SVG-rendered preferred (crisp at any size, themeable)
- No external image assets — everything rendered in code

### Technical Context
- React 19 + Tailwind CSS v4
- Existing tab navigation: Home, Log, Stats, Settings
- Could add a 5th tab, or use a slide-out panel, or integrate into existing pages
- All data is static (reference material doesn't change) — can be hardcoded

---

## Constraint-Based Personas

### The Teacher
**Constraint:** Must prioritize pedagogical usefulness. Every diagram must answer the question "what would a student actually look up mid-practice?" Reference material must be organized by learning journey — beginner → intermediate → advanced. Must include contextual hints ("this scale sounds great over..."). Nothing that requires prior theory knowledge to understand.

### The Luthier
**Constraint:** Must prioritize visual craft. Every diagram must be rendered in SVG with precise fretboard geometry. Strings, frets, dots, nut, bridge — anatomically correct. The fretboard must feel tangible. Finger positions must use consistent visual language. Must look like something you'd frame on a wall, not print from a textbook.

### The Pocket Player
**Constraint:** Must prioritize speed and compactness. Maximum 2 taps to reach any reference. Diagrams must fit on a single mobile screen without scrolling. Must support "practice mode" — i.e., showing the relevant scale/chord while the timer is running. Every pixel must earn its place. No encyclopedic completeness — only what you actually need in the moment.

---

## Competition Structure

```
Round 1: Each persona proposes 5 approaches (15 total)
         Score all 15, top 8 advance
Round 2: Top 8 iterate with structured feedback
Round 3: Re-score, top 4 advance
Round 4: Top 4 iterate with cross-pollination + devil's advocate
Round 5: Final scoring, winner declared
```

---

## Evaluation Criteria (50 points total)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Usefulness | 12 | Would a practicing guitarist actually reach for this? |
| Visual Design | 10 | Does it look premium and fit the Liquid Glass language? |
| Accessibility Speed | 10 | How quickly can you get to the diagram you need? |
| Content Completeness | 8 | Does it cover the essential reference material without bloat? |
| Technical Feasibility | 5 | Can it be built with SVG + React without excessive complexity? |
| Integration | 5 | How naturally does it fit into the existing app flow? |

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
