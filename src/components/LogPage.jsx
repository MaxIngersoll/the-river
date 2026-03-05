import { useState } from 'react';
import { addSession, today, formatDuration } from '../utils/storage';
import { getQuoteByCategory } from '../utils/quotes';
import { checkNewMilestones } from '../utils/milestones';

const PRESETS = [15, 30, 45, 60];

export default function LogPage({ sessions, onLog, onCelebrate, onNavigateHome }) {
  const [duration, setDuration] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);
  const [logSummary, setLogSummary] = useState(null);
  const [postQuote, setPostQuote] = useState(null);

  const effectiveDuration = selectedPreset || (duration ? parseInt(duration, 10) : 0);

  const handlePreset = (mins) => {
    setSelectedPreset(mins);
    setDuration('');
  };

  const handleCustom = (val) => {
    setDuration(val);
    setSelectedPreset(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (effectiveDuration <= 0) return;

    const session = addSession({
      date,
      duration_minutes: effectiveDuration,
      note: note.trim(),
    });

    // Get updated sessions
    const updatedSessions = [...sessions, session];

    setLogged(true);
    setLogSummary(`Added ${formatDuration(effectiveDuration)} to your river`);
    setPostQuote(getQuoteByCategory('consistency', 'identity'));

    // Check milestones
    const newMilestones = checkNewMilestones(updatedSessions);

    // Notify parent
    onLog(session);

    // Show confirmation for 2.5s, then navigate home (celebrations show on top)
    setTimeout(() => {
      if (newMilestones.length > 0) {
        onCelebrate(newMilestones);
      }
      // Reset form state
      setLogged(false);
      setLogSummary(null);
      setPostQuote(null);
      setDuration('');
      setSelectedPreset(null);
      setNote('');
      setDate(today());
      onNavigateHome();
    }, 2500);
  };

  if (logged) {
    return (
      <div className="px-5 pt-16 pb-24 max-w-lg mx-auto text-center animate-fade-in-up relative z-10">
        {/* Success checkmark */}
        <div
          className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center animate-bounce-in"
          style={{
            background: 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(17,94,89,0.95))',
            boxShadow: '0 4px 24px rgba(20,184,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-water-5 font-bold text-xl mb-2">Logged!</p>
        <p className="text-text-2 text-sm mb-10">{logSummary}</p>

        {/* Post-log quote */}
        {postQuote && (
          <div className="card p-5 text-left">
            <p className="font-serif italic text-text text-[15px] leading-relaxed">
              &ldquo;{postQuote.text}&rdquo;
            </p>
            <p className="text-text-3 text-xs mt-3">
              {postQuote.author}
              {postQuote.source && <span> &mdash; {postQuote.source}</span>}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
      <h1 className="text-2xl font-bold text-text mb-1">Log Practice</h1>
      <p className="text-text-3 text-sm mb-8">Every drop feeds the river</p>

      <form onSubmit={handleSubmit}>
        {/* Duration presets */}
        <label className="text-text-2 text-xs font-medium uppercase tracking-wider block mb-3">
          Duration
        </label>
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          {PRESETS.map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => handlePreset(mins)}
              className={`py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                selectedPreset === mins
                  ? 'text-white scale-[1.02]'
                  : 'card text-text-2 active:scale-[0.97]'
              }`}
              style={selectedPreset === mins ? {
                background: 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(17,94,89,0.95))',
                boxShadow: '0 4px 16px rgba(20,184,166,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              } : undefined}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Custom duration */}
        <div className="relative mb-6">
          <input
            type="number"
            value={duration}
            onChange={(e) => handleCustom(e.target.value)}
            placeholder="Custom minutes"
            min="1"
            max="480"
            className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3"
          />
        </div>

        {/* Date */}
        <label className="text-text-2 text-xs font-medium uppercase tracking-wider block mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today()}
          className="glass-input w-full px-4 py-3.5 text-sm text-text mb-6"
        />

        {/* Note */}
        <label className="text-text-2 text-xs font-medium uppercase tracking-wider block mb-2">
          Note
          <span className="text-text-3 font-normal normal-case tracking-normal ml-1">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you work on?"
          maxLength={280}
          rows={3}
          className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3 resize-none"
        />
        <p className="text-text-3 text-xs text-right mt-1.5 mb-8">
          {note.length}/280
        </p>

        {/* Submit — glassy gradient button */}
        <button
          type="submit"
          disabled={effectiveDuration <= 0}
          className="w-full text-white font-semibold py-4 rounded-full text-base active:scale-[0.97] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{
            background: effectiveDuration > 0
              ? 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(17,94,89,0.95))'
              : 'rgba(120,113,108,0.3)',
            boxShadow: effectiveDuration > 0
              ? '0 4px 20px rgba(20,184,166,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              : 'none',
          }}
        >
          {effectiveDuration > 0
            ? `Log ${formatDuration(effectiveDuration)}`
            : 'Log Practice'
          }
        </button>
      </form>
    </div>
  );
}
