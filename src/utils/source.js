import { today, daysBetween, getTotalHours, getSessions } from './storage';

const SOURCE_KEY = 'river-source';

const MARGIN_NOTES = [
  { threshold: 1,  text: "The first hour. You showed up. That's the hardest part." },
  { threshold: 5,  text: "Five hours in. The calluses are forming — not just on your fingers." },
  { threshold: 10, text: "Ten hours. What felt impossible is starting to feel... inevitable." },
  { threshold: 25, text: "Twenty-five hours. You're not the same player who started. Can you feel it?" },
  { threshold: 50, text: "Fifty hours. The river remembers every drop. So do your hands." },
];

// Reading tiers and how many notes they surface
const READING_TIERS = [
  { tier: 10, noteCount: 1 },
  { tier: 25, noteCount: 3 },
  { tier: 50, noteCount: Infinity },
];

export function getSource() {
  try {
    const raw = localStorage.getItem(SOURCE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          answer: parsed.answer ?? null,
          answered_at: parsed.answered_at ?? null,
          margin_notes: Array.isArray(parsed.margin_notes) ? parsed.margin_notes : [],
          readings_completed: Array.isArray(parsed.readings_completed) ? parsed.readings_completed : [],
        };
      }
    }
  } catch {
    // Corrupted — fall through to default
  }
  return {
    answer: null,
    answered_at: null,
    margin_notes: [],
    readings_completed: [],
  };
}

export function saveSource(data) {
  try {
    localStorage.setItem(SOURCE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[River] Failed to save source:', e.message);
  }
}

export function saveSourceAnswer(text) {
  const source = getSource();
  source.answer = text;
  source.answered_at = new Date().toISOString();
  saveSource(source);
}

// Silently writes margin notes at thresholds not yet written.
// Returns array of newly written notes (usually empty or one item).
export function checkAndWriteMarginNotes(totalHours) {
  const source = getSource();
  const alreadyWritten = new Set(source.margin_notes.map(n => n.threshold));
  const newlyWritten = [];

  for (const note of MARGIN_NOTES) {
    if (totalHours >= note.threshold && !alreadyWritten.has(note.threshold)) {
      const written = {
        threshold: note.threshold,
        text: note.text,
        written_at: new Date().toISOString(),
      };
      source.margin_notes.push(written);
      newlyWritten.push(written);
    }
  }

  if (newlyWritten.length > 0) {
    saveSource(source);
  }

  return newlyWritten;
}

// Returns { should: boolean, tier: number|null, notes: array }
// Notes array contains the margin note objects to show for the ceremony.
export function shouldTriggerReading(sessions) {
  const source = getSource();

  // No answer yet — no readings
  if (!source.answer) {
    return { should: false, tier: null, notes: [] };
  }

  const totalHours = getTotalHours(sessions);
  const completedTiers = new Set(source.readings_completed.map(r => r.tier));

  for (const { tier, noteCount } of READING_TIERS) {
    if (totalHours >= tier && !completedTiers.has(tier)) {
      // Surface the appropriate number of written margin notes
      const availableNotes = source.margin_notes
        .slice()
        .sort((a, b) => a.threshold - b.threshold);

      const notes = noteCount === Infinity
        ? availableNotes
        : availableNotes.slice(0, noteCount);

      return { should: true, tier, notes };
    }
  }

  return { should: false, tier: null, notes: [] };
}

export function completeReading(tier) {
  const source = getSource();
  const alreadyDone = source.readings_completed.some(r => r.tier === tier);
  if (!alreadyDone) {
    source.readings_completed.push({ tier, completed_at: new Date().toISOString() });
    saveSource(source);
  }
}

// If the last real session was 7+ days ago AND there is an unrevealed margin
// note (one not yet surfaced in a completed reading), return it. Otherwise null.
export function getSignalFireNote(sessions) {
  const realSessions = sessions.filter(s => !s.fog);
  if (realSessions.length === 0) return null;

  // Sort descending to find the most recent
  const sorted = realSessions.slice().sort((a, b) => (b.date > a.date ? 1 : -1));
  const lastDate = sorted[0].date;
  const todayStr = today();
  const elapsed = daysBetween(lastDate, todayStr);

  if (elapsed < 7) return null;

  const source = getSource();
  if (source.margin_notes.length === 0) return null;

  // Determine thresholds already surfaced in completed readings
  const completedTiers = new Set(source.readings_completed.map(r => r.tier));
  const shownThresholds = new Set();
  for (const { tier, noteCount } of READING_TIERS) {
    if (completedTiers.has(tier)) {
      const notesForTier = source.margin_notes
        .slice()
        .sort((a, b) => a.threshold - b.threshold)
        .slice(0, noteCount === Infinity ? undefined : noteCount);
      for (const n of notesForTier) {
        shownThresholds.add(n.threshold);
      }
    }
  }

  // Find an unrevealed note — prefer most recently written
  const unrevealed = source.margin_notes
    .slice()
    .sort((a, b) => (b.written_at > a.written_at ? 1 : -1))
    .find(n => !shownThresholds.has(n.threshold));

  if (unrevealed) {
    return { text: unrevealed.text, threshold: unrevealed.threshold };
  }

  // Fall back to the most recent note even if already shown in a reading
  const mostRecent = source.margin_notes
    .slice()
    .sort((a, b) => (b.written_at > a.written_at ? 1 : -1))[0];

  return mostRecent ? { text: mostRecent.text, threshold: mostRecent.threshold } : null;
}
