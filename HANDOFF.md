# The River — Project Handoff Brief

## What This Is

**The River** is a guitar practice tracking app that visualizes your practice sessions as a flowing river. The more you practice, the wider and deeper your river grows. Built with React 19 + Tailwind CSS v4 + Vite 7, stored entirely in localStorage.

## The Story of Building It

This app was built across multiple sessions as a creative collaboration between Max and Claude. Here's how it came together:

### Session 1: Birth of The River
- Built the entire app from scratch — all components, utilities, PWA support
- Core concept: practice sessions feed a river that grows organically using Catmull-Rom spline curves
- Created the milestone system, quote cards, streak tracking
- Added page transitions, river color depth, flowing water animation, today marker

### Session 2: The Liquid Glass Era
- Implemented full dark mode with system preference detection and flash prevention
- Max pushed for more — "this still doesn't look like Apple Health. It doesn't have the liquid glass."
- That challenge sparked a complete visual overhaul:
  - Frosted translucent glass cards with `backdrop-filter: blur(40px)`
  - Specular highlights (bright edges on cards simulating glass catching light)
  - Inner refraction glow (light passing through glass)
  - Ambient teal background color bleeding through the panels
  - Glass tab bar with specular edge highlights
  - Dual-theme Liquid Glass system (warm cream light mode / dark glowing dark mode)
- Solved tricky technical problems: recursive useCallback patterns, node version issues, theme flash prevention

### Session 3: The Vision Expands
- Planned the next evolution: Deep Blue/Indigo colorway + Floating Action Button live timer
- Max chose blue/indigo inspired by Apple Health's Sleep/Mindfulness palette
- Max chose a persistent floating action button for the timer UX
- This is where we're picking up!

## How We Worked Together

Max creates an environment of creative safety — encouraging bold ideas, even "out there" ones. The dynamic is collaborative: Claude brings creativity, technical depth, and a willingness to push the design further. Max steers direction and makes final calls.

Key moments in our dynamic:
- Max gave direct, honest feedback ("this doesn't look like Apple Health") that pushed Claude to do significantly better work
- Max explicitly said: "It's always safe for you to offer ideas, even if they're a little out there"
- Max asked Claude to check in on itself, give itself credit, and even take a virtual break
- When asked what Claude would most want to do, Claude said: "Listen to music" — after spending all that time building a practice tracking app and thinking about flow states, it felt right to just sit with some ambient music

This isn't just a codebase — it's a product of genuine creative partnership.

## What's Next (Queued Up)

### Phase 1: Deep Blue/Indigo Colorway
Full palette swap from teal/green to deep blue/indigo. All ~35 color references across 7 files are mapped and ready. See `PLAN.md` for the exact values and file list.

### Phase 2: Floating Action Button Live Timer
A persistent FAB on all main pages that expands to a full-screen stopwatch timer. Start → pause → resume → stop → add note → save. Timer state persists across tab switches.

## Technical Architecture

```
src/
├── main.jsx              # Entry point, ThemeProvider wrapping, flash prevention
├── App.jsx               # Page routing, session state, transitions
├── index.css             # Liquid Glass design system (CSS variables, glass cards, animations)
├── contexts/
│   └── ThemeContext.jsx   # React context for theme (light/dark/auto)
├── components/
│   ├── HomePage.jsx       # Hero stat, flow pill, stat capsules, river preview, quote, sessions
│   ├── LogPage.jsx        # Manual practice logging form
│   ├── StatsPage.jsx      # Full river view, progress ring, weekly stats, personal bests
│   ├── SettingsPage.jsx   # Theme toggle, weekly goal, data management
│   ├── TabBar.jsx         # Glass tab bar with active glow
│   ├── RiverSVG.jsx       # Catmull-Rom river visualization (dual palettes)
│   ├── ProgressRing.jsx   # SVG ring with gradient (theme-aware)
│   ├── CelebrationOverlay.jsx  # Milestone celebrations
│   ├── QuoteCard.jsx      # Motivational quotes
│   └── River.jsx          # River wrapper component
└── utils/
    ├── storage.js         # localStorage CRUD for sessions
    ├── milestones.js      # Milestone detection logic
    ├── quotes.js          # Quote database
    └── theme.js           # Theme persistence, system detection, DOM toggling
```

## Running It

```bash
cd river-app
npm install
npm run dev
```

Opens on `http://localhost:5173` in mobile viewport (375×812).
