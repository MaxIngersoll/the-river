# Competition A: "The Dock" — Guitar Reference Overhaul

> The reference section needs a river-connected identity, real chord voicings, and seamless practice integration.

---

## The Brief

The current "Shed" tab provides guitar reference material (scales, chords, circle of fifths, quick ref shapes) but has significant quality issues:

### Current Problems
1. **"The Shed" name** — Has no connection to the river metaphor. Needs renaming.
2. **Chord cards show notes, not shapes** — Diatonic chord view lists note names (C · E · G) but no fingering diagrams. A guitarist mid-practice needs to see WHERE to put their fingers.
3. **No chord progressions** — Doesn't show common progressions (I-V-vi-IV, ii-V-I) which are what guitarists actually practice.
4. **CAGED position diagrams are tiny** — Position boxes are cramped, note labels barely readable on mobile.
5. **No practice integration** — Reference material is disconnected from the timer/logging system.
6. **Missing barre chord shapes** — Only shows open chords, but barre chords (E-form, A-form) are essential.
7. **No audio integration** — We have a full Web Audio engine (metronome + rain) but reference doesn't connect to it.
8. **No tuning reference** — Basic but essential for practice sessions.
9. **Flat visual design** — Looks like a textbook, not a premium app.
10. **No key signature display** — Doesn't show sharps/flats notation.

### What Exists Already
- Root Lock (12-note selector with blue gradient active state)
- Scale selector (7 scales: Major, Minor, Pentatonic Major/Minor, Blues, Dorian, Mixolydian)
- 4 intent views: Chords, Scale, Circle of Fifths, Quick Ref
- Full SVG fretboard with nut, fret wires, inlays, string thickness variation, note dots
- 5 CAGED position diagrams (sorted by fret, tappable to highlight on full fretboard)
- Scale degree toggle (note names vs degree numbers)
- Step pattern formula display (2-2-1-2-2-2-1)
- Open string O/X indicators
- Circle of Fifths with major/minor rings
- 12 common chord shapes in Quick Ref

### Technical Context
- React 19 + Tailwind CSS v4
- "Liquid Glass" design system (frosted panels, backdrop-filter blur, ambient glow)
- Web Audio API engine already built (metronome, rain ambience)
- All data is computed, not fetched — pure client-side
- Must work on mobile (375px viewport primary)
- guitarscale.org used as reference for diagram structure

### Reference
- guitarscale.org/a-major.html — Layout patterns for scale positions and diagrams

---

## Constraint-Based Personas

### The Gigging Musician
**Constraint:** Every feature must pass the "gig bag test" — would a working musician actually use this between sets or during rehearsal? No academic completeness, no theory-for-theory's-sake. Only what you'd reach for in the moment. The reference section should feel like a well-organized gig bag, not a music theory textbook. Maximum 2 taps to anything.

### The Visual Craftsperson
**Constraint:** Every diagram must be beautiful enough to frame. SVG precision matters. String thickness must feel real. Fret spacing must be anatomically proportional. Color must convey meaning (root vs scale tone vs chromatic). The reference section should look like a premium guitar poster, not a web app. No compromises on visual craft.

### The Practice Coach
**Constraint:** The reference section must actively guide practice, not passively display information. It should suggest what to play next, connect scales to chords to progressions, and integrate with the timer so you can go from "what should I practice?" to practicing in one tap. The reference section should feel like having a teacher sitting next to you.

---

## Evaluation Criteria (50 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Usefulness | 12 | Would a practicing guitarist actually reach for this? |
| Visual Craft | 10 | Do the diagrams look professional and beautiful? |
| Practice Integration | 10 | Does it connect to the timer, logging, and audio systems? |
| River Connection | 8 | Does the naming and metaphor tie into the river? |
| Mobile UX | 5 | Works flawlessly on 375px viewport? |
| Innovation | 5 | Any genuinely new ideas for guitar reference? |

---

## Special Awards

### The Wildcard Award — Most Creative Idea
### The Comedy Award — Funniest Moment

---

## Results

*To be filled during competition execution.*

---

## The Gigging Musician — Proposals

> Every feature below has been stress-tested against one question: "Would I actually pull this up on my phone in a noisy green room with 8 minutes before the second set?" If the answer is no, it got cut. Theory is a means, never an end. Two taps or it does not exist.

---

### Proposal 1: "The Shallows"

**Concept**

The Shallows is where you wade in when you need something fast. It replaces the current four-tab intent system (Chords / Scale / Circle / Quick Ref) with a single scrollable surface organized by *the question you are actually asking*. No tabs. No modes. You land, you see everything for your current key, and you scroll to what you need.

The top of the screen is the Root Lock strip (unchanged — it works) and the scale selector. Below that, the page flows as a continuous vertical stream: first, a "Grab Bag" row of the 4-6 chord shapes you are most likely to need in this key, rendered as proper fingering diagrams large enough to read at arm's length. Below that, a "Progressions" section showing 3-4 common progressions for the selected scale (I-V-vi-IV, I-IV-V, ii-V-I) as tappable horizontal strips — tap one and the chord diagrams above reorder to match the progression. Below that, the full fretboard with CAGED positions, but the position boxes are 40% larger than current, with a horizontal scroll if needed rather than cramming all five into one row. At the very bottom, a tuner drone button: one tap and the Web Audio engine plays the root note as a sustained reference tone. That is it. No Circle of Fifths (it goes to a long-press/secondary gesture if someone wants it). No step pattern formula display. No scale degree math. Those are for the practice room, not the gig.

The key design decision: everything that matters is *above the fold for the key you selected*. You change the key, the whole stream recalculates. Scroll position resets to top. The metaphor is wading into shallow water — you can see the bottom, nothing is hidden, you grab what you need and get back on stage.

**River Metaphor Connection**

"The Shallows" — the part of the river where the water is clear and the footing is solid. You do not need to dive deep. You wade in, grab what you need, wade out. The tab name in the bottom nav changes from "Shed" to "Shallows" with a wave-ripple icon. When you change keys, a subtle liquid-glass shimmer animation ripples across the chord diagrams, like disturbing still water.

**Specific Features & UI Patterns**
- Single scrollable surface, no sub-tabs or intent modes
- "Grab Bag" row: top 6 diatonic chord shapes for selected key, rendered as real fingering diagrams (not note lists), sized at minimum 64x80px each
- Progression strips: 3-4 common progressions, horizontal scrollable, tap to reorder the Grab Bag to match
- Enlarged CAGED positions: each box minimum 80px wide, horizontal scroll, tap to highlight on fretboard
- Tuner drone button: single tap plays a sustained root note via Web Audio oscillator (sine wave, 2-second fade-in, toggles off on second tap)
- "Start practicing this" button on each progression strip that launches the timer with the progression name pre-filled in the session note
- Barre chord toggle: a small "Barre" chip next to the Grab Bag that swaps open chord voicings for their E-form/A-form barre equivalents
- Circle of Fifths accessible via long-press on the root note in Root Lock (power-user gesture, not primary UI)

**What Makes It Different**

This is the most conservative proposal. It bets that the problem is not missing features but too many modes. A gigging musician does not think "I need the Chords intent" — they think "What are the chords in G?" The Shallows removes the cognitive overhead of choosing a view and just shows you everything, prioritized by what you are most likely to need first. It trades flexibility for speed.

---

### Proposal 2: "The Crossing"

**Concept**

The Crossing is built around a single radical premise: the most useful thing a reference tool can do between sets is answer "how do I get from HERE to THERE?" A musician standing backstage does not need a chord encyclopedia. They need to know: "The next song is in E minor and starts on the 7th fret — show me what I have to work with in this position."

The Crossing introduces **Position-First Navigation**. Instead of choosing a root note and then scrolling to find positions, you tap a fret number (or drag a slider along a fretboard graphic) to declare "I am HERE." The app then shows you everything available at that position: the scale pattern, the chord voicings reachable without moving your hand, and the arpeggios that pass through. It is the difference between a map of the entire continent and a map of the three blocks around your hotel.

The second pillar is **Song Setlist Mode**. You can build a quick 4-8 song setlist with just key + tempo for each song. Swipe between songs and the reference material updates instantly. Between sets, you swipe through your setlist and the Crossing shows you exactly what you need for each song. The setlist persists in localStorage. Building it takes maybe 90 seconds — song name, key, tempo, done.

The UI is split into two zones: the top third is a compact horizontal fretboard (frets 0-15) with a draggable position indicator (a translucent blue window 5 frets wide). The bottom two thirds show the shapes available within that window. Chord voicings are displayed as proper fingering diagrams. When you move the position window, the chord shapes smoothly cross-fade to the new position's voicings. The animation should feel like looking through a window on a moving train — the landscape shifts but the frame stays still.

**River Metaphor Connection**

"The Crossing" — the place where you ford the river. You are going from one bank to the other, from one song to the next, from one position to another. The name evokes practical movement, not contemplation. The setlist feature is your crossing plan — you mapped out the stones before you started walking. The tab icon is a bridge or stepping stones.

**Specific Features & UI Patterns**
- Position slider: draggable 5-fret window on a compact horizontal fretboard, snaps to fret positions
- Position-locked chord voicings: shows only chords playable within the current 5-fret window, as fingering diagrams
- Position-locked scale fragment: the scale notes within the current window, highlighted on a zoomed fretboard section
- Setlist Mode: swipeable cards, each card = song name + key + tempo, tapping a card sets Root Lock + position + BPM in the metronome
- Setlist builder: minimal form — song name (text), key (tap from 12 notes), tempo (number input), done
- "Metronome sync" button on each setlist card: one tap starts metronome at that song's BPM
- Quick-add to setlist from any position view (a small "+" icon that saves current key + position as a setlist entry)
- Transition hints: when swiping between setlist songs, a brief overlay shows the interval relationship between the two keys ("E minor to G major — relative major, shared 6 of 7 notes")

**What Makes It Different**

Every other proposal starts from "pick a key, see the theory." The Crossing starts from "where are my fingers right now?" and builds outward. It is the only proposal that treats physical hand position as the primary navigation axis. It is also the only one with a setlist feature, which directly serves the gig-bag constraint — a working musician playing 3 sets of covers needs per-song reference, not a general-purpose theory tool.

