# WS1: Flowing River Visualization — Design Competition

> How should the river flow through the pitch deck?

---

## The Brief

The pitch deck (`public/pitch.html`) is an 11-slide scrollable presentation for The River guitar practice app. Currently it has a `.river-thread` — a static 2px vertical line at 6% opacity. Essentially invisible.

The user wants a **real river** that flows through the entire deck and adapts as you scroll. The river is the common visual thread — it should feel like you're journeying down a river as you scroll through the slides.

### Requirements
- The river must be visible and impactful — not decoration, but a character
- It must adapt per slide: shape, color, width, glow, and emotional character
- It must respond to scroll position with smooth transitions
- It must not overpower slide content (z-index behind slides, appropriate opacity)
- It must work at 1280x800 viewport (primary) and degrade gracefully on mobile
- Zero external dependencies — pure HTML/CSS/JS/SVG in the standalone file

### The 11 Slides and Their Emotional Register
| # | Name | Emotion | River Character |
|---|------|---------|-----------------|
| 0 | Hook — "The River" | Wonder, invitation | Thin, calm, teal — the river appears |
| 1 | Wound — "90%" | Urgency, pain | Turbulent, coral/red, agitated |
| 2 | Philosophy | Warmth, intimacy | Calm, amber, widens slightly |
| 3 | Product | Confidence, clarity | Centered behind device, blue-teal |
| 4 | Experience | Breadth, possibility | Gentle wave, purple-blue-teal |
| 5 | Source | Warmth, origin | Drifts to side, amber glow, intimate |
| 6 | Proof | Strength, evidence | Wide, strong, teal-blue — most confident |
| 7 | Market | Scale, opportunity | Wide orbit, blue-purple |
| 8 | Model | Balance, fairness | Centered, calm, blue-teal |
| 9 | Vision | Forward momentum | Leans forward, teal-purple, growing |
| 10 | Ask — "Fund the river" | Crescendo, golden | Widest, golden amber, delta — maximum presence |

### Technical Context
- The pitch.html is a standalone file (~1350 lines) with all CSS/JS inline
- Current elements: scroll-progress bar, ambient glow (mouse-following), particles, slide-number indicator, nav dots, keyboard/touch navigation
- ViewBox approach with SVG works well for responsive paths
- IntersectionObserver already used for slide visibility
- `requestAnimationFrame` already used for counters

---

## Constraint-Based Personas

### The Hydrologist
**Constraint:** Must use fluid dynamics principles — Bezier interpolation between states, scroll-velocity-sensitive turbulence, particle flow along the path using `getPointAtLength()`. The river must feel physically accurate.

### The Minimalist
**Constraint:** Maximum 100 lines of JS for the river engine, maximum 60 lines of CSS. Must achieve the effect with elegant economy. No canvas — SVG only. Prove that less code can create more impact.

### The Cartographer
**Constraint:** The river must tell a visual story that maps 1:1 to the narrative arc. Each slide's river character must be distinct enough that you could identify the slide from the river alone. The river isn't decoration — it's a second narrative layer.

---

## Competition Structure

```
Round 1: Each persona proposes 5 approaches (15 total)
         Score all 15, top 8 advance
Round 2: Top 8 iterate with structured feedback (Strength / Weakness / What-if)
Round 3: Re-score, top 4 advance
Round 4: Top 4 iterate with devil's advocate on consensus
Round 5: Final scoring, winner declared
```

---

## Evaluation Criteria (50 points total)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Visual Impact | 12 | Does the river command attention without overpowering content? |
| Narrative Mapping | 10 | Does each slide's river character match its emotional register? |
| Scroll Feel | 10 | Are transitions smooth? Does it feel organic, not mechanical? |
| Performance | 8 | 60fps? Reasonable memory usage? No jank on scroll? |
| Implementation Elegance | 5 | Clean code? Maintainable? Reasonable complexity? |
| Emotional Response | 5 | Does seeing the river make you feel something? |

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
