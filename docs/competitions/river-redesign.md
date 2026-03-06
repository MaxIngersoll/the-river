# Competition D: The Living River — In-App River Redesign

> The river should stop being a data visualization and start being a living part of the app.

---

## The Brief

The River app's centerpiece — the actual river visualization — currently feels like a standard data chart with a wavy shape. It shows practice minutes per day as varying widths on a blue path. It works, but it doesn't capture what the river SHOULD be: a living, breathing representation of your practice journey that's deeply integrated into every part of the app.

### Current Implementation (`src/components/RiverSVG.jsx`)
- Catmull-Rom spline path computed from daily practice minutes
- Width maps to practice volume via `getWaterWidth()` function
- Color maps to total hours (11-step color palette, light/dark variants)
- Seeded random jitter for organic variation
- Day labels on each segment
- Tap to expand a day's sessions
- Appears only on the Stats ("River") tab

### Current Problems
1. **It's just a chart** — Wider = more practice. That's the whole story. No depth, no life, no surprise.
2. **Static** — No animation, no movement, no response to interaction. A real river is never still.
3. **Isolated** — Only appears on one tab. The river should be a persistent presence throughout the app.
4. **No emotional register** — Streaks, milestones, rest days, comebacks — they all look the same. Just wider or narrower.
5. **No ambient life** — No particles, no shimmer, no current, no ripples. It's a colored shape, not water.
6. **Doesn't respond to practice** — When you complete a session, nothing happens to the river in real-time.

### Ideas From WS1 Pitch Deck Competition
These concepts were developed for the pitch deck river and could transfer to the app:

1. **Soul line breathing** — A bright core path that pulses with a slow breath, creating a sense of life
2. **Scroll-velocity turbulence** — Interaction speed affects the river's turbulence level
3. **Accumulation richness** — More practice = more visual complexity (particles, detail, sediment), not just wider
4. **Emotional color mapping** — Different states map to different river characters
5. **The settling metaphor** — When idle, the river calms. Pauses feel meaningful, not empty.
6. **Ink wash accumulation** — Brushstrokes persist and build up, creating visual history

### Technical Context
- React 19 component with SVG rendering
- Light and dark mode color palettes
- Session data from localStorage
- Web Audio API engine available (metronome + rain)
- Must work on mobile (375px viewport)
- Currently ~300 lines including the tooltip/expand logic

### What We Want
The river should:
- Feel ALIVE — motion, particles, breathing, shimmer
- Tell a STORY — streaks glow, rest days are calm, comebacks surge
- Be PRESENT — visible elements throughout the app, not just one tab
- RESPOND — completing a session should visibly affect the river
- Be BEAUTIFUL — something you'd screenshot and share

---

## Constraint-Based Personas

### The Hydrologist
**Constraint:** Must use real fluid dynamics principles adapted for UI. The river's behavior should be physically plausible — laminar flow in calm sections, turbulence at high volume, eddies at transitions, sediment accumulation over time. The motion must feel like WATER, not like an animation. Study how real rivers behave and translate that into SVG/Canvas rendering.

### The Ambient Artist
**Constraint:** The river must create an emotional atmosphere, not just display data. Think: the app should feel different when you have a 30-day streak vs when you're returning after a week off. The river's ambient qualities (particle density, color temperature, luminosity, movement speed) should set the emotional tone of the entire app. The river is a mood, not a chart.

### The Integrator
**Constraint:** The river must escape the Stats tab and become part of the whole app. How does the river appear on the Home page? During the timer? In the reference section? When logging? The river should be a persistent ambient layer — like weather in a video game — that ties the entire experience together. It should never feel bolted on to a single page.

---

## Evaluation Criteria (50 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Emotional Impact | 12 | Does the river make you FEEL something about your practice? |
| Technical Ambition | 10 | Does the rendering approach push what's possible in a PWA? |
| App Integration | 10 | Does the river exist beyond a single tab? |
| Visual Beauty | 8 | Would you screenshot this and share it? |
| Performance | 5 | 60fps on mobile? Battery-friendly? |
| Innovation | 5 | Any genuinely new ideas for practice visualization? |

---

## Special Awards

### The Wildcard Award — Most Creative Idea
### The Comedy Award — Funniest Moment

---

## Results

*To be filled during competition execution.*

---

## The Ambient Artist — Proposals

### Proposal 1: "Thermal Memory"

**Emotional Design Concept**

The river remembers your warmth. Every practice session deposits heat into the water, and that heat fades over time, exactly like a thermal footprint cooling on a surface you just touched. The river's color temperature is not a data mapping — it is a living record of how recently and how intensely you have been present.

When you are deep in a streak, the river glows with the warm oranges and soft whites of something alive and attended to, like embers in a fireplace or the warm end of a sunset. The center of the river runs hottest — a bright soul line that breathes in a slow 4-second cycle synchronized with a comfortable inhale-exhale rhythm. The edges cool to deeper blues and indigos. Particles drift upward like heat shimmer off summer pavement, and the whole thing radiates a gentle bloom filter that spills light onto the surrounding UI.

When you have been away, the heat drains out. The river cools through blues into near-grays. The soul line dims to a faint ember. Particles slow, then stop. The bloom filter contracts until the river emits no ambient light at all. It does not look broken or dead — it looks like a river in winter. Still. Patient. Waiting for a warm hand to return.

The critical emotional distinction: the river does not punish absence. A cold river is beautiful in its own way — austere, crystalline, still. But the moment you log a session after time away, the warmth floods back in a visible surge from the bottom of the river upward, like pouring hot water into a cold stream. The thermal bloom is immediate and visceral. You can literally see your practice warming the river back up.

Audio integration: the rain soundscape from `audio.js` shifts its filter frequencies to match the river temperature. Warm river = lower-frequency rain (cozy, close). Cold river = higher-frequency rain (crisp, distant). The brown noise LFO modulation depth increases with warmth, creating more organic movement in the sound. The app does not just look different at 30 days vs day 1 — it sounds different.

**Practice States**

- **Active streak (7+ days):** The river runs warm amber to soft white at center. Soul line breathes steadily. Heat shimmer particles rise lazily. Bloom filter casts a faint warm glow on the card edges around it. The rain audio runs warm and close. The entire home page feels like sitting by a fire.
- **Gap (3+ days off):** River cools progressively. Day 1 off: warm blues. Day 3: steel blue-gray. Day 7+: the river is a quiet silver thread, luminous but cold, like moonlight on water. No particles. Soul line barely visible. Rain audio (if on) shifts to a crisp, distant patter. The app feels like early morning before dawn — calm, expectant, not sad.
- **Milestone (100h, 365 days, etc.):** A thermal "bloom event" — the entire river flashes bright for a single breath cycle, and a ring of warmth expands outward from the river into the UI itself, briefly tinting the background. Particles burst upward in a shower, then settle. The bloom holds at elevated warmth for the rest of the day. The river remembers the milestone as a permanently warmer band at that point in its history.
- **Comeback (first session after 5+ days):** The signature moment. Cold river, then you log a session, and heat pours in from the bottom — a visible warm front traveling up the river. The soul line reignites. Particles start drifting. The bloom filter expands. It takes about 2 seconds. It should feel like lighting a match in a dark room. This is the emotional payoff for returning.

**Visual Techniques**

- **Color temperature mapping:** HSL-based temperature scale, not fixed palette steps. Continuous from cool (220deg hue, low saturation) to warm (30deg hue, high saturation). Temperature decays by ~15% per day without practice.
- **Soul line breathing:** A narrow (2-3px) bright path at the river's center, opacity oscillating on a 4-second sine wave. Brightness scales with temperature.
- **Heat shimmer particles:** Tiny (1-2px) circles with upward drift and slight horizontal wander. Spawn rate proportional to temperature. Each particle fades over 3-4 seconds. Rendered as SVG circles with a subtle glow filter. Capped at 30 particles for performance.
- **Thermal bloom:** CSS `box-shadow` on the river container that changes color and spread with temperature. Zero GPU cost. Spills warm/cool light onto adjacent UI elements.
- **Warm front animation:** On session log, a horizontal gradient mask sweeps up the river over 2 seconds, transitioning temperature. Uses CSS `clip-path` animation on a warm overlay layer.

**What Makes It Unique**

Most practice trackers use metaphors of growth — bigger, more, higher. Thermal Memory uses a metaphor of presence. The river does not grow when you practice; it warms. It does not shrink when you stop; it cools. This reframe changes the emotional relationship. Growth implies that absence is regression. Warmth implies that absence is simply distance — and return is always welcome, because you can warm anything back up. The thermal bloom on comeback is designed to be the single most satisfying moment in the app, rewarding return rather than punishing absence.

---

### Proposal 2: "The Breathing Dark"

**Emotional Design Concept**

Forget making the river brighter with more practice. Invert everything. The river lives in darkness, and practice gives it bioluminescence — the deep-ocean glow of creatures that make their own light.

In this design, the river's default state is a rich, velvety darkness. Not absence, not emptiness — the pregnant dark of deep water where anything could be living. The river shape itself is barely visible, defined more by the absence of the background texture than by its own color. It is a dark channel carved through the UI.

Practice adds light FROM WITHIN. Each session deposits luminous organisms into the water — tiny glowing particles in teals, magentas, and pale golds that drift with the current. A day with 60 minutes of practice does not make the river wider or bluer. It fills that segment of the river with dozens of softly pulsing light-points, each one fading over 3-5 days if not replenished. The river's story is not told by its shape but by its internal constellation of living lights.

Streaks create density. Seven days of practice and the river is thick with bioluminescence, casting light on its own banks, illuminating the date labels, creating an underwater aurora. Thirty days and it is almost too bright to look at — a river of liquid light.

Gaps let the organisms die off. The lights fade, one by one, over days. A week of absence and the river is dark again, but not empty — you can still see the faintest ghost-glow where the last organisms are fading, a visual memory of where your practice was. Return plants new lights against the old darkness, and the contrast is stunning: a single bright cluster in a dark river has more visual impact than a full bright river ever could.

The key insight: when everything is luminous, nothing stands out. But a single point of light in darkness is the most compelling thing the human eye can see.

**Practice States**

- **Active streak:** The river teems with light. Particles pulse asynchronously at different rates, creating a firefly-field effect. The glow is strong enough to cast light onto the UI around the river — a subtle radial gradient that makes nearby text slightly easier to read. The app feels alive, warm, underwater. Like being inside a living reef at night.
- **Gap:** Lights fade progressively. Day 1: organisms dim to 60% brightness. Day 3: 30%, and roughly half have winked out. Day 7: the river is nearly dark, with just a few faint stragglers pulsing slowly, like a dying heartbeat. The app feels quiet, deep, still. There is a melancholy beauty to it — like looking at stars going out.
- **Milestone:** A "bloom event" — bioluminescent organisms reproduce in a burst. For one session after a milestone, the river generates 3x the normal particles, and they are slightly larger and brighter. The effect is like a plankton bloom: the river erupts with light, then gradually settles back to its new, richer baseline. The milestone segment permanently retains a slightly elevated glow, marking it in the river's history.
- **Comeback:** The most dramatic state. You open the app after a week. The river is dark. You log a session. A single cluster of bright organisms appears at today's position — piercingly bright against the surrounding darkness. Over the next few seconds, they begin to drift and spread, slowly illuminating the river around them. It should feel like dropping a lantern into a dark well. The contrast is the whole point.

**Visual Techniques**

