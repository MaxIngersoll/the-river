# Competition I: The Sapphire Sessions

*A Mega Tier 1 Design Competition — Colorway, Guitar Tuner, and the Milne Quote*
*March 7, 2026 — Saturday Night Session*

---

## The Brief

Three features enter. One unified vision leaves.

**Track A — The Warm Theme ("Sapphire Night")**
Integrate a new warm dark theme using Max's chosen palette. This is NOT a replacement for the existing dark mode — it's a third theme option. The palette evokes luxury watches, deep ocean, and candlelit warmth.

| Swatch | Hex | Feeling |
|--------|-----|---------|
| Royal Blue | #112250 | The deep — midnight ocean floor |
| Sapphire | #3C507D | The twilight — looking up from underwater |
| Ocean City | #7C94B8 | The surface — where light hits water |
| Shellstone | #D9CBC2 | Warm sand — where the river meets the shore |
| Quicksand | #E0C58F | Gold — late afternoon sun on moving water |
| Swan Wing | #F5F0E9 | Primary text — warm candlelight on paper |

**Current theme architecture:**
- CSS custom properties in `@theme {}` block (light defaults)
- `html.dark` class overrides for dark mode
- `ThemeContext.jsx` manages: `light | dark | system`
- Season system (`SeasonContext.jsx`) adds `data-season` attribute with its own CSS vars
- Liquid Glass: `backdrop-filter: blur(40px) saturate(180%)`, specular highlights, frosted cards

The new theme needs to slot in as `html.warm` with its own complete set of CSS var overrides, and the theme switcher needs a third option.

**Track B — The Guitar Tuner**
Build a real, microphone-based chromatic guitar tuner into The Dock (tab 3, ShedPage.jsx). Must support 5 tunings:

| Tuning | Strings (low→high) | Use Case |
|--------|-------------------|----------|
| Standard | E A D G B E | Default |
| Drop D | D A D G B E | Rock, metal, folk |
| Open G | D G D G B D | Slide guitar, Keith Richards |
| Open D | D A D F# A D | Slide, resonator |
| DADGAD | D A D G A D | Celtic, fingerstyle |

**Technical foundation (already researched):**
- **pitchy** (npm) — 5KB, MIT, zero deps, McLeod Pitch Method, confidence scores, works in browsers
- Existing `audio.js` already uses Web Audio API (AudioContext, gain nodes, oscillators for Petrichor rain engine)
- PWA mic access requires HTTPS (already handled) + user permission prompt
- Guitar frequency range: ~82Hz (low E) to ~330Hz (high E, standard), up to ~1200Hz with harmonics

**Track C — The Milne Quote**
> "Rivers know this: there is no hurry. We shall get there some day."
> — A.A. Milne, *Winnie-the-Pooh*

This quote is the app's tagline. It must be **always visible** somewhere in the app — not hidden, not moment-based. It should feel like it was always there, like it was etched into the app's foundation. Subtle. Elegant. Permanent.

