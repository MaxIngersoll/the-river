# Competition K: Consequential UI

> "After saving a session, the river should physically rise in real-time — the water level creeps up matching the minutes logged. Not an animation. A consequence." — Loren Brichter

**Principle:** Every visual effect is earned by user action. Consequences, not animations. If it moves, it's because something happened.

---

## Stage 1: 25 Ideas (5 per panelist)

### Bret Victor — "If it doesn't change when the data changes, it's dead weight."

**BV1 — River Level Rise** (Physics)
After saving a session, the River SVG's water level physically rises in proportion to the minutes logged. The new height persists — open the app tomorrow and the water is still higher.
*Tech: RiverSVG.jsx stores `totalMinutes` in state; SVG `viewBox` y-offset shifts via CSS `transform: translateY()` keyed to total hours.*

**BV2 — Gravitational Quotes** (Spatial)
The quote card's vertical position on the page is determined by total practice hours. At 0 hours it floats near the top. At 100+ hours it has "sunk" to the bottom, heavy with wisdom. New users see it high and light; veterans find it deep and grounded.
*Tech: QuoteCard wrapper `div` with `marginTop` computed from `totalMinutes / maxMinutes * maxOffset`.*

**BV3 — Warm Typography** (Temporal)
The app's base font weight increases by 1 unit for every 10 hours of practice. A new river is thin and tentative (font-weight: 300). A 100-hour river is substantial (400). A 500-hour river is bold (600). The words themselves carry weight.
*Tech: CSS custom property `--river-weight` set on `<html>` from App.jsx, computed `300 + Math.min(totalHours * 1, 300)`. `font-weight: var(--river-weight)` on body.*

**BV4 — Living Axis** (Memory)
The weekly progress ring doesn't reset on Monday — it accumulates a faint ghost ring for every completed week. After 4 weeks you see 4 concentric rings, each slightly more transparent. Your history is literally visible behind your current progress.
*Tech: ProgressRing.jsx stores `completedWeeks[]` in localStorage; render additional `<circle>` elements with decreasing `opacity: 0.15 * (1 - i/count)`.*

**BV5 — Data Density Blur** (Spatial)
Cards with more data behind them are visually sharper. A session card for a 90-minute practice is crisp (`backdrop-filter: blur(4px)`). A 5-minute session is soft and diffuse (`blur(40px)`). Longer sessions literally have more resolution.
*Tech: Per-card `backdropFilter` computed from `blur(40 - Math.min(duration_minutes, 36))px`.*

### Loren Brichter — "Gravity, inertia, displacement — consequences."

**LB1 — Displacement Scroll** (Physics)
When a new session is saved, all existing session cards in the Log physically shift downward as if displaced by the new entry's weight. The displacement distance is proportional to the new session's duration. A 5-minute session nudges; a 90-minute session shoves.
*Tech: LogPage.jsx animates existing cards with `transform: translateY(N)` where N = `duration_minutes * 0.5`px, then settles to 0 over 400ms via CSS transition.*

**LB2 — FAB Weight** (Physics)
The Timer FAB grows heavier as the timer runs. At 0 min it sits at its normal position. At 30 min it has "sunk" 4px lower on screen. At 60 min, 8px. The button is literally weighed down by accumulated practice. When you stop, it springs back.
*Tech: TimerFAB.jsx `bottom` offset: `base - Math.min(elapsed_minutes * 0.13, 12)px`. On stop, transition back over 600ms.*

**LB3 — Ink Saturation** (Physics)
Every tag you've used appears in the Dock's tag selector. Tags you use frequently have deeply saturated color. Tags you haven't used in weeks are faded, nearly gray. Usage frequency = ink level. No legend needed — you just see what you practice.
*Tech: Tag buttons compute `opacity: 0.3 + 0.7 * (recentUsageCount / maxUsageCount)` from session history. Recalculated on mount.*

**LB4 — Sediment Layer** (Memory)
The bottom edge of the River SVG accumulates a thin colored layer for each month of practice. January is a dark band, February slightly lighter, etc. After a year the river has geological strata — your practice history is the riverbed itself.
*Tech: RiverSVG.jsx renders `<rect>` bands at bottom, one per month with practice data, height proportional to that month's total minutes, color from month-index palette.*

