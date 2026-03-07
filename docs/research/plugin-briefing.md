# Plugin Briefing: What's In The Arsenal

> Pre-competition research document for Competition J: "Big Dog's Gotta Eat"
> Compiled from 5 parallel research agents + web research, March 7, 2026

---

## 1. frontend-design (The Design Philosophy Injector)

**What it does:** Rewires how Claude approaches UI generation. Instead of safe defaults (Inter font, purple gradients, centered cards), it forces bold aesthetic decisions BEFORE writing code. Five pillars: design thinking before code, anti-generic aesthetics, typography as identity, spatial composition + motion, atmosphere over flatness.

**How it works:** A ~400-token behavioral directive that changes Claude's design decision-making. Not a template — a mindset. Explicitly bans Inter, Roboto, Arial, system fonts. Demands distinctive display fonts, asymmetric layouts, gradient meshes, noise textures, grain overlays.

**Key feature:** Menu of "extreme tones" as starting vocabulary: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric.

**For The River:** The Liquid Glass system is already distinctive, but the skill could sharpen celebration overlays, The Reading ceremony, onboarding screens, and push each Dock sub-component toward its own micro-aesthetic within the system. The skill explicitly demands "the one unforgettable thing" about every interface.

**Live demo potential:** Invoke on a specific component (e.g., CelebrationOverlay) and generate a redesigned version in real-time.

