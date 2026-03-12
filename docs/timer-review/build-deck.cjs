const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "The River";
pres.title = "The River — Timer Design Review";

// ─── THEME ───
const BG = "0A0A0A";
const BG_CARD = "1A1A1A";
const AMBER = "C8A864";
const AMBER_DIM = "8B7640";
const GOLD = "E0C58F";
const TEXT = "F5F0E9";
const TEXT_DIM = "A0978A";
const TEAL = "4CAE9E";
const VERDICT_BG = "1E1E1E";

// Factory functions to avoid option mutation
const makeShadow = () => ({ type: "outer", blur: 8, offset: 2, color: "000000", opacity: 0.4 });

// ═══════════════════════════════════════
// SLIDE 1: Title
// ═══════════════════════════════════════
let s1 = pres.addSlide();
s1.background = { color: BG };
// Top accent line
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.03, fill: { color: AMBER } });
// Title
s1.addText("THE RIVER", {
  x: 0.8, y: 1.2, w: 8.4, h: 1.0,
  fontSize: 52, fontFace: "Georgia", color: GOLD, bold: true,
  charSpacing: 8, margin: 0
});
s1.addText("Timer Design Review", {
  x: 0.8, y: 2.1, w: 8.4, h: 0.7,
  fontSize: 28, fontFace: "Georgia", color: AMBER, italic: true, margin: 0
});
// Divider
s1.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.0, w: 2.5, h: 0.02, fill: { color: AMBER_DIM } });
// Subtitle
s1.addText("Every iteration, from first commit to now", {
  x: 0.8, y: 3.3, w: 8.4, h: 0.5,
  fontSize: 14, fontFace: "Calibri", color: TEXT_DIM, margin: 0
});
// Version count
s1.addText("11 versions  ·  7 competitions  ·  1 vision", {
  x: 0.8, y: 4.8, w: 8.4, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: AMBER_DIM, margin: 0
});

// ═══════════════════════════════════════
// SLIDE 2: The 10 Commandments
// ═══════════════════════════════════════
let s2 = pres.addSlide();
s2.background = { color: BG };
s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.03, fill: { color: AMBER } });
s2.addText("THE 10 COMMANDMENTS", {
  x: 0.8, y: 0.3, w: 8.4, h: 0.6,
  fontSize: 24, fontFace: "Georgia", color: GOLD, bold: true, margin: 0
});
s2.addText("The guiding principles for every timer design", {
  x: 0.8, y: 0.85, w: 8.4, h: 0.35,
  fontSize: 12, fontFace: "Calibri", color: TEXT_DIM, italic: true, margin: 0
});

const commandments = [
  "Practice is the hero — timer text dominates",
  "Under-stimulate, never over-stimulate",
  "Time should be FELT, not shown",
  "The visual earns complexity",
  "Nature, not UI",
  "Black is your friend",
  "60fps or nothing",
  "One idea executed perfectly",
  "Motion must breathe",
  "Works at a glance in peripheral vision"
];

// Two columns of 5
const colX = [0.8, 5.2];
commandments.forEach((cmd, i) => {
  const col = i < 5 ? 0 : 1;
  const row = i < 5 ? i : i - 5;
  const y = 1.5 + row * 0.72;
  const x = colX[col];

  // Number circle
  s2.addShape(pres.shapes.OVAL, {
    x: x, y: y + 0.05, w: 0.35, h: 0.35,
    fill: { color: AMBER, transparency: 85 },
    line: { color: AMBER, width: 1 }
  });
  s2.addText(String(i + 1), {
    x: x, y: y + 0.05, w: 0.35, h: 0.35,
    fontSize: 11, fontFace: "Georgia", color: AMBER, align: "center", valign: "middle", margin: 0
  });
  // Text
  s2.addText(cmd, {
    x: x + 0.5, y: y, w: 3.7, h: 0.45,
    fontSize: 12, fontFace: "Calibri", color: TEXT, valign: "middle", margin: 0
  });
});

