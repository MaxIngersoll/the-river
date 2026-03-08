import { memo, useCallback, useRef } from 'react';

const tabs = [
  {
    id: 'home',
    label: 'River',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'log',
    label: 'Log',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: 'tuner',
    label: 'Tuner',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Tuning fork */}
        <path d="M12 21v-8" />
        <path d="M8 3v7a4 4 0 0 0 8 0V3" />
      </svg>
    ),
  },
  {
    id: 'shed',
    label: 'Ready',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Pier post icon */}
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="6" y1="3" x2="18" y2="3" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <path d="M4 21c2-2 4-2 6 0s4 2 6 0s4-2 6 0" />
      </svg>
    ),
  },
];

export default memo(function TabBar({ active, onChange }) {
  const tabRefs = useRef([]);

  const handleKeyDown = useCallback((e) => {
    const currentIndex = tabs.findIndex((t) => t.id === active);
    let nextIndex;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    onChange(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }, [active, onChange]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-card-border safe-bottom" aria-label="Main navigation">
      <p className="text-center text-text-3 px-4 pt-2 pb-0 select-none pointer-events-none" style={{ fontFamily: 'var(--font-serif)', fontSize: '11px', fontStyle: 'italic', opacity: 0.7, letterSpacing: '0.01em' }}>
        Rivers know this: there is no hurry. We shall get there some day.
      </p>
      <div role="tablist" className="flex justify-around items-center h-[72px] max-w-lg mx-auto" aria-label="App sections">
        {tabs.map((tab, index) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={handleKeyDown}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-20 h-full transition-all duration-200 active:scale-90 ${
                isActive ? 'text-water-5' : 'text-text-3'
              }`}
              aria-label={tab.label}
            >
              {/* Active tab background glow */}
              {isActive && (
                <div
                  className="absolute inset-x-2 inset-y-1 rounded-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 70%)',
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
})
