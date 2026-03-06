import { memo, useId } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default memo(function ProgressRing({ progress, size = 72, strokeWidth = 7 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const offset = circumference * (1 - clampedProgress);
  const { isDark } = useTheme();
  const gradId = useId();

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
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#60A5FA' : '#3B82F6'} />
          <stop offset="100%" stopColor={isDark ? '#93C5FD' : '#1E40AF'} />
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
        stroke={`url(#${gradId})`}
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
})
