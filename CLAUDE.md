# The River — Project Instructions

## MANDATORY: Session Start
1. Read `VISION.md` in repo root FIRST — design philosophy, feedback history, current state, what's next
2. Read `HANDOFF.md` — complete technical reference (architecture, components, data flow, all features)
3. Read the latest Bridge Note in `docs/sessions/` for immediate context from the previous session
4. Check `docs/DECISIONS.md` for the decision trail
5. Check all worktrees for uncommitted work: `git worktree list` then check `git status` in each

## MANDATORY: Communication Protocol
After every task completion, post a standup to Max:
```
DONE: [what was completed]
NEXT: [what's coming]
BLOCKER: [any issues] or CLEAR
```
After every visual change: take a screenshot and show it.
After every commit: one-line celebration.

## MANDATORY: Session End
1. Update `VISION.md` with any new decisions, feedback, or state changes
2. Update `HANDOFF.md` if architecture, components, or features changed
3. Write a Bridge Note to `docs/sessions/session-N-bridge.md`:
   - What we did (3 bullets)
   - What Max said (key quotes)
   - What's next (prioritized)
   - Unfinished work
   - Mood / vibe check
4. Update `docs/DECISIONS.md` with any new decisions
5. Commit everything. Push to GitHub. Never leave work only on local machine.

## MANDATORY: After Every Meaningful Decision
1. Update `VISION.md` — add to feedback history, update current state section
2. Add a row to `docs/DECISIONS.md`
3. If running a design competition, update the brief file in `docs/competitions/` with results

## Competition Tiers (choose the right size)
- **Tier 1 (Full):** Major features, visual redesigns, architectural decisions. 3 personas, 5 proposals each, 5-round bracket.
- **Tier 2 (Quick):** Medium features, refinements. 3 personas, 1 proposal each, 2-round bracket (score + synthesize).
- **Tier 3 (Flash):** Small features, bug fixes. No competition. Just build it.

## Design Competition Protocol
- See `docs/AGENT-PROTOCOL.md` for the full protocol
- **Celebrity Panel** is the NEW DEFAULT for Tier 1 competitions (6 personas, multi-axis scoring, debates)
- Constraint-based personas still valid for Tier 1 implementation competitions
- Include Wildcard Award (most creative) + Comedy Award (funniest)
- Proposals: 150 words max. If you can't pitch it in 150 words, you don't understand it yet.
- Build architecture first, compete on design details only
- Culture: radical encouragement, bring personality, try scary ideas, send love, celebrate milestones

## MANDATORY: Consultant Check-Ins
During implementation work, bring in a relevant expert consultant every ~1 minute of active work.
- Choose a consultant whose expertise matches what you're currently building (e.g., animation expert for CSS transitions, React expert for component architecture, design expert for UI decisions)
- The consultant reviews what you just built and gives 1-2 actionable course corrections
- Apply their feedback immediately before continuing
- This keeps quality high and catches mistakes early — you are not alone, you have a team
- Consultants can be real experts (Carmack, Abramov, Verou, etc.) or domain-appropriate specialists
- Log each check-in briefly: who you consulted, what they said, what you changed

## Token Discipline
- Quick-reject weak proposals (don't write paragraph feedback for obvious rejects)
- Build skeleton before competing — competition fills in design details, not architecture
- No sub-agents for tasks under 30 seconds
- Score proposals in batches of 5, not all 15 at once

## Max's Non-Negotiables
- No GitHub-style heatmap calendar
- No gamification guilt (rest is beautiful, not failure)
- Apple Health quality aesthetic ("Liquid Glass")
- Deep blue/indigo palette
- Commit early, commit often — NEVER accumulate uncommitted work

## Key Documents
- `VISION.md` — Living design doc, project state, philosophy (READ FIRST)
- `HANDOFF.md` — Complete technical reference: architecture, every component, data flow, all features
- `docs/DECISIONS.md` — Why things are the way they are (18+ entries)
- `docs/sessions/` — Bridge Notes from previous sessions (start with latest)
- `docs/AGENT-PROTOCOL.md` — Team culture and competition protocol
- `docs/competitions/METHODOLOGY.md` — Lessons from past competitions
- `docs/OUTTAKES.md` — Comedy archive, running jokes, post-credits scenes (for joy)

## Tech Stack
- React 19 + Tailwind CSS v4 + Vite 7
- PWA, no backend, localStorage only
- Node 20: `export PATH="/usr/local/opt/node@20/bin:$PATH"`
- Dev server: `.claude/launch.json` → `river-dev` on port 5173
