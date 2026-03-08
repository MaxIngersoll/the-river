import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { getSessions, addSession, updateSession, deleteSession, getTotalHours, today } from './utils/storage';
import { checkNewMilestones } from './utils/milestones';
import { canAddFogDay, addFogDay } from './utils/fogHorn';
import { getUndeliveredBottle, markBottleDelivered } from './utils/bottleMessages';
import { checkAndWriteMarginNotes, shouldTriggerReading, completeReading, getSource, getSignalFireNote } from './utils/source';
import TabBar from './components/TabBar';
import HomePage from './components/HomePage';
import LogPage from './components/LogPage';
import StatsPage from './components/StatsPage';
import SettingsPage from './components/SettingsPage';
import CelebrationOverlay from './components/CelebrationOverlay';
import ReadingCeremony from './components/ReadingCeremony';
import ShedPage from './components/ShedPage';
import GuitarTuner from './components/GuitarTuner';
import TimerFAB from './components/TimerFAB';
import OnboardingFlow from './components/OnboardingFlow';
import { SeasonProvider } from './contexts/SeasonContext';
import { haptics } from './utils/haptics';

export default function App() {
  const [sessions, setSessions] = useState(() => getSessions());
  // Smart routing: practiced today → Home (reflect), not yet → Ready (act)
  const [activeTab, setActiveTab] = useState(() => {
    const initialSessions = getSessions();
    const todayStr = today();
    const practicedToday = initialSessions.some(s => s.date === todayStr && !s.fog);
    return practicedToday ? 'home' : 'shed';
  });
  const [celebrations, setCelebrations] = useState([]);
  const [pendingReading, setPendingReading] = useState(null);
  const [signalFireNote, setSignalFireNote] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() =>
    sessions.length === 0 && !localStorage.getItem('river-onboarding-complete')
  );

  // Page transition state
  const [displayedTab, setDisplayedTab] = useState(() => {
    const initialSessions = getSessions();
    const todayStr = today();
    const practicedToday = initialSessions.some(s => s.date === todayStr && !s.fog);
    return practicedToday ? 'home' : 'shed';
  });
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const pendingTab = useRef(null);
  const tabChangeRef = useRef(null);

  const refreshSessions = useCallback(() => {
    setSessions(getSessions());
  }, []);

  const handleLog = useCallback(() => {
    const updated = getSessions();
    setSessions(updated);
    // Check margin notes
    const totalHours = getTotalHours(updated);
    checkAndWriteMarginNotes(totalHours);
    // Check reading trigger
    const reading = shouldTriggerReading(updated);
    if (reading.should) {
      setPendingReading(reading);
    }
  }, []);

  const handleFogHorn = useCallback(() => {
    const currentSessions = getSessions();
    const { allowed } = canAddFogDay(currentSessions);
    if (!allowed) return;
    haptics.fogHorn();
    addFogDay();
    const updated = getSessions();
    setSessions(updated);
    // Check for bottle delivery
    const bottle = getUndeliveredBottle();
    if (bottle) {
      markBottleDelivered(bottle.id);
      setCelebrations([
        { type: 'fog', id: 'fog-rest' },
        { type: 'fog-bottle', id: 'fog-bottle', message: bottle.text },
      ]);
    } else {
      setCelebrations([{ type: 'fog', id: 'fog-rest' }]);
    }
  }, []);

  const handleReadingComplete = useCallback(() => {
    if (pendingReading) {
      completeReading(pendingReading.tier);
      setPendingReading(null);
    }
  }, [pendingReading]);

  const handleSignalFireDismiss = useCallback(() => {
    setSignalFireNote(null);
  }, []);

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

  const handleTimerSave = useCallback(({ duration_minutes, note, tags }) => {
    addSession({
      date: new Date().toISOString().slice(0, 10),
      duration_minutes,
      note,
      tags,
    });
    const updated = getSessions();
    setSessions(updated);
    const newMilestones = checkNewMilestones(updated);
    if (newMilestones.length > 0) setCelebrations(newMilestones);
    // Source: margin notes + reading check
    const totalHours = getTotalHours(updated);
    checkAndWriteMarginNotes(totalHours);
    const reading = shouldTriggerReading(updated);
    if (reading.should) setPendingReading(reading);
    handleTabChange('home');
  }, [handleTabChange]);

  const handleSessionUpdate = useCallback((id, updates) => {
    updateSession(id, updates);
    refreshSessions();
  }, [refreshSessions]);

  // Undo toast: soft-delete with 10s timeout
  const [pendingDelete, setPendingDelete] = useState(null);
  const deleteTimerRef = useRef(null);

  const handleSessionDelete = useCallback((id) => {
    // Find the session data before hiding it
    const session = sessions.find(s => s.id === id);
    if (!session) return;

    // Clear any existing pending delete (commit it immediately)
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    if (pendingDelete) {
      deleteSession(pendingDelete.id);
      refreshSessions();
    }

    // Soft-delete: store session and start countdown
    setPendingDelete({ id, session, startedAt: Date.now() });
    deleteTimerRef.current = setTimeout(() => {
      deleteSession(id);
      refreshSessions();
      setPendingDelete(null);
      deleteTimerRef.current = null;
    }, 10000);
  }, [sessions, pendingDelete, refreshSessions]);

  const handleUndoDelete = useCallback(() => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    setPendingDelete(null);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, []);

  // Filter out the pending-delete session from what children see
  const visibleSessions = useMemo(() => {
    if (!pendingDelete) return sessions;
    return sessions.filter(s => s.id !== pendingDelete.id);
  }, [sessions, pendingDelete]);

  const handleDataCleared = useCallback(() => {
    setSessions([]);
    handleTabChange('home');
  }, [handleTabChange]);

  // Check for Signal Fire on mount
  useEffect(() => {
    const note = getSignalFireNote(sessions);
    if (note) setSignalFireNote(note);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cooling Glass — warmth tracks presence
  useEffect(() => {
    const lastVisit = localStorage.getItem('river-last-visit');
    const now = Date.now();
    let warmth = 1.0;

    if (lastVisit) {
      const hoursSince = (now - parseInt(lastVisit, 10)) / (1000 * 60 * 60);
      if (hoursSince > 7 * 24) warmth = 0.2;        // 7+ days → cold
      else if (hoursSince > 24) warmth = 0.4;        // 1-7 days → cooled
      else if (hoursSince > 1) warmth = 0.7;         // 1-24 hours → slightly cooled
      else warmth = 1.0;                              // 0-1 hours → full warmth
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.style.setProperty('--glass-warmth', warmth);
    document.documentElement.style.setProperty('--glass-warmth-instant', prefersReduced ? '1' : '0');

    localStorage.setItem('river-last-visit', now.toString());
  }, []);

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

  // Ando's Breath — opening pause
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArrived(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('river-onboarding-complete', 'true');
    localStorage.setItem('river-onboarding-date', new Date().toISOString());
    setShowOnboarding(false);
    handleTabChange('home');
  }, [handleTabChange]);

  return (
    <SeasonProvider sessions={sessions}>
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      <div className={`min-h-screen bg-bg pb-16 app-breath ${arrived ? 'arrived' : ''}`}>
        <div className={`page-wrapper ${pageClass}`}>
        {displayedTab === 'home' && (
          <div role="tabpanel" id="tabpanel-home" aria-labelledby="tab-home">
            <HomePage
              sessions={visibleSessions}
              onNavigate={handleTabChange}
              onSessionUpdate={handleSessionUpdate}
              onSessionDelete={handleSessionDelete}
              onFogHorn={handleFogHorn}
              signalFireNote={signalFireNote}
              onSignalFireDismiss={handleSignalFireDismiss}
            />
            {visibleSessions.length > 0 && (
              <StatsPage
                sessions={visibleSessions}
                onSessionUpdate={handleSessionUpdate}
                onSessionDelete={handleSessionDelete}
                embedded
              />
            )}
          </div>
        )}
        {displayedTab === 'log' && (
          <div role="tabpanel" id="tabpanel-log" aria-labelledby="tab-log">
            <LogPage
              sessions={visibleSessions}
              onLog={handleLog}
              onCelebrate={handleCelebrate}
              onNavigateHome={handleNavigateHome}
            />
          </div>
        )}
        {displayedTab === 'tuner' && (
          <div role="tabpanel" id="tabpanel-tuner" aria-labelledby="tab-tuner" className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
            <h1 className="text-2xl font-bold text-text mb-1">Tuner</h1>
            <p className="text-text-3 text-sm mb-6">Tune up, then play</p>
            <GuitarTuner />
          </div>
        )}
        {displayedTab === 'shed' && (
          <div role="tabpanel" id="tabpanel-shed" aria-labelledby="tab-shed">
            <ShedPage sessions={visibleSessions} onNavigate={handleTabChange} />
          </div>
        )}
          {displayedTab === 'settings' && (
            <SettingsPage
              sessions={sessions}
              onBack={() => handleTabChange('home')}
              onDataCleared={handleDataCleared}
            />
          )}
        </div>

        {showTabBar && <TabBar active={activeTab} onChange={handleTabChange} />}

        <TimerFAB onSaveSession={handleTimerSave} showTabBar={showTabBar} />

        {/* Undo delete toast */}
        {pendingDelete && (
          <UndoToast onUndo={handleUndoDelete} />
        )}

        {celebrations.length > 0 && (
          <CelebrationOverlay
            milestone={celebrations[0]}
            onDismiss={dismissCelebration}
            queuePosition={1}
            queueTotal={celebrations.length}
          />
        )}

        {pendingReading && celebrations.length === 0 && (
          <ReadingCeremony
            reading={pendingReading}
            answer={getSource().answer}
            onComplete={handleReadingComplete}
          />
        )}
      </div>
    </SeasonProvider>
  );
}

// ─── Undo Delete Toast ───

function UndoToast({ onUndo }) {
  const [dismissing, setDismissing] = useState(false);

  const handleUndo = useCallback(() => {
    setDismissing(true);
    setTimeout(() => onUndo(), 200);
  }, [onUndo]);

  return (
    <div
      className={`fixed bottom-24 z-50 ${
        dismissing ? 'animate-toast-out' : 'animate-toast-in'
      }`}
      style={{ left: '50%' }}
    >
      <div
        className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/20 overflow-hidden"
        style={{
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          background: 'rgba(255, 255, 255, 0.10)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <span className="text-text text-sm font-medium whitespace-nowrap">
          Session deleted
        </span>
        <button
          onClick={handleUndo}
          className="text-sm font-bold whitespace-nowrap active:scale-[0.95] transition-transform"
          style={{ color: 'var(--color-water-5, #3b82f6)' }}
        >
          Undo
        </button>
      </div>
      {/* Countdown progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden rounded-b-2xl">
        <div
          className="h-full rounded-full animate-toast-countdown"
          style={{
            background: 'var(--color-water-4, #60a5fa)',
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}
