# Ear Training for The River — Research Report

> The River already has 80% of the technical infrastructure needed. The question is which features deliver the most ear-opening value with the least complexity.

---

## Top 3 Features to Build (Ranked)

### 1. Interval Recognition (Call & Response) — HIGHEST IMPACT

**What:** App plays two notes in sequence. User identifies the interval (m2 through P8). Optionally, user plays/sings the interval back via the existing microphone.

**Why first:** The single most transferable ear training skill. Every melody and chord is intervals. We already have `playReferenceTone()`, `pitchy` pitch detection, and `frequencyToNote()` + `centsOff()`. The `INTERVALS` object in ShedPage already maps every scale type to semitone offsets.

**Feasibility:** Very high. ~300-line component + ~150-line utility. No new dependencies.

### 2. Chord Quality Recognition — HIGH IMPACT

**What:** App plays a chord (3-4 simultaneous oscillators). User identifies major, minor, dim, aug, 7th, etc.

**Why second:** The second most practical skill for guitarists. `CHORD_FORMULAS` already has all the formulas. Web Audio API trivially plays multiple oscillators simultaneously.

**Richer timbre:** Layer sine + triangle oscillators with slight detuning (~0.2%) to approximate a piano tone. ~50 lines of Web Audio code, zero dependencies.

### 3. Scale Degree Identification (Functional Ear Training) — HIGH IMPACT

**What:** App plays a I-IV-V-I cadence to establish key, then a single note. User identifies the scale degree. This is the Functional Ear Trainer method.

**Why third:** Trains *functional hearing* — hearing notes in context, how professionals actually hear music. Natural connection to The Dock's existing key/scale selector.

---

## Best UI Patterns from Existing Apps

| App | Key Pattern | Steal | Leave |
|-----|------------|-------|-------|
| **Functional Ear Trainer** | One-question-at-a-time, zero clutter | Minimal focus, cadence resets ear before each question | — |
| **ToneGym** | Beautiful visual identity per exercise type | Visual clarity, one-exercise-per-screen | XP, streaks, leaderboards |
| **Perfect Ear** | Progressive curriculum, unlockable levels | Start with easy intervals (P5, P8), widen gradually | Gating, explicit level numbers |
| **Teoria.com** | Academic precision, clean interaction | "Interval comparison" as beginner exercise, unlimited re-listens | Dry visual design |
| **Earpeggio** | Song anchors ("Here Comes the Bride" = P4) | Gentle melody hints when stuck | — |

---

## The River's Philosophy Applied

### No Guilt, No Scores, No Streaks
- **No wrong answers, only discoveries.** Wrong tap → play both intervals back-to-back: "You heard a minor 3rd. Here's the major 3rd. Hear the difference?"
- **No accuracy tracker.** Insights engine notes patterns ("You've been exploring minor intervals") without showing a score.
- **No session count.** Just listening.

### The River Metaphor
- **"Listening Pools"** — Ear training exercises are pools along the river where you stop and listen
- **"The river reveals"** — New intervals appear as the river widens naturally, not as unlocked levels
- **"Echoes"** — Call-and-response mode where you echo what the river plays

---

## Technical Approach

### Tone Generation (Web Audio API)
```javascript
function playInterval(rootFreq, semitones, delay = 0.8) {
  const secondFreq = rootFreq * Math.pow(2, semitones / 12);
  playTone(rootFreq, 1.0);  // ADSR envelope for musical sound
  setTimeout(() => playTone(secondFreq, 1.0), delay * 1000);
}

function playChord(rootFreq, semitoneOffsets) {
  // Layer sine + triangle with slight detuning per note for richness
  semitoneOffsets.forEach(s => {
    const freq = rootFreq * Math.pow(2, s / 12);
    playTone(freq, 2.0, 'sine');
    playTone(freq * 1.002, 2.0, 'triangle', 0.1);  // subtle richness
  });
}
```

### Microphone Call-and-Response
Reuses entire pitchy pipeline from GuitarTuner. Flow:
1. App plays interval
2. User taps "Echo" (activates mic)
3. pitchy detects frequencies
4. `frequencyToNote()` + `centsOff()` checks against expected
5. Visual feedback via adapted chronograph dial

### No New Dependencies Required
Everything builds on Web Audio API + existing pitchy library.

---

## Code Architecture

```
src/utils/earTraining.js         (NEW ~150 lines — tone gen, interval math, questions)
src/components/EarTraining.jsx    (NEW ~400 lines — main component)
```

**Integration:** New intent in ShedPage's INTENTS array:
```javascript
{ id: 'ear', label: 'Ear', icon: '👂', desc: 'Train your hearing' }
```

### Build Phases
- **Phase 1:** Interval Recognition (1 session)
- **Phase 2:** Chord Quality (1 session)
- **Phase 3:** Scale Degrees + Microphone Echo (1-2 sessions)

---

## Existing Infrastructure We Build On

| File | What it provides |
|------|-----------------|
| `src/utils/tuner.js` | `frequencyToNote()`, `centsOff()`, frequency math |
| `src/utils/audio.js` | AudioContext init, oscillator patterns, ADSR envelopes |
| `src/components/GuitarTuner.jsx` | `playReferenceTone()`, pitchy integration, mic permission flow |
| `src/components/ShedPage.jsx` | `INTERVALS`, `CHORD_FORMULAS`, `NOTES`, `getScaleNotes()` |
