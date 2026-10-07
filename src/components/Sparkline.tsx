import React from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
  showGradient?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isPositive,
  width = 120,
  height = 36,
  showGradient = true,
  className = '',
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const innerHeight = height - padding * 2;
  const innerWidth = width - padding * 2;

  // Generate SVG points
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * innerWidth;
    const y = padding + innerHeight - ((val - min) / range) * innerHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const gradientId = `spark-grad-${Math.random().toString(36).substring(2, 9)}`;

  // Colors: TradingView authentic green (#089981 / #26a69a) and red (#f23645 / #ef5350)
  const strokeColor = isPositive ? '#089981' : '#f23645';
  const fillColor = isPositive ? 'rgba(8, 153, 129, 0.16)' : 'rgba(242, 54, 69, 0.16)';

  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={showGradient ? 0.35 : 0} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>

      {showGradient && (
        <path d={areaD} fill={`url(#${gradientId})`} />
      )}

      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
