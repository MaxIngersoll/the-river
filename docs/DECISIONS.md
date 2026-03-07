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
| 2026-03-07 | 11 | River speed tied to practice recency | Competition J Q31. Gentle decay — daily practice = faster flow, gaps slow it. Panel 5-1. |
| 2026-03-07 | 11 | No numeric goals | Competition J Q32. Goals are cages. River reflects effort naturally. No quotas. Panel 3-2-1. |
| 2026-03-07 | 11 | Session notes: one optional line | Competition J Q33. A whisper, not a journal. One blank text field per session. Panel 5-1. |
| 2026-03-07 | 11 | Seasonal ambient sounds | Competition J Q34. Sound evolves with season — birds/crickets/wind/silence layered over Petrichor. Panel 4-2. |
| 2026-03-07 | 11 | Offline-first forever | Competition J Q35. Privacy IS the product. No servers, no accounts. File System API backup as safety net. Panel 4-2. |
| 2026-03-07 | 11 | Dark mode as true default | Competition J Q36. Dark is the soul of the app. Kanye breaks 3-3 tie. |
| 2026-03-07 | 11 | No push notifications | Competition J Q37. The river waits, it doesn't text you. Signal Fire for re-engagement only. Panel 4-1-1. |
| 2026-03-07 | 11 | Keyboard shortcuts: minimal set | Competition J Q38. Space=timer, arrows=tabs. Desktop power users rewarded. Panel 4-2. |
| 2026-03-07 | 11 | No data viz beyond the river | Competition J Q39. The river IS the visualization. Charts betray the metaphor. Stats page has numbers. Panel 4-2. |
| 2026-03-07 | 11 | Undo on session delete: 10s toast | Competition J Q40. No modal, no "are you sure." Just undo toast. Unanimous 6-0. |
| 2026-03-07 | 11 | Loading: minimal breathing river | Competition J Q41. Max: "I agree with Ive and Jobs. I want the breathing room." Subtle river animation on init. Panel 4-2. |
| 2026-03-07 | 11 | Empty state: poetic invitation | Competition J Q42. "A dry riverbed waiting for rain." Panel 4-2. |
| 2026-03-07 | 11 | Error messaging: warm and human | Competition J Q43. "Something got tangled in the current" not "Error 500." Panel 5-1. |
| 2026-03-07 | 11 | Animation timing: context-dependent | Competition J Q44. Interactions=snappy (150ms). Ceremonies=slow (800ms+). Two speeds. Panel 5-1. |
| 2026-03-07 | 11 | Font base: 16px minimum | Competition J Q45. Prevents iOS zoom. Readability IS design. Panel 5-1. |
| 2026-03-07 | 11 | FAB position: bottom-right | Competition J Q46. Thumb zone, right-handed majority. Panel 4-2. |
| 2026-03-07 | 11 | Tab bar: icons + labels always | Competition J Q47. Icons without labels fail accessibility. Panel 5-1. |
| 2026-03-07 | 11 | Scroll: elastic bounce | Competition J Q48. Expected on iOS. CSS overscroll-behavior. Panel 5-1. |
| 2026-03-07 | 11 | Page transitions: crossfade 200ms | Competition J Q49. Opacity-only crossfade between tabs. Panel 4-2. |
| 2026-03-07 | 11 | Touch targets: 44px minimum | Competition J Q50. Apple HIG standard. Unanimous 6-0. |
| 2026-03-07 | 11 | River memory: golden milestone markers | Competition J Q51. Subtle golden shimmer where milestones were hit. Panel 5-1. |
| 2026-03-07 | 11 | New river = thin trickle with mist | Competition J Q52. Never show emptiness, show potential. Panel 4-2. |
| 2026-03-07 | 11 | River responds to time of day | Competition J Q53. Dawn colors morning, deep indigo night. Panel 4-2. |
| 2026-03-07 | 11 | River sound syncs with visual speed | Competition J Q54. Tight audiovisual coupling. Panel 5-1. |
| 2026-03-07 | 11 | Per-tag BPM memory in metronome | Competition J Q55. Scales at 120, songs at 80 — it remembers. Panel 5-1. |
| 2026-03-07 | 11 | Longest session PB: celebrate, don't display | Competition J Q56. Acknowledge when broken, not a constant metric. Panel 4-2. |
| 2026-03-07 | 11 | Practice suggestions: stable with daily rotation | Competition J Q57. Stability builds trust, gentle rotation keeps it alive. Panel 4-2. |
| 2026-03-07 | 11 | Timer micro-messages: ultra-subtle, stealthy | Competition J Q58. MAX OVERRIDE: Agrees with Jobs/Linus. Milestones at 15m/30m/45m/1h but ONLY visible if you look. Never pulls attention from practice. Stealthy, not interruptive. |
| 2026-03-07 | 11 | Session log: infinite scroll + month headers | Competition J Q59. Time-grouped, collapsible. Panel 5-1. |
| 2026-03-07 | 11 | Export: JSON primary + CSV secondary | Competition J Q60. JSON is data, CSV is sharing. Panel 4-2. |
| 2026-03-07 | 11 | Total hours: visible on Home, not hero | Competition J Q61. Small elegant number, not the centerpiece. Panel 4-2. |
| 2026-03-07 | 11 | Backup health: subtle green dot in Settings | Competition J Q62. Never anxious, just informative. Panel 5-1. |
| 2026-03-07 | 11 | Seasons cascade through ENTIRE UI | Competition J Q63. Max: "I love this idea of the app having weather and variation. Great one, Kanye." Card backgrounds, text colors, icon tints all shift with season. THE WEATHER OF THE APP. Panel 5-1. |
| 2026-03-07 | 11 | Celebrations: river-themed (not confetti) | Competition J Q64. Splashes, golden fish, rising water. "Confetti is for birthday apps." Panel 4-2. |
| 2026-03-07 | 11 | Milne quote: fixed forever | Competition J Q65. "Rivers know this: there is no hurry." That IS the quote. Panel 4-2. Kanye: "Change it and I walk." |
| 2026-03-07 | 11 | Theme picker: visual preview cards | Competition J Q66. Three thumbnail cards in Settings. Panel 5-1. |
| 2026-03-07 | 11 | Session save: river absorbs with ripple | Competition J Q67. "The river drinks your practice." Ripple from center outward. Unanimous 6-0. |
| 2026-03-07 | 11 | Active tab: subtle season-colored glow | Competition J Q68. Soft glow, not underline. Panel 4-2. |
| 2026-03-07 | 11 | Long-press FAB: radial quick-action menu | Competition J Q69. Timer, Quick Log, Tuner, Metronome. Panel 4-2. |
| 2026-03-07 | 11 | Pull-to-refresh: river breathes | Competition J Q70. Pull down on Home → fresh breathe animation. Panel 5-1. |
| 2026-03-07 | 11 | River moods reflect practice patterns | Competition J Q71. Consistent=calm, sporadic=turbulent, gap=still. Panel 5-1. |
| 2026-03-07 | 11 | Time-of-day greeting | Competition J Q72. "Good morning" / "Late night session?" Warm, subtle. Panel 4-2. |
| 2026-03-07 | 11 | User's own notes resurface after 50h | Competition J Q73. Your past words become margin notes. "The river becomes a mirror." Panel 4-2. |
| 2026-03-07 | 11 | River Birthday celebration | Competition J Q74. Special celebration on 1-year anniversary of first session. Unanimous 6-0. Kanye cried. |
| 2026-03-07 | 11 | Chord fingering numbers: toggleable | Competition J Q75. Default off for clean look, toggle on for learners. Panel 5-1. |
| 2026-03-07 | 11 | No per-chord history, YES to favorites | Competition J Q76. MAX OVERRIDE: No practice history per chord/progression (Dock is launchpad, not spreadsheet). BUT add favoriting system — favorite scales, progressions, chords for quick access. |
| 2026-03-07 | 11 | User-creatable progressions | Competition J Q77. Tap chords to build custom sequences. Panel 5-1. |
| 2026-03-07 | 11 | Chord of the Day | Competition J Q78. Random interesting chord daily. Subtle, optional. Panel 4-2. |
| 2026-03-07 | 11 | Share cards include river visualization | Competition J Q79. River snapshot as background. "Your river IS your share card." Panel 5-1. |
| 2026-03-07 | 11 | River Postcards at milestones | Competition J Q80. Beautiful seasonal snapshot, milestones only. Scarcity = value. Panel 4-2. |
| 2026-03-07 | 11 | Year in Review feature (needs naming) | Competition J Q81. Annual practice summary à la Wrapped — but needs its own name, not copying Spotify. Panel 5-1. Naming competition pending. |
| 2026-03-07 | 11 | Year in Review: image first, video later | Competition J Q82. Canvas image v1, animated video v2. Panel 3-2-1. |
| 2026-03-07 | 11 | Reduced motion support | Competition J Q83. prefers-reduced-motion media query. Unanimous 6-0. Not optional — it's respect. |
| 2026-03-07 | 11 | Colorblind-friendly mode | Competition J Q84. Pattern-based differentiation alongside colors. Panel 5-1. |
| 2026-03-07 | 11 | Screen reader support: ARIA + focus | Competition J Q85. Proper ARIA labels, focus management on all interactive elements. Panel 5-1. |
| 2026-03-07 | 11 | Service worker for true offline | Competition J Q86. Workbox-based, cached assets, airplane mode. Panel 5-1. |
| 2026-03-07 | 11 | IndexedDB: not yet | Competition J Q87. localStorage fine until 5MB. Don't fix what works. Panel tie, Kanye: not yet. |
| 2026-03-07 | 11 | Performance budget: detect and adapt | Competition J Q88. Auto-degrade on slow devices. Panel 4-2. |
| 2026-03-07 | 11 | Hidden easter eggs: yes, well-placed | Competition J Q89. "Easter eggs are love letters to your users." Panel 5-1. |
| 2026-03-07 | 11 | Konami Code: unlocks surprise | Competition J Q90. Fun secret. Panel 4-2. Linus: "...fine." |
| 2026-03-07 | 11 | Holiday-themed celebrations | Competition J Q91. Subtle seasonal shifts on holidays. Tasteful, not kitschy. Panel 4-2. |
| 2026-03-07 | 11 | Desktop dashboard: eventually | Competition J Q92. PWA already works. "IMAX for your river." Panel 4-2. |
| 2026-03-07 | 11 | Community features: not yet | Competition J Q93. Personal first. "The river is YOURS first." Panel tie, Kanye: not yet. |
| 2026-03-07 | 11 | Celebrate "firsts" | Competition J Q94. First session, first hour, first streak, etc. Sacred. Unanimous 6-0. |
| 2026-03-07 | 11 | River Legacy: beautiful history document | Competition J Q95. PDF/book at major milestones (1yr, 100h). Panel 5-1. |
| 2026-03-07 | 11 | 1,000 hours: unique transformation | Competition J Q96. Something that can't be triggered any other way. Panel 5-1. |
| 2026-03-07 | 11 | Quiet Mode: just the timer | Competition J Q97. Accessible from Settings. Pure practice, no distractions. Panel 4-2. |
| 2026-03-07 | 11 | Auto-save, not reminders | Competition J Q98. MAX OVERRIDE: Don't remind to save — auto-save at moments and on app close. Seamless data safety. |
| 2026-03-07 | 11 | The River's purpose (panel quote) | Competition J Q99. "It makes you WANT to practice, not HAVE to." Added to VISION.md. |
| 2026-03-07 | 11 | 3-sentence manifesto (About page) | Competition J Q100. Jobs: "Three sentences max." Ceremony typeface, river imagery. Panel 5-1. |
| 2026-03-07 | 11 | Year in Review named "The Reflection" | Naming competition: 60 names from 6 panelists. Winner: Oprah's "The Reflection." Max: "Totally agree with Oprah. Reflection is perfect." When you look into a river, you see yourself looking back. |

---

*Updated: Session 11 — THE CENTURY (March 7, 2026)*
