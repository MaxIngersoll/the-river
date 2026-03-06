import { useState, useCallback } from 'react';
import { getRandomQuote } from '../utils/quotes';

export default function QuoteCard({ quote: initialQuote, showRefresh = false }) {
  const [quote, setQuote] = useState(initialQuote);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = `"${quote.text}" — ${quote.author}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }, [quote]);

  return (
    <div
      className="card p-5 cursor-pointer select-none"
      onDoubleClick={handleCopy}
      title="Double-click to copy"
    >
      <p className="font-serif italic text-text leading-relaxed text-[15px]">
        &ldquo;{quote.text}&rdquo;
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-text-3 text-xs">
          {copied ? (
            <span className="text-water-4 font-medium animate-fade-in">Copied!</span>
          ) : (
            <>
              {quote.author}
              {quote.source && <span className="text-text-3"> &mdash; {quote.source}</span>}
            </>
          )}
        </p>
        {showRefresh && (
          <button
            onClick={() => setQuote(getRandomQuote())}
            className="text-text-3 hover:text-water-4 transition-colors p-1.5 -mr-1 rounded-full hover:bg-dry/50"
            aria-label="New quote"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