**LB5 — Tidal Pull** (Temporal)
The River SVG's flow speed responds to time of day. Morning: slow, gentle. Afternoon: steady current. Evening (when most people practice): the river runs fastest. Late night: near-still. The river breathes with the day whether or not you're watching.
*Tech: RiverSVG.jsx particle speed multiplier `0.5 + 0.5 * Math.sin((hour - 6) / 24 * Math.PI * 2)`. Updates every 60s via `setInterval`.*

### Naoto Fukasawa — "It couldn't help itself."

**NF1 — Cooling Glass** (Temporal)
Glass cards gradually lose their specular highlight if you haven't practiced in days. Day 1: full shimmer. Day 3: muted. Day 7: the glass looks cold, no highlight at all. When you return and practice, the warmth returns instantly — the glass "remembers" your touch.
*Tech: CSS variable `--glass-warmth` computed from `Math.max(0, 1 - daysSinceLastSession * 0.15)`. Applied to specular pseudo-element opacity.*

**NF2 — Breathing Pause** (Temporal)
When the app opens, the entire UI holds still for exactly as many seconds as the user has total practice hours divided by 100 (max 3s). A new user sees instant load. A veteran's app pauses — a breath of recognition — before anything becomes interactive. Sacred threshold.
*Tech: App.jsx sets `pointer-events: none` + fade-in delay computed from `Math.min(totalHours / 100, 3) * 1000`ms. Reduced-motion: skip entirely.*

**NF3 — Chord Memory Patina** (Memory)
Chord diagrams you've practiced with (started timer from) develop a subtle warm tint — a patina. Chords you've never touched remain cool blue. Over many sessions, your most-practiced chords glow golden. The diagrams remember your fingers.
*Tech: Store `chordPlayCounts` in localStorage keyed by chord name. SVG dot fill interpolates from blue→amber based on `Math.min(playCount / 10, 1)`.*

**NF4 — Milestone Erosion** (Memory)
Milestone cards you've already achieved develop hairline cracks and weathering over time — not decay, but the beautiful aging of stone. A milestone earned yesterday is sharp and fresh. One earned 6 months ago has the patina of a river-worn stone.
*Tech: Milestone card CSS `filter: contrast(1 - age*0.02) brightness(1 + age*0.01)` where age = weeks since earned. Subtle `border-radius` increase over time.*

**NF5 — Tab Bar Tide** (Physics)
The tab bar's bottom border color tracks total practice hours as a tide line. At 0 hours it's barely visible. At 50 hours the blue creeps 2px up the bar. At 200 hours the tab bar has a visible waterline halfway up. The river is literally rising into the chrome.
*Tech: TabBar.jsx `::before` pseudo-element with `height` computed from `Math.min(totalHours / 200, 0.5) * tabBarHeight`px, `background: var(--color-water-4)`, positioned at bottom.*

### Virgil Abloh — "The 3% that changes should feel inevitable."

**VA1 — Session Gravity** (Spatial)
In the Log, session cards are not uniform height. Each card's height is proportional to its duration. A 5-minute session is a sliver. A 90-minute session is a tall, substantial block. No labels needed — you see your practice at a glance. The shape of your log IS the data.
*Tech: LogPage session card `minHeight: Math.max(48, 48 + duration_minutes * 0.8)px`. Mood/tags still fit inside. Reduced motion: same, no animation needed.*

**VA2 — Streak Kerning** (Temporal)
The "Your River" title on the home page letter-spaces based on current streak. Day 1: tight, compact (`-0.02em`). Day 7: normal. Day 30: generous, confident spacing (`0.08em`). The title breathes wider as your consistency grows. Breaks feel like the text exhaling.
*Tech: HomePage title `letterSpacing: -0.02 + streak * 0.003`em, clamped to `[-0.02, 0.1]`.*

