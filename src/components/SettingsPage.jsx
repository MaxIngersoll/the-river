import { useState } from 'react';
import {
  getSettings,
  updateSettings,
  clearAllData,
  getTotalMinutes,
  formatHours,
  formatDuration,
} from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const GOAL_PRESETS = [60, 120, 180, 300, 420, 600];
const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'Auto', icon: '⚙️' },
];

export default function SettingsPage({ sessions, onBack, onDataCleared }) {
  const [settings, setSettings] = useState(() => getSettings());
  const [customGoal, setCustomGoal] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const totalMinutes = getTotalMinutes(sessions);

  const handleGoalPreset = (mins) => {
    const updated = updateSettings({ weekly_goal_minutes: mins });
    setSettings(updated);
    setCustomGoal('');
    flashSaved();
  };

  const handleCustomGoal = () => {
    const mins = parseInt(customGoal, 10);
    if (mins > 0 && mins <= 1440) {
      const updated = updateSettings({ weekly_goal_minutes: mins });
      setSettings(updated);
      setCustomGoal('');
      flashSaved();
    }
  };

  const handleReset = () => {
    clearAllData();
    setShowResetConfirm(false);
    onDataCleared();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="px-5 pt-12 pb-24 max-w-lg mx-auto animate-fade-in relative z-10">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-dry/60 transition-colors -ml-2"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        {saved && (
          <span className="ml-auto text-water-4 text-sm font-medium animate-fade-in">
            Saved ✓
          </span>
        )}
      </div>

      {/* Appearance — Dark Mode Toggle */}
      <div className="card p-5 mb-4">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-1">
          Appearance
        </h3>
        <p className="text-text-3 text-xs mb-4">
          Choose your theme
        </p>

        <div className="theme-toggle w-full">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`theme-toggle-option flex-1 ${
                theme === opt.value ? 'active' : ''
              }`}
            >
              <span className="mr-1.5">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="card p-5 mb-4">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-1">
          Weekly Goal
        </h3>
        <p className="text-text-3 text-xs mb-4">
          Currently {formatDuration(settings.weekly_goal_minutes)} per week
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {GOAL_PRESETS.map((mins) => (
            <button
              key={mins}
              onClick={() => handleGoalPreset(mins)}
              className={`py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                settings.weekly_goal_minutes === mins
                  ? 'text-white'
                  : 'card text-text-2 active:scale-[0.97]'
              }`}
              style={settings.weekly_goal_minutes === mins ? {
                background: 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(17,94,89,0.95))',
                boxShadow: '0 4px 16px rgba(20,184,166,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              } : undefined}
            >
              {formatDuration(mins)}
            </button>
          ))}
        </div>

        {/* Custom goal input */}
        <div className="flex gap-2">
          <input
            type="number"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Custom (minutes)"
            min="1"
            max="1440"
            className="glass-input flex-1 px-4 py-3 text-sm text-text placeholder-text-3"
          />
          <button
            onClick={handleCustomGoal}
            disabled={!customGoal || parseInt(customGoal, 10) <= 0}
            className="px-5 py-3 rounded-2xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(17,94,89,0.95))',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            Set
          </button>
        </div>
      </div>

      {/* Data summary */}
      <div className="card p-5 mb-4">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3">
          Your Data
        </h3>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-text-2">Total practice</span>
            <span className="text-text font-semibold">{formatHours(totalMinutes)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-2">Sessions logged</span>
            <span className="text-text font-semibold">{sessions.length}</span>
          </div>
          {settings.first_session_date && (
            <div className="flex justify-between text-sm">
              <span className="text-text-2">Tracking since</span>
              <span className="text-text font-semibold">
                {new Date(settings.first_session_date + 'T12:00:00').toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-5 mb-4">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-1">
          Reset
        </h3>
        <p className="text-text-3 text-xs mb-4">
          This permanently deletes all sessions, milestones, and settings.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-2xl text-sm font-semibold text-coral border border-coral/20 bg-coral/5 active:scale-[0.98] transition-all"
          >
            Reset All Data
          </button>
        ) : (
          <div className="space-y-2 animate-fade-in">
            <p className="text-coral text-sm font-medium text-center">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold card text-text-2 active:scale-[0.97] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-coral text-white active:scale-[0.97] transition-all"
              >
                Delete Everything
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="card p-5">
        <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider mb-3">
          About
        </h3>
        <p className="text-text font-semibold text-sm">The River</p>
        <p className="text-text-3 text-xs mt-1">
          A guitar practice tracker that visualizes your journey as a flowing river.
        </p>
        <p className="text-text-3 text-xs mt-2">Version 1.1</p>
      </div>
    </div>
  );
}
