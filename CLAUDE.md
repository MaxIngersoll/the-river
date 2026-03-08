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

## MANDATORY: Quality Systems (4 total — Rams: no more, no less)

### System 1: Build Gate (every commit)
- `npm run build` passes (exit 0)
- JS bundle < 420KB raw / 125KB gzip
- Snapshot: hero stat, tab bar (4 tabs), FAB visible
- No React errors in console
- Screenshot saved to `docs/overnight-screenshots/`
- On failure: `git stash`, save hash, move to next task

### System 2: Margin Notes (LIVE sessions only)
- Triggered after each file write (work-driven, not clock-driven — Jobs)
- Format: domain label + observation, max 25 words
- Example: `🎨 CSS: animation conflicts with transform on drag — use separate property`
- Example: `⚡ Perf: this useEffect runs every render — add dependency array`
- Use domain labels (🎨 CSS, ⚡ Perf, ⚛️ React, ♿ A11y), NOT persona names (Rams+Miyazaki: honest)
- Apply feedback immediately before continuing

### System 3: Overnight Log
- TLDR (3 bullets: what shipped, what broke, what's next)
- `git log --oneline` of all commits
- Screenshots in `docs/overnight-screenshots/`
- Morning TODO: actionable items for next session

### System 4: Panic Recovery
- See `AUTOPILOT.json` panic_recovery for all recovery procedures
- This is error handling, not quality — but it keeps the system running

### Culture Note
The team culture IS the craft. The constraints that shape implementation (competitions, check-ins, debate rounds) are what give the code its wobble — the hand-made quality. In autonomous mode, the culture lives in the task descriptions, acceptance criteria, and architectural patterns. The overnight builder inherits the team's constraints even when no one is watching.

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
