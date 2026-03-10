import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ReadingCeremony({ reading, answer, onComplete }) {
  const { isDark } = useTheme();
  const { tier, notes } = reading;

  const totalPhases = notes.length + 2; // intro + notes + closing
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);

  const isClosing = phase === totalPhases - 1;

  const overlayBg = isDark
    ? 'radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.08) 0%, rgba(12,10,9,0.98) 70%)'
    : 'radial-gradient(ellipse at center, rgba(191,219,254,0.10) 0%, rgba(250,247,242,0.98) 70%)';

  const advance = () => {
    if (isClosing) return;
    setVisible(false);
    setTimeout(() => {
      setPhase(p => p + 1);
      setVisible(true);
    }, 200);
  };

  // Auto-advance intro after 3 seconds
  useEffect(() => {
    if (phase !== 0) return;
    const timer = setTimeout(advance, 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Escape to complete (skip to end)
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onComplete(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onComplete]);

  const tierLabel =
    tier === 10 ? 'The Reading' :
    tier === 25 ? 'The Deeper Reading' :
    'The Full Reading';

  const closingMessage =
    tier === 10 ? 'More notes will appear as you practice.' :
    tier === 25 ? 'The river is still writing.' :
    "You've read everything the river has written. Keep flowing.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: overlayBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      onClick={!isClosing ? advance : undefined}
    >
      <div
        className={`max-w-sm w-full text-center transition-all duration-500 px-6 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {phase === 0 && (
          <>
            <p className="ceremony-text text-2xl text-text mb-4">{tierLabel}</p>
            <p className="font-serif italic text-text-2 text-sm mb-8">
              "You said: '{answer}'"
            </p>
            <p className="text-text-3 text-xs mb-6">
              Let&apos;s see what the river has written...
            </p>
            <p className="text-text-3 text-[10px] uppercase tracking-widest">Tap to begin</p>
          </>
        )}

        {phase >= 1 && phase <= notes.length && (() => {
          const note = notes[phase - 1];
          return (
            <>
              <p className="text-text-3 text-[10px] uppercase tracking-widest mb-3">
                {note.threshold}h
              </p>
              <p className="font-serif italic text-text text-lg leading-relaxed max-w-xs mx-auto mb-8">
                {note.text}
              </p>
              <p className="text-text-3 text-[10px] uppercase tracking-widest">Tap to continue</p>
            </>
          );
        })()}

        {isClosing && (
          <>
            <p className="text-text-2 text-sm mb-8 max-w-xs mx-auto">
              {closingMessage}
            </p>
            <button
              onClick={onComplete}
              className="text-white font-semibold px-10 py-3.5 rounded-full text-sm active:scale-[0.97] transition-transform"
              style={{
                background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),0.95))',
                boxShadow: '0 4px 20px rgba(var(--accent-rgb),0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
