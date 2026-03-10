import { useState, useCallback } from 'react';

const SCREENS = [
  {
    id: 'not-an-app',
    heading: "This isn't a productivity app.",
    body: "It doesn't have streaks that punish you, or goals that shame you, or charts that make you feel behind.",
    sub: null,
  },
  {
    id: 'witness',
    heading: 'This is a witness.',
    body: "It watches you practice, and it remembers. On the days you played for hours, it remembers. On the days you couldn't pick up the guitar at all, it remembers those too.",
    sub: "Because the hardest part of learning music isn't the notes. It's showing up.",
  },
  {
    id: 'begin',
    heading: null, // special screen with river animation
    body: 'Your river begins here. Every session you log becomes water. Over time, it grows into something beautiful.',
    sub: null,
  },
];

// Minimal soul line SVG — a thin breathing line
function SoulLine({ visible }) {
  if (!visible) return null;
  return (
    <svg
      viewBox="0 0 300 40"
      className="w-48 h-8 mx-auto mb-8 opacity-60"
      style={{ animation: 'soul-breathe 4s ease-in-out infinite' }}
    >
      <path
        d="M 10 20 Q 75 8 150 20 Q 225 32 290 20"
        fill="none"
        stroke="rgba(96, 165, 250, 0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// River birth animation — dry to blue
function RiverBirth({ visible }) {
  if (!visible) return null;
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <svg viewBox="0 0 300 60" className="w-64 h-12">
        <defs>
          <linearGradient id="riverBirth" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(148, 163, 184, 0.3)" />
            <stop offset="40%" stopColor="rgba(96, 165, 250, 0.6)">
              <animate attributeName="offset" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)">
              <animate attributeName="stopColor" values="rgba(var(--accent-rgb),0.4);rgba(var(--accent-rgb),0.8);rgba(var(--accent-rgb),0.4)" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <path
          d="M 10 30 Q 50 15 100 28 Q 150 42 200 25 Q 250 12 290 30"
          fill="none"
          stroke="url(#riverBirth)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ animation: 'soul-breathe 4s ease-in-out infinite' }}
        />
      </svg>
    </div>
  );
}

export default function OnboardingFlow({ onComplete }) {
  const [screen, setScreen] = useState(0);
  const [exiting, setExiting] = useState(false);

  const advance = useCallback(() => {
    if (screen < SCREENS.length - 1) {
      setExiting(true);
      setTimeout(() => {
        setScreen(s => s + 1);
        setExiting(false);
      }, 300);
    } else {
      // Final screen — complete onboarding
      setExiting(true);
      setTimeout(() => {
        onComplete();
      }, 400);
    }
  }, [screen, onComplete]);

  const current = SCREENS[screen];
  const isLast = screen === SCREENS.length - 1;
  const isWitness = screen === 1;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-8"
      style={{
        background: 'linear-gradient(180deg, #0a0f1e 0%, #0f172a 40%, #111827 100%)',
      }}
    >
      {/* Progress dots */}
      <div className="absolute top-12 flex gap-2">
        {SCREENS.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: i <= screen ? 'rgba(96, 165, 250, 0.8)' : 'rgba(148, 163, 184, 0.2)',
              transform: i === screen ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className={`max-w-sm text-center transition-all duration-300 ${
          exiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Soul line on witness screen */}
        <SoulLine visible={isWitness} />

        {/* River birth on final screen */}
        <RiverBirth visible={isLast} />

        {/* Heading */}
        {current.heading && (
          <h1
            className="ceremony-text text-2xl leading-relaxed mb-6"
            style={{ color: 'rgba(226, 232, 240, 0.95)' }}
          >
            {current.heading}
          </h1>
        )}

        {/* Body */}
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: 'rgba(148, 163, 184, 0.9)' }}
        >
          {current.body}
        </p>

        {/* Sub text */}
        {current.sub && (
          <p
            className="font-serif italic text-sm leading-relaxed mb-2"
            style={{ color: 'rgba(96, 165, 250, 0.7)' }}
          >
            {current.sub}
          </p>
        )}
      </div>

      {/* Button */}
      <button
        onClick={advance}
        className={`mt-12 transition-all duration-300 ${
          exiting ? 'opacity-0' : 'opacity-100'
        } ${
          isLast
            ? 'px-10 py-4 rounded-2xl text-base font-semibold text-white'
            : 'px-8 py-3 rounded-full text-sm font-medium text-slate-300'
        }`}
        style={
          isLast
            ? {
                background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),0.95))',
                boxShadow: '0 4px 24px rgba(var(--accent-rgb),0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
              }
            : {
                background: 'rgba(148, 163, 184, 0.08)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
              }
        }
      >
        {isLast ? 'Begin' : 'Continue'}
      </button>

      {/* Skip */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="mt-4 text-xs transition-colors"
          style={{ color: 'rgba(148, 163, 184, 0.35)' }}
        >
          Skip
        </button>
      )}

      {/* Soul line breathing animation */}
      <style>{`
        @keyframes soul-breathe {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          50% { transform: scaleX(1.03) scaleY(0.97); }
        }
      `}</style>
    </div>
  );
}
