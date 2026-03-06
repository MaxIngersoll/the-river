export default function SignalFireCard({ note, onDismiss }) {
  return (
    <div
      className="card p-4 mb-6 opacity-0 cursor-pointer"
      style={{ animation: 'fade-in-up 0.5s ease-out 0.3s forwards' }}
      onClick={onDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onDismiss()}
      aria-label="Dismiss signal fire card"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5" aria-hidden="true">
          🔥
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-text font-semibold text-sm leading-snug">
            A signal from the river
          </h3>
          <p className="text-text-3 text-xs leading-relaxed mt-1 font-serif italic">
            {note.text}
          </p>
          <p className="text-text-3 text-[10px] mt-2 text-right">
            Tap to continue
          </p>
        </div>
      </div>
    </div>
  );
}
