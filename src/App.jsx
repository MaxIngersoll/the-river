import { useState, useCallback, useRef, useEffect } from 'react';
import { getSessions } from './utils/storage';
import TabBar from './components/TabBar';
import HomePage from './components/HomePage';
import LogPage from './components/LogPage';
import StatsPage from './components/StatsPage';
import SettingsPage from './components/SettingsPage';
import CelebrationOverlay from './components/CelebrationOverlay';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sessions, setSessions] = useState(() => getSessions());
  const [celebrations, setCelebrations] = useState([]);

  // Page transition state
  const [displayedTab, setDisplayedTab] = useState('home');
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const pendingTab = useRef(null);
  const tabChangeRef = useRef(null);

  const refreshSessions = useCallback(() => {
    setSessions(getSessions());
  }, []);

  const handleLog = useCallback(() => {
    refreshSessions();
  }, [refreshSessions]);

  // Smooth tab transition handler — uses ref for recursive calls
  const handleTabChange = useCallback((newTab) => {
    if (newTab === activeTab && transitionPhase === 'idle') return;
    if (transitionPhase !== 'idle') {
      pendingTab.current = newTab;
      return;
    }

    pendingTab.current = null;
    setTransitionPhase('exit');

    setTimeout(() => {
      setActiveTab(newTab);
      setDisplayedTab(newTab);
      setTransitionPhase('enter');

      setTimeout(() => {
        setTransitionPhase('idle');
        if (pendingTab.current && pendingTab.current !== newTab) {
          const next = pendingTab.current;
          pendingTab.current = null;
          tabChangeRef.current?.(next);
        }
      }, 300);
    }, 150);
  }, [activeTab, transitionPhase]);

  // Keep ref in sync for recursive calls
  useEffect(() => {
    tabChangeRef.current = handleTabChange;
  }, [handleTabChange]);

  const handleNavigateHome = useCallback(() => {
    handleTabChange('home');
  }, [handleTabChange]);

  const handleCelebrate = useCallback((milestones) => {
    setCelebrations(milestones);
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebrations((prev) => prev.slice(1));
  }, []);

  const handleDataCleared = useCallback(() => {
    setSessions([]);
    handleTabChange('home');
  }, [handleTabChange]);

  useEffect(() => {
    setDisplayedTab(activeTab);
  }, [activeTab]);

  const pageClass =
    transitionPhase === 'exit'
      ? 'page-exit'
      : transitionPhase === 'enter'
        ? 'page-enter'
        : 'page-idle';

  const showTabBar = displayedTab !== 'settings';

  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className={`page-wrapper ${pageClass}`}>
        {displayedTab === 'home' && (
          <HomePage sessions={sessions} onNavigate={handleTabChange} />
        )}
        {displayedTab === 'log' && (
          <LogPage
            sessions={sessions}
            onLog={handleLog}
            onCelebrate={handleCelebrate}
            onNavigateHome={handleNavigateHome}
          />
        )}
        {displayedTab === 'stats' && <StatsPage sessions={sessions} />}
        {displayedTab === 'settings' && (
          <SettingsPage
            sessions={sessions}
            onBack={() => handleTabChange('home')}
            onDataCleared={handleDataCleared}
          />
        )}
      </div>

      {showTabBar && <TabBar active={activeTab} onChange={handleTabChange} />}

      {celebrations.length > 0 && (
        <CelebrationOverlay
          milestone={celebrations[0]}
          onDismiss={dismissCelebration}
        />
      )}
    </div>
  );
}