// ═══════════════════════════════════════
// HELPER: Iteration slide pair
// ═══════════════════════════════════════
function addIteration(version, title, subtitle, descLines, quote, quoteAuthor, critiqueLines, verdict, verdictLabel) {
  // --- Description slide ---
  let sd = pres.addSlide();
  sd.background = { color: BG };
  sd.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.03, fill: { color: AMBER } });

  // Version badge
  sd.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 0.35, w: 0.6, h: 0.35,
    fill: { color: AMBER, transparency: 80 },
    line: { color: AMBER, width: 1 }
  });
  sd.addText(version, {
    x: 0.8, y: 0.35, w: 0.6, h: 0.35,
    fontSize: 11, fontFace: "Calibri", color: AMBER, align: "center", valign: "middle", bold: true, margin: 0
  });

  // Title
  sd.addText(title, {
    x: 1.55, y: 0.3, w: 7.6, h: 0.45,
    fontSize: 22, fontFace: "Georgia", color: GOLD, bold: true, margin: 0
  });
  sd.addText(subtitle, {
    x: 1.55, y: 0.75, w: 7.6, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: TEXT_DIM, italic: true, margin: 0
  });

  // Description card
  sd.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.3, w: 8.4, h: 2.4,
    fill: { color: BG_CARD },
    line: { color: "2A2A2A", width: 1 }
  });
  // Left accent bar
  sd.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.3, w: 0.06, h: 2.4,
    fill: { color: AMBER }
  });

  const descText = descLines.map((line, i) => ({
    text: line,
    options: { bullet: true, breakLine: i < descLines.length - 1, color: TEXT, fontSize: 13, fontFace: "Calibri" }
  }));
  sd.addText(descText, { x: 1.15, y: 1.5, w: 7.8, h: 2.0, margin: 0 });

  // Quote
  if (quote) {
    sd.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 4.0, w: 8.4, h: 0.8,
      fill: { color: "141410" },
      line: { color: AMBER_DIM, width: 0.5 }
    });
    sd.addText([
      { text: `"${quote}"`, options: { italic: true, color: GOLD, fontSize: 13, fontFace: "Georgia", breakLine: true } },
      { text: `— ${quoteAuthor}`, options: { color: AMBER_DIM, fontSize: 10, fontFace: "Calibri" } }
    ], { x: 1.1, y: 4.05, w: 8.0, h: 0.7, margin: 0 });
  }

  // Screenshot placeholder
  sd.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: quote ? 5.0 : 4.2, w: 8.4, h: 0.3,
    fill: { color: BG }
  });
  sd.addText("[ Screenshots: 2min · 15min · 1hr ]", {
    x: 0.8, y: quote ? 5.0 : 4.2, w: 8.4, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: "3A3A3A", align: "center", margin: 0
  });

  // --- Critique slide ---
  let sc = pres.addSlide();
  sc.background = { color: BG };
  sc.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.03, fill: { color: AMBER } });

  sc.addText(`${title} — Critique`, {
    x: 0.8, y: 0.3, w: 8.4, h: 0.45,
    fontSize: 20, fontFace: "Georgia", color: GOLD, margin: 0
  });

  // Critique points
  const critText = critiqueLines.map((line, i) => ({
    text: line,
    options: { bullet: true, breakLine: i < critiqueLines.length - 1, color: TEXT, fontSize: 13, fontFace: "Calibri" }
  }));
  sc.addText(critText, { x: 0.8, y: 1.1, w: 8.4, h: 2.5, margin: 0 });

  // Verdict box
  sc.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.9, w: 8.4, h: 1.2,
    fill: { color: VERDICT_BG },
    line: { color: AMBER, width: 1.5 }
  });
  sc.addText("VERDICT", {
    x: 1.1, y: 4.0, w: 2, h: 0.35,
    fontSize: 10, fontFace: "Calibri", color: AMBER, bold: true, charSpacing: 4, margin: 0
  });
  sc.addText(verdict, {
    x: 1.1, y: 4.35, w: 7.8, h: 0.6,
    fontSize: 14, fontFace: "Georgia", color: TEXT, italic: true, margin: 0
  });
}

// ═══════════════════════════════════════
// V1: Timer Beautification
// ═══════════════════════════════════════
addIteration(
  "V1", "Timer Beautification", "The foundation — typography as UI",
  [
    "First timer upgrade. 5-expert panel: Jony Ive, Dieter Rams, Natasha Jen, Luke Wroblewski, Steve Miner",
    "Lora serif at 80px running, DM Serif Display on stop — typography with presence",
    "Pulsing colon as heartbeat: visible when running, disappears when paused",
    "Progressive color deepening: water-2 to water-5 over 30 minutes",
    "800ms pride moment on stop with settle animation before save flow"
  ],
  "The colon disappears when paused — the heartbeat stops",
  "Design synthesis",
  [
    "Functional but purely typographic — no visual metaphor for time",
    "No spatial sense of time passing beyond color shift",
    "The pulsing colon was universally loved — kept in every subsequent version",
    "Progressive color was the first seed of what became the Color Journey"
  ],
  "Good foundation, needs a visual layer. The typography is the skeleton — but where's the soul?"
);

