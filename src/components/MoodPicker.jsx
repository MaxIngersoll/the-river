import { useCallback } from 'react';
import { haptics } from '../utils/haptics';

/**
 * Mood picker — 4 weather icons, no text labels.
 * Per Fukasawa: words make you choose, icons make you feel.
 * Moods map to weather metaphors that echo the river:
 *   sun = energized/flowing, cloud = calm/steady, rain = heavy/grinding, wind = scattered/restless
 */
const MOODS = [
  { id: 'sun', emoji: '\u2600\uFE0F', color: 'var(--color-amber)' },
  { id: 'cloud', emoji: '\u2601\uFE0F', color: 'var(--color-text-3)' },
  { id: 'rain', emoji: '\u{1F327}\uFE0F', color: 'var(--color-water-3)' },
  { id: 'wind', emoji: '\u{1F32C}\uFE0F', color: 'var(--color-lavender)' },
];

export default function MoodPicker({ selected, onSelect }) {
  const handleSelect = useCallback((id) => {
    haptics.tagToggle();
    onSelect(selected === id ? null : id); // Toggle off if same
  }, [selected, onSelect]);

  return (
    <div className="flex justify-center gap-4" role="radiogroup" aria-label="How did practice feel?">
      {MOODS.map((mood) => {
        const active = selected === mood.id;
        return (
          <button
            key={mood.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={mood.id}
            onClick={() => handleSelect(mood.id)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all active:scale-[0.90] ${
              active
                ? 'ring-2 scale-110 bg-dry/60'
                : 'bg-dry/20 opacity-60 hover:opacity-80'
            }`}
            style={active ? { ringColor: mood.color } : undefined}
          >
            {mood.emoji}
          </button>
        );
      })}
    </div>
  );
}

export { MOODS };
