# Execution Plan — Step by Step

> The exact sequence of agent launches and orchestrator actions.

---

## Phase 1: Competition Proposals (Parallel Generation)

### Batch 1A: WS1 River Viz — 3 Sonnet Agents in Parallel
Each agent receives: the competition brief + the current pitch.html structure + their persona constraint.
Each agent produces: 5 proposals written to a temp output.
Orchestrator collects all 15 proposals → writes to `docs/competitions/river-viz.md`.

### Batch 1B: WS3 App Overhaul — 3 Sonnet Agents in Parallel
Each agent receives: the competition brief + relevant source files (audio.js, TimerFAB.jsx, index.css, SoundscapePanel.jsx) + their persona constraint.
Each agent produces: 5 proposals.
Orchestrator collects → writes to `docs/competitions/app-overhaul.md`.

### Batch 1C: WS4 Guitar Refs — 3 Sonnet Agents in Parallel
Each agent receives: the competition brief + app structure + their persona constraint.
Each agent produces: 5 proposals.
Orchestrator collects → writes to `docs/competitions/guitar-refs.md`.

**Total agents in Phase 1:** 9 (launched in 3 batches of 3, or all 9 at once if context allows)

---

## Phase 1.5: Meeting — Post-Generation Review

Orchestrator reads all 45 proposals across 3 competitions.
Looks for:
- Any proposal in one competition that should inform another
- Common themes or blind spots
- Quality distribution — are the constraints producing diverse output?

Writes meeting notes to `docs/meetings/01-post-generation.md`.

---

## Phase 2: Competition Brackets (Evaluation)

### For each competition:
Run 5 rounds of evaluation. This is judgment work — done by orchestrator or Opus agents.

**Option A: Sequential** — Orchestrator evaluates all 3 competitions one by one.
**Option B: Parallel** — Launch 3 Opus agents, one per competition, each running a full bracket.

Option B is faster but uses more tokens. Given the user wants maximum overnight progress, **go with Option B** — 3 parallel Opus evaluation agents.

Each evaluator receives: all 15 proposals for their competition + scoring criteria + feedback format.
Each evaluator produces: completed bracket with winner + implementation spec.

---

## Phase 2.5: Meeting — Post-Competition Review

The most important meeting. Orchestrator reads all 3 winners:
- Do the winners complement each other?
- Are there integration concerns?
- Should any eliminated ideas be salvaged?
- Does the guitar refs winner's UI approach conflict with the timer overhaul?
- Does the river viz winner's technique suggest anything for the app's river visualization?

Writes meeting notes to `docs/meetings/02-post-competition.md`.
Updates `docs/OVERNIGHT-PLAN.md` status table.

---

## Phase 3: Implementation (Mixed Parallel + Sequential)

### WS1: River Visualization (Orchestrator)
Orchestrator implements the river in `pitch.html` directly.
Reason: This is a single file requiring visual judgment and iterative refinement.
After implementation: verify via preview tools, take screenshot.

### WS3: App Overhaul (Split into sub-agents if cleanly separable)
Depends on the winning proposal. Possibilities:
- If sound changes are independent: Sonnet agent for audio.js
- If timer changes are independent: Sonnet agent for TimerFAB.jsx
- If visual changes touch many files: Orchestrator handles (needs holistic view)

### WS4: Guitar Refs (Sub-agent for data, orchestrator for components)
- **Data agent (Sonnet):** Generate the scale/chord/fretboard data structures as a JS utility file
- **Orchestrator:** Build the React components that render the data as SVG diagrams

### WS2: Demo Content (Orchestrator, after WS1)
Sequential after WS1. Orchestrator adds animated slides to `pitch.html`.

---

## Phase 3.5: Meeting — Post-Implementation Review

Read all implemented code across workstreams.
Check for:
- Style consistency (do new components match existing Liquid Glass patterns?)
- Integration issues (do new pages work with existing navigation?)
- Performance concerns (is the pitch deck still smooth with the river?)
- Missing pieces

Writes meeting notes to `docs/meetings/03-post-implementation.md`.

---

## Phase 4: Integration & Polish

- Wire guitar reference components into the app navigation
- Ensure timer + sound + visual changes all work together
- Final build verification (`npm run build`)
- Screenshot key screens for Max to review in the morning

---

## Phase 4.5: Final Meeting — Retrospective

What worked in the agent communication protocol?
What should change next time?
Update `docs/AGENT-PROTOCOL.md` with lessons learned.
Write final meeting notes to `docs/meetings/04-retrospective.md`.

---

## Estimated Agent Calls

| Phase | Agents | Model | Est. Tokens | Est. Duration |
|-------|--------|-------|-------------|---------------|
| 1 (Generation) | 9 | Sonnet | ~180k total | ~15 min |
| 1.5 (Meeting) | 0 | Main (Opus) | ~10k | ~3 min |
| 2 (Evaluation) | 3 | Opus | ~120k total | ~20 min |
| 2.5 (Meeting) | 0 | Main (Opus) | ~15k | ~5 min |
| 3 (Implementation) | 2-4 | Mixed | ~200k total | ~30 min |
| 3.5 (Meeting) | 0 | Main (Opus) | ~10k | ~3 min |
| 4 (Integration) | 0-2 | Main + Sonnet | ~50k | ~10 min |
| 4.5 (Retrospective) | 0 | Main (Opus) | ~5k | ~2 min |
| **Total** | **~17** | — | **~590k** | **~90 min** |
