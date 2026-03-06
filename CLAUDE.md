# The River — Project Instructions

## MANDATORY: Session Start
1. Read `VISION.md` in repo root FIRST — it has Max's design philosophy, feedback history, current state, and what's been built
2. Check `docs/` for competition briefs and process documentation
3. Check all worktrees for uncommitted work: `git worktree list` then check `git status` in each

## MANDATORY: Session End / Before Any Commit
1. Update `VISION.md` with any new decisions, feedback, or state changes
2. Commit `VISION.md` alongside your other changes
3. Never leave significant work uncommitted

## MANDATORY: After Every Meaningful Decision
1. Update `VISION.md` — add to feedback history, update current state section
2. If running a design competition, update the brief file in `docs/competitions/` with results

## Design Competition Protocol
- See `docs/AGENT-PROTOCOL.md` for the full protocol
- Use constraint-based personas (NOT attitude-based)
- Include Wildcard Award (most creative) + Comedy Award (funniest)
- Culture: radical encouragement, bring personality, try scary ideas, send love between agents, celebrate milestones
- Agents should be warm, funny, creative — this is a safe space for bold ideas

## Max's Non-Negotiables
- No GitHub-style heatmap calendar
- No gamification guilt (rest is beautiful, not failure)
- Apple Health quality aesthetic ("Liquid Glass")
- Deep blue/indigo palette
- Commit early, commit often — NEVER accumulate uncommitted work

## Tech Stack
- React 19 + Tailwind CSS v4 + Vite 7
- PWA, no backend, localStorage only
- Node 20: `export PATH="/usr/local/opt/node@20/bin:$PATH"`
- Dev server: `.claude/launch.json` → `river-dev` on port 5173