**VA3 — Earned Border Radius** (Physics)
All glass cards start with sharp corners (`border-radius: 8px`). As total hours accumulate, corners gradually round toward `24px`. The UI literally softens with use — sharp and new → smooth and worn, like a river stone.
*Tech: Global CSS var `--card-radius: calc(8px + min(var(--total-hours), 200) / 200 * 16px)`. Set on `<html>`, used in `.card` class.*

**VA4 — The Notch** (Memory)
Each time you pass a milestone, a tiny 2px notch appears on the left edge of the home screen — a physical mark, like a notch on a guitar neck. After 10 milestones you have a visible ruler of achievement. No celebration needed. Just evidence.
*Tech: HomePage renders `position: absolute; left: 0` divs, 2px wide, 8px tall, spaced 12px apart, count = `earnedMilestones.length`. Color: `var(--color-water-4)`.*

**VA5 — Seasonal Border** (Temporal)
The app's outermost 1px border color shifts with the season engine. Not a flashy gradient — just the single outermost pixel quietly changing from spring green to summer gold to autumn amber to winter silver. The 3% that signals everything.
*Tech: `<html>` gets `border: 1px solid var(--season-primary)`. Already computed by SeasonContext. Zero new code, just one CSS line.*

### Dan Abramov — Technical Feasibility Filter

**DA1 — Timer Ripple** (Physics)
When you stop the timer, a single CSS ripple emanates from the FAB across the entire screen — radius proportional to the session duration. A 5-minute session: small ripple fades by mid-screen. A 2-hour session: the ripple reaches the edges. The screen physically registers what just happened.
*Tech: After save, portal-render a `div` with `border-radius: 50%` + `scale()` keyframe from 0 to `duration_minutes * 3`px, `opacity` 0.08→0. One `@keyframes`, removed after 1.2s.*

**DA2 — Ghost Sessions** (Memory)
On the home page, faintly visible behind today's stats, you can see "ghost" outlines of your sessions from exactly one week ago, one month ago, one year ago. Like looking through ice at the riverbed below. Your past self is always faintly visible.
*Tech: HomePage queries sessions for matching past dates, renders ghost cards with `opacity: 0.08`, `filter: blur(1px)`, positioned behind current content via `z-index: -1`.*

**DA3 — Warm Noise Floor** (Acoustic)
When the soundscape is active, the rain/ambient volume subtly modulates based on your total practice hours. More hours = slightly warmer (more low-frequency content) rain. The sound of your practice literally deepens over time.
*Tech: audio.js Petrichor engine adjusts `biquadFilter.frequency` from `800 - Math.min(totalHours, 200) * 2`Hz. One line change in existing `createPetrichor()`.*

**DA4 — Practice Pulse** (Acoustic)
Every time you save a session, a single low tone plays — pitch determined by the session's duration. Short session = higher ping. Long session = deep, resonant tone. Over time you learn to hear how long you practiced by the sound alone.
*Tech: Web Audio API `OscillatorNode` at `220 - Math.min(duration, 90) * 1.5`Hz, `GainNode` envelope 0→0.1→0 over 800ms. ~15 lines in audio.js.*

**DA5 — State Persistence Glow** (Physics)
When the app hydrates data from localStorage on launch, each card briefly glows from its edges inward as its data loads — like a screen warming up. Cards with more data (longer sessions, more tags) glow longer. You can see the app remembering.
*Tech: On mount, cards get `animation: glow-in` with `duration: 200 + dataSize * 50`ms. `@keyframes glow-in { from { box-shadow: 0 0 20px var(--color-water-4) } to { box-shadow: none } }`. Staggered by index.*

---

## Stage 2: Quick Score (Abramov rates all 25)

