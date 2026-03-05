import { useTheme } from '../contexts/ThemeContext';

export default function ProgressRing({ progress, size = 72, strokeWidth = 7 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const offset = circumference * (1 - clampedProgress);
  const { isDark } = useTheme();

  return (
    <svg
      width={size}
      height={size}
      className="block"
      style={{
        '--ring-circumference': circumference,
        '--ring-offset': offset,
      }}
    >
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#2DD4BF' : '#5EEAD4'} />
          <stop offset="100%" stopColor={isDark ? '#5EEAD4' : '#0F766E'} />
        </linearGradient>
      </defs>
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-dry)"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="animate-ring"
        style={{ '--ring-offset': offset }}
      />
    </svg>
  );
}
