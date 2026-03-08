import { COMMON_SHAPES, NOTES, OPEN_STRINGS, getIntervalColor } from '../data/musicTheory';

function ChordDiagram({ name, frets, rootIdx, barre, showIntervals = false }) {
  const FRETS_SHOWN = 4;
  const playedFrets = frets.filter(f => f > 0);
  const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 0;
  const offset = minFret > 2 ? minFret - 1 : 0;

  return (
    <div className="text-center">
      <p className="text-[10px] font-bold text-text-2 mb-1">{name}</p>
      <svg viewBox="0 0 50 60" className="w-14 mx-auto">
        {/* Nut or position indicator */}
        {offset === 0 ? (
          <rect x="8" y="8" width="34" height="2.5" rx="0.5" fill="currentColor" className="text-text-2" />
        ) : (
          <text x="4" y="18" fontSize="6" fill="#A8A29E" textAnchor="middle" fontWeight="600">{offset + 1}</text>
        )}
        {/* Barre indicator */}
        {barre && barre > offset && (
          <rect
            x="7" y={10 + (barre - offset - 0.5) * 10 - 2.5}
            width="36" height="5" rx="2.5"
            fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"
          />
        )}
        {/* Fret lines */}
        {Array.from({ length: FRETS_SHOWN + 1 }, (_, i) => (
          <line key={i} x1="8" y1={10 + i * 10} x2="42" y2={10 + i * 10} stroke="#57534E" strokeWidth="0.5" />
        ))}
        {/* String lines with gauge variation */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={8 + i * 6.8} y1="10" x2={8 + i * 6.8} y2={10 + FRETS_SHOWN * 10}
            stroke="#57534E" strokeWidth={0.4 + (5 - i) * 0.08} />
        ))}
        {/* Finger positions with interval colors */}
        {frets.map((f, i) => {
          const x = 8 + i * 6.8;
          if (f === -1) return <text key={i} x={x} y="6" fontSize="6" textAnchor="middle" fill="#E8735A">&times;</text>;
          if (f === 0) return <circle key={i} cx={x} cy="6" r="2" fill="none" stroke="#A8A29E" strokeWidth="0.6" />;
          const y = 10 + (f - offset - 0.5) * 10;
          // Determine interval color
          const noteIdx = (OPEN_STRINGS[i] + f) % 12;
          const color = showIntervals && rootIdx != null
            ? getIntervalColor(noteIdx, rootIdx, 'major')
            : '#3B82F6';
          const isRoot = rootIdx != null && noteIdx === rootIdx;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isRoot ? 3.2 : 2.5} fill={color} />
              {isRoot && <circle cx={x} cy={y} r={3.2} fill="none" stroke="white" strokeWidth="0.4" opacity={0.5} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function QuickRefSection() {
  return (
    <div>
      <p className="text-xs text-text-3 mb-3">Common open chord shapes</p>
      <div className="grid grid-cols-4 gap-3">
        {COMMON_SHAPES.map(shape => (
          <ChordDiagram key={shape.name} {...shape} />
        ))}
      </div>
    </div>
  );
}
