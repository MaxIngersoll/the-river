import { useState } from 'react';
import { addSession, today, formatDuration, PRACTICE_TAGS } from '../utils/storage';
import { getQuoteByCategory } from '../utils/quotes';
import { checkNewMilestones } from '../utils/milestones';
import { getSource, saveSourceAnswer } from '../utils/source';
import { shouldOfferBottleWrite, writeBottleMessage } from '../utils/bottleMessages';
import SourceQuestion from './SourceQuestion';

const PRESETS = [15, 30, 45, 60];

export default function LogPage({ sessions, onLog, onCelebrate, onNavigateHome }) {
  const [duration, setDuration] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [logged, setLogged] = useState(false);
  const [logSummary, setLogSummary] = useState(null);
  const [postQuote, setPostQuote] = useState(null);
  const [pendingMilestones, setPendingMilestones] = useState([]);
  const [showSourceQuestion, setShowSourceQuestion] = useState(false);
  const [showBottlePrompt, setShowBottlePrompt] = useState(false);
  const [bottleText, setBottleText] = useState('');
  const [bottleSent, setBottleSent] = useState(false);

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
    if (effectiveDuration <= 0 || effectiveDuration > 480) return;

    // Prevent future dates
    const safeDate = date > today() ? today() : date;

    const session = addSession({
      date: safeDate,
      duration_minutes: effectiveDuration,
      note: note.trim(),
      tags,
    });

    // Get updated sessions
    const updatedSessions = [...sessions, session];

    setLogged(true);
    setLogSummary(`Added ${formatDuration(effectiveDuration)} to your river`);
    setPostQuote(getQuoteByCategory('consistency', 'identity'));

    // Check milestones
    const newMilestones = checkNewMilestones(updatedSessions);
    setPendingMilestones(newMilestones);

    // Check session-5 Source question (exclude fog sessions)
    const realSessions = updatedSessions.filter(s => !s.fog);
    const source = getSource();
    if (realSessions.length === 5 && !source.answer) {
      setShowSourceQuestion(true);
    }

    // Check if we should offer bottle write
    if (shouldOfferBottleWrite(updatedSessions)) {
      setShowBottlePrompt(true);
    }

    // Notify parent
    onLog(session);
  };

  const resetForm = () => {
    setLogged(false);
    setLogSummary(null);
    setPostQuote(null);
    setDuration('');
    setSelectedPreset(null);
    setNote('');
    setTags([]);
    setDate(today());
    setShowBottlePrompt(false);
    setBottleText('');
    setBottleSent(false);
    setShowSourceQuestion(false);
  };

  const handleDone = () => {
    if (pendingMilestones.length > 0) {
      onCelebrate(pendingMilestones);
    }
    resetForm();
    onNavigateHome();
  };

  const handleLogAnother = () => {
    if (pendingMilestones.length > 0) {
      onCelebrate(pendingMilestones);
    }
    resetForm();
  };

  if (logged) {
    return (
      <div className="px-5 pt-16 pb-24 max-w-lg mx-auto text-center animate-fade-in-up relative z-10">
        {/* Success checkmark */}
        <div
          className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center animate-bounce-in"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
            boxShadow: '0 4px 24px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-water-5 font-bold text-xl mb-2">Logged!</p>
        <p className="text-text-2 text-sm mb-10">{logSummary}</p>

        {/* Session 5 Source Question */}
        {showSourceQuestion && (
          <SourceQuestion
            onAnswer={(text) => {
              saveSourceAnswer(text);
              setShowSourceQuestion(false);
            }}
            onSkip={() => setShowSourceQuestion(false)}
          />
        )}

        {/* Message in a bottle — offer to write during good sessions */}
        {showBottlePrompt && !bottleSent && (
          <div className="card p-5 mb-6 text-left animate-fade-in">
            <p className="text-text-3 text-[10px] uppercase tracking-widest mb-2">Message in a Bottle</p>
            <p className="text-text-2 text-xs mb-3">
              Write a note to your future self. It&apos;ll wash ashore on a rest day.
            </p>
            <textarea
              value={bottleText}
              onChange={(e) => setBottleText(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="A word of encouragement..."
              className="glass-input w-full px-3 py-2 text-sm text-text placeholder-text-3 resize-none mb-3"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (bottleText.trim()) {
                    writeBottleMessage(bottleText.trim());
                    setBottleSent(true);
                  }
                }}
                disabled={!bottleText.trim()}
                className="px-4 py-1.5 rounded-full text-[11px] font-semibold text-white disabled:opacity-40 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                }}
              >
                Cast it into the river
              </button>
              <button
                onClick={() => setShowBottlePrompt(false)}
                className="px-3 py-1.5 text-[11px] text-text-3"
              >
                Skip
              </button>
            </div>
          </div>
        )}
        {bottleSent && (
          <p className="text-text-3 text-xs italic mb-6 animate-fade-in">
            Your message drifts downstream...
          </p>
        )}

        {/* Post-log quote */}
        {postQuote && (
          <div className="card p-5 text-left mb-10">
            <p className="font-serif italic text-text text-[15px] leading-relaxed">
              &ldquo;{postQuote.text}&rdquo;
            </p>
            <p className="text-text-3 text-xs mt-3">
              {postQuote.author}
              {postQuote.source && <span> &mdash; {postQuote.source}</span>}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3 w-full max-w-xs mx-auto">
          <button
            onClick={handleDone}
            className="w-full text-white font-semibold py-3.5 rounded-full text-sm active:scale-[0.97] transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
              boxShadow: '0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            Done
          </button>
          <button
            onClick={handleLogAnother}
            className="w-full py-3 rounded-full text-sm font-medium text-text-2 active:scale-[0.97] transition-all"
          >
            Log Another Session
          </button>
        </div>
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
                background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                boxShadow: '0 4px 16px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              } : undefined}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Custom duration */}
        <div className="relative mb-6">
          <input
            id="custom-duration"
            type="number"
            value={duration}
            onChange={(e) => handleCustom(e.target.value)}
            placeholder="Custom minutes"
            min="1"
            max="480"
            aria-label="Custom duration in minutes"
            className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3"
          />
        </div>

        {/* Date */}
        <label htmlFor="session-date" className="text-text-2 text-xs font-medium uppercase tracking-wider block mb-2">
          Date
        </label>
        <input
          id="session-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today()}
          className="glass-input w-full px-4 py-3.5 text-sm text-text mb-6"
        />

        {/* Note */}
        <label htmlFor="session-note" className="text-text-2 text-xs font-medium uppercase tracking-wider block mb-2">
          Note
          <span className="text-text-3 font-normal normal-case tracking-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="session-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you work on?"
          maxLength={280}
          rows={3}
          className="glass-input w-full px-4 py-3.5 text-sm text-text placeholder-text-3 resize-none"
        />
        <p className="text-text-3 text-xs text-right mt-1.5 mb-4">
          {note.length}/280
        </p>

        {/* Practice tags */}
        <label className="text-text-2 text-xs font-medium uppercase tracking-wider block mb-2">
          Focus
          <span className="text-text-3 font-normal normal-case tracking-normal ml-1">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-8">
          {PRACTICE_TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setTags(prev =>
                  active ? prev.filter(t => t !== tag) : [...prev, tag]
                )}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active ? 'text-white' : 'card text-text-2 active:scale-[0.95]'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                  boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                } : undefined}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Submit — glassy gradient button */}
        <button
          type="submit"
          disabled={effectiveDuration <= 0}
          className="w-full text-white font-semibold py-4 rounded-full text-base active:scale-[0.97] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{
            background: effectiveDuration > 0
              ? 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))'
              : 'rgba(120,113,108,0.3)',
            boxShadow: effectiveDuration > 0
              ? '0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
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
