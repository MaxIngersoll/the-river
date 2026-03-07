# The River — Decision Log

> Every architectural or design decision, with rationale. The fastest way to understand WHY things are the way they are.

| Date | Session | Decision | Rationale |
|------|---------|----------|-----------|
| 2026-03-06 | 1 | Built with React 19 + Tailwind v4 + Vite 7 | Modern stack, fast iteration |
| 2026-03-06 | 1 | localStorage only, no backend | Simplicity, privacy, zero ops |
| 2026-03-06 | 1 | River metaphor as core architecture | Practice is a relationship, not a metric |
| 2026-03-06 | 2 | Deep blue/indigo palette (not teal) | Apple Health Sleep/Mindfulness inspiration |
| 2026-03-06 | 2 | Liquid Glass design system | Max: "This doesn't look like Apple Health" |
| 2026-03-06 | 3 | Persistent FAB for timer (not page-based) | Always accessible, never interrupts |
| 2026-03-06 | 4 | Constraint-based personas for competitions | 10x better than attitude-based. Forces divergence. |
| 2026-03-06 | 4 | No GitHub-style heatmap | Max's explicit non-negotiable |
| 2026-03-06 | 4 | Rest days preserve streaks (Fog Horn) | No guilt. The river cools, it doesn't die. |
| 2026-03-06 | 4 | The Reading: margin notes surface at hour thresholds | Born from honest criticism. Literary fiction of features. |
| 2026-03-06 | 5 | Renamed Shed → The Dock | Competition A synthesis. More River-aligned. |
| 2026-03-06 | 6 | Created VISION.md as living design doc | Context loss between sessions was #1 frustration |
| 2026-03-06 | 7 | Practice Intelligence engine (Continue/Explore/Challenge) | Smart suggestions based on session history |
| 2026-03-06 | 8 | Merge-based import (not full overwrite) | Preserves existing data, prevents accidental loss |
| 2026-03-06 | 8 | 3-screen onboarding (The Witness) | "Studio Ghibli" feel — quiet, magical, unhurried |
| 2026-03-06 | 8 | Season CSS variables cascade app-wide (Thermal Drift) | The river is the weather of the app, not a chart on one page |
| 2026-03-06 | 8 | Competition tiers: Full / Quick / Flash | Not every feature needs 15 proposals (Competition H audit) |
| 2026-03-06 | 8 | Bridge Notes for session continuity | Session endings matter as much as starts |
| 2026-03-07 | 10 | Sapphire Night as third theme (not replacement) | Max: keep dark mode as-is, new warm option |
| 2026-03-07 | 10 | Gold = user data, Blue = system chrome | "Earned Sapphire" principle: achievement glows, UI stays humble |
| 2026-03-07 | 10 | pitchy for pitch detection (not ml5 or custom) | 5KB, MIT, zero deps, McLeod method, confidence scores |
| 2026-03-07 | 10 | Tuner at top of Dock (before CurrentCard) | First thing you see, first thing you need when picking up guitar |
| 2026-03-07 | 10 | Guide Me default for alternate tunings | New players don't know target notes for DADGAD/Open G |
| 2026-03-07 | 10 | Milne quote above tab bar (always visible) | Max: "always visible, subtle, elegant." The app's tagline. |
| 2026-03-07 | 11 | Audio recording: YES but subtle | Competition J Q1. Oprah's case won Max over, but Jobs' concern about sacred space is valid. Recording must feel like a private mirror, not a performance camera. Alternatives: Jobs: hard no (destroys sacred space). Oprah: mirror that tells truth kindly. Max: both right, do it subtly. |
| 2026-03-07 | 11 | Ceremony typeface: YES, try it | Competition J Q2/Topic 4. Ive proposed a single high-contrast serif for threshold moments (Reading, milestones, onboarding). Kanye elevated it. Max willing to try. Alternatives: Musk: "gilding a bicycle." Oprah: "let it breathe." Jobs: neutral. |
| 2026-03-07 | 11 | Keep metronome, kill ear training + audio recording for now | Competition J. Max agrees The River is a presence app BUT also a practice companion. Key practice resources (metronome, chord diagrams) stay. Ear training and audio recording cut. Alternatives: Jobs: kill metronome too. Max: no, it's a practice companion, not just presence. |
| 2026-03-07 | 11 | Deploy as demo: Vercel soft launch | Competition J Topic 5. Max agrees with Musk — go live. But in demo capacity, not promoted. Soft launch with URL. Alternatives: Musk: hard launch now. Linus: not without tests. Kanye: design the moment. Max: demo capacity. |
| 2026-03-07 | 11 | River identity > guitar identity | Competition J Q10. Max agrees with Kanye — The River is the identity, not guitar. Should work for music practice or creative practice holistically. Guitar-first but architecture opens. Alternatives: Jobs: guitar IS the identity. Kanye: River is the iPhone moment. Max: Kanye is right. |
| 2026-03-07 | 11 | Dock = practice launchpad (not reference library) | Competition J Q6. Dock identity is practice launchpad — context-aware launch into sessions, not a reference library you browse. |
| 2026-03-07 | 11 | FAB morphs contextually + cool morph animation | Competition J Q7. FAB shows timer normally, morphs to contextual actions (metronome, tuner) during practice. Both states. Morph animation must be distinctive. |
| 2026-03-07 | 11 | Tag analytics = living river scene (fish, boats, objects) | Competition J Q8. Max rejected all options. Instead: actual objects in the river (fish, boats, etc.) representing practice tag distribution. No legend, no charts. Just a beautiful scene that grows richer as you practice more things. |
| 2026-03-07 | 11 | Onboarding: add 4th explanatory screen | Competition J Q9. The Witness onboarding gets a 4th screen explaining what The River actually does (not just the metaphor). |
| 2026-03-07 | 11 | Auto backup via File System Access API | Competition J Q10. Automatic periodic backup to user's file system. No manual export needed. |
| 2026-03-07 | 11 | Haptics: yes but restrained | Competition J Q11. Use navigator.vibrate() at key interaction moments. Don't overdo it. |
| 2026-03-07 | 11 | 50h+: ALL FOUR evolution paths | Competition J Q12. After 50 hours: new ceremonies + user-generated margin notes + River writes back + more margin notes. All four paths, not just one. |
| 2026-03-07 | 11 | Swipe nav + pull-down quick log (both) | Competition J Q13. Horizontal swipe between tabs AND pull-down bottom sheet for quick session logging. Both gestures. |
| 2026-03-07 | 11 | Celebrity Panel = new default competition format | Competition J Q14. Max: "This is the new standard for us." Celebrity panel with 6 personas + multi-axis scoring is now default for Tier 1. Constraint-based still valid for implementation comps. |
| 2026-03-07 | 11 | Metronome: keep embedded, add BPM saving | Competition J Q15. Metronome stays embedded in SoundscapePanel. Add BPM progression tracking per session. |

