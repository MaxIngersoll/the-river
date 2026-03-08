# River Visualization Redesign — Expert Panel

> **Panel Date:** March 8, 2026
> **Competition Tier:** Design Panel (advisory, pre-implementation)
> **Panel Lead:** Ben Fry
> **Members:** Robert Hodgin, Shirley Wu, Matt DesLauriers

---

## 1. Ben Fry Opens: Diagnosis of the Current River

**Ben Fry:** I've read through all 750 lines. Let me be direct about what I see.

**What works.** The river-as-metaphor is strong — width encoding practice volume, color encoding cumulative hours, the vertical flow of time. The Catmull-Rom curves give organic edges. The soul line is a lovely touch. The today marker with its breathing ripple genuinely communicates "you are here." These are honest visual decisions.

**What doesn't work.** The flow animation is cosmetic. Those white ellipses drifting downward inside a clip path? They don't map to anything. They're screensavers. The seasonal particles — also decorative. A circle drifting through the river in spring versus autumn changes nothing about what a user understands. The "luminous center highlight" is a fixed 22% inset of the river shape with a white gradient. It suggests depth but encodes no data. That's three layers of rendering budget spent on atmosphere, zero on information.

**What's dishonest.** The river has two data dimensions: width (daily minutes) and color (cumulative hours). That's it. Everything else — flow speed, particles, soul line drift, the highlight — is procedural decoration. The `seeded()` jitter makes it look organic but it's deterministic noise, not data. A user who practiced scales for 60 minutes looks identical to one who played 30 minutes of chords and 30 minutes of improv. A week of varied exploration and a week of grinding one thing produce the same river shape. The texture lies by omission.

**The mandate.** Every animated pixel must be accountable to a data point. We keep width and color. We replace the decorative layers with data-driven ones. The river should reward close looking — the more you stare, the more you see.

---

## 2. Individual Proposals

**Robert Hodgin:** The river needs hydrodynamics, not screensaver ellipses. My proposal: encode tag variety as **turbulence**. A day with one tag produces laminar flow — smooth, parallel streamlines. A day with four tags produces turbulent flow — eddies, vortices, visible mixing. This isn't decoration; it's fluid dynamics 101. Different practice types are literally different tributaries merging. The visual complexity IS the data. For recency/flow speed: the particle velocity of the streamlines accelerates near today and decelerates in the distant past. Recent practice feels alive, old practice feels settled. The physics tells the story.

**Shirley Wu:** I want to talk about what's missing: the **shape of a day**. Right now, a 60-minute session and three 20-minute sessions produce identical width. But they're completely different practice stories. My proposal: encode session count as **river braiding**. Single long sessions produce one deep channel. Multiple sessions split the river into braided streams that merge and diverge. Tag variety maps to **color bands within the flow** — each tag gets a thin colored thread, and days with more tags show more threads woven together. The river becomes a textile. You can literally see the composition of your practice. For mood, I'd use **luminosity** — a mood-5 day glows brighter, a mood-1 day dims. Subtle, not diagnostic.

**Matt DesLauriers:** Both proposals are beautiful. Here's what actually ships on a phone. For the turbulence encoding: we can do noise-based displacement on streamlines using a 1D simplex noise function, modulated by tag count. Cheap. For the braiding: Canvas 2D can draw 3-5 parallel bezier curves per day-segment at 60fps no problem. For flow speed: we animate a UV offset along a pre-computed path — one `requestAnimationFrame` callback, no SVG `animateTransform` pile-up. My concrete proposal: **Canvas 2D**, not WebGL, not SVG. SVG DOM thrashing is what makes the current implementation expensive. WebGL is overkill for 2D curves and adds shader compilation cold-start. Canvas 2D gives us direct pixel control, zero DOM nodes for animated elements, and the `Path2D` API for hit testing tap targets. Bundle cost: ~0KB — it's a native browser API.

---

## 3. Technical Debate

**Ben Fry:** Matt, walk us through the SVG vs Canvas decision with numbers.

**Matt DesLauriers:** The current SVG creates roughly `3 * flowStreaks + particleCount + 2 * dryDays + fogDays + dateLabels + tapTargets` DOM nodes, each with `<animate>` or `<animateTransform>` elements. For a user with 180 days of data, that's 200+ animated SVG nodes. Mobile Safari's SVG animation pipeline struggles above ~80 animated elements. Canvas 2D: one `<canvas>` element, one `requestAnimationFrame` loop, zero DOM overhead for animation. We composite the static elements (date labels, dry markers) as a separate pass or overlay them as minimal HTML. Hit testing: we maintain an array of `{ y, height, date }` rectangles and do a binary search on touch Y coordinate. Faster than invisible SVG `<rect>` elements.

**Robert Hodgin:** What about the turbulence calculation? Per-frame noise for every visible day-row?

