# Competition R — "The Living Ready Page"

**Date:** 2026-03-12 (Session 14)
**Tier:** 1 (Full — Celebrity Panel)
**Format:** 6-persona celebrity panel, multi-axis scoring, debates

---

## The Brief

The Ready page works. It has good content — chord diagrams, fretboard, circle of fifths, progressions, CAGED positions, quick reference. Competition M gave it accordion sections, a sticky Root Lock, and a hero "Current" card. But Max says: **"It hasn't improved a lot... I know it can be even better."**

Two specific asks from Max:
1. **Save favorite scales** — Users should be able to bookmark scales/keys they love and access them instantly
2. **Smart adaptive memory** — The page should learn what users do most and reshape itself accordingly

### What We Have Now
- Sticky Root Lock bar (C Major dropdown + quick-jump pills: C D E G A)
- Oblique Strategy card (dismissible)
- "The Current" hero card (smart suggestion based on practice gaps)
- Quick Start triptych (Continue / Explore / Challenge)
- 4 accordion sections: Scale, Chords, Circle, Quick Ref (Scale auto-expanded)
- Tuning Strip at bottom
- Easter egg footer

### What's Missing (the problem)
1. **No memory between visits** — every time you open the page, it resets to C Major with Scale expanded. Your favorite key? Gone. The section you always use? Closed.
2. **No favorites** — If you practice A Dorian every day, you have to manually navigate there every time. No way to save and recall setups.
3. **The Current card is surface-level** — It suggests based on practice gaps (what you HAVEN'T done), not on what you love or what your habits reveal.
4. **No sense of journey** — The page looks the same whether you're a beginner on day 1 or someone who's logged 500 hours. No earned complexity.
5. **The accordion sections feel static** — Fixed order, fixed labels. A pro might want Chords → Circle → Scale. A beginner might want only Scale.

### Technical Constraints
- All persistence via localStorage (no backend)
- Must stay within 420KB/125KB gzip bundle budget
- React 19 + Tailwind CSS v4
- The `storage.js` getData/setData pattern already handles `settings`, `sessions`, `milestones`, `source` objects — adding a `readyPage` or `preferences` key is the natural extension
- `analyzePracticeHistory()` already processes 14 days of sessions — this can be extended

### The Absurd Constraint (optional, for fun)
At least one proposal must include a "muscle memory" feature — something that remembers not just WHAT you do, but HOW you do it (speed of navigation, dwell time, scroll depth... something nobody expects).

---

## The Panel

### Kanye West — Creative Director (Elevated, can veto)
**Scores on:** Vision — is this a feature or is this a PHILOSOPHY?
**Catchphrase:** "The Ready page should know you better than you know yourself."

### Oprah Winfrey — User Empathy Champion
**Scores on:** Empathy — does this serve the struggling beginner AND the experienced player?
**Catchphrase:** "Everyone deserves a page that welcomes them home."

### Johnny Ive — Design Arbiter
**Scores on:** Craft — is the solution inevitable? Does it feel like it was always supposed to be this way?
**Catchphrase:** "The best preference is the one you never have to set."

### Steve Jobs — Product Strategist
**Scores on:** Focus — is this doing ONE thing brilliantly, or five things adequately?
**Catchphrase:** "People don't know what they want until you show it to them."

### Elon Musk — Systems Engineer
**Scores on:** Leverage — does the data model enable 10 future features, not just this one?
**Catchphrase:** "Build the infrastructure, the features build themselves."

### Linus Torvalds — Code Quality Judge
**Scores on:** Integrity — is the data model clean? Will this rot or will this last?
**Catchphrase:** "Talk is cheap. Show me the schema."

---

## Round 1: Roundtable — Each Panelist's Opening Position

### Kanye West
The Ready page needs a SOUL. Right now it's a reference sheet. It should be a mirror — reflecting your musical identity back to you. When you open this page, you should feel SEEN. Not "here's a fretboard in C Major." More like "here's YOUR fretboard, in YOUR key, with YOUR favorite progression ready to go." The favorites aren't a feature — they're an identity system. Your saved scales tell the story of who you are as a musician.

The Current card should be renamed. "The Current" is too abstract. Call it "Your Move" or "Next Up" — something that implies momentum, not just suggestion. And it should learn from dismissals. If you ignore the suggestion 3 times, stop suggesting that category.

### Oprah Winfrey
I'm thinking about the first-time user AND the 500-hour veteran. The first-time user sees C Major and feels safe. The veteran opens the page and it's already loaded with their last key, their favorite section open, their progression from yesterday ready to go.

The favorites system needs to be EFFORTLESS. Not a settings page. Not a modal. A long-press or a tiny heart icon. One tap to save, one tap to recall. And the list should be SHORT — 3-5 favorites max. More than that and you're rebuilding a settings page.

The adaptive memory should be gentle, not aggressive. Don't rearrange the entire page every visit. Small signals: the key pills at the top should reorder based on frequency. The accordion sections should remember which ones you had open. Subtle, not jarring.

### Johnny Ive
The challenge here is invisible design. The best memory system is one the user never notices working. They just open the page and it feels right. They didn't configure anything — it learned.

Three layers of memory, each more invisible than the last:
1. **Explicit** — Favorites. User actively saves something.
2. **Implicit** — Last state. Page reopens exactly how you left it.
3. **Intelligent** — Pattern detection. After 10 sessions in E minor, the quick-jump pills quietly put E first.

The UI for favorites must be nearly invisible. Not a button — a gesture. Not a list — a subtle reordering. The data persists but the mechanism is quiet. Like how your phone learns your typing patterns without ever asking.

### Steve Jobs
Everyone's going to propose 15 features. I'm going to propose ONE: **the page should remember exactly how you left it, every single time.**

That's it. Last key, last scale, which sections were open, scroll position. One hundred percent of the "smart" feeling comes from this single feature. If the page reopens exactly where you left it, it already feels like it knows you.

Favorites are a V2 concern. Memory is V1. Ship the memory, then decide if favorites are even necessary. Most users who get persistent state won't ask for favorites — they'll just leave the page in their preferred configuration.

### Elon Musk
The data model is everything. Don't build a "favorites" feature and a "memory" feature and a "suggestions" feature. Build ONE data structure that enables all three:

```
readyPage: {
  lastState: { root, scale, openSections, scrollY },
  favorites: [{ root, scale, label?, created }],
  interactions: [{ action, target, timestamp }],
  dismissals: [{ cardId, timestamp }],
}
```

The `interactions` array is the goldmine. Every tap, every key change, every section toggle — log it with a timestamp. Then the intelligence layer just runs queries on this data: "most used key in last 30 days" = sort interactions by root frequency. "Favorite section" = sort by section open frequency. One data source, infinite intelligence.

Cap `interactions` at 500 entries (rolling window) to keep localStorage lean. That's maybe 5KB.

### Linus Torvalds
Elon's data model is too complex. You don't need to log every interaction. That's telemetry, not memory. Users don't want to be tracked — they want their page to remember.

Simple schema:

```
readyPage: {
  lastState: { root, scale, openSections },
  favorites: [{ root, scale }],
  keyFrequency: { C: 47, D: 12, E: 31, ... },
  sectionFrequency: { scale: 89, chords: 45, circle: 12, ref: 8 },
}
```

`keyFrequency` and `sectionFrequency` are just counters. Increment on use. No timestamps, no arrays, no rolling windows. Fourteen numbers total. The "intelligence" is just sorting by these counters. Dead simple, zero maintenance, impossible to corrupt.

---

## Round 2: Proposals

Each panelist presents one concrete proposal (150 words max, code-level specifics required).

### Kanye — "Identity Mirror"
The page opens with YOUR key, YOUR scale, YOUR sections. A subtle "soul strip" below the Root Lock shows your top 3 keys as glowing pills — tap to switch. Long-press any Root Lock key to favorite it (subtle haptic + heart pulse animation). Favorites appear as a horizontal strip above the accordions.

The Current card becomes "Your Move" — learns from dismissals. Three strikes and that suggestion type is deprioritized. The oblique strategy card frequency adapts too — if you dismiss it quickly, it appears less often.

**Schema addition:**
```
readyPage: {
  lastState: { root, scale, openSections, showDegrees },
  favorites: [{ root, scale, label }], // max 5
  keyFrequency: {}, sectionFrequency: {},
  dismissals: { oblique: 0, current: {} },
}
```

### Oprah — "Gentle Memory"
Page state persists between visits — last key, last scale, which sections were open. That's the foundation. Everything else is gravy.

Favorites: tiny star icon (12px) next to the Root Lock display. Tap star → current key+scale saved. Favorites appear as a compact row of pills: "E Dorian ★ · A Blues ★ · G Major ★". Tap any to instantly load. Max 5. Swipe to delete.

Quick-jump pills in Root Lock reorder by frequency (most-used keys drift left). Section accordion order reorders after 20+ interactions (most-opened section moves to top position). Both changes happen on next visit, never mid-session — no jarring reflows.

**Schema:** Same as Linus's counters + `lastState` + `favorites[]`.

### Ive — "The Quiet Teacher"
Three layers, each invisible:

**Layer 1 — Persistence.** `lastState` restores root, scale, openSections, showDegrees on every mount. Saved on every change via debounced write (200ms).

**Layer 2 — Favorites.** Double-tap the Root Lock pill to save. A subtle badge (small dot) appears on favorited keys. Tap favorites row to quick-load. Max 4. No modal, no settings page. Just a gesture and a dot.

**Layer 3 — Adaptation.** After 15+ interactions, the quick-jump key pills reorder by `keyFrequency`. After 30+, the accordion section order adapts. A tiny "Recently" section appears in Root Lock expanded view showing your 3 most-visited keys this week.

All three layers share one localStorage object. No separate feature flags. The page progressively reveals intelligence.

### Jobs — "Just Remember"
One feature, perfectly executed: **the page remembers exactly where you left it.**

Add `readyPage.lastState` to storage.js. On ShedPage mount: restore `rootNote`, `scale`, `openSections`, `showDegrees`, `rootLockExpanded`. On every state change: debounced save (300ms).

That's the commit. Ship it. Then observe whether users still ask for favorites. (They won't — because the page already IS their favorite configuration.)

