# Competition E: "The Fingers & The Flow" — Chord Diagrams + Timer Integration

> A guitarist mid-practice needs to see WHERE to put their fingers, and one tap should get them playing.

---

## The Brief

Two critical gaps remain in The Dock: chord cards show note names instead of fingering diagrams, and there's no way to launch the timer directly from reference material. These gaps break the core promise — that The Dock is "your launchpad."

### Current Problems

1. **Chord cards show notes, not shapes** — The diatonic chord view displays "C · E · G" but no fingering diagram. A guitarist looking at "Dm" needs to see the fret positions, not the triad spelling. The `ChordDiagram` component exists for the 12 Quick Ref shapes but doesn't extend to diatonic chords.

2. **No barre chord voicings** — Only open chord shapes exist. Any guitarist past 6 months needs E-form and A-form barre chords. The Dock should show both open and barre voicings for every key.

3. **No timer integration from reference** — The Current Card and Quick Start set the key/scale but don't actually start the timer. The progression strips show I-V-vi-IV but you can't tap "practice this" to start a session. The flow from "what should I play?" to "I'm playing" still requires navigating to the Log tab.

4. **No BPM suggestion** — Progressions and scales should come with tempo suggestions. The metronome is built but disconnected from reference material.

5. **Interval colors are monotone** — All chord notes render in the same blue. Root, third, fifth, seventh should have distinct colors so the guitarist can see the harmonic structure at a glance.

### What Exists Already
- `ChordDiagram` component: renders fret positions for 12 common shapes (E, A, D, G, C, Em, Am, Dm, F, B7, E7, A7)
- `ChordCard` component: shows root/quality/numeral/notes for diatonic chords
- `ProgressionStrips` component: maps roman numerals to chord names
- `TuningStrip` component: Web Audio oscillators per string
- `CurrentCard` + `QuickStartCards`: practice intelligence, sets root/scale
- `TimerFAB`: floating action button with start/pause/stop/save
- Web Audio API engine: metronome + rain soundscape
- `PRACTICE_TAGS`: Technique, Songs, Theory, Improv, Ear Training
- `CHORD_FORMULAS`: major, minor, 7, m7, maj7, dim, sus4, sus2, aug

### Technical Context
- React 19 + Tailwind CSS v4
- "Liquid Glass" design system
- Mobile-first: 375px viewport
- SVG diagrams for fretboard, position diagrams, chord shapes
- Timer is controlled by `TimerFAB` component — it manages its own state via `onSaveSession` callback
- Metronome via `startMetronome(bpm)` from `src/utils/audio.js`
- Session notes can include free-text context

### What We Want
- Every diatonic chord should show a real fingering diagram, not just note names
- Barre chord toggle for moveable shapes
- "Practice This" buttons on progressions and the Current Card that start the timer
- BPM suggestions on progressions
- Interval-colored chord tones (root = blue, 3rd = warm, 5th = neutral, 7th = accent)
- The flow from reference → practicing should be ONE TAP

---

## Constraint-Based Personas

### The Gigging Musician
**Constraint:** Two taps or it doesn't exist. Every chord diagram must be readable at arm's length on a phone screen. Barre chords are non-negotiable — the gig doesn't wait for you to figure out open voicings in Bb. The timer integration must work with one hand while the other holds a pick. No modals, no confirmations, no "are you sure?" — just play.

### The Visual Craftsperson
**Constraint:** Every chord diagram must be beautiful enough to print as a poster. String thickness must vary realistically. Barre indicators must read clearly. Interval colors must form a coherent chromatic language — not random colors, but a system that teaches harmonic structure through visual pattern recognition. The diagram grid must breathe — proper whitespace, proper alignment, no cramming.

### The Flow State Designer
**Constraint:** The entire page must be designed to minimize the time between "I don't know what to play" and "I'm playing." Every element should either start the timer or get out of the way. The BPM suggestion should match the guitarist's recent pace (not too easy, not too hard). The transition from reference to timer should feel like stepping into a river — smooth, natural, no jarring mode switch.

---

## Evaluation Criteria (50 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Diagram Quality | 12 | Are the chord fingering diagrams clear, accurate, and beautiful? |
| Timer Integration | 10 | Can you go from reference to practicing in one tap? |
| Barre Chords | 8 | Are moveable shapes available and well-presented? |
| Interval Colors | 8 | Do the colors teach harmonic structure? |
| Mobile UX | 7 | Everything works perfectly on 375px? |
| Innovation | 5 | Any genuinely new ideas? |

---

## Special Awards

### The Wildcard Award — Most Creative Idea
### The Comedy Award — Funniest Moment

---

## Results

*Competition executed 2026-03-06 by Claude Opus 4.6, with love, humor, and the occasional air guitar solo.*

---

### Phase 1: All 15 Proposals

---

#### PERSONA A: THE GIGGING MUSICIAN (Proposals 1-5)

---

**A1: "The Bouncer"**

*Core Concept:* Every chord card becomes a bouncer at the door of your practice session — tap it and you're in, no questions asked. The diatonic chord grid replaces note-name text (C-E-G) with inline mini SVG chord diagrams rendered at 48x56px. Each card has a subtle play-triangle icon in the bottom-right corner. Tap the diagram to see it bigger; tap the triangle to start the timer with that chord pre-loaded into the session note.

Barre chords appear as a second row beneath open shapes — a segmented toggle at the top of the chord grid reads "Open | Barre" and swaps all 7 diatonic cards between open voicings and their nearest CAGED barre equivalent. The barre indicator is a thick horizontal bar across the nut position with a fret number badge.

Progression strips get a "GO" pill button on the right edge that calls `startMetronome(suggestedBPM)` and triggers `TimerFAB.handleStart()` via a new `onPracticeThis` callback prop drilled from App.jsx. The session note auto-populates with "Pop/Rock in G: G - D - Em - C @ 100 BPM".

