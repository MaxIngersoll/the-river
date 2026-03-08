# Competition K: The Ready Page Redesign

## Celebrity Panel — "The Clearing"

**Format:** 6-advisor panel, 3 proposals, multi-axis scoring, synthesis
**Date:** March 8, 2026
**Tier:** 1 (Celebrity Panel)

---

## Round 1: Opening Diagnosis

**Naoto Fukasawa:** The hand reaches for this page and finds twelve objects where there should be one. I have designed MUJI products that sell millions — each one does one thing. This page does twelve things. The user opens it and their fingers hesitate. That hesitation is the failure. A well-designed thing never makes you hesitate.

**Jiro Ono:** I look at this and I see a kitchen where every ingredient is on the counter at once. The tuna, the rice, the ginger, the wasabi, the nori — all sitting out. No omakase chef would serve this way. You present one piece. The guest finishes. You present the next. Each piece is worthy because it appears alone. Here, every element diminishes every other element.

**Jony Ive:** There's a difference between putting everything on the screen and designing something. This is the former. I count at least four distinct navigation systems — the intent tabs, the root selector, the scale selector, and the QuickStart cards — all competing for the same cognitive space. Simplicity isn't about removing features. It's about finding the one idea that organizes everything else. This page hasn't found its idea yet.

**Wynton Marsalis:** When I sit down to practice, I need to know: what am I working on? That's it. One question. This page answers twelve questions nobody asked. A practice room has a music stand with one page on it. Not the whole Real Book open to every page simultaneously. The Oblique card is beautiful — that's a teacher handing you one thought. Everything else is a textbook dumped on the floor.

**Brian Eno:** My Oblique Strategies work because you draw ONE card. One constraint. One provocation. Then you sit with it. This page is the opposite of that principle — it's a warehouse of options where no option has room to breathe. The best creative spaces are mostly empty. The emptiness is what makes the one thing that's there feel electric. I designed ambient music to create space. This page fills every inch of space.

**Dan Abramov:** From a React perspective, this is a 1,170-line single component rendering a fretboard SVG, seven chord diagram SVGs, a circle-of-fifths SVG, four progression strips, twelve note buttons, seven scale buttons, four intent tabs, and three smart cards — all in one render tree. Every state change (root note, scale, intent) re-renders the whole page. The minimum surface area principle says: only render what the user is looking at.

---

## Round 2: Three Proposals

### Proposal A: "The Clearing"
*Radical subtraction. What is the absolute minimum?*

The page opens to three things: the Oblique card, the three QuickStart cards (Continue / Explore / Challenge), and a single question: "What key?" — a compact root+scale selector that is collapsed by default showing only the current key (e.g., "C Major").

Everything else — chord diagrams, fretboard, circle of fifths, progressions, CAGED positions, quick ref — lives behind a single "Open Reference" action that slides up a bottom sheet. The bottom sheet has its own tab navigation (Chords / Scale / Circle / Ref). The Ready page itself is pure launchpad: pick your direction, start playing.

**What's visible on load:** Oblique card, three QuickStart cards, collapsed key badge.
**What's hidden:** All reference material (in bottom sheet).
**What's removed:** The "Ready" heading (the tab name says it), the tuning strip (moved to Tuner tab), scale notes row at the bottom (redundant with fretboard view).

### Proposal B: "Progressive Disclosure"
*Everything exists, but layered. You see one thing at a time.*

The page opens to the Oblique card and three QuickStart cards. Below them: a single "key context bar" showing the current root + scale as a horizontal strip (tappable to change). Below that: one intent at a time, full-width, with swipe-to-switch between Chords / Scale / Circle / Ref. No tabs visible — just the content, with subtle edge-peek indicators showing there's more to the left or right.

The key selector expands inline when tapped — twelve note buttons slide down, scale pills appear below. Tap a note, it collapses. The content area below updates reactively.

**What's visible on load:** Oblique card, QuickStart cards, key context bar, one reference view (Chords by default).
**What's hidden:** Other reference views (swipe to access), key selector (tap to expand).
**What's removed:** "Ready" heading, tuning strip (to Tuner tab), separate section labels.

### Proposal C: "The Instrument"
*The metaphor: sitting down with your guitar. Everything radiates from the key.*

The page is organized around a single hero element: a large, beautiful key display. "C Major" rendered in a dignified serif, centered, with the scale notes orbiting it in a subtle ring. This IS the root selector — tap the note to cycle, tap "Major" to change scale type. The key display is the page.