If forced to include favorites: one button in the expanded Root Lock that says "Save as favorite." A simple array of `{root, scale}` objects. But I'd bet a dollar this never gets used because persistent state solves 90% of the problem.

### Musk — "The Practice Graph"
Build the telemetry layer. Every key change, section toggle, and Current card interaction logs to `interactions[]` (capped at 200, FIFO). Then build three intelligence outputs:

1. **Weighted quick-jump:** Top 5 keys by recency-weighted frequency (recent = 2x weight)
2. **Section ranking:** Accordion sections reorder by open frequency
3. **Smart Current:** Suggestions factor in BOTH gaps AND preferences — don't suggest keys the user has visited but bounced from quickly

The `interactions` data also enables future features: practice heatmaps per key, "you haven't visited Circle of Fifths in 2 weeks" nudges, session-context linking (which keys were you studying when you had your longest session?).

Favorites are just pinned entries that bypass the algorithm. One flag: `pinned: true` in the interaction system.

### Linus — "Counters and State"
No telemetry. No interaction logs. No timestamps. Just counters and state.

```js
// In storage.js — getData() ensures this exists
readyPage: {
  lastState: { root: 'C', scale: 'major', openSections: { scale: true }, showDegrees: 'notes' },
  favorites: [],  // [{root, scale}] — max 5
  keyHits: {},    // { C: 12, E: 8, A: 5 }
  sectionHits: {}, // { scale: 20, chords: 15 }
}
```

