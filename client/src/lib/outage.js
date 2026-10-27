export function nextOutageHours(fallback = 2.5) {
  try {
    const area = JSON.parse(localStorage.getItem('pp.area'));
    const schedule = JSON.parse(localStorage.getItem(`pp.schedule.${area.id}`));
    const now = Date.now();

    const upcoming = (schedule.outages || [])
      .map((o) => ({ start: new Date(o.start).getTime(), end: new Date(o.end).getTime() }))
      .filter((o) => o.end > now)
      .sort((a, b) => a.start - b.start);

    if (upcoming[0]) return (upcoming[0].end - upcoming[0].start) / 3600000;
  } catch {
    // no saved schedule yet
  }
  return fallback;
}