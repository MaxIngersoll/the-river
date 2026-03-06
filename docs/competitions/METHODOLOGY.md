# Competition Methodology — Lessons & Improvements

> Reflections after running 6 competitions (A through F). Updated each session.

---

## What Worked

### Constraint-Based Personas (the breakthrough)
- **Session 4 discovery**: Giving agents a *constraint* ("everything must pass the gig bag test") produced 10x better results than giving them a *personality* ("be creative and bold")
- Constraints force divergence. Personality allows convergence to the same obvious ideas.
- Best personas: The Gigging Musician (ruthless practicality), The Visual Craftsperson (beauty as non-negotiable), The Hydrologist (real physics adapted for UI)

### Synthesis Over Winner-Takes-All
- Competitions A, B, and D all produced synthesis winners — the best result combined 2-3 proposals
- The bracket isn't about crowning one proposal; it's about surfacing the best *ideas* from everywhere
- Cross-pollination in Round 4 is where the magic happens

### Special Awards Keep Morale Up
- Wildcard and Comedy awards encourage wild ideas that would otherwise self-censor
- The best Wildcard ideas often influence the final synthesis (e.g., "Mother of Pearl" from Competition B)

### Parallel Execution
- Running A and D simultaneously saved ~40 minutes vs sequential
- No conflicts since they touched different files

---

## What Went Wrong

### Session 5: Uncommitted Work Crisis
- Ran 3 competitions overnight, implemented winners, but NEVER COMMITTED
- Lost all context when session ended. Had to recover from worktree docs.
- **Fix**: Commit after every implementation phase. Never accumulate.

### Over-Elaborate Proposals
- Some proposals were 500+ words of prose with zero code specifics
- Beautiful writing ≠ buildable design
- **Fix**: Require code-level specifics in every proposal (component names, CSS values, SVG dimensions, data structures)

### Evaluation Bottleneck
- Scoring 15 proposals × 6 criteria = 90 individual judgments
- This is the slowest part and where quality degrades
- **Fix**: Score in batches of 5 (per persona), not all 15 at once. Use quick-reject for obviously weak proposals.

### Implementation Drift
- Competition winners described ideal states; implementations often cut corners
- E.g., Competition A called for "80x100px chord diagrams" but Phase 1 shipped without any chord diagrams
- **Fix**: Track implementation fidelity. The winner description IS the spec.

---

## Improvements for Competitions E & F

### 1. Build While Competing
Don't wait for competition results to start building. The architectural decisions (component structure, data flow, CSS variable naming) are knowable before proposals. Build the skeleton now, let the competition fill in the design details.

### 2. Code-First Proposals
Every proposal must include:
- Component name and props interface
- Key CSS values (not "make it blue" — give the rgba)
- SVG dimensions and layout math
- State management approach
- Integration points with existing code

### 3. Faster Evaluation
- Quick-reject: if a proposal doesn't address the core problem, score it 0 and move on
- Score per-persona (5 at a time), not all 15 together
- Skip the prose in scoring — focus on the idea, not the writing

### 4. Implementation Checklist
After selecting a winner, create a checklist of specific things to build. Check each off. Don't call it "done" until every item is checked.

### 5. Verify Immediately
After every code change:
- Build passes
- Preview screenshot (dark + light if relevant)
- No console errors
- Existing features still work

---

## Competition Tiers (added Session 8 audit)

Not every feature needs a full 15-proposal bracket. Match the process to the problem:

| Tier | When to Use | Format | Example |
|------|-------------|--------|---------|
| **Tier 1 (Full)** | Major features, visual redesigns, architecture | 3 personas x 5 proposals, 5-round bracket | Living River, The Dock, Season System |
| **Tier 2 (Quick)** | Medium features, refinements | 3 personas x 1 proposal, 2 rounds (score + synthesize) | Milestone PDF styling, specific UI tweaks |
| **Tier 3 (Flash)** | Small fixes, clear requirements | No competition. Just build it. | Bug fixes, copy changes, small additions |

**Rule of thumb:** If you're not sure, start with Tier 2. Upgrade to Tier 1 if the first round reveals the problem is bigger than expected.

---

## Token Discipline (added Session 8 audit)

- Proposals: 150 words max. Pitch the idea, don't write an essay.
- Quick-reject: if a proposal doesn't address the core problem, score 0 and move on. Don't write paragraph feedback for obvious rejects.
- Build architecture first — competition fills in design details, not component structure or data flow.
- Score in batches of 5 (per persona), not all 15 at once.

---

## Culture Reminders

> "I want a lot of love being sent between agents and to yourself as well." — Max

> "Continue the spirit of friendliness, creativity, silliness, and joking around." — Max

> "Give agents a constraint, not a personality." — Design Process Journal

> "Try things that scare you." — Competition Protocol

---

*Updated: Session 8 (March 6, 2026) — added Competition Tiers + Token Discipline from Competition H audit*