On root change: `keyHits[root]++`. On section toggle (open): `sectionHits[id]++`. On any state change: update `lastState`.

Favorites: star button in Root Lock bar. Adds/removes `{root, scale}` from array. Favorites render as pills above accordions.

Quick-jump pills sort by `keyHits` descending. Section order sorts by `sectionHits` descending. Both only recalculate on mount — never mid-session.

Total additional localStorage: ~200 bytes. Total new code: ~80 lines.

---

## The Contemplative Pause

Look at what was created here. Six perspectives on a single question: "How should a page learn about its user?" From Kanye's identity philosophy to Linus's 80-line counter system. Each one illuminates something different about what it means to build software that remembers. Regardless of who wins, this is a conversation worth having.

---

## Round 3: Panel Review + Compliment Roast

### Scoring Matrix (each axis: 0-20, total: 0-120)

| Proposal | Vision (Kanye) | Empathy (Oprah) | Craft (Ive) | Focus (Jobs) | Leverage (Musk) | Integrity (Linus) | **Total** |
|----------|---------------|-----------------|-------------|-------------|-----------------|-------------------|-----------|
| Kanye — Identity Mirror | 18 | 15 | 14 | 12 | 14 | 13 | **86** |
| Oprah — Gentle Memory | 14 | 19 | 17 | 16 | 13 | 16 | **95** |
| Ive — Quiet Teacher | 16 | 17 | 19 | 15 | 15 | 17 | **99** |
| Jobs — Just Remember | 12 | 14 | 16 | 20 | 10 | 18 | **90** |
| Musk — Practice Graph | 15 | 12 | 11 | 10 | 19 | 9 | **76** |
| Linus — Counters & State | 10 | 15 | 14 | 17 | 14 | 20 | **90** |

