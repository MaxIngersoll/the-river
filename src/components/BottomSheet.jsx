import { useEffect, useRef, useCallback, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Reusable bottom sheet primitive — gesture-dismissible, spring-animated, backdrop-blurred.
 * Used by Quick Log, Mood Picker, and Ready Page redesign.
 */
export default function BottomSheet({ open, onClose, children, title }) {
  const sheetRef = useRef(null);
  const dragState = useRef({ startY: 0, currentY: 0, dragging: false });
  const [translateY, setTranslateY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Animate in: start offscreen, then slide to 0
  useEffect(() => {
    if (open) {
      // Start offscreen
      setMounted(false);
      setTranslateY(0);
      // Trigger slide-in on next frame
      requestAnimationFrame(() => setMounted(true));
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  // Escape key to dismiss
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Touch/drag gesture to dismiss
  const handleTouchStart = useCallback((e) => {
    dragState.current = { startY: e.touches[0].clientY, currentY: 0, dragging: true };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!dragState.current.dragging) return;
    const delta = e.touches[0].clientY - dragState.current.startY;
    const clamped = Math.max(0, delta);
    dragState.current.currentY = clamped;
    setTranslateY(clamped);
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragState.current.dragging = false;
    if (dragState.current.currentY > 100) {
      onClose();
    }
    setTranslateY(0);
  }, [onClose]);

  if (!open) return null;

  const duration = prefersReducedMotion ? '0ms' : '300ms';
  // When not mounted yet, sheet is offscreen (100%); when mounted, at drag offset
  const yOffset = mounted ? translateY : window.innerHeight;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: mounted ? 1 : 0,
          transition: `opacity ${duration} ease-out`,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Bottom sheet'}
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl"
        style={{
          background: 'var(--color-card-bg)',
          borderTop: '1px solid var(--color-card-border)',
          boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.15)',
          transform: `translateY(${yOffset}px)`,
          willChange: 'transform',
          transition: dragState.current.dragging ? 'none' : `transform ${duration} var(--ease-ripple, cubic-bezier(0.22, 1, 0.36, 1))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-text-3/30" />
        </div>

        {/* Title */}
        {title && (
          <h2 className="text-text text-lg font-semibold text-center px-6 pb-3">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="px-6 pb-8 safe-bottom">
          {children}
        </div>
      </div>
    </>
  );
}
