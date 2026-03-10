import { useState, useRef, useEffect, useCallback } from 'react';
import { renderShareCard, shareCardToBlob } from '../utils/shareRenderer';

function useEscapeKey(callback) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') callback(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [callback]);
}

export default function ShareCard({ sessions, onClose }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sharing | saved | error

  // Render the card on mount
  useEffect(() => {
    if (sessions.length === 0) return;
    const card = renderShareCard(sessions);
    const container = canvasRef.current;
    if (!container) return;

    // Clear and append
    container.innerHTML = '';
    card.style.width = '100%';
    card.style.height = 'auto';
    card.style.borderRadius = '16px';
    container.appendChild(card);
  }, [sessions]);

  const handleShare = useCallback(async () => {
    setStatus('sharing');
    try {
      const blob = await shareCardToBlob(sessions);
      const file = new File([blob], 'my-river.png', { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My River',
          text: 'My guitar practice journey',
        });
        setStatus('idle');
      } else {
        // Fallback: download
        downloadBlob(blob);
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000);
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        setStatus('idle');
      } else {
        // Fallback: download
        const blob = await shareCardToBlob(sessions);
        downloadBlob(blob);
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }
  }, [sessions]);

  const handleDownload = useCallback(async () => {
    const blob = await shareCardToBlob(sessions);
    downloadBlob(blob);
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  }, [sessions]);

  useEscapeKey(onClose);

  if (sessions.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share your river"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-5"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-12 right-5 w-10 h-10 flex items-center justify-center rounded-full text-white/50 hover:text-white/80 transition-colors"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Card preview */}
      <div
        ref={canvasRef}
        className="w-full max-w-[320px] mb-6 rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
      />

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-[320px]">
        <button
          onClick={handleShare}
          disabled={status === 'sharing'}
          className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-full text-sm active:scale-[0.97] transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-deep-rgb),0.95))',
            boxShadow: '0 4px 20px rgba(var(--accent-rgb),0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {status === 'sharing' ? 'Sharing...' : 'Share'}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium text-white/70 active:scale-[0.97] transition-all"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {status === 'saved' ? 'Saved!' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function downloadBlob(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-river.png';
  a.click();
  URL.revokeObjectURL(url);
}