---

### Proposal 3: "The Eddy"

**Concept**

An eddy is a pocket of still water in a moving current — a place where you can stop and work something out. The Eddy reimagines the reference section as a **single-screen workbench** with a large, beautiful, interactive fretboard as the centerpiece and everything else as contextual overlays that appear and disappear based on what you tap.

The screen is dominated by a premium SVG fretboard that occupies roughly 60% of the viewport. It is landscape-orientation by default (auto-rotates on mobile). The strings have realistic gauge variation. The fret markers are inlaid. The wood grain is a subtle CSS gradient. This fretboard is not a diagram — it is the instrument interface.

Below the fretboard, a slim "command bar" holds three glass pills: Key, Shape, and Sound. Tapping Key opens the Root Lock overlay (slides up from the bottom, 12 notes + scale selector, dismiss by tapping outside). Tapping Shape cycles through display modes on the fretboard: scale notes, chord tones for each diatonic chord (cycle through with swipe), or CAGED position boxes. Tapping Sound triggers the audio integration — it becomes a drone/metronome quick-launch.

The critical interaction: **tap any note on the fretboard and a contextual bubble appears** showing what that note IS in the current context. If you are viewing the C major scale and you tap the E on the 5th string 7th fret, the bubble says "E — 3rd degree — found in: C, Am, Em" (listing which diatonic chords contain that note). This solves a real problem: "I know I want this note, but which chord am I actually implying?"

When you tap a chord name in the bubble, the fretboard morphs to show that chord's voicing at the nearest position to where you tapped. The whole interaction loop is: see the scale, tap a note, learn what chord it belongs to, see that chord shape. All without leaving the fretboard.

**River Metaphor Connection**

"The Eddy" — a pocket of calm in the current where things circle and you can examine them. The fretboard IS the river surface. The notes are stones visible beneath the water. Tapping a note is like reaching in and picking up a stone to examine it. The contextual bubble is the ripple that radiates outward, connecting that single note to the larger harmonic landscape. The tab icon is a spiral/eddy symbol.

**Specific Features & UI Patterns**
- Hero fretboard: 60% of viewport, landscape-capable, premium SVG with realistic string gauges (0.8px to 2.4px), subtle wood-grain CSS gradient background, glass-style fret markers
- Tap-to-inspect: tap any scale note on the fretboard to see a glass bubble showing degree, note name, and parent chords
- Chord morph: tap a chord name in the bubble, fretboard transitions to show that chord voicing at the nearest position
- Command bar: three glass pills (Key, Shape, Sound) — minimal chrome, maximum fretboard real estate
- Key overlay: slides up from bottom, Root Lock + scale selector, auto-dismisses after selection
- Shape cycling: swipe left/right on the fretboard to cycle between scale view, chord-tone views (one per diatonic chord), and CAGED positions
- Sound pill: tap for drone (root note), long-press for metronome BPM picker, integrates with existing Web Audio engine
- "Practice this" gesture: swipe up on the fretboard during any chord/scale view to launch the timer with context pre-filled
- Tuning reference: in Sound pill menu, a "Tune" option that plays each open string tone in sequence (E-A-D-G-B-E) with 1-second gaps

**What Makes It Different**

The Eddy is the only proposal that makes the fretboard the primary interface element rather than a supporting diagram. Everything else serves the fretboard. This is closest to how guitarists actually think — they look at the neck and ask questions about what they see. It is also the most visually striking proposal, betting that a single beautiful fretboard with smart interactions beats a page full of smaller diagrams. The risk: landscape orientation on a phone held vertically is awkward, and the "tap to inspect" interaction requires precision on small screens.

---

### Proposal 4: "The Riffle"

**Concept**

A riffle is the fast, shallow, turbulent section of a river where the water breaks over rocks. The Riffle is the wild/risky proposal. It throws out the entire concept of a "reference page" and replaces it with a **conversational, card-based interface** that you interact with like flipping through a deck of flash cards.

Here is the premise: a gigging musician does not sit down and methodically study a reference page. They have a specific question ("What is the IV chord in Bb?", "Show me A minor pentatonic at the 5th fret", "What chords go with Dorian?") and they want the answer NOW. The Riffle presents a single card at a time, full-width, with large readable diagrams. You swipe to get the next card. The cards are contextually generated based on your current Root Lock selection.

The default card deck for any key is:
1. **The Voicings Card** — the 4 most common chord shapes in this key, big fingering diagrams, barre and open variants
2. **The Map Card** — the full fretboard with scale notes, CAGED positions below
3. **The Moves Card** — 3 common progressions as playable sequences (tap each chord in order, see the shape)
4. **The Tone Card** — drone + metronome launcher with BPM presets (slow practice at 60, medium at 90, performance at 120+)

But here is the risky part: **you can build custom cards.** Long-press on any card to enter edit mode. You can pin specific chord voicings, save a custom progression, or add a text note ("bridge goes to relative minor"). Your custom deck persists. Over time, your Riffle deck becomes a personalized cheat sheet for YOUR gig — not a generic theory reference.

The interaction model is dead simple: swipe left/right to flip cards, swipe up to "pin" a card to the top of the deck, swipe down to dismiss a card you never use. The deck reorders based on what you use most. After a few gigs, the first card you see when you open the Riffle is the one you need most often.

Here is the moment of humor: if you swipe through all cards past the end of the deck, the final card reads "That is everything. If the answer is not here, just play the blues in E and look confident. Works every time." (Because honestly, it does.)

**River Metaphor Connection**

"The Riffle" — the fast, energetic section of the river. The cards flip past like water rushing over rocks. The swipe gesture mimics the current. Pinning a card is like catching something as it floats by — pulling it out of the flow to keep. The custom deck feature means your Riffle is shaped by how you play, like a river carving its own channel. The tab icon is a series of small rapids/waves.

**Specific Features & UI Patterns**
- Full-width card stack: one card visible at a time, swipe left/right to navigate, spring-physics animation on swipe
- 4 default card types: Voicings, Map, Moves, Tone (generated fresh for each key selection)
- Card pinning: swipe up to pin, pinned cards always appear first in deck
- Card dismissal: swipe down to hide cards you never use (recoverable via a "Restore" option in settings)
- Custom cards: long-press to edit, can add text notes, pin specific voicings, save custom progressions
- Usage-based reordering: the app tracks which cards you view most and reorders the deck accordingly (simple view-count stored in localStorage)
- Voicings Card: 4-6 chord diagrams at 72x96px minimum, shows both open and barre variants with a toggle
- Moves Card: tap a progression to see each chord animate onto the fretboard in sequence (250ms transition between shapes)
- Tone Card: big BPM dial (draggable, snaps to common tempos), one-tap metronome start, drone toggle
- Easter egg end card (see humor section above)
- Deck indicator: a row of small dots at the top showing card position, like iOS page dots

**What Makes It Different**

This is the risky one. It fundamentally changes how you interact with reference material — from "browse a page" to "flip through a deck." The bet is that musicians think in discrete questions, not in categories. The custom card feature could be transformative (your personal cheat sheet) or it could be a feature nobody uses. The swipe-based navigation could feel fast and natural or it could feel like fighting the interface when you want to see two things at once. The usage-based reordering is genuinely novel for a guitar app — I have never seen a reference tool that learns which information you actually use. But it requires enough usage data to be useful, and on day one the default ordering has to be good enough.

---

### Proposal 5: "Downriver"

**Concept**

Downriver is the no-nonsense, one-screen-tells-all proposal. It is inspired by a truth that every gigging musician knows: the most useful reference tool is the one taped to your mic stand — a single sheet of paper with the key, the chords, and the shapes, all visible at once without scrolling or tapping.

Downriver renders everything on a single, non-scrolling viewport. The layout is a tight grid optimized for 375px wide:

- **Top strip (48px):** Root note + scale, displayed as "G Major" in large text, with a tap-to-change interaction (tapping opens a bottom sheet with Root Lock + scale selector, which dismisses immediately on selection)
- **Middle band (approx 55% of remaining height):** A horizontal fretboard showing the current scale, with the CAGED positions marked as colored zones directly on the fretboard (no separate position diagrams — the positions ARE the fretboard). Each zone is a different shade from the water palette (water-1 through water-5). Tapping a zone highlights it and dims the others.
- **Bottom grid (approx 40% of remaining height):** A 4-column grid of chord voicing diagrams for the diatonic chords. Each cell shows the chord name, the numeral, and the fingering diagram. The diagrams are necessarily compact but use heavier line weights and larger dot sizes than the current implementation to remain readable. The grid scrolls horizontally if there are more than 4 chords (7 diatonic chords = almost 2 screenfuls of horizontal scroll).

That is it. One screen. No tabs. No modes. No sub-views. No scrolling vertically. The fretboard and chords are always visible simultaneously. Changing the key changes everything at once.

The integration hook: a floating "metronome pill" in the bottom-right corner of the fretboard. It shows the current BPM (or "off"). Tap to toggle metronome on/off at the last used BPM. Long-press to adjust BPM. It is always there, always one tap away. Because the single most common thing you need alongside a chord chart is a tempo.

The visual style leans hard into the Liquid Glass system. The fretboard sits in a glass card. The chord grid sits in a glass card. The CAGED zone overlays on the fretboard use semi-transparent glass fills. The whole screen should feel like looking through a frosted window at the neck of your guitar.

**River Metaphor Connection**

"Downriver" — the direction the current flows. It evokes forward momentum, the inevitability of the next song coming. When you are mid-gig, there is no going back — you are always heading downriver. The single-screen design mirrors this: there is no back button, no navigation, no going deeper. Everything you need is right here, in the current. The tab name "Downriver" and a simple arrow/current icon replace "Shed."

