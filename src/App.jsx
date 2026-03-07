import { useState, useCallback, useRef, useEffect } from 'react';
import { getSessions, addSession, updateSession, deleteSession, getTotalHours } from './utils/storage';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sessions, setSessions] = useState(() => getSessions());
  const [celebrations, setCelebrations] = useState([]);
  const [pendingReading, setPendingReading] = useState(null);
  const [signalFireNote, setSignalFireNote] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() =>
    sessions.length === 0 && !localStorage.getItem('river-onboarding-complete')
  );

  // Page transition state
  const [displayedTab, setDisplayedTab] = useState('home');
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
    try { navigator.vibrate?.([40, 20, 60]); } catch {}
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

  const handleSessionDelete = useCallback((id) => {
    deleteSession(id);
    refreshSessions();
  }, [refreshSessions]);

  const handleDataCleared = useCallback(() => {
    setSessions([]);
    handleTabChange('home');
  }, [handleTabChange]);

  // Check for Signal Fire on mount
  useEffect(() => {
    const note = getSignalFireNote(sessions);
    if (note) setSignalFireNote(note);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('river-onboarding-complete', 'true');
    localStorage.setItem('river-onboarding-date', new Date().toISOString());
    setShowOnboarding(false);
    handleTabChange('home');
  }, [handleTabChange]);

  return (
    <SeasonProvider sessions={sessions}>
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      <div className="min-h-screen bg-bg pb-16">
        <div className={`page-wrapper ${pageClass}`}>
        {displayedTab === 'home' && (
          <>
            <HomePage
              sessions={sessions}
              onNavigate={handleTabChange}
              onSessionUpdate={handleSessionUpdate}
              onSessionDelete={handleSessionDelete}
              onFogHorn={handleFogHorn}
              signalFireNote={signalFireNote}
              onSignalFireDismiss={handleSignalFireDismiss}
            />
            {sessions.length > 0 && (
              <StatsPage
                sessions={sessions}
                onSessionUpdate={handleSessionUpdate}
                onSessionDelete={handleSessionDelete}
                embedded
              />
            )}
          </>
        )}
        {displayedTab === 'log' && (
          <LogPage
            sessions={sessions}
            onLog={handleLog}
            onCelebrate={handleCelebrate}
            onNavigateHome={handleNavigateHome}
          />
        )}
        {displayedTab === 'tuner' && (
          <div className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
            <h1 className="text-2xl font-bold text-text mb-1">Tuner</h1>
            <p className="text-text-3 text-sm mb-6">Tune up, then play</p>
            <GuitarTuner />
          </div>
        )}
        {displayedTab === 'shed' && (
          <ShedPage sessions={sessions} onNavigate={handleTabChange} />
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
