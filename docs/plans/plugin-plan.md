# The River — Team Culture Plugin Plan

> Packaging The River's team-based consultant and competition system as a shareable Claude Code extension.
> Nominated experts: Simon Willison, Maggie Appleton, Patrick Collison
> Status: PLAN ONLY — not yet implementing

## What We're Packaging

### Layer 1: Team Roster & Personas
- Configurable expert roster mapped to domains (CSS, React, Perf, A11y, UX, Architecture)
- Selection logic: domain matching based on file type being edited
- Honest labels (domain-based) vs theatrical names (persona-based) — configurable

### Layer 2: Quality Systems (4 total)
1. Build gate with configurable checks and thresholds
2. Margin notes — domain-expert feedback after file writes
3. Overnight/autonomous log format
4. Panic recovery procedures

### Layer 3: Culture
- Competition protocol (3 tiers, formats, personas, awards)
- Communication protocol (standups, celebrations, screenshots)
- Design philosophy template (non-negotiables, aesthetic direction)
- "The wobble" — constraints that make work feel hand-crafted

## Recommended Implementation: Claude Code Skills

### Skill Files to Create
- `team-consultant.md` — margin note generation after file writes
- `competition-runner.md` — design competition at appropriate tier
- `overnight-builder.md` — AUTOPILOT protocol as a skill
- `session-protocol.md` — standup, session start/end, bridge notes

### Why Skills First
- Simplest to share (folder of markdown files)
- No code to install
- Works with any Claude Code project
- Can graduate to Hooks or MCP Server later

### Future Options
- **Hook (PostToolUse):** Auto-fires margin notes after Edit/Write
- **MCP Server:** Full integration with linting, builds, screenshots
- **ESLint plugin:** Domain-specific quality rules

## Companion Extensions
1. `eslint-plugin-river-quality` — Pattern-specific lint rules
2. Visual diff tool for overnight screenshots
3. "Morning report" CLI command
4. Competition template generator

## Task Classification
- **Autonomous:** Research APIs, draft skill templates, prototype hook
- **Needs Max:** Review packaged culture, test with others, iterate DX