Below it: three contextual cards that change based on the selected key — one shows the top chord (with a single diagram), one shows a suggested progression, one shows a prompt (the Oblique card, redesigned as one of the three). These three cards replace both the QuickStart cards and the Oblique card.

Tapping any card expands it: the chord card opens to the full diatonic set, the progression card opens to all progressions with the fretboard, the prompt card reveals the full Oblique collection. The CurrentCard intelligence is woven into the chord and progression suggestions rather than being a separate element.

**What's visible on load:** Hero key display, three contextual cards.
**What's hidden:** Full chord grids, fretboard, circle of fifths, progressions (expand from cards).
**What's removed:** QuickStart cards (merged into contextual cards), "Ready" heading, tuning strip, Root Lock label, scale selector row, intent tabs, all section dividers.

---

## Round 3: Debate & Scoring

Each panelist scores 1-10 on their axis.

### Fukasawa — Intuition ("Does the hand know what to do?")
- **A (The Clearing): 9** — Three cards, one collapsed selector. The hand knows exactly what to do. Almost no decisions.
- **B (Progressive Disclosure): 7** — The key bar is intuitive, but "swipe to see more" is invisible until learned. First-time users will not discover the other reference views.
- **C (The Instrument): 8** — The hero key display is bold but "tap C to cycle through notes" is a hidden gesture. The three contextual cards are clear.

### Jiro — Craft ("Is every pixel worthy?")
- **A: 7** — Clean but almost too sparse. The bottom sheet risks feeling like a junk drawer if not carefully designed. The clearing is beautiful but what's behind the door matters.
- **B: 8** — Each view, shown alone, gets the full-width treatment it deserves. One view at a time means each can be crafted with care.
- **C: 9** — The hero key display is a showpiece. A serif "C Major" with orbiting notes — that's a screenshot. Every element is intentional. This is the most craft-forward proposal.

### Ive — Simplicity ("Is there intention behind every element?")
- **A: 9** — Maximum intention. Every element earns its place on the main screen. The reference material exists but it's a deliberate second action. This is the purest expression of "launchpad."
- **B: 7** — The swipe model is elegant but the page still carries all four reference views in the DOM, just hidden. The simplicity is visual, not structural.
- **C: 8** — One hero idea (the key) organizes everything. That's a strong structural simplicity. But the three-card expansion model is really three hidden pages — complexity deferred, not resolved.

### Marsalis — Playability ("Can a musician use this in 5 seconds?")
- **A: 8** — Open app, see QuickStart cards, tap Continue, start playing. Fast. But getting to chord diagrams requires opening the bottom sheet — one extra step when I need a quick chord reference mid-practice.
- **B: 8** — Open app, see chords right there (default view). Swipe to fretboard. This is the fastest path to reference material while still being clean.
- **C: 6** — Beautiful, but I have to tap to expand cards to see the chords. That's two taps to get to what I need. When I'm holding a guitar, fewer taps wins. The hero display is for looking, not for playing.

### Eno — Surprise ("Does it create space for the unexpected?")
- **A: 8** — The clearing is itself a surprise. Opening a practice app and seeing mostly emptiness is provocative. The Oblique card shines brighter in empty space. But the bottom sheet is predictable.
- **B: 6** — Swipeable views are a solved pattern. Nothing unexpected. The Oblique card is just one element among the scroll.
- **C: 9** — The orbiting scale notes, the hero key display, the three cards that bloom open — this has theatrical surprise. It reimagines what a practice page looks like. The Oblique card woven into the contextual cards means surprise is built into the structure, not bolted on.

### Abramov — Feasibility ("Can we build this with React + Tailwind, no new deps?")
- **A: 9** — Straightforward. A collapsed/expanded key selector, three card components, and a bottom sheet with the existing intent tabs. The bottom sheet is just a `div` with `translate-y` animation. All existing components (ChordCard, FretboardDiagram, etc.) slot right in. Lazy-load the sheet content.
- **B: 7** — Swipe-to-switch needs touch event handling or a swipe library. Horizontal scroll with snap points (`scroll-snap-type: x mandatory`) works natively but edge-peek indicators need IntersectionObserver. Doable but more fragile on different devices.
- **C: 7** — The orbiting scale notes animation is custom SVG/CSS work. The expand/collapse cards need coordinated layout animations. The hero key display with tap-to-cycle needs careful state management. Nothing impossible, but highest implementation effort.