| # | Idea | Feasibility | Wow | Purity | Total |
|---|------|:-----------:|:---:|:------:|:-----:|
| BV1 | River Level Rise | 5 | 5 | 5 | **15** |
| BV2 | Gravitational Quotes | 5 | 3 | 4 | 12 |
| BV3 | Warm Typography | 5 | 4 | 5 | **14** |
| BV4 | Living Axis | 4 | 4 | 5 | **13** |
| BV5 | Data Density Blur | 4 | 3 | 4 | 11 |
| LB1 | Displacement Scroll | 4 | 3 | 3 | 10 |
| LB2 | FAB Weight | 5 | 4 | 5 | **14** |
| LB3 | Ink Saturation | 5 | 4 | 5 | **14** |
| LB4 | Sediment Layer | 3 | 5 | 5 | **13** |
| LB5 | Tidal Pull | 5 | 3 | 4 | 12 |
| NF1 | Cooling Glass | 5 | 5 | 5 | **15** |
| NF2 | Breathing Pause | 4 | 4 | 4 | 12 |
| NF3 | Chord Memory Patina | 4 | 5 | 5 | **14** |
| NF4 | Milestone Erosion | 4 | 3 | 4 | 11 |
| NF5 | Tab Bar Tide | 4 | 4 | 5 | **13** |
| VA1 | Session Gravity | 5 | 4 | 5 | **14** |
| VA2 | Streak Kerning | 5 | 3 | 5 | 13 |
| VA3 | Earned Border Radius | 5 | 4 | 5 | **14** |
| VA4 | The Notch | 5 | 3 | 5 | 13 |
| VA5 | Seasonal Border | 5 | 2 | 4 | 11 |
| DA1 | Timer Ripple | 5 | 5 | 4 | **14** |
| DA2 | Ghost Sessions | 4 | 4 | 5 | **13** |
| DA3 | Warm Noise Floor | 5 | 3 | 5 | 13 |
| DA4 | Practice Pulse | 5 | 4 | 5 | **14** |
| DA5 | State Persistence Glow | 4 | 3 | 2 | 9 |

**Top 12 (score >= 13):** BV1 (15), NF1 (15), BV3 (14), LB2 (14), LB3 (14), NF3 (14), VA1 (14), VA3 (14), DA1 (14), DA4 (14), BV4 (13), LB4 (13)

*Cut: BV2, BV5, LB1, LB5, NF2, NF4, NF5, VA2, VA4, VA5, DA2, DA3, DA5*

---

## Stage 3: Debate (12 to 6)

**Brichter opens:** "BV1 — River Level Rise — is the north star. It's the original pitch. Everything else orbits this. Non-negotiable top pick."

**Victor argues for BV3 (Warm Typography):** "The whole UI gets heavier as you practice. Not one component — everything. That's a systemic consequence. And it's 3 lines of code."

**Brichter vetoes DA1 (Timer Ripple):** "A ripple IS an animation. Yes, it's triggered by data, but the ripple itself is choreography. The river rising is a consequence. The ripple is a firework. Cut it."

**Fukasawa defends NF1 (Cooling Glass):** "The glass cools when you're away. It warms when you return. This is the app missing you. Not an animation — a state change that happens because time passed."

**Abloh on VA3 (Earned Border Radius):** "8px to 24px across the entire UI. That's the 3% — the whole app softens over months. Nobody notices it happening. Everyone notices the result."

**Victor champions LB3 (Ink Saturation):** "Tags saturate with use. That's a live representation of frequency data in the color channel. Pure consequence. And it solves a UI problem — it tells you what you actually practice."

**Abramov on LB4 (Sediment Layer):** "Beautiful idea but complex SVG layering in RiverSVG.jsx which is already 781 lines. I'd rather see NF3 (Chord Patina) — similar memory concept, simpler implementation, more personal."

**Brichter on DA4 (Practice Pulse):** "A tone whose pitch is determined by duration. You don't choose the sound — the data does. That's a consequence in the audio domain. Keep it."

**Fukasawa argues against VA1 (Session Gravity):** "Proportional card heights work but they're a visualization technique, not a consequence. The card doesn't BECOME tall — it's rendered tall. It's a chart pretending to be a consequence."

**Abloh defends VA1:** "Disagree. The card IS the duration. Remove the number and you'd still know. That's not decoration — it's the data taking physical form."

**Victor breaks the tie:** "VA1 stays. But LB2 (FAB Weight) is more consequential — the button sinks WHILE you practice. It's happening in real-time. The card height is set once."