| 2026-03-07 | 11 | Dock references: tabs + search + accordion hybrid | Competition J Q16. Scrollable pill tabs for taxonomy, search bar for power users, accordion collapse within each tab section. Combines Ive's clean taxonomy, Jobs' search-first, Oprah's one-voice focus. |
| 2026-03-07 | 11 | River objects: Option C trimmed (Jobs' filter) | Competition J Q17. Mix objects (fish/boats/lanterns/jumping fish/lily pads). Only render tags user actually practices. Untagged sessions = the water itself. No legend. |
| 2026-03-07 | 11 | Quick log: smart default (1 tap) | Competition J Q18. Pre-filled from time-of-day and history. One tap to confirm. Panel consensus (Kanye/Ive/Musk). |
| 2026-03-07 | 11 | Ceremony typeface: DM Serif Display | Competition J Q19. 20KB, modern, clean serif. Used only at threshold moments. Panel consensus 4-1-1 (Kanye/Jobs/Musk/Linus). |
| 2026-03-07 | 11 | River writes back: margin note style | Competition J Q20. River-generated reflections use existing margin note system. Same ceremony, same data flow. Panel consensus 5-1. Ive adds: subtle shimmer on Home as discovery hint. |
| 2026-03-07 | 11 | River sounds: yes, subtle ambient water | Competition J Q21. Water flowing that varies with river width/season. Panel consensus 4-2 (Kanye/Oprah/Ive/Musk). Must be very subtle — never compete with hearing guitar. |
| 2026-03-07 | 11 | Tags: hybrid (6 core + optional sub-tags) | Competition J Q22. Six pre-set core tags power river objects. Optional sub-tags for personal notes (e.g., Scales > Pentatonic). Panel consensus 4-2. |
| 2026-03-07 | 11 | Smart routing on launch | Competition J Q23. Practiced today → Home (reflect). Haven't yet → Dock (act). Panel consensus 3-2-1. |
| 2026-03-07 | 11 | Multi-instrument: defer, add schema field | Competition J Q24. Add `instrument: "guitar"` to session schema now (one line). Defer all UI. Panel consensus. |
| 2026-03-07 | 11 | Streaks: hide number, show warmth | Competition J Q25. No visible streak count. River warmth/width communicates consistency instead. Panel consensus 3-2-1. |
| 2026-03-07 | 11 | Share cards: milestone-only with river art | Competition J Q26. Share cards only at milestones. River snapshot as background. Scarcity = value. Panel consensus 4-2. |
| 2026-03-07 | 11 | Onboarding 4th screen: interactive demo + poetic text | Competition J Q27. MAX OVERRIDE: Combine C+D. Interactive demo (tap to see river grow) WITH poetic descriptions ("A timer that breathes with you. A river that remembers."). Best of both. |
| 2026-03-07 | 11 | Mood picker: simple + affects river + celebrates hard days | Competition J Q28. MAX OVERRIDE: Simple emoji picker (Energized/Focused/Struggling/Peaceful/Frustrated). Affects river visuals. KEY: app remembers and celebrates days where practice was hard — "you showed up even when it was tough" is as important as flow days. This is crucial data. |
| 2026-03-07 | 11 | Practice Intelligence: strengths-based, not weakness-based | Competition J Q29. MAX OVERRIDE: Smarter ranking behind same 3 cards, but STRENGTHS-based — recommend what user has done before, make it easy to continue. "The app knows me" feeling. NOT "you haven't done X in 3 weeks" framing. |
| 2026-03-07 | 11 | Vercel demo: video hero + Begin button | Competition J Q30. MAX OVERRIDE: 15-second looping video of river in action. Single "Begin" button. Cinematic first impression. |

---

*Updated: Session 11 (March 7, 2026)*
