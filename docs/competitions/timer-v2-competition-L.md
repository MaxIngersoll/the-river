# Competition L — Timer Visualization v2

**Date:** 2026-03-10 (Session 13 dinner sprint)
**Tier:** 1 (Full)
**Brief:** Fresh timer visualization. Keep warm palette + Raven Kwok noise displacement. Start from 10 Commandments only.
**Constraint:** Max: "The Spiral Sun is okay... but I don't know if it's the best we can do."

## Panel

### 1. Ryoji Ikeda → "Data Rain"
Vertical lines falling at different speeds. Each minute adds a new column. Background: pure black. Lines start as single white pixels, warm to amber over time. Noise displacement makes each line sway organically. Under 10 draw calls. The density IS the timer — at 5min you see a gentle rain, at 30min a torrent.

**Score: 68/110** — Too cold. "Data visualization" energy, not warmth. Violates Commandment 8 (breathing).

### 2. Ryoichi Kurokawa → "Terrain"
A slowly forming topographic landscape. Time draws contour lines from center outward — a mountain rising from water. Noise-generated ridges create organic topography. Early: a single contour. 5min: rolling hills. 30min: mountain range. Colors warm from dark earth (near-black) through clay (rose) to sunlit peak (amber). Contours subtly breathe.

**Score: 85/110** — Beautiful, deeply organic. Complex to implement. The contour breathing is sublime.

### 3. Casey Reas → "Network"
Nodes appear one by one. They connect to neighbors with thin lines. Network grows organically — new nodes sprout from existing ones. Noise makes the network breathe. 5min: 3-4 nodes. 30min: dense web. Nodes start rose, connections amber.

**Score: 62/110** — Too "tech startup." Neural network aesthetic feels corporate, not warm.

### 4. Manfred Mohr → "Fold"
A single line slowly bends and folds. Each fold = one minute. Starts straight, bends at minute one, folds again at two. By 30min: intricate origami form. Noise adds organic wobble. Colors progress rose→amber along the length.

**Score: 70/110** — Interesting but too geometric. Doesn't breathe enough. Violates Commandment 8.

### 5. Zach Lieberman → "Breath"
The screen breathes. A single large circle that inhales (grows) and exhales (shrinks) at a calm rate. Over time, the edge develops texture — smooth → complex noise patterns. 5min: smooth breathing orb. 15min: edge undulates. 30min: wildly organic corona. Color warms from rose to amber. Breathing slows from 1Hz → 0.3Hz over 30min.

**Score: 93/110** — Deeply aligned with Commandments 8 (breathing), 9 (restraint), 10 (alive not animated). Simple, powerful, meditative.

### 6. Jessica Rosenkrantz / Nervous System → "The Vein"
Raven Kwok's venation algorithm made real. Single point at center. Branches grow outward like leaf veins or river deltas. Growth is slow, organic, mesmerizing. 30s: first branch. 5min: small tree. 30min: full venation pattern filling canvas. Colors: rose (trunk) → amber (mid) → sage (tips). Noise makes branches curved and natural.

**Score: 96/110** — Uses the Kwok foundation brilliantly. Growth IS the timer. Deeply satisfying. Every pixel earned. Progressive disclosure perfected.

### 7. Robert Hodgin → "Warm Drift"
Particles drift like embers in still air. Appear one by one. 1min: 3 particles. 5min: ~20. 30min: hundreds — a gentle constellation. Noise gives each particle an unpredictable path. Rose → amber → sage embers over time. Background warms. The density IS the timer.

**Score: 78/110** — Beautiful and calm, but we've tried particle fields before (The Flow, rejected). Less novel.

## Rankings

| Rank | Proposal | Score | Artist |
|------|----------|-------|--------|
| 🥇 | The Vein | 96 | Nervous System |
| 🥈 | Breath | 93 | Lieberman |
| 🥉 | Terrain | 85 | Kurokawa |
| 4th | Warm Drift | 78 | Hodgin |
| 5th | Fold | 70 | Mohr |
| 6th | Data Rain | 68 | Ikeda |
| 7th | Network | 62 | Reas |

## 🏅 Wildcard Award: "Terrain" (Kurokawa)
The topographic contour approach is the most unexpected — nobody else went 3D-implied-through-2D.

## 😂 Comedy Award: "Network" (Reas)
When your timer visualization looks like a LinkedIn connections graph. "Your practice session has 47 mutual connections."

## Synthesis: "The Living Vein"

**Winner: Venation + Breath + Terrain**

Take Nervous System's venation growth as the core (branches growing outward over time). Add Lieberman's breathing quality (the whole structure subtly inhales/exhales). Use Kurokawa's color journey (earth → clay → amber → sage progression along branches).

### Architecture:
- **Growth algorithm:** Scattered "auxin" particles on canvas. Branches grow toward nearest auxin source (Kwok's venation technique).
- **Time mapping:** Growth rate = f(elapsed). First branch at 30s. Canvas fills by ~30 minutes.
- **Noise displacement:** Kwok-style fbm on all branch segments — organic curves, not straight lines.
- **Breathing:** Entire structure scales by 1±0.003 on a sine wave (Lieberman: alive, not animated).
- **Color:** Lerp from rose (trunk) → amber (mid-branches) → sage (tips) based on generation depth.
- **Ghost branches:** Completed growth areas at low opacity. Active growth tips glow.
- **Background:** Eliasson's Slow Sun (keep from v1) — warms over 30min.
- **Progressive disclosure:** Nothing for 30s → first branch → complexity earned.

### Why this wins:
1. Uses Raven Kwok's actual technique (venation) — not just noise on a shape
2. Growth IS the timer — more time = more intricate = more beautiful
3. Every branch is earned through practice time
4. Deeply organic, never mechanical
5. The breathing makes it feel alive
6. Color journey through warm palette is natural (tree metaphor)
