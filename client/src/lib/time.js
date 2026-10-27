const TZ = 'Africa/Johannesburg';

export function formatTime(ms) {
  return new Date(ms).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: TZ,
  });
}

export function formatDate(ms) {
  return new Date(ms).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: TZ,
  });
}

export function formatDuration(ms) {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h === 0 ? `${m}m` : `${h}h ${m}m`;
}

// Works out what is happening right now and what comes next
export function getStatus(outages, now) {
  const list = outages
    .map((o) => ({
      ...o,
      startMs: new Date(o.start).getTime(),
      endMs: new Date(o.end).getTime(),
    }))
    .sort((a, b) => a.startMs - b.startMs);

  const current = list.find((o) => o.startMs <= now && now < o.endMs) || null;
  const next = list.find((o) => o.startMs > now) || null;

  return { list, current, next };
}