- **Bioluminescent particles:** SVG circles (2-4px) with a radial gradient fill (bright center, transparent edge). Each particle has its own pulse rate (random 2-6 second sine wave on opacity). Color randomly selected from a curated palette: `#4EEADB` (teal), `#E879F9` (magenta), `#FDE68A` (gold), `#67E8F9` (cyan). Spawn rate: ~5 particles per 15 minutes of practice. Each particle has a `birthDate` and fades over 5 days.
- **Dark river body:** The river shape filled with a near-black color (`#0A0F1A` in dark mode, `#1A1F2E` in light mode). A very subtle noise texture overlay (CSS background with a tiny repeating SVG pattern) gives it depth. The darkness is not flat; it has dimension.
- **Ambient light casting:** Each particle contributes to a composite `box-shadow` on the river container. Many particles = many overlapping soft glows = visible ambient light spilling outward. This is computed as a single averaged glow to keep GPU cost low.
- **Organism drift:** Particles move downward (with the current) at 0.5-1px per second, with slight horizontal oscillation. When they reach the end of the visible river, they loop back to the top. This creates a gentle downward flow that reads as water movement.
- **Ghost glow:** Particles below 10% opacity switch to a different rendering — a faint, fixed circle with no pulse and no drift. These "dead" organisms mark where practice used to be, like phosphorescence fading on a beach.

**What Makes It Unique**

This is the anti-dashboard. Every other practice app makes things brighter, bigger, more when you practice. The Breathing Dark says: your default state is beautiful darkness, and practice is the light you bring to it. This reframe has a philosophical weight — you are not filling a meter or growing a plant. You are carrying light into a dark river. And the light is alive, temporary, and must be renewed. It is the most honest metaphor for a practice habit: it glows when tended and fades when left, but the river itself — the capacity, the channel, the depth — is always there.

---

### Proposal 3: "Seasons of the River"

**Emotional Design Concept**

The river has weather, and your practice determines the climate.

This is not a color mapping. This is a full environmental simulation. The river exists within a landscape that shifts between four emotional seasons based on your recent practice patterns — and the transitions between them are the real magic.

**Spring** is for comeback and early momentum. You have been away, or you are just getting started, and the river shows it: pale greens and soft yellows in the water, small bubbles rising, the sense of snowmelt and new flow. The river is narrow but moving with purpose. Everything feels fresh, tender, fragile — the way early habit-building actually feels.

**Summer** is the streak zone. Seven or more consecutive days and the river enters summer: deep warm blues, broad and confident, dappled light patterns playing on the surface like sun through tree canopy. The current is strong and steady. Particles are abundant — pollen motes, light sparkles, tiny fish-flash reflections. The app feels abundant, generous, warm.

**Autumn** is the harvest — the milestone season. When you cross major thresholds (100 hours, 365 days, personal records), the river enters an autumn state: rich ambers, burnt oranges, and deep reds. The particles become leaf-like, drifting slowly downstream. The river is wide and deep and still — the fullness of a year's work made visible. There is a gravity to it, a sense of accumulated wealth. This season triggers automatically for one week after any major milestone.

**Winter** is rest. Not punishment, not failure — rest. When your practice drops off or you take intentional time away, the river cools into silvers and pale blues. The water stills. A subtle frost texture appears at the edges. Particles become rare, slow, crystalline. But here is the critical design decision: winter is gorgeous. It is the most screenshot-worthy season. The frost patterns are intricate. The stillness is meditative. A winter river says: this practice is dormant, not dead. The river is resting, not empty.

The transitions between seasons happen over 2-3 days and are the most visually rich moments. Spring-to-summer: the greens warm into blues over multiple sessions. Summer-to-autumn: the blues deepen into amber as a milestone approaches. Autumn-to-winter: the warm colors cool gradually, like watching a sunset in slow motion over days. Winter-to-spring: the first session after a long break introduces a single crack of green into the silver, like the first shoot through snow.

**Practice States**

- **Active streak:** Summer. Wide, warm, confident. Dappled light particles. Strong current animation. The app radiates abundance.
- **Gap:** Gradual seasonal shift. 2 days: late summer (slightly cooler). 5 days: autumn (amber tones begin). 8 days: late autumn (leaves falling). 12+ days: winter. Each phase is distinct and beautiful. The degradation is graceful, even appealing.
- **Milestone:** Forced autumn, regardless of current season. The river enters its harvest state for a week. If you were already in autumn, the colors intensify — deep burgundy, gold leaf particles, a regal stillness.
- **Comeback:** Winter-to-spring transition. The most emotionally charged moment. Silver river, frost at the edges, crystalline stillness — then a session logged, and a vein of green appears in the water, spreading like ink. Tiny bubbles begin. The frost recedes at the edges. Over the next 2-3 sessions, spring arrives fully. The metaphor is undeniable: spring always comes.

**Visual Techniques**

- **Seasonal palette system:** Four complete HSL palettes (water color, particle color, glow color, ambient light color) with interpolation functions for smooth transitions. Current season stored as a float (0.0 = deep winter, 0.25 = spring peak, 0.5 = summer peak, 0.75 = autumn peak). Interpolation happens at render time.
- **Dappled light (summer):** Overlapping SVG circles with `mix-blend-mode: overlay` and slow random movement. Creates the shifting light-through-leaves effect. 4-6 circles, large (20-40px radius), very low opacity (0.04-0.08).
- **Leaf particles (autumn):** SVG paths shaped like simple leaves (a single bezier curve, 5-8px). Drift downstream with a slight tumbling rotation. Warm palette. 10-15 active at peak autumn.
- **Frost texture (winter):** A procedurally generated SVG pattern of branching lines at the river edges. Uses a simple L-system: start at edge, branch at random angles, decrease length each generation. Rendered once per day-state, cached. Opacity fades as spring approaches.
- **Seasonal ambient light:** The `hero-glow` on the HomePage shifts color with the season. Summer: warm gold. Autumn: amber. Winter: cool silver. Spring: pale green. This extends the river's emotional atmosphere to the entire page without any additional component.

**What Makes It Unique**

Seasons are the only metaphor that makes rest genuinely beautiful. Every other approach treats non-practice as diminishment. Seasons say: winter is not a failure, it is part of the cycle. The frost patterns in winter are deliberately the most intricate and beautiful visual in the entire system. This means that a user who takes two weeks off opens the app to something stunning — not a guilt trip. And the winter-to-spring comeback is the most narratively satisfying transition: everyone knows what spring means after a long winter.

---

### Proposal 4: "Muscle Memory" (THE WILD ONE)

**Emotional Design Concept**

The river is not water. The river is a GUITAR STRING.

Throw away every assumption. The visualization is a single vibrating string that runs vertically through the app, and your practice determines how it vibrates. When you practice, the string is excited — it oscillates, hums, resonates. When you rest, it dampens, settling toward stillness. The "river" everyone has been designing is actually the world's most elaborate guitar string simulation, and the app has been hiding a musical instrument inside a data visualization this whole time.

The string's behavior is governed by actual wave physics. Practice adds energy. Each session is a pluck — a transverse wave injected at today's position that travels up and down the string, reflecting off the endpoints, interfering with previous waves. Frequent practice creates complex standing wave patterns. The visual result is a string that vibrates with your practice history encoded in its harmonics.

The width of the oscillation at any point corresponds to the practice volume on that day. But unlike the current static width, this width is alive — it oscillates, it breathes, it resonates with neighboring days. A day sandwiched between two heavy practice days vibrates more than a day surrounded by rest days, because the waves from adjacent days reinforce it. Practice energy literally propagates through your timeline.

The color of the string shifts with accumulated hours, exactly as the current river does. But the string also has harmonics rendered as faint parallel "ghost strings" — thinner, more transparent copies of the main string at 1/2 and 1/3 the amplitude. These harmonics appear only after sustained practice, like overtones appearing on a well-played string. A 30-day streak has rich, complex harmonics. A sporadic practice pattern has a simple, fundamental-only vibration.

When you first open the app after logging a session, a new pluck ripples through the string with a satisfying visual snap. The wave travels, bounces, interferes. You can literally see your session's energy joining the resonance pattern. The app's existing Web Audio engine (which already produces metronome clicks via oscillators and noise bursts) could be wired to produce a soft harmonic tone — the actual pitch of the string — that plays for a half-second when the pluck animation fires. Your practice data would have a sound. Let that sink in for a moment.

The absolute comedy moment: when your streak breaks, the string goes slack. Not gradually — it just drops. The tension goes out and the string hangs in a lazy catenary curve, limp and silent. Like a broken guitar string. It is simultaneously the most dramatic and the funniest possible streak-break animation. You would laugh, then you would immediately want to practice to tighten it back up. Motivation through slapstick.

**Practice States**

- **Active streak:** The string vibrates with complex harmonics. Multiple standing wave modes visible. Ghost strings shimmer alongside the fundamental. The visual is dense, musical, alive. The pluck-on-session-log sends a crisp transverse wave through the pattern. If the audio integration is enabled, the string hums at a pitch that rises with streak length — longer streaks literally sound higher. A 30-day streak rings like a high harmonic. A 3-day streak thrums at a low fundamental.
- **Gap:** The string dampens. Oscillation amplitude decays over days. Harmonics disappear first (day 2), leaving only the fundamental. The fundamental slows and shrinks (day 4-5). By day 7, the string is nearly still — a thin, quiet line. It still has tension (you can see it is taut), but it is at rest. Then, if the gap extends beyond 10 days... the slack event. The tension releases. The string droops. It is hilarious. It is devastating. It is unforgettable.
- **Milestone:** A resonance event. When you hit a milestone, all harmonics align briefly into a single, maximum-amplitude oscillation — every wave in phase, constructive interference everywhere. The string swells to its widest point across its entire length for one glorious cycle, then settles back into its normal complex vibration. If audio is enabled, this is a rich, bell-like chord. It is the visual equivalent of a guitar producing a perfect harmonic.
- **Comeback (after slack):** You log a session. The string tightens. It rises from its limp catenary back to taut in a spring-physics animation (overshoot, settle, overshoot, settle — roughly 1.5 seconds). Then the pluck hits. The first vibration on a freshly tightened string. It should feel like tuning a guitar — the satisfying moment when the pitch clicks into place and the string rings true.

**Visual Techniques**

- **Wave physics simulation:** A 1D wave equation solver running at 30fps. The string is discretized into segments (one per day). Each segment has position (x-offset from center) and velocity. Practice minutes set the initial displacement. A damping factor reduces amplitude over time. Adjacent segments are coupled by spring forces (tension). This is computationally trivial — it is 30 multiply-adds per frame for 30 segments.
- **Harmonic ghost strings:** Rendered as additional SVG paths offset from the main string, computed by filtering the wave data through bandpass filters at 2x and 3x the fundamental frequency. Or, simpler: render the same string at 0.5x and 0.33x amplitude with 0.15 opacity.
- **Pluck animation:** Inject a gaussian pulse at today's segment. The pulse propagates via the wave equation naturally. No special animation code needed — the physics does the work.
- **Slack catenary:** When streak breaks past threshold, disable the wave simulation and interpolate the string shape toward a catenary curve (cosh function). The transition from taut+vibrating to slack+hanging is a 0.8-second spring animation.
- **Audio integration:** Use the existing `audioCtx` and oscillator infrastructure from `audio.js`. On pluck, create a brief (0.5s) oscillator at a frequency mapped to streak length. Route through the existing `masterGain`. The sound is a single plucked tone — triangle wave with fast attack and exponential decay, exactly like the metronome click but at a musical pitch.

