# Claude Code Skills & Plugins: Research Report for The River

**Date:** March 7, 2026
**Purpose:** Evaluate Claude Code's skill/plugin ecosystem for potential use with The River guitar practice app.

---

## 1. Skill-by-Skill Breakdown

### Notion Skills (find, search, create-page, create-task, database-query, tasks:setup/plan/build)

Notion integration connects Claude Code to Notion workspaces via MCP (Model Context Protocol) connectors. Once authenticated, Claude can:

- **find / search**: Query Notion pages and databases by title, content, or properties. Useful for looking up existing design decisions, session notes, or competition results.
- **create-page**: Create new Notion pages with rich content (headings, text, code blocks, callouts). Could auto-generate session bridge notes or competition briefs directly into a shared workspace.
- **create-task**: Add tasks to Notion databases with properties (status, assignee, priority, dates). Could populate a project backlog automatically.
- **database-query**: Run filtered/sorted queries against Notion databases. Could pull "all unresolved decisions" or "competitions awaiting synthesis."
- **tasks:setup / tasks:plan / tasks:build**: A higher-level workflow where Claude reads a Notion task board, plans implementation steps, then builds them sequentially. This is a structured project-management-to-code pipeline.

**Authentication:** Requires connecting via the MCP registry (OAuth flow through Notion). The connector appears in the MCP tool list once authorized.

### playground:playground — Interactive HTML Playgrounds

The playground skill generates self-contained HTML files with embedded CSS and JavaScript that open in a browser. Key characteristics:

- **Self-contained**: Single HTML file, no external dependencies required.
- **Interactive**: Can include animations, user interactions, data visualizations, and UI mockups.
- **Invoked via `/playground`**: Claude generates the HTML and opens it for preview.
- **Use cases**: Prototyping UI concepts, creating interactive demos, building data visualizations, testing animation ideas — all without touching the production codebase.

This is essentially a sandboxed creative canvas. Claude writes the entire thing from scratch each time.

### skill-creator:skill-creator — Custom Skill Creation

This meta-skill creates new project-specific skills. A skill is a markdown file (SKILL.md) stored in `.claude/skills/` that contains:

- **Frontmatter**: Name, description, trigger conditions (slash command or automatic).
- **Instructions**: A prompt template that tells Claude how to behave when the skill is invoked.
- **File references**: Which project files to read for context.

Custom skills can encode team-specific workflows, naming conventions, code patterns, or multi-step protocols. They persist across sessions and are version-controllable.

### anthropic-skills:schedule — Scheduled Tasks

Scheduled tasks run Claude Code sessions on a cron schedule. Capabilities visible from the tool definitions:

- **Cron-based scheduling**: Standard 5-field cron expressions, evaluated in local timezone.
- **Task storage**: Each task gets a SKILL.md file in `~/.claude/scheduled-tasks/{taskId}/`.
- **Task management**: Create, update (prompt, schedule, enabled/disabled), and list tasks.
- **Execution**: Each scheduled run creates a new Claude session that executes the task prompt.
- **Ad-hoc tasks**: Tasks without a cron expression can be triggered manually.

Example: A daily task at 9am that reads git status, checks for uncommitted work, and posts a summary.

### anthropic-skills:pdf — PDF Generation

Generates PDF documents from within Claude Code. Claude writes the content, applies formatting, and produces a downloadable PDF. Useful for:

- Creating polished reports, pitch decks, or documentation.
- Generating user guides or onboarding materials.
- Producing competition results or design review summaries.

### anthropic-skills:pptx — PowerPoint Generation

Generates .pptx presentation files. Claude creates slide content with layouts, text, and basic formatting. Useful for:

- Pitch presentations for app concepts.
- Session review decks summarizing design decisions.
- Visual competition result presentations.

### anthropic-skills:docx — Word Document Generation

Generates .docx files with formatted text, headings, tables, and lists. Useful for:

- Formal project documentation.
- Detailed technical specifications.
- Printable session notes or design philosophy documents.

---

## 2. How Notion Could Serve as The River's Project Dashboard

The River currently stores all project management in markdown files: VISION.md, HANDOFF.md, DECISIONS.md, bridge notes, competition briefs. This is effective but lacks queryability and visual organization.

A Notion workspace could provide:

- **Decisions Database**: Each row is a decision from DECISIONS.md, with properties for session number, category (UX, visual, architecture), status (implemented, deferred, rejected), and linked discussion. Claude could `database-query` to find all deferred decisions when starting a new session.
- **Competition Tracker**: A database of all design competitions with status, tier, winner, and links to the synthesis. When running a Tier 2 competition, Claude could `create-page` for each proposal and update results automatically.
- **Session Timeline**: A visual timeline of bridge notes, making it easy to see project trajectory at a glance.
- **Task Board**: A kanban of current priorities that Claude reads at session start via `tasks:setup` and updates via `create-task` as new work emerges.

**Trade-off**: Notion adds an external dependency to what is currently a beautifully self-contained workflow. The markdown files work well because Claude reads them naturally. Notion would add value primarily for Max's human visibility into the project -- a dashboard he can check between sessions without reading markdown.

---

## 3. How Playground Could Prototype UI Ideas

The playground skill is perfectly suited to The River's design competition workflow:

- **Competition Round Visualization**: Instead of describing proposals in text, each persona could generate a playground prototype. "Here's what the Hydrologist's chord diagram actually looks like."
- **Animation Prototyping**: Test river flow animations, liquid glass shimmer effects, or micro-interactions in isolation before committing to the real codebase.
- **Layout Experiments**: Try different tab structures, card layouts, or navigation patterns as throwaway HTML files.
- **User Testing Artifacts**: Generate interactive mockups Max can click through to give feedback before any code enters the repo.

