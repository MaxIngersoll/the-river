import { useState, useCallback } from 'react';
import BottomSheet from './BottomSheet';
import { addSession, today, formatDuration, PRACTICE_TAGS, TAG_COLORS } from '../utils/storage';
import { haptics } from '../utils/haptics';

const QUICK_PRESETS = [15, 30, 45, 60];

export default function QuickLog({ open, onClose, onLog }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);

  const handleSave = useCallback(() => {
    if (!selectedPreset) return;
    haptics.save();

    const session = addSession({
      date: today(),
      duration_minutes: selectedPreset,
      note: note.trim(),
      tags,
    });

    onLog(session);

    // Reset
    setSelectedPreset(null);
    setNote('');
    setTags([]);
    onClose();
  }, [selectedPreset, note, tags, onLog, onClose]);

  const handleClose = useCallback(() => {
    setSelectedPreset(null);
    setNote('');
    setTags([]);
    onClose();
  }, [onClose]);

  return (
    <BottomSheet open={open} onClose={handleClose} title="Quick Log">
      {/* Duration presets */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {QUICK_PRESETS.map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => {
              setSelectedPreset(mins);
              haptics.tagToggle();
            }}
            className={`py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.95] ${
              selectedPreset === mins
                ? 'bg-water-3/20 text-water-5 ring-1 ring-water-3/40'
                : 'bg-dry/40 text-text-2'
            }`}
          >
            {formatDuration(mins)}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {PRACTICE_TAGS.map((tag) => {
          const active = tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => {
                haptics.tagToggle();
                setTags((prev) =>
                  active ? prev.filter((t) => t !== tag) : [...prev, tag]
                );
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                active ? 'text-white' : 'text-text-3'
              }`}
              style={
                active
                  ? { background: TAG_COLORS[tag] || 'var(--color-water-3)' }
                  : { background: 'rgba(128,128,128,0.1)' }
              }
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Note */}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What did you work on?"
        maxLength={280}
        className="glass-input w-full px-4 py-3 text-sm text-text placeholder-text-3/50 mb-5"
        onKeyDown={(e) => { if (e.key === 'Enter' && selectedPreset) handleSave(); }}
      />

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!selectedPreset}
        className="w-full text-white font-semibold py-4 rounded-full text-base transition-all active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
        style={{
          background: selectedPreset
            ? 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))'
            : 'rgba(128,128,128,0.3)',
          boxShadow: selectedPreset
            ? '0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            : 'none',
        }}
      >
        {selectedPreset ? `Log ${formatDuration(selectedPreset)}` : 'Choose a duration'}
      </button>
    </BottomSheet>
  );
}
