import { useEffect, useState, useRef, useCallback } from 'react';
import { getQuoteByCategory } from '../utils/quotes';
import { getMilestoneQuoteCategories } from '../utils/milestones';
import { useTheme } from '../contexts/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { haptics } from '../utils/haptics';

export default function CelebrationOverlay({ milestone, onDismiss, queuePosition = 1, queueTotal = 1 }) {
  const [visible, setVisible] = useState(false);
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isFogType = milestone.type === 'fog' || milestone.type === 'fog-bottle';
  const categories = isFogType ? ['persistence', 'growth'] : getMilestoneQuoteCategories(milestone.type);
  const quote = isFogType ? null : getQuoteByCategory(...categories);
  const timerRef = useRef(null);

  const dismissDelay = isFogType ? 3500 : 6000;
  const startDismissTimer = useCallback(() => {
    timerRef.current = setTimeout(onDismiss, dismissDelay);
  }, [onDismiss, dismissDelay]);

  const pauseDismissTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    startDismissTimer();
    // Haptic feedback on mobile (skip when reduced motion preferred)
    if (!prefersReducedMotion) {
      haptics.milestone();
    }
    return () => pauseDismissTimer();
  }, [startDismissTimer, pauseDismissTimer, prefersReducedMotion]);

  // Escape key to dismiss
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onDismiss(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  const overlayBg = isFogType
    ? (isDark
      ? 'radial-gradient(ellipse at center, rgba(120,113,108,0.08) 0%, rgba(12,10,9,0.97) 70%)'
      : 'radial-gradient(ellipse at center, rgba(168,162,158,0.10) 0%, rgba(250,247,242,0.97) 70%)')
    : (isDark
      ? 'radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.10) 0%, rgba(12,10,9,0.97) 70%)'
      : 'radial-gradient(ellipse at center, rgba(191,219,254,0.12) 0%, rgba(250,247,242,0.97) 70%)');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-label"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        background: overlayBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onMouseEnter={pauseDismissTimer}
      onMouseLeave={startDismissTimer}
      onFocus={pauseDismissTimer}
      onBlur={startDismissTimer}
    >
      <div
        className={`max-w-sm w-full text-center transition-all duration-600 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
        }`}
      >
        {milestone.type === 'fog' ? (
          <>
            <div className="text-[72px] mb-6 animate-bounce-in">{'\u{1F32B}\u{FE0F}'}</div>
            <h2 id="celebration-label" className="ceremony-text text-2xl text-text mb-2">Rest Day</h2>
            <p className="text-text-2 text-sm mb-8">
              Your streak is safe. The river rests but doesn&apos;t stop.
            </p>
          </>
        ) : milestone.type === 'fog-bottle' ? (
          <>
            <div className="text-[48px] mb-4 animate-bounce-in">{'\u{1F4DC}'}</div>
            <h2 id="celebration-label" className="ceremony-text text-lg text-text mb-4">A message found in the river</h2>
            <div className="card p-6 mb-8 text-left">
              <p className="font-serif italic text-text text-lg leading-relaxed">
                &ldquo;{milestone.message}&rdquo;
              </p>
              <p className="text-text-3 text-xs mt-4">&mdash; Your past self</p>
            </div>
          </>
        ) : (
          <>
            {/* Emoji with glow ring */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-28 h-28 rounded-full bg-water-2/15 animate-pulse-glow" />
              <div className="text-[72px] animate-bounce-in">
                {milestone.emoji}
              </div>
            </div>

            {/* Label */}
            <h2 id="celebration-label" className="ceremony-text text-2xl text-text mb-2">
              {milestone.label}
            </h2>

            {/* Detail */}
            <p className="text-text-2 text-sm mb-1">
              {milestone.type === 'hours' && `${milestone.threshold} hours practiced`}
              {milestone.type === 'streak' && `${milestone.threshold} day streak`}
              {milestone.type === 'sessions' && `${milestone.threshold} session${milestone.threshold !== 1 ? 's' : ''} logged`}
              {milestone.type === 'comeback' && `Back after ${milestone.threshold} days`}
            </p>

            {/* Message */}
            <p className="text-water-4 font-medium text-sm mb-8">
              {milestone.message}
            </p>

            {/* Surge animation */}
            <div className="mx-auto w-48 h-1 bg-dry rounded-full overflow-hidden mb-8">
              <div
                className="h-full rounded-full animate-surge"
                style={{
                  background: 'linear-gradient(90deg, var(--color-water-2), var(--color-water-5))',
                }}
              />
            </div>

            {/* Quote */}
            <div className="card p-5 mb-8 text-left">
              <p className="font-serif italic text-text text-[15px] leading-relaxed">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="text-text-3 text-xs mt-3">
                {quote.author}
              </p>
            </div>
          </>
        )}

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="text-white font-semibold px-10 py-3.5 rounded-full text-sm active:scale-[0.97] transition-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),0.95))',
            boxShadow: '0 4px 20px rgba(var(--accent-rgb),0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {queueTotal > 1 ? `Continue (${queuePosition} of ${queueTotal})` : 'Continue'}
        </button>
      </div>
    </div>
  );
}