// ═══════════════════════════════════════
// V2: The Living River
// ═══════════════════════════════════════
addIteration(
  "V2", "The Living River", "First visual metaphor — a drop becomes a trail",
  [
    "Drop descends leaving a luminous Catmull-Rom trail during practice",
    "Color deepens over time. Tap to peek at the clock",
    "First attempt at a visual metaphor: the river as time",
    "The trail was a single continuous curve — elegant in concept"
  ],
  null, null,
  [
    "Too literal — a falling drop doesn't evoke practice",
    "Visual complexity not earned progressively (appears all at once)",
    "The metaphor was right: river = time. But drops = dripping, not flowing",
    "First introduction of 'tap to peek' — a UX pattern that stuck"
  ],
  "Right direction (metaphor), wrong execution. The river is the soul, but a drip isn't a river."
);

// ═══════════════════════════════════════
// V3: The Bloom
// ═══════════════════════════════════════
addIteration(
  "V3", "The Bloom", "Concentric rings from a luminous core",
  [
    "Concentric rings emanate from 3-layer luminous core every 12 seconds",
    "Organic wobble per ring, water-2 to water-4 color progression with lavender accents",
    "SVG animate ripples + bloom-breathe CSS animation",
    "Also introduced countdown mode: pill selector (∞  15  25  45  60)"
  ],
  null, null,
  [
    "Too busy — multiple rings competing for attention",
    "Violates Commandment 2: under-stimulate, never over-stimulate",
    "Countdown mode was a keeper — survived every subsequent redesign",
    "Lavender accents felt off-brand for the warm direction coming later"
  ],
  "Feature addition good (countdown mode), visual too active. Multiple rings = multiple distractions."
);

// ═══════════════════════════════════════
// V4: The Quiet Water
// ═══════════════════════════════════════
addIteration(
  "V4", "The Quiet Water", "Turrell / Eno / Rams — ambient, ignorable, beautiful",
  [
    "Replaced the chaotic Aurora ribbons with slow, wide, glowing currents",
    "Value noise + fractal Brownian motion (fBm) — zero grid artifacts",
    "Full redraw each frame: no accumulation, no visual artifacts",
    "Timer text IS the focal point — everything else is atmosphere",
    "3rd current emerges as reward after 10 minutes of practice"
  ],
  "This is definitely looking better than before. Nice job.",
  "Max",
  [
    "Too subtle — hard to perceive meaningful change over time",
    "No clear visual metaphor: what IS the thing you're looking at?",
    "Approved VIBE — saved as git tag 'quiet-water-v1'",
    "The Turrell influence (light as medium) planted the seed for Gamma"
  ],
  "Right calm energy, but lacks the 'thing' that makes it a timer. The vibe is approved — the form isn't."
);

// ═══════════════════════════════════════
// V5: The Spiral Sun — Competition K
// ═══════════════════════════════════════
addIteration(
  "V5", "The Spiral Sun", "Competition K — 7-artist panel winner",
  [
    "Growing Archimedean spiral with Raven Kwok noise displacement",
    "Rose to Amber to Sage color journey — NO BLUE",
    "Background warms imperceptibly over 30 minutes (Eliasson 'Slow Sun')",
    "Under 10 draw calls per frame, 60fps guaranteed",
    "The warm palette pivot: Max killed blue. This was the first warm version."
  ],
  "The Spiral Sun is okay... but I don't know if it's the best we can do.",
  "Max",
  [
    "Visually interesting but the spiral metaphor doesn't connect to practice or rivers",
    "Color journey was universally loved — became a permanent fixture",
    "The warm palette pivot (killing blue) was the real victory of this version",
    "Raven Kwok's noise displacement technique proved its value here"
  ],
  "Wrong shape, right colors. The spiral doesn't mean anything — but the color journey means everything."
);

