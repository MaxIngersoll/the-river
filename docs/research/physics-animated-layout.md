# Physics-Based Animated Button Layout — Research Report

> How to make the Dock's buttons float, rearrange, and animate based on active sub-feature.

---

## Recommendation: framer-motion + CSS Grid Layout Transitions

**The insight:** This is NOT a physics simulation problem. It's a **layout transition** problem. We have 4 buttons. Each state (chords/scale/circle/ref active) defines a different spatial arrangement. We need organic, spring-physics transitions BETWEEN these arrangements.

**framer-motion's `layout` prop** was built for exactly this:
1. Define layout for each state using CSS/Tailwind (grid positions, sizes)
2. When state changes, React re-renders with new layout
3. framer-motion detects geometry change and animates `transform` to bridge the gap
4. Spring physics make it feel alive

This is how Apple implements fluid grid rearrangement on iOS.

---

## Library Analysis

| Library | Verdict | Why |
|---------|---------|-----|
| **framer-motion** | **WINNER** | `layout` prop does FLIP animations automatically, spring physics, React 19 compatible, ~30KB tree-shaken |
| react-spring | Runner-up | More manual — must calculate positions yourself. Better for custom physics but more code. |
| d3-force | Overkill | Force-directed simulation for 50+ nodes. Wrong paradigm for 4 buttons. |
| matter.js | Way overkill | 2D rigid-body physics engine for games. Like using a crane to hang a picture. |
| popmotion | Redundant | The engine inside framer-motion. No React integration benefit. |
| @use-gesture/react | Complementary | Gesture input (drag, pinch), not animation. Pair with above if we want drag-to-rearrange. |

---

## How It Works: FLIP Animation + Spring Physics

1. **First**: Record button's current bounding rect
2. **Last**: React re-renders. Record new bounding rect
3. **Invert**: Apply transform to make element LOOK like it's still in old position
4. **Play**: Animate transform to identity (0,0) using spring physics

**Spring model**: `F = -k * x - c * v`
- `stiffness: 400` (snappy, not sluggish)
- `damping: 30` (slightly underdamped — one small overshoot, then settle)
- `mass: 1` (standard)
- Result: ~300ms settle time with one visible overshoot — the signature "juicy" feel

---

## Recommended Interaction: "Magnetic Grid" (Design C)

**Behavior:** Buttons exist on a soft magnetic grid. The active button has stronger "gravity" pulling it to the primary anchor point (larger, prominent) while inactive buttons are gently pushed to secondary positions.

**Layout states:**
- **None active:** 2x2 grid. All buttons equal size. Clean, balanced.
- **One active:** Active button expands to fill top row (`col-span-2`). Three inactive buttons share bottom row as equal pills.
- **Transition:** Spring `stiffness: 350, damping: 32`. One small bounce, then settle. ~280ms total.

**Why this wins for The River:** The 2x2 grid makes excellent use of mobile width. The transition from 2x2 (resting) to 1-over-3 (active) is dramatic enough to feel alive but not disorienting. The spring physics are subtle — premium, not playful. Matches Liquid Glass aesthetic.

### Two Alternate Designs

**Design A: "Spotlight Expand"** — Active button takes 50% width, others shrink to icon-only pills in a single row. Mirrors iOS Spotlight search behavior.

**Design B: "Orbit Dock"** — Active button center-top, three inactive buttons orbit below in a curved arc with subtle floating motion (`y` oscillation, 2px amplitude, 3s period).

---

## Code Architecture

### Installation
```bash
npm install framer-motion  # ~30-35KB gzipped with tree-shaking
```

### Hook: `useDockLayout(activeIntent)`
Pure function of active intent → returns grid class + per-button config (span, order, isActive).

### Component: `DockNav`
```jsx
<LayoutGroup>
  <motion.div layout className={gridClass} transition={SPRING}>
    {items.map(({ id, isActive, span }) => (
      <motion.button
        key={id}
        layout           // ← The magic. Animates position+size.
        layoutId={id}    // Stable identity across re-renders
        className={span === 2 ? 'col-span-2' : 'col-span-1'}
        transition={SPRING}
        whileTap={{ scale: 0.95 }}
      />
    ))}
    {/* Floating active indicator that morphs between buttons */}
    <motion.div layoutId="active-indicator" className="bg-water-2/10" />
  </motion.div>
</LayoutGroup>
```

---

## Performance

- **GPU-composited**: framer-motion animates `transform` and `opacity` only — no layout/paint triggers
- **60fps guaranteed** on modern mobile
- **No rAF loops** — framer-motion handles internally
- **Battery-efficient** — compositor thread, not main thread
- **CSS idle animations** (Design B floating) should use `@keyframes`, not JS
- `will-change: transform` applied automatically by framer-motion

---

## Implementation Estimate
- ~2-3 hours: hook + component + integration into ShedPage
- Replaces the static `flex gap-1` div at ShedPage lines 979-993
- Uses existing `intent` state — no new state management needed