*Interval Colors:* Root = `water-4` (#2563EB), 3rd = `coral` (#E8735A), 5th = `text-2` (#57534E), 7th = `lavender` (#A78BFA). Applied to dot fills on the mini chord diagrams.

*River Metaphor:* The bouncer doesn't care about your outfit — just get on the dance floor. The river doesn't wait for you to be ready. Step in.

*What Makes It Different:* No modals anywhere. The "GO" button is the entire design thesis. Everything is one-tap-to-playing.

---

**A2: "Slapback"**

*Core Concept:* Named after the rockabilly delay effect — what you see bounces right back at you as action. The chord diagram grid uses a "card flip" interaction: front face shows the chord name + numeral in large type (readable from across the room), back face shows the SVG fingering diagram. Swipe or tap to flip. But here's the slapback: flipping ANY card also queues it in a "Set List" tray at the bottom of the screen — a horizontal strip of up to 4 chord thumbnails that acts as an instant practice queue.

When the Set List has at least one chord, a pulsing "PLAY" button appears. Tapping it starts the timer, starts the metronome at the BPM shown in a small inline stepper, and the session note auto-fills with "Set List: Am - F - C - G @ 90 BPM".

Barre chords: long-press any card to toggle between open and barre voicing. The card border color shifts from `water-3` to `coral` to indicate barre position.

*Interval Colors:* Same 4-color system but rendered as colored arcs beneath each string in the chord diagram — a "rainbow bridge" effect showing which string carries which interval.

*River Metaphor:* Slapback echo — the reference material echoes directly into your practice session without delay.

*What Makes It Different:* The Set List tray. No other proposal turns chord browsing into session curation. You're building your own practice setlist as you explore.

---

**A3: "The Capo"**

*Core Concept:* A virtual capo system for chord diagrams. The core insight: gigging musicians think in capo positions. "Play G shapes but capo 3 = Bb." This proposal adds a capo selector (frets 0-7) above the chord grid. When capo > 0, all diatonic chord diagrams transpose to show the "shape" the guitarist actually plays (e.g., in Bb Major with Capo 3, the I chord shows a G-shape diagram at fret 3, not the brutal Bb barre chord).

Each chord card is a 64x80 SVG with realistic string thickness (0.8px to 2.4px, matching the existing `STRING_THICKNESS` array). The capo is drawn as a dark horizontal bar across all 6 strings at the capo fret. Below the grid, a single "Practice in [Key] (Capo [N])" button starts the timer.

Barre chords: When capo = 0, a toggle shows barre voicings. When capo > 0, barre shapes are shown relative to the capo position. This is uniquely useful — no other guitar app handles capo + barre correctly.

*Interval Colors:* Root dots are solid `water-4`, 3rds have a warm `coral` ring, 5ths are hollow circles with `text-3` stroke, 7ths get `lavender` fill. The visual hierarchy: solid > ring > hollow teaches "root is most important."

*River Metaphor:* The capo is like a dam — it changes where the river starts, but the water still flows the same way downstream.

*What Makes It Different:* Capo intelligence. This is the feature that gigging musicians actually need and no practice app provides. Playing Bb as "G shape capo 3" is how real humans think.

---

**A4: "One-Hander"**

*Core Concept:* Every interaction is designed for one-handed thumb operation on a phone held in the fretting hand while the picking hand holds a pick. The chord grid is a single vertical scroll list (not a grid) — each chord gets a full-width row with the diagram on the left (48px wide), chord name center, and a large "play" hit target on the right (56x56px minimum touch target).

The timer integration is radical: swiping right on ANY chord card or progression strip starts the timer. No button needed — it's a gesture. The swipe reveals a blue "river" animation underneath (a CSS `translateX` + gradient reveal) and then the timer begins. The metronome starts at the BPM shown in the progression strip.

Barre chord toggle is a floating pill in the top-right of the chord section: "OPEN" or "BARRE" — large enough to tap with a thumb at any screen position.

*Interval Colors:* Root = filled blue circle, 3rd = small triangle marker, 5th = open circle, 7th = diamond. Shape-coded rather than color-coded, ensuring accessibility for colorblind musicians.

*River Metaphor:* Swipe right to step into the river. The gesture IS the metaphor — horizontal motion, like water flowing.

*What Makes It Different:* Gesture-based timer launch. No other proposal uses swipe. And the shape-coded intervals solve colorblindness — a real accessibility win.

---

**A5: "The Setlist"**

*Core Concept:* The Dock becomes a live setlist builder. At the top: a horizontal "Setlist Rail" showing 1-8 chord slots (empty slots shown as dashed outlines). Tapping any diatonic chord card adds it to the next empty slot. Tapping a filled slot removes it. Below the rail: a big green "PLAY SETLIST" button with BPM stepper.

When you hit play: the timer starts, metronome clicks, and the Setlist Rail becomes a "Now Playing" bar that highlights each chord in sequence (4 bars each at the selected BPM). The chord diagram enlarges to fill 200x240px. After cycling through all chords, it loops.

Chord diagrams: standard 50x56 SVG viewBox but rendered at 72px width in the grid for readability. Barre chords shown with a thick curved line across the barre fret and a circled fret number.

*Interval Colors:* Progressive opacity — root at 100% opacity, 3rd at 80%, 5th at 60%, 7th at 40%. Creates a visual "depth" that teaches harmonic importance through visual weight.

*River Metaphor:* The setlist is the river's course — you've charted where the water goes, now let it flow.

*What Makes It Different:* The "Now Playing" mode with chord-by-chord progression following the metronome. It turns The Dock into an actual practice accompaniment tool, not just a reference.

---

#### PERSONA B: THE VISUAL CRAFTSPERSON (Proposals 6-10)

---

**B6: "The Luthier's Blueprint"**

*Core Concept:* Chord diagrams that look like they belong in a master luthier's workshop — hand-drawn aesthetic with precise engineering underneath. Each diagram is an 80x96 SVG with tapered string thickness (high E at 0.6px, low E at 2.8px), grain-textured fretboard background (achieved via an SVG `<filter>` turbulence pattern), and brass-colored fret wires (`#B8860B` with a subtle gradient).

The nut is drawn as a bone-white rectangle with rounded ends. Finger dots use a "pressed flesh" gradient — slightly pink center (#FECDD3) fading to skin tone (#FDE68A) — suggesting actual finger pressure. Barre indicators are drawn as a thick, slightly curved line (using an SVG `path` with a `quadraticCurveTo` for natural finger curve) with a finger number (1) in a small circle.

Open strings: a small "o" above the string in `text-3`. Muted strings: an "x" in `coral`. The overall effect is a diagram that looks engraved, not computed.

*Timer Integration:* Each chord card has a tiny metronome icon (a pendulum SVG) in the corner. Tapping it starts a timer with that chord as context. Progressions have a full-width "Practice" bar below them.

*Interval Colors:* A carefully designed chromatic system:
- Root: `water-4` (#2563EB) — the anchor, the deepest blue
- Minor 3rd: `coral` (#E8735A) — warm, tense, yearning
- Major 3rd: `amber` (#B45309) — warmer, resolved, golden
- Perfect 5th: `text-2` (#57534E) — neutral, structural, like a beam
- Minor 7th: `lavender` (#A78BFA) — ethereal, reaching
- Major 7th: `forest` (#166534) — lush, jazzy, sophisticated

These aren't arbitrary — they form a warm-to-cool spectrum that maps to consonance-to-dissonance.

*River Metaphor:* The luthier builds the boat. The river provides the journey. These diagrams are the boat — crafted with care so the music can carry you.

*What Makes It Different:* The "pressed flesh" finger dots. The wood-grain SVG filter. The tapered strings. No guitar app treats chord diagrams as art objects. This one does.

---

**B7: "Stained Glass"**

*Core Concept:* Interval coloring taken to its logical extreme — each chord diagram is a stained glass window where the colored light tells you the harmonic structure. The fretboard background is deep charcoal. Each finger dot is a colored gem: the interval determines the color, but the dot also has a subtle radial gradient that makes it glow, like light passing through glass.

The grid layout uses a "cathedral" arrangement: the I chord (tonic) is centered at top, with chords arranged in a gentle arc below it, suggesting the rose window of a cathedral. On mobile, this collapses to a standard 4-column grid but retains the "I chord is special" sizing — the tonic gets a 1.2x scale factor.

Barre chords are indicated by a translucent colored bar (matching the root color but at 20% opacity) spanning across all strings, with a "1" badge. The visual effect is of a colored beam of light across the fretboard.

*Timer Integration:* A "Illuminate" button at the bottom of the chord section starts the timer. When practicing, the chord currently being played (tracked via metronome beat count) glows brighter — its stained glass "lights up."

*Interval Colors:*
- Root: Deep blue (#2563EB) with glow
- 3rd: Rose (#E11D48) for major, amber (#D97706) for minor
- 5th: Silver-white (#E5E7EB)
- 7th: Violet (#7C3AED) for dominant, emerald (#059669) for major 7th

Each dot has a `box-shadow: 0 0 6px [color]` glow effect (rendered via SVG `<filter>` `feGaussianBlur`).

*River Metaphor:* Stained glass transforms plain light into story. These diagrams transform plain dots into harmonic understanding.

*What Makes It Different:* The glow effect. The cathedral arc layout. The distinction between major and minor 3rd colors. This is the most visually ambitious proposal in the competition.

---

**B8: "The Typographer"**

*Core Concept:* What if chord diagrams were designed by a typographer, not a guitarist? This proposal treats the chord grid as a page layout problem. Each chord "glyph" has consistent metrics: the diagram sits in a 60x72 "em square" with precise baseline alignment. The chord name is set in the app's system font at 14px bold, the numeral in 9px small caps, and the notes in 8px monospace.

String thickness varies: high E = 0.5px, low E = 2.0px. Fret lines use hairline rules (0.25px). The overall density is lower than any other proposal — generous whitespace, 8px gutters, 12px vertical rhythm. The grid is 3 columns on mobile (not 4) to give each diagram room to breathe.

Barre chords: A horizontal bracket notation borrowed from music typesetting — a thin bracket with a number (like a tuplet bracket in sheet music) spanning the barred strings.

*Timer Integration:* Progression strips include an inline "tempo" indicator (e.g., "~92 BPM") and a small play triangle. The "Practice This" action is always in the same position: bottom-right of each progressive element, maintaining spatial consistency.

*Interval Colors:* A monochromatic approach — all dots are the same blue, but:
- Root: solid fill, bold ring
- 3rd: solid fill, no ring
- 5th: 50% opacity fill
- 7th: dotted ring, no fill

This is "color" through weight and density rather than hue — typographic thinking applied to music notation.

*River Metaphor:* Good typography is invisible — you read through it, not at it. These diagrams should feel the same way. The river doesn't announce itself; it just carries you.

*What Makes It Different:* The 3-column grid with breathing room. The monochromatic weight-based interval system. The typographic bracket barre notation. This is the proposal that respects negative space.

---

**B9: "The Cartographer"**

*Core Concept:* The fretboard is a landscape, and chord diagrams are topographic maps of that landscape. Each diagram uses contour lines — concentric rings around finger positions — to show how the chord "radiates" across the fretboard. The root position has 3 contour rings (like a mountain peak on a topo map), the 3rd has 2 rings, the 5th has 1 ring. This creates a visual hierarchy without needing different colors.

The fretboard background uses a subtle "terrain" texture — lighter near the nut (like a sandy riverbank) darkening toward higher frets (deeper water). Each string is a river tributary, and the dots are where you "ford the river."

Barre chords are shown as a "ridge line" — a continuous contour connecting all barred strings, like a mountain ridge on a map.

*Timer Integration:* Progressions are drawn as a "route map" — a horizontal path with chord waypoints connected by a flowing line. The BPM is shown as a "speed limit" badge. A "Navigate" button starts the timer.

*Interval Colors:* Terrain-inspired:
- Root: Deep river blue (#2563EB)
- 3rd: Sandy gold (#D97706) for warm / earthy red (#DC2626) for minor
- 5th: Mountain grey (#6B7280)
- 7th: Forest green (#059669) for major 7 / purple dusk (#7C3AED) for b7

*River Metaphor:* Literally cartographic. You're mapping the river, then paddling it.

*What Makes It Different:* Contour lines as interval hierarchy. Terrain texture on fretboard. Route-map progressions. This is the most conceptually unified metaphor proposal.

---

**B10: "Neon Noir"**

*Core Concept:* A dark-mode-first design where chord diagrams look like neon signs in a jazz club window. The fretboard is near-black (#1A1A1A). Strings are faint grey lines. Finger dots are neon-bright with a CSS glow effect — each interval gets its own neon color. The overall aesthetic: you're walking through a rainy city at night and you see chord shapes glowing in club windows.

Each diagram is rendered at 72x84 SVG. The "neon tube" effect is achieved by drawing each dot twice: once as a bright filled circle, once as a larger, blurred circle at 30% opacity behind it (SVG `<filter>` with `feGaussianBlur stdDeviation="2"`).

Barre chords: a neon bar (glowing horizontal line) with the fret number in a neon-outlined circle.

*Timer Integration:* The whole progression strip glows when tapped — the neon "turns on" — and a 3-second countdown appears before the metronome starts. During countdown: 3... 2... 1... *click click click click*.

*Interval Colors:*
- Root: Electric blue neon (#60A5FA, glow #3B82F6)
- 3rd: Hot pink neon (#F472B6, glow #EC4899)
- 5th: Cool white neon (#F3F4F6, glow #D1D5DB)
- 7th: Purple neon (#C084FC, glow #A855F7)

*River Metaphor:* The river at night — you can't see it, but you can see the lights reflecting off its surface. The neon glow is the reflection. The music is the water underneath.

*What Makes It Different:* The countdown-to-metronome launch. The neon glow aesthetic. The dark-mode-first approach. This is the proposal that makes you want to practice jazz at 11 PM.

---

#### PERSONA C: THE FLOW STATE DESIGNER (Proposals 11-15)

---

**C11: "The Current" (Flow Upgrade)**

*Core Concept:* Rename the entire Dock interaction to "The Current" — you're always in the current, always flowing. The CurrentCard already suggests what to practice; this proposal makes it the ONLY thing you see on first load. The full chord grid, scales, circle — all hidden behind a "Dive Deeper" expand. The default view is:

1. The Current suggestion (full-width, bold)
2. A single chord diagram for the suggested key's I chord
3. A "FLOW" button that starts timer + metronome at suggested BPM
4. The progression for the suggested key, shown as a flowing horizontal scroll

That's it. Four elements. The rest is discoverable but not in the way. When you tap FLOW, the page smoothly cross-fades into the timer overlay — no jarring transition, just a gentle blur of the background and the timer emerging from center.

Barre chords: shown automatically when the suggested key requires them (e.g., "The Current" suggests Bb Major — barre voicings shown by default because there's no open Bb).

BPM is intelligent: it looks at the user's average session tempo from recent practice notes (parsed from strings like "@ 100 BPM" in session notes) and suggests BPM + 5 (slight push).

*Interval Colors:* Kept simple — root blue, everything else a single warm accent. The point is speed, not education.

*River Metaphor:* You ARE the current. The app is the riverbed. Just flow.

*What Makes It Different:* The radical simplification. Hide everything that doesn't get you playing. The intelligent BPM parsing from session history.

---

**C12: "Paddle Out"**

*Core Concept:* A surf metaphor layered on the river. "Paddling out" is the moment of commitment — you've decided to practice, you're heading into the waves. This proposal adds a single "Paddle Out" button to every actionable element in The Dock:

- CurrentCard: "Paddle Out" button replaces "Tap to load" hint
- QuickStart cards: each card gets a small wave icon that starts timer directly
- Progression strips: "Paddle Out" on the right edge
- Chord cards: long-press to "Paddle Out" with that chord as context

When you Paddle Out, the screen does a wave animation (CSS `@keyframes wave` — a horizontal ripple that crosses the screen in 400ms) and then the timer overlay appears. The metronome starts at the BPM suggested by the progression (stored in a new `suggestedBPM` field on each progression).

Progression BPM suggestions:
- Pop/Rock: 100 BPM
- Blues/Country: 85 BPM
- Jazz Essential: 120 BPM (medium swing)
- 50s/Doo-wop: 76 BPM
- Minor Pop: 90 BPM
- Andalusian: 95 BPM
- Natural Minor: 80 BPM

Chord diagrams: standard 50x56 SVGs from existing `ChordDiagram` component, extended to cover all diatonic chords via a new `DIATONIC_SHAPES` data structure that maps root+quality to fret arrays.

*Interval Colors:* Wave-inspired gradient — root at the "crest" (bright blue), notes descend through teal to foam-white. Root = #2563EB, 3rd = #0D9488, 5th = #E5E7EB, 7th = #7C3AED.

*River Metaphor:* The paddle-out moment. You stop watching the water and enter it.

*What Makes It Different:* The wave transition animation. The consistent "Paddle Out" language across every actionable element. The specific BPM suggestions per progression type.

---

**C13: "Zero to Sixty"**

*Core Concept:* The entire Dock is redesigned around a single metric: time from page load to timer running. The target: under 3 seconds. On load, the page shows:

1. A single full-width card: "[Key] [Scale] — [Progression Name]" with a diagram of the I chord and the BPM, pre-selected from practice intelligence
2. A massive "GO" button (80px tall, full width, blue gradient)

Tapping GO: starts timer, starts metronome, auto-fills session note. Total taps from page load: ONE.

Below the GO card, a horizontally scrollable "Speed Rack" shows the 7 diatonic chord diagrams in a single row. Each is 56px wide. Tapping any diagram replaces the I chord in the hero card. A second scrollable row shows barre alternatives (same chords, barre voicings).

The "GO" button has a BPM stepper built into it — small +/- buttons on either side of the BPM number, so you can adjust tempo without leaving the primary flow.

*Interval Colors:* Traffic-light inspired — Root = green (go!), 3rd = yellow (caution — this determines major/minor), 5th = white (neutral), 7th = red (tension!). Unconventional but instantly memorable and reinforces the "speed" metaphor.

*River Metaphor:* Zero to sixty — launching the boat at full speed. No wading in. No testing the water temperature.

*What Makes It Different:* The one-tap-from-page-load design. The speed metric as design constraint. The BPM stepper integrated into the GO button. The traffic-light interval colors are wild and might actually work.

---

**C14: "The Eddy"**

*Core Concept:* Named after the calm pool that forms behind a rock in a river — a place to rest and gather before continuing downstream. The Dock becomes an "eddy" where you prepare before entering the flow of practice.

The key innovation: a persistent "Flow Context" bar at the top of The Dock that shows your current practice context: key, scale, BPM, and progression. This bar is always visible (sticky positioned). As you browse chord diagrams, scales, and progressions, tapping any element UPDATES the Flow Context bar rather than starting anything immediately. The Flow Context bar has a single "Enter Flow" button.

This separation of "configure" and "go" means you can browse freely without accidentally starting the timer. But when you're ready, one tap on "Enter Flow" launches everything — timer, metronome, session note pre-filled.

Chord diagrams: rendered inline within ChordCards. The existing `ChordCard` component grows from ~60px tall to ~120px tall to accommodate a mini diagram below the chord name. Barre toggle is a global switch in the Flow Context bar.

*Interval Colors:* Water-depth metaphor:
- Root: Deep water blue (#1E40AF) — the deepest point
- 3rd: Mid-water blue (#3B82F6)
- 5th: Shallow water (#93C5FD)
- 7th: Surface foam (#DBEAFE)

All blue, different depths. Teaches hierarchy through a single color dimension.

*River Metaphor:* The eddy — stillness within motion. Configure your practice in calm water, then re-enter the current.

*What Makes It Different:* The sticky Flow Context bar. The separation of browsing and launching. The monochromatic blue-depth interval system.

---

**C15: "The Confluence"**

*Core Concept:* A confluence is where two rivers meet. This proposal merges the reference view (The Dock) and the practice view (Timer) into a single unified experience. Instead of the timer being a separate overlay, practice mode is a state of the Dock itself.

When you tap "Practice" on any element, the Dock doesn't disappear — it transforms. The chord grid stays visible but dims to 40% opacity. The progression you selected floats to the top and becomes a "Now Playing" bar with a progress indicator showing which chord is active. The timer appears as a small, elegant counter in the top-right corner (not a full-screen overlay). The metronome runs. You can still scroll, still browse, still tap other diagrams — but you're also timing.

This means you can be "in flow" and still reference material. The current implementation forces a binary: you're either looking things up OR you're practicing. The Confluence says: do both.

Barre chords: a toggle in each chord card (not a global toggle) — tap a small "B" badge on any chord to see its barre alternative. This per-chord toggle is more flexible than a global switch.

*Interval Colors:* "Confluence colors" — where two intervals overlap on the same string (e.g., in a chord diagram where a note serves double duty), the dot gets a split-color fill (half root color, half 3rd color). For non-overlapping:
- Root: #2563EB
- 3rd: #E8735A
- 5th: #78716C
- 7th: #A78BFA

*River Metaphor:* Two rivers becoming one — practice and reference are no longer separate streams.

*What Makes It Different:* The merged practice/reference view. No full-screen timer overlay. The per-chord barre toggle. This is the most architecturally radical proposal.

---

### Phase 2: Scoring (50 points each)

| # | Name | Diagram (12) | Timer (10) | Barre (8) | Intervals (8) | Mobile (7) | Innovation (5) | TOTAL |
|---|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| A1 | The Bouncer | 8 | 9 | 6 | 6 | 7 | 3 | **39** |
| A2 | Slapback | 7 | 8 | 5 | 6 | 5 | 5 | **36** |
| A3 | The Capo | 9 | 6 | 8 | 7 | 6 | 5 | **41** |
| A4 | One-Hander | 7 | 8 | 6 | 5 | 7 | 4 | **37** |
| A5 | The Setlist | 7 | 9 | 6 | 4 | 5 | 5 | **36** |
| B6 | Luthier's Blueprint | 12 | 5 | 8 | 8 | 5 | 4 | **42** |
| B7 | Stained Glass | 10 | 6 | 7 | 8 | 4 | 5 | **40** |
| B8 | The Typographer | 10 | 6 | 7 | 5 | 7 | 3 | **38** |
| B9 | The Cartographer | 9 | 5 | 6 | 7 | 4 | 5 | **36** |
| B10 | Neon Noir | 9 | 7 | 7 | 8 | 5 | 4 | **40** |
| C11 | The Current | 7 | 10 | 6 | 4 | 7 | 4 | **38** |
| C12 | Paddle Out | 8 | 9 | 7 | 5 | 6 | 4 | **39** |
| C13 | Zero to Sixty | 7 | 10 | 6 | 5 | 6 | 5 | **39** |
| C14 | The Eddy | 8 | 8 | 7 | 6 | 6 | 4 | **39** |
| C15 | The Confluence | 8 | 9 | 7 | 6 | 5 | 5 | **40** |

**Score Justifications (abbreviated):**

- **B6 (42):** Perfect diagram score — the wood-grain filter, tapered strings, and pressed-flesh dots are genuinely beautiful. Timer integration is its weakness (small metronome icon is easy to miss). Barre curve path is the best barre indicator in the competition.
- **A3 (41):** Capo intelligence is a real feature gap no one else addressed. Diagrams are strong. Timer integration suffers because it's only one button for the whole grid.
- **B7 (40):** Gorgeous glow effects and the cathedral layout is bold. Interval colors are the most thoughtful. But mobile performance risk from SVG blur filters, and the arc layout might be confusing.
- **B10 (40):** Neon aesthetic is distinctive and the countdown-to-metronome is brilliant UX. Dark-mode-only concern for light-mode users. Interval colors are vivid.
- **C15 (40):** Architecturally the most interesting — merged practice/reference is genuinely new. Per-chord barre toggle is flexible. But the dimmed-Dock-during-practice might be visually cluttered.
- **A1 (39):** Solid everywhere, nothing spectacular. The "GO" pill on progressions is well-placed. Interval colors are functional but not educational.
- **C12 (39):** Wave animation is fun. BPM per progression is well-researched. Chord diagrams lean too heavily on the existing component.
- **C13 (39):** One-tap-from-load is the purest flow design. BPM stepper in the GO button is clever. Diagrams are small in the "Speed Rack."
- **C14 (39):** The sticky Flow Context bar is a clean UX pattern. Water-depth intervals are elegant. Configure-then-go separation is safe but maybe too safe.
- **B8 (38):** Beautiful restraint. The 3-column grid is controversial but correct. Monochromatic intervals are principled but might not teach enough.
- **C11 (38):** Radical simplification is brave. But hiding the chord grid behind "Dive Deeper" might frustrate users who came to The Dock specifically for reference.
- **A4 (37):** Swipe-to-start is innovative but discoverability is zero. Shape-coded intervals for colorblindness is admirable but unusual.
- **A2 (36):** Set List tray is the competition's most creative UX idea. But the card-flip interaction is fiddly on mobile and the overall package is unfocused.
- **A5 (36):** Now Playing mode with chord-by-chord following is amazing but architecturally complex. Opacity-based intervals don't teach well.
- **B9 (36):** Contour lines are conceptually beautiful but would be visually noisy at 50x56 SVG size. Route-map progressions are lovely.

---

### Phase 3: Top 8 with Feedback

**Ranked: B6 (42), A3 (41), B7 (40), B10 (40), C15 (40), A1 (39), C13 (39), C14 (39)**

---

**1. B6 — Luthier's Blueprint (42 pts)**

*Strengths:* This proposal loves chord diagrams the way a luthier loves wood. The pressed-flesh finger dots are worth the price of admission alone — they make digital diagrams feel physical. The tapered string thickness matches the existing `STRING_THICKNESS` array perfectly. The wood-grain SVG filter is achievable with `<feTurbulence baseFrequency="0.04" numOctaves="4">`. The interval color system (warm-to-cool mapping consonance-to-dissonance) is pedagogically sound.

*Opportunities:* Timer integration is the weak link — a tiny metronome icon in the corner is too subtle for a feature that needs to be in-your-face. The diagrams are large (80x96), which means only 3 per row on 375px, which could feel sparse in the diatonic grid.

*What-if:* What if the "Practice" action lived IN the diagram itself? Picture this: the wood-grain fretboard has a subtle grain direction (horizontal). When you press and hold, the grain starts "flowing" (a CSS animation) — the wood comes alive, the river metaphor activates — and when you release, the timer starts. The diagram IS the button.

---

**2. A3 — The Capo (41 pts)**

*Strengths:* This is the proposal that would make a real gigging musician say "finally, someone gets it." Capo transposition is THE killer feature for working musicians. The insight that Bb-as-G-shape-capo-3 is how humans actually think is dead-on. The interval color hierarchy (solid > ring > hollow) teaches importance through visual weight, which is elegant.

*Opportunities:* Timer integration is basic — one button for the whole grid. The capo selector (frets 0-7) is another horizontal strip in a page that already has a root selector and scale selector — scroll fatigue risk.

*What-if:* What if the capo selector was integrated INTO the Root Lock? When you select Bb, a small tooltip appears: "Capo 1 (A shapes) · Capo 3 (G shapes) · Capo 6 (E shapes)". Tap a suggestion, and all diagrams update. The capo becomes part of key selection, not a separate control.

---

**3. B7 — Stained Glass (40 pts)**

*Strengths:* The most visually stunning proposal. The glow effect is achievable and would look incredible in dark mode. The cathedral arc layout is bold — putting the I chord at top-center with others radiating outward teaches tonal gravity without words. The dual-color 3rd system (rose for major, amber for minor) is the most musically sophisticated interval approach in the competition.

*Opportunities:* SVG `feGaussianBlur` is expensive on mobile — need to test on real devices. The cathedral arc collapses to a grid on mobile, losing its magic. Light mode would need a complete rethink.

*What-if:* What if the glow intensity was tied to the metronome? When the metronome clicks, the active chord's glow pulses brighter for a frame. The stained glass "breathes" with the music. This would also solve the timer integration weakness — the visual feedback IS the timer integration.

---

**4. B10 — Neon Noir (40 pts)**

*Strengths:* The countdown-to-metronome launch is the single best timer integration micro-interaction in the entire competition. 3... 2... 1... *click*. That alone is worth stealing. The neon aesthetic works beautifully with the existing dark mode palette. The double-rendered dot technique (sharp + blurred) is performant because it's simpler than a full SVG filter.

*Opportunities:* Dark-mode-only is limiting. The neon aesthetic might clash with the "Liquid Glass" design system's softer approach. Light mode neon would need to become something else entirely (maybe "watercolor" washes?).

*What-if:* What if the neon signs "flicker" when the chord changes in a progression? A subtle 2-frame opacity stutter (100% -> 85% -> 100% over 150ms) would sell the neon illusion and signal chord transitions.

---

**5. C15 — The Confluence (40 pts)**

*Strengths:* The merged practice/reference view is the most architecturally brave idea in the competition. The realization that "looking things up" and "practicing" don't have to be mutually exclusive is profound. The per-chord barre toggle (instead of global) is the most flexible barre approach. Timer-in-corner is elegant.

*Opportunities:* The dimmed Dock during practice might be visually noisy. Managing two states (browsing and practicing) in one view is complex — state management could get messy. The 40% opacity dimming is arbitrary and might be too dim or not dim enough.

*What-if:* What if instead of dimming the whole Dock, only the ACTIVE progression stays at full brightness, and everything else gets a blur effect (not dim, blur)? `backdrop-filter: blur(4px)`. This creates focus without opacity weirdness, and the blur is reversible (tap anywhere to "refocus").

---

**6. A1 — The Bouncer (39 pts)**

*Strengths:* Pure pragmatism. The "GO" pill on progression strips is perfectly placed — right where your thumb naturally rests. The `onPracticeThis` callback architecture is well-thought-out and implementable today. Session note auto-population ("Pop/Rock in G: G - D - Em - C @ 100 BPM") is a great quality-of-life detail.

*Opportunities:* Diagrams at 48x56 might be too small for "readable at arm's length." The Open/Barre segmented toggle is binary when some keys need a mix (e.g., G Major has open G, C, D, Em, Am but needs barre Bm).

*What-if:* What if the GO button had haptic feedback? `navigator.vibrate([10])` on tap. A tiny physical "click" that says "you're in" — matching the metronome's audio click with a tactile click.

---

**7. C13 — Zero to Sixty (39 pts)**

*Strengths:* The purest expression of the Flow State Designer constraint. One tap from page load to practicing is an audacious target and this proposal actually achieves it. The BPM stepper integrated into the GO button (not a separate control) is a masterclass in information density.

*Opportunities:* The "Speed Rack" at 56px per diagram is cramped for 7 chords on 375px (that's 392px before gaps — needs horizontal scroll). The traffic-light interval colors are memorable but unconventional enough to confuse.

*What-if:* What if the Speed Rack used inertial scrolling with snap points? `scroll-snap-type: x mandatory` with each chord as a snap point. Swipe to browse, tap to select, the selected chord centers itself with a smooth scroll.

---

**8. C14 — The Eddy (39 pts)**

*Strengths:* The sticky Flow Context bar is a pattern borrowed from music production DAWs (transport bar) and it works. The separation of "configure" and "go" respects the user's agency — you never accidentally start the timer. The water-depth interval system (all blue, different depths) is the most thematically consistent.

*Opportunities:* "Never accidentally start the timer" might actually be a weakness — the accidental start is sometimes the push you need. The Flow Context bar takes vertical space on an already-tall page. The interval system, while beautiful, might not teach enough because blue-on-blue is subtle.

*What-if:* What if the Flow Context bar was collapsible? When collapsed, it shows just "[Key] [BPM] [FLOW]" in a thin 36px strip. When you add elements (tap a progression, tap a chord), it expands to show details. It grows as your intention solidifies.

---

### Phase 4: Top 4 — Cross-Pollination + Devil's Advocate

**Top 4: B6 (42), A3 (41), B7 (40), C15 (40)**

---

**B6 — Luthier's Blueprint**

*Steals from C15 (The Confluence):* The merged practice/reference view. Instead of navigating away to the timer overlay, the Luthier's Blueprint diagrams stay visible during practice. The wood-grain fretboard subtly animates (grain direction shifts, like wind on water) to indicate "you're practicing now." The timer appears as an elegant engraved counter in the top margin, looking like a number stamped into the wood.

*Devil's Advocate:* "Your diagrams are art pieces, but this is a practice app, not a gallery. An 80x96 SVG with turbulence filters, gradient fills, and tapered strings will render slowly on a 2019 iPhone SE. The wood-grain filter alone is ~3ms per diagram times 7 diatonic chords = 21ms of SVG rendering per frame. And the 'pressed flesh' finger dots — adorable, but at 80px wide, do they actually help a guitarist find the right fret faster than a simple blue dot? Beauty is not the same as clarity. The Typographer understood this; you don't."

*Counter:* The filter can be pre-rendered to a single `<image>` element (render once, cache as data URI). The flesh-tone dots are distinctive enough to create visual landmarks. And beauty IS motivation — a gorgeous diagram makes you want to play.

---

**A3 — The Capo**

*Steals from B6 (Luthier's Blueprint):* The tapered string thickness and the interval color system (solid > ring > hollow). Apply these to the capo chord diagrams. A G-shape-at-capo-3 diagram with luthier-quality rendering would be the most useful single chord diagram in any guitar app.

*Devil's Advocate:* "Capo intelligence is a gig feature, but this is a practice app. How often does someone practice with a capo? The feature is impressive but niche. And your capo selector adds a third horizontal control strip below Root Lock and Scale — that's three strips of tiny buttons before you even see a chord. On a 375px screen, the user has to scroll past ~180px of selectors to reach the content. That's half the viewport spent on controls."

*Counter:* Capo is niche for bedroom practice but universal for gigging. And the "what-if" from Phase 3 solves the three-strip problem — integrate capo suggestions into Root Lock itself.

---

**B7 — Stained Glass**

*Steals from C13 (Zero to Sixty):* The massive "GO" button with integrated BPM stepper. Place it below the cathedral arc of chord diagrams. The button itself gets the stained-glass treatment — a gradient fill with the active key's root color as the dominant hue, and the BPM number glowing inside like light through glass.

*Devil's Advocate:* "Your cathedral arc layout is beautiful on a 1920px monitor and completely useless on a 375px phone. You admit it collapses to a grid on mobile, which means your signature visual idea doesn't survive the platform it needs to work on. The SVG blur filters will cook battery life — `feGaussianBlur` is the most expensive SVG operation and you're applying it to every single dot. And your major-3rd vs minor-3rd color distinction (rose vs amber) — that's sophisticated, but a beginner won't know what a major 3rd IS, let alone why it's rose instead of amber. You're designing for music theory professors, not guitarists."

*Counter:* The arc can survive on mobile as a subtle size variation (I chord 1.2x, V and IV 1.1x, others 1.0x) — not a full arc, but echoing it. Blur can be a CSS `filter: blur()` instead of SVG, which is GPU-accelerated. And the rose/amber distinction is aspirational — users learn it over time.

---

**C15 — The Confluence**

*Steals from B10 (Neon Noir):* The 3-2-1 countdown-to-metronome launch. When you tap "Practice" on any element, instead of immediately starting, a 3-beat countdown plays (using the existing `scheduleClick` function from `audio.js`). During the countdown, the Dock smoothly transitions to its practice state (dimming/blurring non-active elements). By beat 4, you're IN the groove. The countdown IS the transition.

*Devil's Advocate:* "You're trying to be two things at once and you'll be mediocre at both. A reference view needs information density — lots of chords visible at once. A practice view needs focus — one chord big and clear. You can't have both. Your 'dimmed Dock during practice' is a compromise that satisfies neither use case. The reference user sees their content behind a fog. The practicing user is distracted by the shapes behind the blur. And managing two simultaneous states (browsing + timing) in React means your component needs a `practiceMode` boolean threading through every child, which is a maintainability nightmare."

*Counter:* The blur technique from Phase 3 feedback (blur non-active, don't dim) focuses attention better. And the state can be managed via React Context — a `PracticeContext` provider wrapping the Dock that any child can read. It's clean architecture, not a hack.

---

### Phase 5: Winner + Synthesis

#### Winner: B6 — Luthier's Blueprint (42 pts)

The Luthier's Blueprint wins on the strength of its chord diagram quality — the single most important criterion in this competition (12 points, more than any other category). Its diagrams are not just functional, they're motivating. They make you want to pick up the guitar. And in a practice app, motivation IS the feature.

But the best implementation isn't B6 alone. It's a synthesis.

---

#### The Synthesis: "The Luthier's Current"

The winning implementation combines:
- **Diagrams from B6** (Luthier's Blueprint): tapered strings, realistic nut, interval colors
- **Timer integration from C15** (The Confluence) + **B10** (Neon Noir): merged practice/reference with 3-2-1 countdown
- **Barre intelligence from A3** (The Capo): capo-aware transposition integrated into Root Lock
- **Interval colors from B7** (Stained Glass): the warm-to-cool consonance spectrum with major/minor 3rd distinction
- **Flow from C13** (Zero to Sixty): one-tap-from-load hero card with GO button
- **Session context from A1** (The Bouncer): auto-populated session notes

---

#### Implementation Details

**1. Enhanced ChordDiagram Component**

Replace the existing `ChordDiagram` with a new `ChordVoicing` component:

```jsx
// New component: ChordVoicing
// SVG viewBox: "0 0 68 82" — larger than current 50x56 for clarity
// String thickness: [0.5, 0.8, 1.1, 1.5, 2.0, 2.6] (realistic gauge progression)
// Fret wire: 0.75px, color #8B7355 (brass)
// Nut: 3px tall, #E8E0D4 (bone white), rounded ends
// Fretboard fill: #3D2B1F (dark rosewood) — no turbulence filter for performance
// Finger dots: 4px radius, colored by interval role
// Barre indicator: SVG <path> with slight quadratic curve, 2.5px stroke
// Muted string: "x" in coral, open string: "o" in text-3
```

**Interval Color System** (stolen from B7, refined):
```js
const INTERVAL_COLORS = {
  root:     { fill: '#2563EB', label: 'white' },    // Deep water — the anchor
  minor3:   { fill: '#E8735A', label: 'white' },    // Coral — warm tension
  major3:   { fill: '#D97706', label: 'white' },    // Amber — warm resolution
  perfect5: { fill: '#57534E', label: 'white' },    // Stone — structural
  minor7:   { fill: '#A78BFA', label: 'white' },    // Lavender — reaching
  major7:   { fill: '#166534', label: 'white' },    // Forest — sophisticated
};
```

**2. Diatonic Chord Shape Data**

New data structure: `DIATONIC_VOICINGS` — a lookup from `(root, quality)` to `{ open: fretArray, barre: { frets, barreString, barreFret, form } }`.

```js
// For any root + quality, compute the voicing:
// 1. Check COMMON_SHAPES for an exact open match
// 2. If no open match, compute nearest CAGED barre form:
//    - E-form barre: root on 6th string
//    - A-form barre: root on 5th string
//    - Root fret = (NOTES.indexOf(root) - openStringNote + 12) % 12
// 3. Store both open (if exists) and barre for every diatonic chord
```

**3. Timer Integration Architecture**

Add an `onPracticeThis` callback prop to `ShedPage`, passed from `App.jsx`:

```jsx
// In App.jsx:
const handlePracticeThis = useCallback(({ key, scale, progression, bpm, chords }) => {
  // 1. Start the metronome at specified BPM
  startMetronome(bpm);
  // 2. Trigger TimerFAB start (via a new ref or state)
  timerRef.current?.start();
  // 3. Auto-populate session note
  const noteText = progression
    ? `${progression} in ${key}: ${chords.join(' - ')} @ ${bpm} BPM`
    : `${key} ${scale} practice @ ${bpm} BPM`;
  timerRef.current?.setNote(noteText);
}, []);
```

The `TimerFAB` component needs two new imperative methods exposed via `useImperativeHandle`:
- `start()`: programmatically starts the timer
- `setNote(text)`: pre-fills the session note

**4. "Practice This" Buttons**

Every `ProgressionStrip` gets a GO pill button:
```jsx
<button
  onClick={() => onPracticeThis({
    key: rootNote,
    scale,
    progression: prog.name,
    bpm: prog.suggestedBPM,
    chords: prog.numerals.map(numeralToChord),
  })}
  className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold
             text-white bg-gradient-to-r from-water-4 to-water-5
             active:scale-95 transition-transform"
>
  GO
</button>
```

The `QuickStartCards` and `CurrentCard` also get the `onPracticeThis` callback, starting the timer directly instead of just setting root/scale.

**5. Countdown Launch (from B10)**

When "GO" is tapped, a 3-beat countdown plays before the metronome begins:

```js
function countdownAndStart(bpm) {
  initAudio();
  const interval = 60000 / bpm;
  // Play 3 accent clicks as countdown
  [0, 1, 2].forEach(i => {
    setTimeout(() => scheduleClick(audioCtx.currentTime, true), i * interval);
  });
  // Start full metronome on beat 4
  setTimeout(() => startMetronome(bpm), 3 * interval);
}
```

**6. Barre Chord Toggle**

A segmented pill at the top of the chord grid:
```
[ Open | Barre | Capo ▾ ]
```
- **Open**: shows open voicings where available, barre where no open exists
- **Barre**: shows all chords as moveable barre shapes
- **Capo**: dropdown with capo position (1-7), shows shapes relative to capo

**7. BPM Suggestions per Progression**

```js
const PROGRESSION_BPM = {
  'Pop/Rock':       100,
  'Blues/Country':    85,
  'Jazz Essential':  120,
  '50s/Doo-wop':     76,
  'Minor Pop':       90,
  'Andalusian':      95,
  'Natural Minor':   80,
};
```

**8. Component Structure**

```
ShedPage.jsx (enhanced)
  +-- FlowHeroCard         (NEW: one-tap practice launcher at top)
  +-- CurrentCard           (existing, now with onPracticeThis)
  +-- QuickStartCards       (existing, now with onPracticeThis)
  +-- TuningStrip           (existing)
  +-- Root Lock + Scale     (existing)
  +-- VoicingToggle         (NEW: Open | Barre | Capo segmented pill)
  +-- Intent tabs           (existing)
  +-- DiatonicChordGrid     (ENHANCED: uses ChordVoicing instead of ChordCard)
      +-- ChordVoicing      (NEW: replaces ChordDiagram for diatonic context)
  +-- ProgressionStrips     (ENHANCED: GO button + BPM badge)
  +-- FretboardDiagram      (existing)
  +-- PositionDiagram       (existing)
```

**9. Key Implementation Decisions**

- **No SVG filters for fretboard texture** — use a solid rosewood color (#3D2B1F) instead of turbulence. Performance over beauty where it matters.
- **Interval colors apply to ChordVoicing dots only** — the fretboard diagram and position diagrams keep their existing blue scheme. Mixing two color systems would confuse.
- **The FlowHeroCard replaces nothing** — it appears at the very top of The Dock, above The Current. It shows the practice-intelligence suggestion with a large GO button. One tap starts everything.
- **Timer integration via ref, not state** — use `React.forwardRef` + `useImperativeHandle` on TimerFAB to expose `start()` and `setNote()`. This avoids prop-drilling timer state through the entire tree.
- **Barre shape computation at runtime** — don't hardcode 84 chord shapes (12 roots x 7 qualities). Compute barre shapes from E-form and A-form templates + fret offset. This keeps the data layer small.
- **Mobile scroll position** — after tapping GO, scroll the page to top so the FlowHeroCard's context is visible above the timer overlay.

---

### Special Awards

---

#### The Wildcard Award — Most Creative Idea

**Winner: A2 — Slapback's "Set List Tray"**

The idea that browsing chord diagrams should automatically curate a practice setlist is genuinely novel. No guitar app does this. The interaction — flip a card, it joins your set list — turns passive reference into active curation. The set list tray at the bottom of the screen is a persistent, visible artifact of your intent. It says: "These are the chords I want to work on today." And then one tap plays them all.

This idea didn't win the competition because the card-flip interaction is fiddly and the overall proposal was unfocused. But the Set List Tray as an isolated feature could be devastating. Imagine: you browse the diatonic grid, tapping chords to add them to a "Practice Set" strip at the bottom, then hit GO and the timer + metronome launch with all of them as context.

If we ever build a v2 of this feature, the Set List Tray goes in. It earned this award with confidence and flair.

*Honorable mention:* B9 (The Cartographer) for contour-line chord diagrams. Topographic maps of the fretboard. Conceptually stunning, practically impossible at 50px, but the dream is beautiful.

---

#### The Comedy Award — Funniest Moment

**Winner: C13 — Zero to Sixty's Traffic-Light Interval Colors**

"Root = green (go!), 3rd = yellow (caution — this determines major/minor), 5th = white (neutral), 7th = red (tension!)"

The absolute audacity of mapping harmonic intervals to traffic signals. "The third is YELLOW because it's the one that determines if you're going major or minor — proceed with caution!" I can picture a music theory professor seeing this and having a medical event. The 7th is red because it's DANGEROUS. Dominant 7ths are STOP SIGNS. Somewhere, a jazz musician is weeping.

The funniest part: it would actually work. Beginners would remember it instantly. "Which note makes it minor?" "The yellow one." That's not wrong. It's just... aggressive.

*Honorable mention:* The Luthier's Blueprint's "pressed flesh" finger dots. The image of tiny pink fingertips squished onto a phone screen, like a cartoon character pressing against glass. "These dots represent REAL HUMAN SUFFERING. This is what practice FEELS like."

---

### Final Note

To all fifteen proposals: you brought it. You brought creativity, technical specificity, genuine love for the craft of guitar playing, and a few ideas that genuinely scared me (The Confluence's merged view, The Cartographer's contour lines, The Setlist's Now Playing mode). The winning synthesis — "The Luthier's Current" — is better than any single proposal because it stands on the shoulders of all of you.

To Max: this competition was a joy. The culture mandate — love, humor, creative courage — made every proposal better than it would have been in a sterile environment. The river metaphor isn't just a theme; it's a design principle. Step in. Flow. Play.

Now let's build it.

*— Competition E complete. 15 proposals generated, scored, iterated, cross-pollinated, and synthesized. The Luthier's Current awaits implementation.*
