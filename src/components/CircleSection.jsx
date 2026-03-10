import { FIFTHS_ORDER, MINOR_FIFTHS } from '../data/musicTheory';

function CircleOfFifths({ selectedRoot, onSelect }) {
  const radius = 100;
  const center = 120;
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
      {/* Outer ring labels — major keys */}
      {FIFTHS_ORDER.map((note, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const isSelected = note === selectedRoot;
        return (
          <g key={note} onClick={() => onSelect(note)} className="cursor-pointer">
            <circle cx={x} cy={y} r={isSelected ? 16 : 13} fill={isSelected ? 'rgba(var(--accent-rgb),0.3)' : 'rgba(255,255,255,0.05)'} stroke={isSelected ? 'rgba(var(--accent-rgb),0.6)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={isSelected ? 'var(--accent)' : '#A8A29E'} fontSize="10" fontWeight={isSelected ? '700' : '500'}>
              {note}
            </text>
          </g>
        );
      })}
      {/* Inner ring — relative minor */}
      {MINOR_FIFTHS.map((note, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const innerR = 60;
        const x = center + innerR * Math.cos(angle);
        const y = center + innerR * Math.sin(angle);
        return (
          <g key={`m-${note}`} onClick={() => onSelect(note)} className="cursor-pointer">
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#A78BFA" fontSize="8" fontWeight="500">
              {note}m
            </text>
          </g>
        );
      })}
      {/* Center label */}
      <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fill="#57534E" fontSize="8" fontWeight="600">
        FIFTHS
      </text>
    </svg>
  );
}

export default function CircleSection({ rootNote, onSetRootNote }) {
  return (
    <div>
      <p className="text-xs text-text-3 mb-3">Tap a key to change Root Lock</p>
      <div className="card p-4 mb-4">
        <CircleOfFifths selectedRoot={rootNote} onSelect={onSetRootNote} />
      </div>
      <p className="text-[10px] text-text-3 text-center">
        Outer: major keys &middot; Inner: relative minor &middot; Adjacent keys share 6 of 7 notes
      </p>
    </div>
  );
}
