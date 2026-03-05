import { useEffect, useState } from 'react';
import { getQuoteByCategory } from '../utils/quotes';
import { getMilestoneQuoteCategories } from '../utils/milestones';
import { useTheme } from '../contexts/ThemeContext';

export default function CelebrationOverlay({ milestone, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const { isDark } = useTheme();
  const categories = getMilestoneQuoteCategories(milestone.type);
  const quote = getQuoteByCategory(...categories);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const overlayBg = isDark
    ? 'radial-gradient(ellipse at center, rgba(45,212,191,0.10) 0%, rgba(12,10,9,0.97) 70%)'
    : 'radial-gradient(ellipse at center, rgba(167,243,208,0.12) 0%, rgba(250,247,242,0.97) 70%)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        background: overlayBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        className={`max-w-sm w-full text-center transition-all duration-600 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
        }`}
      >
        {/* Emoji with glow ring */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute w-28 h-28 rounded-full bg-water-2/15 animate-pulse-glow" />
          <div className="text-[72px] animate-bounce-in">
            {milestone.emoji}
          </div>
        </div>

        {/* Label */}
        <h2 className="text-2xl font-bold text-text mb-2">
          {milestone.label}
        </h2>

        {/* Detail */}
        <p className="text-text-2 text-sm mb-1">
          {milestone.type === 'hours' && `${milestone.threshold} hours practiced`}
          {milestone.type === 'streak' && `${milestone.threshold} day streak`}
          {milestone.type === 'sessions' && `${milestone.threshold} session${milestone.threshold !== 1 ? 's' : ''} logged`}
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

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="text-white font-semibold px-10 py-3.5 rounded-full text-sm active:scale-[0.97] transition-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(17,94,89,0.95))',
            boxShadow: '0 4px 20px rgba(20,184,166,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