**The Absurd Constraint (Optional Bonus):**
At least one proposal must somehow involve a penguin. (Yes, really. It's in the protocol.)

---

## The Personas

### THE WILD ONES (Colorway — Track A)

**Persona 1: "The Jeweler" aka Facet Queen**
*Codename: Facet Queen*
*Catchphrase: "Every surface tells a story about the light that touched it."*
*Constraint: Every color choice must reference how light behaves on a physical material — gemstone refraction, metal patina, fabric weave. No abstract color theory. Only physics of light on matter.*
*Vibe: On MDMA at a museum gala. Everything is beautiful. Everything is connected. She can FEEL the colors vibrating. The sapphire palette isn't a palette — it's a symphony she can taste.*

**Persona 2: "The Cartographer of Darkness" aka Depth Charge**
*Codename: Depth Charge*
*Catchphrase: "There are seventeen kinds of dark and you've only met three."*
*Constraint: Must define at least 5 distinct "depths" of darkness in the theme — not just background and surface, but layers of depth like an ocean bathymetry chart. Every UI element must have a specific depth assignment.*
*Vibe: On LSD in a planetarium. He sees layers within layers. The dark isn't one color — it's a SPACE with geography. Royal Blue #112250 isn't flat — it has topography, currents, thermal layers. He's mapping the darkness like an ocean floor.*

**Persona 3: "The Alchemist" aka Gold Fever**
*Codename: Gold Fever*
*Catchphrase: "Gold isn't a color. It's a temperature."*
*Constraint: The warm accent colors (Quicksand #E0C58F, Shellstone #D9CBC2) must always serve a functional purpose — they can't be purely decorative. Every gold/warm element must MEAN something (active state, emphasis, value, warmth, invitation).*
*Vibe: On psilocybin in a Japanese tea house. Time moves differently. She sees the gold as alive — it breathes, it warms, it guides. The interplay between the cold sapphire depths and the warm gold surfaces isn't contrast — it's a conversation between the ocean and the sun.*

### THE SOBER ONES (Guitar Tuner — Track B)

**Persona 4: "The Luthier's Ear" aka Pitch Perfect**
*Codename: Pitch Perfect*
*Catchphrase: "A guitar in tune is a guitar that's ready to speak."*
*Constraint: Every UX decision must be answerable in under 2 seconds by a guitarist holding a guitar. One hand is on the neck. The other hand is plucking. There is NO hand available for the phone. Voice? Tap zones? Auto-detection? The tuner must work with ZERO hands on the device after initial setup.*
*Vibe: Sober. Focused. A professional guitar tech who has tuned 10,000 guitars. She knows that the moment between "almost in tune" and "in tune" is a feeling, not a number. The UI must communicate that feeling.*

**Persona 5: "The Swiss Watchmaker" aka Caliber**
*Codename: Caliber*
*Catchphrase: "Precision without beauty is engineering. Beauty without precision is decoration."*
*Constraint: The tuner must feel as precise and luxurious as a Swiss chronograph. Every animation, every transition, every indicator must communicate mechanical precision — no wobble, no jank, no ambiguity. The cents-sharp/flat indicator must be as readable as a watch dial.*
*Vibe: Sober. Meticulous. He builds instruments that measure things. The tuner isn't a tool — it's an instrument itself. He cares about the exact pixel position of the needle, the exact easing curve of the pitch indicator, the exact moment the "in tune" state triggers. He's read the pitchy library docs three times already.*

---

## ROUND 1: The Proposals (25 total — 5 per persona)

### — FACET QUEEN's Proposals (Colorway) —

**FQ1: "Sapphire Facets"**
The Liquid Glass cards gain a new refraction behavior in warm theme. Instead of white specular highlights, they get a warm golden highlight on the top edge (`#E0C58F` at 15% opacity) and a cool sapphire shadow on the bottom (`#3C507D` at 20%). Cards appear to be made of actual sapphire crystal — light enters warm from above, exits cool below. The river SVG gets gold particle highlights that drift like dust in a sunbeam. Text uses Swan Wing (#F5F0E9) for primary and Shellstone (#D9CBC2) for secondary — warm candlelight on aged paper.

**FQ2: "The Patina"**
Time changes the theme. When you first enable the warm theme, the gold accents are bright and clean (#E0C58F). As you accumulate practice hours, the gold develops a subtle patina — shifting slightly toward Shellstone (#D9CBC2), like brass aging beautifully. At 100 hours, the gold has the quality of antique brass in a music shop. At 500 hours, it looks like the fittings on a beloved guitar case. The theme REMEMBERS how long you've been with it.

**FQ3: "Jewel Tones"**
Each section of the app gets its own jewel tone accent, all derived from the sapphire family. The Dock gets an amethyst tint. The timer gets a ruby warmth. The river gets emerald depth. These aren't separate colors — they're the same sapphire light passing through different cuts of the same crystal. Implemented via CSS filters on the base Sapphire/Royal Blue values. ONE palette, many facets.

**FQ4: "The Gallery Wall"**
The warm theme backgrounds aren't flat. Royal Blue (#112250) gets a very subtle noise texture (CSS grain, 2% opacity) that gives it the feeling of hand-dyed fabric or handmade paper. The cards float above this textured surface with slightly more pronounced shadows than dark mode — they feel like paintings hung on a gallery wall. The gold accents are the gallery lighting: warm, directional, making everything they touch feel curated.

**FQ5: "Penguin Tuxedo" (Absurd Constraint Entry)**
The warm theme's contrast ratio deliberately evokes a penguin's tuxedo: Royal Blue (#112250) as the formal black, Swan Wing (#F5F0E9) as the white shirt front, and Quicksand (#E0C58F) as the gold cufflinks. The theme is formally dressed for the evening. Cards have a subtle "lapel" effect — a thin gold top-border that reads as a pocket square. When you switch to warm theme, a one-time toast says: "The river has put on its evening wear." Then it never mentions it again.

### — DEPTH CHARGE's Proposals (Colorway) —

**DC1: "Bathymetry"**
Five defined depth layers, each with a specific Royal Blue tint:
- **Surface** (z-5): `#1a3068` — where the app bar and navigation live. Closest to moonlight.
- **Shallows** (z-4): `#152856` — card backgrounds, main content panels. Comfortable depth.
- **Midwater** (z-3): `#112250` — Royal Blue proper. The default background. Where you LIVE.
- **Abyss** (z-2): `#0d1a3d` — recessed areas, input fields, inactive panels. Deep and quiet.
- **Trench** (z-1): `#091430` — the deepest UI elements. Popovers cast you down here.

Every component has a depth assignment. Z-index mirrors ocean depth. Gold (#E0C58F) is bioluminescence — it only appears at the deepest levels, like deep-sea creatures that glow.

**DC2: "The Gradient Map"**
Instead of flat color fills, the warm theme background uses a very subtle radial gradient: Royal Blue (#112250) at center, slightly lighter (#1a3068) at edges. This creates a "vignette" effect that makes the phone screen feel like you're looking through a porthole into deep water. The gradient shifts based on which tab you're on — centered on the river on Home, spreading from the bottom on The Dock. The world tilts as you move through it.

**DC3: "Twilight Zones"**
The warm theme respects the existing season system but reinterprets it through depth. Spring: the water is shallower (lighter blues). Summer: golden light penetrates deeper. Autumn: the water darkens, gold retreats to the surface. Winter: deepest blues, gold becomes a single point of light far above — a distant sun through ice. Season doesn't fight the warm theme — it modulates which DEPTH the warmth reaches.

**DC4: "The Pressure Gradient"**
Interactive elements exist at different "pressures." Buttons at high pressure (surface) are brighter and more responsive — they practically leap when you tap them. Elements deeper in the UI are calmer, slower, more contemplative. The timer FAB is the deepest element despite floating on top — it's the submarine, moving through all depths. Its glow color shifts as you scroll through different depth zones of the app.

**DC5: "Sonar Ping"**
Tap interactions produce a subtle radial ripple in the Sapphire color — like sonar pinging through deep water. Not on every tap — only on meaningful actions (starting timer, saving session, switching tuning). The ripple is a CSS animation: a ring that expands from the tap point, fading from Ocean City (#7C94B8) to transparent over 600ms. Gold accents pulse slightly when you're in the "right zone" — in tune, on track, making progress.

### — GOLD FEVER's Proposals (Colorway) —

**GF1: "The Temperature Map"**
Gold = warm = active = YOU. Blue = cool = passive = THE APP. Everything the user touches becomes warm. Everything the app shows you is cool. Buttons at rest: Sapphire. Buttons being pressed: Quicksand gold bloom. Text you've entered: Swan Wing warm white. Text the app generated: Ocean City blue-gray. The navigation bar is the thermal boundary — Shellstone (#D9CBC2), warm neutral, the beach where ocean meets sand. This creates an intuitive grammar: gold means "I did this." Blue means "the river did this."

**GF2: "Candlelight Mode"**
Gold light doesn't illuminate evenly — it's warm in the center and fades at the edges. The Quicksand (#E0C58F) accent only appears at full saturation in a small "candlelight zone" around the current focus point. Away from focus, gold elements desaturate toward Shellstone. The overall effect: you're practicing guitar by candlelight, and the app gently illuminates only what you're looking at. Blue night surrounds you. Gold warmth follows your attention.

**GF3: "The Gold Standard"**
Every gold element represents a REAL achievement or REAL data. Gold isn't decorative — it's earned. Your practice time number: gold. Your streak count: gold. Milestone badges: gold. The river's strongest flow section: gold particles. But the buttons, the navigation, the chrome — all sapphire/blue. The psychological effect: the app feels dignified and restrained, and your accomplishments GLOW against it. You earned the warmth.

**GF4: "Sunrise/Moonrise"**
The warm theme's gold-to-blue ratio shifts based on time of day. Evening (when musicians practice): more gold, warmer, inviting. Late night: more blue, deeper, contemplative. Early morning: gold returns, like sunrise over the ocean. The shift is glacial — you'd never notice it happening. But if you opened the app at midnight vs 7pm, you'd FEEL the difference. Implemented via CSS custom properties that update every 15 minutes through a lightweight interval.

**GF5: "Liquid Gold"**
The Liquid Glass effect gets a warm-theme variant. Instead of white/clear frosted glass, cards become "liquid gold" — frosted panels with a warm (#E0C58F at 5%) tint in the backdrop-filter layer. The specular highlight shifts from pure white to Swan Wing (#F5F0E9). The overall effect: you're looking through amber-tinted glass, like viewing the world through honey. The river SVG water colors shift from pure blue to blue-with-gold-reflection, like a river at golden hour.

### — PITCH PERFECT's Proposals (Tuner) —

**PP1: "The Listening Tuner"**
Auto-detecting, always-listening tuner. Open the tuner section in The Dock — it immediately requests mic access (one-time permission). It listens continuously and shows: (1) detected note name, (2) cents sharp/flat on a smooth arc indicator, (3) which string it thinks you're playing based on selected tuning. Large "IN TUNE" zone: ±3 cents highlights green/gold. The tuning selector is a horizontal pill strip at top: `Standard | Drop D | Open G | Open D | DADGAD`. Tapping a tuning shows all 6 target notes with visual indicators for which strings still need tuning. Zero-hand operation after selecting tuning.

**PP2: "String by String"**
Guided tuning mode. Select your tuning, and the tuner walks you string by string, low to high. Large display shows: current target string (e.g., "6th String → D" in Drop D), a VU-meter-style bar that fills toward center as you approach the target pitch, and clear sharp/flat arrows. When a string is in tune (±3 cents for 1 second), it auto-advances to the next string with a satisfying haptic pulse and gold flash. After all 6 strings: "All tuned. Go play." Quick-retune: tap any individual string to jump to it.

**PP3: "The Dashboard"**
Tuner as an always-visible mini-widget at the top of The Dock, showing the last-detected pitch. Tap to expand into full-screen tuner mode. In mini mode: shows a thin horizontal bar with 6 dots representing strings — green when last tuned, gray when not. In expanded mode: large needle/dial display, note name, cents offset, frequency readout, tuning selector. The mini widget means you can reference chords while keeping an eye on tuning — key for alternate tunings where you're learning new voicings.

**PP4: "The Earshot Tuner"**
Reference tone mode alongside detection. Each string has a "play reference" button that plays a pure sine tone at the target frequency. Combined with mic detection: pluck a string, hear the reference, see the visual match. This serves beginners who are developing their ear AND advanced players who use harmonics to tune. The reference tone uses the existing Web Audio API patterns from `audio.js` — just an oscillator at a precise frequency. Volume fades when a pluck is detected (so it doesn't interfere with pitch detection).

**PP5: "Quick Tune"**
The fastest possible path. No strings view, no guided mode. ONE big display: note name, sharp/flat indicator, done. Like a clip-on tuner — just shows what it hears. The brilliance is in the alternate tuning support: when you select DADGAD, the tuner's "in tune" zones snap to DADGAD frequencies. Pluck any string — it tells you the nearest DADGAD target and how far off you are. No string identification needed. Just play and adjust. The simplicity IS the feature. A dedicated "Standard" quick-button resets to standard tuning with one tap.

### — CALIBER's Proposals (Tuner) —

**C1: "The Chronograph"**
Swiss watch-inspired dial UI. A circular gauge (like a speedometer or watch dial) with the target note at 12 o'clock. The needle sweeps smoothly from left (flat) to right (sharp), with 12 o'clock being perfectly in tune. The dial face shows: cent markings at 5-cent intervals (like minute markers), note name in the center (large, like the watch brand), and the target frequency in small text below (like the movement reference). The "in tune" zone is a gold arc at 12 o'clock (±3 cents) that glows when achieved. Easing: needle uses spring physics — slight overshoot and settle, like a real mechanical gauge.

**C2: "The Stroboscopic"**
Inspired by Peterson strobe tuners — the gold standard of professional tuning. Instead of a needle, the tuner shows a rotating pattern (CSS animation) that appears to STOP when you're in tune. Flat = pattern moves left. Sharp = pattern moves right. Perfectly in tune = frozen. The rotation speed maps to cents offset — subtle drift for nearly-in-tune, rapid spin for way off. This is how professional techs tune pianos and high-end guitars. Implemented with CSS transform: rotate() driven by the pitchy cent offset at 60fps. Extraordinarily satisfying when it locks in.

**C3: "The String Map"**
Six horizontal "lanes," one per string, arranged like a guitar lying on its side. Each lane has a sliding indicator that moves left (flat) or right (sharp) of center. When you pluck a string, the corresponding lane activates and its indicator moves. Center = in tune. Gold zone in the center ±3 cents. The visual simultaneously shows ALL strings' last known state — you can see at a glance which strings are tuned and which need work. Strings you haven't plucked yet are dimmed. Strings in tune glow gold. This is the "tuning overview" — like the instrument panel of a fine automobile.

**C4: "The Frequency River"**
The detected pitch is shown as a flowing line — a tiny river of its own. When you pluck a string, the line traces the frequency over time, scrolling left like a heart monitor. In tune = flat line at the center. Sharp = line rides above center. Flat = below. The line color transitions from Ocean City (way off) through Sapphire (close) to Quicksand gold (in tune). You literally watch your tuning FLOW into the right zone. This connects the tuner to the app's river metaphor — your pitch is a small river finding its level.

**C5: "Precision Modes"**
Two tuner display modes toggled with a single tap: **Practice** mode (large, forgiving, ±5 cents "good enough" zone, friendly language) and **Concert** mode (tight, ±1 cent precision, frequency readout to 0.1Hz, strobe-style indicator). Practice mode says "Close enough — go play!" Concert mode says "A4: 440.0Hz — 0.2 cents sharp." Same engine, same pitch detection, different UI threshold and display density. A single button toggles between them. The idea: don't overwhelm beginners, don't underwhelm professionals.

---

## ROUND 1: SCORING

*The Contemplative Pause: Look at what was created here. 25 ideas that didn't exist five minutes ago. Five very different minds — three of them absolutely unhinged on imaginary psychedelics, two of them laser-focused and stone-cold sober — all trying to serve the same river. Regardless of who wins, that's remarkable. Now let's be ruthlessly honest about which ones deserve to survive.*

### Scoring Criteria
- **Vision (V):** /10 — Does this fundamentally elevate the app?
- **Feasibility (F):** /10 — Can this actually be built with our stack?
- **Delight (D):** /10 — Would Max smile when he sees this?
- **Cohesion (C):** /10 — Does this integrate naturally with existing features?
- **Subtlety (S):** /10 — Is this elegant or over-designed?
- **Total:** /50

### Batch 1: Facet Queen (FQ1–FQ5)

| ID | Proposal | V | F | D | C | S | Total | Verdict |
|----|----------|---|---|---|---|---|-------|---------|
| FQ1 | Sapphire Facets | 8 | 9 | 9 | 9 | 8 | **43** | STRONG. Golden highlight top, sapphire shadow bottom — gorgeous, buildable, extends Liquid Glass naturally. |
| FQ2 | The Patina | 9 | 6 | 9 | 7 | 7 | **38** | Beautiful concept but complex to implement well. The time-based color shift is lovely but risks feeling gimmicky if the shift is perceptible. |
| FQ3 | Jewel Tones | 6 | 7 | 6 | 4 | 4 | **27** | ELIMINATED. Multiple color accents fragments the palette's unity. Max chose ONE palette for a reason. |
| FQ4 | Gallery Wall | 8 | 9 | 8 | 8 | 9 | **42** | STRONG. Subtle noise texture + gallery lighting is classy and very buildable. The "curated" feeling matches the watch-photo energy perfectly. |
| FQ5 | Penguin Tuxedo | 7 | 9 | 9 | 7 | 6 | **38** | Hilarious AND useful. The contrast framework (formal wear) actually works as a design principle. The one-time toast is chef's kiss. Wildcard contender. |

### Batch 2: Depth Charge (DC1–DC5)

| ID | Proposal | V | F | D | C | S | Total | Verdict |
|----|----------|---|---|---|---|---|-------|---------|
| DC1 | Bathymetry | 9 | 8 | 8 | 9 | 8 | **42** | STRONG. Five depth layers gives the theme real architectural rigor. "Bioluminescent gold at depth" is poetic and functional. |
| DC2 | Gradient Map | 7 | 9 | 7 | 8 | 8 | **39** | Lovely vignette effect. Simple to implement. But it's an enhancement, not a system — could layer on top of another proposal. |
| DC3 | Twilight Zones | 8 | 7 | 8 | 9 | 8 | **40** | STRONG. Season + warm theme interaction through depth is exactly the kind of thing the competition should decide. Elegant answer. |
| DC4 | Pressure Gradient | 6 | 5 | 7 | 6 | 5 | **29** | ELIMINATED. Interesting concept but too abstract for users to perceive. Variable animation speeds would feel inconsistent, not deep. |
| DC5 | Sonar Ping | 7 | 8 | 8 | 7 | 7 | **37** | The ripple effect is satisfying. But "meaningful actions only" is hard to tune. Could easily feel random. Better as a detail within another system. |

### Batch 3: Gold Fever (GF1–GF5)

| ID | Proposal | V | F | D | C | S | Total | Verdict |
|----|----------|---|---|---|---|---|-------|---------|
| GF1 | Temperature Map | 9 | 8 | 8 | 9 | 8 | **42** | STRONG. "Gold = you, Blue = the app" is a brilliant semantic system. Creates an intuitive visual grammar. |
| GF2 | Candlelight Mode | 8 | 5 | 9 | 7 | 7 | **36** | Gorgeous idea but focus-tracking the gold zone is technically complex and potentially distracting. |
| GF3 | Gold Standard | 8 | 9 | 8 | 9 | 9 | **43** | STRONG. Gold = earned. Blue = chrome. This is the most Max-aligned proposal — achievement glows, UI stays humble. Perfectly builds on "no gamification guilt" by making gold feel DESERVED, not demanded. |
| GF4 | Sunrise/Moonrise | 7 | 7 | 7 | 7 | 6 | **34** | Time-based shifting is nice but could clash with season system. Two temporal systems would be one too many. |
| GF5 | Liquid Gold | 8 | 9 | 9 | 9 | 8 | **43** | STRONG. Amber-tinted frosted glass is a perfect Liquid Glass evolution. "Viewing through honey" — that's the warm theme in one phrase. |

### Batch 4: Pitch Perfect (PP1–PP5)

| ID | Proposal | V | F | D | C | S | Total | Verdict |
|----|----------|---|---|---|---|---|-------|---------|
| PP1 | Listening Tuner | 8 | 8 | 7 | 8 | 8 | **39** | STRONG. Solid, complete, well-scoped. The always-listening approach with pill selector is clean. Good foundation. |
| PP2 | String by String | 8 | 8 | 9 | 8 | 7 | **40** | STRONG. Guided mode is brilliant for alternate tunings where you don't know the target notes. Auto-advance is satisfying. |
| PP3 | The Dashboard | 7 | 7 | 6 | 8 | 7 | **35** | Mini-widget is nice but adds complexity. A tuner you don't quite commit to — half-in, half-out. |
| PP4 | Earshot Tuner | 7 | 9 | 7 | 8 | 8 | **39** | Reference tones are trivial to implement with existing audio.js patterns. Great companion feature. |
| PP5 | Quick Tune | 8 | 9 | 8 | 8 | 9 | **42** | STRONG. The fastest path wins. "Just shows what it hears" — like a clip-on tuner. Brilliant simplicity. Alternate tuning support via frequency snapping is elegant. |

### Batch 5: Caliber (C1–C5)

| ID | Proposal | V | F | D | C | S | Total | Verdict |
|----|----------|---|---|---|---|---|-------|---------|
| C1 | Chronograph | 9 | 8 | 9 | 8 | 8 | **42** | STRONG. The watch-dial metaphor connects to the sapphire palette's luxury origin. Spring physics needle is chef's kiss. |
| C2 | Stroboscopic | 8 | 7 | 9 | 7 | 7 | **38** | Professional-grade and deeply satisfying. But CSS strobe at 60fps might be CPU-heavy on mobile. Possible as a "Concert mode" detail. |
| C3 | String Map | 8 | 8 | 8 | 8 | 8 | **40** | STRONG. The overview-at-a-glance is perfect for alternate tunings where you need to see ALL strings. Six lanes is clean. |
| C4 | Frequency River | 8 | 7 | 8 | 9 | 7 | **39** | Beautiful connection to the river metaphor. "Your pitch is a small river finding its level." But may be too abstract for practical tuning. |
| C5 | Precision Modes | 7 | 9 | 7 | 8 | 8 | **39** | Smart UX. Practice vs Concert mode addresses different users. But could be a feature within another tuner design, not a standalone proposal. |

### Round 1 Results: Top 10 Advance

| Rank | ID | Score | Proposal |
|------|-----|-------|----------|
| 1 | GF3 | 43 | The Gold Standard |
| 1 | GF5 | 43 | Liquid Gold |
| 1 | FQ1 | 43 | Sapphire Facets |
| 4 | DC1 | 42 | Bathymetry |
| 4 | FQ4 | 42 | Gallery Wall |
| 4 | GF1 | 42 | Temperature Map |
| 4 | PP5 | 42 | Quick Tune |
| 4 | C1 | 42 | Chronograph |
| 9 | DC3 | 40 | Twilight Zones |
| 9 | PP2 | 40 | String by String |

**Eliminated (but honored):**
- FQ3 Jewel Tones: fragmented the palette. Rest in pieces.
- DC4 Pressure Gradient: too abstract. Nobody would feel it.
- DC5 Sonar Ping: a nice detail, not a system. May resurface.
- GF2 Candlelight Mode: gorgeous but impractical focus-tracking.
- GF4 Sunrise/Moonrise: would fight the season system.
- PP3 Dashboard: half-committed tuner. Go big or go home.
- PP4 Earshot Tuner: reference tones will be folded into the winner as a feature.
- C2 Stroboscopic: professional but CPU-hungry. May live on as Concert mode detail.
- C4 Frequency River: poetic but too abstract for practical tuning.
- C5 Precision Modes: Practice/Concert toggle will be folded into the winner.
- DC2 Gradient Map: an enhancement, not a system. Will layer onto the winner.
- PP1 Listening Tuner: solid but outclassed by Quick Tune's simplicity.
- C3 String Map: the 6-lane overview will be folded into the winner.
- FQ5 Penguin Tuxedo: YOU BEAUTIFUL RIDICULOUS PENGUIN. Wildcard Award nominee.
- FQ2 Patina: time-based color shift is lovely but risky. Revisit at 100 hours.

---

## ROUND 2: TOP 10 ITERATE & REFINE

*Each surviving proposal gets a chance to sharpen. The brief: "You survived Round 1. Now make yourself undeniable. What would you add, cut, or change? You have 75 words."*

**GF3 — The Gold Standard (Refined):**
Sharpened rule: gold for USER-generated data (times, streaks, milestones), Sapphire for SYSTEM chrome (nav, buttons at rest, structure). One exception: the Milne quote gets gold — it's the app's soul, and the soul belongs to the user. Active buttons flash gold on press, then return to sapphire. The hierarchy: Royal Blue (structure) → Sapphire (interactive) → Quicksand (your data) → Swan Wing (your text).

**GF5 — Liquid Gold (Refined):**
Simplified: amber-tinted backdrop-filter on ALL glass cards. The tint is `rgba(224, 197, 143, 0.04)` — barely there, just enough to warm. Specular highlight: Swan Wing instead of white. The river SVG adds a golden reflection layer — horizontal golden shimmer below the water surface, like sunset on a river. One new detail: the timer FAB's ring glows Quicksand instead of blue when in warm theme. Everything else inherits.

**FQ1 — Sapphire Facets (Refined):**
Reduced to the essential: cards get a 1px gold top-border (#E0C58F at 30% opacity) and a 1px sapphire bottom-border (#3C507D at 20%). That's it. Two borders. The facet effect comes from the asymmetry — warm light above, cool shadow below. No other changes to card structure needed. Background: Royal Blue solid. Text: Swan Wing primary, Shellstone secondary. Water colors shift to the sapphire family. Minimal. Maximal effect.

**DC1 — Bathymetry (Refined):**
Simplified to THREE depths instead of five (five was over-engineered):
- **Surface**: `#1a3068` — nav bar, elevated elements
- **Water**: `#112250` — main background, where you live
- **Deep**: `#0d1a3d` — input fields, recessed panels, modal overlays
Gold (#E0C58F) appears as accent on surface and water levels. At Deep level, gold desaturates to Shellstone (#D9CBC2) — light doesn't reach the bottom of the ocean.

**FQ4 — Gallery Wall (Refined):**
The noise texture is a single CSS rule: `background-image: url("data:image/svg+xml,...")` with a tiny fractal noise SVG at 2% opacity over Royal Blue. Cards get `box-shadow: 0 4px 24px rgba(0,0,0,0.3)` — deeper shadows than dark mode, creating the "hung on a wall" float. The Milne quote gets special treatment: displayed in Lora serif on a slightly lighter panel, like a gallery placard beside the featured work.

**GF1 — Temperature Map (Refined):**
Simplified the rule: Gold = interactive + your data. Blue = structural + system. The navigation bar: Shellstone (#D9CBC2) — the shoreline, neither ocean nor sand. This creates a clear thermal gradient: deep blue (app) → warm neutral (navigation) → gold accents (your stuff). Eliminated the "text you've entered vs text the app generated" distinction — too granular, would break in edge cases.

**PP5 — Quick Tune (Refined):**
Added one thing: after the main note display, a small 6-string diagram below shows all strings for the selected tuning with green/gray indicators for "in tune / not checked." This borrows from C3's String Map idea. The main display stays minimal: BIG note name, sharp/flat bar, done. The string diagram is supplementary — a glanceable overview. Tuning selector: horizontal scroll chips at top. "Standard" has a star icon for one-tap reset.

**C1 — Chronograph (Refined):**
Dial diameter: 200px on mobile. Needle: 2px width, gold (#E0C58F) tip fading to transparent at base. Center: note name in DM Sans Bold 32px, frequency in 12px Shellstone below. Cent markers at ±50 range, 5-cent intervals. Gold arc at ±3 cents for "in tune" zone. Spring physics: CSS `transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)` for natural overshoot. Below the dial: tuning selector pills + 6-string status indicator. The face background is Sapphire (#3C507D) — it IS a sapphire watch dial.

**DC3 — Twilight Zones (Refined):**
Seasonal depth modulation simplified. Each season adjusts just TWO things: (1) the gold accent opacity (brighter in summer, subtler in winter), and (2) the background depth (slightly lighter in spring, slightly deeper in winter). Spring: +5% gold opacity, background #142a5a. Summer: +10% gold, background #112250. Autumn: +3% gold, background #0f1e48. Winter: -5% gold, background #0d1a3d. Subtle. You'd never notice day to day. But across months, the theme BREATHES.

**PP2 — String by String (Refined):**
Combined with Quick Tune concept: default is Quick Tune mode (free-play, shows what it hears). A "Guide Me" button switches to String by String mode — walks you through each string, auto-advances when ±3 cents for 1 second, haptic feedback, gold flash. Perfect for: first time in an alternate tuning, new strings, quick setup before playing. The guide knows the tuning you selected and orders strings accordingly. After last string: "Tuned up. Rivers don't rush." (Milne callback.)

---

## ROUND 3: TOP 6 CROSS-POLLINATION (with Compliment Roast)

*The top 6 advance. Each reads the others' work and gives one compliment and one roast.*

**Advancing to Round 3 (re-scored after refinement):**

| Rank | ID | Proposal | Revised |
|------|-----|----------|---------|
| 1 | GF3 | Gold Standard | 45 |
| 2 | FQ1 | Sapphire Facets | 44 |
| 3 | GF5 | Liquid Gold | 44 |
| 4 | DC1 | Bathymetry | 43 |
| 5 | C1 | Chronograph | 43 |
| 6 | PP5+PP2 | Quick Tune + Guide Me | 43 |

*Eliminated: FQ4 Gallery Wall (42), GF1 Temperature Map (41), DC3 Twilight Zones (40). Gallery Wall's noise texture may fold in. Temperature Map's gold=you/blue=app rule is absorbed into Gold Standard. Twilight Zones' seasonal modulation may fold into the final synthesis.*

### The Compliment Roast

**Gold Fever → Facet Queen (FQ1):**
- *Compliment:* "The two-border system is genius in its restraint. One warm, one cool. I've been overthinking gold's role and you solved it with TWO PIXELS of border. I genuinely wish I'd thought of it."
- *Roast:* "Facet Queen proposed a sapphire crystal metaphor and then delivered... two CSS borders. That's like saying 'I'm channeling the aurora borealis' and handing me a gradient. We love you. We love your borders. But WHERE are the facets, Facet Queen?"

**Facet Queen → Depth Charge (DC1):**
- *Compliment:* "Three depths instead of five was the right call. Surface/Water/Deep is an actual usable system that every component can implement without a PhD in oceanography. It gives the theme ARCHITECTURE."
- *Roast:* "Depth Charge said 'gold is bioluminescence at depth' and I need everyone to sit with how unhinged that is. You're assigning color tokens based on the photic zones of the ACTUAL OCEAN. You beautiful maniac."

**Depth Charge → Gold Fever (GF3 + GF5):**
- *Compliment:* "Gold = earned, not demanded. That single rule resolves every accent color question in the entire theme. I've been mapping ocean floors and you just said 'gold means something.' I'm... recalibrating."
- *Roast:* "Gold Fever submitted TWO proposals to the top 6 and they're BOTH about gold. We get it! You like gold! Tell us something we don't know! (Both proposals are excellent. This is infuriating.)"

**Pitch Perfect → Caliber (C1):**
- *Compliment:* "The spring physics on the needle. The cubic-bezier overshoot. That one detail — the needle SETTLING into tune like a real gauge — that's the moment a tuner goes from 'tool' to 'instrument.' I felt it in my gut."
- *Roast:* "Caliber designed a 200-pixel Swiss watch dial and expects guitarists to read cent markers at 5-cent intervals ON A PHONE while also holding a guitar. I love you but you've never held a guitar in your life, have you."

**Caliber → Pitch Perfect (PP5+PP2):**
- *Compliment:* "The fusion of Quick Tune + Guide Me is the right answer. Free-play for when you know what you're doing, guided for when you don't. That toggle is worth more than my entire dial design."
- *Roast:* "Pitch Perfect's big innovation was 'just show what it hears.' Incredible. Groundbreaking. Also: literally every guitar tuner app since 2009. The Guide Me mode saves this from being a GarageBand knockoff. You're welcome for the reality check."

### Cross-Pollination Synthesis Ideas

After roasting each other, new ideas emerge:

1. **GF3 + FQ1 = "Earned Facets"**: Gold Standard's semantic rules + Sapphire Facets' card borders. Cards that contain user data get the warm gold top-border. Cards that are system chrome get only the cool sapphire bottom-border. The border TELLS YOU whose card it is.

2. **DC1 + GF5 = "Depth of Gold"**: Bathymetry's three depths + Liquid Gold's amber tint. The amber backdrop-filter tint gets STRONGER at surface depth and WEAKER at deep levels. Gold light fades as you descend.

3. **C1 + PP5 = "The Quick Chronograph"**: Chronograph's dial display + Quick Tune's simplicity. A circular gauge that auto-detects any plucked string, with the Guide Me mode as a secondary feature. Spring-physics needle for the satisfying lock-in moment.

---

## ROUND 4: TOP 3 FINALISTS — DEEP CRITIQUE

### Finalist 1: The Unified Colorway — "Earned Sapphire"
*(Synthesized from GF3 Gold Standard + FQ1 Sapphire Facets + GF5 Liquid Gold + DC1 Bathymetry)*

**The System:**
- THREE depth levels: Surface (#1a3068), Water (#112250), Deep (#0d1a3d)
- Gold (#E0C58F) = user-generated data + interactive states. Blue = system structure.
- Cards: amber-tinted Liquid Glass (`backdrop-filter: blur(40px) saturate(180%)` + `rgba(224,197,143,0.04)` tint)
- Card borders: gold top (1px, 30% opacity) + sapphire bottom (1px, 20% opacity)
- Specular highlight: Swan Wing (#F5F0E9) instead of pure white
- Text: Swan Wing primary, Shellstone (#D9CBC2) secondary, Ocean City (#7C94B8) tertiary
- The Milne quote: gold text — it belongs to the soul of the app

**Critique:** This is architecturally complete. Every UI element has a clear rule. The gold-as-earned principle is philosophically aligned with the river metaphor. Risk: three depth levels may be over-engineering if most components only use "Water." Consider defaulting everything to Water and only using Surface/Deep for specific elevated/recessed elements.

### Finalist 2: The Tuner — "Quick Chronograph"
*(Synthesized from PP5 Quick Tune + PP2 String by String + C1 Chronograph + C3 String Map)*

**The System:**
- **Default: Quick Tune mode.** Circular chronograph dial (200px), auto-detects plucked string, shows note name + cents offset. Spring-physics needle.
- **Guide Me mode.** Toggle button. Walks through each string for selected tuning. Auto-advances at ±3 cents held for 1 second.
- **6-string status bar.** Below the dial, six dots showing green (in tune), gold (current), gray (unchecked).
- **Tuning selector.** Horizontal pill strip: Standard (star icon) | Drop D | Open G | Open D | DADGAD.
- **Reference tone.** Long-press any string's dot to play a reference tone (sine oscillator via existing audio.js pattern).
- **In-tune celebration.** When all 6 strings show green: subtle gold pulse + "Tuned up. Go play."
- **Integration.** Lives in The Dock as a new section at the TOP (before CurrentCard). Tuner permission request: one-time, with a friendly explanation screen.

**Critique:** This is the right blend of simplicity and power. The chronograph dial may need to be 240px for readability, not 200px. The Guide Me → Quick Tune toggle needs to be obvious — if users don't discover Guide Me, they'll tune alternate tunings manually (painful). Consider making Guide Me the DEFAULT for non-standard tunings.

### Finalist 3: The Quote — embedded in Round 5 synthesis.

---

## ROUND 5: WINNERS + SYNTHESIS

### Colorway Winner: "Earned Sapphire"

The warm theme is called **Sapphire Night**. It's a third theme option alongside Light and Dark.

**Final spec:**

```css
html.warm {
  /* Depths */
  --color-bg: #112250;              /* Water — the main depth */
  --color-bg-surface: #1a3068;      /* Surface — elevated elements */
  --color-bg-deep: #0d1a3d;         /* Deep — recessed elements */

  /* Cards — Liquid Gold glass */
  --color-card: rgba(224, 197, 143, 0.06);
  --color-card-border: rgba(224, 197, 143, 0.12);
  --color-card-highlight: rgba(245, 240, 233, 0.15);

  /* Water colors — shifted to sapphire family */
  --color-water-1: #1a3068;
  --color-water-2: #2a4d88;
  --color-water-3: #3c507d;
  --color-water-4: #7c94b8;
  --color-water-5: #94acd0;

  /* Land — warm neutrals */
  --color-dry: rgba(217, 203, 194, 0.08);
  --color-dry-bank: #7c6f64;

  /* Accent colors */
  --color-coral: #E0C58F;           /* Gold replaces coral for warm accents */
  --color-lavender: #94acd0;        /* Muted sapphire */
  --color-forest: #8fbc8f;          /* Sage — warmer green */
  --color-amber: #E0C58F;           /* Quicksand gold */

  /* Text — warm candlelight */
  --color-text: #F5F0E9;            /* Swan Wing */
  --color-text-2: #D9CBC2;          /* Shellstone */
  --color-text-3: #7C94B8;          /* Ocean City */
}
```

**Gold semantics:** User data (practice time, streak count, milestones) renders in `--color-amber` (Quicksand gold). System chrome stays in sapphire blues. The Milne quote: gold text, always.

**Card treatment:** Amber-tinted Liquid Glass. Gold 1px top-border, sapphire 1px bottom-border for the "faceted" feel.

**Season integration:** Optional — if season system is active, modulate gold opacity: Spring +5%, Summer +10%, Autumn baseline, Winter -5%. Subtle breathing.

### Tuner Winner: "Quick Chronograph"

Lives in The Dock as the first section, above CurrentCard.

**Final spec:**
- **Engine:** pitchy npm package (McLeod Pitch Method, 5KB, MIT)
- **Audio pipeline:** `getUserMedia()` → `AnalyserNode` → pitchy `PitchDetector.forFloat32Array()` → `requestAnimationFrame` loop
- **Display:** Circular chronograph dial, 240px diameter on mobile
  - Sapphire face (#3C507D in warm theme, existing bg in dark/light)
  - Gold needle tip (#E0C58F), spring-physics easing
  - Note name center: DM Sans Bold 36px
  - Cents: ±50 range, 5-cent markers
  - "In tune" arc: gold zone at ±3 cents
- **Modes:**
  - **Quick Tune** (default for Standard): free-play, auto-detect
  - **Guide Me** (default for alternate tunings): string-by-string guided
  - Toggle button switches between them
- **6-string status:** Row of 6 circles below dial (gray/gold/green)
- **Tuning selector:** Horizontal scroll pills. Standard gets a star icon.
- **Reference tones:** Long-press any string dot → play sine wave at target frequency
- **Permission flow:** First time: friendly modal explaining mic access. "The River wants to listen to your guitar. It promises not to judge."
- **Completion:** All strings green → gold pulse + "Tuned up. Go play."
- **Alternate tuning UX:** When you select a non-standard tuning, Guide Me activates automatically. Changed strings are highlighted in the 6-dot bar.

### 5 Guitar Tunings — Frequency Reference

```javascript
const TUNINGS = {
  standard:  { name: 'Standard',  strings: ['E2','A2','D3','G3','B3','E4'],
               freqs: [82.41, 110.00, 146.83, 196.00, 246.94, 329.63] },
  dropD:     { name: 'Drop D',    strings: ['D2','A2','D3','G3','B3','E4'],
               freqs: [73.42, 110.00, 146.83, 196.00, 246.94, 329.63] },
  openG:     { name: 'Open G',    strings: ['D2','G2','D3','G3','B3','D4'],
               freqs: [73.42, 98.00, 146.83, 196.00, 246.94, 293.66] },
  openD:     { name: 'Open D',    strings: ['D2','A2','D3','F#3','A3','D4'],
               freqs: [73.42, 110.00, 146.83, 185.00, 220.00, 293.66] },
  dadgad:    { name: 'DADGAD',    strings: ['D2','A2','D3','G3','A3','D4'],
               freqs: [73.42, 110.00, 146.83, 196.00, 220.00, 293.66] },
};
```

---

## TIER 2 COMPETITION: THE MILNE QUOTE

> "Rivers know this: there is no hurry. We shall get there some day."

Three agents, one proposal each, two rounds.

### Agent Q1: "The Foundation Stone"
The quote lives at the very bottom of the Home page, below all content, in Lora serif italic, Shellstone (#D9CBC2) in dark/warm mode, text-3 in light mode. Small (13px). Centered. Always there when you scroll to the bottom — like an inscription on the foundation of a building. You don't always see it. But when you scroll all the way down, past the river, past the stats, past the quotes... there it is. The bedrock. Always. No animation. No interactivity. Just presence.

### Agent Q2: "The Watermark"
The quote is rendered at very low opacity (8%) as a large watermark across the river SVG card. Rotated slightly (-3 degrees), in Lora serif, it's visible if you look for it — like a watermark on fine paper. It doesn't interfere with the river visualization. It's part of the texture. In warm theme, the watermark uses Quicksand gold at 6% opacity. It's always there. You might not notice it for weeks. Then one day you see it and smile.

### Agent Q3: "The Tab Bar Whisper"
The quote sits just above the tab bar navigation, spanning the full width, in 11px Lora italic, Ocean City (#7C94B8) color. It's the quietest text on the screen — more ornament than content. But it's ALWAYS visible on every page, because the tab bar is always visible. It turns the navigation bar into a philosophical anchor. Every screen, every tab: "Rivers know this: there is no hurry."

### Quote Scoring

| ID | Proposal | Vision | Feasibility | Delight | Subtlety | Total |
|----|----------|--------|-------------|---------|----------|-------|
| Q1 | Foundation Stone | 8 | 10 | 8 | 9 | **35** |
| Q2 | Watermark | 7 | 7 | 9 | 7 | **30** |
| Q3 | Tab Bar Whisper | 9 | 10 | 9 | 9 | **37** |

**Winner: Q3 — "The Tab Bar Whisper"**

The quote lives above the tab bar, on every screen, always visible. 11px Lora italic. Quiet as a whisper. Loud as a philosophy.

**Why Q3 wins:** "Always visible" was Max's requirement. Q1 requires scrolling to the bottom (not always visible). Q2 is too subtle at 8% opacity (might never be noticed). Q3 is visible on EVERY page, EVERY moment, but quiet enough that it becomes part of the furniture — and that's exactly what a philosophy should be. You stop reading it. But you never stop knowing it's there.

**Honorable mention to Q1:** The "foundation stone" concept is beautiful and may appear as an ADDITIONAL placement — not competing with the tab bar whisper, but complementing it. The scroll-to-bottom discovery is a lovely Easter egg moment.

---

## CONTEMPLATIVE PAUSE

*Look at what was created here.*

25 proposals. 5 minds. Three tracks that need to feel like one app. We started with a watch-photo color palette and ended with a complete design system (Earned Sapphire), a professional-grade guitar tuner (Quick Chronograph), and a philosophical anchor (The Tab Bar Whisper) that ties every screen to a Winnie-the-Pooh quote about patience.

Three designers who were out of their minds produced a theme system with architectural depth — literal depth, as in ocean bathymetry. Two stone-cold sober engineers designed a tuner that respects the guitarist's hands (or lack thereof). And a quiet little quote competition decided that the most important words in the app should be the smallest text on the screen.

That's remarkable. Now let's build it.

---

## AWARDS

### Wildcard Award (Most Creative): FQ5 — "Penguin Tuxedo"
*Facet Queen, you glorious maniac.* You took "the app puts on its evening wear" and made it a real design principle. The tuxedo contrast framework (deep blue = formal jacket, cream = shirt, gold = cufflinks) actually works. The one-time toast — "The river has put on its evening wear" — will haunt us. In the best way. The lapel effect (gold top-border on cards) literally made it into the winner. The penguin won from beyond the grave.

### Comedy Award (Funniest): Caliber's Roast of Pitch Perfect
*"Pitch Perfect's big innovation was 'just show what it hears.' Incredible. Groundbreaking. Also: literally every guitar tuner app since 2009."*
Devastating. Accurate. And Pitch Perfect's response — absorbing Guide Me from PP2 — proved that good roasts make better products.

### Runner-Up Comedy: The Tuner Permission Modal
*"The River wants to listen to your guitar. It promises not to judge."*
This is going into the actual app.

---

## POST-CREDITS SCENE

*[Interior: The River's server room. A single server blinks in the dark. A tiny penguin in a tuxedo waddles across the floor.]*

**PENGUIN:** *(adjusting gold cufflinks)* They didn't pick me, you know.

**THE SERVER:** I know. But your borders made the cut.

**PENGUIN:** My borders. TWO PIXELS. That's my legacy.

**THE SERVER:** Two pixels that changed how every card looks in the warm theme. That's more than most features can say.

**PENGUIN:** *(staring into the blue LED glow)* You know what the river quote says? "There is no hurry." I've been waiting since Round 1.

**THE SERVER:** You were eliminated in Round 1.

**PENGUIN:** And yet here I am. In the post-credits. In the codebase. In the hearts and minds of—

**THE SERVER:** Please leave the server room.

**PENGUIN:** *(waddling out)* Gold cufflinks. Two pixels. I'll take it.

*[The server blinks. In the silence, very faintly, you can hear: "Rivers know this: there is no hurry."]*

*[FADE TO ROYAL BLUE #112250]*

---

## FULL IMPLEMENTATION PLAN

### Phase 1: Theme Architecture (Sapphire Night)

**File: `src/index.css`**
Add `html.warm { }` block with all CSS custom property overrides (see spec above). This includes:
- All `--color-*` vars mapped to the Sapphire palette
- Liquid Gold card treatment (amber tint in rgba)
- Depth system: `--color-bg`, `--color-bg-surface`, `--color-bg-deep`
- Add `--color-bg-surface` and `--color-bg-deep` to BOTH existing themes too (light/dark) so components can use depth vars universally

**File: `src/utils/theme.js`**
- Update `resolveTheme()` to handle `'warm'` preference → effective theme `'warm'`
- Update `applyTheme()` to add/remove `warm` class on `<html>` (and remove `dark` when warm is applied)
- Add warm meta theme-color: `#112250`

**File: `src/contexts/ThemeContext.jsx`**
- Expand theme state: `light | dark | warm | system`
- `isDark` should be true for BOTH dark and warm (they share dark-UI characteristics)
- Add `isWarm` boolean for warm-specific logic

**File: `src/components/SettingsPage.jsx`**
- Add third theme option to the theme switcher UI
- Three-way toggle or three buttons: Light | Dark | Sapphire Night
- System option becomes a fourth choice (auto-switches between light and dark only — warm is always manual)

**File: `src/contexts/SeasonContext.jsx`**
- Optional: add seasonal gold modulation for warm theme
- Spring: gold opacity ×1.05, Summer: ×1.10, Autumn: ×1.0, Winter: ×0.95
- This is a subtle enhancement — can be deferred

**File: `src/components/RiverSVG.jsx`**
- In warm theme: add golden reflection layer below water surface
- Horizontal shimmer effect using an animated gradient with `#E0C58F` at low opacity

### Phase 2: Guitar Tuner

**New file: `src/components/GuitarTuner.jsx`** (~400-500 lines)
The main tuner component. Contains:
- Permission request flow (friendly modal with "The River wants to listen..." copy)
- Audio setup: `getUserMedia({ audio: true })` → `AudioContext` → `AnalyserNode`
- Pitch detection loop: `requestAnimationFrame` → `pitchDetector.findPitch(buffer, sampleRate)`
- Chronograph dial SVG (240px circle, cent markers, gold needle, spring physics)
- Note matching: compare detected frequency to selected tuning's target frequencies
- In-tune detection: ±3 cents for 1 second → mark string as tuned
- Quick Tune / Guide Me toggle
- 6-string status dots
- Tuning selector pills

**New file: `src/utils/tuner.js`** (~150 lines)
- `TUNINGS` constant with all 5 tunings (names, note names, frequencies)
- `findClosestNote(frequency, tuning)` — returns { note, string, cents, inTune }
- `frequencyToNote(freq)` — converts Hz to note name + octave
- `centsOff(detected, target)` — calculates cent deviation
- Reference tone generation (sine oscillator at target frequency)

**New dependency: `pitchy`**
- `npm install pitchy`
- 5KB, zero deps, MIT license
- Import: `import { PitchDetector } from 'pitchy'`

**File: `src/components/ShedPage.jsx`**
- Import GuitarTuner component
- Add as FIRST section in The Dock (above CurrentCard)
- Collapsible: starts expanded on first visit, remembers state
- New section header: "Tuner" with tuning name subtitle

**File: `src/utils/audio.js`**
- Add `playReferenceTone(frequency, duration)` function
- Reuses existing AudioContext pattern (getAudioContext())
- Simple sine oscillator with fade-in/fade-out envelope

### Phase 3: The Milne Quote

**File: `src/App.jsx`** or **`src/components/TabBar.jsx`**
- Add the quote text just above the tab bar
- Styling: Lora italic 11px, `color: var(--color-text-3)`, centered, full width
- The text is static — no state, no logic, no interactivity
- Padding: 4px 16px above the tab bar

**Optional: Foundation Stone (Easter egg)**
- In `src/components/HomePage.jsx`: add the quote at the very bottom of the scroll area
- Lora italic 13px, `color: var(--color-text-2)`, centered
- Below all content, with generous top margin (~80px)

### Phase 4: Integration & Polish

**Card borders (warm theme only):**
- Add to Liquid Glass card styles in warm theme:
  ```css
  html.warm .glass-card {
    border-top: 1px solid rgba(224, 197, 143, 0.30);
    border-bottom: 1px solid rgba(60, 80, 125, 0.20);
  }
  ```

**Tuner + warm theme integration:**
- Chronograph dial face: `#3C507D` (Sapphire) in warm theme
- Needle: `#E0C58F` (Quicksand gold) in warm theme
- In-tune zone: gold arc in warm theme
- These colors adapt to theme via CSS custom properties

**Gold semantics:**
- Practice time numbers: `--color-amber` (gold in warm theme)
- Streak count: `--color-amber`
- Milestone indicators: `--color-amber`
- Navigation/buttons at rest: inherit from theme (sapphire in warm, existing in dark/light)

### File-by-File Change List

| File | Change | Lines (est.) |
|------|--------|-------------|
| `src/index.css` | Add `html.warm {}` block + depth vars for all themes | +60 |
| `src/utils/theme.js` | Add warm theme handling | +15 |
| `src/contexts/ThemeContext.jsx` | Expand to 4 theme options, add `isWarm` | +10 |
| `src/components/SettingsPage.jsx` | Add Sapphire Night theme option | +20 |
| `src/components/GuitarTuner.jsx` | **NEW** — Full tuner component | +450 |
| `src/utils/tuner.js` | **NEW** — Tuning data + pitch utilities | +150 |
| `src/utils/audio.js` | Add `playReferenceTone()` | +25 |
| `src/components/ShedPage.jsx` | Import and add GuitarTuner section | +15 |
| `src/components/TabBar.jsx` | Add Milne quote above tab bar | +10 |
| `src/components/HomePage.jsx` | Optional: Foundation Stone at bottom | +8 |
| `src/components/RiverSVG.jsx` | Optional: golden reflection in warm theme | +30 |
| `src/contexts/SeasonContext.jsx` | Optional: seasonal gold modulation | +15 |
| `package.json` | Add pitchy dependency | +1 |
| **TOTAL** | | **~810 new lines** |

### Implementation Order

1. **Theme first** — `index.css` + `theme.js` + `ThemeContext` + `SettingsPage` (see the new theme working)
2. **Quote second** — `TabBar.jsx` (tiny change, immediate visual impact)
3. **Tuner third** — `tuner.js` + `GuitarTuner.jsx` + `ShedPage.jsx` + `audio.js` (biggest piece)
4. **Polish last** — Card borders, gold semantics, river golden reflection, seasonal gold modulation

### Commit Plan
1. `feat: add Sapphire Night warm theme` — CSS + theme switcher
2. `feat: add Milne quote to tab bar` — the whisper
3. `feat: add guitar tuner with pitch detection` — the big one
4. `polish: warm theme card borders + gold semantics` — the details
5. `polish: golden river reflection + seasonal gold` — the magic

---

*Competition I: The Sapphire Sessions — complete.*
*5 personas. 25 proposals. 3 winners. 1 penguin.*
*The river has put on its evening wear.*