**Specific Features & UI Patterns**
- Single non-scrolling viewport: everything visible without scrolling on 375px wide, ~680px tall viewport
- Compact key display: "G Major" in 18px bold, tap to change via bottom-sheet overlay
- Integrated CAGED zones: colored transparent overlays directly on the fretboard SVG, no separate position boxes
- Chord voicing grid: 4-column, horizontal scrollable, showing all diatonic chords as fingering diagrams
- Barre variant toggle: small "B" chip in the chord grid header, swaps open voicings for barre shapes
- Metronome pill: floating glass pill over fretboard, tap on/off, long-press to adjust BPM
- Key signature indicator: sharps/flats count displayed next to key name ("G Major - 1#")
- Chord quality coloring: major chords use water-4 (blue), minor chords use lavender, diminished uses coral — same scheme as current ChordCard but applied to the fingering diagram backgrounds
- "Now playing" state: when the timer is running, the top strip shows a subtle pulse animation and the session's elapsed time, connecting reference browsing to active practice

**What Makes It Different**

Downriver is the anti-feature proposal. While other proposals add features (setlists, custom cards, tap-to-inspect), Downriver removes features until only the essentials remain. It is the only proposal that fits everything on one screen without scrolling. This is a hard constraint that forces brutal prioritization. The bet: musicians do not want to hunt for information, they want it all in front of them. The risk: fitting a useful fretboard AND readable chord diagrams on a 375px screen without scrolling is a genuine design challenge. The chord diagrams might end up too small, or the fretboard might end up too compressed. But if it works, it is the fastest reference experience possible — zero taps to see your key, chords, and scale positions all at once.

---

### Cross-Proposal Notes

**Shared Convictions (things all 5 proposals agree on):**
- "The Shed" must be renamed. Every proposal provides a river-connected name.
- Chord diagrams must show fingering shapes, not note lists. Every proposal replaces the current ChordCard's "C . E . G" with actual fretboard fingering diagrams.
- The metronome must be accessible from the reference view. Every proposal integrates the Web Audio engine.
- CAGED position diagrams need to be larger or reconceived. None of the proposals keep the current tiny 66px-max boxes.
- The 2-tap maximum is sacred. Root Lock counts as tap 1. Seeing what you need is tap 2 at most.

**The Gig Bag Test Rejections (features I considered and cut from all proposals):**
- Key signature staff notation (sharps on a treble clef) — nobody reads standard notation on their phone backstage
- Interval ear training — useful but not a reference tool, belongs in a separate feature
- Nashville Number System toggle — too niche, confuses more people than it helps
- Chord substitution suggestions — theory-for-theory's-sake, cut
- Mode relationship diagrams ("Dorian is the 2nd mode of...") — academic, cut

**My Recommendation**

If I had to pick one to build first, it would be **Proposal 2: The Crossing**. The position-first navigation and setlist feature directly serve working musicians in a way I have not seen in any guitar app. But **Proposal 4: The Riffle** is the one I would be most excited to use after a month of gigging, once the custom deck has learned my habits. And **Proposal 1: The Shallows** is the safest bet if the team wants to ship something solid without risk.

Build The Crossing. Dream about The Riffle. Fall back to The Shallows.

---

## The Practice Coach — Proposals

> A reference section that just shows you information is a textbook. A reference section that tells you what to do with that information is a teacher. Every proposal below is built around one belief: the moment between "I should practice" and "I am practicing" should be exactly one tap. If the reference section isn't actively making you a better guitarist, it's furniture.

---

### Proposal 1: "The Current"

**Concept: A Practice Flow Engine That Reads the Room**

The Current replaces the passive reference grid with a single, continuously flowing practice surface. When you open it, you don't see a wall of scales and chords — you see *one thing to do right now*, based on where you are in your practice journey.

The core mechanic is the **Current Card** — a full-width, Liquid Glass panel that presents a single focused practice prompt: "Play the A minor pentatonic in Position 2 at 72 BPM." Below it, the relevant fretboard diagram renders at generous size — no squinting. Below that, a single blue button: **"Flow."** One tap starts the timer, sets the metronome to the suggested BPM, and logs the activity tag automatically. You are practicing within two seconds of opening the tab.

The Current builds its suggestions from a **practice graph** — a lightweight state machine computed client-side that models how musical concepts connect. It reads your session history from `storage.js` — tags, notes, dates, frequency — and surfaces what you need. If you just practiced A minor pentatonic, it might suggest the relative major (C major pentatonic, same shapes, different root), or a chord progression that lives in that key (Am - F - C - G), or bump you up 4 BPM on the same exercise. The suggestions follow the way a real teacher sequences material: same key but different concept, same concept but different key, or same everything but harder.

If you haven't touched Dorian in two weeks, it floats upward. If you've been hammering pentatonics for five sessions straight, it gently nudges you toward full diatonic territory. The Current literally *has a current* — it pulls you toward the gaps in your practice.

Swiping the Current Card left reveals alternate suggestions (a lateral move — same difficulty, different material). Swiping right reveals a difficulty jump (same material, higher BPM or unfamiliar position). Swiping down dismisses the suggestion engine entirely and opens the full reference library — the old intent-based views (Chords, Scale, Circle, Quick Ref) are still there, one gesture away, for the days when you know exactly what you want. The Current doesn't lock you out of manual browsing. It just offers a better default.

The suggestion engine is deterministic, not random. Given the same practice history, it produces the same sequence. This means you can learn to trust it. Monday's suggestion isn't a dice roll — it's a logical consequence of what you did on Sunday.

**River Metaphor Connection: "The Current"**