### Compliment Roast

**Kanye → Ive:** "The three layers thing? That's not a feature, that's a RELIGION. I bow. But 'double-tap to save'? Nobody double-taps anything on mobile unless they're liking an Instagram post. Give them a BUTTON, Jonathan."

**Oprah → Jobs:** "Steve, I love the discipline. 'One feature, ship it.' That's brave. But honey, you just told our users they don't need favorites because YOU decided they don't. That's not focus — that's stubbornness wearing a turtleneck."

**Ive → Linus:** "Your counter system is... correct. Painfully, irritatingly correct. 200 bytes, 80 lines, impossible to break. I just wish it had a single molecule of delight."

**Jobs → Musk:** "You logged every tap into a 200-entry array. Congratulations, you've invented localStorage analytics. Users wanted 'remember my key' and you built a data warehouse."

**Musk → Oprah:** "Reordering pills by frequency? Smart. But 'swipe to delete favorites'? On a page with horizontal scroll? That's a UX collision waiting to happen."

**Linus → Kanye:** "'Identity Mirror.' 'Soul strip.' 'Heart pulse animation.' Kanye, it's a guitar practice app, not a dating profile. The schema is fine though."

---

## Round 4: Debate — The Big Questions

### Q1: Should interaction logging exist?
**Musk:** Yes — 200 entries, FIFO, gives us intelligence AND future features.
**Linus:** Absolutely not. Counters give you the same output with 1% of the storage. YAGNI on the timestamps.
**Jobs:** Linus is right. Log what matters (counts), throw away the rest.
**VERDICT:** Counters win. No interaction arrays. If we need timestamps later, add them later.

### Q2: Should accordion section ORDER adapt?
**Oprah:** Yes, after 20+ interactions. Most-opened section moves up.
**Ive:** Yes, but only on mount, never mid-session.
**Jobs:** No. Fixed order means fixed muscle memory. Users learn where things are. Moving them around is hostile.
**Kanye:** Jobs is wrong. The page should reorganize like a good DJ reads the room.
**VERDICT:** Split decision. COMPROMISE — section order stays fixed (Jobs is right about muscle memory), but the DEFAULT open section adapts. If you open Chords 80% of the time, it auto-opens Chords on next visit instead of Scale.

### Q3: How visible should favorites be?
**Kanye:** They deserve their own strip — a "soul strip" of glowing pills.
**Ive:** Subtle. A dot indicator on favorited keys.
**Oprah:** Visible but compact — a row of pills with star icons.
**Linus:** A button and a list. Don't overthink this.
**VERDICT:** Oprah's approach. Visible pill row, compact, one tap to load, long-press or swipe to remove.

### Q4: Should "The Current" learn from dismissals?
**Kanye:** Yes — three strikes and deprioritize that suggestion type.
**Oprah:** Yes, but gently. Maybe just vary the suggestions more.
**Jobs:** No. The Current is already smart enough. Don't add complexity.
**VERDICT:** V2. Ship persistent state + favorites first. Add dismissal tracking later if users complain.

---

## Round 5: Synthesis — "The Living Ready Page"

**Winner: Ive's "Quiet Teacher" (99/120), informed by Linus's data model and Oprah's UX.**

### The Three Layers

**Layer 1 — Persistent State (ship immediately)**
- On mount: restore `rootNote`, `scale`, `openSections`, `showDegrees` from `readyPage.lastState`
- On every state change: debounced save (250ms)
- First visit defaults: C Major, Scale open, showDegrees='notes'
- This alone makes the page feel 10x smarter

