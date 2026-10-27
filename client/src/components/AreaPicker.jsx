import { useEffect, useState } from 'react';
import { api } from '../api';

export default function AreaPicker({ onPick }) {
  const [query, setQuery] = useState('');
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      api(`/api/areas?q=${encodeURIComponent(query)}`)
        .then((data) => {
          setAreas(data);
          setError(false);
        })
        .catch(() => setError(true));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="page">
      <h1>Choose your area</h1>
      <p className="muted">We will remember it on this device.</p>

      <label htmlFor="area-search" className="field-label">Search</label>
      <input
        id="area-search"
        className="field"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Mbombela"
        autoComplete="off"
      />

      {error && (
        <p className="muted">
          Could not reach the server. It may be waking up, so try again in a minute.
        </p>
      )}

      <ul className="area-list">
        {areas.map((a) => (
          <li key={a.id}>
            <button type="button" className="area-item" onClick={() => onPick(a)}>
              {a.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}