**Final cuts:** DA1 (vetoed — animation), LB4 (complexity), BV4 (Living Axis — good but niche), VA1 (tie-break loss to LB2)

---

## Stage 4: Final 6, Ranked

### 1. River Level Rise
*The river physically rises when you save a session. The new level persists forever.*

- **Trigger:** Saving a session via TimerFAB
- **Data source:** `getTotalMinutes()` → total hours
- **Technical spec:**
  - **Component:** `RiverSVG.jsx`
  - **Hook:** New `useRiverLevel(totalHours)` — returns `waterLevel` (0-100 scale mapped to SVG viewBox)
  - **Mechanism:** After session save, `totalHours` updates in App.jsx state. RiverSVG receives new prop, computes new `translateY` for the water surface group. CSS `transition: transform 2s ease-out` creates the physical rise.
  - **Key detail:** The water level is DERIVED from total hours, not animated independently. If you reload, the level is exactly where it should be. The 2s transition only fires on delta change, not on mount.
  - **Water level formula:** `baseY - Math.log2(1 + totalHours) * 15` (logarithmic so early hours feel dramatic, later hours feel earned)
  - **~40 lines** new code in RiverSVG.jsx
- **Files:** `src/components/RiverSVG.jsx`
- **Reduced motion:** Level jumps instantly (no transition), same final position
- **Effort:** 1.5 hours

### 2. Cooling Glass
*Glass cards lose their shimmer when you haven't practiced. They warm back instantly when you return.*

- **Trigger:** Time passing without a session (passive) / Saving any session (active)
- **Data source:** `daysSinceLastSession` computed from most recent session date
- **Technical spec:**
  - **File:** `src/index.css` + `src/App.jsx`
  - **Mechanism:** App.jsx computes `daysSinceLastSession` and sets CSS custom property `--glass-warmth` on `<html>`: `Math.max(0, 1 - days * 0.14)` (fully cold at 7+ days)
  - **CSS changes:** `.card::before` (specular highlight) gets `opacity: calc(0.15 * var(--glass-warmth, 1))`. `.card` backdrop saturation scales: `saturate(calc(120% + 60% * var(--glass-warmth, 1)))`.
  - **The moment of return:** On session save, `--glass-warmth` snaps to `1`. Every card on every page instantly regains its shimmer. No animation — just the state changing because you practiced.
  - **~15 lines** across App.jsx + index.css
- **Files:** `src/App.jsx`, `src/index.css`
- **Reduced motion:** Identical behavior (no motion involved)
- **Effort:** 1 hour

### 3. Warm Typography
*The entire app's font weight increases with total practice hours. The UI gets more substantial as you do.*

- **Trigger:** Any session saved (recalculated)
- **Data source:** `getTotalMinutes() / 60` → total hours
- **Technical spec:**
  - **File:** `src/App.jsx` + `src/index.css`
  - **Mechanism:** App.jsx sets `--river-weight` on `<html>`: `300 + Math.min(Math.floor(totalHours / 5) * 10, 300)` (steps of 10 every 5 hours, from 300 to 600)
  - **CSS:** `body { font-weight: var(--river-weight, 300); }` — one line
  - **Effect:** At 0 hours, the entire UI is light/thin (weight 300). At 50 hours, it's regular (400). At 150 hours, it's medium-bold (600). The app itself gains confidence.
  - **Key detail:** Use `font-variation-settings` if a variable font is loaded; otherwise `font-weight` steps. Tailwind's Inter supports variable weights.
  - **~8 lines** total
- **Files:** `src/App.jsx`, `src/index.css`
- **Reduced motion:** Identical (no motion)
- **Effort:** 30 minutes

### 4. FAB Weight
*The timer button sinks lower on screen as the timer runs. Heavier with accumulated time.*

