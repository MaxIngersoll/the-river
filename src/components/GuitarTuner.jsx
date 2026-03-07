import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TUNINGS, TUNING_KEYS, findClosestString, centsOff, changedStrings } from '../utils/tuner';

// ── Pitch Detection Setup ────────────────────────────────
let pitchyModule = null;
async function loadPitchy() {
  if (!pitchyModule) {
    pitchyModule = await import('pitchy');
  }
  return pitchyModule;
}

// ── Constants ────────────────────────────────────────────
const IN_TUNE_THRESHOLD = 3; // cents
const LOCK_DURATION = 1000; // ms to hold in-tune before marking string
const DIAL_SIZE = 240;
const DIAL_CENTER = DIAL_SIZE / 2;
const DIAL_RADIUS = 100;
const MIN_CONFIDENCE = 0.85;

// ── Main Component ───────────────────────────────────────
export default function GuitarTuner() {
  const [tuningKey, setTuningKey] = useState('standard');
  const [listening, setListening] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt'); // prompt | granted | denied
  const [detectedFreq, setDetectedFreq] = useState(null);
  const [detectedNote, setDetectedNote] = useState(null);
  const [cents, setCents] = useState(0);
  const [activeString, setActiveString] = useState(null);
  const [tunedStrings, setTunedStrings] = useState(new Set());
  const [guideMode, setGuideMode] = useState(false);
  const [guideStringIdx, setGuideStringIdx] = useState(0);
  const [allTuned, setAllTuned] = useState(false);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);
  const lockTimerRef = useRef(null);
  const lockStartRef = useRef(null);

  const tuning = TUNINGS[tuningKey];
  const changed = useMemo(() => changedStrings(tuningKey), [tuningKey]);

  // Auto-enable guide mode for non-standard tunings
  useEffect(() => {
    if (tuningKey !== 'standard') {
      setGuideMode(true);
      setGuideStringIdx(0);
    }
  }, [tuningKey]);

  // Reset tuned strings when tuning changes
  useEffect(() => {
    setTunedStrings(new Set());
    setAllTuned(false);
    setGuideStringIdx(0);
  }, [tuningKey]);

  // ── Start Listening ──────────────────────────────────
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionState('granted');

      const { PitchDetector } = await loadPitchy();
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      detectorRef.current = detector;

      setListening(true);

      // Detection loop
      const buffer = new Float32Array(analyser.fftSize);
      const detect = () => {
        analyser.getFloatTimeDomainData(buffer);
        const [pitch, clarity] = detector.findPitch(buffer, audioCtx.sampleRate);

        if (clarity > MIN_CONFIDENCE && pitch > 60 && pitch < 1200) {
          setDetectedFreq(pitch);
        }
        rafRef.current = requestAnimationFrame(detect);
      };
      rafRef.current = requestAnimationFrame(detect);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
      }
    }
  }, []);

  // ── Stop Listening ───────────────────────────────────
  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setListening(false);
    setDetectedFreq(null);
    setDetectedNote(null);
    setCents(0);
    setActiveString(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // ── Process detected frequency ────────────────────────
  useEffect(() => {
    if (!detectedFreq || !listening) return;

    const match = findClosestString(detectedFreq, tuningKey);
    if (!match) return;

    // In guide mode, only accept the current guide string
    if (guideMode) {
      const guideCents = centsOff(detectedFreq, tuning.freqs[guideStringIdx]);
      if (Math.abs(guideCents) < 80) {
        setActiveString(guideStringIdx);
        setDetectedNote(tuning.strings[guideStringIdx]);
        setCents(guideCents);

        // Check lock-in
        if (Math.abs(guideCents) <= IN_TUNE_THRESHOLD) {
          if (!lockStartRef.current) lockStartRef.current = Date.now();
          if (Date.now() - lockStartRef.current >= LOCK_DURATION) {
            setTunedStrings(prev => {
              const next = new Set(prev);
              next.add(guideStringIdx);
              // Auto-advance
              if (guideStringIdx < 5) {
                setGuideStringIdx(guideStringIdx + 1);
              }
              if (next.size === 6) setAllTuned(true);
              return next;
            });
            lockStartRef.current = null;
          }
        } else {
          lockStartRef.current = null;
        }
      }
      return;
    }

    // Quick Tune mode — match any string
    setActiveString(match.stringIndex);
    setDetectedNote(match.note);
    setCents(match.cents);

    // Lock-in detection
    if (match.inTune) {
      if (!lockStartRef.current) lockStartRef.current = Date.now();
      if (Date.now() - lockStartRef.current >= LOCK_DURATION) {
        setTunedStrings(prev => {
          const next = new Set(prev);
          next.add(match.stringIndex);
          if (next.size === 6) setAllTuned(true);
          return next;
        });
        lockStartRef.current = null;
      }
    } else {
      lockStartRef.current = null;
    }
  }, [detectedFreq, listening, tuningKey, guideMode, guideStringIdx, tuning]);

  // ── Play Reference Tone ──────────────────────────────
  const playReferenceTone = useCallback((freq) => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.6);
    setTimeout(() => ctx.close(), 2000);
  }, []);

  // ── Needle angle (cents → degrees, ±50 range → ±90°) ──
  const needleAngle = Math.max(-90, Math.min(90, (cents / 50) * 90));
  const isInTune = Math.abs(cents) <= IN_TUNE_THRESHOLD && detectedFreq;

  // ── Render ─────────────────────────────────────────────

  // Permission prompt
  if (permissionState === 'prompt' && !listening) {
    return (
      <div className="card p-6 mb-4">
        <h3 className="text-sm font-semibold tracking-widest text-text-2 uppercase mb-4">Tuner</h3>
        <div className="text-center py-6">
          <div className="text-4xl mb-4">🎸</div>
          <p className="text-text mb-2 font-medium">The River wants to listen to your guitar.</p>
          <p className="text-text-3 text-sm mb-6">It promises not to judge.</p>
          <button
            onClick={startListening}
            className="px-6 py-3 rounded-2xl font-semibold text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, var(--color-water-3), var(--color-water-5))' }}
          >
            Enable Microphone
          </button>
        </div>
      </div>
    );
  }

  if (permissionState === 'denied') {
    return (
      <div className="card p-6 mb-4">
        <h3 className="text-sm font-semibold tracking-widest text-text-2 uppercase mb-4">Tuner</h3>
        <div className="text-center py-4">
          <p className="text-text-2 text-sm">Microphone access was denied.</p>
          <p className="text-text-3 text-xs mt-1">Check your browser settings to enable it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-widest text-text-2 uppercase">Tuner</h3>
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
            listening
              ? 'bg-red-500/20 text-red-400'
              : 'bg-water-3/20 text-water-5'
          }`}
        >
          {listening ? 'Stop' : 'Start'}
        </button>
      </div>

      {/* Tuning Selector — horizontal pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-hide">
        {TUNING_KEYS.map(key => (
          <button
            key={key}
            onClick={() => setTuningKey(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
              tuningKey === key
                ? 'bg-water-3/30 text-text border border-water-3/40'
                : 'bg-card text-text-3 border border-card-border'
            }`}
          >
            {key === 'standard' && '⭐ '}{TUNINGS[key].short}
          </button>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => { setGuideMode(false); setGuideStringIdx(0); }}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            !guideMode ? 'bg-water-3/20 text-water-5' : 'text-text-3'
          }`}
        >
          Quick Tune
        </button>
        <button
          onClick={() => { setGuideMode(true); setGuideStringIdx(0); }}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            guideMode ? 'bg-water-3/20 text-water-5' : 'text-text-3'
          }`}
        >
          Guide Me
        </button>
      </div>

      {/* Guide Mode: current target */}
      {guideMode && listening && !allTuned && (
        <div className="text-center mb-3">
          <p className="text-text-3 text-xs">Tune string {guideStringIdx + 1}</p>
          <p className="text-text font-bold text-lg">{tuning.strings[guideStringIdx]}</p>
        </div>
      )}

      {/* All Tuned celebration */}
      {allTuned && (
        <div className="text-center py-4 mb-4">
          <p className="text-amber text-lg font-bold mb-1">Tuned up. Go play.</p>
          <p className="text-text-3 text-xs italic" style={{ fontFamily: 'var(--font-serif)' }}>
            Rivers know this: there is no hurry.
          </p>
        </div>
      )}

      {/* Chronograph Dial */}
      {!allTuned && (
        <div className="flex justify-center mb-4">
          <svg width={DIAL_SIZE} height={DIAL_SIZE} viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}>
            {/* Dial face */}
            <circle
              cx={DIAL_CENTER} cy={DIAL_CENTER} r={DIAL_RADIUS}
              fill="var(--color-water-1)"
              stroke="var(--color-card-border)"
              strokeWidth="1.5"
            />

            {/* Cent markers */}
            {Array.from({ length: 21 }, (_, i) => {
              const cent = (i - 10) * 5;
              const angle = (cent / 50) * 90 - 90;
              const rad = (angle * Math.PI) / 180;
              const isMajor = cent % 10 === 0;
              const r1 = DIAL_RADIUS - (isMajor ? 14 : 8);
              const r2 = DIAL_RADIUS - 3;
              return (
                <line
                  key={i}
                  x1={DIAL_CENTER + r1 * Math.cos(rad)}
                  y1={DIAL_CENTER + r1 * Math.sin(rad)}
                  x2={DIAL_CENTER + r2 * Math.cos(rad)}
                  y2={DIAL_CENTER + r2 * Math.sin(rad)}
                  stroke="var(--color-text-3)"
                  strokeWidth={isMajor ? 1.5 : 0.8}
                  opacity={isMajor ? 0.6 : 0.3}
                />
              );
            })}

            {/* In-tune gold arc (±3 cents = ±5.4°) */}
            {(() => {
              const arcAngle = (IN_TUNE_THRESHOLD / 50) * 90;
              const startAngle = (-90 - arcAngle) * Math.PI / 180;
              const endAngle = (-90 + arcAngle) * Math.PI / 180;
              const r = DIAL_RADIUS - 9;
              return (
                <path
                  d={`M ${DIAL_CENTER + r * Math.cos(startAngle)} ${DIAL_CENTER + r * Math.sin(startAngle)} A ${r} ${r} 0 0 1 ${DIAL_CENTER + r * Math.cos(endAngle)} ${DIAL_CENTER + r * Math.sin(endAngle)}`}
                  fill="none"
                  stroke={isInTune ? 'var(--color-amber)' : 'var(--color-amber)'}
                  strokeWidth="3"
                  opacity={isInTune ? 1 : 0.3}
                  strokeLinecap="round"
                />
              );
            })()}

            {/* Flat / Sharp labels */}
            <text x={DIAL_CENTER - 70} y={DIAL_CENTER + 45} fill="var(--color-text-3)" fontSize="10" textAnchor="middle" opacity="0.5">♭</text>
            <text x={DIAL_CENTER + 70} y={DIAL_CENTER + 45} fill="var(--color-text-3)" fontSize="10" textAnchor="middle" opacity="0.5">♯</text>

            {/* Needle */}
            {listening && detectedFreq && (
              <g style={{
                transform: `rotate(${needleAngle}deg)`,
                transformOrigin: `${DIAL_CENTER}px ${DIAL_CENTER}px`,
                transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <line
                  x1={DIAL_CENTER} y1={DIAL_CENTER}
                  x2={DIAL_CENTER} y2={DIAL_CENTER - DIAL_RADIUS + 18}
                  stroke={isInTune ? 'var(--color-amber)' : 'var(--color-text-2)'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx={DIAL_CENTER} cy={DIAL_CENTER}
                  r="4"
                  fill={isInTune ? 'var(--color-amber)' : 'var(--color-text-2)'}
                />
              </g>
            )}

            {/* Center: Note name */}
            <text
              x={DIAL_CENTER} y={DIAL_CENTER + 4}
              fill="var(--color-text)"
              fontSize="36"
              fontWeight="bold"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {listening && detectedNote ? detectedNote.replace(/\d+/, '') : '—'}
            </text>

            {/* Octave */}
            {listening && detectedNote && (
              <text
                x={DIAL_CENTER + 28} y={DIAL_CENTER + 14}
                fill="var(--color-text-3)"
                fontSize="14"
                fontFamily="var(--font-sans)"
                textAnchor="start"
              >
                {detectedNote.match(/\d+/)?.[0] || ''}
              </text>
            )}

            {/* Cents readout */}
            <text
              x={DIAL_CENTER} y={DIAL_CENTER + 30}
              fill={isInTune ? 'var(--color-amber)' : 'var(--color-text-3)'}
              fontSize="12"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
            >
              {listening && detectedFreq
                ? isInTune ? '✓ In Tune' : `${cents > 0 ? '+' : ''}${cents}¢`
                : 'Pluck a string'}
            </text>
          </svg>
        </div>
      )}

      {/* 6-String Status Dots */}
      <div className="flex justify-center gap-3 mb-2">
        {tuning.strings.map((note, i) => {
          const isTuned = tunedStrings.has(i);
          const isActive = activeString === i && listening;
          const isGuideTarget = guideMode && guideStringIdx === i;
          const isChanged = changed.includes(i);
          return (
            <button
              key={i}
              onClick={() => playReferenceTone(tuning.freqs[i])}
              className="flex flex-col items-center gap-1 transition-all active:scale-90"
              title={`Play reference: ${note}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                style={{
                  background: isTuned
                    ? 'var(--color-amber)'
                    : isGuideTarget
                    ? 'var(--color-water-3)'
                    : isActive
                    ? 'var(--color-water-4)'
                    : 'var(--color-card)',
                  color: isTuned
                    ? '#112250'
                    : isActive || isGuideTarget
                    ? '#fff'
                    : 'var(--color-text-3)',
                  border: `1.5px solid ${
                    isTuned ? 'var(--color-amber)' :
                    isGuideTarget ? 'var(--color-water-3)' :
                    isActive ? 'var(--color-water-4)' :
                    'var(--color-card-border)'
                  }`,
                  boxShadow: isTuned ? '0 0 8px rgba(224,197,143,0.4)' : 'none',
                }}
              >
                {i + 1}
              </div>
              <span className={`text-[9px] ${isChanged ? 'text-amber font-semibold' : 'text-text-3'}`}>
                {note.replace(/\d+/, '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hint */}
      {!listening && permissionState === 'granted' && (
        <p className="text-center text-text-3 text-xs mt-3">Tap Start to begin tuning</p>
      )}
      {listening && !detectedFreq && (
        <p className="text-center text-text-3 text-xs mt-3 animate-pulse-glow">Listening...</p>
      )}
    </div>
  );
}
