# The River — Sound Audit
## Panel Discussion: Sonic Identity for a Contemplative Practice App

**Date:** March 8, 2026
**Panel:** Sam Aaron, Ge Wang, Holly Herndon, Hans Zimmer
**Subject:** Defining the sonic world of The River

---

## I. Opening Statements

**Sam Aaron:** Right, so the first thing I want to say is — this app already has the right instinct. It's mostly silent. Most apps get sound catastrophically wrong because they treat it as reward pellets. Ding! You did a thing! That's Pavlov, not music. The River's sound world should be *generative* — meaning it emerges from the practice itself, not bolted on top of it. Think of it as live-coded silence with punctuation.

**Ge Wang:** I agree with Sam on restraint, but I want to push further on intentionality. Every sound in this app needs to be *composed*, not selected from a library. When you use the Web Audio API, you're building an instrument. An oscillator is not a sound effect — it's a voice. This app has one voice right now, the tuner sine wave. It needs maybe four or five voices total. Not more.

**Holly Herndon:** What interests me about this project is the intimacy. Someone alone with their guitar, late at night, deep blue screen. The sounds should feel like they're coming from inside the app, not projected at the user. I keep thinking about breath — the VISION.md mentions "Ando's Breath" for the opening. That's exactly right. The sonic palette should be respiratory. Inhale, exhale. Swells and recessions. Not attacks.

**Hans Zimmer:** I've scored films where people sit in silence for two minutes before anything happens. The silence IS the score. What this app needs is what I call emotional architecture — you build the room with sound so the musician feels held. Not entertained. Held. The practice session has an arc: arrival, immersion, emergence, reflection. Each phase needs a different sonic temperature. But most of the arc should be silent.

---

## II. Moment-by-Moment Discussion

### App Opens (Ando's Breath)

**Hans Zimmer:** This is the threshold. In Interstellar, when Cooper leaves his daughter — there's an organ note that just... *lives* there. Not a melody. A presence. The app open should be a single tone that fades in over 1.5 seconds and fades out over 3. Like the room filling with air.

**Sam Aaron:** I'd make it a filtered pad — low-pass a triangle wave, sweep the cutoff up slowly. Start at maybe 80Hz, let it breathe up to 200Hz, then fade. Under a second of audible sound. You feel it more than hear it.

**Ge Wang:** Two oscillators, detuned by 2-3 cents. That creates a subtle beating that feels alive rather than synthetic. C2 and C2+3 cents. Triangle waves. The beating frequency is so slow it mimics breathing.

**Holly Herndon:** Can we add a whisper of noise? Just 200ms of filtered white noise at the very start, like an intake of breath before the tone. Almost subliminal.

**Hans Zimmer:** Yes. The breath before the note. That's the door opening.

### Timer Starts (Practice Begins)

**Holly Herndon:** This is the most important transition in the entire app. You're crossing from "thinking about practicing" to "practicing." It should feel like stepping into water.

**Ge Wang:** A rising fifth. Two sine waves — root and fifth, maybe C3 (131Hz) and G3 (196Hz). But not simultaneous. The root arrives first, the fifth follows 150ms later. Quick attack, medium release. Total duration under 400ms. Clean. Certain.

**Sam Aaron:** I love that, but soften the attack. Use a 50ms fade-in instead of a hard onset. And add a tiny bit of reverb — not a room reverb, just a convolution tail of about 300ms. It should sound like it happened in a chapel, not a phone speaker.

**Hans Zimmer:** The rising interval is correct. It says "begin." But keep it at pianissimo. The musician is about to make sound. Your sound should bow to theirs.

### Timer Pauses / Resumes

**Sam Aaron:** Pause is a breath. Resume is the same breath reversed. Literally — use the same sound, just mirror the envelope. Pause: quick attack, long release (fade out over 500ms). Resume: slow attack (500ms fade in), quick sustain.

**Ge Wang:** I'd go simpler. Pause: a single soft tone stepping down a minor second. Like a gentle "ah." Resume: same tone stepping back up. Two notes, 100ms each, sine wave. Very quiet. Almost tactile.

**Holly Herndon:** Or — and hear me out — pause is just the absence of sound. A tiny 30ms click, like a record needle lifting. Resume is the needle dropping back. Analog metaphor.

**Hans Zimmer:** Holly's right. These are the lightest moments. Almost no sound. A whisper of state change. The musician is still in the room — you don't want to break their headspace.

**Sam Aaron:** I'll concede. Minimal is right here. A filtered click. 30ms burst of noise through a bandpass at 800Hz. Soft.

### Timer Stops (Save Flow)

