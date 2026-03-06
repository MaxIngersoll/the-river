# Competition C: The Pitch — Deck Content & Narrative

> The pitch deck looks cinematic but doesn't explain what the app actually does. Fix that.

---

## The Brief

The pitch deck (`public/pitch.html`) is an 11-slide scrollable presentation with beautiful ink wash animations, a market research slide, and a cinematic visual feel. But it has critical content gaps:

### Current Problems
1. **No app walkthrough** — The deck never shows what you DO in the app. There's no timer demo, no session logging flow, no "here's what it looks like."
2. **No feature showcase** — The metronome, rain soundscape, reference tools, fog horn rest days, bottle messages, reading ceremonies — none of these are mentioned.
3. **Scrolling is janky** — The scroll gets stuck on first try, then skips slides. The IntersectionObserver-based snap doesn't feel smooth.
4. **No screenshots or concept art** — Purely text and animated elements. Needs visual proof of the product.
5. **Narrative arc is incomplete** — Goes from problem → philosophy → [gap] → market → ask. The "product" section is too vague.

### Current Slides
| # | Title | Content |
|---|-------|---------|
| 0 | "The River" | Hook with animated headline |
| 1 | "90% quit in 90 days" | Problem statement |
| 2 | Philosophy | River metaphor explanation |
| 3 | Product | Vague description, no visuals |
| 4 | Experience | "It just works" claims |
| 5 | The Source | Origin story |
| 6 | Proof | Traction numbers |
| 7 | Market | Competitor landscape (recently updated) |
| 8 | Model | Business model |
| 9 | Vision | Future roadmap |
| 10 | "Fund the river" | CTA/ask |

### What's Needed
- 2-3 NEW slides showing the actual app experience (timer, reference tools, soundscape)
- Concept art or SVG mockups of the app UI
- Fix scroll behavior (smooth snap, no skipping)
- Stronger narrative flow through the product section

### Technical Context
- Standalone HTML file with inline CSS/JS
- IntersectionObserver for slide visibility
- Scroll-snap CSS for navigation
- Ink wash SVG animation system (11 states)
- Mouse-following ambient glow
- No external dependencies

---

## Constraint-Based Personas

### The Storyteller
**Constraint:** The deck must follow a 3-act narrative arc. Act 1: The problem (why guitarists quit). Act 2: The solution (what The River does differently). Act 3: The opportunity (market + ask). Every slide must advance the story. No slide can exist just because it's pretty. If a slide doesn't move the story forward, cut it.

### The Demo Designer
**Constraint:** Must design the "product showcase" slides — how to visually demonstrate the app's features WITHOUT requiring a live demo. Use SVG mockups, concept art, or animated recreations. Must show: the timer flow, the practice logging, the soundscape, the reference tools. The viewer should FEEL what using the app is like.

### The Scroll Engineer
**Constraint:** Must fix the scrolling experience. The current implementation uses IntersectionObserver + scroll-snap but it's janky. Must achieve: buttery smooth transitions, no skipping, keyboard/touch/trackpad all feel natural, reliable slide-by-slide progression. Performance must stay at 60fps with the ink wash running.

---

## Evaluation Criteria (50 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Narrative Clarity | 15 | Does the deck tell a compelling, complete story? |
| Product Showcase | 12 | Do viewers understand what the app does? |
| Scroll Feel | 10 | Is navigation smooth and reliable? |
| Visual Integration | 8 | Do new slides match the existing aesthetic? |
| Investor Impact | 5 | Would this get a meeting with a VC? |

---

## Special Awards

### The Wildcard Award — Most Creative Idea
### The Comedy Award — Funniest Moment

---

## The Storyteller — Proposals

---

### Proposal 1: "The Callus"

**Evocative Name:** The Callus — Because every good story needs a wound that becomes a strength.

**Narrative Structure (3 Acts, 14 slides):**

The current deck has a hole in the middle. It goes from "here's the problem" to "here's the market" without ever making you *feel* what using The River is like. The Callus fixes this by treating the product section as Act 2 of a hero's journey — the guitarist is the hero, the app is the mentor, and each feature is a gift the mentor gives.

**Act 1: The Wound (slides 0-2) — "Why guitarists bleed out"**

- **Slide 0 — "The River" (KEEP).** Hook. No changes needed. The shimmer text and typewriter work.
- **Slide 1 — "90%" (KEEP, MODIFY).** Add a second beat after the stat: a small scrolling ticker of *real reasons people quit* from The Source data — "I forgot why I started," "I missed two days and felt like a failure," "Nobody noticed." Makes the stat feel human, not clinical.
- **Slide 2 — "The Sunday Morning" (KEEP, MODIFY).** This is already the deck's best slide. Rename from "Philosophy" to "The Sunday Morning." The quote stays. But add a one-line setup above the card: "We asked 200 guitarists why they picked up the guitar." Now the quote has context. Now it's research, not just poetry.

**Act 2: The Mentor's Gifts (slides 3-7) — "What The River actually does"**

This is where the current deck collapses. Five slides. Each one is a specific feature. Each one answers the question the *previous* slide raised.

- **Slide 3 — "The Flow" (REPLACE current product slide).** NEW CONTENT. Show the timer in action via an SVG phone mockup with an animated countdown, the rain soundscape waveform rippling across the screen, and a metronome pulse dot. Headline: "One tap. Rain falls. Time flows." Subtitle: "The practice timer strips away everything except you and the guitar." This is the moment the viewer understands what the app *is.*
- **Slide 4 — "The River Grows" (REPLACE current experience slide).** NEW CONTENT. The SVG river visualization — show three states side by side: Week 1 (a thin trickle), Month 2 (a widening stream), Month 6 (a full river with tributaries). Headline: "Every minute becomes the river." Subtitle: "Your practice history isn't a bar chart. It's a living thing." This answers: "OK, I timed myself. So what?"
- **Slide 5 — "Fog Horns & Bottles" (NEW SLIDE).** The emotional core. Split screen: left side shows a Fog Horn activation ("Rest days that protect your streak — because rivers pause but never stop"), right side shows a Message in a Bottle being written and then washing ashore 30 days later. Headline: "The features no spreadsheet would build." This is the differentiator slide. This is what makes an investor lean forward.
- **Slide 6 — "The Source" (KEEP, MODIFY).** Reframe. Instead of just showing the margin note, show the *arc*: "Day 1, the app asks why you started. Hour 25, it writes you a letter. Hour 50, The Reading." Show three stacked cards that reveal progressively. This is the feature that makes people cry. Use it.
- **Slide 7 — "Built. Shipped. Played." (KEEP).** Proof slide stays. But reorder the stats: lead with "0 servers needed / 100% offline" because that's the technical surprise, then the hours/sessions as social proof. Add one new stat: "1 founder" — it's a flex.

**Act 3: The Opportunity (slides 8-10) — "Why now, why this, why us"**

- **Slide 8 — Market (KEEP).** The competitor landscape slide is already strong. No changes.
- **Slide 9 — Model (KEEP, MODIFY).** Move the tier grid to be more compact. Add a one-line insight above it: "Strava is free to run. The money is in the meaning." This reframes freemium as strategy, not desperation.
- **Slide 10 — Vision (KEEP, MODIFY).** Cut "Every musician deserves a river" (too soft for a close). Replace with: "Guitar is the wedge. Practice is the platform. 40M guitarists. Then pianists. Then painters. Then anyone trying to become who they want to be."
- **Slide 11 — "Fund the river" (KEEP).** CTA stays. Add email and a "Try it now" link to the live PWA.

**New Slides:** 1 new slide (Fog Horns & Bottles at position 5). Total: 12 slides (one added).

**Slides Modified:** 1 (90%), 2 (Philosophy), 3 (Product — full replace), 4 (Experience — full replace), 6 (Source — reframed), 7 (Proof — reordered), 9 (Model — insight added), 10 (Vision — stronger close).

**Slides Removed:** None removed, but slides 3 and 4 are gutted and rebuilt.

**What Makes It Unique:** The Callus treats each feature as an *answer* to the question the previous slide asked. Slide 1 asks "why do they quit?" Slide 2 answers "because they forget why they started." Slide 3 answers "so we built a timer that makes starting effortless." Slide 5 answers "and we built rest days so missing one day doesn't kill you." Every slide is a domino. Knock one over and the whole deck falls forward into "Fund the river." No slide exists in isolation.

---

### Proposal 2: "The Dropout's Diary"

**Evocative Name:** The Dropout's Diary — Tell the story of one specific guitarist from quitting to flowing.

**Narrative Structure (3 Acts, 13 slides):**

Forget the abstract. This proposal follows one fictional guitarist — let's call her Maya — from the moment she buys a guitar to the moment she nearly quits to the moment The River saves her practice habit. Every slide is a diary entry. The investor doesn't learn about features; they *watch someone use them.*

**Act 1: Maya's Guitar (slides 0-3) — "The death of enthusiasm"**

- **Slide 0 — Title (KEEP).** "The River. Practice Flows."
- **Slide 1 — "Day 1" (MODIFY 90% slide).** Instead of just "90% quit," open with: "Day 1. Maya buys an acoustic. She's going to learn Blackbird." Then, below: "90% of beginners quit within a year." The stat hits harder because now it threatens someone we care about.
- **Slide 2 — "Day 47" (MODIFY philosophy slide).** Maya's diary: "I haven't picked it up in two weeks. The case is behind the couch now. I keep meaning to..." Below the quote, in small text: "This is where 90% of the story ends." Gut punch. We just watched enthusiasm die.
- **Slide 3 — "Day 48" (NEW SLIDE).** Maya finds The River. One line: "A friend sends her a link. She opens it. The app asks one question: *Why did you pick up the guitar?*" This is The Source in action, but we're *showing* it through Maya's story.

**Act 2: Maya's River (slides 4-8) — "What happened next"**