This directly addresses a pattern in The River's history: competitions generate text-based proposals that can be hard to evaluate visually. Playground turns proposals into clickable prototypes.

---

## 4. How Custom Skills Could Encode The River's Protocols

The River has extensive documented protocols (CLAUDE.md, AGENT-PROTOCOL.md, competition tiers, bridge note format). Custom skills could formalize these:

- **`/competition`** — A skill that reads the competition tier, generates the correct number of persona proposals, runs the scoring bracket, and outputs results in the standard format. No more remembering the protocol manually.
- **`/bridge-note`** — A skill that generates a session bridge note in the exact required format (3 bullets done, key quotes, what's next, unfinished, mood check) by reading git log and recent changes.
- **`/standup`** — A skill that formats the DONE/NEXT/BLOCKER standup message automatically after each task.
- **`/session-start`** — A skill that reads VISION.md, HANDOFF.md, latest bridge note, DECISIONS.md, and checks all worktrees for uncommitted work -- executing the entire mandatory session start protocol in one command.
- **`/session-end`** — A skill that updates VISION.md, HANDOFF.md, writes the bridge note, updates DECISIONS.md, commits, and pushes -- executing the entire mandatory session end protocol.

These skills would reduce protocol drift across sessions and ensure no step is forgotten.

---

## 5. How Scheduled Tasks Could Automate Project Work

Scheduled tasks could handle recurring maintenance:

- **Daily Git Health Check (every morning)**: Verify all worktrees are clean, no uncommitted work lingers, remote is up to date. Post a summary. This directly addresses Max's "context loss is the #1 frustration."
- **Weekly Project Summary**: Every Sunday evening, read VISION.md, recent commits, and DECISIONS.md to generate a "State of the River" summary — what changed this week, what's pending, what's next.
- **Pre-Session Prep**: 30 minutes before Max's usual session time, run the session-start protocol and have context ready.
- **Stale Branch Cleanup**: Weekly check for branches or worktrees that haven't been touched in 7+ days.

---

## 6. How Document Generation Could Create Pitch Materials

- **PDF**: Generate a polished "River Design Philosophy" document from VISION.md content — something Max could share with collaborators or use as a portfolio piece.
- **PPTX**: Create a pitch deck for The River: the river metaphor, liquid glass aesthetic, screenshots, design principles. Useful if Max ever wants to present the project.
- **DOCX**: Generate a detailed technical specification from HANDOFF.md for onboarding a human collaborator.

---

## 7. Five Creative Ideas for The River

1. **Live Competition Playgrounds**: During Tier 1 competitions, each persona generates a `/playground` prototype of their proposal. Max evaluates by clicking through three interactive demos instead of reading text. The winning design gets ported into the real codebase. This transforms competitions from literary exercises into visual ones.

2. **Notion "River Dashboard"**: A Notion workspace with four linked databases — Sessions, Decisions, Competitions, and Priorities. Claude updates it automatically at session end. Max can open Notion on his phone between sessions and see exactly where the project stands, without needing to read markdown files or start a Claude session.

3. **`/session-start` and `/session-end` Custom Skills**: Encode the entire mandatory protocol from CLAUDE.md into two skills. `/session-start` reads all five required documents, checks worktrees, and presents a briefing. `/session-end` updates all documents, writes the bridge note, commits, and pushes. Zero protocol drift, zero forgotten steps.

4. **Weekly "State of the River" PDF**: A scheduled task runs every Sunday and generates a PDF report: commits this week, decisions made, competitions run, current priorities, and a "river health" summary. Accumulates into a beautiful project history over time — a journal of the build.

5. **Design System Playground**: Use `/playground` to maintain a living design system for The River — a single interactive HTML page showing all the liquid glass components, color palette, typography, animation timings, and spacing rules. Update it as the design evolves. Serves as both documentation and a visual regression test.

---

## 8. Impact Ranking for a Creative Solo Developer

**Highest Impact:**

1. **Custom Skills (`/session-start`, `/session-end`, `/competition`)** — The River's protocols are extensive and manually error-prone across sessions. Encoding them as skills would save time every single session and eliminate the most common failure mode: forgetting a protocol step. This is the single highest-leverage investment.

2. **Playground for Competition Prototypes** — This transforms the design competition workflow from abstract to tangible. For a visual product like The River, being able to see and click proposals instead of reading about them would dramatically improve design decision quality.

3. **Scheduled Daily Git Health Check** — Directly addresses Max's stated #1 frustration (context loss from uncommitted work). Low effort to set up, runs silently, catches problems before they become crises.

**Medium Impact:**

4. **Notion Dashboard** — Valuable for between-session visibility, but adds an external dependency. The markdown-file system works well within Claude sessions. Notion's value is primarily for Max's async awareness.

5. **PDF/PPTX Generation** — Useful for specific moments (portfolio pieces, pitch decks) but not a daily workflow tool. Worth knowing about for when the moment arises.

**Lower Impact (but fun):**

6. **Scheduled Weekly Summary** — Nice to have but not essential if session bridge notes are maintained well.

---

## Research Methodology Note

This report was compiled from: Claude Code's tool definitions visible in the current session (scheduled tasks API, MCP registry, skill invocation system, preview tools), the project's own documentation (VISION.md, HANDOFF.md, CLAUDE.md), and training knowledge about Claude Code's skill architecture. WebSearch and WebFetch were unavailable during this session; a follow-up with live web access could surface additional examples, community patterns, and any recent skill ecosystem updates since early 2025.
