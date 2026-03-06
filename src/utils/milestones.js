import { getMilestones, setMilestones, getTotalHours, calculateStreak, getSessionsByDate, today, addDays, generateId } from './storage';

const MILESTONE_DEFINITIONS = [
  // Hours milestones
  { type: 'hours', threshold: 1, label: 'First Drop', emoji: '\u{1F4A7}', message: 'Your river has begun to flow.' },
  { type: 'hours', threshold: 5, label: 'Trickling Stream', emoji: '\u{1F4A7}', message: 'A steady trickle is forming.' },
  { type: 'hours', threshold: 10, label: 'The Stream Begins', emoji: '\u{1F30A}', message: 'You can hear it now. The water is moving.' },
  { type: 'hours', threshold: 25, label: 'Gathering Waters', emoji: '\u{1F30A}', message: 'The stream is gaining strength.' },
  { type: 'hours', threshold: 50, label: 'Finding Flow', emoji: '\u{1F30D}', message: 'Deep currents are forming beneath the surface.' },
  { type: 'hours', threshold: 100, label: 'Deep Water', emoji: '\u{1F531}', message: 'You have built something real and enduring.' },
  { type: 'hours', threshold: 200, label: 'The Great River', emoji: '\u{1F3DE}\u{FE0F}', message: 'A force of nature. Unstoppable.' },
  { type: 'hours', threshold: 500, label: 'Ocean Bound', emoji: '\u{1F30A}', message: 'Your river flows with the power of dedication.' },
  { type: 'hours', threshold: 1000, label: 'The Deep', emoji: '\u{2693}', message: 'One thousand hours. Mastery flows through you.' },

  // Streak milestones
  { type: 'streak', threshold: 3, label: 'First Current', emoji: '\u{2728}', message: 'Three days of unbroken flow.' },
  { type: 'streak', threshold: 7, label: 'One Week Flow', emoji: '\u{2728}', message: 'A full week. The habit is taking shape.' },
  { type: 'streak', threshold: 14, label: 'Fortnight Flow', emoji: '\u{1F525}', message: 'Two weeks of dedication.' },
  { type: 'streak', threshold: 21, label: 'Habit Formed', emoji: '\u{1F525}', message: 'Twenty-one days. This is who you are now.' },
  { type: 'streak', threshold: 30, label: 'Moon Cycle', emoji: '\u{1F319}', message: 'A full lunar cycle of practice.' },
  { type: 'streak', threshold: 60, label: 'Two Moons', emoji: '\u{1F31D}', message: 'Sixty days of unbroken flow.' },
  { type: 'streak', threshold: 90, label: 'The Season', emoji: '\u{1F343}', message: 'An entire season of daily practice.' },
  { type: 'streak', threshold: 180, label: 'Half Year Flow', emoji: '\u{26A1}', message: 'Six months. Extraordinary.' },
  { type: 'streak', threshold: 365, label: 'The Eternal River', emoji: '\u{1F451}', message: 'One year of daily practice. Legendary.' },

  // Session milestones
  { type: 'sessions', threshold: 1, label: 'Source Spring', emoji: '\u{1F331}', message: 'The very first drop. Everything starts here.' },
  { type: 'sessions', threshold: 10, label: 'Ten Springs', emoji: '\u{1F33F}', message: 'Ten sessions in. Keep going.' },
  { type: 'sessions', threshold: 50, label: 'Fifty Flows', emoji: '\u{1F332}', message: 'Fifty times you chose to practice.' },
  { type: 'sessions', threshold: 100, label: 'Century', emoji: '\u{1F3C6}', message: 'One hundred sessions. A true commitment.' },
  { type: 'sessions', threshold: 500, label: 'Five Hundred', emoji: '\u{1F48E}', message: 'Five hundred sessions. Remarkable.' },
];

export function checkNewMilestones(sessions) {
  const existing = getMilestones();
  const existingKeys = new Set(existing.map(m => `${m.type}-${m.threshold}`));

  const totalHours = getTotalHours(sessions);
  const { current: currentStreak } = calculateStreak(sessions);
  const sessionCount = sessions.filter(s => !s.fog).length;

  const newlyUnlocked = [];

  for (const def of MILESTONE_DEFINITIONS) {
    const key = `${def.type}-${def.threshold}`;
    if (existingKeys.has(key)) continue;

    let value;
    if (def.type === 'hours') value = totalHours;
    else if (def.type === 'streak') value = currentStreak;
    else if (def.type === 'sessions') value = sessionCount;

    if (value >= def.threshold) {
      const milestone = {
        id: generateId(),
        type: def.type,
        threshold: def.threshold,
        label: def.label,
        emoji: def.emoji,
        message: def.message,
        unlocked_at: new Date().toISOString(),
      };
      existing.push(milestone);
      newlyUnlocked.push(milestone);
    }
  }

  // Check for comeback — first session after 3+ dry days
  const comebackKey = 'comeback-latest';
  if (!existingKeys.has(comebackKey)) {
    const realSessions = sessions.filter(s => !s.fog);
    const byDate = getSessionsByDate(realSessions);
    const todayStr = today();
    const todaySessions = byDate[todayStr];
    if (todaySessions && todaySessions.length === 1) {
      // This is the only real session today — check if previous was 3+ days ago
      const dates = Object.keys(byDate).sort();
      const todayIdx = dates.indexOf(todayStr);
      if (todayIdx > 0) {
        const prevDate = dates[todayIdx - 1];
        const daysSince = Math.round(
          (new Date(todayStr + 'T12:00:00') - new Date(prevDate + 'T12:00:00')) / (1000 * 60 * 60 * 24)
        );
        if (daysSince >= 3) {
          // Check we haven't already shown a comeback today
          const alreadyShown = existing.some(m => m.type === 'comeback' && m.unlocked_at && m.unlocked_at.startsWith(todayStr));
          if (!alreadyShown) {
            const comeback = {
              id: generateId(),
              type: 'comeback',
              threshold: daysSince,
              label: 'The Rain Returns',
              emoji: '\u{1F327}\u{FE0F}',
              message: `${daysSince} days away, but you came back. That takes strength.`,
              unlocked_at: new Date().toISOString(),
            };
            existing.push(comeback);
            newlyUnlocked.push(comeback);
          }
        }
      }
    }
  }

  if (newlyUnlocked.length > 0) {
    setMilestones(existing);
  }

  return newlyUnlocked;
}

export function getMilestoneQuoteCategories(type) {
  if (type === 'hours') return ['practice', 'growth'];
  if (type === 'streak') return ['persistence', 'consistency'];
  if (type === 'comeback') return ['persistence', 'growth'];
  return ['identity'];
}