**Matt DesLauriers:** We pre-compute a **flow field texture** — a 1D array where each entry stores `{ width, turbulence, speed, colorStops, braidCount }` per day. This is recalculated only when `sessions` changes, not per frame. The per-frame work is: (1) advance the UV offset for flow animation, (2) draw each visible day-segment using the cached flow field, (3) draw streamline particles. For 30 visible rows at a time (viewport), that's 30 bezier curves + maybe 40 particles. Canvas 2D handles this at 120fps.

**Shirley Wu:** How do we handle the braided streams without it getting visually noisy?

**Ben Fry:** Constraint it. Maximum 3 braids — single session, two sessions, three-or-more sessions. More than three braids and the visual distinction collapses at phone scale. Each braid carries the tag-color threads for the sessions it represents. The braids merge at day boundaries with a smooth interpolation.

**Matt DesLauriers:** Agreed. And for the compact mode (home page preview), we drop braiding entirely — just width + color + a single animated streamline. The compact river is a 3-second glance, not an analysis tool.

**Robert Hodgin:** What about reduced motion?

**Matt DesLauriers:** With `prefers-reduced-motion`: no particle animation, no flow UV offset, no breathing today marker. Render a single static frame — the river shape with all data encodings (width, color, turbulence displacement, braids) still visible. The data survives without motion.

---

## 4. Consensus Design

The panel converges on **Canvas 2D with a pre-computed flow field**.

### Data-to-Visual Mappings (5 dimensions)

| Data Dimension | Visual Encoding | Range |
|---|---|---|
| **Daily minutes** | River width | 1px (dry) to 86% of container width |
| **Cumulative hours** | Fill color gradient (vertical) | 11-stop blue palette, light/dark aware |
| **Tag variety per day** | Streamline turbulence | 1 tag = laminar (smooth), 4+ tags = turbulent (displaced curves) |
| **Sessions per day** | River braiding | 1 session = single channel, 2 = bifurcated, 3+ = triple braid |
| **Recency** | Flow particle speed | Particles near today move 3x faster than distant past |

**Bonus encoding (optional, phase 2):**
- **Mood** (1-5): luminosity multiplier on the day-segment fill (0.7x to 1.3x)
- **Tag identity**: thin colored threads within each braid, using existing `TAG_COLORS`

### What We Preserve
- Day tapping for tooltips (binary search hit test on canvas)
- Today marker with breathing glow (canvas-drawn, same ripple logic)
- Dry/fog markers (dashed lines and mist dots, canvas-drawn)
- Date labels (HTML overlay positioned absolutely, not canvas text)
- Soul line (now data-driven: its drift amplitude maps to daily minutes variance from 7-day average)

---

## 5. Technical Specification

### Rendering Technology
**Canvas 2D** via a single `<canvas>` element, with an HTML overlay for date labels and tooltip.

**Justification:** Zero DOM overhead for animation. Native `Path2D` for hit testing. No shader compilation (vs WebGL). No DOM thrashing (vs SVG). Supported in all target browsers. 0KB additional bundle weight.

### Component: `RiverCanvas.jsx`

```
Props:
  sessions: Session[]        // Full session array
  compact?: boolean          // Default false. Home page preview mode
  daysToShow?: number        // Optional limit on visible days
  onDayTap?: (date, sessions) => void  // Callback for day interaction
```

### Architecture

```
RiverCanvas
  ├── useFlowField(sessions, startDate, totalDays)
  │     Returns: FlowField[] — one entry per day
  │     Recomputes: only when sessions changes (useMemo)
  │     Each entry: { date, width, runningHours, color,
  │                   turbulence (0-1), braidCount (1-3),
  │                   speed (0-1), tagColors[], isFog, isDry }
  │
  ├── useRiverRenderer(canvasRef, flowField, compact, theme, season)
  │     Owns: requestAnimationFrame loop
  │     Per-frame: advance UV offset, draw visible segments,
  │                draw particles, draw today marker
  │     Static pass: dry/fog markers, soul line
  │
  ├── <canvas> element (full width, computed height)
  ├── <div> overlay for date labels (absolute positioned)
  └── <div> overlay for tooltip (same glass card as current)
```

### Flow Field Computation (`useFlowField`)

```javascript
for each day:
  width = getWaterWidth(day.minutes)
  turbulence = clamp(uniqueTagCount / 4, 0, 1)
  braidCount = min(day.sessionCount, 3)
  speed = 1 - (daysFromToday / totalDays)  // 1.0 = today, 0.0 = oldest
  color = getColorForHours(day.runningHours, isDark)
  tagColors = day.tags.map(t => TAG_COLORS[t])
```

### Rendering Pipeline (`useRiverRenderer`)

