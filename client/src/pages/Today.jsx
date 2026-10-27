import { useEffect, useState } from 'react';
import { api } from '../api';
import useLocalStorage from '../hooks/useLocalStorage';
import useNow from '../hooks/useNow';
import AreaPicker from '../components/AreaPicker';
import CountdownRing from '../components/CountdownRing';
import { formatTime, formatDate, formatDuration, getStatus } from '../lib/time';
import Timeline from '../components/Timeline';

const SIX_HOURS = 6 * 3600 * 1000;

export default function Today() {
  const [area, setArea] = useLocalStorage('pp.area', null);
  const [schedule, setSchedule] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | offline | error
  const now = useNow();

  useEffect(() => {
    if (!area) return;
    const key = `pp.schedule.${area.id}`;
    let cancelled = false;

    setSchedule(null);
    setStatus('loading');

    api(`/api/areas/${area.id}/schedule`)
      .then((data) => {
        if (cancelled) return;
        setSchedule(data);
        setStatus('ready');
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch {
          // ignore storage errors
        }
      })
      .catch(() => {
        if (cancelled) return;
        try {
          const saved = JSON.parse(localStorage.getItem(key));
          if (saved) {
            setSchedule(saved);
            setStatus('offline');
            return;
          }
        } catch {
          // fall through to error
        }
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [area]);

  if (!area) return <AreaPicker onPick={setArea} />;

   const { list, current, next } = getStatus(schedule?.outages ?? [], now);

  let hero;
  if (current) {
    hero = {
      value: formatDuration(current.endMs - now),
      caption: 'back on',
      progress: (now - current.startMs) / (current.endMs - current.startMs),
      color: 'var(--warn)',
      label: 'Power is off',
      time: `Back at ${formatTime(current.endMs)}`,
      sub: `Stage ${current.stage}`,
    };
  } else if (next) {
    const wait = next.startMs - now;
    hero = {
      value: formatDuration(wait),
      caption: 'to go',
      progress: 1 - wait / SIX_HOURS,
      color: 'var(--accent)',
      label: 'Next outage',
      time: `${formatTime(next.startMs)} – ${formatTime(next.endMs)}`,
      sub: `Stage ${next.stage} · ${formatDuration(next.endMs - next.startMs)}`,
    };
  } else {
    hero = {
      value: '–',
      caption: 'no outages',
      progress: 1,
      color: 'var(--ok)',
      label: 'Next outage',
      time: 'None scheduled',
      sub: 'Enjoy the power',
    };
  }

  let chip = null;
  if (status === 'offline' || schedule?.stale) chip = 'Saved copy';
  else if (schedule?.provider === 'demo') chip = 'Demo data';

     return (
    <div className="page">
      <div className="page-top">
        <span className="muted">{formatDate(now)}</span>
        {chip && <span className="chip">{chip}</span>}
      </div>

      <h1>Power today</h1>
      <button type="button" className="area-link" onClick={() => setArea(null)}>
        {area.name} · Change area
      </button>

      {status === 'loading' && <p className="muted">Waking up the server…</p>}
      {status === 'error' && (
        <p className="muted">Could not load the schedule. Check your connection and try again.</p>
      )}

      {schedule && (
        <div className="today-hero">
          <CountdownRing
            value={hero.value}
            caption={hero.caption}
            progress={hero.progress}
            color={hero.color}
          />
          <div className="hero-text">
            <span className="hero-label">{hero.label}</span>
            <span className="hero-time">{hero.time}</span>
            <span className="hero-sub">{hero.sub}</span>
          </div>
        </div>
      )}

      {schedule && <Timeline outages={list} now={now} featured={current || next} />}
    </div>
  );
}