**What Makes It Unique**

This is the only proposal where the river is not water. It is a string. It is music. It bridges the gap between the practice being tracked and the visualization doing the tracking. You practice guitar, and your data lives inside a vibrating string. The metaphor is so apt it is almost too on-the-nose, but that is what makes it land. The slack-string moment when your streak breaks is genuinely funny, and the retightening-and-pluck comeback is genuinely satisfying. Nobody else is going to propose turning the river into a physics simulation of the instrument itself. That is the swing.

---

### Proposal 5: "Tidal Presence"

**Emotional Design Concept**

The river breathes with you, right now, in real time — not because of your data, but because of your presence. The river knows when you are looking at it.

This proposal starts from a radical observation: every other design derives the river's state from historical data. Streak length, practice minutes, milestones — all backward-looking. Tidal Presence adds a forward-looking dimension: the river responds to your current engagement with the app. It has tides that rise when you are present and recede when you leave.

When you open the app, the river begins a slow tidal rise. The water level (opacity, brightness, particle activity) increases over 10-15 seconds to its full data-driven state. It is as if the river knows you are watching and rises to greet you. When you navigate away from the river tab, the tide begins a slow recession — particles slow, brightness dims, the river settles. If you come back quickly, the tide catches and rises again. If you stay away, it recedes to a low-tide state: calm, minimal, conserving energy. (This also saves battery. The ambient artist is practical.)

On top of this tidal presence layer sits the historical data visualization. The river's "full tide" appearance is determined by your practice history — warm and rich during streaks, cool and spare during gaps, exactly as other proposals describe. But the tidal presence layer means you never see a static river. The river is always in motion between states, always responding to you.

The deepest emotional trick: the river rises faster when your data is strong. A 30-day streak and the river surges to full brightness in 5 seconds — eager, excited, like a dog greeting its owner at the door. A cold river after a long absence rises slowly, tentatively, over 20 seconds — shy, uncertain, hopeful. The rise speed itself communicates the relationship state. You do not need to read a number. You feel it in the timing.

During an active practice session (timer running), the river enters a special state: full tide, locked, with a subtle pulse synchronized to the metronome BPM if it is running. The river breathes with your practice tempo. If the rain ambient is on, the river's particle drift speed matches the LFO modulation rate in the rain audio. The audio and visual systems are coupled. The practice session becomes a full-sensory environment where sound and sight are unified around the river metaphor.

**Practice States**

