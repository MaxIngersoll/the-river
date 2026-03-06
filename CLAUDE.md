# The River — Project Instructions

## MANDATORY: Session Start
1. Read `VISION.md` in repo root FIRST — it has Max's design philosophy, feedback history, current state, and what's been built
2. Read the latest Bridge Note in `docs/sessions/` for immediate context from the previous session
3. Check `docs/DECISIONS.md` for the decision trail
4. Check all worktrees for uncommitted work: `git worktree list` then check `git status` in each

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
2. Write a Bridge Note to `docs/sessions/session-N-bridge.md`:
   - What we did (3 bullets)
   - What Max said (key quotes)
   - What's next (prioritized)
   - Unfinished work
   - Mood / vibe check
3. Update `docs/DECISIONS.md` with any new decisions
4. Commit everything. Never leave work uncommitted.

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
- Use constraint-based personas (NOT attitude-based)
- Include Wildcard Award (most creative) + Comedy Award (funniest)
- Proposals: 150 words max. If you can't pitch it in 150 words, you don't understand it yet.
- Build architecture first, compete on design details only
- Culture: radical encouragement, bring personality, try scary ideas, send love, celebrate milestones

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
- `docs/DECISIONS.md` — Why things are the way they are
- `docs/sessions/` — Bridge Notes from previous sessions
- `docs/AGENT-PROTOCOL.md` — Team culture and competition protocol
- `docs/competitions/METHODOLOGY.md` — Lessons from past competitions

## Tech Stack
- React 19 + Tailwind CSS v4 + Vite 7
- PWA, no backend, localStorage only
- Node 20: `export PATH="/usr/local/opt/node@20/bin:$PATH"`
- Dev server: `.claude/launch.json` → `river-dev` on port 5173
