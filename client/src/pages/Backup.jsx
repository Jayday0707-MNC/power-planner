import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { nextOutageHours } from '../lib/outage';
import { formatDuration } from '../lib/time';

const APPLIANCES = [
  { id: 'fridge', name: 'Fridge', watts: 150 },
  { id: 'router', name: 'Wi-Fi router', watts: 12 },
  { id: 'lights', name: 'LED lights', watts: 40 },
  { id: 'laptop', name: 'Laptop', watts: 60 },
  { id: 'tv', name: 'TV', watts: 100 },
  { id: 'kettle', name: 'Kettle', watts: 2000 },
];

const DEFAULT_ON = { fridge: true, router: true, lights: true, laptop: true, tv: false, kettle: false };
const USABLE = 0.8; // only 80% of a battery should be used
const SCALE_H = 6;  // the gauge shows 0 to 6 hours

function fmtHours(h) {
  if (h >= 24) return '24h+';
  return formatDuration(h * 3600 * 1000);
}

export default function Backup() {
  const [on, setOn] = useLocalStorage('pp.appliances', DEFAULT_ON);
  const [kwh, setKwh] = useLocalStorage('pp.battery', 1.2);
  const [outageH] = useState(() => nextOutageHours());

  const totalW = APPLIANCES.reduce((sum, a) => sum + (on[a.id] ? a.watts : 0), 0);
  const usableWh = kwh * 1000 * USABLE;
  const hours = totalW > 0 ? usableWh / totalW : 24;
  const ok = hours >= outageH;
  const color = ok ? 'var(--ok)' : 'var(--warn)';

  const fillPct = Math.min(100, (hours / SCALE_H) * 100);
  const markPct = Math.min(100, (outageH / SCALE_H) * 100);

  function toggle(id) {
    setOn({ ...on, [id]: !on[id] });
  }

  return (
    <div className="page">
      <span className="muted">
        Battery {kwh} kWh · {(kwh * USABLE).toFixed(2)} kWh usable
      </span>
      <h1>Backup power</h1>

      <div className="gauge">
        <span className="muted">Your battery runs this for</span>
        <span className="gauge-time">{fmtHours(hours)}</span>
        <span className="gauge-status" style={{ color }}>
          {ok
            ? `Covers your ${fmtHours(outageH)} outage with ${fmtHours(hours - outageH)} to spare`
            : `Falls ${fmtHours(outageH - hours)} short of your ${fmtHours(outageH)} outage`}
        </span>

        <div className="bar">
          <div className="bar-fill" style={{ width: `${fillPct}%`, background: color }} />
          <div className="bar-mark" style={{ left: `${markPct}%` }} />
          <span className="bar-label" style={{ left: `${markPct}%` }}>
            Outage {fmtHours(outageH)}
          </span>
          <span className="bar-end" style={{ left: 0 }}>0h</span>
          <span className="bar-end" style={{ right: 0 }}>{SCALE_H}h</span>
        </div>
      </div>

      <div className="list-head">
        <span className="list-title">What stays on</span>
        <span className="list-total">{totalW} W total</span>
      </div>

      <ul className="appliances">
        {APPLIANCES.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              className="appliance"
              aria-pressed={!!on[a.id]}
              onClick={() => toggle(a.id)}
            >
              <span>
                <span className="appliance-name">{a.name}</span>
                <span className="appliance-watts">{a.watts} W</span>
              </span>
              <span className={`switch${on[a.id] ? ' on' : ''}`}>
                <span className="knob" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <label htmlFor="battery-kwh" className="field-label">Battery size (kWh)</label>
      <input
        id="battery-kwh"
        className="field"
        type="number"
        min="0.1"
        step="0.1"
        value={kwh}
        onChange={(e) => setKwh(Math.max(0, Number(e.target.value)))}
      />
    </div>
  );
}