Sources: [GitHub - frontend-design SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md), [Anthropic Plugin Page](https://claude.com/plugins/frontend-design)

---

## 2. playground (The Prototype Generator)

**What it does:** Generates self-contained, single-file HTML playgrounds with interactive controls on one side, live preview on the other, and a copy button for prompt output. Six built-in templates: Design Playground, Data Explorer, Document Critique, Diff Review, Code Map, and more.

**How it works:** Outputs a complete HTML file with inline CSS and JS — no build system, no dependencies. Open in browser, adjust sliders/dropdowns, see live results.

**Key feature:** Perfect for competition proposals. Instead of reading 150-word text pitches, each persona generates a clickable HTML demo. Max evaluates by tapping through interactive prototypes.

**For The River:** Prototype the Dock redesign without touching production code. A/B test color variations. Create standalone pitch materials. Explore animation sequences. The River's existing `pitch.html` already proves this pattern works.

**Live demo potential:** Generate a Design Playground for The River's color system with live theme-switching controls.

Sources: [Anthropic Playground Plugin](https://claude.com/plugins/playground), [How Playground Saved My Sanity](https://www.nathanonn.com/claude-code-playground-skill-visual-design-workflow/)

---

## 3. feature-dev (The Guided Feature Builder)

**What it does:** Structures feature implementation into phases: (1) understand codebase by reading key files, (2) plan with the user, (3) build incrementally with checkpoints. Forces Claude to read existing code before writing anything.

**How it works:** Prevents the common failure mode of generating code that doesn't match existing patterns. For The River (35+ source files, 8,677 lines), this means any new feature is built to match the Liquid Glass card system, the existing ThemeContext, the SeasonProvider, etc.

**For The River:** The Dock is 1,170 lines. feature-dev would decompose it into proper sub-components that maintain existing patterns. Each extracted component gets its own analysis-plan-build cycle.

---

## 4. simplify (The Code Reviewer)

**What it does:** Examines recently changed files (via git diff), finds duplicated logic, unnecessary complexity, missed reuse opportunities, and general code quality issues — then automatically fixes them.

**How it works:** Post-implementation review. Run after every feature to catch drift, redundancy, and over-engineering.

**For The River:** 8,677 lines of code accumulated over 10 sessions by multiple agent contexts. There's almost certainly duplicated patterns, unused imports, and inconsistent approaches. A simplify pass would be like a professional code audit.

---

## 5. superpowers:test-driven-development (The Iron Law)

**What it does:** Enforces genuine red-green-refactor discipline. Tests are written FIRST, run to confirm failure, THEN implementation code is written only to make tests pass. Iron law: production code written before a failing test must be deleted and started over.

**How it works:** Not just "write tests" — it structures the entire workflow around tests. For a codebase with ZERO tests, this is transformative.

**For The River:** Currently has zero tests. Every change is a gamble. TDD would start by adding test infrastructure (Vitest, since we're on Vite), then protect critical paths: storage utilities, theme switching, timer logic, session CRUD. The fear of breaking things goes away when tests catch regressions.

---

## 6. superpowers:subagent-driven-development (The Synthetic Team)

**What it does:** Dispatches a fresh sub-agent for each task (preventing context pollution), then runs a two-stage review: spec-compliance reviewer + code-quality reviewer. Loop continues until both approve.

**How it works:** Essentially a synthetic development team for a solo developer. Each task gets implemented, reviewed for spec compliance, reviewed for code quality, and iterated until clean.

**For The River:** The ShedPage breakup, Competition C implementation, or any multi-file feature. Each sub-component gets its own implementer + reviewer cycle. Quality gates that a solo developer otherwise lacks.

---

## 7. superpowers:dispatching-parallel-agents (The Swarm)

**What it does:** Groups independent problems by domain, dispatches one focused agent per domain, integrates results. Only for genuinely independent tasks where agents won't edit the same files.

**For The River:** Mobile audit across all 33 source files. Accessibility review. Multi-component design passes. Bug triage after a major refactor.

---

## 8. hookify (The Rule Enforcer)

**What it does:** Creates markdown-based rule files with regex patterns that trigger on bash commands, file edits, completion attempts, or user prompts. Rules can `warn` (show message) or `block` (prevent action).

**Key capability:** Machine-enforces coding standards that are currently honor-system only.

**5 rules for The River:**
1. **Block gamification language** — regex on `streak|points|score|badge|XP|level up` in new code
2. **Enforce frequent commits** — `stop` event: "Have you committed and pushed?"
3. **Block heatmap calendar** — regex on `heatmap|heat-map|calendar.*grid`
4. **Warn on non-indigo colors** — flag hardcoded hex colors outside the palette
5. **Require push after commit** — `bash` event on `git commit`: "Now push to GitHub!"

---

## 9. vercel:deploy + vercel:setup (The Launchpad)

**What it does:** Auto-detects Vite, configures `vercel.json` with SPA rewrite rule, deploys to Vercel CDN with a live URL. Every PR gets a preview deploy.

**For The River:** Get the app live at a real URL in under 5 minutes. No server needed — static files on CDN. Service worker handles offline. PWA install works from the URL. Preview deploys for design competition variants.

**Privacy check:** No conflict. Vercel serves static files. No user data touches Vercel servers. Practice data stays in localStorage on the user's device.

**The gotcha:** Need `vercel.json` with `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}` for SPA routing.

---

## 10. figma:create-design-system-rules (The Formalizer)

**What it does:** Scans codebase to extract design tokens — CSS custom properties, Tailwind theme values, color palettes, typography, spacing — and generates a structured rules file.

**For The River:** Formalizes 10 sessions of implicit design work into explicit constraints. Prevents aesthetic drift across sessions. Codifies: 30+ color tokens across 3 themes, Liquid Glass card patterns, border radius rules (cards: 22px, inputs: 16px, pills: 999px), shadow system, animation classes, season awareness.

**Why this matters:** Every new Claude session that touches The River's UI currently has to re-learn the design system from reading index.css. A formal rules file makes it instant.

---

## 11. Custom Skills via skill-creator (The Protocol Encoder)

**What it does:** Creates project-specific SKILL.md files that encode unique workflows. Invocable via `/skill-name`.

**For The River:** Could encode:
- `/session-start` — mandatory protocol (read VISION.md, HANDOFF.md, latest Bridge Note, check worktrees)
- `/session-end` — mandatory protocol (update VISION.md, HANDOFF.md, write Bridge Note, update DECISIONS.md, commit + push)
- `/competition` — full design competition protocol with tiers, personas, rounds, awards
- `/standup` — DONE/NEXT/BLOCKER format after every task
- `/screenshot` — take screenshot and verify visual changes

**Why this matters:** CLAUDE.md has 80+ lines of mandatory protocols. Custom skills would make them one-command invocations that can never be forgotten.

---

## 12. playground for Competitions (The Visual Debate)

**New workflow:** During Tier 1 competitions, each persona generates a `/playground` prototype instead of a 150-word text pitch. Max evaluates by clicking through interactive demos instead of reading descriptions. The winning design gets ported into the real codebase.

**This changes the entire competition dynamic.** Instead of imagining what a proposal would look like, you SEE it. The Sapphire Sessions would have been 5 interactive color palette demos instead of text descriptions of colors.

---

## 13. Notion Integration (The Dashboard)

**What it does:** Create pages, query databases, manage tasks, search workspace. Full CRUD on Notion from Claude Code.

**For The River:** Could maintain a living project dashboard, competition results tracker, decision log, and session history — all auto-updated by Claude at session end. Searchable, shareable, visual.

---

## 14. Document Generation (PDF, PPTX, DOCX)

**What it does:** Generate formatted documents programmatically.

**For The River:** Investor pitch deck as PPTX. User guide as PDF. Competition results as formatted documents. The River Medal milestone certificates.

---

## What's NOT Relevant

These plugins exist but don't apply to The River:
- **PostHog** — Conflicts with local-first philosophy. Single user. No benefit.
- **Stripe** — No payments.
- **Sentry** — No backend to monitor.
- **Pinecone/HuggingFace** — No AI/ML features.
- **Firecrawl** — No web scraping needs.

---

## The Competitive Landscape

The River's plugin arsenal, properly deployed, would give it:
- **Design quality** on par with professional studios (frontend-design + design system rules)
- **Code confidence** through automated testing (TDD + simplify)
- **Development speed** through parallel agent workflows (subagent-driven + parallel agents)
- **Cultural enforcement** through hookify rules (no gamification, push commits, etc.)
- **Public reach** through one-command deployment (Vercel)
- **Institutional memory** through custom skills (session protocols, competition format)

The question for the competition: **Which of these capabilities should The River adopt first, and how?**
