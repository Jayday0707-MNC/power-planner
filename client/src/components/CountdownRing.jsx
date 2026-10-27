import { useEffect, useState } from 'react';

const R = 64;
const C = 2 * Math.PI * R;

export default function CountdownRing({ value, caption, progress, color }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(progress));
    return () => cancelAnimationFrame(id);
  }, [progress]);

  const filled = Math.max(0, Math.min(1, shown)) * C;

  return (
    <svg width="148" height="148" viewBox="0 0 148 148" role="img" aria-label={`${value} ${caption}`}>
      <circle className="ring-track" cx="74" cy="74" r={R} />
      <circle
        className="ring-progress"
        cx="74"
        cy="74"
        r={R}
        style={{
          stroke: color,
          strokeDasharray: `${filled} ${C}`,
          filter: `drop-shadow(0 0 6px ${color})`,
        }}
        transform="rotate(-90 74 74)"
      />
      <text className="ring-value" x="74" y="76" textAnchor="middle">{value}</text>
      <text className="ring-caption" x="74" y="98" textAnchor="middle">{caption}</text>
    </svg>
  );
}