import { useState, useCallback, useMemo } from 'react';
import {
  getData,
  setData,
  getSettings,
  updateSettings,
  clearAllData,
  getTotalMinutes,
  formatHours,
  formatDuration,
  isValidSession,
  exportRiverData,
  previewImport,
  mergeImport,
} from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const GOAL_PRESETS = [60, 120, 180, 300, 420, 600];
const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'warm', label: 'Sapphire', icon: '💎' },
  { value: 'system', label: 'Auto', icon: '⚙️' },
];

export default function SettingsPage({ sessions, onBack, onDataCleared }) {
  const storageEstimate = useMemo(() => {
    try {
      const data = getData();
      const bytes = new Blob([JSON.stringify(data)]).size;
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      return null;
    }
  }, [sessions]);

  const [settings, setSettings] = useState(() => getSettings());
  const [customGoal, setCustomGoal] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const [importStatus, setImportStatus] = useState(null); // null | 'success' | 'error' | 'preview'
  const [importPreview, setImportPreview] = useState(null);
  const totalMinutes = getTotalMinutes(sessions);
  const lastExport = useMemo(() => {
    try { return localStorage.getItem('river-last-export'); } catch { return null; }
  }, []);

  const handleExport = useCallback(() => {
    const data = exportRiverData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-river-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    try { localStorage.setItem('river-last-export', new Date().toISOString().slice(0, 10)); } catch {}
  }, []);

  const handleImportSelect = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          const preview = previewImport(data);
          if (!preview.valid) {
            setImportStatus('error');
            setTimeout(() => setImportStatus(null), 2500);
            return;
          }
          setImportPreview(preview);
          setImportStatus('preview');
        } catch {
          setImportStatus('error');
          setTimeout(() => setImportStatus(null), 2500);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleMergeConfirm = useCallback(() => {
    if (!importPreview || !importPreview.newSessions) return;
    mergeImport(importPreview.newSessions);
    setImportPreview(null);
    setImportStatus('success');
    setTimeout(() => {
      setImportStatus(null);
      window.location.reload();
    }, 1500);
  }, [importPreview]);

  const handleMergeCancel = useCallback(() => {
    setImportPreview(null);
    setImportStatus(null);
  }, []);

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
                background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                boxShadow: '0 4px 16px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
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
              background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
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
          <div className="flex justify-between text-sm">
            <span className="text-text-2">Storage used</span>
            <span className="text-text font-semibold">{storageEstimate || '—'}</span>
          </div>
        </div>
      </div>

      {/* Export / Import — The River Archive */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-text-2 text-xs font-medium uppercase tracking-wider">
            The River Archive
          </h3>
          {lastExport && (
            <span className="w-2 h-2 rounded-full bg-green-500/60" title={`Last exported: ${lastExport}`} />
          )}
          {!lastExport && sessions.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500/60" title="Never exported — back up your river!" />
          )}
        </div>
        <p className="text-text-3 text-xs mb-4">
          Download your river or restore from a backup.
          {lastExport && <span className="text-text-3/50"> Last backup: {lastExport}</span>}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold card text-text-2 active:scale-[0.97] transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Your River
          </button>
          <button
            onClick={handleImportSelect}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold card text-text-2 active:scale-[0.97] transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Restore
          </button>
        </div>

        {/* Import preview — merge confirmation */}
        {importStatus === 'preview' && importPreview && (
          <div className="mt-4 p-4 rounded-xl animate-fade-in" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
            <p className="text-text text-sm font-medium mb-2">Import Preview</p>
            <div className="space-y-1 mb-3">
              <p className="text-text-2 text-xs">
                {importPreview.newSessions.length} new session{importPreview.newSessions.length !== 1 ? 's' : ''}{' '}
                ({formatDuration(importPreview.totalNewMinutes)} of practice)
              </p>
              {importPreview.duplicateCount > 0 && (
                <p className="text-text-3 text-xs">{importPreview.duplicateCount} duplicate{importPreview.duplicateCount !== 1 ? 's' : ''} skipped</p>
              )}
              {importPreview.droppedCount > 0 && (
                <p className="text-text-3 text-xs">{importPreview.droppedCount} invalid session{importPreview.droppedCount !== 1 ? 's' : ''} dropped</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMergeCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold card text-text-2 active:scale-[0.97] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleMergeConfirm}
                disabled={importPreview.newSessions.length === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-[0.97] transition-all disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                {importPreview.newSessions.length > 0 ? 'Merge Rivers' : 'Nothing New'}
              </button>
            </div>
          </div>
        )}

        {importStatus === 'success' && (
          <p className="text-water-4 text-xs font-medium text-center mt-3 animate-fade-in">
            Your rivers are one now. Reloading...
          </p>
        )}
        {importStatus === 'error' && (
          <p className="text-coral text-xs font-medium text-center mt-3 animate-fade-in">
            Invalid backup file. Please try a .json file exported from The River.
          </p>
        )}
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
        {sessions.length > 0 && (
          <p className="font-serif italic text-text-2 text-xs mt-3 leading-relaxed">
            {totalMinutes < 60
              ? 'A single drop falls — \nthe riverbed waits, patient — \nbeginnings are here.'
              : totalMinutes < 600
                ? `${Math.round(totalMinutes / 60)} hours have gathered — \nthe current whispers forward — \nkeep going, keep going.`
                : `${Math.round(totalMinutes / 60)} hours deep now — \n${sessions.length} sessions shape the banks — \nthe river is you.`
            }
          </p>
        )}
        <p className="text-text-3 text-xs mt-2">Version 2.0</p>
      </div>
    </div>
  );
}