### Score Totals
| Proposal | Fukasawa | Jiro | Ive | Marsalis | Eno | Abramov | **Total** |
|----------|----------|------|-----|----------|-----|---------|-----------|
| A: The Clearing | 9 | 7 | 9 | 8 | 8 | 9 | **50** |
| B: Progressive Disclosure | 7 | 8 | 7 | 8 | 6 | 7 | **43** |
| C: The Instrument | 8 | 9 | 8 | 6 | 9 | 7 | **47** |

---

## Round 4: Synthesis — "The Clearing, with Craft"

**The panel's verdict:** A wins on structure, C wins on beauty. Take A's radical subtraction and pour C's craft into it.

**Marsalis:** "Give me A's speed with B's default-to-chords. The first reference view I see when I open the sheet should be chords — that's what musicians reach for."

**Eno:** "Keep C's idea of weaving the Oblique card into the structure rather than floating above it. The Oblique card should feel like it belongs."

**Jiro:** "A's bottom sheet must not become a junk drawer. It needs the same care as the main screen. Each tab inside the sheet should feel like its own room."

**Ive:** "The collapsed key badge from A is the right call. But make it beautiful — a pill that says 'C Major' in a way that makes you want to tap it."

**Fukasawa:** "The three QuickStart cards should feel like three doors. Not three buttons. Doors you walk through."

**Abramov:** "The bottom sheet should lazy-render its content. Only mount the active tab's components. This cuts the initial render from 12 SVG chord diagrams + fretboard + circle to just three cards."

---

## Winning Design: "The Clearing" (Synthesized)

### Layout — First Load (Mobile 375px)

```
+───────────────────────────────+
│  [Oblique Card]               │  <- Daily surprise, dismissible
│  "Try an Fsus2 today —        │     Rotated -0.5deg, serif italic
│   it sounds like a question"  │     Tap to dismiss (X button)
│                               │
+───────────────────────────────+
│                               │
│  ┌─────┐ ┌─────┐ ┌─────┐    │  <- QuickStart triptych
│  │  →  │ │  ◇  │ │  ⚡ │    │     Continue / Explore / Challenge
│  │Cont.│ │Expl.│ │Chall│    │     Each fires timer + sets key
│  │Em   │ │F#Dor│ │A Pop│    │
│  └─────┘ └─────┘ └─────┘    │
│                               │
│  ┌───────────────────────┐   │  <- Key Context Pill
│  │  C Major        [▾]  │   │     Tappable. Shows current root+scale.
│  └───────────────────────┘   │     Tap to expand inline selector.
│                               │
│  ┌───────────────────────┐   │  <- The Current (smart suggestion)
│  │ THE CURRENT            │   │     Only shows if 3+ sessions exist.
│  │ Try F# Dorian — focus  │   │     Blue left border accent.
│  │ on scales              │   │     "Flow" button starts timer.
│  │ [▶ Flow] [Load ref]   │   │
│  └───────────────────────┘   │
│                               │
│  ┌───────────────────────┐   │  <- Reference Button
│  │  ♫  Open Reference     │   │     Tapping opens bottom sheet.
│  │      Chords · Scales · │   │     Subtle, not commanding.
│  │      Circle · Ref      │   │
│  └───────────────────────┘   │
│                               │
│         (breathing room)      │  <- Empty space. Intentional.
│                               │
+───────────────────────────────+
```

### Bottom Sheet (slides up on "Open Reference" tap)

```
+───────────────────────────────+
│  ──── (drag handle) ────      │  <- Swipe down to dismiss
│                               │
│  [Chords] [Scale] [Circle] [Ref]  <- Tab bar inside sheet
│                               │
│  C Major                [▾]  │  <- Key pill (also here, synced)
│                               │
│  ┌───────────────────────┐   │
│  │                       │   │
│  │  (Active tab content) │   │  <- Only active tab renders.
│  │                       │   │     Chords: 4-col grid + progressions
│  │                       │   │     Scale: fretboard + CAGED positions
│  │                       │   │     Circle: Circle of Fifths
│  │                       │   │     Ref: Quick reference shapes
│  │                       │   │
│  └───────────────────────┘   │
+───────────────────────────────+
```

### Key Selector (expanded state, inline)

When the key pill is tapped (on main screen OR inside sheet):

```
  ┌───────────────────────────┐
  │  C Major               [▴]│
  │                            │
  │  C C# D D# E F F# G G# ...│  <- 12 note buttons, horizontal scroll
  │  Maj Min Pent Blu Dor Mix  │  <- Scale type pills
  └───────────────────────────┘
```

Selecting a note or scale auto-collapses the selector after a 300ms delay.

### Interaction Model