- **Slide 4 — "The First Session" (REPLACE product slide).** Phone mockup: Maya taps Start. Rain begins. The timer counts. 4 minutes. That's it. But the river has its first drop. Headline: "Four minutes. Her river begins." Show the SVG phone with "4m" and a tiny blue trickle.
- **Slide 5 — "Day 52: The Fog" (REPLACE experience slide).** Maya misses a day. But instead of a broken streak, The River shows a Fog Horn. "Rest days that protect your streak." Maya's diary: "I didn't play today but it says that's OK? This is the first app that didn't guilt-trip me." Show the fog horn UI element.
- **Slide 6 — "Day 80: The Bottle" (NEW).** Maya writes a message in a bottle: "I hope I can play Blackbird by Christmas." It disappears into the river. Show the bottle message UI. "She won't see this again for 30 days."
- **Slide 7 — "Hour 25: The Reading" (MODIFY Source slide).** The app has been silently writing margin notes. At 25 hours, Maya gets The Reading — a ceremony where the app reflects her journey back to her. Show the Reading UI. "You started because of Blackbird. Twenty-five hours in, the song is becoming yours." Maya cries. (The investor cries.)
- **Slide 8 — "Day 180" (MODIFY Proof slide).** Maya's river is wide. 87 sessions. 52 hours. She can play Blackbird. The stat grid shows HER numbers, but we know they're really the app's real usage data. Dual-purpose: character resolution AND traction proof.

**Act 3: Maya x 40 Million (slides 9-12) — "Now multiply"**

- **Slide 9 — "There are 40 million Mayas" (MODIFY Market).** Same competitor data, but reframed: "Everyone's teaching Maya the chords. Nobody's making sure she practices."
- **Slide 10 — Model (KEEP).** Pricing tiers. Compact. Clean.
- **Slide 11 — Vision (MODIFY).** "Maya plays guitar. But this isn't a guitar app. It's a practice app." Roadmap to multi-instrument.
- **Slide 12 — "Fund the river" (KEEP).** CTA stays.

**New Slides:** 2 new slides (Day 48, Day 80: The Bottle). Total: 13 slides.

**Slides Modified:** 1 (90% becomes Day 1), 2 (Philosophy becomes Day 47), 3 (Product becomes First Session), 4 (Experience becomes The Fog), 5 (Source becomes The Reading with more arc), 6 (Proof becomes Day 180 as character resolution), 7 (Market reframed through Maya).

**Slides Removed:** None structurally, but every slide is rewritten through Maya's lens.

**What Makes It Unique:** This is the only proposal that makes you care about a *person*. Investors see thousands of decks with stats and feature lists. They remember stories. Maya's diary turns a practice tracking app into an emotional narrative. The risk: it's unconventional and some investors might find it "too creative." The reward: the ones who feel it will *fight* to fund it. Also, the Maya framing lets you demo every single feature (timer, fog horn, bottles, Source, Reading) without a single bullet point. You *show* the feature by showing Maya using it.

---

### Proposal 3: "The Graveyard" (THE WILD/RISKY ONE)

**Evocative Name:** The Graveyard — Open the deck with every guitar app that failed, then burn the graveyard down.

**Narrative Structure (3 Acts, 13 slides):**

This proposal is confrontational. It starts by showing the audience a graveyard of dead guitar apps and failed practice habits — then systematically explains why The River is the first one built to survive. It's a debate deck, not a storybook.

**Act 1: The Graveyard (slides 0-3) — "Everything before us failed"**

- **Slide 0 — "The River" (KEEP).** But add a subtitle below "Practice Flows": "(...finally.)" Yes, that's cheeky. That's the point.
- **Slide 1 — "The Graveyard" (REPLACE 90% slide).** NEW CONCEPT. Show a grid of tombstones. Each tombstone is a guitar app or practice method that died: "Guitar Practice Log — R.I.P. 2019, avg session: 0," "New Year's Resolution — Jan 1 to Jan 14," "YouTube tutorial rabbit hole — 3 hours, 0 minutes practiced," "The sticky note on the fridge." Dark humor. Investors laugh. But the message is dead serious: every existing solution has the same failure mode.
- **Slide 2 — "Cause of Death" (MODIFY philosophy slide).** Diagnosis: "They all tracked practice. None of them made practice *matter*." Then the real Source quote: the Sunday morning one. "This is what matters. This is what every app forgot to ask."
- **Slide 3 — "The Autopsy" (NEW SLIDE).** Three columns. Column 1: "Lesson Apps" (Fender Play, Yousician) — "They teach. 90% still quit." Column 2: "Tracking Apps" — "Spreadsheets with gradients. No soul." Column 3: "Gamification" (Rocksmith, Duolingo-style) — "Streaks that punish. Points that don't matter." Below: "The River is none of these." This is the market slide pulled forward to Act 1, weaponized as contrast rather than just data.

**Act 2: The Resurrection (slides 4-8) — "What we built differently"**

- **Slide 4 — "What if practice had a pulse?" (REPLACE product slide).** The timer. SVG phone. Rain. Metronome dot. "No lessons. No scores. No judgment. Just rain, time, and you." This is the anti-graveyard.
- **Slide 5 — "What if missing a day didn't kill you?" (REPLACE experience slide).** The Fog Horn. "Every app in the graveyard punished rest. We built rest into the system." Show the fog horn UI mockup.
- **Slide 6 — "What if the app remembered why you started?" (MODIFY Source).** The Source + margin notes + Reading Ceremony, presented as one continuous system. "Day 1: we ask. Hour 25: we reflect. Hour 50: we celebrate."
- **Slide 7 — "What if your practice was alive?" (NEW).** The river visualization, messages in bottles, the whole living-data concept. "Your history isn't a chart. It's a river. And it carries notes from your past self downstream."
- **Slide 8 — Proof (KEEP, MODIFY).** Retitle: "Proof of Life." Same stats. New framing: "One founder. Zero servers. 43 hours tracked. 75 sessions. The river is already flowing."

**Act 3: The Market (slides 9-12) — "The grave is dug. We're not going in it."**

- **Slide 9 — Market (MODIFY).** The concentric rings stay but retitle: "The $1.2B graveyard — and the hole nobody's filling." Same data, darker edge.
- **Slide 10 — Model (KEEP).** No changes needed.
- **Slide 11 — Vision (MODIFY).** "We started with guitar because guitar has the highest quit rate of any instrument. When we solve guitar, we solve practice."
- **Slide 12 — "Fund the river" (KEEP).** Final line change: "Seeking $750K to prove that practice doesn't have to die."

**New Slides:** 2 new slides (The Autopsy, "What if your practice was alive?"). Total: 13 slides.

**Slides Modified:** 0 (subtitle tweak), 1 (full replace with Graveyard), 2 (reframed as Cause of Death), 3 (product gutted), 4 (experience gutted), 5 (Source expanded), 8 (Proof retitled), 7 (Market edged up), 10 (Vision reframed).

**Slides Removed:** The current market slide's competitor landscape is folded into The Autopsy (slide 3) so it serves the narrative earlier. The Act 3 market slide keeps the TAM rings.

**What Makes It Unique:** This is the only deck that starts with *failure*. Most pitch decks say "here's the opportunity." The Graveyard says "here's all the corpses, and here's why we're different." It's confrontational, funny, and memorable. The "What if..." slide pattern in Act 2 creates a rhythm that builds momentum. Each "What if" is an answer to a tombstone from slide 1. The risk is that some investors will find the graveyard metaphor too aggressive. The reward is that nobody will forget this deck. Ever. Also, the sticky note on the fridge tombstone is objectively funny. Comedy Award contender.

---

### Proposal 4: "The Two Rivers"

**Evocative Name:** The Two Rivers — Show two parallel timelines: the guitarist with The River, and the one without.

**Narrative Structure (3 Acts, 12 slides):**

This is a split-screen narrative. Every slide in Act 2 has two halves: the left side shows what happens *without* The River (the default), and the right side shows what happens *with* it. It's the world's simplest A/B test, and it makes the value proposition physically visible.

**Act 1: The Fork (slides 0-2) — "Two paths from the same starting point"**

- **Slide 0 — "The River" (KEEP).** No changes.
- **Slide 1 — "90%" (KEEP, MODIFY).** After the stat, add: "But what if it didn't have to be?" This creates the fork.
- **Slide 2 — "Two Guitarists" (REPLACE philosophy slide).** NEW CONCEPT. "Same guitar. Same apartment. Same song. Same Monday night. One has The River. One doesn't. Here's what happens." The Source quote stays, but as a caption: "Both of them started for the same reason."

**Act 2: The Divergence (slides 3-7) — "Week by week, they split apart"**

- **Slide 3 — "Week 1" (REPLACE product slide).** Split screen. LEFT: "Opens YouTube. Watches 40 minutes of tutorials. Plays for 5 minutes. Feels overwhelmed." RIGHT: "Opens The River. Taps Start. Rain falls. Plays for 8 minutes. The river has its first drop." Phone mockup on the right. Nothing on the left (or a sad YouTube screenshot silhouette).
- **Slide 4 — "Week 3: The Miss" (REPLACE experience slide).** Split. LEFT: "Misses two days. The guilt spiral begins. The guitar goes behind the couch." RIGHT: "Misses a day. Activates a Fog Horn. Streak protected. Picks up the guitar the next day." Fog Horn mockup on the right. An empty couch silhouette on the left.
- **Slide 5 — "Month 2: The Drift" (NEW).** Split. LEFT: "Opens the guitar app again. Sees '0 days streak.' Closes it. Doesn't reopen." RIGHT: "Writes a message in a bottle: 'I hope I'm good enough to play at the family reunion.' It drifts downstream." Bottle UI mockup.
- **Slide 6 — "Month 4" (MODIFY Source).** Split. LEFT: "The guitar case collects dust. The guitarist has forgotten they own one." RIGHT: "Hour 25. The Reading arrives. 'You started because of Sunday mornings. Twenty-five hours in, the song is becoming yours.' The guitarist cries." Source/Reading mockup.
- **Slide 7 — "Month 6" (MODIFY Proof).** Split becomes unified. LEFT: "The guitarist is part of the 90%." RIGHT: "The guitarist has 52 hours logged, 87 sessions, and a river that stretches across the screen." Then the screen merges: "One product. One difference." Stats grid appears as proof.

**Act 3: The Scale (slides 8-11) — "Now imagine 40 million forks"**