The river's current is the force that carries you downstream without effort. You don't have to decide where to go — the water moves you. The tab name in the navigation bar becomes "Current" with a flowing-water icon. The practice suggestions literally flow, one into the next, the way water moves from pool to pool. The metaphor is precise: a current is not chaotic (that's rapids), it's a steady, directional force. That's exactly what this feature provides — steady direction for your practice.

**Timer/Logging/Audio Integration:**

- **Timer:** Tapping "Flow" on any Current Card calls the same `onSaveSession` pathway as TimerFAB's `handleStart()`. The session note is pre-filled with structured context (e.g., "A minor pentatonic, Pos 2, 72 BPM") and the relevant PRACTICE_TAG auto-selects ("Technique" for scale exercises, "Theory" for chord work, "Improv" for progression play-along). When the timer is already running, the Current Card swaps the "Flow" button for a "Currently Practicing" badge with elapsed time — it doesn't fight the active session, it acknowledges it.
- **Logging:** Session history is the fuel. The practice graph reads `getSessions()` and `getSessionsByDate()`, analyzes tag frequency, recency, and variety, then weights suggestions. The five PRACTICE_TAGS (Technique, Songs, Theory, Improv, Ear Training) become input signals: if 80% of your sessions are tagged "Technique," The Current starts surfacing "Improv" and "Theory" prompts more aggressively. Session notes are parsed for key names and BPM mentions when available.
- **Audio:** Each suggestion card carries a BPM recommendation. The metronome launches automatically via `startMetronome(bpm)` when you tap "Flow." If you've used rain ambience in your last 3 sessions (detectable from timer state patterns), `startRain()` auto-triggers at your last-used volume. The BPM on each card is tappable independently — tap to preview the tempo via a quick 4-beat metronome burst without committing to a full session.

**What Makes It Unique:**

No guitar reference app has ever been *opinionated*. Every existing tool is a passive encyclopedia that says "here is everything, you figure it out." The Current is the first reference section with a point of view on what you should practice right now. It turns "I have 15 minutes" into "here's exactly what those 15 minutes should be" — and then it starts the clock. The practice graph is also a new concept for guitar apps: a local-first, history-driven recommendation engine that requires zero configuration, no account, and no internet connection. It just watches what you do and suggests what comes next.

---

### Proposal 2: "The Guide Stones"

**Concept: Stepping-Stone Practice Paths That Connect Scale to Song**

Guide Stones transforms the reference section into a trail map. Instead of four disconnected intent views (Chords, Scale, Circle, Quick Ref), you see a single vertical **path** — a sequence of connected "stones" that represent a logical practice journey through a key, the way a teacher would structure a 20-minute lesson.

Each stone is a practice station. The path for C Major might look like:

- **Stone 1 — The Scale:** C Major scale, Position 1 highlighted on a generous fretboard. Prompt: "Play ascending and descending, 60 BPM. Focus on even timing."
- **Stone 2 — The Chord Tones:** C major chord (I) with a real fingering diagram showing the open voicing AND the barre E-form. Prompt: "Arpeggiate slowly. Can you hear the scale tones inside the chord?"
- **Stone 3 — The Progression:** I-V-vi-IV (C-G-Am-F). Each chord shows its voicing inline. Prompt: "Strum pattern: D-D-U-U-D-U at 70 BPM. Keep the changes clean."
- **Stone 4 — The Connection:** C major pentatonic over the same progression. Prompt: "Improvise over these 4 chords. Stay in Position 1. Let the chord tones guide your note choices."
- **Stone 5 — The Horizon:** Shift to relative minor (A natural minor). Prompt: "Same seven notes, new gravity. Notice how the mood changes when A becomes home."

The key insight: these stones are not random. They follow the exact sequence a guitar teacher uses in a lesson — scale knowledge, chord vocabulary, harmonic movement, applied improvisation, key relationship. Each stone builds on the previous one. You don't need to know theory to follow the path. You just step on the next stone.

Each stone has a timer-linked **"Step On"** button that starts a focused mini-session. As you complete stones, they visually fill with the blue water color from the river system (`water-1` through `water-5` depending on how many times you've visited). Progress flows down the path. Stones you completed in previous sessions show a subtle water-line mark at the bottom — you've been here before, the water remembers.

The path is **generated from the current Root Lock and scale selection**. Changing the key rebuilds the entire trail. The algorithm is hardcoded musical logic, not AI — it knows that major scales lead to diatonic chords, that diatonic chords form progressions, that progressions are the canvas for improvisation. It codifies what a teacher knows instinctively.

Stones expand on tap to reveal full diagrams, BPM suggestions, and practice prompts. Collapsed, they show a compact summary — stone name, a tiny voicing thumbnail, and estimated practice time (2-5 min). The collapsed view fits 3-4 stones on a 375px screen without scrolling, so you always see where you are in the journey.

**River Metaphor Connection: "The Guide Stones"**

In rivers, guide stones are the rocks that mark the safe path through rapids — the ones that are flat on top, stable underfoot, placed by nature or by someone who crossed before you. They show you where to step. The tab becomes "Guide" in the nav bar with a stepping-stone icon. Each practice stone is a place to plant your feet before the next step. You cross the river one stone at a time. When stones fill with water (completion), the path behind you becomes part of the river itself — you've made it this far, and the water proves it.

**Timer/Logging/Audio Integration:**

- **Timer:** Each stone carries an estimated duration (2-5 minutes). Tapping "Step On" starts the TimerFAB with that duration as a soft target shown in the UI (not a hard countdown — the timer still counts up, but the stone shows "~3 min suggested"). The session note auto-fills with the stone's description. When you stop the timer, the stone marks as complete and the UI scrolls to reveal the next stone with a prompt: "Ready for the next stone?" This creates a continuous practice flow without forcing it.
- **Logging:** Stone completion maps directly to session tags. Scale stones tag as "Technique." Chord stones tag as "Technique." Progression stones tag as "Songs." Improvisation stones tag as "Improv." Theory connection stones tag as "Theory." The path's history is stored in localStorage as a lightweight map: `{ key: 'C', scale: 'major', stonesCompleted: [1,2,3], lastVisited: '2026-03-06' }`. Over multiple sessions, you can see which paths you've fully traversed and which have dry stones waiting.
- **Audio:** BPM increases as you move down the path — Stone 1 at 60, Stone 3 at 70, reflecting increasing complexity. The metronome auto-starts via `startMetronome(bpm)` when you tap "Step On." For progression stones, the audio engine could extend to play root-note drones on chord changes — using `audioCtx.createOscillator()` with sine waves tuned to each chord's root frequency, triggered on metronome beat 1 of each bar. This gives you harmonic context while improvising without building a full backing-track engine.

**What Makes It Unique:**

No guitar app structures reference material as a connected *journey*. They all present information as flat categories — here are your scales, here are your chords, here are your positions. Guide Stones answers the question guitarists actually ask their teachers: "I know the C major scale. Now what?" The path is the answer. The visual progress tracking (water filling the stones) creates a feedback loop that's genuinely motivating — you can see your lesson materializing as a completed river crossing, one stone at a time.

---

### Proposal 3: "The Eddy"

**Concept: Circular Practice Loops That Deepen on Every Rotation**

(This is the wild one.)

The Eddy throws away the entire reference page paradigm. No grid. No list. No four intent tabs. Instead, you get a single, animated circle — a whirlpool rendered in SVG with Liquid Glass blur effects, spinning slowly on screen — that represents a **practice loop**.

You set your key (Root Lock stays). You choose a focus: Technique, Chords, or Improv. Then The Eddy generates a circular practice routine — 4 to 6 activities arranged as segments around the whirlpool. A scale run in Position 1. A chord progression. An arpeggio exercise. A rhythmic variation. A position shift. Each segment occupies an arc of the circle.

You tap the center to start. The whirlpool begins spinning — slowly, beautifully, with the Liquid Glass shimmer catching the light. The timer starts. The first segment highlights and expands outward, revealing its content: a chord diagram, a scale position, a practice prompt. The metronome ticks at the suggested BPM. After a configurable interval (1 minute, 2 minutes, or 5 minutes per segment), the whirlpool rotates to the next segment. A soft chime signals the transition — a new sound from the Web Audio engine, two sine oscillators tuned to the root and fifth of the current key with a quick exponential decay, like a singing bowl meeting a guitar harmonic. The next diagram appears. You keep playing.

Here's where it gets interesting: when you complete a full rotation, **the eddy tightens**. The next loop is the same material, but harder. BPM increases by 4. Or the scale position shifts to the next CAGED shape. Or the chord voicings switch from open to barre. The eddy pulls you deeper. Each rotation is logged as a "lap," and your session note auto-generates: "A Minor Pentatonic Eddy: 3 laps, 60 to 68 BPM."

The design is deliberately hypnotic. The spinning circle, the ambient rain, the ticking metronome — it creates a flow state container. You don't have to think about what comes next. The Eddy decides. You just play. The entire reference section has become a practice *session format* rather than a reference *page*.

If you want to peek ahead, a thin ring around the whirlpool shows all segments at once — a preview orbit. Tap any segment to jump ahead or revisit. But the design encourages you not to. The point is surrender.

(Yes, this is essentially a guitar practice meditation wheel. Yes, it's weird. No, I have never seen anything like it in any guitar app. Yes, I would use it every single day.)

**River Metaphor Connection: "The Eddy"**

An eddy is a circular current that forms in a river — water spinning in place, deepening with each rotation. It's the perfect metaphor for iterative practice. You go around and around the same material, but each pass cuts deeper. The tab becomes "Eddy" with a spiral icon. The visual language is pure river physics: the whirlpool SVG could even incorporate the app's existing water-color palette, with the spinning circle rendered in graduated blues from `water-1` (outer edge) to `water-5` (center), getting deeper as you get closer to the core.

**Timer/Logging/Audio Integration:**

- **Timer:** The Eddy IS the timer. Starting the eddy starts the practice clock. There is no separate "Start Practicing" button — the whirlpool animation and the timer are the same gesture. The FAB shows "Eddy 2:34" instead of just elapsed time. Stopping the eddy stops the timer and transitions to the standard save screen with the auto-generated lap notes. Pausing the eddy freezes the whirlpool animation — it holds in place, visually reinforcing the pause.
- **Logging:** Each completed lap is a micro-milestone. The session auto-tags based on the eddy focus (Technique/Theory/Improv). The auto-generated note captures everything: "3 laps of A Minor Eddy (60, 64, 68 BPM) — Scale, Progression, Arpeggio, Position Shift." Over time, your session history tells a story of eddy depth — how many laps you typically sustain, how far the BPM climbs — which is a proxy for focus, endurance, and improvement.
- **Audio:** The metronome is mandatory in Eddy mode — it drives the rotation timing via `metronomeBPM` and the lap-transition chime is timed to the beat. The chime itself is new audio: two oscillators (root frequency and fifth) with `type: 'sine'`, a sharp attack and `exponentialRampToValueAtTime(0.001, time + 0.3)` decay, routed through `masterGain`. Rain ambience auto-enables at `rainVolume: 0.2` when the eddy starts, creating a full practice soundscape. BPM increases between laps use `setBPM()` for smooth transitions rather than jarring jumps.

**What Makes It Unique:**

This does not exist. Not in guitar apps, not in practice apps, not in music education software. A circular, self-deepening, timer-integrated practice loop with automatic difficulty progression and flow-state design is a genuinely new format. It could be brilliant or it could be entirely unhinged — but the competition brief asked for a wild/risky proposal, and a guitar practice meditation whirlpool qualifies. The strongest argument for The Eddy is experiential: imagine telling someone "I just did 4 laps of the A minor Eddy and got up to 76 BPM." That sentence makes you want to try it.

(Also: "I got caught in an Eddy for 45 minutes" is how every flow-state practice session already feels. This just makes the metaphor literal.)

---

### Proposal 4: "The Tributary"

**Concept: Branch-and-Merge Practice Exploration as a Living Map**

The Tributary presents your selected key as a river system viewed from above — a main channel (the root scale) with branching waterways (chords, progressions, modes, techniques) flowing into it. It's a mind-map that you practice through, rendered as a top-down river delta where every branch is a launchable practice activity.

The main stream runs horizontally across the screen, scrollable. It represents your root scale — the full fretboard diagram is embedded in the stream, and tapping anywhere on it highlights the scale. Branching off this main stream are tributaries, each representing a family of musical concepts connected to this key:

- **Chord Tributary** — branches downward, showing each diatonic chord as a node with its numeral (I, ii, iii, IV, V, vi, vii). Tap a chord node and its fingering diagram (real shapes, not note lists) expands inline. Long-press and a "Practice" button appears that starts the metronome on a strum pattern.
- **Progression Tributary** — branches off showing 3-4 common progressions for this key as connected sequences of chord nodes. Tap a progression and it becomes a **practice loop**: the chord diagrams cycle on screen in time with the metronome, like a teleprompter for your practice. Each chord holds for 4 beats (one bar at the current BPM).
- **Mode Tributary** — branches to related modes that share notes with this key. Dorian, Mixolydian, etc. Each node shows what changes (one note!) and what stays the same. Tap to temporarily re-root the entire map to that mode's tonic.
- **Relative Key Tributary** — the parallel minor or major. A single branch that, when tapped, pivots the entire system to the relative key — the main stream changes, all tributaries recalculate, but a visual "bridge" shows the connection back.

The magic is in the connections made visible. You can *see* that Am is both the vi chord in C Major AND the i chord in A minor. You can see that Dorian is one note different from natural minor. You can see that three different progressions share the same ii-V movement. Theory stops being abstract because the relationships are *spatial* — literally mapped as waterways branching from a common source.

Each node in the tributary system is a launchable practice activity. A small play icon on every node launches a focused session with the timer running, the relevant diagram front and center, and the metronome at the node's suggested BPM. You never have to leave the map to practice — the map IS the practice interface.

The map scrolls horizontally and vertically to accommodate the branching structure. On a 375px viewport, you see the main stream and 2-3 nearest branches. The view is focused, not overwhelming — you explore by scrolling, revealing new branches as you go.

**River Metaphor Connection: "The Tributary"**

A tributary feeds into the main river. In music, every chord, mode, and progression feeds back into the key center. The tab name becomes "Streams" in the nav bar (short, punchy, fits the icon space) with a branching-water icon. The visual metaphor is direct: you're looking at a river system from above, and every branch of water represents a branch of musical knowledge. Practice sessions you complete fill the tributaries — nodes you've practiced turn from outline to filled, from dry to flowing.

Over days and weeks, your tributary map becomes a **practice heat map**. Some branches run deep blue (well-practiced, many sessions). Others are still dry creek beds (untouched). This visualization alone creates a powerful feedback loop: you can literally see which musical territories you've explored and which remain uncharted. The visual pull toward completing the dry branches is surprisingly motivating.

**Timer/Logging/Audio Integration:**

- **Timer:** Any node in the tributary map can launch a practice session via the play icon. The timer FAB pulses subtly when you're on the Tributary tab without an active session — a gentle prompt. Starting a session from a specific node auto-fills the note with the node's context ("C Major - Progression: I-V-vi-IV at 80 BPM") and auto-tags based on tributary type: chord tributary = "Technique", mode tributary = "Theory", progression tributary = "Songs" or "Improv", relative key = "Theory".
- **Logging:** Completed sessions feed back into the map state. A lightweight localStorage structure tracks which nodes have been practiced and when: `{ key: 'C', scale: 'major', nodes: { 'chord-I': { count: 5, lastPracticed: '2026-03-06' }, ... } }`. The `getSessions()` data is also analyzed to color the map — recent sessions make nodes glow brighter, older sessions fade. The heat-map emerges naturally from practice data that's already being collected.
- **Audio:** Progression nodes are the star integration. Tapping "Play Along" on a I-V-vi-IV progression starts `startMetronome(bpm)` and uses a scheduler (extending the existing `schedulerTick` pattern) to trigger visual chord changes every 4 beats. The audio engine plays a root-note drone for each chord — `audioCtx.createOscillator()` with a sine wave at the chord's root frequency (C3=130.81Hz, G3=196Hz, etc.), fading out over the last beat of each bar to signal the transition. Not a full backing track, just enough harmonic context to keep your ears honest while your eyes follow the chord diagrams.

**What Makes It Unique:**

No guitar app has ever visualized musical relationships as a spatial, explorable map. Scale-chord-mode connections are always presented as tables, lists, or text explanations. The Tributary makes them navigable. You don't study theory — you explore territory. And the practice heat map is a genuinely new feedback mechanism: seeing which branches of your musical knowledge are flowing and which are dry creates motivation that no practice streak counter can match. You're not counting days — you're filling a river system.

---

### Proposal 5: "The Dock"

**Concept: A Practice Launchpad Where Every Element Is One Tap From the Timer**

The Dock is the pragmatic backbone proposal. It keeps the existing reference architecture (Root Lock, scale selector, intent views) but rebuilds every component so that no piece of information exists without a direct pathway to *practicing* it. The Dock is not clever. It is relentlessly, exhaustively useful.

The central reframe: rename "The Shed" to "The Dock" and treat the entire section as a **departure point** rather than a reading room. You come to The Dock to launch practice sessions, not to study. Every diagram has a play button. Every chord card connects to the timer. Every progression connects to the metronome. The Dock is where you push off from shore.

**Key changes from the current Shed:**

**1. Practice-Ready Chord Cards.** The diatonic chord grid (currently showing note lists like "C - E - G") gets rebuilt with real `ChordDiagram` components showing actual finger positions — the same SVG diagrams currently used only in the Quick Ref section, promoted to the primary chord view. Tap a chord card and it expands to a detail panel showing multiple voicings: open shape, barre E-form, barre A-form. Each voicing has a "Practice" button that starts the timer with the chord name in the session note and "Technique" auto-selected as the tag.

**2. Progression Launcher.** Below the diatonic chords, a new section: "Progressions in [Key]." Shows 3-4 common progressions for the current key and scale (I-V-vi-IV for major, i-iv-VII-III for minor, ii-V-I for jazz contexts). Each progression displays as a horizontal strip of chord names with a "Play Along" button. Tapping it starts the metronome and cycles chord diagrams on beat — the chord shapes change every 4 beats (one bar), synchronized to the metronome tick via the existing `schedulerTick` timing. This is a practice format that didn't exist in the app before.

**3. Quick Start Cards.** At the very top of The Dock, before Root Lock, three contextual cards generated from practice history:
- **"Continue"** — parses your most recent session's note for key/scale/activity references and regenerates that reference material. One tap relaunches where you left off.
- **"Explore"** — surfaces a key or scale you haven't practiced recently (cross-references `getSessions()` tag and note history against the available keys and scales). One tap sets Root Lock and launches the timer.
- **"Challenge"** — random key + random progression + a BPM 10% higher than your recent average. One tap into the deep end.

Each Quick Start card is a single-tap timer launch. The cards use the Liquid Glass frosted style with a subtle blue gradient on the left edge to indicate they're interactive launch points, not just information.

**4. Scale Positions, Supersized.** The CAGED position diagrams (currently maxing out at 66px wide) get doubled to ~120px wide, displayed in a horizontal scroll container. Each position is tappable to enter a focused practice view: the position diagram fills the screen, a BPM picker appears below it, and a "Practice This Position" button starts the timer. The expanded view also adds color-coded fingering suggestions (index=blue border, ring=purple border, pinky=coral border) to guide the fretting hand.

**5. Tuning Strip.** A slim, always-visible strip at the top of The Dock showing six string buttons: E-A-D-G-B-e. Tap any string and a clean sine wave plays at the correct frequency via `audioCtx.createOscillator()` — E2=82.41Hz, A2=110Hz, D3=146.83Hz, G3=196Hz, B3=246.94Hz, E4=329.63Hz. Two-second sustain with a gentle fade-out via `exponentialRampToValueAtTime`. Tap again to stop. Simple, essential, and the kind of thing you reach for at the start of every practice session. The tuning strip uses a dark glass background to visually separate it from the reference content below.

**6. "Practice This" Everywhere.** The unifying principle: a small, consistent play-circle icon (the same blue gradient used in the timer FAB) appears on every actionable element — chord cards, position diagrams, progression strips, scale views. Tapping it always does the same thing: starts the timer, fills the note, selects the tag. The gesture vocabulary is simple and learnable. See something, tap the blue circle, you're practicing.

**River Metaphor Connection: "The Dock"**

A dock is where the river meets human intention. It's where you step onto the water. You tie up your boat at the dock. You launch from the dock. You return to the dock. The Dock is the threshold between *thinking about practice* and *actually practicing*. The tab name becomes "Dock" with a pier-post icon. The metaphor works bidirectionally: a dock is both a place of preparation (reference, browsing, tuning up) and a place of departure (launching into timed practice). When you return from a session, you're back at The Dock — ready to launch again or tie up for the day.

**Timer/Logging/Audio Integration:**

- **Timer:** Every interactive element on The Dock can launch a timer session through a shared `launchPractice({ note, tags, bpm })` function that calls `handleStart()` on the TimerFAB, pre-fills the session note, auto-selects the PRACTICE_TAG, and optionally starts the metronome at the specified BPM. The blue play-circle icon is the universal trigger. The timer FAB's existing position (bottom-right, above tab bar) means it's always visible on The Dock, and launching from any element smoothly transitions to the expanded timer overlay.
- **Logging:** Quick Start cards read directly from `getSessions()` and `getSessionsByDate()` to generate suggestions. The "Continue" card parses the most recent non-fog session's note field for key indicators (note names, scale names, BPM numbers) using simple string matching. The "Explore" card compares practiced keys (extracted from session notes) against the full NOTES array to find gaps. The "Challenge" card reads recent session BPM mentions and averages them. All three cards are computed fresh on every render — no caching needed since `getSessions()` already uses an in-memory cache.
- **Audio:** The tuning strip is pure Web Audio: `audioCtx.createOscillator()` with `type: 'sine'` at standard guitar frequencies, routed through a gain node with `linearRampToValueAtTime` for fade-in and `exponentialRampToValueAtTime` for fade-out. The Progression Launcher uses `startMetronome(bpm)` for the click track and extends the scheduler to emit a custom event on beat 1 of each bar, which the progression UI listens to for chord-change transitions. Rain ambience is accessible from a small cloud icon in the Dock header — one tap toggles `startRain()`/`stopRain()` at the last-used `rainVolume`.

**What Makes It Unique:**

The Dock is not trying to be clever. It's trying to be *complete*. Its unique contribution is integration density — the sheer number of direct pathways from "looking at information" to "practicing with the timer running." Every other guitar reference app is a dead end: you look at a chord, you close the app, you play. The Dock keeps you in the practice loop. The Quick Start cards are particularly novel — no guitar app has ever used practice history to generate contextual launch points for the next session. The "Continue / Explore / Challenge" triptych is simple but addresses three distinct practice mindsets (momentum, growth, adventure) in three taps.

(Also, "I'm heading to The Dock" is just a better sentence than "I'm going to The Shed." The Shed sounds like where you store a lawnmower. The Dock sounds like where you start a journey.)

---

### Cross-Proposal Notes

**Shared Convictions (things all 5 proposals agree on):**
- "The Shed" must be renamed. Every proposal provides a river-connected name.
- Passive display is the enemy. Every element must be one tap from an active practice session with the timer running.
- The timer integration is not a nice-to-have — it's the entire point. A reference section disconnected from the timer is a missed connection.
- Chord diagrams must show real fingering shapes. The current "C - E - G" note-list display teaches nothing about where to put your hands.
- Session history should inform what the reference section shows. The app already collects rich practice data via `storage.js` — it should use that data to be smarter about what it surfaces.
- The metronome is a practice tool, not a standalone feature. It belongs embedded in the reference context, not isolated behind a separate panel.

**Features Considered and Cut (the teacher's "not today" list):**
- AI-generated practice plans — violates the pure client-side constraint and adds complexity without proportional value. The deterministic practice graph (Proposal 1) achieves 80% of the benefit with zero external dependencies.
- Video lesson embeds — turns a reference tool into a content platform. Not what a practice coach does.
- Social features (share your practice path, compete with friends) — a distraction from the core loop of reference-to-practice.
- Gamification badges for completing practice paths — the water-fill metaphor in Guide Stones and Tributary already provides visual progress feedback without artificial rewards. Badges are condescending. The river is honest.
- Sight-reading exercises — valuable but a different product entirely.

**My Recommendation:**

Build **Proposal 5: The Dock** as the foundation. It's the most pragmatically complete — it fixes every current problem (no fingering diagrams, no progressions, no audio integration, no practice connection, tiny positions) while adding the Quick Start intelligence layer. It ships well and works immediately.

Then layer **Proposal 1: The Current** on top as the default landing experience. The Current Card sits at the top of The Dock, and the full reference library lives below the fold. Best of both worlds: guided practice for when you don't know what to do, manual reference for when you do.

Dream about **Proposal 3: The Eddy**. Build it on a weekend when you're feeling brave. It's either the best feature in the app or the weirdest. Either way, you'll learn something.

And if anyone on the team has the stomach for it, **Proposal 4: The Tributary** is the most visually spectacular option and the strongest contender for the Wildcard Award. A practice heat map rendered as a river delta is the kind of thing people screenshot and share.

Guide Stones (Proposal 2) is the one a real guitar teacher would pick. It's structured, sequential, and pedagogically sound. If the goal is actually making users better guitarists rather than impressing judges, it might be the right answer.

Build The Dock. Layer The Current. Dream about The Eddy. Aspire to The Tributary. Trust The Guide Stones.

---

## The Visual Craftsperson -- Proposals

> "If you would not hang it on the wall of a recording studio, it does not ship."

---

### Proposal 1: "The Luthier's Blueprint"

**River section name: "The Shallows"** -- *where the riverbed is visible, where you can see every stone*

#### Concept

The entire reference section is reimagined as an engraver's technical drawing -- the kind of anatomical instrument diagram you would find in a 19th-century luthier's workshop, translated into the Liquid Glass language. Every SVG element is drawn with the obsessive precision of a blueprint: dimensional tick marks along the fretboard edges, hairline construction lines connecting scale positions, and a subtle cream-on-ivory parchment texture beneath the glass.

The fretboard is THE hero element. It occupies a full-width horizontal scroll area but with anatomically correct proportional fret spacing -- frets get narrower as you ascend, following the 12th root of 2 division ratio that governs real guitar necks. The current implementation uses uniform `FRET_W = 52` spacing. This is a lie. A real guitar's first fret is roughly 36mm wide; the 12th fret is roughly 18mm. The Blueprint corrects this with a logarithmic spacing function: `fretWidth(n) = BASE_WIDTH * Math.pow(0.9439, n)`. The visual difference is immediate -- the fretboard *breathes* like a real neck.

Strings are rendered with SVG `linearGradient` fills, not flat colors. The low E gets a warm bronze gradient (`#D4A574` to `#A67C52`) simulating wound phosphor bronze. The high E gets a bright steel gradient (`#E8E4DD` to `#C8C4BC`). Each string has a different `strokeWidth` following real gauge ratios: `.010, .013, .017, .026, .036, .046` mapped proportionally. A subtle `<feGaussianBlur stdDeviation="0.3">` shadow beneath each string gives dimensionality.

Note indicators are not circles. They are *inlaid dots* -- rendered with a radial gradient that simulates a mother-of-pearl inlay (`#F0EBE3` center, `#D4CEC4` edge, with a `<feTurbulence>` noise filter at 5% opacity to create the nacreous shimmer). Root notes use an abalone variant with a blue-green iridescence pulled from the water palette (`water-3` to `water-5`).

The nut is a bone-colored rectangle with a barely-visible crosshatch texture (SVG `<pattern>` with 45-degree lines at 2% opacity). Fret wires are rendered as twin lines -- a bright nickel highlight line at 0.5px and a shadow line at 0.3px offset by 1px -- creating the illusion of a rounded fret crown catching light.

CAGED position diagrams graduate from the current `maxWidth: 66px` cramped boxes to 90px-wide mini-fretboards inside individual Liquid Glass cards. Each card has a colored left-border accent (E=coral, D=amber, C=forest, A=lavender, G=water-4) creating a color-coded system that persists everywhere positions appear. The position name is typeset in `font-serif` (Lora) at the top of each card.

Chord diagrams get a complete rewrite. Finger dots show actual finger numbers (1-4) inside them, barre chords render as a thick rounded-rectangle spanning the barred strings (not individual dots), and muted strings get a delicate X drawn with two angled hairlines, not a text character. An open-string O is rendered as a thin ring with a subtle inner shadow.

#### Rendering Techniques

- **Proportional fret spacing**: Logarithmic width function `fretWidth(n) = 52 * pow(0.9439, n)` replacing uniform 52px
- **String gradients**: `<linearGradient>` per string -- wound strings warm bronze (`#D4A574` to `#A67C52`), plain strings bright steel (`#E8E4DD` to `#C8C4BC`)
- **Mother-of-pearl note dots**: `<radialGradient>` + `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3">` composited at 5% opacity via `<feComposite>`
- **Fret wire illusion**: Dual-line rendering -- bright `#D4D0C8` line at 1px + shadow `#78716C` line at 0.5px offset 1px below -- for 3D fret crown effect
- **Nut crosshatch**: `<pattern patternUnits="userSpaceOnUse" width="4" height="4">` with 45-degree hairlines at 2% opacity
- **String shadow**: `<filter>` containing `<feGaussianBlur stdDeviation="0.3">` + `<feOffset dy="1">` drop shadow beneath each string line
- **Barre chord bars**: `<rect rx="3">` spanning barred strings instead of individual circles, with finger number centered
- **Inlay markers**: Double dots at 12th fret with pearl radial gradient, single dots at 3/5/7/9 with subtle abalone coloring (`#2DD4BF` to `#3B82F6` radial)
- **Dimensional tick marks**: Small 3px lines at every fret along the bottom edge of the fretboard, like ruler markings on a blueprint

#### River Metaphor Connection

"The Shallows" -- the part of the river where the water is crystal clear and you can see every stone on the bottom. The Blueprint makes every detail visible with the same clarity. The shallow water metaphor extends to the rendering: the fretboard background uses a subtle `<linearGradient>` from warm sandy beige at the top to cooler blue-gray at the bottom, as if the fretboard is a riverbed seen through shallow water.

#### What Makes It Unique

It is the only proposal that corrects the fundamental visual lie of uniform fret spacing. Every guitarist's brain knows something is off when frets are evenly spaced -- they have stared at a real neck for hundreds of hours. Fixing this single detail elevates the entire experience from "web app diagram" to "this person actually plays guitar." The material rendering (bronze strings, pearl inlays, bone nut) gives the SVG a tactile quality that Liquid Glass cards alone cannot achieve. You could screenshot this fretboard and a guitarist would recognize it as *their instrument*, not a schematic of their instrument.

---

### Proposal 2: "The Stained Glass Neck"

**River section name: "The Depths"** -- *where light refracts through water, where color is meaning*

#### Concept

What if the fretboard was not a technical diagram but a stained glass window? Each note on the neck is rendered as a colored cell in a mosaic, where color encodes function with absolute consistency across the entire app. This is a semantic color system for music theory, and it turns the fretboard into something you can *read by color alone*.

The system:

| Function | Color | CSS Variable | Hex |
|----------|-------|-------------|-----|
| Root / Tonic (1) | Deep river blue | `water-4` | `#2563EB` |
| Perfect 5th (5) | Teal | custom | `#14B8A6` |
| Major 3rd (3) | Warm amber | `amber` | `#F59E0B` |
| Minor 3rd (b3) | Lavender | `lavender` | `#A78BFA` |
| Perfect 4th (4) | Forest green | `forest` | `#166534` |
| Minor 7th (b7) | Coral | `coral` | `#E8735A` |
| Major 7th (7) | Rose pink | custom | `#F472B6` |
| 2nd / 9th | Soft sky | `water-1` | `#BFDBFE` |
| 6th / 13th | Pale gold | custom | `#FDE68A` |
| Chromatic (non-scale) | Ghost gray | `text-3` | `#A8A29E` at 0.08 opacity |

The fretboard renders every fret-string intersection as a rounded rectangle cell (like a real fret space), not just the scale tones. Non-scale tones are ghosted at 8% opacity -- visible enough to show the chromatic grid, invisible enough not to distract. Scale tones glow at full saturation. The result is a heat map of the neck where patterns literally pop.

Each cell uses an SVG `<rect>` with generous `rx="3"` rounded corners, separated by 1px gaps (the fret wires and strings). The cells receive a `<linearGradient>` from top to bottom -- slightly lighter at the top, darker at the bottom -- giving each one a subtle pillow effect, like a real stained glass leading.

When a CAGED position is selected, the cells outside the position dim to 15% opacity while the selected position's cells bloom to full saturation with a 2px `<feGaussianBlur>` glow behind them -- like light streaming through that section of the window. The transition animates over 400ms with `cubic-bezier(0.22, 1, 0.36, 1)` easing.

The Circle of Fifths gets the same treatment. Each key's segment is colored by its relationship to the currently selected root: the root segment is `water-4`, the dominant is teal, the subdominant is forest, and relative minor is lavender. Adjacent keys share a subtle gradient blend at their edges, visually showing how closely related they are. The circle becomes a color wheel of harmonic relationships.

Chord cards transform: each note in the chord is displayed as a colored pip matching the interval color system. A C major chord shows three pips: blue (C/root), amber (E/major 3rd), teal (G/perfect 5th). At a glance, you see the chord's *character* -- minor chords always show lavender where major chords show amber. The pattern becomes instinctive.

#### Rendering Techniques

- **Cell grid**: `<rect>` per fret-string intersection (6 strings x 15 frets = 90 cells), each with 1px gap, `rx="3"`, chromatic tones at 8% opacity
- **Pillow gradient**: `<linearGradient id="pillow-{color}" y1="0" y2="1">` per interval color -- 15% lighter at top, 15% darker at bottom
- **Position bloom**: `<filter>` with `<feGaussianBlur stdDeviation="2">` layered behind active position cells, with 400ms opacity transition
- **Leading lines**: 1px `<line>` strokes at `text-3` 30% opacity between cells, simulating stained glass cames (the metal strips between glass pieces)
- **Interval color pips**: 6px diameter `<circle>` elements in chord cards, filled with the interval's semantic color
- **Harmonic Circle**: Each of 12 segments in the Circle of Fifths receives a fill from the interval color palette based on its relationship to the selected root
- **Glass composite**: Entire fretboard grid wrapped in a `.card` container with `backdrop-filter: blur(40px)` allowing the ambient background gradient to bleed through the ghost cells
- **Glow compositing**: Active cells get a duplicate `<rect>` behind them with `filter="url(#cellGlow)"` where `#cellGlow` contains `<feGaussianBlur stdDeviation="3">` and `<feColorMatrix>` to intensify the base color

#### River Metaphor Connection

"The Depths" -- where light enters the water and refracts into color. The stained glass metaphor maps perfectly: the fretboard is a window, and the light passing through it reveals the harmonic structure of the key. Different depths of water shift the color of light differently, just as different intervals shift the color of each cell. The section name evokes looking down into deep, clear water and seeing the colors of the stones below.

#### What Makes It Unique

No guitar app has ever used a consistent semantic color system for intervals. Every app colors root vs "other." This system gives every scale degree its own visual identity. After a week of use, a guitarist stops reading note names and starts reading color patterns -- "I can see the amber cell two frets up on the next string" becomes a visual reflex meaning "the major 3rd is right there." It makes the invisible architecture of music visible. The stained glass aesthetic also pairs beautifully with the Liquid Glass design system -- frosted panels containing colored glass cells feels like a natural extension of the visual language, not a departure from it.

---

### Proposal 3: "The Cartographer's Neck"

**River section name: "The Map Room"** -- *where you chart the waters before you navigate them*

#### Concept

The fretboard is a topographic map. Scale tones are elevated terrain; non-scale tones are valleys. The neck becomes a landscape you can read like a hiker reads contour lines, and the CAGED positions are named regions on the map.

The primary fretboard SVG renders the standard string-and-fret grid but adds contour lines -- concentric rounded paths around clusters of scale tones, drawn with `<path>` elements using quadratic Bezier curves. Where three or four scale tones cluster together (as they do in every CAGED position), the contour lines tighten like elevation lines around a peak. Isolated scale tones on the periphery have wider, more relaxed contours. The visual effect is immediate: you can see the "high ground" -- the areas of the neck where your fingers should naturally gravitate.

Contour lines use the water palette at decreasing opacity: the innermost contour (around the root) is `water-4` at 40%, the next ring is `water-3` at 25%, the outer ring is `water-2` at 12%. This creates a topographic heat effect that fades to the flat terrain of non-scale tones.

Scale tone dots are rendered as "elevation markers" -- small circles with a tiny crosshair (`+` shape) through them, like survey markers on a topo map. Root notes get a larger marker with a filled circle and a concentric ring, like a city on a map. The font for all labels is monospace, reinforcing the cartographic aesthetic.

Each CAGED position is enclosed in a dashed-line boundary (`strokeDasharray="4 2"`) with the position name set in small caps at the top of the region, like a territory label on a map. When you tap a position, the boundary becomes solid and the interior gets a subtle fill (`water-2` at 5% opacity), like selecting a region on an interactive map.

The legend appears in the top-right corner of the fretboard card: a small Liquid Glass panel showing the elevation scale (root = peak, 5th = ridge, 3rd = plateau, etc.) with colored markers matching the contour system. It is typeset in 8px monospace with tight leading, like a real map legend.

A compass rose replaces the Circle of Fifths. The root note sits at true north. The dominant (5th) occupies the northeast position. The subdominant (4th) is northwest. Relative minor is due south. The 12 keys are arranged around the rose, and clicking one rotates the entire rose (with a 600ms spring animation using `cubic-bezier(0.34, 1.56, 0.64, 1)`) to place the new root at north. It is the Circle of Fifths but rendered as a navigation instrument -- because that is exactly what it is.

#### Rendering Techniques

- **Contour generation**: For each CAGED region, compute the convex hull of its scale-tone positions, then generate offset paths outward at 3px, 6px, and 9px intervals using `<path d="M... Q... Z">` with quadratic Bezier curves for smooth contour shapes
- **Contour color cascade**: Innermost path `stroke="water-4"` at 40% opacity, middle `stroke="water-3"` at 25%, outermost `stroke="water-2"` at 12%, all `strokeWidth="0.8"` and `fill="none"`
- **Survey markers**: Each note dot overlaid with a crosshair -- two 5px `<line>` elements (horizontal and vertical) at 20% opacity, creating the `+` surveyor mark
- **Territory boundaries**: `<rect>` per CAGED region with `strokeDasharray="4 2"` and `stroke="water-3"` at 30% opacity; on selection: `strokeDasharray="none"`, `fill="water-2"` at 5%
- **Compass rose SVG**: Custom 12-point star `<polygon>` with N/S/E/W cardinal indicators in 7px bold monospace; outer labels for each key at radius 100px; animated rotation via CSS `transform: rotate(${angle}deg)` with `transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Paper terrain texture**: `<filter id="terrain">` containing `<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2">` composited behind the fretboard at 3% opacity, giving a subtle parchment/paper-map feel
- **Monospace typography**: All labels use `fontFamily="monospace"` with `letterSpacing="0.05em"` for the map-data aesthetic
- **Elevation legend**: A 40x80px `<g>` positioned at top-right with colored gradient bar and three labeled stops (Root/5th/Scale Tone)

#### River Metaphor Connection

"The Map Room" -- the place in every expedition headquarters where the river is studied before anyone sets foot in the water. The cartographic language reinforces navigation: you are charting the fretboard the way you would chart a river, identifying the safe crossings (root positions), the deep pools (chord clusters), and the rapids (chromatic passages). The compass rose Circle of Fifths doubles down on this -- it is literally a navigation instrument for harmonic movement.

#### What Makes It Unique

It solves the "where should I play?" problem visually, without requiring the user to memorize box patterns. Instead of learning that "the E shape starts at fret 7 in A major," you look at the contour map and see that there is a cluster of high ground around frets 5-9 on strings 4-6. "Play the peaks, avoid the valleys" is a more intuitive instruction than "play the notes in the box." The compass rose is also genuinely novel for Circle of Fifths visualization -- it reinforces that key relationships are about *navigation*, not just arrangement on a circle. And "The Map Room" is a section name with real character.

---

### Proposal 4: "The Resonance Chamber"

**River section name: "The Echo Pool"** -- *a still pool where the water vibrates with reflected sound*

#### Concept (THE WILD ONE)

Throw every convention out. The fretboard is not a grid. It is a *resonance visualization*.

When you select a scale, the 15-fret fretboard dissolves. In its place, a circular mandala appears. The 12 chromatic notes are arranged in a circle (like a clock face). Scale tones are connected by glowing lines forming a polygon inside the circle -- a major scale creates a heptagon, a pentatonic creates a pentagon, a blues scale creates a hexagon with one slightly off-kilter vertex (the blue note, the b5). The shape of the scale IS the scale.

Each polygon edge is an SVG `<line>` with a per-edge `<linearGradient>` that shifts color based on the interval size between the two connected notes: whole-step edges are `water-3`, half-step edges are `coral` (tension!), minor-third jumps are `lavender`. The polygon pulses gently -- vertices breathe in and out by 2px on a 3-second `ease-in-out` animation cycle -- like the shape is alive, resonating.

Beneath the polygon, concentric ripple rings radiate outward from the root note's position on the circle, like a stone dropped in still water. These are rendered with `<circle>` elements at decreasing opacity (`water-2` at 30%, 15%, 8%, 4%) and increasing radius (40px, 70px, 100px, 130px). The ripples animate outward on key change with a staggered 100ms delay between rings.

When you tap a note on the circle, it triggers a Web Audio oscillator playing that note's frequency for 200ms with a gentle envelope (attack: 10ms, decay: 100ms, sustain: 0.3, release: 200ms). The polygon edge connected to that note brightens momentarily. You can *hear the shape*.

The CAGED positions are shown as small polygons below the main mandala -- five thumbnail versions of the same circular representation, but filtered to only show the notes within each position's fret range. Tapping one animates the main mandala to highlight only those vertices.

For chord display, the mandala morphs. A major triad becomes a triangle. A minor triad becomes a triangle with one vertex pulled inward (the flatted 3rd). A 7th chord becomes a quadrilateral. The geometric relationship between chord types becomes visually obvious -- a minor chord is literally a "different-shaped" triangle than a major chord, and you can see exactly which vertex moved and by how much.

The Circle of Fifths is already a circle -- so it becomes the OUTER ring of the mandala. The scale polygon sits inside the key circle. When you change keys, the outer ring rotates while the inner polygon morphs to the new scale shape. Two layers of circular geometry, nested and independently animated.

This will confuse approximately 40% of users on first encounter. That is fine. The other 60% will experience a genuine "oh THAT is what a scale looks like" epiphany, and that moment is worth the confusion. A small tooltip on first visit says: "This is your scale's shape. Weird? Tap the grid icon for the standard fretboard." There is always an escape hatch to a conventional fretboard view.

(Also: the mandala for the Blues scale looks like a slightly drunk hexagon, because the blue note -- the b5 -- sits at an awkward angle between the 4th and 5th, pulling one vertex off the regular hexagonal grid. This is thematically perfect. The Blues have always been a little crooked.)

#### Rendering Techniques

- **Chromatic clock**: 12 `<circle>` nodes at `r="8"`, positioned via `cx = center + radius * Math.cos(i * Math.PI / 6 - Math.PI / 2)`, `cy = center + radius * Math.sin(i * Math.PI / 6 - Math.PI / 2)` on a 120px radius
- **Scale polygon**: `<polygon points="...">` connecting scale-tone nodes; edges rendered as individual `<line>` segments to allow per-edge gradient coloring
- **Per-edge gradients**: `<linearGradient>` on each edge -- `water-3` for whole steps (2 semitones), `coral` for half steps (1 semitone), `lavender` for minor thirds (3 semitones)
- **Breathing animation**: `@keyframes breathe { 0%, 100% { transform: translate(0, 0) } 50% { transform: translate(${dx}px, ${dy}px) } }` applied to each vertex `<g>`, where dx/dy push the vertex 2px outward along its radial axis
- **Ripple rings**: 4x `<circle>` with `fill="none"` and `stroke="water-2"`, staggered `animation-delay: 0ms, 100ms, 200ms, 300ms` and `@keyframes ripple { from { r: 20; opacity: 0.3; stroke-width: 2 } to { r: 140; opacity: 0; stroke-width: 0.5 } }` with 2s duration and `infinite` iteration
- **Audio integration**: `new OscillatorNode(audioCtx, { frequency: 440 * Math.pow(2, (noteIndex - 9) / 12), type: 'sine' })` connected to a `GainNode` with ADSR envelope -- 10ms linear ramp up, 100ms exponential ramp to 0.3, 200ms release on note-off
- **Chord geometry morphing**: Interpolate polygon vertex positions over 300ms using `requestAnimationFrame`, moving from triad triangle to 7th-chord quadrilateral by smoothly adding/removing the 4th vertex
- **Nested circles**: Outer ring (Circle of Fifths) at radius 150px, inner polygon at radius 90px; outer ring rotates via CSS `transform: rotate()` on key change, inner polygon morphs via point interpolation

#### River Metaphor Connection

"The Echo Pool" -- a deep, still section of river where sound bounces off the rock walls and the water vibrates with reflected resonance. The circular mandala is the pool seen from above. The ripple rings are the sound waves propagating through the water. The vertices of the polygon are the stones at the edge of the pool that the sound bounces off. It is a place of contemplation and pattern recognition -- you stare into the pool and the structure of the music stares back at you.

#### What Makes It Unique

This is the mandatory wild/risky proposal, and it earns the label. It completely abandons the fretboard metaphor and asks: what does a scale *look like* as a pure geometric object? The answer is surprisingly beautiful -- a major scale is a regular-ish heptagon, a pentatonic is a clean pentagon, and the blues scale is a beautifully asymmetric hexagon. No guitar app has ever shown this. It connects to the Web Audio engine in a way that makes the reference section genuinely *playable*. And the drunk hexagon of the Blues scale -- the one where the b5 pulls a vertex slightly off-axis like a stumbling dancer -- will genuinely make someone laugh the first time they see it. The Comedy Award nomination starts here.

---

### Proposal 5: "The Engraver's Proof"

**River section name: "The Still Bank"** -- *the solid ground at the river's edge, where you stand to study the water*

#### Concept

What if the reference section looked like it was typeset by Robert Bringhurst and engraved by a master printmaker? No gradients. No glows. No blur. Just black ink on white stock, with one accent color (the river blue), rendered at a level of typographic precision that makes everything else in the app look noisy by comparison.

This is the anti-proposal. It strips the Liquid Glass system down to its structural skeleton and asks whether pure typography and precise line work can beat frosted panels and ambient glow.

The fretboard is drawn with absolutely uniform 1px black lines -- no variable stroke widths on fret wires, no decorative inlays, no wood-tone background. Strings are drawn at their real gauge ratios but in pure black at 80% opacity, with the lightest strings at 0.5px and the heaviest at 2.5px. The contrast between string thicknesses IS the decoration -- the eye can feel the difference between the wound low E and the wire-thin high E, and no other embellishment is needed.

Note labels are typeset in Lora (the serif font already in the design system but currently unused in the Shed) at 8px for scale tones and 10px bold for the root. There are no circles around the notes. The note letter sits directly at the string/fret intersection point, baseline-aligned to the string. Sharps and flats use proper Unicode typographic characters -- the real sharp sign (U+266F) and flat sign (U+266D), not the ASCII `#` and `b` that every guitar app lazily defaults to. The fretboard looks like music notation projected onto a grid.

Below the fretboard, scale information is laid out in a strict typographic grid with generous vertical rhythm. The scale name is set in Lora italic at 18px. The step formula uses proper en-dash separators (2--2--1--2--2--2--1, not 2-2-1-2-2-2-1). Diatonic chords are arranged in a single horizontal line, each chord name in Lora bold with the Roman numeral above it in 8px letterspaced small-caps -- like a figured bass line in a Baroque score.

The one concession to color: the root note and all its octave instances across the fretboard are rendered in `water-4` blue. Everything else is black/gray. This single blue thread running through the monochrome diagram is more visually striking than a rainbow of interval colors would be -- because constraint creates emphasis. Your eye is drawn to the blue notes like a bright thread in a tapestry.

CAGED positions are rendered as separate mini-fretboards in a row, each one inside a thin 0.5px black border with generous 8px internal padding and 12px between cards. The position name is set above in 7px letterspaced small-caps (`font-variant-caps: all-small-caps`). They look like individual plates in an engraving folio.

Chord diagrams in Quick Ref get the same treatment: pure black lines at consistent 0.5px weight, solid black circles for finger positions (no blue fills), finger numbers (1-4) reversed out in white inside the black dots, and X/O indicators rendered in proper typographic weight matching the body text. These look like the chord diagrams in a Hal Leonard songbook -- because those diagrams have had 50 years of iterative refinement by actual publishers who know what works on paper, and it turns out the answer is: black dots, thin lines, clear numbers.

The entire section sits on a white background card with no visible border, no box-shadow, no backdrop-filter -- just a 32px margin of white space on all sides acting as the "mat" of the framed print. In dark mode, it inverts to cream-on-charcoal (`#F5F0E8` text on `#1A1715` background), like an etching printed on dark archival paper.

#### Rendering Techniques

- **Zero-decoration fretboard**: All strokes in `#1A1715` (the `text` color variable), no `<rect>` background fill, no inlay marker circles
- **Real gauge string ratios**: `strokeWidth` array `[0.5, 0.65, 0.85, 1.3, 1.8, 2.3]` in pure `text` color at 80% opacity -- six distinct line weights, no other differentiation
- **Typographic note labels**: `<text>` elements in `fontFamily="Lora, Georgia, serif"`, no enclosing `<circle>` or `<rect>`, with Unicode sharp U+266F and flat U+266D replacing ASCII approximations
- **Monochrome + one blue**: Only `water-4` (#2563EB) for root notes; every other element uses `text` / `text-2` / `text-3` from the existing palette
- **En-dash formula**: Step pattern uses `\u2013` (en-dash) between numbers, set in the system monospace font at 11px with `letter-spacing: 0.08em`
- **Engraving borders**: 0.5px `stroke` in `text` color on CAGED position cards, `borderRadius: 0` (sharp corners), 8px internal padding
- **White space as design**: 32px padding on the section container, `background: white` (light mode) / `background: #1A1715` (dark mode), no `backdrop-filter`, no `box-shadow`, no `border`
- **Figured bass layout**: Roman numerals in `fontVariantCaps: "all-small-caps"` at 8px above chord names in `fontFamily: "Lora"` at 14px bold, horizontal arrangement with 16px gap
- **Dark mode inversion**: CSS class swap -- background `#1A1715`, all text `#F5F0E8`, string strokes `#F5F0E8` at 60% opacity, blue accent unchanged at `water-4`

#### River Metaphor Connection

"The Still Bank" -- the solid ground at the river's edge. The river (the app's Liquid Glass system) flows past, but the bank is stone and earth and permanence. The Engraver's Proof stands in deliberate contrast to the flowing, blurred, glowing aesthetic of the rest of the app. It is the stable reference point. When the river is moving fast and everything is fluid, you need solid ground to stand on. The Still Bank is that ground. The contrast between the frosted-glass navigation chrome and the stark black-on-white reference content would actually *strengthen* both aesthetics by giving each a counterpoint.

#### What Makes It Unique

It bets that restraint is more impressive than spectacle. Every other proposal adds visual complexity -- gradients, filters, animations, color systems. This one subtracts and subtracts until only precision remains. The single blue accent on a monochrome field is more eye-catching than a full spectrum would be. The serif typography gives it a timelessness that frosted glass cannot match -- glass trends come and go, but Baskerville and Bodoni and Lora never go out of style. It is the proposal that would look best literally printed and framed on the wall of a recording studio. And if someone says "but it does not match the Liquid Glass design system" -- correct. That is the point. It is the still bank beside the flowing river. Solid ground needs to look like solid ground.

(Bonus comedy moment: the dark mode version looks so much like a premium vinyl inner sleeve that someone will inevitably try to screen-print it on a T-shirt. Ship the SVG export button. Sell merch. Fund the app. The first band to frame a screenshot of their scale diagram and hang it backstage is the moment you know you won.)

---

### Summary Matrix

| # | Name | Section Name | Risk Level | Core Bet | Key SVG Technique |
|---|------|-------------|------------|----------|-------------------|
| 1 | The Luthier's Blueprint | The Shallows | Low | Material realism sells | Proportional fret spacing + string gradients |
| 2 | The Stained Glass Neck | The Depths | Medium | Color = meaning | Semantic interval color system across all views |
| 3 | The Cartographer's Neck | The Map Room | Medium | Patterns are terrain | Contour lines + compass rose Circle of Fifths |
| 4 | The Resonance Chamber | The Echo Pool | **HIGH** | Scales are shapes | Circular mandala polygon + Web Audio |
| 5 | The Engraver's Proof | The Still Bank | Low | Restraint beats spectacle | Monochrome + serif type + one blue accent |

### Author's Ranking (Honest)

1. **Ship first**: Proposal 2 (Stained Glass) -- the semantic color system has the highest long-term compound value. Once a user learns that amber = major 3rd, they see it everywhere, across every key, every scale, every chord card. That is a visual vocabulary that grows with the player.
2. **Biggest wow**: Proposal 4 (Resonance Chamber) -- risky but genuinely novel. The drunk Blues hexagon alone earns the price of admission.
3. **Most professional**: Proposal 1 (Blueprint) -- the proportional fret spacing fix is worth stealing regardless of which proposal wins. It should be ported into every other proposal.
4. **Best taste**: Proposal 5 (Engraver's Proof) -- the T-shirt test is real. If your SVG diagram looks good on a T-shirt, it looks good everywhere.
5. **Most underrated**: Proposal 3 (Cartographer) -- the compass rose Circle of Fifths is quietly brilliant and the contour-line concept could genuinely change how beginners learn to navigate the neck.

### Recommended Hybrid

Take the proportional fret spacing from Proposal 1. Take the semantic color system from Proposal 2. Take the compass rose Circle of Fifths from Proposal 3. Take the typographic discipline (Lora serif for labels, Unicode sharps/flats, en-dash formulas) from Proposal 5. The result is a fretboard with anatomically correct proportions, meaningful interval colors, cartographic navigation tools, and typographic clarity. Call the section "The Shallows" because the metaphor is perfect: the shallows are where you can see the riverbed clearly, where every stone is visible, where you learn to read the water before you wade in deep.

Keep the Resonance Chamber mandala as a hidden Easter egg -- triple-tap the scale name to toggle into "Echo Pool" mode. The 40% of users who are confused never see it. The 60% who get it will tell everyone they know.