1. **Open app** -> see Oblique card + three QuickStart cards + key pill + Current suggestion + Reference button. Total: 5-6 elements max.
2. **Tap QuickStart card** -> sets root+scale, starts timer. Fastest path to practicing.
3. **Tap key pill** -> expands inline note+scale selector. Pick a key. Collapses.
4. **Tap "Open Reference"** -> bottom sheet slides up with four tabs. Chords tab active by default.
5. **Inside bottom sheet** -> switch between Chords / Scale / Circle / Ref tabs. Each renders only when active.
6. **Swipe down on sheet** -> dismisses back to the clearing.

### What Gets REMOVED Entirely
- "Ready" heading + subtitle (tab name is enough)
- Scale notes row at bottom of Chords view (redundant with Scale fretboard view)
- Section divider labels ("Root Lock", "Progressions") -- let content speak

### What Gets MOVED
- **Tuning strip (E B G D A E buttons)** -> Tuner tab (it belongs with the tuner, not the reference page)
- **Root Lock (12 chromatic buttons) + Scale selector** -> collapsed into the Key Context Pill (expandable inline)
- **Intent tabs (Chords/Scale/Circle/Ref)** -> inside the bottom sheet (not on main page)
- **Chord diagrams, fretboard, CAGED, Circle of Fifths, progressions** -> inside bottom sheet tabs

### Component Hierarchy

```
ShedPage.jsx (renamed or kept — the "Ready" tab)
├── ObliqueCard                     (existing, extracted)
├── QuickStartCards                 (existing, extracted)
├── KeyContextPill                  (NEW — collapsed root+scale display)
│   └── KeySelector                 (NEW — expandable note+scale picker)
├── CurrentCard                     (existing, extracted)
├── ReferenceButton                 (NEW — opens bottom sheet)
└── ReferenceSheet                  (NEW — bottom sheet container)
    ├── SheetTabBar                 (NEW — Chords/Scale/Circle/Ref)
    ├── KeyContextPill              (shared — synced with main page)
    ├── ChordsView                  (extracted from ShedPage)
    │   ├── ChordCard[]             (existing)
    │   └── ProgressionStrips       (existing)
    ├── ScaleView                   (extracted from ShedPage)
    │   ├── FretboardDiagram        (existing)
    │   └── CAGEDPositions          (existing)
    ├── CircleView                  (extracted from ShedPage)
    │   └── CircleOfFifths          (existing)
    └── QuickRefView                (extracted from ShedPage)
```

This breaks ShedPage.jsx from 1,170 lines into ~8 focused components. The main ShedPage becomes a ~150-line orchestrator. Each sub-component is independently renderable and only mounts when its tab is active.

### Implementation Notes

- **Bottom sheet:** Pure CSS + React state. `transform: translateY(100%)` -> `translateY(0)` with `transition: transform 300ms ease-out`. A backdrop overlay with `onClick` to dismiss. Drag handle optional (tap-to-dismiss + backdrop click is sufficient for v1).
- **Key Context Pill:** A `button` with `onClick` toggling `isExpanded` state. When expanded, renders the note grid + scale pills inline below. Uses `max-height` transition for smooth expand/collapse.
- **Lazy tab rendering:** `{activeTab === 'chords' && <ChordsView />}` -- conditional rendering means React unmounts inactive tabs entirely. No wasted renders.
- **Shared key state:** `rootNote` and `scale` state live in ShedPage, passed as props to both KeyContextPill and ReferenceSheet. Changes in either location sync automatically.
- **No new dependencies.** Everything uses existing React + Tailwind + CSS transitions.
- **Mobile-first:** All measurements designed for 375px. The bottom sheet is full-width with 16px padding. The key pill is full-width. QuickStart cards use `flex-1` with `min-w-[100px]`.

### Awards

**Wildcard Award:** Proposal C's "orbiting scale notes" around a hero key display. Beautiful idea. Not practical for v1, but could become a future visualization.

**Comedy Award:** Jiro, for comparing the current Ready page to a sushi kitchen with every ingredient on the counter. "You present one piece. The guest finishes. You present the next." Someone tell the fretboard diagram it's not being served yet.

---

*Post-credits scene:*

*FUKASAWA sits in silence staring at a blank phone screen.*

*MARSALIS: "You've been looking at that for ten minutes."*

*FUKASAWA: "Yes. It's the most beautiful Ready page I've ever seen."*

*MARSALIS: "...there's nothing on it."*

*FUKASAWA: "Exactly."*

*ENO, from the back of the room: "I'd add one ambient drone."*

*ABRAMOV, not looking up from his laptop: "That's a new dependency."*