// ═══════════════════════════════════════
// V6: The Living Vein — Competition L
// ═══════════════════════════════════════
addIteration(
  "V6", "The Living Vein", "Competition L — venation growth algorithm",
  [
    "Space Colonization Algorithm grows organic branches from center outward",
    "Raven Kwok's actual venation technique — branches seek auxin particles",
    "Lieberman breathing (0.3% scale oscillation) — alive, not animated",
    "Kurokawa color journey: olive trunk to teal tips to mint glow",
    "Growth IS the timer — more time = more intricate = more beautiful"
  ],
  "Love the concept, don't love the execution — kind of ugly. Also veins don't fit the RIVER metaphor.",
  "Max",
  [
    "Max killed it: veins BRANCH. Rivers don't. Conceptual mismatch.",
    "Execution was rough — the branches looked organic but not beautiful",
    "The GROWTH concept was powerful though — earned complexity over time",
    "Toggle feature (art vs numbers) was a UX win that carried forward"
  ],
  "Right concept (earned complexity), wrong metaphor (branching ≠ flowing). Growth is the answer — but veins aren't the shape."
);

// ═══════════════════════════════════════
// V7: The Basin (Water Hourglass v1)
// ═══════════════════════════════════════
addIteration(
  "V7", "The Basin", "The hourglass pivot — water drops fill a vessel",
  [
    "The HOURGLASS PIVOT: water drops fall from top, create ripples on splash",
    "Water level rises over 30 minutes — filling a vessel with practice time",
    "First hourglass-shaped container: the vessel as metaphor for practice",
    "Bezier-curved hourglass outline with particle physics for drops"
  ],
  "The hourglass is the move.",
  "Max",
  [
    "Water drops felt gimmicky — too much visual noise at the splash point",
    "Ripple effects violated the calm aesthetic (Commandment 2)",
    "But the HOURGLASS SHAPE was the breakthrough conceptual moment",
    "A vessel that fills with time — the most intuitive metaphor yet"
  ],
  "Right container (hourglass), wrong filling (water drops). The shape is the breakthrough. Now we need the right substance."
);

// ═══════════════════════════════════════
// V8: Sand Hourglass v4
// ═══════════════════════════════════════
addIteration(
  "V8", "Sand Hourglass", "Pure sand physics — grains fall, mound grows",
  [
    "Classic sand hourglass: top depletes with funnel shape",
    "Grains flow through the neck one by one — mesmerizing to watch",
    "Bottom mound grows with realistic accumulation physics",
    "Killed ALL water drops, splashes, and ripples. Pure and clean."
  ],
  "It climbs up slowly... I love that.",
  "Max",
  [
    "Earthy and satisfying — the climbing motion is addictive to watch",
    "BUT: no color journey. It's just... sand colored. Flat and static.",
    "Missing the warmth and light that makes it feel alive",
    "The 'climbing' quality is the key insight — visible, slow progression"
  ],
  "Best climbing feel, but needs the glow. Sand has the motion — but where's the warmth?"
);

// ═══════════════════════════════════════
// V9: Competition P — Alpha/Beta/Gamma
// ═══════════════════════════════════════
addIteration(
  "V9", "Competition P", "Three siloed teams — Alpha, Beta, Gamma",
  [
    "Alpha (Digital Vanguard): animated noise texture with rising fill line",
    "Beta (Classic Elegance): minimal sand fill with watercolor bleed edge",
    "Gamma (Nature & Light): warm light filling from bottom like a lantern — WINNER",
    "Gamma uses 13-layer rendering: base glow + gradient layers + glass refraction + specular highlights",
    "Shared geometry module + prototype switcher for blind comparison"
  ],
  "The shape still is weird.",
  "Max (on the hourglass proportions)",
  [
    "Alpha: too noisy — animated texture was distracting, not calming",
    "Beta: too plain — watercolor bleed was subtle to the point of invisible",
    "GAMMA WON: warm amber light is the soul of the timer",
    "Max's one complaint: hourglass proportions were off (neck too pinched)"
  ],
  "Gamma light + Sand climbing = the dream combo. The warm amber glow IS the answer. Now fix the shape."
);

// ═══════════════════════════════════════
// V10: Vessel Shapes
// ═══════════════════════════════════════
addIteration(
  "V10", "Vessel Shapes", "Urn · Orb · Lantern — Gamma light in new containers",
  [
    "Max chose Gamma light but wanted to explore beyond the hourglass",
    "Urn: classical amphora — narrow neck flaring to wide belly (most personality)",
    "Orb: simple ellipse — serene, Moon-like, contemplative",
    "Lantern: Noguchi Akari capsule — rounded rectangle, cozy warmth",
    "Gamma's 13-layer light system clips into ANY shape via Canvas clip() — fully pluggable",
    "Also fixed hourglass: wider neck (6% to 10%), softer curves"
  ],
  null, null,
  [
    "The pluggable vessel system is elegant engineering — shape-agnostic light",
    "Urn has the most personality, Orb is the most serene, Lantern is the coziest",
    "But still using Gamma's UNIFORM fill — no climbing motion visible",
    "These are beautiful containers waiting for the right filling behavior"
  ],
  "Beautiful shapes, but they need Sand's climbing behavior. The light fills uniformly — it should RISE."
);