- **Active streak:** Full tide rises fast (5 seconds). River is warm, bright, particle-rich. The speed of the greeting communicates "I know you, welcome back, we have momentum." The river feels eager.
- **Gap:** Full tide rises slowly (15-20 seconds). River at full tide is cooler, calmer, fewer particles. The slow rise communicates "It has been a while, but I am still here." The river feels patient. Not reproachful — patient. There is a significant emotional difference.
- **Milestone:** The tide rises to ABOVE normal full tide — a brief flood state where the river overflows its banks slightly (the glow expands, particles drift beyond the river's visual bounds, ambient light intensifies). This lasts for the first tide-rise after a milestone, then settles back. A high-water mark. The river is showing you what it is capable of when it is at its best.
- **Comeback:** The slowest, most deliberate tide rise. The river takes 25-30 seconds to reach full tide, but the full-tide state includes a warm thermal shift (borrowing from Proposal 1). The patience of the rise is the emotional content. The river waited for you. It rises slowly because the moment deserves to be savored, not rushed.

**Visual Techniques**

- **Tidal opacity system:** The river's base opacity interpolates from 0.3 (low tide) to 0.92 (full tide, matching current implementation). An `IntersectionObserver` on the river container detects visibility. A `requestAnimationFrame` loop drives the opacity toward target over time. Rise speed is a function of streak length: `riseSeconds = Math.max(5, 25 - streak * 0.7)`.
- **Particle activity scaling:** Particle spawn rate, drift speed, and max count all scale with the tidal level. At low tide: 0 active particles. At 50% tide: half the particles at half speed. At full tide: full particle system. This naturally creates the "river coming alive" feeling during the rise.
- **BPM-synchronized pulse:** During active timer, read `getMetronomeState().bpm` from the audio engine. If running, modulate the soul line opacity at `bpm / 60` Hz. The visual pulse matches the audible click. If the metronome is off, default to a calm 15bpm (4-second) cycle.
- **Rain-coupled drift:** If rain is running, read `getRainState()` and modulate particle drift speed with a slow oscillation matching the rain LFO rate (0.15 Hz). The particles surge and relax in time with the rain's organic variation. Audio and visual breathe together.
- **Visibility-based battery saving:** When the river is not visible (scrolled away, different tab), the tidal system reduces update rate to 1fps, then stops entirely after 5 seconds. On return to visibility, it resumes with a fresh tide-rise. This means the river animation is only running when the user can see it.

**What Makes It Unique**

Tidal Presence is the only proposal that makes the river respond to the present moment, not just the past. Every other design answers the question "What has your practice been?" This one also answers "Are you here right now?" That distinction matters because the most important moment in a practice app is not when the user has a 30-day streak. It is when the user opens the app today, right now, wondering whether to practice. The tidal rise is designed for that exact moment — a river that sees you arrive and responds. The slow, patient rise after a long absence is an act of emotional design that says more than any number or badge ever could: I was here the whole time. Welcome back.

The audio-visual coupling during practice sessions is the technical cherry on top. When the river pulses with your metronome and drifts with your rain, the Stats tab becomes an ambient environment, not a dashboard. You do not check your river. You sit with it.

---

## The Hydrologist -- Proposals

*Five proposals grounded in real fluid dynamics, translated into SVG/Canvas rendering for a 375px mobile PWA. The water must move like water.*

---

### Proposal 1: "The Reynolds River"

#### Fluid Dynamics Concept

Every fluid dynamicist knows the Reynolds number. It is the single most important dimensionless quantity in fluid mechanics: Re = (density x velocity x characteristic length) / viscosity. Below Re ~2300, flow is laminar -- smooth, parallel streamlines, predictable and elegant. Above Re ~4000, flow is fully turbulent -- chaotic, mixing, energy cascading from large eddies down to the Kolmogorov microscale. Between those thresholds lies the transition regime, where calm flow trips into chaos and snaps back unpredictably.

This proposal maps practice intensity directly to the Reynolds number. A 10-minute practice day produces laminar flow: smooth, glassy streamlines that slide past each other without mixing. The soul line is steady. Particles follow parallel tracks. A 90-minute practice day triggers turbulence: the streamlines break apart, vortices spin off the banks, and the velocity field becomes chaotic. The transition zone -- moderate practice days between 20 and 45 minutes -- is the most visually interesting. Flow hesitates between order and chaos. Streamlines wobble, occasionally spawning small eddies that get reabsorbed.

Critically, the Reynolds number also depends on the river's width (the characteristic length). So a wide, slow river can be just as turbulent as a narrow, fast one. This means that a user's cumulative practice history affects the character of the flow even on moderate days. A river that has grown wide from months of practice has inertia -- it does not go turbulent from a single big session the way a narrow beginner river does. This is physically correct and emotionally resonant: experienced practitioners have deeper, steadier flow.

The viscosity term maps to time-since-last-session. Fresh practice = low viscosity = flow moves easily. Days of rest = viscosity increases = the river thickens and slows. Coming back after a break means pushing through high viscosity -- the first session after a gap shows the river sluggish and reluctant, then loosening as flow re-establishes.

#### Rendering Technique

SVG streamline particles driven by `requestAnimationFrame`. The velocity field is computed analytically using a simplified 2D pipe-flow model (Poiseuille flow for laminar, randomized perturbations for turbulent). Each frame:

1. Compute Re from the current day's data.
2. If Re < 2300: particles follow parabolic velocity profile (fastest at center, zero at banks). Use SVG `<circle>` elements with smooth `transform` translations.
3. If Re > 4000: overlay an `<feTurbulence>` SVG filter on the river body with `baseFrequency` proportional to Re. Particles get random velocity perturbations drawn from a Gaussian distribution. Spawn eddy particles that spiral using `rotate()` transforms.
4. Transition regime: linearly interpolate between laminar and turbulent states. Occasionally "trip" a particle into a spiral, then relaminarize it.
5. The soul line (center highlight path) uses `stroke-dashoffset` animation at a rate proportional to the mean flow velocity.

For mobile performance: cap particle count at 40 for the full river view, 12 for the compact home view. Use `will-change: transform` and compositor-only properties. Particle positions are computed in a single `requestAnimationFrame` loop, DOM updates batched.

#### Practice Data Mapping

| Practice Property | Physical Property | Visual Effect |
|---|---|---|
| Daily minutes | Flow velocity | Particle speed, soul line animation rate |
| Daily minutes + river width | Reynolds number | Laminar vs turbulent character |
| Cumulative hours | Channel width + depth | River width, color depth |
| Time since last session | Viscosity | Flow sluggishness, particle drag |
| Streak length | Channel smoothness | Laminar regime extends to higher velocities (smoother banks = fewer trip points) |
| Session just completed | Sudden discharge event | Surge animation: width pulses outward, Re spikes, particles accelerate |

#### What Makes It Unique

This is the only proposal that uses a real, computable physical quantity (Reynolds number) as the governing parameter. It is not a metaphor -- it is a simplified simulation. The emergent behavior (laminar-to-turbulent transition) is not hand-animated; it falls out of the math. When a user sees their river go turbulent after a big session, that is the physics talking, not an `if` statement. The fact that experienced practitioners have stabler flow is not designed -- it is a consequence of the wider characteristic length in the Re formula. Physics doing the emotional heavy lifting.

---

### Proposal 2: "Meander"

#### Fluid Dynamics Concept

Real rivers do not flow in straight lines. They meander -- and they do so for deeply physical reasons. When flowing water encounters the slightest asymmetry, the faster current on the outside of a bend erodes the outer bank while depositing sediment on the slower inner bank. This positive feedback loop causes bends to amplify. Over time, meanders grow more dramatic until they pinch off entirely, leaving oxbow lakes -- abandoned loops of water disconnected from the main channel.

This proposal turns the practice timeline into a meandering river planform (top-down view rendered as a vertical scroll). Instead of the current straight-line-with-width-variation, the river snakes left and right across the viewport. The degree of meandering is controlled by practice consistency. Regular daily practice produces a gently sinuous channel -- the river knows where it is going. Irregular practice with gaps and bursts produces wild, erratic meanders -- the river is searching for its path.

When a user takes multiple days off and then returns, the meander that was growing during the gap pinches off and becomes an oxbow lake -- a small, still pool sitting beside the main channel, labeled with the dates of the missed days. Oxbow lakes are beautiful, melancholy features. They are not punitive. They are what rivers actually do. They are the physical memory of a path the river once took.

The point bar -- the sandy deposit on the inside of each bend -- accumulates sediment proportional to the session tags used. Different tags produce different sediment colors (warm-up sand, technique gravel, repertoire silt). Over months, the point bars become layered, striated records of what you practiced and when. A geological cross-section of your musicianship.

#### Rendering Technique

Canvas 2D for the river planform. The meander geometry is computed using the sine-generated curve model (Langbein and Leopold, 1966), where sinuosity = path length / straight-line length. Each day maps to a segment of the curve. The sinuosity parameter is modulated by a rolling 7-day coefficient of variation of practice minutes.

The river body is drawn as a filled path with bank erosion texture on the outer bends (subtle noise displacement) and smooth point bars on the inner bends (warm sediment colors). The water surface uses a Canvas 2D gradient with animated noise (a lightweight 1D Perlin noise function scrolled along the flow direction at 60fps).

Oxbow lakes are drawn as closed bezier loops with a still, reflective fill -- a radial gradient that mimics depth. They fade to 50% opacity over 14 days and eventually become "fossil meanders" at 20% opacity: ghosts in the landscape.

Sediment layers on point bars use thin horizontal stripes of tag-mapped colors, drawn with `ctx.fillRect` calls clipped to the inner-bend region. Each session adds a stripe.

For the compact home view: render only the last 14 days of meander at reduced resolution, with a subtle animated flow line (single-pixel dashed stroke with `lineDashOffset` animation).

#### Practice Data Mapping

| Practice Property | Physical Property | Visual Effect |
|---|---|---|
| 7-day consistency (CoV) | Sinuosity | How dramatically the river snakes |
| Daily minutes | Flow discharge | Width and velocity of water in the channel |
| Rest days (2+ consecutive) | Meander cutoff | Oxbow lake formation |
| Session tags | Sediment composition | Colored layers on point bars |
| Cumulative hours | Floodplain width | Visible landscape area around the river grows |
| Comeback after gap | Avulsion event | River breaks through to a new path, old channel becomes partially abandoned |

#### What Makes It Unique

No other practice tracker in existence shows your journey as a meandering river planform. The spatial layout encodes temporal consistency in a way that width alone never could. The oxbow lakes are the killer feature -- they transform "I missed 4 days" from a guilt signal into a beautiful geological artifact. "Look at my oxbow lake collection" is something a user might actually say. The sediment stratigraphy turns tag data into visible geological history -- core a point bar and see what you were practicing six months ago.

---

### Proposal 3: "Thalweg"

#### Fluid Dynamics Concept

The thalweg is the line of deepest, fastest flow in a river channel. It is the river's spine, its truest path. In a straight reach, the thalweg runs down the center. In a bend, it swings to the outside where centrifugal force drives the fastest water against the outer bank. The thalweg is invisible from above -- you cannot see it by looking at the river's surface. You only find it by measuring. It is the hidden structure beneath the visible flow.

This proposal introduces depth as a visual dimension. The current implementation is flat -- a 2D shape with uniform fill. "Thalweg" renders the river as a cross-sectional depth profile that shifts as you scroll. The river is not just wide; it is deep. And the depth distribution tells a story.

On light practice days, the cross section is shallow and wide -- a braided stream spreading across gravel bars, no single deep channel. On heavy practice days, the cross section is narrow and deep -- a gorge, a canyon, focused and powerful. The thalweg line glows at the deepest point, pulsing with the soul-line breathing from the pitch deck.

The key insight: depth and width can vary independently. A wide, shallow day (30 minutes spread across 3 short sessions) looks different from a narrow, deep day (30 minutes in one focused session). Same volume of water, completely different channel geometry. This encodes information that width-only visualization cannot.

Secondary currents called helical flow emerge in real river bends, creating spiral patterns that redistribute sediment. These are rendered as subtle rotating particle trails on days adjacent to sharp changes in practice volume -- the river's response to being pushed off-balance.

#### Rendering Technique

Hybrid SVG + CSS approach. The main river body remains SVG (for accessibility and DOM integration), but each day-segment gets a per-row cross-sectional depth gradient applied via an SVG `<linearGradient>` oriented horizontally. The gradient transitions from transparent at the banks to the deepest color at the thalweg position.

The thalweg line itself is a separate SVG `<path>` overlaid on the river, styled identically to the pitch deck's soul line: thin, luminous, breathing. Its x-position within the river shifts based on channel geometry (centered on straight days, offset toward the outer bank on days adjacent to volume changes).

Depth perception is enhanced with layered opacity. Three river paths are drawn at slightly different widths:

1. Outer path: full width, light color (shallow water / bank)
2. Middle path: 70% width, medium color (mid-depth)
3. Inner path: 40% width, deep color (channel core)
4. Thalweg line: 5% width, luminous highlight (fastest flow)

This creates a convincing depth illusion without 3D rendering. The soul line breathing animation (adopted from the pitch deck) runs on the thalweg line with `stroke-dashoffset` and opacity keyframes.

Helical flow particles: small SVG `<circle>` elements that follow elliptical orbits (using `<animateMotion>` along a pre-computed elliptical `<path>`) near transition zones. Max 8 particles active at once.

#### Practice Data Mapping

| Practice Property | Physical Property | Visual Effect |
|---|---|---|
| Daily minutes | Cross-sectional area | Total water volume in the channel |
| Number of sessions per day | Width-to-depth ratio | Many sessions = wide/shallow, one session = narrow/deep |
| Session duration (longest) | Maximum depth | How deep the thalweg reaches |
| Cumulative hours | Bed incision | The river carves deeper over time; early days are shallow even if intense |
| Day-to-day volume change | Lateral thalweg shift | The deepest line swings toward change, like a bend |
| Streak length | Bank stability | Long streaks = steep, stable banks; erratic practice = slumping, wide banks |

#### What Makes It Unique

Depth. No practice visualization has ever encoded depth as a visual dimension. The multi-layer rendering creates a sense of looking down into water rather than looking at a colored shape. The independent encoding of width (number of sessions) and depth (session duration) means that two days with identical total minutes look different if the practice structure differs. A 60-minute day that was one deep-focus session is a deep gorge; a 60-minute day that was four 15-minute fragments is a wide, braided stream. The river becomes a cross-sectional CT scan of your practice habits.

---

### Proposal 4: "Confluence"

#### Fluid Dynamics Concept

When two rivers meet, the physics is spectacular. The confluence zone is one of the most complex flow environments in nature. Two flows with different velocities, temperatures, sediment loads, and even colors collide and must negotiate a shared channel downstream. The result is a mixing zone -- sometimes sharp (if the flows differ greatly), sometimes diffuse (if they are similar). At the junction itself, a stagnation point forms where flow velocity drops to zero. Downstream, a shear layer develops between the fast and slow sides, spawning Kelvin-Helmholtz instabilities -- gorgeous rolling vortices that gradually mix the two flows into one.

This proposal models each practice TAG as a separate tributary stream. If you tag sessions as "technique," "repertoire," "theory," and "warm-up," you have four tributaries feeding into the main river. Each tributary has its own color (already mapped in `TAG_COLORS`). On days when you practice multiple tags, the tributaries converge and produce visible mixing zones with Kelvin-Helmholtz vortex patterns at the interfaces.

The mixing length -- how far downstream it takes for the colors to fully blend -- is inversely proportional to the turbulence level (i.e., total practice intensity). Intense practice days mix fast: the colors swirl together quickly into a rich composite. Low-intensity days mix slowly: you can trace each tributary separately for many rows downstream, like the famous meeting of the Rio Negro and the Solimoes near Manaus, where black water and sandy water flow side by side for kilometers.

A tag you have not used in a while re-enters the river as a cold, clear tributary -- visually distinct, almost jarring against the main flow. This is physically accurate: cold tributaries entering a warm main stem create thermal stratification and mixing fronts. It is also emotionally accurate: picking up theory practice after a month of pure repertoire should FEEL like a new stream entering the river.

#### Rendering Technique

Canvas 2D with per-pixel color mixing simulation. The river cross section is divided into horizontal bands (one per active tag). Each band flows downward at a rate proportional to its session minutes. At the interface between bands, a simplified Kelvin-Helmholtz instability is simulated:

1. The interface line is represented as a polyline with N control points (N = 20 per interface).
2. Each frame, a sinusoidal perturbation is applied to the interface. The perturbation amplitude grows exponentially (KH instability growth rate) until it saturates, at which point the interface "rolls over" into vortex-like bulges.
3. The bulges are drawn as smooth bezier curves using `ctx.quadraticCurveTo()`.
4. Color diffusion across the interface is handled by drawing thin horizontal lines with alpha blending, creating a smooth gradient in the mixing zone.

The simulation runs at 30fps for the mixing interfaces (computationally heavier), while the main flow animation (particle drift) runs at 60fps. On mobile, reduce control points to N = 10 and limit active interfaces to 3 (the 3 most-practiced tags; remaining tags are merged into an "other" band).

For the compact home view: render only the river body with static colored bands (no mixing animation), plus a single luminous soul line.

The stagnation point at each confluence is marked with a subtle radial glow -- a moment of stillness where two flows meet before combining.

#### Practice Data Mapping

| Practice Property | Physical Property | Visual Effect |
|---|---|---|
| Tag distribution per day | Tributary discharge ratios | Relative band widths in cross section |
| Total daily minutes | Main stem discharge | Overall river width and flow speed |
| Tag re-introduction after gap | Cold tributary inflow | Visually distinct new stream entering |
| Practice focus (single tag) | Undivided channel | Clean, single-color flow with no mixing |
| Tag diversity (many tags) | Multi-tributary confluence | Complex mixing patterns, rich color interplay |
| Time since tag last used | Temperature differential | Sharpness of the mixing front (sharper = more dramatic) |

#### What Makes It Unique

This is the only proposal where practice CONTENT (not just volume) is visible in the river. The tags become physical tributaries with their own personalities. A user who only practices technique sees a clean, single-color river. A user who works on technique, theory, and repertoire every day sees a complex, richly marbled flow with beautiful mixing patterns. The Kelvin-Helmholtz vortices are not decorative -- they are what actually happens when different flows meet. The mixing zones are screenshottable: marbled patterns of color that are unique to each user's practice distribution. No two rivers look alike.

---

### Proposal 5: "The Supercritical Event" (THE WILD ONE)

*The risky proposal. The one that might also win the Comedy Award. Buckle up.*

#### Fluid Dynamics Concept

In open-channel hydraulics, there exists a threshold called the Froude number: Fr = velocity / sqrt(g x depth). When Fr < 1, flow is subcritical -- deep, slow, tranquil. Information (surface waves) can travel upstream. When Fr > 1, flow is supercritical -- shallow, fast, shooting. Information cannot travel upstream. The transition between them is called a hydraulic jump, and it is one of the most violent events in fluid mechanics. The water surface drops abruptly, kinetic energy converts to turbulent chaos, spray flies everywhere, and the flow downstream is suddenly, dramatically calmer. You have seen a hydraulic jump in your kitchen sink: the thin fast sheet of water that spreads from the faucet stream, then suddenly thickens into a ring of turbulent water at the edge.

This proposal is about hydraulic jumps as milestone celebrations. When a user hits a practice milestone (100 hours, 365-day streak, 1000 sessions -- whatever the thresholds are), the river does not gently glow or pulse. It goes supercritical. The flow accelerates. The river surface drops. The water gets shallow and insanely fast. Particles streak past like they are being launched from a cannon. Then -- BOOM -- hydraulic jump. The river surface lurches upward. Spray particles explode outward. An SVG `<feTurbulence>` filter cranks to maximum. The sound engine (already available via Web Audio API) plays a low, resonant rush.

After the jump, the river is deeper, wider, and calmer than before. The milestone is literally encoded as a change in the river's hydraulic regime. Pre-milestone: shallow and fast. Post-milestone: deep and slow. The Froude number crossed 1.0, and the universe of your practice changed state.

But here is the ridiculous part, the part that earns the Comedy Award: the hydraulic jump is physically accurate, which means it conserves momentum but DISSIPATES energy. The spray particles that explode outward? They represent the energy lost to turbulence. In a real hydraulic jump, up to 70% of the flow energy is lost. So when your milestone triggers, the river is telling you: "Congratulations, you just dissipated an enormous amount of practice energy into beautiful chaos." It is a celebration that is also, technically, an entropy increase. The universe becoming slightly more disordered because you hit 100 hours of guitar. You are welcome, thermodynamics.

Between milestones, the Froude number still matters. During a practice session timer (if the river is visible on the timer screen), the Froude number gradually increases as minutes accumulate. The river gets slightly faster, slightly shallower. The user can sense the approach of a threshold. If they stop just short of a milestone, the river is visibly straining -- supercritical flow is unstable and WANTS to jump. The river is begging you to play for five more minutes. This is the most physically honest guilt trip possible.

Also: in supercritical flow, surface waves cannot travel upstream. This means the "today" section of the river cannot affect the appearance of past days. This is just a cool detail but I had to mention it because I am a hydrologist and I think about Froude numbers more than is socially acceptable.

#### Rendering Technique

This is a layered event system on top of any of the other proposals (it composes well with Proposals 1-4).

**Normal flow (Fr < 1, subcritical):** Standard river rendering. Particles at normal speed. Soul line breathing at resting rate.

**Approaching threshold (0.7 < Fr < 1.0):** Particle speed increases. Soul line breathing accelerates (anxiety breathing). River surface develops small standing waves rendered as horizontal sine-wave `<path>` elements clipped to the river body. An SVG `<feTurbulence>` filter with low `baseFrequency` (0.01) and single octave applies to the river surface. A subtle whitewater fringe appears at the banks -- thin white lines with animated opacity.

**Supercritical (Fr > 1.0, the 3-second milestone event):**

1. Frame 0-30 (0-0.5s): River surface drops (the shallow-fast regime). Width shrinks by 30%. Particle velocity triples. The SVG path animates to a narrower, faster channel.
2. Frame 30-60 (0.5-1.0s): HYDRAULIC JUMP. A horizontal shockwave line sweeps down the river. Behind the line, the river slams to full width + 20% overshoot. `<feTurbulence>` cranks to `baseFrequency` 0.05, 4 octaves. 20-40 spray particles (small white `<circle>` elements) burst outward from the jump location with ballistic trajectories (parabolic paths using `requestAnimationFrame` position updates with gravity).
3. Frame 60-120 (1.0-2.0s): River settles into new regime. Width overshoot damps via spring physics (critically damped harmonic oscillator: x(t) = A * e^(-bt) * cos(wt)). Spray particles fade. Turbulence filter intensity decays exponentially.
4. Frame 120-180 (2.0-3.0s): Full calm. New baseline. River is now deeper (darker gradient) and wider. The Froude number resets below 1.0.

If Web Audio API is active, the jump triggers a noise burst shaped by a bandpass filter sweep (high to low frequency over 1 second), creating a satisfying "WHOOSH-to-rumble" sound.

Performance: The jump event is capped at 3 seconds, uses at most 40 spray particles (recycled from a pre-allocated pool), and the turbulence filter is removed after the event. Battery impact is negligible because milestones are rare (at most a few per month).

#### Practice Data Mapping

| Practice Property | Physical Property | Visual Effect |
|---|---|---|
| Progress toward next milestone | Froude number | Flow speed, surface wave intensity, user tension |
| Milestone reached | Hydraulic jump | 3-second celebration event with spray and shockwave |
| Post-milestone state | Subcritical regime | Deeper, wider, calmer river |
| Energy dissipated in jump | Spray particle count | More significant milestones = bigger jumps |
| Cumulative milestones | Step changes in bed elevation | Each past jump is visible as a subtle depth transition in the river profile |
| Near-miss (session ends close to milestone) | Unstable supercritical flow | River visibly "strains" -- standing waves persist, particles jitter |

#### What Makes It Unique

It is a celebration system grounded in conservation of momentum. The hydraulic jump is not a metaphor -- it is what water actually does at regime transitions. The pre-jump tension (the river accelerating, getting shallower, becoming unstable) creates genuine anticipation. The user can FEEL the milestone approaching in the physics of the flow. The energy dissipation joke (your achievement literally increases entropy) is the kind of nerd humor that belongs in a guitar practice app built by people who write fluid dynamics proposals for UI competitions. The near-miss mechanic ("the river wants to jump, just play 5 more minutes") is either brilliant motivation design or unconscionable psychological manipulation, depending on your perspective. Either way, it is physically correct. The river does not lie.

---

### Summary Comparison

| Proposal | Core Concept | Primary Technique | Risk Level | Wow Factor |
|---|---|---|---|---|
| 1. The Reynolds River | Laminar-turbulent transition via Re number | SVG + rAF particles | Low-Medium | The physics IS the feature |
| 2. Meander | Planform meandering + oxbow lakes | Canvas 2D planform rendering | Medium | Oxbow lakes for rest days |
| 3. Thalweg | Depth as visual dimension | Multi-layer SVG depth gradients | Low | Width AND depth encoding |
| 4. Confluence | Tag-based tributaries with mixing | Canvas 2D per-pixel color mixing | Medium-High | Kelvin-Helmholtz vortices |
| 5. The Supercritical Event | Hydraulic jumps at milestones | Event overlay (composable) | High | 3-second physics celebration |

### Hydrologist's Recommendation

Combine Proposals 1 and 5. Use the Reynolds River as the base flow system (it handles the everyday rendering, the laminar/turbulent character, the viscosity-from-rest-days). Layer The Supercritical Event on top for milestones. Borrow the thalweg depth-layering from Proposal 3 for the multi-path rendering (it is cheap and looks great). Save Meander and Confluence for future iterations -- they are harder to implement and work best with more data (months of tags, multiple long rest periods).

The river should compute Re every frame. It should feel like water. It should go turbulent when you push it hard and go laminar when you are consistent. And when you hit a milestone, it should celebrate with a hydraulic jump that is both spectacular and thermodynamically sound.

*The water does not care about your feelings. But it turns out, if you model it correctly, it expresses them anyway.*

---

## The Integrator -- Proposals

*Five proposals for making the river escape the Stats tab and become the connective tissue of the entire app. The constraint: the river must be present on every page -- Home, Timer, Log, Reference, Stats -- as a persistent ambient layer, like weather in a video game. It should never feel bolted on.*

---

### Proposal 1: "The Water Table"

#### Integration Architecture

The river is not a component. It is a geological layer beneath the entire app.

Introduce a new top-level component called `<RiverSubstrate>` that wraps the entire `<App>` render tree but sits *behind* everything, rendered as a fixed-position Canvas element at z-index 0. This is not a background image. It is a live, continuously-rendered water table -- a simplified, abstract representation of the river that lives underneath every single page of the app, visible through translucent "windows" in each page's layout.

The substrate computes a single, slowly-drifting flow field derived from the user's practice data. Think of it like groundwater: always moving, always present, but only visible where the surface lets you see down. Each page defines its own "aperture" -- a CSS clip-path or SVG mask that determines *where* the water table shows through. The Home page has a wide, generous window. The Shed page has thin rivulets running between sections. The Log page has a dry crack that fills as you set your duration. The Timer has a circular pool that deepens over time.

State lives in a new `RiverContext` provider wrapping the app at the same level as `ThemeContext`. It exposes `riverState` (derived from sessions: streak, total hours, days since last practice, current velocity) and `riverEvents` (a pub/sub bus for transient events like `session-saved`, `timer-started`, `milestone-hit`). The substrate subscribes to both. Individual page apertures subscribe to `riverState` for their shape calculations. The existing `sessions` state in `App.jsx` feeds directly into the provider, so the river updates on every call to `refreshSessions()` or `handleTimerSave()`.

This architecture means the river never mounts or unmounts. It never transitions. It is always there, underneath, whether you can see it or not. When you tap from Home to Shed in the TabBar, the page content fades via the existing `transitionPhase` system (`page-exit` / `page-enter` over 450ms), but the substrate never stops. The aperture of the departing page dissolves while the arriving page's aperture fades in. The water was always flowing; you just moved to a spot where you can see it again.

Performance: the substrate renders on a `<canvas>` using `requestAnimationFrame` but throttles to 30fps when no page aperture is visible (e.g., during the full-screen `TimerFAB` expanded overlay, which covers everything at z-50). It pauses entirely when the browser tab is backgrounded via `document.visibilityState`. On a 375px viewport, the canvas is small -- roughly 375x700px -- so even on budget phones the per-frame cost is trivial.

#### Per-Page River Presence

- **Home:** The largest aperture. A wide, soft-edged oval mask sits behind the hero stat area (`text-center mb-2 hero-glow`), letting the substrate's flow show through as a shimmering, color-shifted backdrop to the total hours number. The existing compact `<RiverSVG sessions={sessions} compact daysToShow={28} />` preview card is replaced by a live viewport into the substrate showing the river's recent path, with the current flow speed and color reflecting today's practice state. The dry riverbed empty-state (the `w-[2px] h-16` dashes) is replaced by a cracked-earth texture with no water visible through the aperture -- until the first session, when a thin trickle bleeds through. The `getGreeting()` poetic texts ("Morning dew on the strings") gain a visual counterpart: the aperture's water color shifts with time-of-day, warm gold before dawn, cool blue at midday, deep indigo at night.

- **Timer (expanded):** The `TimerFAB` expanded overlay currently uses a `radial-gradient` background with a `backdrop-filter: blur(24px)`. The radial gradient background becomes a deep circular pool -- the aperture is a large circle centered on the timer display. As the timer runs (tracked by the `elapsed` state), the pool visibly fills: the water level rises from the edges inward, and the flow speed increases. At 15 minutes the pool barely shimmers. At 60 minutes it churns with gentle current. When `timerState === 'paused'`, the pool goes glassy-still with a faint ripple. When `timerState === 'stopped'`, the pool settles to a calm, full state, visually reinforcing "you did it." The `SoundscapePanel` rain audio syncs with visible droplets hitting the pool surface -- the substrate spawns tiny ring-ripple animations at random positions within the pool, timed to coincide with the rain audio's amplitude peaks.

- **Log (form):** A thin vertical crack runs down the left margin of the form (`px-5 pt-12`), dry by default. As you set duration via the `PRESETS` buttons or the custom input, water seeps into the crack proportional to `effectiveDuration`. Selecting tags via the `PRACTICE_TAGS` buttons tints the water with subtle hues matching the existing `TAG_COLORS` palette. When you hit the submit button and `handleSubmit` fires, the crack ruptures and water floods outward in a brief 400ms burst animation before the success screen (`logged === true` branch) appears. On the success screen, the full substrate is visible with a fresh surge propagating downstream, reinforcing the `logSummary` text "Added 30m to your river" with a visual surge the user can actually see.

- **Reference (Shed):** Thin capillary rivulets run horizontally along each section divider -- the `h-px bg-dry` elements between Root Lock, Intent nav, and content areas. They flow left-to-right at a gentle pace, their width and color reflecting total practice hours computed from the same `getColorForHours()` function used by the current RiverSVG. The `FretboardDiagram` sits on a "sandbar" -- a slightly raised island with the river flowing around its edges via a rectangular aperture with a hole cut for the diagram. This is purely decorative but makes the Shed feel like it belongs to the same living world. Changing the `rootNote` or `scale` creates a brief turbulence ripple in the rivulets, as if the musical change disturbed the surface.

- **Stats (River):** The one page where the aperture is fully open -- the substrate is visible edge-to-edge beneath the entire `StatsPage` layout. The existing `<RiverSVG sessions={sessions} />` becomes a detailed, interactive overlay on top of the substrate, showing day-by-day detail with tap-to-expand tooltips. The substrate and the SVG overlay move in parallax: scrolling the `overflow-y-auto` container shifts the substrate underneath at 0.5x speed, giving a sense of depth. The `ProgressRing` weekly progress component gets a subtle ripple effect in the ring's unfilled area, as if water is pooling toward the completion point.

#### Real-Time Action Responses

- **Starting the timer:** When `handleStart()` fires in `TimerFAB`, a `riverEvents.emit('timer-started')` triggers a subtle "plop" ripple that emanates from the FAB button position in the substrate, like a stone dropped in water. The substrate's global flow speed increases by 10%, and this persists for the duration of the timer.
- **Completing a session (timer save or manual log):** When `handleTimerSave()` or `handleSubmit()` fires, `riverEvents.emit('session-saved', { minutes })` triggers a surge wave that propagates through the entire substrate, temporarily widening the visible water in every aperture for ~2 seconds. If this pushes total hours past a color threshold in the `WATER_COLORS` palette, the color transition bleeds through in real-time.
- **Fog Horn (rest day):** When `handleFogHorn()` fires, the substrate dims to a misty grey-blue and the flow speed drops to near-zero. Tiny fog particles drift upward through all apertures. This persists until the next non-fog session.
- **Hitting a milestone:** When `checkNewMilestones` returns results and `setCelebrations` fires, the substrate renders a golden "standing wave" -- a stationary bright arc -- at the center of the current page's aperture, persisting for 10 seconds.
- **Tab changes:** During the existing `handleTabChange` transition (150ms exit, 300ms enter), the departing page's aperture fades out while the arriving page's aperture fades in, but the substrate never stops -- you can see the water flowing continuously during the transition. This makes tab-switching feel like walking along a riverbank, not flipping pages.

#### What Makes It Unique

No practice app treats its core visualization as infrastructure rather than content. Most data visualizations are things you *go look at*. The Water Table inverts this: the river is something you *live on top of*. You never "visit" the river -- you are always standing on its banks. The aperture system means each page gets a bespoke relationship with the water without any page needing to import or render river components directly. The river is geology, not UI.

---

### Proposal 2: "Capillary Action"

#### Integration Architecture

Inspired by how water moves through soil via capillary action -- defying gravity, seeping into every tiny space -- this proposal makes the river infiltrate the existing UI elements rather than existing behind or beside them.

No new background layer. No canvas. Instead, a `useRiverInk()` hook that any component can call to get CSS custom properties representing the river's current state: `--river-hue`, `--river-saturation`, `--river-opacity`, `--river-flow-speed`, `--river-depth`. These properties drive subtle visual shifts across every existing UI element in the app. The river does not appear AS a separate thing. The river appears THROUGH the existing things.

The hook pulls from a `RiverStateProvider` (wrapping `App`, alongside `ThemeContext`) that computes these values from session data on every change to the `sessions` state and on a slow 10-second `setInterval` tick for time-of-day shifts. The values are set as CSS custom properties on `document.documentElement`, so every component inherits them without explicit subscription. A single CSS file (`river-ink.css`) defines how these properties cascade through the design system: `.card` borders get a faint `box-shadow` colored by `hsl(var(--river-hue), var(--river-saturation), 60%)` at `var(--river-opacity)`; the `.flow-pill` active indicator pulses at a speed derived from `--river-flow-speed`; the `hero-glow` on hero numbers carries a whisper of `--river-hue` in its text-shadow.

On top of this ambient infiltration, each page gets one "river accent" -- a small, bespoke SVG micro-animation that is explicitly river-like, placed at a natural focal point. These are tiny: 50-80 lines of SVG each. They inherit the CSS custom properties, so they always feel like part of the same system.

The total code surface is small: one context provider (~80 lines), one CSS file (~60 lines), one hook (~20 lines), and 4-5 small SVG accent components (~50 lines each). No canvas. No massive render tree. This is the lightest possible integration that still makes the river omnipresent. It will run at 60fps on any device because it is mostly CSS -- no per-frame JavaScript computation.

#### Per-Page River Presence

- **Home:** The hero stat number (the `64px` total hours in `formatHours(totalMinutes)`) gets a text-shadow that subtly shifts with `--river-hue` -- at low hours it is a faint mist; at high hours it is a deep blue-black with visible spread. The `flow-pill` streak indicator has its `animate-pulse-glow` dot replaced by a tiny inline SVG of three drifting particles that flow rightward at `--river-flow-speed`. River accent: a 40px-wide animated "trickle" SVG that runs vertically between the stats row (`grid grid-cols-3 gap-3`) and the 28-day preview card, like a thin stream connecting the two data zones. The trickle's opacity is `var(--river-opacity)` and its color is `hsl(var(--river-hue), ...)`.

- **Timer (expanded):** The `TimerFAB` overlay's radial gradient background center color shifts from the static `rgba(59,130,246,0.08)` to a dynamic `hsl(var(--river-hue), ...)` that deepens as `elapsed` grows. The timer digits get a barely-perceptible animated underline -- a thin wavy SVG `<path>` that flows left-to-right at `--river-flow-speed`, growing in wave amplitude proportional to elapsed minutes. River accent: when `elapsed` crosses 15-minute marks, a single animated SVG "drop" falls from the bottom of the time display (`h1` element) and splashes into a tiny ring-ripple that fades. It is absurdly satisfying. It happens at 15m, 30m, 45m, 60m, and then every 30m after.

- **Log (form):** The submit button's gradient shifts its hue toward `--river-hue`. When `effectiveDuration > 0`, a tiny wave animation (CSS `@keyframes` on a pseudo-element `::after`) plays across the button surface, like wind across a pond. River accent: the success screen's bounce-in checkmark animation (`animate-bounce-in`) is replaced by a "splash" -- the checkmark rises from below with a ring of droplets rendered as 6 small SVG circles that expand and fade over 600ms.

- **Reference (Shed):** All section divider lines (the `h-px bg-dry` elements and `flex-1 h-px bg-dry` dividers throughout the page) are replaced with a 1px animated SVG that looks like a thin stream. The SVG is a horizontal `<path>` with a gentle sine-wave wobble, stroke-colored by `hsl(var(--river-hue), ...)`. When you change the `rootNote` state, the stream briefly runs faster for 1 second -- the musical choice creates a current. River accent: the `CircleOfFifths` SVG gets a barely-visible animated stroke on its outer circle that flows clockwise, suggesting musical movement. The stroke uses `stroke-dashoffset` animation at `--river-flow-speed`.

- **Stats (River):** The full `RiverSVG` gets the deepest integration: its `WATER_COLORS_LIGHT` and `WATER_COLORS_DARK` gradient stops incorporate `--river-hue` as a modulating factor, its `flowStreaks` `dur` values map to `--river-flow-speed`, and its glow filter (`feGaussianBlur stdDeviation`) scales with `--river-depth`. This is where all the ambient properties come home -- the river page feels richest because every CSS variable is cranked to its full expression.

#### Real-Time Action Responses

- **Starting the timer:** `--river-flow-speed` decreases (faster animation) globally, causing every river-touched element across the app to subtly accelerate. The TabBar's active state glow (the `radial-gradient` in the active button) brightens by increasing `--river-opacity`.
- **Completing a session:** A 1.5-second CSS animation class (`river-surge`) is applied to `document.documentElement`, temporarily boosting `--river-opacity` by 0.3 and `--river-saturation` by 20% across the entire app. Every card border glow, every text shadow, every accent SVG simultaneously swells and then settles. It feels like the whole app took a breath.
- **Fog Horn:** All river properties dim. `--river-saturation` drops to near-zero. `--river-flow-speed` slows to a crawl. The accent SVGs go still. The app feels muted, restful, intentional.
- **Milestone:** `--river-depth` spikes for 3 seconds, causing the hero stat text shadow to deepen dramatically and every `.card` border glow to intensify. The app briefly looks like it is underwater.
- **Long idle (no practice in 3+ days):** `--river-flow-speed` decays toward its maximum value (slowest speed). The accent SVGs barely move. Everything is calm and still. Not punishing -- inviting. The settling metaphor from the pitch deck, made real through pure CSS.

#### What Makes It Unique

Most "ambient layer" proposals add visual weight. Capillary Action adds almost none. There is no new z-layer, no canvas, no performance concern. The river exists as *a way of seeing the existing UI* rather than as a separate thing overlaid on it. It is integration through infiltration. The app does not have a river ON it. The app IS the river. Every button, every border, every shadow is wet.

---

### Proposal 3: "The River Runs Through It"

#### Integration Architecture

A single animated SVG path -- the "main channel" -- physically snakes through the entire app layout, crossing page boundaries via the tab bar. This is the most literal interpretation of integration: one continuous visible line of water that you can trace from the Home page hero, down through the tab bar, and into whatever page you navigate to.

The architecture centers on a `<RiverChannel>` component rendered in `App.jsx` at a fixed z-index of 20 -- between the page content (`relative z-10`) and the TabBar (`z-30`). It renders a single SVG that spans the full viewport height via `position: fixed; inset: 0`. The path is computed dynamically based on `activeTab` and `transitionPhase`: each page defines "docking points" -- viewport coordinates where the channel enters and exits the page layout. During the existing tab transitions (the 150ms exit + 300ms enter in `handleTabChange`), the path morphs from one page's docking configuration to the next using SVG path interpolation (the `d` attribute transitions via `requestAnimationFrame` lerping between control points).

The channel itself is a 3-6px wide animated `<path>` with a flowing particle system clipped to it via `<clipPath>`. Width varies: thinner on pages where it is decorative (Shed, Log), wider on the Stats page where it becomes the full river. Color and particle density derive from the session data, using the same `getColorForHours()` and `getWaterWidth()` functions from the existing `RiverSVG`. The path has a "soul line" -- a 1px bright center `<path>` rendered on top with an `opacity` animation that breathes at 4-second intervals.

The TabBar becomes a crucial integration point. The river channel physically *passes through* the tab bar, entering from the active tab icon's bounding box and exiting upward toward the page content. The four tab icons (`home`, `log`, `stats`, `shed`) each have a known position in the viewport (computable from the `nav` layout: 4 buttons in a `flex justify-around` within `h-[72px]`). When you tap a different tab, the channel visibly re-routes through the new tab icon -- it bends, curves, and settles into its new path over the 450ms transition. This makes tab changes feel like redirecting the flow of a river, not swapping pages.

State management: a `RiverChannelContext` holds the current path control points, target path control points, and interpolation progress (0 to 1). Each page registers its docking points on mount via a `useRiverDock({ entry: {x, y}, exit: {x, y} })` hook that writes to the context. The `<RiverChannel>` component subscribes to the context and animates between registered paths using `requestAnimationFrame`.

#### Per-Page River Presence

- **Home:** The channel enters from the top of the viewport (off-screen, as if flowing from above), runs vertically down the right side of the hero stat area, curves left to flow behind the `flow-pill` streak indicator, meanders through the stats row (passing between the three `grid grid-cols-3` capsules), feeds into the 28-day river preview card (where it widens to match the `<RiverSVG compact>` width), and then exits downward into the TabBar through the "Home" icon. The `hero-glow` behind the total hours is replaced by a glow emanating from the channel as it passes nearby -- a CSS `drop-shadow` filter on the SVG path that casts light onto the number.

- **Timer (expanded):** When `TimerFAB` goes to `expanded === true` and renders the full-screen overlay at z-50, the channel does not disappear -- it spirals inward from the FAB button position (bottom-right corner), forming a loose coil around the timer digits (`h1` with `fontSize: 72px`) that slowly tightens as `elapsed` increases. The spiral path is computed as an Archimedean spiral with a radius that starts at 150px and shrinks toward 40px based on `elapsed / 3600000` (hours). When `timerState === 'paused'`, the spiral freezes (particles stop flowing). When `timerState === 'stopped'`, the spiral uncoils outward and flows downward off-screen, as if the accumulated time is being released downstream.

- **Log (form):** The channel enters from the top and runs straight down the left margin of the form (`px-5`), positioned at about x=20px, like a traditional margin line on notebook paper -- but animated, flowing, alive. As you fill in the form -- `effectiveDuration > 0`, `note.length > 0`, `tags.length > 0` -- small tributary branches extend rightward from the main channel toward each completed field. The tributaries are short bezier curves (30-50px long) that grow in over 300ms when their field becomes non-empty. When `handleSubmit` fires, all tributaries animate back into the main channel, which pulses brightly (soul line goes to full opacity for 1 second) and flows downward with doubled particle speed.

- **Reference (Shed):** The channel runs horizontally across the top of the page, just below the header (`h1` "The Shed"), acting as a decorative banner river. When you change `rootNote` or `scale`, the channel's color shifts to a hue associated with that musical key (mapping `NOTES.indexOf(rootNote)` to the hue wheel: C=0deg, C#=30deg, D=60deg, etc.). The channel forms tiny eddies at the edges of the intent navigation buttons (`INTENTS` array), pooling with a small animated circular detour at whichever intent button has `i.id === intent`.

- **Stats (River):** The channel enters from the TabBar through the "River" icon and immediately widens to become the full `<RiverSVG>` visualization. This is where the thin ambient line reveals its true nature -- it was always the river, just compressed into a decorative stream for the other pages. The widening transition (3-6px channel becoming the full `riverArea * 0.86` max width) is animated over 600ms using the same Catmull-Rom path interpolation and is deeply satisfying. Scrolling the `overflow-y-auto` river container moves the full-width river while the channel portions above and below it (connecting to the TabBar) remain fixed.

#### Real-Time Action Responses

- **Starting the timer:** The channel's particle flow speed doubles instantly across the entire app. The soul line brightens from 0.5 to 0.9 opacity. Every page's river accent visibly accelerates.
- **Completing a session:** A visible "wave" -- a bright 8px spot traveling along the channel path -- propagates from the current page position, through the TabBar, and out toward all other pages' docking points. It takes about 1.5 seconds to traverse the full path. Any user watching the TabBar sees the wave pass through the active tab icon. Implemented as a single SVG `<circle>` animated along the `<path>` using `getPointAtLength()`.
- **Fog Horn:** The channel thins to 1px and goes translucent (opacity 0.3). Its gradient shifts to grey via `getColorForHours(0)`. Particles become sparse, slow, mist-like dots instead of water droplets.
- **Milestone:** The channel briefly branches into 3 parallel streams at the current page (like a braided river delta) for 3 seconds, then the branches reconverge into the single channel. Rendered as two additional `<path>` elements offset by +/-8px from the main path, fading in and out over 3 seconds. Visually spectacular.
- **Tab change:** The channel re-routes through the newly active tab icon. The re-routing animation is the signature moment: the path control points interpolate from the old tab's docking configuration to the new tab's over the 450ms transition. You can see the water bending in real-time through the TabBar, creating a visible "the water is flowing THIS way now" moment on every single navigation.

#### What Makes It Unique

One continuous, physically traceable line of water running through the entire app. Not an ambient mood. Not a background layer. A visible, literal river that you can point to and say "there it is" on every single page. The tab bar routing animation is the signature moment -- navigation stops feeling like page-swapping and starts feeling like steering a waterway. You are not changing tabs. You are redirecting the river.

---

### Proposal 4: "Seasonal Watershed"

#### Integration Architecture

The river does not just flow through the app. The river determines what the app *looks like*.

This proposal introduces a "season" system driven entirely by practice data. Based on your recent practice patterns -- streak length, volume trends, consistency, time since last session -- the app is assigned one of six river seasons: **Spring Melt** (returning after absence, water rising), **Summer Current** (consistent streak of 7+ days, strong flow), **Autumn Deepening** (long-term practitioner with 100+ total hours, rich and complex), **Winter Stillness** (extended break of 7+ days, frozen/quiet), **Flash Flood** (sudden burst of 60+ minutes in a single day), and **Fog Season** (rest days, Fog Horn active via `todayIsFogDay()`). Each season defines a complete visual theme: background textures, particle effects, color temperature, animation speeds, and ambient sound suggestions.

The season is computed by a pure function `computeRiverSeason(sessions, today)` in a new `utils/riverSeason.js` utility. It takes the same `sessions` array that flows through the app and outputs a season object: `{ id, name, cssVars: { ... }, particles: { type, density, speed, colors }, greeting: string }`. The CSS vars (20+) include `--season-hue`, `--season-temp`, `--season-wind`, `--season-opacity`, `--season-glow-color`, etc. A `RiverSeasonProvider` context wraps the app and exposes the current season to all components via `useSeason()`.

Each page reads the season and adapts -- not through river-specific components, but through the existing design system. The `.card` class in `styles.css` picks up `box-shadow: 0 0 var(--season-glow-spread) var(--season-glow-color)`. The `.glass` backdrop-filter adjusts its tint via `background: hsla(var(--season-hue), var(--season-saturation), ...)`. The `hero-glow` animation speed scales with `--season-wind`. The effect is holistic: the app does not have a river drawn on it. The app IS in a season, and the season IS the river.

On top of this, a lightweight `<SeasonParticles>` component renders a sparse particle system in a fixed-position SVG overlay at z-index 1 (behind the page content at z-10). These particles -- rain droplets for Spring Melt, firefly dots for Summer Current, small leaf shapes for Autumn Deepening, slow snowflake circles for Winter Stillness, fast spray for Flash Flood, drifting fog wisps for Fog Season -- drift across the entire app regardless of which page is displayed. They are rendered at very low density (10-20 active particles) to be ambient rather than distracting. They respect `prefers-reduced-motion` using the same check the existing RiverSVG uses: `window.matchMedia('(prefers-reduced-motion: reduce)')`.

#### Per-Page River Presence

- **Home:** The `getGreeting()` function (currently returning time-of-day strings like "Morning dew on the strings") is replaced by a `getSeasonalGreeting(season, hour)` that combines both: "Spring melt at dawn" / "The summer current calls" / "Autumn deepens tonight" / "Winter stillness holds." The hero stat total hours display picks up the season's typographic accent via CSS: Spring uses `font-weight: 300` (lighter, airy); Summer uses `font-weight: 800` (bold, confident); Autumn uses `font-family: var(--font-serif)` (warm accent); Winter uses `letter-spacing: 0.05em` (thin, crystalline spacing). The "Last 28 Days" compact `<RiverSVG>` adapts its color palette to the current season, so the same data looks warm amber in Autumn and pale silver in Winter. The streak pill's `animate-pulse-glow` speed matches `--season-wind`.

- **Timer (expanded):** `SeasonParticles` continue drifting across the timer overlay -- you are practicing *inside* the season. The `TimerFAB` overlay's radial gradient background shifts from the static `rgba(59,130,246,0.08)` center to `hsla(var(--season-hue), var(--season-saturation), ...)`. In Flash Flood season, the overlay background has visible turbulence: a CSS `backdrop-filter` with an animated `hue-rotate` that shifts subtly. In Winter Stillness, the background is crisp and clear with the occasional slow snowflake particle drifting across the timer digits. The `SoundscapePanel` auto-suggests a rain intensity based on season: Spring Melt defaults to `rainVolume: 0.7`; Winter defaults to `rainVolume: 0.1` (quiet).

- **Log (form):** The submit button's `linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))` shifts to use the season's primary hue: warm amber gradient in Autumn, cool silver in Winter, bright green-blue in Spring. The success screen `logSummary` text adapts: "Added 30m to the spring melt" / "Your autumn river deepens by 30m" / "30m of summer current." The success checkmark `animate-bounce-in` animation incorporates season particles -- in Summer Current, the checkmark bursts into 8 small golden particle dots that expand and fade; in Winter Stillness, it crystallizes with a brief 200ms `filter: brightness(1.5)` frost-flash effect.

- **Reference (Shed):** The fretboard diagram's wood-grain background (the `.text-dry/60` `<rect>` in `FretboardDiagram`) shifts color with the season: `fill` becomes `hsla(var(--season-hue), 10%, 50%, 0.15)`, giving a warmer tone in Summer/Autumn and cooler in Winter/Spring. The `CircleOfFifths` SVG gets a season-colored outer ring by adding a `<circle>` with `stroke: hsla(var(--season-hue), ...)`. Section dividers throughout the page carry the season's accent color. These changes are subtle, harmonious, and never distracting from the actual reference content that musicians need to read clearly.

- **Stats (River):** The full `<RiverSVG>` is where the season reaches its fullest expression. The river path renders with season-specific visual layers: Spring Melt adds thin, angular SVG `<line>` elements at the river edges to suggest ice fragments breaking apart; Summer Current has the densest `flowStreaks` particle flow (the existing ellipse animation, but 5 streaks instead of 3); Autumn Deepening layers small, warm-colored SVG `<circle>` elements along the river banks to suggest golden sediment; Winter Stillness adds a white-stroke, low-opacity crystalline edge pattern rendered as a `<path>` with angular, branching segments. The river literally looks different based on your practice patterns, not just wider or narrower.

#### Real-Time Action Responses

- **Starting the timer:** `SeasonParticles` increase their active count from 15 to 25 (50% density increase). The `--season-wind` value increases, accelerating all season-influenced animations app-wide. If you are in Winter Stillness, starting the timer causes one small section of the Stats page's ice-edge rendering to visibly crack in a 500ms animation -- foreshadowing a season change if you keep going.
- **Completing a session:** The season re-computes immediately via `computeRiverSeason()`. If the session tips you into a new season (e.g., 3 consecutive days triggers Spring Melt -> Summer Current), a full-screen 2-second "season change" animation plays: the old season's `SeasonParticles` drift off-screen (velocity doubles, opacity fades to 0) while the new season's particles drift in from off-screen. The background CSS vars (`--season-hue`, `--season-temp`) transition over 2 seconds using CSS `transition: all 2s ease`. It is the most dramatic possible response to logging practice.
- **Fog Horn:** When `handleFogHorn()` fires and `addFogDay()` is called, the season instantly transitions to Fog Season with a slow, 1-second dissolve. All existing particles fade out, replaced by drifting fog wisps (large, very low-opacity grey circles). The entire app goes quiet and misty. `--season-saturation` drops to near-zero.
- **Milestone:** When `checkNewMilestones` returns results, the current season's active particles briefly accelerate and converge toward the center of the screen, forming a loose cluster for 2 seconds, then disperse back to their normal drift pattern. The cluster shape loosely suggests the milestone's emoji character. Delightful.
- **Returning after 7+ day break:** Opening the app after a long absence reveals Winter Stillness -- frozen, still particles, crystalline edges, cool palette. The first session triggers Spring Melt: ice-edge SVGs crack and fade, the `--season-hue` warms from 210 (cool blue) to 160 (green-blue), particles shift from rare snowflakes to frequent rain drops. It is a comeback narrative told through weather. Everyone who has lived through an actual winter knows the emotional weight of the first warm day.

#### What Makes It Unique

No other practice app has *seasons*. The river is not a visualization you look at -- it is a climate you inhabit. Two users opening The River app at the same time could see completely different worlds: one in the lush warmth of Summer Current, the other in the crystalline silence of Winter Stillness. The app becomes a reflection of your practice *relationship*, not just your practice *data*. And the season transitions -- especially the comeback from Winter to Spring -- are the kind of moments that make someone text a friend and say "you have to see what this app just did."

---

### Proposal 5: "Tidal Nonsense" (THE WILD ONE)

#### Integration Architecture

What if the river was too much? What if, instead of the river being a tasteful ambient layer, it was an ungovernable force of nature that slowly, hilariously, catastrophically took over the entire app the more you practiced?

The premise: practice is water. Water accumulates. Water does not care about your UI.

A new `<TidalForce>` component wraps the `App` render tree and maintains a `waterLevel` value derived from `getTotalMinutes(sessions)`. The mapping: 0 hours = level 0% (bone dry), 10 hours = level 5% (water stains), 50 hours = level 15% (visible waterline), 100 hours = level 25%, 250 hours = level 50%, 500 hours = level 75%, 1000 hours = level 100% (fully submerged). At each threshold, the visual escalation ratchets up.

At level 0%: the app works exactly as it does now. Nothing is different. The river is a polite data visualization on one tab. It has no ambitions.

At level 5%: subtle water stain marks appear at the bottom edges of `.card` elements -- just a `box-shadow` with a blue-tinted `inset 0 -2px 4px`. You might not even notice.

At level 15%: a visible animated waterline appears. A fixed-position SVG at z-index 2 renders a wavy `<path>` that spans the viewport width, positioned from the bottom at `(100 - waterLevel)%`. Below the line, a `<div>` with `backdrop-filter: blur(1px) saturate(1.2)` and a blue tint covers everything. Cards that scroll below the waterline get the underwater treatment. Text is still readable. Barely.

At level 50%: the `backdrop-filter` intensifies to `blur(2px)`. An `feTurbulence` SVG filter adds a gentle refraction distortion to the underwater zone. Small CSS-animated bubble `<circle>` elements (8-12 of them) rise from the bottom of the viewport. Light caustic patterns (an SVG `<pattern>` with animated opacity) play across the underwater surface. The app is half submerged. Content still works. You just have to scroll things above water to read them clearly.

At level 100%: the entire app is underwater. The `feTurbulence` filter covers everything. Bubbles everywhere. Caustics on every surface. The `bg-bg` background color shifts to deep ocean (`#0A1628`). The TabBar has animated seaweed SVG `<path>` elements growing upward from its top edge.

The escape valve: Fog Horn rest days drain the water. Each `addFogDay()` call reduces `waterLevel` by 2 percentage points. This creates a genuinely novel dynamic: practice fills the app (good! progress! but also... drowning?), while rest days let the water recede (breathing room! but also... losing the aesthetic?). The tension is hilarious and meaningful.

"Snorkel Mode" toggle in `SettingsPage` lets users freeze the water level at any value. Want permanent half-submerged aesthetic? Lock it. Want your dry app back? Drain to zero and lock. This is the safety valve that makes the entire ridiculous concept viable for daily use.

#### Per-Page River Presence

- **Home:** The hero stat (`h1`, 64px, `formatHours(totalMinutes)`) floats on the water surface. As hours accumulate and the waterline rises, the stat area's `padding-top` increases dynamically to keep it above water: `paddingTop: Math.max(48, waterLevel * 2)px`. The `flow-pill` streak indicator bobs on the waterline like a buoy -- it gets a CSS `animation: bob 3s ease-in-out infinite` that only activates when its vertical position is within 30px of the waterline. The `QuoteCard` daily quote, being toward the bottom of the page, is the first to go underwater. Its text becomes beautifully illegible behind the refraction distortion. This is, frankly, fine. When your total hours exceed 500, the settings gear `<svg>` icon in the top-right gets a tiny additional `<path>` drawn over it that forms a scuba mask. There is no setting for this. It just appears.

- **Timer (expanded):** The timer runs as normal (it is z-50, above the water layer at z-2). But every 5 minutes of running time, an animated SVG water droplet falls from the bottom of the timer digits down toward the waterline, creating a "plop" ripple animation (expanding `<circle>` with fade). If the user stares at the waterline during an active timer, they can see it creep up by approximately 0.01% per minute of real-time practice -- the `waterLevel` updates live as `elapsed` grows. The `SoundscapePanel` rain audio now has a dual meaning: the rain is filling the app. You are doing this to yourself. At high water levels, the `timerState === 'stopped'` success screen shows the timer digits sinking slowly below the waterline over 3 seconds before the save UI appears.

- **Log (form):** When you tap a high-duration preset (the `45` or `60` buttons), a tiny tooltip fades in below the button for 2 seconds: "That is a lot of water." The submit button text changes from the current `Log ${formatDuration(effectiveDuration)}` to `Release ${formatDuration(effectiveDuration)} into the app`. The success screen (`logged === true` branch) replaces the checkmark animation with a tiny bathtub SVG that fills with water over 1 second, overflows, and the overflow feeds into the waterline visible behind the success message. The `logSummary` text "Added 30m to your river" gains a parenthetical at high water levels: "Added 30m to your river (it is getting deep in here)."

- **Reference (Shed):** The `FretboardDiagram` SVG floats on the water surface. Fret positions that are below the waterline (computed from the fret's y-position vs the waterline's y-position in the viewport) get a blue tint overlay -- their note dots render with an additional `fill-opacity: 0.5` and a blue color shift. If the water level is very high (>70%), some `PositionDiagram` components at the bottom of the positions row are fully submerged, and you have to use `scroll_to` to bring them above water to read them. The `CircleOfFifths` SVG sits at the waterline and gets a CSS `animation: bob 4s ease-in-out infinite` -- it gently rocks as waves push it. Is this practical? Absolutely not. Is it memorable? Unforgettable.

- **Stats (River):** The river page has a paradoxical relationship with the rising water: the more you practice, the more the `<RiverSVG>` visualization is obscured by the water your practice created. The Catmull-Rom spline river path is fully visible above the waterline but progressively distorted and tinted below it. At very high water levels, you cannot even see your early practice days anymore -- they are deep underwater, hidden behind the `feTurbulence` refraction. But you can tap anywhere on the underwater zone to trigger a "depth sounder" -- a 3-second animation where the refraction clears from top to bottom, revealing the full river in a clean x-ray style rendering (white strokes on dark blue, like sonar imagery), before the water effect fades back in. This depth-sounder view accidentally becomes the most beautiful single screen in the app. People will screenshot it and share it. They will not know how they got there. That is fine.

#### Real-Time Action Responses

- **Starting the timer:** The water surface (the animated wavy `<path>` SVG) begins to ripple more actively -- its wave `amplitude` increases from 3px to 6px and its `frequency` doubles. A tiny animated faucet SVG icon (20x20px) appears at the top-right corner of the viewport and drips at 1-second intervals. Each drip is a 4px `<circle>` that falls and merges into the waterline with a micro-splash.
- **Completing a session:** The `waterLevel` jumps by the appropriate amount with a 500ms splash animation: the waterline overshoots by 3% then settles back. If this pushes the waterline past a card boundary (computed from DOM positions), that card visibly goes underwater with a satisfying sound effect -- a pitch-shifted "glub" played through the existing `audioCtx` (a 200ms sine wave at 120Hz with rapid decay). The moment a card goes under is genuinely funny every single time. Users will try to predict which card drowns next.
- **Fog Horn:** When `handleFogHorn()` fires, the `waterLevel` drops by 2% with a draining animation: a small whirlpool SVG (a rotating `<path>` spiral) appears at the center of the screen for 2 seconds, and the waterline lowers. Rest days literally save the app from drowning. The Fog Horn's existing `navigator.vibrate?.([40, 20, 60])` haptic now has a visual counterpart: the drain.
- **Milestone:** A rubber duck SVG pops up from below the waterline, bobs on the surface for 5 seconds displaying the `milestone.label` text in a speech bubble, then slowly sinks back down. Each milestone gets a different colored duck (mapped from `milestone.emoji` to a fill color). The rubber duck is 40x40px and rendered with genuine care -- it has a beak, a wing, and a tiny sailor hat. This is the single most shareable moment in the app.
- **1000 hours -- fully submerged:** The app transitions to "Deep Water" mode. Everything is underwater. The `bg-bg` CSS variable shifts to `#0A1628`. Bioluminescent particles (teal and magenta SVG dots with radial gradient fills) replace the standard bubbles. The TabBar grows animated seaweed SVG paths from its top edge. The `getGreeting()` function returns "You have become the river." The settings page gains a "Surface" button that resets the waterLevel to zero with a dramatic 3-second draining animation. But honestly? Most people will stay submerged. It is beautiful down here.

#### What Makes It Unique

It is the only proposal where the river is an *antagonist*. Practice is good! But practice fills your app with water! The tension between "I want to practice more" and "my app is drowning" creates a relationship with the visualization that no tasteful ambient layer could ever achieve. Users will screenshot the moment their daily quote goes underwater. They will share the rubber duck milestones. They will race to 1000 hours just to see Deep Water mode. They will hold their phone up to friends and say "look, my fretboard is drowning."

It is a practice app with a sense of humor about itself, and humor -- as every guitarist knows -- is what gets you through the hard sessions. The 2am noodling sessions. The barre chord plateau. The week where you only practiced for 5 minutes because life happened. Tidal Nonsense says: keep going, and your app will literally flood. That is either a reward or a punishment, and the ambiguity is the entire point.

Also: the phrase "I practiced so much my app is underwater" is the best possible word-of-mouth marketing sentence for a practice tracking app. You cannot buy that kind of virality. You can only flood it.

---

### Integrator's Recommendation

Combine **Proposal 2 (Capillary Action)** as the base integration layer with **Proposal 4 (Seasonal Watershed)** as the emotional system.

Capillary Action provides the lightest possible ambient presence -- CSS custom properties that make every existing UI element river-aware without adding new render layers. It costs almost nothing in performance and touches every page through the existing design system. This is the foundation: the river as CSS, not as component.

Seasonal Watershed provides the emotional intelligence -- the *reason* the river looks different today than it did yesterday. The season computation drives the CSS custom properties that Capillary Action distributes. Together they create an app where the visual identity shifts with your practice patterns, propagated through the entire UI via variables rather than overlays.

Borrow the tab-bar routing animation from **Proposal 3 (The River Runs Through It)** -- the idea of the river visibly re-routing through the active tab icon is too good to leave on the table. Implement it as a single thin SVG `<path>` in the TabBar area, not the full page-spanning channel.

And keep **Proposal 5 (Tidal Nonsense)** as an unlockable easter egg. Hide it behind a "Flood Mode" toggle in Settings that appears after 50 total hours. It is too funny and too viral to discard, but too disruptive to be the default. The rubber ducks alone justify the engineering time.