- **Trigger:** Timer running (continuous)
- **Data source:** `elapsedMinutes` from active timer
- **Technical spec:**
  - **Component:** `TimerFAB.jsx`
  - **Mechanism:** While timer is running, compute `sinkOffset = Math.min(elapsedMinutes * 0.2, 10)` pixels. Apply as `style={{ transform: translateY(${sinkOffset}px) }}` on the FAB container.
  - **Transition:** `transition: transform 60s linear` — it moves so slowly you can't perceive the motion, only the accumulation. Like a clock hand.
  - **On stop/save:** `sinkOffset` returns to 0 with `transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)` — a spring-back. The relief of setting down something heavy.
  - **~12 lines** modified in TimerFAB.jsx
- **Files:** `src/components/TimerFAB.jsx`
- **Reduced motion:** No sinking, FAB stays in place. Spring-back replaced by instant reset.
- **Effort:** 45 minutes

### 5. Ink Saturation
*Tags you use frequently are deeply saturated. Tags you haven't touched in weeks fade toward gray.*

- **Trigger:** Session history changes (any save)
- **Data source:** Session `tags[]` arrays, filtered by recency (last 30 days)
- **Technical spec:**
  - **Component:** New `useTagSaturation(sessions)` hook
  - **Mechanism:** Count tag occurrences in last 30 days. Compute `saturation = 0.25 + 0.75 * (count / maxCount)` per tag. Return `{ [tagName]: saturation }`.
  - **Application:** Anywhere tag chips render (LogPage, ShedPage, TimerFAB save form), apply `style={{ opacity: saturation, filter: saturate(${saturation}) }}` to the tag button.
  - **TAG_COLORS** in storage.js already defines base colors. Saturation modulates them.
  - **~25 lines** for hook + ~5 lines per consumer
- **Files:** `src/hooks/useTagSaturation.js` (new), `src/components/LogPage.jsx`, `src/components/TimerFAB.jsx`, `src/components/ShedPage.jsx`
- **Reduced motion:** Identical (no motion)
- **Effort:** 1.5 hours

### 6. Earned Border Radius
*All cards start angular (8px). Over months of practice, the entire UI rounds to 24px. River stones smoothed by water.*

- **Trigger:** Total practice hours milestone
- **Data source:** `getTotalMinutes() / 60` → total hours
- **Technical spec:**
  - **File:** `src/App.jsx` + `src/index.css`
  - **Mechanism:** App.jsx sets `--card-radius` on `<html>`: `8 + Math.min(totalHours, 200) / 200 * 16` (8px at 0 hours, 24px at 200+ hours)
  - **CSS:** `.card { border-radius: var(--card-radius, 12px); }` — replace existing static value
  - **Effect:** The entire UI gradually softens. A new user sees sharp, modern cards. A veteran sees soft, worn river stones. The change is so slow (0.08px per hour) that it's imperceptible day-to-day but unmistakable month-to-month.
  - **~6 lines** total
- **Files:** `src/App.jsx`, `src/index.css`
- **Reduced motion:** Identical (no motion)
- **Effort:** 20 minutes

---

## Implementation Priority

| Rank | Idea | Effort | Dependencies |
|------|------|--------|-------------|
| 1 | Warm Typography | 30 min | None |
| 2 | Earned Border Radius | 20 min | None |
| 3 | Cooling Glass | 1 hr | None |
| 4 | FAB Weight | 45 min | None |
| 5 | Ink Saturation | 1.5 hr | None |
| 6 | River Level Rise | 1.5 hr | RiverSVG refactor awareness |

**Total: ~5.5 hours.** All six are independent — can be built in any order. The first three are each under 10 lines of actual code change. The entire suite transforms the app from "animated" to "consequential" in under a day of work.

---

## Awards

**Wildcard (Most Creative):** NF2 — Breathing Pause. The app holds its breath longer for veterans. Ando's sacred threshold made real. Cut for feasibility concerns but conceptually perfect.

**Comedy Award:** LB2 — FAB Weight. "Your practice button is literally sinking under the weight of your dedication. It's drowning. Someone save it." — Brichter, with a straight face.

**The Brichter Veto:** DA1 — Timer Ripple. "You put a ripple animation in a competition about not using animations. Bold move. No."

---

*"A river doesn't announce that it rose. You come back and the water is higher. That's the whole idea." — The Panel*