**Ge Wang:** This is closure. A descending interval — fifth back to root. The inverse of timer start. G3 down to C3. Same voicing, same envelope, reversed direction.

**Hans Zimmer:** Yes, but add warmth. The descending fifth should have a longer tail. Let it ring for 800ms. The musician just finished practicing. Give them a moment of resonance.

**Holly Herndon:** And lower the fifth by an octave from the start tone. So if start was C3-G3, stop is G2-C3. It grounds you. You've gone deeper.

### Session Saved (Celebration)

**Hans Zimmer:** This is the moment I care about most. The musician gave their time. The river received it. This should feel like... the river acknowledging your presence. Not a trophy. An embrace.

**Sam Aaron:** A major chord arpeggio? C-E-G, sine waves, each note 200ms apart, each fading over 1 second. Like dropping three pebbles into water and listening to the ripples overlap.

**Ge Wang:** Three pebbles. I love that metaphor. Technically: three sine oscillators at C4 (262Hz), E4 (330Hz), G4 (392Hz). Staggered onsets at 0ms, 180ms, 360ms. Each with a 30ms attack and 1200ms exponential decay. The overlap creates this bloom.

**Holly Herndon:** Add a subtle octave doubling on the root — C4 and C5, with C5 at maybe 20% volume. It gives the chord a shimmer without sounding synthetic.

**Hans Zimmer:** And — this is crucial — the chord should emerge from the same tonal center as the timer start. C major throughout. Consistency creates home. The user should feel they're in a key, not hearing random sounds.

### Milestone Unlocked

**Holly Herndon:** This needs to be special. Rare. Something you've never heard in the app until this moment. My instinct: a longer phrase. Maybe 1.5 seconds. Use harmonics — a fundamental with the 3rd, 5th, and 7th overtones. Like a bell being struck once, but a bell made of light.

**Ge Wang:** Additive synthesis. Fundamental at C4, then partials at the 3rd (C5+G5), 5th, and 7th harmonic, each at decreasing amplitude. Shape it with a sharp attack and a very long 2-second decay. Metallic but warm.

**Sam Aaron:** Differentiate it from session-saved. Session-saved is three pebbles. Milestone is a single resonant strike. One event, but richer. Like the difference between rain and a gong.

**Hans Zimmer:** In Inception, the kick — the deep brass BWAAAH — works because you've been waiting for it. Milestones work the same way. The user has heard the gentle session-saved sound fifty times. Then this arrives, and it's wider, deeper, more harmonically complex. The contrast IS the celebration.

### Fog Horn (Rest Day)

**Ge Wang:** This already has a sound, right? I'd refine it. A fog horn is literally a low-frequency tone with a slow amplitude envelope. F2 (87Hz), triangle wave, 2-second attack, 1-second sustain, 2-second release. But gentle. A real fog horn is a warning. This one is a benediction.

**Sam Aaron:** Detune two oscillators slightly — 87Hz and 87.5Hz. That half-hertz beating is the "foggy" quality. It pulses like something breathing in the distance.

**Holly Herndon:** I love that this exists. Rest has a sound. Rest has a voice. Don't change it much. Just make sure it's in the same tonal family as everything else.

### Tab Switching

**Sam Aaron:** Nothing. Or almost nothing.

**Ge Wang:** Agreed. A 10ms filtered tick at most. Like a fingertip on glass.

**Holly Herndon:** Silent. Tab switching is navigation, not an event. Don't sonify infrastructure.

**Hans Zimmer:** The only exception: switching TO the timer while it's running could have a subtle warmth shift. But Holly is right — navigation is silent.

**ALL:** Consensus: silent or near-silent.

### Oblique Card Appears

**Sam Aaron:** Oh, this is fun. The daily surprise. It should sound like a card being dealt. A quick swish. Filtered noise burst — bandpass at 2kHz, 80ms duration, fast attack, medium decay.

**Holly Herndon:** I was thinking the opposite — something tonal. A single high note, like a windchime catching a breeze. B5 (988Hz), sine wave, 50ms attack, 400ms decay. Quiet. A whisper from the muse.

**Ge Wang:** Holly's windchime is better. The oblique card is a message from the river. It should sound organic, not mechanical.

**Hans Zimmer:** One note. High. Brief. Like a star appearing. The philosopher's sound.

### Chord Diagram Tapped

**Sam Aaron:** This is a teaching moment. The user tapped a chord to learn it. Give them the chord! Actually synthesize the guitar voicing — six sine waves at the frequencies of the chord's notes. That's the most useful sound in the entire app.

**Ge Wang:** Stagger the onsets by 15ms each to simulate a strum. Six oscillators. Quick attack, 800ms decay. Use the actual frequencies of the chord as fretted on a guitar.

