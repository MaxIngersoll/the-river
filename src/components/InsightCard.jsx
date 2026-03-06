import { memo, useEffect, useMemo } from 'react';
import { getTopInsight, markInsightShown } from '../utils/insights';

export default memo(function InsightCard({ sessions }) {
  const insight = useMemo(() => getTopInsight(sessions), [sessions]);

  // Persist which insight was shown — outside of render
  useEffect(() => {
    if (insight) markInsightShown(insight.type);
  }, [insight]);

  if (!insight) return null;

  return (
    <div
      className="card p-4 mb-6 opacity-0"
      style={{ animation: 'fade-in-up 0.5s ease-out 0.3s forwards' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5" aria-hidden="true">
          {insight.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-text font-semibold text-sm leading-snug">
            {insight.headline}
          </h3>
          <p className="text-text-3 text-xs leading-relaxed mt-1">
            {insight.body}
          </p>
        </div>
      </div>
    </div>
  );
})