- **Slide 8 — Market (KEEP, MODIFY).** "Every competitor built for the right-side guitarist. We built for the left-side guitarist — the one about to quit." Same data. New emotional context.
- **Slide 9 — Model (KEEP).** Unchanged.
- **Slide 10 — Vision (KEEP, MODIFY).** "Guitar is the first fork. Then piano. Then every skill that dies in silence."
- **Slide 11 — "Fund the river" (KEEP).** Unchanged.

**New Slides:** 1 new slide (Month 2: The Drift). Total: 12 slides.

**Slides Modified:** 1 (90% — fork added), 2 (Philosophy replaced with Two Guitarists), 3 (Product replaced with Week 1 split), 4 (Experience replaced with Week 3 split), 5 (Source replaced with Month 4 split), 6 (Proof reframed as convergence), 7 (Market reframed), 10 (Vision reframed).

**Slides Removed:** None.

**What Makes It Unique:** Split-screen is a storytelling device that *no one uses in pitch decks.* It turns every feature into a before/after without needing the words "before" or "after." It also solves the demo problem elegantly: the right side of every split shows the actual UI, so by slide 7, the investor has seen the timer, fog horn, bottles, Source, and Reading — all without a single feature bullet list. The visual contrast does the selling. The left side also gets progressively darker/emptier as the right side gets richer, which creates a visceral emotional gap. The risk: it's a lot of design work per slide. The reward: it's the clearest possible way to show the product's value because you're literally seeing the counterfactual.

---

### Proposal 5: "The Set List"

**Evocative Name:** The Set List — Structure the deck like a concert, because musicians think in sets, not slides.

**Narrative Structure (3 Acts, 13 slides):**

Musicians don't think in "acts" or "slides." They think in set lists. The opener grabs attention. The deep cuts build the set. The encore brings it home. This proposal restructures the deck as a three-set performance, with each slide as a song. It's playful, on-brand, and structurally tight.

**Set 1: The Opener (slides 0-3) — "Tuning up / Getting the crowd"**

- **Slide 0 — "Soundcheck" (MODIFY title slide).** "The River" stays, but add a tiny setlist card in the corner: "11 slides. 3 minutes. No guitar solos." This is a wink at the investor. It says: this deck respects your time. Also, it's funny.
- **Slide 1 — "The Opening Riff" (KEEP 90% slide, retitle).** The 90% stat is the opening riff — loud, impossible to ignore. Modify subtitle: "The biggest audience in music is the one that walked out." Ouch. Good.
- **Slide 2 — "Track 1: Why They Started" (KEEP philosophy slide, retitle).** The Source quote is the first ballad in the set. It slows the room down. Keep it exactly as-is but label it as a "track" to maintain the concert metaphor.
- **Slide 3 — "Track 2: Why They Stopped" (NEW SLIDE).** Three cards, each with a real quit reason: "I missed one day and the streak shamed me," "I watched tutorials for an hour and practiced for zero," "Nobody noticed I stopped." These are the verses of the same song. Setup for the set break.

**Set 2: The Deep Cuts (slides 4-8) — "The songs nobody expected"**

This is where the product lives. Each "track" is a feature.

- **Slide 4 — "Track 3: Rain" (REPLACE product slide).** The timer + soundscape. SVG phone mockup with rain animation and metronome pulse. "No lessons. No scores. Just rain and time." Subtitle: "The session starts with one tap. The session ends when you're done."
- **Slide 5 — "Track 4: Fog" (REPLACE experience slide).** Fog Horn feature. "Track 4 is a rest day. And that's the point." Show the fog horn UI. "Rest days that protect your streak. Because every great set has a breather."
- **Slide 6 — "Track 5: Bottles" (NEW).** Message in a bottle. "Write a note to future-you. It washes ashore when you least expect it." Mockup of the bottle UI.
- **Slide 7 — "Track 6: The Source" (MODIFY Source slide).** The Reading Ceremony as the climax of the deep cuts set. "The app has been writing about you since Day 1. At Hour 25, you get The Reading." Show the margin notes revealing. "This is the track that makes people cry."
- **Slide 8 — Proof (KEEP, retitle).** "The Reviews Are In." Same stats grid: 43h tracked, 75 sessions, 0 servers, 100% offline. "Built by one musician. Played by one musician. Ready for 40 million."

**Set 3: The Encore (slides 9-12) — "Leave them wanting more"**

- **Slide 9 — Market (KEEP, retitle).** "The Venue." $1.2B market. Competitor grid. "Everyone else is teaching the setlist. Nobody's getting them on stage."
- **Slide 10 — Model (KEEP, retitle).** "Ticket Prices." Free tier / Premium tier. Same content. Concert framing: "General admission is free. VIP is $4.99/mo."
- **Slide 11 — Vision (KEEP, retitle).** "The Tour." Roadmap as a tour poster: "Now playing: Guitar. Coming soon: Piano, Drawing, Language." "Every skill that dies in silence deserves a stage."
- **Slide 12 — "Encore" (MODIFY CTA).** "Fund the River" becomes "Fund the Encore." "Seeking $750K pre-seed. Let's fill the venue." Add the PWA link and email. Final line: "The soundcheck's over. Let's play."

**New Slides:** 2 new slides (Track 2: Why They Stopped, Track 5: Bottles). Total: 13 slides.

**Slides Modified:** 0 (setlist card added), 1 (retitled + subtitle), 3 (product fully replaced with "Rain"), 4 (experience replaced with "Fog"), 5 (Source retitled and expanded), 6 (Proof retitled), 7 (Market retitled), 8 (Model retitled with concert framing), 9 (Vision retitled as tour poster), 10 (CTA reframed as encore).

**Slides Removed:** None, but the old Product and Experience slides are gutted and rebuilt as "Rain" and "Fog."

**What Makes It Unique:** The concert metaphor is *native to the audience.* Guitarists think in sets. Investors have never seen a pitch deck structured as a set list. It's memorable, on-brand (this is literally an app for musicians), and it gives you permission to have personality. The "11 slides, 3 minutes, no guitar solos" opener is an immediate trust-builder. The track numbering creates natural pacing — investors know exactly where they are in the set. And calling the CTA "The Encore" gives the close a sense of earned momentum: you don't play an encore unless the show was good enough to demand one. Risk: some investors might find the metaphor distracting. Reward: every musician-turned-investor (and there are more than you think) will love it. Comedy Award potential with the "no guitar solos" line and "Ticket Prices" for the business model.

---

## The Scroll Engineer -- Proposals

### Diagnosis: Why the Current Implementation Is Broken

Before the proposals, a forensic report on the crime scene. The current scroll system has **three independent navigation systems fighting each other** like guitarists in a band where everyone thinks they're the lead:

1. **CSS `scroll-snap-type: y mandatory`** on `<html>` -- the browser's native snap engine wants to control scroll position.
2. **`scrollIntoView({ behavior: 'smooth' })`** called from keyboard, touch, and nav dot handlers -- this fires its own smooth scroll animation that *conflicts* with the snap engine.
3. **An IntersectionObserver at `threshold: 0.6`** updating `currentSlide` -- but when the browser's snap animation overshoots or the smooth scroll hasn't settled, the observer fires for the *wrong* slide, and the next keyboard press jumps two slides.

The "stuck on first try" bug: On initial load, `currentSlide = 0` but the IntersectionObserver hasn't fired yet, so the first ArrowDown calls `scrollIntoView` for slide 1 while the snap engine is *also* trying to snap. They wrestle. Nobody wins. The user sees a twitch.

The "skips slides" bug: Fast scrolling (trackpad momentum, rapid key presses) triggers multiple `scrollIntoView` calls before the previous one completes. Each call cancels the previous smooth scroll mid-flight but the IntersectionObserver has already updated `currentSlide` to an intermediate value. Result: you leap from slide 2 to slide 5 like a guitarist who skipped the bridge.

The touch handler is also passive (`{ passive: true }`) on `touchend` but calls `scrollIntoView` which doesn't need `preventDefault` -- however it doesn't debounce, so a quick flick can trigger while the previous swipe's smooth scroll is still running.

**Core principle for all proposals below:** The scroll system needs ONE source of truth for slide position, and ONE mechanism for transitioning between slides. Two conductors on stage means cacophony.

---

### Proposal 1: "Still Water" -- The CSS-Only Purist

**Philosophy:** Remove all JS-driven scrolling. Let CSS do what CSS does best: layout and transitions. JS only *reads* state, never *writes* scroll position.

**Technical Approach:**

Strip `scrollIntoView` from every handler. Strip `scroll-snap-type: y mandatory` from `<html>`. Instead, convert the entire slide system into a CSS `scroll-snap` container on a dedicated `<main>` wrapper with `overflow-y: auto`:

```css
main.slide-container {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.slide {
  height: 100vh;       /* exact, not min-height */
  scroll-snap-align: start;
  scroll-snap-stop: always;  /* THE KEY: prevents skipping */
}
```

The secret weapon is `scroll-snap-stop: always`. This tells the browser: "You MUST stop at every snap point. No momentum-skipping allowed." Combined with `scroll-behavior: smooth` on the container, the browser handles all animation natively -- GPU-accelerated, interruptible, matching platform conventions.

For keyboard navigation, instead of `scrollIntoView`, use `container.scrollBy({ top: window.innerHeight, behavior: 'smooth' })`. This works *with* the snap engine rather than against it. The snap will catch the scroll at the next slide boundary.

The IntersectionObserver stays but becomes read-only: it updates the nav dots, ink wash state, and slide counter. It never triggers scroll. `currentSlide` is derived from observation, not from a counter that drifts.

Remove the touch handler entirely. The native `scroll-snap` on the container handles touch/swipe with the OS's own momentum physics. No 50px threshold hack needed.

**Edge Cases:**
- *Fast scrolling:* `scroll-snap-stop: always` prevents momentum from blowing past slides. The browser decelerates into each snap point.
- *Trackpad momentum:* Native scroll + snap handles this perfectly. The OS generates scroll events; the snap catches them.
- *Keyboard rapid-fire:* `scrollBy` is additive and interruptible. Pressing ArrowDown three times fast scrolls 3x viewport height, but the snap engine catches at the nearest snap point. We add a simple cooldown (400ms) on keydown to prevent this.
- *Touch vs mouse:* Both produce scroll events on the container. No differentiation needed.

