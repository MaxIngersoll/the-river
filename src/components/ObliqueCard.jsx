import { OBLIQUE_CARDS } from '../data/musicTheory';

export default function ObliqueCard({ dismissed, onDismiss }) {
  // Pick today's oblique card (changes daily, consistent within a day)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const obliqueCard = OBLIQUE_CARDS[dayOfYear % OBLIQUE_CARDS.length];

  if (dismissed) return null;

  return (
    <div
      className="relative mb-4 px-4 py-3.5 rounded-xl border border-water-3/15"
      style={{
        transform: 'rotate(-0.5deg)',
        background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.04), rgba(147,130,220,0.06))',
      }}
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2.5 w-6 h-6 flex items-center justify-center rounded-full text-text-3/50 hover:text-text-3 transition-colors"
        aria-label="Dismiss card"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <p className="text-[9px] uppercase tracking-widest text-text-3/60 font-semibold mb-1.5">
        {obliqueCard.type === 'chord' ? 'Today\u2019s Chord' : 'Today\u2019s Prompt'}
      </p>
      <p className="font-serif italic text-text text-sm leading-relaxed pr-6">
        {obliqueCard.text}
      </p>
    </div>
  );
}
