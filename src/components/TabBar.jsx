const tabs = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'log',
    label: 'Log',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="12" x2="16" y2="14" />
      </svg>
    ),
  },
  {
    id: 'stats',
    label: 'River',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-card-border safe-bottom">
      <div className="flex justify-around items-center h-[72px] max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-20 h-full transition-all duration-200 active:scale-90 ${
                isActive ? 'text-water-5' : 'text-text-3'
              }`}
              aria-label={tab.label}
            >
              {/* Active tab background glow */}
              {isActive && (
                <div
                  className="absolute inset-x-2 inset-y-1 rounded-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(45,212,191,0.10) 0%, transparent 70%)',
                  }}
                />
              )}
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] tracking-wide transition-colors duration-200 ${
                isActive ? 'font-semibold text-water-5' : 'font-medium text-text-3'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
