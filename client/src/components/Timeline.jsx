import { formatTime, formatDuration } from '../lib/time';

const HOUR = 3600 * 1000;
const ROWS = 8;
const ROW_H = 52;
const OFFSET = 8; // centres each hour line on its label

function yPos(ms, windowStart) {
  return ((ms - windowStart) / HOUR) * ROW_H + OFFSET;
}

export default function Timeline({ outages, now, featured }) {
  const windowStart = Math.floor(now / HOUR) * HOUR;
  const windowEnd = windowStart + ROWS * HOUR;

  const visible = outages.filter((o) => o.endMs > windowStart && o.startMs < windowEnd);

  const nowTop = yPos(now, windowStart) - OFFSET;

  // Gaps between outages that are both on screen
  const gaps = [];
  for (let i = 0; i < visible.length - 1; i += 1) {
    const from = visible[i].endMs;
    const to = visible[i + 1].startMs;
    if (to > from) gaps.push({ from, to });
  }

  return (
    <>
      <div className="timeline-head">
        <span className="timeline-title">Next 8 hours</span>
        <span className="timeline-range">
          {formatTime(windowStart)} – {formatTime(windowEnd)}
        </span>
      </div>

      <div className="timeline" style={{ height: ROWS * ROW_H + OFFSET }}>
        {Array.from({ length: ROWS }, (_, i) => {
          const t = windowStart + i * HOUR;
          const hideLabel = Math.abs(i * ROW_H - nowTop) < 18;
          return (
            <div key={t}>
              {!hideLabel && (
                <span className="tl-hour" style={{ top: i * ROW_H }}>
                  {formatTime(t)}
                </span>
              )}
              <span className="tl-line" style={{ top: i * ROW_H + OFFSET }} />
            </div>
          );
        })}

        {gaps.map((g) => {
          const top = yPos(g.from, windowStart);
          const height = yPos(Math.min(g.to, windowEnd), windowStart) - top;
          if (height < 36) return null;
          return (
            <div key={g.from} className="tl-gap" style={{ top: top + height / 2 - 10 }}>
              <span>Power on · {formatDuration(g.to - g.from)}</span>
            </div>
          );
        })}

        {visible.map((o) => {
          const top = yPos(Math.max(o.startMs, windowStart), windowStart);
          const height = yPos(Math.min(o.endMs, windowEnd), windowStart) - top;
          const isFeatured = featured && o.startMs === featured.startMs;
          const isNow = isFeatured && o.startMs <= now && now < o.endMs;
          const cls = isFeatured ? `tl-block featured${isNow ? ' now' : ''}` : 'tl-block later';

          return (
            <div key={o.start} className={cls} style={{ top, height }}>
              {height >= 64 && (
                <span className="block-label">{isNow ? 'Power off now' : 'Power off'}</span>
              )}
              <span className="block-time">
                {formatTime(o.startMs)} – {formatTime(o.endMs)}
              </span>
              {height >= 100 && (
                <span className="block-meta">
                  Stage {o.stage} · {formatDuration(o.endMs - o.startMs)}
                </span>
              )}
            </div>
          );
        })}

        {visible.length === 0 && <p className="tl-empty">No outages in this window.</p>}

        <span className="tl-now-label" style={{ top: nowTop }}>NOW</span>
        <span className="tl-now-line" style={{ top: nowTop + OFFSET - 1 }} />
        <span className="tl-now-dot" style={{ top: nowTop + OFFSET - 5 }} />
      </div>
    </>
  );
}