**Holly Herndon:** That's brilliant and technically feasible. The chord data is already in the app — you just need a frequency lookup table for each fret position. This turns the diagram into an instrument.

**Hans Zimmer:** The chord should ring and then fade like a real guitar. Exponential decay. And if someone taps multiple chords in a progression... they hear the progression. Now the app is singing to them.

**Ge Wang:** Priority note: this is the highest-effort sound to implement well but also the highest value. Start with a basic version — maybe just the root, third, and fifth of the chord, not all six strings.

### Tuner Reference Tone (Existing)

**Ge Wang:** The existing sine wave works, but it could be warmer. Add a tiny amount of the 2nd harmonic — maybe 10% amplitude at 2x the fundamental. Pure sine waves sound sterile. A touch of harmonic content makes it feel like an instrument.

**Sam Aaron:** Also consider shaping the onset. Don't click on. Fade in over 50ms. Fade out over 100ms. Clicks are the enemy of contemplation.

---

## III. Top 5 Sonic Moments (Priority Order)

**Hans Zimmer:** Let me synthesize. We've identified eleven moments. Here are the five that define the emotional arc:

1. **Session Saved** — The acknowledgment. The river receives you. (Three-pebble C major bloom)
2. **Timer Starts** — The threshold crossing. You step into the water. (Rising fifth, C3-G3)
3. **App Opens (Ando's Breath)** — The sacred pause. The room fills. (Detuned triangle pad + breath noise)
4. **Milestone Unlocked** — The rare gong. Rich harmonic bell strike, heard only at thresholds.
5. **Chord Diagram Tapped** — The app becomes an instrument. The highest-utility sound.

**Sam Aaron:** I'd swap 4 and 5, but I won't fight it.

**Ge Wang:** The order is right. Milestone is about emotion. Chord tap is about utility. Emotion first.

**Holly Herndon:** Agreed. Build these five first. Everything else is optional polish.

---

## IV. Technical Specifications

### Global Sound Design Rules

- **Tonal center:** C major. All tonal sounds derive from C major intervals.
- **Volume ceiling:** -18dB relative to system max. These sounds sit under music, not over it.
- **Master gain node:** All sounds route through a single GainNode for global volume control.
- **`prefers-reduced-motion` check:** If true, disable all sounds except chord diagram tap (utility, not decoration). Provide a manual toggle in settings regardless.
- **No loops:** Every sound is a one-shot event. No sustained drones, no ambient layers during practice.
- **Envelope standard:** All sounds use `linearRampToValueAtTime` or `exponentialRampToValueAtTime` for attack/decay. Never hard-start an oscillator.

### Oscillator Recipes

**Ando's Breath (App Open):**
```
Noise burst: 200ms white noise → bandpass 400Hz Q:1 → gain 0.03 → fade out
Pad: 2x TriangleOscillator at C2 (65.4Hz) detuned +3 cents
     Gain: 0→0.06 over 1500ms, hold 500ms, 0.06→0 over 3000ms
     LowPassFilter: cutoff sweep 80Hz→200Hz over 2000ms
Total duration: ~5 seconds
```

**Timer Start (Rising Fifth):**
```
Osc1: Sine at C3 (130.8Hz), gain 0→0.08 over 50ms, hold 200ms, 0.08→0 over 300ms
Osc2: Sine at G3 (196.0Hz), onset +150ms, same envelope
Optional: ConvolverNode with 300ms impulse response (or simple delay feedback)
Total duration: ~700ms
```

**Timer Pause:**
```
Noise click: 30ms white noise → bandpass 800Hz Q:3 → gain 0.04 → fade out 50ms
Optional tone: Sine at C3, 100ms, gain 0.03, quick fade
Total duration: ~80ms
```

**Timer Resume:**
```
Same as pause, pitch shifted up slightly (bandpass at 1000Hz)
Total duration: ~80ms
```

**Timer Stop (Descending Fifth):**
```
Osc1: Sine at G2 (98.0Hz), gain 0→0.07 over 50ms, sustain, fade over 800ms
Osc2: Sine at C3 (130.8Hz), onset +150ms, same envelope, fade over 1000ms
Total duration: ~1200ms
```

**Session Saved (Three Pebbles):**
```
Osc1: Sine C4 (261.6Hz) + Sine C5 (523.3Hz) at 20% vol
       onset 0ms, gain 0→0.07 attack 30ms, exponential decay 1200ms
Osc2: Sine E4 (329.6Hz)
       onset 180ms, gain 0→0.06 attack 30ms, exponential decay 1200ms
Osc3: Sine G4 (392.0Hz)
       onset 360ms, gain 0→0.06 attack 30ms, exponential decay 1200ms
Total duration: ~1560ms
```

**Milestone (Harmonic Bell):**
```
Additive synthesis — single strike:
  Fundamental: C4 (261.6Hz), gain 0.08
  3rd partial: G5 (784Hz), gain 0.04
  5th partial: E6 (1318Hz), gain 0.02
  7th partial: Bb6 (1865Hz), gain 0.01
All: attack 5ms (sharp), exponential decay 2500ms
Total duration: ~2500ms
```

**Fog Horn (Rest Day):**
```
Osc1: Triangle at F2 (87.3Hz), gain 0.05
Osc2: Triangle at 87.8Hz (0.5Hz beating), gain 0.05
Envelope: attack 2000ms, sustain 1000ms, release 2000ms
Total duration: ~5000ms
```

**Oblique Card (Windchime):**
```
Osc1: Sine at B5 (987.8Hz), gain 0→0.04 attack 50ms, decay 400ms
Total duration: ~450ms
```

**Chord Diagram Tap (Simulated Strum):**
```
6 Sine oscillators at chord-specific frequencies (from fret data)
Stagger: 15ms between each onset (low string to high)
Each: gain 0→0.05 attack 10ms, exponential decay 800ms
Optional: add 10% 2nd harmonic to each for warmth
Total duration: ~890ms
Requires: frequency lookup table mapping (string, fret) → Hz
```

**Tab Switching:** Silent. No sound.

**Tuner Reference (Refinement):**
```
Existing sine wave + add 2nd harmonic at 10% amplitude
Onset: 50ms fade-in (eliminate click)
Offset: 100ms fade-out
```

---

## V. Closing Statement — Hans Zimmer

**Hans Zimmer:** I want to say something about the emotional arc. A practice session is not a flat line. It's a story.

The musician opens the app. Silence. Then — a breath. The room acknowledges them. They press start, and a rising fifth says: *you're here now, you've crossed over.* Then — and this is the important part — the app goes completely silent. For twenty minutes, forty minutes, an hour, the only sound is their guitar. The app holds space. It does not interrupt. It does not remind. It holds space.

When they stop, a descending tone says: *you can come back now.* When they save, three notes bloom like pebbles dropped in still water. The river received their time.

And then, once in a great while — maybe every few weeks — a richer sound arrives. A bell made of overtones. A milestone. And because the app has been so quiet, so restrained, so respectful... that single bell feels like the most important sound in the world.

That is the arc. Silence, threshold, silence, acknowledgment, silence, and — rarely — wonder.

The best film scores are 80% silence. The best practice companion should be 95%.

---

## VI. Summary Table

| Moment | Sound | Priority | Technical Spec |
|---|---|---|---|
| App Opens (Ando's Breath) | Detuned triangle pad with noise-breath onset | P3 | 2x Triangle C2 detuned +3 cents, LP sweep 80-200Hz, 5s total |
| Timer Starts | Rising perfect fifth (C3 to G3) | P2 | 2x Sine, 150ms stagger, 50ms attack, 300ms decay, ~700ms |
| Timer Pauses | Soft filtered click (needle lift) | P6 | 30ms noise burst, bandpass 800Hz, gain 0.04 |
| Timer Resumes | Soft filtered click (needle drop) | P7 | 30ms noise burst, bandpass 1000Hz, gain 0.04 |
| Timer Stops | Descending fifth (G2 to C3) | P8 | 2x Sine, 150ms stagger, 800-1000ms decay |
| Session Saved | Three-pebble C major bloom | P1 | 3 Sines (C4+E4+G4), 180ms stagger, 1200ms decay, octave shimmer |
| Milestone Unlocked | Harmonic bell strike | P4 | Additive: C4 + 3rd/5th/7th partials, 5ms attack, 2500ms decay |
| Fog Horn (Rest Day) | Beating triangle drone, benediction tone | P9 | 2x Triangle ~87Hz, 0.5Hz beat, 5s envelope (already exists, refine) |
| Tab Switching | Silent | -- | No sound |
| Oblique Card Appears | Single high windchime note | P10 | Sine B5, 50ms attack, 400ms decay |
| Chord Diagram Tapped | Simulated strum of actual chord | P5 | 6 Sines at chord freqs, 15ms stagger, 800ms decay |
| Tuner Reference Tone | Existing sine + warmth | P11 | Add 2nd harmonic at 10%, 50ms fade-in/100ms fade-out (refine existing) |

**Implementation order:** P1 through P5 first. P6-P11 are polish.

---

*"The best film scores are 80% silence. The best practice companion should be 95%."* — Hans Zimmer, Sound Audit Panel