// ═══════════════════════════════════════
// V11: Competition Q — Foundry/Refinery/Hearth
// ═══════════════════════════════════════
addIteration(
  "V11", "Competition Q", "Foundry · Refinery · Hearth — warmth meets climbing",
  [
    "Three new teams combining Gamma's warm light WITH Sand's visible climbing",
    "Foundry: luminous substance rises with curved meniscus, thin stream through neck, subsurface wall glow",
    "Refinery: Gamma + noise-displaced luminous horizon boundary (surgery, not invention)",
    "Hearth: growing FLAME with Kwok-style algorithmic noise texture and ember particles",
    "Shared COLOR_JOURNEY: teal → verdigris → olivine → golden → warm amber"
  ],
  null, null,
  [
    "Foundry: most PHYSICAL — feels like watching honey or molten amber pour",
    "Refinery: SIMPLEST fix — gives Gamma's light a visible rising edge. Less is more.",
    "Hearth: most EMOTIONAL — fire is primal, meditative, alive",
    "All three successfully merge warmth + climbing. The question: which speaks to Max?"
  ],
  "Three strong candidates. Each solves the same problem differently. The answer is in Max's gut."
);

// ═══════════════════════════════════════
// SLIDE: Decision Framework
// ═══════════════════════════════════════
let sd = pres.addSlide();
sd.background = { color: BG };
sd.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.03, fill: { color: AMBER } });

sd.addText("WHAT'S THE MOVE?", {
  x: 0.8, y: 0.3, w: 8.4, h: 0.6,
  fontSize: 28, fontFace: "Georgia", color: GOLD, bold: true, margin: 0
});

// Question cards
const questions = [
  {
    num: "1",
    q: "Which prototype speaks to you?",
    opts: "Foundry (physical pour)  ·  Refinery (minimal horizon)  ·  Hearth (living flame)"
  },
  {
    num: "2",
    q: "Which vessel shape?",
    opts: "Hourglass (classic)  ·  Urn (amphora)  ·  Orb (ellipse)  ·  Lantern (Noguchi)"
  },
  {
    num: "3",
    q: "Should the color journey stay?",
    opts: "Teal → Verdigris → Olivine → Golden → Warm Amber   or   something new?"
  },
  {
    num: "4",
    q: "Do we need another round?",
    opts: "Ship one of these  ·  Combine elements  ·  One more competition"
  }
];

questions.forEach((item, i) => {
  const y = 1.2 + i * 1.0;

  // Card bg
  sd.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: y, w: 8.4, h: 0.85,
    fill: { color: BG_CARD },
    line: { color: "2A2A2A", width: 1 }
  });

  // Number
  sd.addShape(pres.shapes.OVAL, {
    x: 1.05, y: y + 0.2, w: 0.4, h: 0.4,
    fill: { color: AMBER },
  });
  sd.addText(item.num, {
    x: 1.05, y: y + 0.2, w: 0.4, h: 0.4,
    fontSize: 14, fontFace: "Georgia", color: BG, align: "center", valign: "middle", bold: true, margin: 0
  });

  // Question
  sd.addText(item.q, {
    x: 1.7, y: y + 0.1, w: 7.2, h: 0.35,
    fontSize: 14, fontFace: "Georgia", color: TEXT, bold: true, margin: 0
  });
  sd.addText(item.opts, {
    x: 1.7, y: y + 0.45, w: 7.2, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: TEXT_DIM, margin: 0
  });
});

// Bottom note
sd.addText("The answer is in the feeling. Play with each one. Live with it for a few minutes. Trust your gut.", {
  x: 0.8, y: 5.1, w: 8.4, h: 0.3,
  fontSize: 11, fontFace: "Georgia", color: AMBER_DIM, italic: true, margin: 0
});

// ═══════════════════════════════════════
// SAVE
// ═══════════════════════════════════════
const outPath = "/Users/Max/Claude/Guitar Tracking App/.claude/worktrees/musing-nightingale/docs/timer-review/Timer-Design-Review.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Saved to: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