**Performance Considerations:**
This is the *fastest* possible approach. Native scroll-snap runs on the compositor thread. No JS in the scroll path. The IntersectionObserver fires asynchronously off-main-thread. The ink wash transitions are pure CSS class toggles triggered by the observer. Zero `requestAnimationFrame` loops for scroll. The browser's own compositing handles 60fps because we're not fighting it with JS-driven `scrollTo` calls that force main-thread recalc.

**What Makes It Unique:**
Radical minimalism. The best scroll code is the code you delete. This proposal removes approximately 40 lines of JS (the keyboard handler, touch handler, and scrollTracker observer's write path) and replaces them with 3 CSS properties and a simpler keyboard handler. It trusts the browser. In 2026, scroll-snap is mature -- Safari, Chrome, and Firefox all handle it beautifully. The current implementation is essentially polyfilling behavior the browser already provides, then fighting with the polyfill.

*Still Water runs deep. And it never skips.*

---

### Proposal 2: "The Lock" -- Programmatic Scroll Takeover

**Philosophy:** CSS scroll-snap is a suggestion engine, not a command engine. Take full programmatic control. JS decides when and where the viewport moves. Nothing else.

**Technical Approach:**

Remove `scroll-snap-type` entirely. Remove `scroll-behavior: smooth`. The browser does not scroll on its own -- ever. Instead, implement a state machine:

```js
const ScrollState = {
  IDLE: 'idle',
  ANIMATING: 'animating',
  COOLDOWN: 'cooldown'
};

let state = ScrollState.IDLE;
let currentSlide = 0;
let animationId = null;

function goToSlide(index) {
  if (state !== ScrollState.IDLE) return;  // THE LOCK
  index = Math.max(0, Math.min(index, slides.length - 1));
  if (index === currentSlide) return;

  state = ScrollState.ANIMATING;
  const from = window.scrollY;
  const to = slides[index].offsetTop;
  const duration = 600;
  const start = performance.now();

  function animate(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;  // cubic ease-in-out
    window.scrollTo(0, from + (to - from) * ease);

    if (t < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      currentSlide = index;
      state = ScrollState.COOLDOWN;
      setTimeout(() => { state = ScrollState.IDLE; }, 100);
    }
  }
  animationId = requestAnimationFrame(animate);
}
```

Add `overflow: hidden` to `<html>` during animation to suppress any native scroll interference. Intercept ALL scroll input:

- **Wheel events:** Listen for `wheel` (not passive) with `preventDefault()`. Accumulate `deltaY` over a 150ms window. If accumulated delta exceeds a threshold (50px), trigger `goToSlide(currentSlide + direction)`. This debounces trackpad inertia into single slide transitions.
- **Keyboard:** ArrowDown/Space call `goToSlide(currentSlide + 1)`. The state lock prevents double-fire.
- **Touch:** Track `touchstart` Y, compute delta on `touchmove` (not `touchend` -- this gives earlier response). If delta exceeds 30px, call `goToSlide` and cancel the touch sequence.
- **Nav dots:** Direct `goToSlide(i)` call. The lock prevents conflicts with any in-progress animation.

The IntersectionObserver for slide visibility remains purely for content animations (fade-in, counter animations). It never touches `currentSlide`.

**Edge Cases:**
- *Fast scrolling:* The state lock is absolute. No amount of wheel spam or key mashing can trigger a second transition while one is in flight. Feels deliberate, like a presentation tool.
- *Momentum scrolling:* Wheel event accumulation window absorbs trackpad inertia. One flick = one slide, always.
- *Browser back/forward:* Listen for `popstate` and call `goToSlide` to the appropriate slide.
- *Resize:* Recalculate `slides[index].offsetTop` on resize. Debounced.

**Performance Considerations:**
The `requestAnimationFrame` loop runs for exactly 600ms per transition -- 36 frames at 60fps. During this time, we call `window.scrollTo` once per frame. This is a single synchronous scroll operation per frame, which the browser can composite efficiently. The `overflow: hidden` during animation prevents any layout thrashing from competing scroll sources.

The concern: `preventDefault()` on wheel events means this cannot be passive, which moves wheel handling to the main thread. If the ink wash or other JS causes a long frame, wheel events queue up. Mitigation: ensure the wheel handler itself is trivially cheap (just accumulate a number), and the expensive `goToSlide` is gated by the state lock.

**What Makes It Unique:**
This is how professional presentation tools (Reveal.js, Impress.js, Google Slides) work. Total control means total predictability. The tradeoff is that native scroll feel is gone -- the user cannot "peek" at the next slide by scrolling partway. But for a pitch deck, that's a feature, not a bug. Investors see one slide at a time, exactly as intended. No half-states, no visual jank from mid-snap content, no "oops I'm between two slides" limbo.

*The Lock does not negotiate with momentum.*

---

### Proposal 3: "Downstream" -- The Hybrid Harmonizer

**Philosophy:** Native scroll-snap for the feel, JS guardrails for the reliability. Let the river flow, but build levees.

**Technical Approach:**

Keep CSS `scroll-snap-type: y mandatory` but move it to a `<main>` container (not `<html>`). Keep `scroll-snap-align: start` on slides. Add `scroll-snap-stop: always`. This gives us native smooth snapping as the baseline.

The JS layer adds three guardrails:

**Guardrail 1 -- The Debounced Navigator:**
Replace `scrollIntoView` in keyboard/touch handlers with a debounced wrapper:

```js
let navigationTimeout = null;
let pendingSlide = null;

function navigateTo(index) {
  index = Math.max(0, Math.min(index, slides.length - 1));
  pendingSlide = index;

  if (navigationTimeout) clearTimeout(navigationTimeout);
  navigationTimeout = setTimeout(() => {
    // Only fire if we're not already at the target
    if (pendingSlide !== null) {
      container.scrollTo({
        top: pendingSlide * window.innerHeight,
        behavior: 'smooth'
      });
      pendingSlide = null;
    }
  }, 80);  // 80ms debounce absorbs double-fires
}
```

**Guardrail 2 -- The Truth Reconciler:**
A single IntersectionObserver (replacing the current two overlapping observers) with `threshold: [0, 0.5, 1]` that reconciles `currentSlide` with actual visual state:

```js
const truthObserver = new IntersectionObserver((entries) => {
  let bestEntry = null;
  let bestRatio = 0;
  entries.forEach(entry => {
    if (entry.intersectionRatio > bestRatio) {
      bestRatio = entry.intersectionRatio;
      bestEntry = entry;
    }
  });
  if (bestEntry && bestRatio > 0.45) {
    currentSlide = parseInt(bestEntry.target.dataset.slide);
    updateNavDots(currentSlide);
    updateInkWash(currentSlide);
  }
}, { threshold: [0, 0.5, 1], root: container });
```

This eliminates the bug where the keyboard's `currentSlide` counter drifts from visual reality.

**Guardrail 3 -- The Snap Sentinel:**
A `scrollend` event listener (supported in all modern browsers as of 2024) that verifies we landed on a clean snap point after any scroll:

```js
container.addEventListener('scrollend', () => {
  const expectedTop = currentSlide * window.innerHeight;
  const actualTop = container.scrollTop;
  if (Math.abs(expectedTop - actualTop) > 10) {
    // We drifted. Correct silently.
    container.scrollTo({ top: expectedTop, behavior: 'smooth' });
  }
});
```

**Edge Cases:**
- *Fast scrolling:* `scroll-snap-stop: always` handles the CSS side. The debounced navigator handles the JS side. Belt and suspenders.
- *Momentum:* Native momentum + snap works. The sentinel catches any drift.
- *Touch:* Remove the custom touch handler entirely. Native container scroll handles it. The sentinel catches edge cases.
- *Keyboard rapid-fire:* Debounce collapses rapid presses into the final target. Press Down-Down-Down fast: you go to `currentSlide + 3`, not three separate animations.
- *Nav dot click during animation:* The debounce clears the previous pending navigation and replaces it with the new target.

**Performance Considerations:**
Native scroll on compositor thread for 90% of interactions. The JS guardrails only fire at transition boundaries, not during smooth scroll frames. The `scrollend` event fires once per completed scroll action, not per frame. The IntersectionObserver is asynchronous. Total main-thread scroll cost: near zero during animations, brief reconciliation at rest.

The one risk: `scrollend` support. It landed in Chrome 114, Firefox 109, Safari 17.4. For older Safari, we fall back to a `setTimeout` heuristic after scroll events stop (200ms gap = scroll ended). Graceful degradation.

**What Makes It Unique:**
This is the pragmatic choice. It doesn't throw away native scroll behavior (which users unconsciously expect) and it doesn't pretend CSS alone is sufficient (it isn't, when you need programmatic navigation). The three guardrails are surgical: debounce prevents double-fire, truth reconciliation prevents drift, and the sentinel prevents snap failures. Each guardrail solves exactly one bug from the current implementation. No over-engineering, no under-engineering.

*Downstream: because the best engineering is the kind nobody notices.*

---

### Proposal 4: "Full Moon Tide" -- The WAAPI Scroll Orchestrator

**Philosophy:** The Web Animations API is the most underused tool in the browser. It gives you `element.animate()` with promises, cancellation, fill modes, and compositor-thread rendering. Use it for scroll transitions instead of `requestAnimationFrame` loops or `scrollIntoView`.

**Technical Approach:**

Remove CSS scroll-snap and scroll-behavior. Disable native scrolling with `overflow: hidden` on `<html>`. The viewport is locked. Slides are stacked in a `transform: translateY(0)` container. Slide transitions are CSS transforms driven by WAAPI:

```js
const deck = document.querySelector('.slide-deck');
let currentSlide = 0;
let currentAnimation = null;

function goToSlide(index, options = {}) {
  index = Math.max(0, Math.min(index, slides.length - 1));
  if (index === currentSlide && !options.force) return;

  // Cancel any in-flight animation
  if (currentAnimation) {
    currentAnimation.cancel();
  }

  const from = -currentSlide * 100;
  const to = -index * 100;

  // WAAPI: compositor-thread animation
  currentAnimation = deck.animate([
    { transform: `translateY(${from}vh)` },
    { transform: `translateY(${to}vh)` }
  ], {
    duration: options.duration || 700,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',  // smooth decel
    fill: 'forwards'
  });

  currentAnimation.finished.then(() => {
    // Commit the final position
    deck.style.transform = `translateY(${to}vh)`;
    currentAnimation = null;
    currentSlide = index;
    updateUI(index);
  }).catch(() => {
    // Animation was cancelled (new navigation started)
    // No cleanup needed -- the new animation handles it
  });
}
```

The slide container is a single `<div>` with all slides stacked vertically. No scrolling at all -- the container moves via `transform`. This means:

- No scroll events fire (nothing is scrolling)
- No IntersectionObserver needed for position tracking (we know the position: it's `currentSlide`)
- No conflict between native scroll and JS scroll (there is no native scroll)
- Transitions run on the compositor thread (WAAPI `transform` animations are automatically composited)

Input handling: Same wheel accumulator as Proposal 2, same keyboard handler, same touch handler. All routed through `goToSlide()`. The WAAPI `.cancel()` method provides clean interruption if the user navigates mid-transition.

For the IntersectionObserver-driven content animations (card reveals, counter animations), we replace them with a simple callback in `updateUI()` that triggers `.visible` classes based on `currentSlide`. Since we know the exact slide, no observation is needed.

**Edge Cases:**
- *Fast scrolling:* `.cancel()` on in-flight animation + immediate new animation = clean interruption. No jank, no snap-back.
- *Momentum:* Wheel accumulator debounces trackpad inertia. One gesture = one slide.
- *Touch:* `touchmove` tracking with the same delta threshold. Works identically to wheel.
- *Animation interruption:* WAAPI `.cancel()` is synchronous and frame-accurate. The promise rejects, the new animation starts from the current computed position. No visual glitch.
- *Tab visibility:* WAAPI automatically pauses when the tab is hidden. No wasted CPU.

**Performance Considerations:**
This is the performance champion. `transform: translateY` animations via WAAPI run entirely on the compositor thread. The main thread is completely free during transitions. No `requestAnimationFrame` loop, no `scrollTo`, no layout recalculations. The ink wash transitions (CSS class toggles) happen in `updateUI()` after the animation settles, so they don't compete with the transition frames.

The tradeoff: no native scroll behavior at all. The page doesn't scroll in the traditional sense. This means no browser scroll restoration, no Find-on-Page scrolling to results, and accessibility tools that rely on scroll position won't work. Mitigation: add `aria-live` regions and `aria-current` attributes so screen readers know which slide is active. Add URL hash updates for each slide.

The container needs `will-change: transform` and all slides need `contain: layout style paint` to give the browser maximum compositing freedom.

**What Makes It Unique:**
Nobody uses WAAPI for slide decks. Everyone reaches for `scrollTo` or CSS transitions. But WAAPI gives you the trifecta: compositor-thread performance, promise-based completion handling, and clean cancellation. The `.finished` promise is particularly powerful -- you can chain ink wash transitions, content animations, and analytics events off a single slide transition without any timer hacks or observer heuristics. It's the most modern API for the job, and it's been stable in all browsers since 2022.

*Full Moon Tide: transforms move the earth. Scroll moves a scrollbar.*

---

### Proposal 5: "The Whirlpool" -- FLIP-Animated Slide Portals (THE WILD ONE)

**Philosophy:** What if slide transitions weren't scrolling at all? What if each slide was a portal, and navigating between them was a FLIP animation that morphed the entire viewport? Buckle up. This one is unhinged.

**Technical Approach:**

Throw out scrolling. Throw out scroll-snap. Throw out the idea that slides are "above" and "below" each other. Instead, all 11 slides are absolutely positioned, stacked in the same viewport space, with `opacity: 0` and `visibility: hidden`. Only one is visible at a time.

Transitions use the FLIP (First, Last, Invert, Play) technique:

```js
function portalTo(index) {
  if (index === currentSlide || isTransitioning) return;
  isTransitioning = true;

  const outgoing = slides[currentSlide];
  const incoming = slides[index];
  const direction = index > currentSlide ? 1 : -1;

  // FIRST: capture current state
  const outRect = outgoing.getBoundingClientRect();

  // LAST: make incoming visible at final position
  incoming.style.visibility = 'visible';
  incoming.style.opacity = '1';

  // INVERT: push incoming to starting position
  incoming.style.transform = `translateY(${direction * 100}vh) scale(0.9)`;
  incoming.style.filter = 'blur(6px)';

  // PLAY: animate both
  const outAnim = outgoing.animate([
    { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)' },
    { transform: `translateY(${-direction * 40}vh) scale(0.85)`,
      opacity: 0, filter: 'blur(8px)' }
  ], { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });

  const inAnim = incoming.animate([
    { transform: `translateY(${direction * 100}vh) scale(0.9)`, filter: 'blur(6px)' },
    { transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
  ], { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });

  // The WHIRLPOOL: ink wash particles spiral during transition
  triggerInkVortex(currentSlide, index, direction);

  Promise.all([outAnim.finished, inAnim.finished]).then(() => {
    outgoing.style.visibility = 'hidden';
    outgoing.style.opacity = '0';
    outgoing.style.transform = '';
    outgoing.style.filter = '';
    incoming.style.transform = '';
    incoming.style.filter = '';
    currentSlide = index;
    isTransitioning = false;
    updateUI(index);
  });
}
```

The `triggerInkVortex` function is where it gets truly wild: during the 700ms transition, the ink wash particles and soul line undergo a spiral distortion -- the outgoing slide's ink "drains" like water down a whirlpool while the incoming slide's ink "emerges" from the center. This uses SVG `feTurbulence` with animated `baseFrequency` and a radial wipe mask.

The nav dots become a timeline *river* -- a horizontal SVG path where each dot sits on a flowing line, and the current position is a glowing droplet that flows downstream to the next node. Clicking a distant dot shows the droplet "rushing" through all intermediate nodes.

For keyboard/touch/wheel input: same accumulator pattern as Proposals 2 and 4. All input routes through `portalTo()`.

**Edge Cases:**
- *Fast scrolling:* `isTransitioning` gate prevents stacking. But we queue the NEXT requested slide so that when the current transition finishes, it immediately portals to the final destination. No intermediate stops for rapid navigation.
- *Momentum:* Debounced wheel accumulator. One gesture = one portal. Multiple rapid gestures update the queued destination.
- *Touch:* Swipe direction determines portal direction (up/down still map to next/prev). But because this isn't scrolling, we could also support *horizontal* swipe as an alternate gesture.
- *Nav dot jumping:* Clicking slide 8 from slide 2 does NOT scroll through 3-7. It portals directly with the ink vortex bridging the visual gap. This is actually *better* UX for dot navigation.
- *Accessibility:* `aria-roledescription="slide"`, `aria-label` per slide, `aria-live="polite"` on the container. Screen readers get clear announcements. No fake scrollbar confusion.

**Performance Considerations:**
Here's where honesty is required. This proposal runs two concurrent WAAPI `transform + opacity + filter` animations simultaneously. The `transform` and `opacity` are compositor-friendly. The `filter: blur()` is NOT -- blur is a paint operation that can drop frames on low-end devices. Mitigation: on devices where `navigator.hardwareConcurrency < 4`, skip the blur and use opacity-only transitions.

The ink vortex SVG animation is the real performance risk. Animated `feTurbulence` is expensive. We'd need to pre-render the vortex frames as sprite sheets or use a simplified radial wipe instead of real turbulence on weaker hardware. Feature-detect with a single test frame at init: if the first `feTurbulence` animation drops below 30fps, fall back to a simple crossfade.

The upside: no scroll events, no layout recalculation, no IntersectionObserver. The transition is a pure visual effect disconnected from document flow.

**What Makes It Unique:**
This is not a scroll fix. This is a scroll *replacement*. It reimagines the pitch deck as a portal-based experience closer to a Keynote presentation than a web page. The ink vortex transition would be genuinely stunning -- imagine the current slide's river ink spiraling into a drain while the next slide's ink blooms from the center, with particles tracing the spiral path. No other pitch deck does this because it's slightly insane.

The risk is proportional to the reward. If it works, VCs remember this deck for a year. If the ink vortex chugs on a 2019 MacBook Air, we've built a beautiful tech demo that runs at 24fps and makes the presenter sweat.

But isn't that what a wildcard is for?

*The Whirlpool doesn't scroll. It consumes the current reality and births the next one. (Please test on multiple devices.)*

---

### Proposal Comparison Matrix

| Dimension | Still Water | The Lock | Downstream | Full Moon Tide | The Whirlpool |
|-----------|------------|----------|------------|----------------|---------------|
| Lines of JS changed | -40 (deletion) | +60 (rewrite) | +30 (surgical) | +50 (rewrite) | +120 (new system) |
| Native feel | Best | Presentation-like | Very good | Custom but smooth | Cinematic |
| Skip prevention | CSS-native | State lock | CSS + debounce | State + cancel | Transition gate |
| 60fps confidence | 99% | 95% | 97% | 98% | 75% (blur risk) |
| Accessibility | Native scroll | Needs ARIA work | Native scroll | Needs ARIA work | Needs ARIA work |
| "Wow" factor | Low (invisible) | Low (utilitarian) | Low (pragmatic) | Medium | EXTREMELY HIGH |
| Risk level | Very low | Low | Low | Medium | High |
| Browser support | Excellent | Excellent | Very good | Excellent | Good |
| Implementation time | 1 hour | 2 hours | 2 hours | 2 hours | 4+ hours |

### Recommendation

**Ship Downstream (Proposal 3) for reliability. Prototype The Whirlpool (Proposal 5) as a feature flag.**

Downstream solves every diagnosed bug with minimal code change and zero regression risk. It's the responsible choice. But The Whirlpool could be the thing that makes a VC lean forward in their chair. Build it behind a `?mode=whirlpool` query param. If it runs clean on the presenter's machine, flip the switch. If not, Downstream catches you.

The river always has a plan B.

---

## The Demo Designer -- Proposals

---

### Proposal 1: "24 Hours on the River"

**Evocative Name:** *The Day in the Life*

**Visual Showcase Approach:**

Replace the current vague Product slide (slide 3) and Experience slide (slide 4) with three new slides that walk the viewer through a single day of using The River. This is not a feature list. It is a story told in three acts of a single practice day, rendered as three phone mockups that evolve as you scroll.

**Slide A -- "6:47 PM: The Tap"** shows the moment a guitarist opens the app after work. The phone mockup renders the HomePage in its "evening nudge" state: the italic message "There's still time to add to your river today" (pulled directly from the real HomePage component that checks `new Date().getHours() >= 18`), the "12 day flow" pill pulsing gently in amber (because `todayMinutes === 0` triggers the amber color path in the real code), the 28-day river visualization showing a healthy streak with a conspicuous gap forming for today. The stats row shows "---" for Today, "12" for Streak, "67%" for Week Goal. Below the phone, small text: *"The app doesn't nag. It notices."* A CSS animation slowly pulses the amber dot on the flow pill, identical to the real app's `animate-pulse-glow` behavior. The FAB button in the bottom-right glows blue.

**Slide B -- "6:48 PM: The Session"** shows the timer running. The phone mockup transitions to show the full-screen timer overlay: "Practicing" label, a large `14:32` counter in 72px tabular-nums font (matching the real TimerFAB's `fontVariantNumeric: 'tabular-nums'` and `fontSize: '72px'`), the SoundscapePanel expanded below showing Metronome toggled ON at 80 BPM (the real DEFAULT_PREFS value) with the tap-tempo button, Rain toggled ON with a volume slider at 30% (the real default `rainVolume: 0.3`). Below the phone: *"Metronome. Rain. Nothing else. Deep focus by default."* A subtle CSS animation ticks the timer digits forward every second using stacked `<text>` elements with staggered opacity keyframes -- a flip-clock effect that is pure CSS, not JavaScript.

**Slide C -- "7:05 PM: The Drop"** shows the session-complete state. The phone mockup displays the stopped timer at `17:23`, the note textarea with "Worked on fingerpicking intro -- Dust in the Wind" typed in, three practice tags lit up (Technique, Songs, Fingerstyle -- all real values from `PRACTICE_TAGS` in the codebase) in their real gradient-blue active state, and the "Save 17:23 Session" button glowing. Below the phone: *"17 minutes. One note. Your river grows."* When this slide enters the viewport, a delayed CSS animation plays: the save button depresses (scale 0.97 for 200ms), then the phone cross-fades to show the HomePage with updated stats -- "17m" for Today, "13" for Streak (incremented), "83%" for Week Goal. The river visualization now has today's dot filled blue.

**Specific SVG/HTML Mockup Designs:**

- **Phone frame:** Reuse the existing `.device-frame` class (280x580px, 36px border-radius, notch at top, blue glow shadow) already defined in `pitch.html`. Expand the `.device-screen` interior to contain detailed SVG mockup content instead of the current minimal placeholder.
- **Timer mockup (Slide B):** An SVG `<text>` element at 48px (scaled to fit the phone frame) with `font-variant-numeric: tabular-nums` displaying `14:32`. Below it, an inline SVG recreation of the SoundscapePanel layout: two rows. Row 1: a rounded-rect "Metronome" pill filled with `linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))` (the exact gradient from the real component) + five small circle buttons for -5/-/BPM/+/+5 + a "Tap" pill. Row 2: a "Rain" pill (same blue gradient) + a thin rect slider with blue-to-gray proportional fill at 30%. A divider line, then a speaker icon + master volume slider at 80%.
- **Home screen mockup (Slides A and C):** SVG recreation of the HomePage layout: large hero stat text ("43h 25m" or "43h 42m" after save), a flow pill rendered as a rounded-rect with a small animated circle, 3-column stats grid as rounded-rect cards with centered text, and a simplified 28-day river chart rendered as 28 small SVG circles in a row -- blue for practiced days, gray for missed, with varying radii proportional to session duration.
- **Session logging mockup (Slide C):** An SVG textarea outline with rendered text content inside, tag pills as small rounded-rects (active ones filled with the blue gradient, inactive ones as thin-bordered outlines), and the save button as a full-width rounded-rect with white text.

**Animation/Reveal Approach:**

Each of the three slides uses the existing parallax entrance animations already in the pitch deck CSS (translateY fade-in from `.slide-content` to `.slide-content.visible`). The phone mockup content animates *internally* using CSS-only techniques:

- **Slide A:** The flow pill dot pulses via `animation: pulse 2s ease-in-out infinite` on a small SVG circle. The FAB button gently breathes with a box-shadow animation. The "evening nudge" italic text fades in with a 1.5s delay after the slide enters.
- **Slide B:** Timer digits increment via four stacked `<text>` SVG elements per digit position, each at `opacity: 0`, with `@keyframes` that cycle visibility. The effect: the seconds tick. Rain visualization: 8-10 tiny SVG circles at random x-positions animate downward with `@keyframes drift` (varying duration 3-8s, staggered delays). A small dot near the metronome pill alternates opacity every 0.75s (750ms = 80 BPM) to simulate the metronome visual pulse.
- **Slide C:** A 2-second delay, then the save button scales to 0.97 for 200ms, then back. Then the entire `device-screen` content cross-fades (the "stopped" screen fades to `opacity: 0` while an absolutely-positioned "updated home" screen fades to `opacity: 1` over 600ms). The stat that changed ("17m" for Today, "13" for Streak) briefly flashes with a blue text-shadow glow to draw the eye.

**What Makes It Unique:**

This is not a feature tour. It is emotional time travel. The viewer lives through 18 minutes of someone's evening in three scrolls. They don't learn "the app has a timer" -- they feel the quiet decision to practice, the ambient immersion of the session, and the small satisfaction of watching the river grow. Every mockup detail is pulled from the actual codebase: the exact greeting logic, the exact default BPM, the exact tag names, the exact flow pill color states. An investor sees this and thinks: "I can picture myself using this tonight."

---

### Proposal 2: "The Loneliest Hour / The River Hour"

**Evocative Name:** *The Split Screen*

**Visual Showcase Approach:**

Insert a single new slide between the current Philosophy slide (slide 2) and the Product slide (slide 3). This slide is a diptych -- left half shows "Practice Without The River" and right half shows "Practice With The River." Same guitarist, same evening, radically different experience. Left side is rendered in desaturated coral/gray tones; right side in the app's signature blue palette.

The left panel shows a deliberately ugly, honest depiction of unstructured practice: a phone displaying a generic clock app at 7:12 PM, and below it, a "mental checklist" rendered as handwritten-style text that fades in line by line:

1. "How long have I been playing?"
2. "Did I practice yesterday?"
3. "Am I getting better?"
4. "Should I just stop?"

At the bottom, a small "X" in coral and the text "Gave up after 8 minutes."

The right panel shows The River in action: the same phone frame but now displaying the timer at `12:47` with the soundscape panel visible (rain enabled, metronome at 72 BPM), a "13 day flow" pill at the top, and below the phone, the same mental checklist rewritten:

1. "The timer is running."
2. "Rain is falling."
3. "I'll stop when I stop."
4. "Day 13."

The bottom shows a thin blue river line growing.

Below both panels, centered: *"The difference isn't skill. It's scaffolding."*

**Specific SVG/HTML Mockup Designs:**

- **Left panel phone:** The existing `.device-frame` class but with CSS `filter: grayscale(0.5) brightness(0.8)` applied. Interior contains a minimal SVG clock face (a circle, two lines for hour/minute hands, "7:12" as large centered text). The surrounding glass border uses `--coral` tint instead of the default blue glow. Below the phone: four lines of SVG `<text>` elements in Playfair Display italic (the deck's `--serif` font), each fading in with 0.8s staggered delays.
- **Right panel phone:** Standard `.device-frame` with full blue glow. Interior SVG contains: (1) "Practicing" label at top in 9px uppercase, (2) "12:47" timer in 48px bold tabular-nums, (3) compact soundscape panel -- a "Metronome" blue pill-rect, "72" BPM text, "Rain" blue pill-rect, volume slider bar at 30%, (4) a "13 day flow" pill-rect at the very top with a small pulsing dot.
- **Dividing line:** A 1px-wide SVG `<line>` element running vertically through the slide center with a gradient stroke: transparent at top and bottom, `rgba(255,255,255,0.12)` at center.
- **Background treatment:** The left half has a subtle radial gradient centered on its panel in coral tones: `radial-gradient(circle, rgba(248,113,113,0.06) 0%, transparent 60%)`. The right half uses the existing blue ambient glow.
- **Bottom tagline:** Centered below both panels, in the deck's `.subtitle` style but with `font-weight: 500` for emphasis.

**Animation/Reveal Approach:**

When the slide enters viewport via IntersectionObserver: the left panel slides in from the left (`translateX(-60px)` to `0`, 0.8s ease-out), the right panel slides in from the right (`translateX(60px)` to `0`, 0.8s ease-out with 0.15s delay). Then the checklist lines type in simultaneously on both sides -- left side line 1 appears, then right side line 1, alternating with 0.6s gaps, so the viewer reads them as a dialogue:

- *Left:* "How long have I been playing?" -- *Right:* "The timer is running."
- *Left:* "Did I practice yesterday?" -- *Right:* "Rain is falling."
- *Left:* "Am I getting better?" -- *Right:* "I'll stop when I stop."
- *Left:* "Should I just stop?" -- *Right:* "Day 13."

The left side's final line fades in with `color: var(--coral)`. The right side's final line fades in with `color: var(--river-2)` and a subtle blue text-shadow glow. The tagline fades in 1.5s after the last checklist line.

**What Makes It Unique:**

This is the "show don't tell" slide. Instead of claiming the app helps people stick with practice, you place the two realities side by side and let the viewer's gut do the work. The left panel is painfully relatable -- every person who has ever tried to learn an instrument has had the "Should I just stop?" thought. The right panel doesn't show a miracle; it shows the same person with a little bit of structure. The humor is dark and dry: the left panel's progression from curiosity to despair in four lines hits with unexpected emotional weight for a pitch deck. This is also the only proposal that directly visualizes the *absence* of the product, which is a powerful sales technique -- you sell the pain before you sell the cure. One slide. Maximum impact.

---

### Proposal 3: "Everything in Your Back Pocket"

**Evocative Name:** *The Toolkit Carousel*

**Visual Showcase Approach:**

Replace the current Experience slide (slide 4, the text-only triptych) with a full-width auto-advancing feature carousel. Five phone mockups are arranged in a horizontal row, but only one is "active" at a time -- centered, full-size, full-opacity. The others recede into the background (scaled down, dimmed, blurred). An auto-advance timer rotates through features every 3.5 seconds, pausing when the slide leaves viewport. Five small dot indicators below show position.

The five screens are:

**Screen 1 -- The Timer.** Full-screen timer overlay at `23:41`. "Practicing" label. Pause button (two vertical bars in a blue circle) and stop button (square in a glass circle). Caption: *"One tap to start. That's it."*

**Screen 2 -- The Soundscape.** Timer at `8:12` with the SoundscapePanel fully expanded. Metronome pill ON (blue gradient fill). BPM controls: five small circles with -5, -, 92, +, +5 labels, plus a "Tap" pill. Rain pill ON. Volume slider at 30%. Master volume at 80% with speaker icon. Caption: *"Your private practice room. Metronome. Rain. Tap tempo."*

**Screen 3 -- The Shed (Chords).** Root Lock showing 12 note circles with "C" filled blue. Scale pills with "Major" highlighted. Intent tabs: Chords active. Below: a 4-column grid of 7 diatonic chord cards showing I (C), ii (Dm), iii (Em), IV (F), V (G), vi (Am), vii-dim (Bdim). Scale notes row: C D E F G A B in circles. Caption: *"Every scale. Every chord. Every key. No Googling."*

**Screen 4 -- The Shed (Fretboard).** The Scale intent active. A miniaturized fretboard diagram showing A Minor Pentatonic -- 6 strings, 15 frets, blue dots on scale positions (note indexes 9,0,5,7,3 computed from `INTERVALS.pentatonic_minor` with root A), root notes in solid `#2563EB` circles. Below: 5 tiny CAGED position diagrams (E shape, D shape, C shape, A shape, G shape) sorted by `startFret`. Caption: *"See the whole neck. Tap a position to zoom in."*

**Screen 5 -- The Fog Horn.** HomePage in fog-day state. The flow pill shows "16 day flow" with a fog-cloud symbol and gray background (matching the `todayIsFog` branch in the real component). Greeting: "The river flows in stillness" (the real `h < 5` greeting from `getGreeting()`). A subtle SVG turbulence filter overlays the screen to simulate mist. The evening nudge text is absent (suppressed on fog days, as coded: `todayMinutes === 0 && !todayIsFog`). Caption: *"Rest days that protect your streak. Because rivers pause."*

**Specific SVG/HTML Mockup Designs:**

- **Carousel container:** A `<div>` with `display: flex; justify-content: center; align-items: center;` containing five `.device-frame` instances. CSS custom property `--active` (0-4) controls which phone is prominent. Active phone: `transform: scale(1); opacity: 1; filter: none; z-index: 5;`. Phone at distance 1: `transform: scale(0.72) translateX(var(--dir) * 30px); opacity: 0.35; filter: blur(2px); z-index: 3;`. Phone at distance 2+: `transform: scale(0.55) translateX(var(--dir) * 60px); opacity: 0.15; filter: blur(4px); z-index: 1;`. All transitions: `transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);`.
- **Timer screen (Screen 1):** SVG containing `<text>` "23:41" at 48px bold, "PRACTICING" label at 8px uppercase, two circles for buttons (one with two small rects for pause, one with a square for stop), buttons filled with the blue gradient.
- **Soundscape screen (Screen 2):** The most complex mockup. SVG recreation of the full SoundscapePanel: "Sounds" header pill (rounded rect + chevron path), then a card area containing Row 1 (blue pill "Metronome" + five small circles + "Tap" pill) and Row 2 (blue pill "Rain" + slider rect). Divider line. Speaker icon + slider + "80%" text. All rendered as SVG primitives matching the real component layout.
- **Shed Chords screen (Screen 3):** SVG with: (a) 12 small circles for Root Lock (C filled blue, rest outlined), (b) 7 pill rects for scale types (Major highlighted), (c) 4 tab rects (Chords active), (d) 4x2 grid of small card rects with Roman numerals and chord names. Colors match real `ChordCard`: major in `text-water-4` blue, minor in `text-lavender` purple.
- **Shed Fretboard screen (Screen 4):** Miniaturized `FretboardDiagram`. 6 horizontal lines with stroke-widths 0.8 to 2.4 (matching `STRING_THICKNESS`). 15 vertical fret lines. Dot markers at 3,5,7,9,12 (double at 12). Scale notes as colored circles using `INTERVALS.pentatonic_minor = [0, 3, 5, 7, 10]` with root A (index 9). Below: 5 position diagrams matching the `PositionDiagram` component output.
- **Fog Horn screen (Screen 5):** HomePage SVG with mist overlay using `<filter><feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3"/><feDisplacementMap scale="8"/></filter>` applied to content. Flow pill in gray tones.

**Animation/Reveal Approach:**

A small JavaScript block (inside the pitch deck's existing `<script>` tag) uses `setInterval` gated by IntersectionObserver. When the carousel slide is visible: every 3500ms, increment `--active` (mod 5) by setting a data attribute. CSS derives each phone's transform/opacity/filter from the distance between its index and `--active`. Caption text cross-fades via five absolutely-positioned `<p>` elements. Five small dots below: active dot filled `#3b82f6`, others `rgba(255,255,255,0.15)`.

**What Makes It Unique:**

This is the "product depth" reveal. The current deck makes The River sound like a timer with a metaphor. This carousel exposes that it is a comprehensive guitar practice toolkit: ambient soundscapes with tap tempo, a full music theory reference with interactive fretboard and CAGED positions, intelligent rest-day management with fog horns. Five screens, each rendered with obsessive fidelity to the real codebase. An investor watching this carousel thinks: "Wait, all of THIS is in one app?" That moment of surprise is the whole point. It also answers the hardest VC question -- "What's the moat?" -- by showing that The River is not one feature but an integrated system of interlocking tools.

---

### Proposal 4: "Scroll to Practice"

**Evocative Name:** *The Flipbook*

**THIS IS THE WILD ONE.**

**Visual Showcase Approach:**

Instead of showing phone mockups *on* a slide, turn the slide itself into the app. When the viewer scrolls into the product section, the pitch deck's dark chrome fades away and the viewer finds themselves *inside* a full-bleed recreation of The River's UI. They are no longer looking at a pitch deck. They are using the app.

Here is the mechanism. Slides 3 through 5 are replaced by a single extended scroll zone (3x viewport height) with `scroll-snap-align: none` temporarily disabled. Scroll position within this zone maps to app state transitions via a `--scroll-progress` CSS custom property:

- **0-33% of zone (The Home):** The HomePage materializes from darkness. The "43h 25m" hero stat counts up from "0h 0m" (a CSS counter animation keyed to scroll progress). The 28-day river chart draws itself left to right via animated `stroke-dashoffset`. The "12 day flow" pill appears. The three stats cards stagger in. A QuoteCard fades up: "A journey of a thousand miles begins with a single step." -- Lao Tzu.

- **33-66% of zone (The Session):** A finger-tap CSS animation plays on the FAB button position (a blue ripple circle expanding outward), then the screen transitions to the full-screen timer overlay. The timer starts "counting" (stacked text layers cycling via opacity). Rain particles drift down as tiny SVG circles. A metronome dot pulses. The soundscape panel is visible: Metronome ON at 80 BPM, Rain ON. The viewer is scrolling *through* a practice session.

- **66-100% of zone (The Save):** The timer "stops" at `17:23`. The session-complete form appears: textarea with text auto-typing ("Fingerpicking practice -- getting cleaner"), tags selecting themselves one by one with a pop animation, the note counter ticking up to 38/280. The save button pulses blue. Flash-transition back to the HomePage with updated stats -- "17m" for Today, "13" for Streak, the river has a new blue dot.

At the bottom of the zone, pitch deck chrome fades back in. A single line appears:

*"That was The River. You just used it."*

Then normal slide progression resumes.

**Specific SVG/HTML Mockup Designs:**

- **No phone frame.** The mockup IS the slide. Full viewport becomes the app. Content rendered in a centered 380px-wide column against `--bg-deep`. Elements are real HTML divs with inline CSS mirroring the app's design tokens.
- **Hero stat:** An `<h1>` at `font-size: 64px; font-weight: 700;` with stacked `<span>` layers whose visibility keys to `--scroll-progress`.
- **River chart:** Inline `<svg>` with 28 circles at varying sizes, connected by a path with `stroke-dasharray` and `stroke-dashoffset` that decreases with scroll, creating a drawing effect.
- **Timer overlay:** Full-viewport dark overlay (`background: radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, rgba(12,10,9,0.98) 70%)` -- the real TimerFAB expanded background). Timer at 72px. Buttons as HTML elements with `pointer-events: none`. Soundscape panel as divs.
- **Rain particles:** 15-20 `<div>` elements (3px wide, 8px tall, blue, rounded) with CSS `@keyframes` drifting top to bottom at varying speeds. `animation-play-state` is `running` only when `--scroll-progress` is 0.30-0.70.
- **Session form:** A `<div>` styled as glass-input textarea with text revealing character-by-character via `width: Xch` animation. Tag buttons that transition from gray to blue fill with staggered delays.

**Animation/Reveal Approach:**

A JS scroll handler computes `--scroll-progress` (0.0 to 1.0) for the zone and sets it as a CSS custom property. Elements use `calc()` for all visual state:

```
.home-section { opacity: calc(min(1, var(--scroll-progress) * 3)); }
.timer-section { opacity: calc(min(1, max(0, (var(--scroll-progress) - 0.3) * 5))); }
.save-section { opacity: calc(min(1, max(0, (var(--scroll-progress) - 0.63) * 5))); }
```

Crossfades happen naturally. All animations use `transform` and `opacity` only (compositor-friendly properties). The existing ink wash SVG dims to `opacity: 0.05` during the zone and restores after, avoiding visual competition. Performance stays at 60fps because the scroll handler only sets one CSS custom property per frame.

**What Makes It Unique:**

This is the riskiest proposal by a wide margin. It breaks every convention of pitch decks. There is no phone mockup. There is no "imagine using this." Instead: you ARE using this. The viewer scrolls and becomes the guitarist.

The danger: if scroll performance degrades even slightly, or if the snap-disable creates jarring transitions, the whole illusion collapses into an unusable mess. The reward: if it works, no investor forgets this deck for months. Every other pitch they see that week will feel like PowerPoint.

The humor lives entirely in the punchline: "That was The River. You just used it." -- delivered deadpan after the viewer realizes they were tricked into a product demo disguised as a pitch deck. "Scroll to Practice" is also a callback to the "Scroll" hint on slide 0, recontextualized as a punchline about what just happened to them.

Final absurd detail: this is the only proposal where the investor can honestly tell their partners, "I tried the product." Technically they scrolled a web page. But emotionally? They practiced for 17 minutes.

---

### Proposal 5: "What You Don't See"

**Evocative Name:** *The Negative Space*

**Visual Showcase Approach:**

What if the product showcase slides showed almost nothing?

This proposal leans hard into The River's philosophy of quietness and restraint. Instead of cramming phone mockups with pixel-perfect UI recreations, it shows three slides that each contain a single enormous typographic or visual element paired with one tiny piece of app detail -- creating intrigue, elegance, and a sense of mystery that makes the viewer *want* to see more.

**Slide A -- "17:23."** A single timer value displayed in massive serif type (clamp(5rem, 12vw, 10rem), Playfair Display) centered on the screen, rendered in the river-blue gradient. Below it, in 10px uppercase tracking: "THAT'S HOW LONG YOU PRACTICED YESTERDAY." Below that, dimmer still: "The River remembers." No phone. No mockup. No feature list. Just the number. But the number is alive: it ticks up by one second every real second (a trivial `setInterval` gated by IntersectionObserver), so the viewer watches it grow while sitting on the slide. 17:23 becomes 17:24 becomes 17:25. The effect is hypnotic. You cannot help but watch. That IS the app.

**Slide B -- "A Minor Pentatonic."** The words "A Minor Pentatonic" in the same massive serif gradient type. Below, a single SVG element: the fretboard diagram from `ShedPage`, rendered at full slide width (900px). Six horizontal string lines with graduated stroke widths (0.8 to 2.4, matching `STRING_THICKNESS = [0.8, 1, 1.2, 1.6, 2, 2.4]`). Fifteen vertical fret lines. Dot markers at frets 3, 5, 7, 9, 12 (double at 12, per `MARKERS` and `DOUBLE_MARKERS`). Blue circles at every A minor pentatonic note position across all 6 strings and 15 frets -- note indexes [9, 0, 5, 7, 3] derived from `INTERVALS.pentatonic_minor = [0, 3, 5, 7, 10]` with root A (NOTES index 9). Root notes rendered as solid `#2563EB` circles with white note names. Other scale notes as `rgba(59,130,246,0.15)` filled with blue stroke and blue note names. No phone frame. No labels. Just the neck floating in negative space. Below: *"Every scale. Every position. In your pocket."* The fretboard reveals left-to-right via CSS `clip-path: inset(0 100% 0 0)` animating to `clip-path: inset(0 0% 0 0)` over 2 seconds.

**Slide C -- A single raindrop.** The slide is almost entirely empty. Vast dark negative space. Center-screen: a single SVG circle, 6px diameter, colored `var(--river-2)`, falling slowly from the top of the viewport to the bottom over 8 seconds. As it falls, it leaves a faint trail -- a thin SVG `<line>` that grows downward with the circle at `opacity: 0.15`. When the drop reaches the lower third, text fades in: *"Metronome. Rain. That's the whole soundscape. Sometimes less is everything."* The animation loops. After the first drop, a second begins at a different x-offset. Then a third. The slide slowly accumulates 4-5 gentle rain threads -- but never more, never busy. It is the rain soundscape, visualized as minimalist art.

**Specific SVG/HTML Mockup Designs:**

- **Timer slide (Slide A):** Zero SVG mockups. Pure HTML. One `<h1>` styled with the deck's existing `.stat-number` gradient treatment. A JS `setInterval` increments seconds. Two `<p>` captions in `.subtitle` styling. The entire slide contains fewer than 15 DOM elements. The typography IS the product demonstration.
- **Fretboard slide (Slide B):** One large SVG (viewBox `0 0 900 220`), directly adapted from `FretboardDiagram` in `ShedPage.jsx`:
  - Constants: `FRETS=15, STRINGS=6, LEFT=32, NUT_W=4, FRET_W=52, STRING_GAP=28, TOP=30, DOT_R=11`
  - Fretboard background: `<rect>` fill in muted earth tone
  - Nut: thick `<rect>` at left edge
  - Strings: 6 `<line>` elements, stroke-widths [0.8, 1, 1.2, 1.6, 2, 2.4]
  - String labels: "e", "B", "G", "D", "A", "E" as `<text>` at left margin
  - Fret wires: 15 vertical `<line>` elements
  - Fret markers: `<circle>` at frets 3,5,7,9 (single dot) and 12 (double)
  - Scale notes: For each string s (open tuning `OPEN_STRINGS=[4,11,7,2,9,4]`), for each fret f (1-15), compute `noteIdx = (OPEN_STRINGS[s] + f) % 12`. If noteIdx is in {9,0,5,7,3}: render `<circle>` at `(LEFT + NUT_W + (f-0.5)*FRET_W, TOP + s*STRING_GAP)` with `r=DOT_R`. Root (noteIdx===9): fill `#2563EB`, white text. Other: fill `rgba(59,130,246,0.15)`, blue text.
  - Wrapped in `<g clip-path="...">` for the left-to-right reveal animation.
- **Raindrop slide (Slide C):** SVG with viewBox `0 0 100 100` scaled to viewport height. Primary drop: `<circle cx="50" cy="-5" r="0.8" fill="var(--river-2)"/>` with CSS `@keyframes fall { from { transform: translateY(-5%) } to { transform: translateY(110%) } }` at 8s duration, infinite repeat. Trail: a `<line>` following the circle. Additional drops at cx=35, 62, 47, 71 with staggered `animation-delay` of 8s, 13s, 19s, 25s. Text as HTML below the SVG, opacity triggered when first drop passes 70%.

**Animation/Reveal Approach:**

Each slide has exactly ONE moving element. Total restraint.

- Slide A: The timer ticks. Nothing else moves.
- Slide B: The fretboard reveals left-to-right. Nothing else moves.
- Slide C: Raindrops fall. Nothing else moves.

No parallax, no rotation, no scaling, no hover effects. The existing pitch deck is saturated with motion (ink wash, particles, ambient glow, slide transitions). These three slides create powerful contrast through stillness. They breathe. They let the viewer sit with a single concept. The surrounding motion makes the silence louder.

**What Makes It Unique:**

This is the confident proposal. It says: "Our product is so clear in concept that we don't need to show you a screenshot. We can show you one detail and you get it." It is the fastest to implement (minimal SVG, lightweight JS, no complex compositions) and the most visually distinct from the rest of the deck, which means it jolts the viewer awake at the exact moment you need their attention -- the product section.

The risk: investors want to SEE the product, and this deliberately withholds full views. The reward: it creates *desire*. The viewer wants to try the app because the deck tantalized without satisfying. This is the movie trailer that never shows the monster.

The raindrop slide is also quietly, devastatingly funny. You are watching a single blue dot fall down a dark screen at the pace of a glacier. And somehow you cannot look away. That is the joke AND the product thesis compressed into one moment: small, quiet things done with intention can hold attention far longer than anyone expects. If that is not a pitch for The River, nothing is.

---

### Proposal Comparison Matrix

| Dimension | 1: Day in the Life | 2: Split Screen | 3: Toolkit Carousel | 4: The Flipbook | 5: Negative Space |
|-----------|-------------------|-----------------|---------------------|-----------------|-------------------|
| Slides added | 3 (replaces 3+4) | 1 (inserts before 3) | 1 (replaces 4) | 1 mega-zone (replaces 3-5) | 3 (replaces 3+4) |
| Implementation effort | High | Medium | High | Very High | Low |
| Feature coverage | Timer, logging, tags, soundscape | Timer, soundscape, streak | All 5: timer, soundscape, shed, fretboard, fog horn | Timer, home, logging, soundscape | Timer, fretboard/shed, soundscape |
| Risk level | Low | Low | Medium | EXTREME | Medium |
| Investor clarity | Excellent | Excellent | Excellent | Confusing then brilliant | Intriguing but incomplete |
| Humor factor | Low | Medium (left-panel despair) | Low | High ("You just used it") | High (watching a dot fall) |
| Matches deck aesthetic | Perfectly | Perfectly | Mostly (carousel is visually busy) | Breaks then rebuilds it | Amplifies it to the extreme |
| Wildcard potential | No | No | No | YES | Maybe |
| Comedy potential | No | Yes (four-line despair spiral) | No | Yes (the deadpan punchline) | Yes (the world's most patient raindrop) |

### Recommendation

**Ship "24 Hours on the River" (Proposal 1) for reliability. Pair it with one slide from "The Negative Space" (Proposal 5) for contrast.**

Proposal 1 gives investors exactly what they need: a clear, chronological walkthrough of the app's core loop (open, practice, save) with detailed mockups that prove the product is real and thoughtful. It covers the most critical features (timer, soundscape, session logging with tags) and integrates seamlessly with the existing deck's visual language.

But Proposal 1 alone is all show and no mystery. Steal Slide B (the fretboard) from Proposal 5 and insert it as a standalone slide after the three walkthrough slides. It serves as a "wait, there's MORE?" moment -- the viewer has just seen the practice loop and now suddenly encounters a full-width fretboard diagram that implies hidden depth. Four total new slides. Maximum impact. Zero wasted motion.

If the team has appetite for risk, prototype Proposal 4 (The Flipbook) behind a `?mode=flipbook` query parameter. If scroll performance holds on the presenter's machine, switch to it for the actual pitch meeting. If not, the Day-in-the-Life slides catch you.

The river always has a backup plan.

---

## Results

*To be filled during competition execution.*
