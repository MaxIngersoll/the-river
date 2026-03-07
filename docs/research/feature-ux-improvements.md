# The River — Feature & UX Improvement Report

---

## Top 5 Feature Improvements

### 1. Practice Routines with Timed Segments
**Why:** The River tracks *that* you practiced, but not *what* to practice next. Serious guitarists structure sessions: 10min warmup scales, 15min chord changes, 20min song work. A configurable routine builder transforms The River from a tracker into a practice partner.

**Implementation:** Add `routines` to localStorage — each with name, ordered segments (label, duration, tag), and metadata. Timer steps through segments sequentially, announcing transitions with a gentle chime. Segment labels auto-populate session notes/tags on save.

### 2. Audio Recording & Playback (Practice Journal with Sound)
**Why:** The most emotionally compelling progress evidence a practice app can offer. Hearing yourself from 2 months ago vs today is worth more than any statistic. We already have mic access and Web Audio infrastructure.

**Implementation:** During timer sessions, a "Record" toggle captures audio via `MediaRecorder` API. Store compressed Opus/WebM blobs (~50KB per 30-second clip) in IndexedDB. Cap at 60 seconds per recording, 50 recordings total. Session history shows a waveform icon for recorded sessions; tap to play inline.

### 3. Tag-Based Practice Analytics & Focus Distribution
**Why:** Tags (Technique, Songs, Theory, Improv, Ear Training) are stored on every session but barely analyzed. Showing how practice distributes across categories — and how it shifts week to week — turns raw hours into actionable self-awareness. **Lowest effort, highest impact.**

**Implementation:** Add a "Focus" section to the River tab: stacked proportional bar showing tag distribution for current week, swipeable to compare with last week/month. Uses existing `TAG_COLORS`. Below: the most neglected tag ("You haven't practiced Ear Training in 12 days"). Zero schema changes — just new computed views over `sessions`.

### 4. Metronome with BPM Progression Tracking
**Why:** One of the few objectively measurable things about guitar progress. Tempo progression over time directly answers "Am I actually getting better?" — the deepest anxiety any practicing musician has.

**Implementation:** Promote metronome from SoundscapePanel to a standalone component in the timer flow. When active during a session, save BPM alongside session data. Add a "Tempo Journey" sparkline (simple SVG path) showing BPM over time, filterable by tag. No charting library needed.

### 5. Automated Backup Reminders
**Why:** Data loss anxiety is the #1 reason users abandon local-first apps. The River Archive exists but requires manual action.

**Implementation:** Track `lastBackupDate` in settings. On launch, if >7 days since last backup, show a gentle non-blocking toast. One-tap triggers File System Access API (`showSaveFilePicker`) on supported browsers, download fallback otherwise. Extend vault health indicator in Settings.

---

## Top 3 UX Improvements

### 1. Swipe Navigation + Pull-Down Quick Log

**The change:** Add horizontal swipe between tabs (River ↔ Log ↔ Tuner ↔ Dock). Add pull-down gesture on River tab that opens Log form as a bottom sheet.

**Why it improves usability:** The most common action — "I just practiced, let me log it" — goes from 2 taps (tab switch → fill form) to 1 gesture (pull down → fill form). The bottom sheet pattern is native to iOS (Apple Health, Maps, Fitness). Swiping supplements tab bar taps — doesn't replace them.

### 2. Haptic Micro-Interactions on Key Moments

**The change:** Add `navigator.vibrate()` at interaction moments that currently feel "flat":
- Duration preset tap: 10ms pulse + 1.05x scale bounce
- Session save: 40ms haptic + checkmark morph animation
- Tuner string lock-in: 80ms burst + gold flash pulse
- Tag toggle: 5ms micro-tap
- Milestone celebration: Pattern `[20, 40, 20, 40, 60]`

**Why it improves usability:** Physical feedback bridges the gap between a website and a native app. The Fog Horn already uses haptics — extending it everywhere creates a consistent "the app is alive" feeling. For the tuner especially, a strong haptic on lock-in tells the user "that string is done" without looking at the screen.

### 3. Contextual FAB Morphing Based on Tab

**The change:** Transform the Timer FAB from single-purpose to context-aware:
- **River tab, no session today:** Shows "+" icon, primary action opens quick-log bottom sheet
- **Dock tab:** Shows metronome icon, starts timer with metronome pre-enabled
- **Tuner tab:** FAB hidden (tuner has its own UI, floating button over dial creates visual clutter)
- **Timer running:** Always shows running timer regardless of tab (current behavior)
- **Transitions:** Icon cross-fades while button holds position

**Why it improves usability:** A single FAB that always does the same thing is simple but not smart. When a user just finished an untimed session, they have to ignore the FAB and navigate to Log. Contextual FABs make the button feel like an intelligent assistant.

---

## Summary

| # | Type | Recommendation | Effort | Impact |
|---|------|---------------|--------|--------|
| F1 | Feature | Practice routines with timed segments | Medium | High |
| F2 | Feature | Audio recording during sessions | Medium-High | Very High |
| **F3** | **Feature** | **Tag-based practice analytics** | **Low** | **High** |
| F4 | Feature | Metronome with BPM progression | Medium | High |
| F5 | Feature | Automated backup reminders | Low | Medium-High |
| U1 | UX | Swipe nav + pull-down quick log | Medium | High |
| U2 | UX | Haptic micro-interactions | Low | Medium-High |
| U3 | UX | Contextual FAB morphing | Medium | Medium |

**Quick win:** F3 (Tag-based analytics) — zero schema changes, uses data already collected.
**Biggest single addition:** F2 (Audio recording) — hearing your own progress is the most emotionally compelling evidence a practice app can offer.
