# Competition M — Ready Page Redesign

**Date:** 2026-03-10 (Session 13 dinner sprint)
**Tier:** 2 (Quick — 3 personas x 1 proposal)
**Brief:** The Ready page has too much information visible at once. It needs progressive disclosure. Content is right; organization is wrong.
**Constraint:** Max: "I like all the content... but it's just too much information. There needs to be some sort of better organization."

## Current State (from analysis)

~1,004 lines across 6 files. Content sections:
1. Oblique Strategy card (dismissible)
2. Header ("Ready")
3. The Current (smart suggestion, conditional)
4. Quick Start triptych (3 cards, conditional)
5. Tuning Strip (6 string buttons)
6. Root Lock (key/scale selectors)
7. Intent Navigation (4 tabs: Chords, Scale, Circle, Quick Ref)
8. Dynamic content area (swaps on tab selection)
9. Easter egg footer

**Problem:** Everything below the Intent Nav is deeply interactive but permanently expanded. Chord diagrams, fretboard, circle of fifths, progressions — all compete for attention. No clear visual hierarchy guiding the eye.

## Panel

### 1. Luke Wroblewski (Mobile Forms Expert) → "The Pocket"
**Constraint:** Touch-first, progressive disclosure, minimal cognitive load

**Proposal:**
Kill the long scroll. The Ready page becomes a **single-screen dashboard** with 4 large tap targets:

```
┌──────────┬──────────┐
│  ♫       │  🎸      │
│  Chords  │  Scale   │
│          │          │
├──────────┼──────────┤
│  ⊙       │  📖      │
│  Circle  │  Ref     │
│          │          │
└──────────┴──────────┘
```

Each tile opens a **full-screen BottomSheet** with that section's content. Root Lock and Tuning Strip live in a collapsed header bar that persists across all sheets. The Current card appears as a floating suggestion pill above the grid (like iOS suggestions).

**Key idea:** Nothing scrolls on the main page. Everything is one tap away.

**Score: 88/110** — Clean, clear, very mobile-native. Risk: losing context when switching between sheets. But the hierarchy is perfect.

### 2. Jared Spool (UX Strategy) → "The Flow State"
**Constraint:** Contextual relevance, reduce decisions, smart defaults

**Proposal:**
Don't show everything — show what **matters right now**. The Ready page adapts based on your recent practice:

- **If you practiced Dm yesterday**: Ready page opens to Dm chord diagrams + scale + progressions in Dm
- **If you're new**: Show only the simplest view (open chords in C major)
- **The Current card becomes the HERO** — it drives the whole page

Layout:
1. The Current (hero, always top) → "Continue with Dm Dorian"
2. **One section visible** (the most relevant to Current), e.g., Chord diagrams in Dm
3. **"See also" pills**: Scale, Circle, Ref — tap to swap the visible section
4. Root Lock: accessible but collapsed into a small "Change key: Dm" button

**Key idea:** Smart defaults eliminate 80% of cognitive load. You don't choose — the app chooses for you, and you override only when needed.

**Score: 92/110** — Brilliant reduction of cognitive load. The Current becomes the anchor. Risk: users who want to browse freely might feel constrained. But for the primary use case (sit down and practice), this is perfect.

### 3. Dieter Rams → "The Grid"
**Constraint:** Less but better. Honest presentation. Every element serves a purpose.

**Proposal:**
The problem isn't the content — it's that everything screams equally loud. Solution: **visual hierarchy through type scale and whitespace**, not by hiding things.

Layout:
1. **Root Lock** moves to a sticky top bar (always accessible, never scrolls away)
2. **The Current** is large, prominent, with warm amber accent
3. **Intent tabs** remain but are styled as a subtle segmented control (not 4 equal buttons)
4. **Content area** gets proper section headers with generous whitespace
5. **Chord grid** → collapsed by default, shows 3 most common chords, "See all 7" expander
6. **Progressions** → collapsed, shows just names, tap to expand with chords
7. **Scale fretboard** → shows full fretboard but positions are collapsed
8. **Tuning Strip** → moves into Settings (it's a tool, not a reference)

**Key idea:** Don't remove content. Add breathing room and smart defaults for what's expanded vs collapsed.

**Score: 85/110** — The most conservative but most implementable. Rams would say: make the thing work better, don't redesign it. The accordion/expand pattern is proven and low-risk.

## Rankings

| Rank | Proposal | Score | Designer |
|------|----------|-------|----------|
| 🥇 | The Flow State | 92 | Spool |
| 🥈 | The Pocket | 88 | Wroblewski |
| 🥉 | The Grid | 85 | Rams |

## 🏅 Wildcard Award: "The Pocket" (Wroblewski)
The 2x2 grid of large tap targets is the most unexpected and mobile-native approach. Nobody else went "kill scrolling entirely."

## 😂 Comedy Award: "The Flow State" (Spool)
"Your app should know what you want to practice before you do." The LinkedIn of guitar apps. "Based on your recent activity, you might also enjoy: G Mixolydian."

## Synthesis: "Smart Ready"

**Winner: Flow State + Grid + Pocket elements**

1. **The Current as hero** (Spool) — Smart suggestion drives the page. Large, prominent, warm amber accent.
2. **Root Lock as sticky bar** (Rams) — Always accessible, never scrolls away. Small "C Major ▾" button that opens selector.
3. **Accordion sections** (Rams) — Chords, Scale, Circle, Ref are all collapsible. Smart defaults: most relevant section auto-expanded based on recent practice.
4. **BottomSheet for deep dives** (Wroblewski) — When you expand Scale or Chords fully, it can go full-screen via BottomSheet.
5. **Tuning Strip stays** — It's quick reference, belongs on Ready page, but moves below content sections.
6. **Progressive disclosure**: First visit → only Current + Chords (in C Major). Over time, as you use more features, more sections auto-expand.

### Implementation Plan:
1. Make Root Lock a sticky top bar with dropdown
2. Add accordion wrappers to all content sections
3. Auto-expand the most relevant section based on recent practice
4. Move The Current to hero position
5. Add smooth expand/collapse animations
6. BottomSheet integration for full-screen deep dives (already have BottomSheet component)
