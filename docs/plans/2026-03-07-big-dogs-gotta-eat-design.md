# Competition J Design: "Big Dog's Gotta Eat"

> Plugin Discovery Competition — 6 celebrity personas debate how to evolve The River
> Designed March 7, 2026. Outcome: Roadmap document (no implementation).

---

## The Premise

The River just got access to a full arsenal of Claude Code plugins. Six of the most opinionated minds in tech and culture sit down to figure out: **What do we build next, and how?**

This isn't a feature competition. It's a *strategy* competition. The output is a prioritized roadmap that future sessions will execute.

---

## The Panel

| # | Persona | Codename | Role | Specialty | Catchphrase |
|---|---------|----------|------|-----------|-------------|
| 1 | **Kanye West** | The Architect | Creative Director (elevated) | Vision, aesthetics, culture | "This is the future and y'all just visiting" |
| 2 | **Oprah Winfrey** | The Oracle | User Empathy Champion | User experience, emotional resonance | "What does the PERSON practicing guitar actually feel?" |
| 3 | **Johnny Ive** | The Sculptor | Design Arbiter | Visual systems, material honesty | "The quiet discipline of getting it exactly right" |
| 4 | **Steve Jobs** | The Editor | Product Strategist | Focus, saying no, product-market fit | "What are we NOT going to do?" |
| 5 | **Elon Musk** | The Optimizer | Systems Engineer | Efficiency, automation, deployment | "Delete the step. If you're not adding back 10%, delete it." |
| 6 | **Linus Torvalds** | The Gatekeeper | Code Quality Judge | Testing, architecture, technical debt | "Talk is cheap. Show me the tests." |

### Kanye's Elevated Role (Creative Director)
- Can **veto** any proposal he finds aesthetically bankrupt (must justify)
- Can **elevate** any proposal to mandatory consideration (even if low-scored)
- Gets final word on visual/cultural direction
- Other personas can challenge his vetoes (majority overrules)

---

## Custom Scoring Criteria (Per Persona)

Each persona scores proposals on their own axis (1-10):

| Persona | Criterion | What They're Measuring |
|---------|-----------|----------------------|
| Kanye | **Vision** | Does this make The River culturally iconic? |
| Oprah | **Empathy** | Does this serve the human picking up a guitar? |
| Ive | **Craft** | Is the design system elevated, not just functional? |
| Jobs | **Focus** | Does this make the product sharper, not wider? |
| Musk | **Leverage** | Does this 10x efficiency or reach? |
| Linus | **Integrity** | Does this make the codebase trustworthy? |

Final score = average of all 6 axes. Ties broken by Kanye (Creative Director privilege).

---

## The Rounds

### Round 0: The Roundtable
All 6 personas receive the Plugin Briefing + Feature/UX Research + current app state. Open discussion: first impressions, what excites them, what concerns them. Sets the tone.

### Round 1: The Pitch
Each persona presents their **Plugin Adoption Roadmap** — which plugins to adopt, in what order, for what purpose. 300 words max per persona. Must include at least one live code demo or inline example.

### Round 2: The Panel Review
Each persona reviews all 5 other pitches using the Compliment Roast format (1 sincere compliment + 1 loving roast per pitch). Scores on their own criterion axis.

### Round 3: The Debate
5 specific topics, discussed by all 6 personas:
1. **Custom Skills** — Should we encode /session-start, /session-end, /competition as skills?
2. **The Dock Dilemma** — 1,170 lines. Break it up with feature-dev, or redesign from scratch?
3. **Testing From Zero** — TDD on a codebase with zero tests. Where do you even start?
4. **Visual Sharpness** — frontend-design + design-system-rules. How much sharper can we get?
5. **Going Public** — Vercel deploy. What needs to happen before The River goes live?

### Round 4: The Synthesis
Orchestrator compiles the final roadmap from all rounds. Includes:
- Priority-ordered plugin adoption plan
- Specific first actions for each plugin
- Points of consensus and dissent
- Wildcard Award + Comedy Award
- Post-Credits Scene

---

## Input Documents (All Personas Receive)
1. `docs/research/plugin-briefing.md` — 14 plugins researched
2. `docs/research/feature-ux-improvements.md` — Top 5 features + 3 UX improvements
3. `docs/research/ear-training.md` — Ear training research
4. `VISION.md` — Project state, philosophy, what's built
5. Max's inspirational speech (included in brief)

## Output
`docs/competitions/big-dogs-gotta-eat.md` — The complete competition transcript + final roadmap