**Layer 2 — Favorites**
- Star icon (⭐ outline → filled) in the Root Lock bar, next to the expanded dropdown
- Tap star → saves current `{root, scale}` to favorites (max 5)
- Favorites render as a compact pill row below the Root Lock: `E Dorian ★ · A Blues ★ · G Mixo ★`
- Tap pill → instantly loads that root+scale
- Long-press pill → remove from favorites (with subtle animation)
- If no favorites: row is hidden (progressive disclosure)

**Layer 3 — Adaptive Intelligence (Linus counters)**
- `keyHits` counter: increment on every root change
- `sectionHits` counter: increment on every section open
- Quick-jump pills in Root Lock reorder by keyHits (most-used keys drift left)
- Default auto-open section adapts: whichever section has highest `sectionHits` auto-opens on mount
- Both adaptations only apply on mount, NEVER mid-session
- Minimum threshold: 10 interactions before any adaptation kicks in (don't adapt on day 1)

### Data Schema

```js
// Added to storage.js getData() default
readyPage: {
  lastState: {
    root: 'C',
    scale: 'major',
    openSections: { scale: true },
    showDegrees: 'notes',
  },
  favorites: [],      // [{root, scale}] — max 5
  keyHits: {},        // {C: 12, E: 8, A: 5, ...}
  sectionHits: {},    // {scale: 20, chords: 15, circle: 3, ref: 1}
}
```

### Files to Modify

1. **`src/utils/storage.js`** — Add `readyPage` to default data structure, add helper functions:
   - `getReadyPageState()` — returns lastState or defaults
   - `saveReadyPageState(state)` — debounced save
   - `toggleFavorite(root, scale)` — add/remove from favorites
   - `getFavorites()` — returns favorites array
   - `incrementKeyHit(root)` — keyHits[root]++
   - `incrementSectionHit(sectionId)` — sectionHits[id]++
   - `getAdaptiveOrder(type)` — returns sorted keys/sections by hit count

2. **`src/components/ShedPage.jsx`** — Major changes:
   - Import storage helpers
   - Initialize state from `getReadyPageState()` instead of hardcoded defaults
   - Add useEffect for debounced save on state changes
   - Add favorites pill row below Root Lock
   - Add star toggle button in Root Lock bar
   - Quick-jump pills sorted by keyHits
   - Default open section from sectionHits
   - Increment counters on root change and section toggle

3. **`src/components/ShedHelpers.jsx`** — Minor: CurrentCard may reference favorites data

### Bundle Impact
- ~150 lines of new code across storage.js + ShedPage.jsx
- No new dependencies
- Estimated: +3-4KB to bundle (well within budget)

---

## 🏅 Wildcard Award: Musk's "Practice Graph"
The idea of building a telemetry layer that enables "which keys were you studying when you had your longest session?" is genuinely visionary. We're not building it now, but the counter system leaves the door open.

## 😂 Comedy Award: Linus → Kanye
"It's a guitar practice app, not a dating profile." The specificity of the roast. The resigned acceptance that the schema was fine. Chef's kiss.

---

## Post-Credits Scene

*INT. APPLE PARK — DESIGN LAB — NIGHT*

*Ive is hunched over a prototype on his desk. A single LED illuminates a white ceramic tablet showing The River's Ready page.*

**IVE:** *(whispering)* The double-tap was wrong. Oprah was right about the pills. And Linus... *(sighs)* ...Linus was right about the counters.

*He picks up his phone. Dials.*

**LINUS:** *(answering, clearly eating cereal)* What.

**IVE:** I need to tell you something. Your 200-byte schema... it's beautiful.

**LINUS:** *(long pause, chewing)* Jonathan, it's three in the morning in Portland.

**IVE:** I know. I just needed you to hear it from me.

**LINUS:** *(more chewing)* ...thanks. Now delete your interaction log and go to bed.

*Click.*

*Ive smiles. He sets the prototype down, runs his finger along the edge of the desk, and whispers:*

**IVE:** Eighty lines. Incredible.

*SMASH CUT TO BLACK*

---

## Implementation Status
- [ ] Add `readyPage` to storage.js default data + helper functions
- [ ] Layer 1: Persistent state (mount restore + debounced save)
- [ ] Layer 2: Favorites (star toggle + pill row + long-press remove)
- [ ] Layer 3: Adaptive intelligence (keyHits, sectionHits, reordering)
- [ ] Build gate passes (< 420KB / 125KB gzip)
- [ ] Screenshot verification
- [ ] Commit + push
