import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as audio from '../utils/audio';

const PREFS_KEY = 'river-sound-prefs';

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Storage full or unavailable
  }
}

const DEFAULT_PREFS = {
  metronomeEnabled: false,
  bpm: 80,
  rainEnabled: false,
  rainVolume: 0.3,
  masterVolume: 0.8,
};

export default function SoundscapePanel({ timerState }) {
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState(() => loadPrefs() || DEFAULT_PREFS);
  const prevTimerState = useRef(timerState);

  // Sync audioReady with actual engine state on mount (survives collapse/expand)
  const [audioReady, setAudioReady] = useState(() => {
    const metState = audio.getMetronomeState();
    const rainState = audio.getRainState();
    return metState.running || rainState.running;
  });

  // Persist preferences whenever they change
  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  // Handle timer state transitions
  useEffect(() => {
    const prev = prevTimerState.current;
    prevTimerState.current = timerState;

    if (!audioReady) return;

    // Timer just started
    if (timerState === 'running' && prev === 'idle') {
      if (prefs.metronomeEnabled) {
        audio.startMetronome(prefs.bpm);
      }
      if (prefs.rainEnabled) {
        audio.startRain(prefs.rainVolume);
      }
      return;
    }

    // Timer resumed
    if (timerState === 'running' && prev === 'paused') {
      audio.resumeAudio();
      return;
    }

    // Timer paused
    if (timerState === 'paused' && prev === 'running') {
      audio.suspendAudio();
      return;
    }

    // Timer stopped or went idle
    if (timerState === 'stopped' || (timerState === 'idle' && prev !== 'idle')) {
      audio.stopAll();
    }
  }, [timerState, audioReady, prefs.metronomeEnabled, prefs.rainEnabled, prefs.bpm, prefs.rainVolume]);

  const handleFirstInteraction = useCallback(() => {
    if (!audioReady) {
      audio.initAudio();
      audio.setMasterVolume(prefs.masterVolume);
      setAudioReady(true);
    }
  }, [audioReady, prefs.masterVolume]);

  const toggleMetronome = useCallback(() => {
    handleFirstInteraction();

    setPrefs((prev) => {
      const next = { ...prev, metronomeEnabled: !prev.metronomeEnabled };
      if (next.metronomeEnabled && timerState === 'running') {
        audio.startMetronome(next.bpm);
      } else if (!next.metronomeEnabled) {
        audio.stopMetronome();
      }
      return next;
    });
  }, [handleFirstInteraction, timerState]);

  const adjustBPM = useCallback((delta) => {
    handleFirstInteraction();

    setPrefs((prev) => {
      const newBPM = Math.min(208, Math.max(40, Math.round(prev.bpm + delta)));
      audio.setBPM(newBPM);
      return { ...prev, bpm: newBPM };
    });
  }, [handleFirstInteraction]);

  const toggleRain = useCallback(() => {
    handleFirstInteraction();

    setPrefs((prev) => {
      const next = { ...prev, rainEnabled: !prev.rainEnabled };
      if (next.rainEnabled && timerState === 'running') {
        audio.startRain(next.rainVolume);
      } else if (!next.rainEnabled) {
        audio.stopRain();
      }
      return next;
    });
  }, [handleFirstInteraction, timerState]);

  // Tap tempo: average interval of last 4 taps
  const tapTimesRef = useRef([]);
  const handleTapTempo = useCallback(() => {
    handleFirstInteraction();
    const now = Date.now();
    const taps = tapTimesRef.current;
    // Reset if last tap was >2 seconds ago
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      tapTimesRef.current = [];
    }
    taps.push(now);
    // Keep last 5 taps (4 intervals)
    if (taps.length > 5) taps.shift();
    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgMs);
      const clamped = Math.min(208, Math.max(40, bpm));
      audio.setBPM(clamped);
      setPrefs(prev => ({ ...prev, bpm: clamped }));
    }
  }, [handleFirstInteraction]);

  const handleRainVolume = useCallback((e) => {
    handleFirstInteraction();
    const vol = parseFloat(e.target.value);
    audio.setRainVolume(vol);
    setPrefs((prev) => ({ ...prev, rainVolume: vol }));
  }, [handleFirstInteraction]);

  const handleMasterVolume = useCallback((e) => {
    handleFirstInteraction();
    const vol = parseFloat(e.target.value);
    audio.setMasterVolume(vol);
    setPrefs((prev) => ({ ...prev, masterVolume: vol }));
  }, [handleFirstInteraction]);

  return (
    <div className="mb-4">
      {/* Header pill — toggle expand */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors"
        style={{
          background: expanded
            ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(30,64,175,0.1))'
            : 'rgba(128,128,128,0.08)',
        }}
      >
        {/* Sound wave icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={expanded ? 'text-water-4' : 'text-text-3'}
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <span className={`text-xs font-medium uppercase tracking-wider ${expanded ? 'text-water-4' : 'text-text-3'}`}>
          Sounds
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-text-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div
          className="card p-4 mt-2 space-y-4 animate-fade-in-up"
          onClick={handleFirstInteraction}
        >
          {/* Metronome row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Toggle pill */}
              <button
                onClick={toggleMetronome}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                style={
                  prefs.metronomeEnabled
                    ? {
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                      }
                    : {
                        background: 'rgba(128,128,128,0.1)',
                        color: 'var(--color-text-3)',
                      }
                }
              >
                Metronome
              </button>
            </div>

            {/* BPM controls — tap for ±1, long label area for ±5 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustBPM(-5)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-3 hover:text-text-2 transition-colors text-[10px] font-bold"
                style={{ background: 'rgba(128,128,128,0.1)' }}
                aria-label="Decrease BPM by 5"
              >
                -5
              </button>
              <button
                onClick={() => adjustBPM(-1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-3 hover:text-text-2 transition-colors"
                style={{ background: 'rgba(128,128,128,0.1)' }}
                aria-label="Decrease BPM by 1"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span
                className="text-text-2 text-sm font-bold w-10 text-center"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {prefs.bpm}
              </span>
              <button
                onClick={() => adjustBPM(1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-3 hover:text-text-2 transition-colors"
                style={{ background: 'rgba(128,128,128,0.1)' }}
                aria-label="Increase BPM by 1"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button
                onClick={() => adjustBPM(5)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-3 hover:text-text-2 transition-colors text-[10px] font-bold"
                style={{ background: 'rgba(128,128,128,0.1)' }}
                aria-label="Increase BPM by 5"
              >
                +5
              </button>
              <button
                onClick={handleTapTempo}
                className="ml-1 px-2 h-8 rounded-full flex items-center justify-center text-text-3 hover:text-text-2 transition-colors text-[10px] font-semibold uppercase tracking-wide active:scale-90"
                style={{ background: 'rgba(128,128,128,0.1)' }}
                aria-label="Tap to set tempo"
              >
                Tap
              </button>
            </div>
          </div>

          {/* Rain row */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleRain}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={
                prefs.rainEnabled
                  ? {
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                    }
                  : {
                      background: 'rgba(128,128,128,0.1)',
                      color: 'var(--color-text-3)',
                    }
              }
            >
              Rain
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={prefs.rainVolume}
              onChange={handleRainVolume}
              className="glass-input w-28 h-1 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgba(59,130,246,0.6) ${prefs.rainVolume * 100}%, rgba(128,128,128,0.15) ${prefs.rainVolume * 100}%)`,
              }}
              aria-label="Rain volume"
            />
          </div>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: 'rgba(128,128,128,0.1)' }} />

          {/* Master volume */}
          <div className="flex items-center gap-3">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-3 flex-shrink-0"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={prefs.masterVolume}
              onChange={handleMasterVolume}
              className="glass-input flex-1 h-1 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgba(59,130,246,0.6) ${prefs.masterVolume * 100}%, rgba(128,128,128,0.15) ${prefs.masterVolume * 100}%)`,
              }}
              aria-label="Master volume"
            />
            <span className="text-text-3 text-[10px] font-medium w-8 text-right">
              {Math.round(prefs.masterVolume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