**Per frame (~16ms budget):**
1. Clear canvas
2. Advance `uvOffset += deltaTime * 0.02`
3. Determine visible day range from scroll position
4. For each visible day (typically 25-35 rows):
   a. Compute left/right bank x-coordinates from flow field width + Catmull-Rom interpolation
   b. Apply turbulence: displace bank curves using `simplex1D(y + uvOffset) * turbulence * amplitude`
   c. Draw braid channels: split width into `braidCount` sub-paths with small gaps
   d. Fill each channel with day's color; overlay thin tag-color threads if tags exist
5. Draw soul line (thin center path, drift = variance from 7-day rolling average)
6. Draw flow particles (20-30 total, recycled, speed modulated by flow field speed value)
7. Draw today marker (breathing circle, same logic as current SVG)
8. Draw dry-day dashes and fog-day dots

**Static overlay (HTML, re-rendered on scroll only):**
- Date labels (month names, week markers) positioned via CSS `top` values
- Tooltip glass card (same as current implementation)

### Simplex Noise (Turbulence)

Inline a minimal 1D simplex noise function (~30 lines, <1KB). No external dependency.

```javascript
// Turbulence displacement for bank curves:
const displacement = simplex1D(y * 0.05 + uvOffset) * turbulence * maxDisplacement;
// maxDisplacement = 6px (full mode), 2px (compact)
```

### Performance Budget

| Metric | Target | Fallback |
|---|---|---|
| Frame rate | 60fps on iPhone 12+ | Drop particles below 45fps |
| Canvas size | Up to 375 x 8000px (1 year) | Render only visible viewport + 200px buffer |
| Flow field compute | <5ms for 365 days | Pre-computed, cached in useMemo |
| Per-frame draw | <8ms | Skip turbulence if >12ms |
| Memory | <2MB for canvas bitmap | Use `willReadFrequently: false` |

**Graceful degradation:** If `performance.now()` frame timing exceeds 12ms for 5 consecutive frames, disable turbulence displacement and particle animation for that paint session. Re-enable on next scroll stop.

### Reduced Motion Behavior

When `prefers-reduced-motion: reduce` is active:
- No `requestAnimationFrame` loop — render a single static frame
- No particles, no UV offset, no breathing today marker
- All 5 data dimensions remain visible (width, color, turbulence displacement, braiding, soul line)
- Today marker renders as a static bright dot with a soft halo
- Re-render only on `sessions` change or scroll

### Color Palette Integration

The renderer reads colors from CSS custom properties and the existing palette arrays:
- River fill: `WATER_COLORS_LIGHT` / `WATER_COLORS_DARK` (already defined, reuse as-is)
- Dry markers: `var(--color-dry-bank)`
- Text: `var(--color-text-2)`, `var(--color-text-3)`
- Tag threads: `TAG_COLORS` map from storage.js
- Sapphire Night: uses dark palette with gold accent (`#E0C58F`) for today marker ring

Theme detection via `useTheme()` hook (existing). Season detection via `useSeason()` hook (existing) — affects particle tint only.

### Hit Testing

```javascript
function handleCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const y = e.clientY - rect.top + scrollTop;
  const dayIndex = Math.floor(y / rowHeight);
  if (dayIndex >= 0 && dayIndex < flowField.length) {
    onDayTap(flowField[dayIndex].date, sessionsForDate);
  }
}
```

### Migration Path

1. Build `RiverCanvas.jsx` alongside existing `RiverSVG.jsx`
2. Feature-flag: `const USE_CANVAS_RIVER = true` in a config constant
3. Parent components (`HomePage`, `StatsView`) swap based on flag
4. Verify visual parity + data encoding correctness
5. Remove `RiverSVG.jsx` once validated
6. Total migration: additive, no breaking changes to parent APIs

### Bundle Impact

- `RiverCanvas.jsx`: ~400 lines estimated (vs 750 SVG lines)
- `useFlowField.js`: ~80 lines
- `useRiverRenderer.js`: ~250 lines
- `simplex1d.js`: ~30 lines
- **Total: ~760 lines, 0KB external dependencies, <8KB gzipped**

---

## Panel Closing Remarks

**Shirley Wu:** What I love about this design is that the river becomes a textile you can read. A week of varied practice looks *visibly different* from a week of grinding — braided, turbulent, colorful threads versus a single smooth channel. The data tells its own story.

**Robert Hodgin:** The physics aren't fake anymore. Turbulence from variety, laminar flow from focus, speed from recency — these are real fluid dynamics metaphors that happen to be true. The river earns its name.

**Matt DesLauriers:** And it'll run at 120fps on any phone made in the last four years. Canvas 2D is the most underrated rendering technology in the browser. We're using the platform, not fighting it.

**Ben Fry:** Five data dimensions, zero decorative pixels, same Apple Health quality bar. The river was always the right metaphor. Now it's also the right visualization.
