import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { formatRand, todayKey, formatShortDate, monthLabel } from '../lib/money';

const CATEGORIES = [
  { id: 'fuel', name: 'Fuel' },
  { id: 'food', name: 'Spoiled food' },
  { id: 'light', name: 'Candles & gas' },
  { id: 'repairs', name: 'Repairs' },
  { id: 'other', name: 'Other' },
];

function categoryName(id) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? 'Other';
}

export default function Costs() {
  const [entries, setEntries] = useLocalStorage('pp.costs', []);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('fuel');
  const [note, setNote] = useState('');

  const monthKey = todayKey().slice(0, 7);
  const thisMonth = entries.filter((e) => e.date.startsWith(monthKey));
  const total = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    sum: thisMonth.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.sum > 0);

  function add(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;

    const entry = {
      id: Date.now(),
      date: todayKey(),
      category,
      amount: value,
      note: note.trim(),
    };
    setEntries([entry, ...entries]);
    setAmount('');
    setNote('');
  }

  function remove(id) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  return (
    <div className="page">
      <span className="muted">{monthLabel(monthKey)}</span>
      <h1>Outage costs</h1>

      <div className="cost-hero">
        <span className="muted">Spent this month</span>
        <span className="cost-total">{formatRand(total)}</span>
        <span className="muted">
          {thisMonth.length === 0
            ? 'Nothing logged yet'
            : `${thisMonth.length} ${thisMonth.length === 1 ? 'item' : 'items'} · saved on this device`}
        </span>
      </div>

      {byCategory.length > 0 && (
        <ul className="breakdown">
          {byCategory.map((c) => (
               <li key={c.id} data-cat={c.id}>
              <div className="breakdown-row">
                <span>{c.name}</span>
                <span className="amt">{formatRand(c.sum)}</span>
              </div>
              <div className="breakdown-bar">
                <div className="breakdown-fill" style={{ width: `${(c.sum / total) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="cost-form" onSubmit={add}>
        <h2 className="list-title">Log a cost</h2>

        <label htmlFor="cost-amount" className="field-label">Amount (rand)</label>
        <input
          id="cost-amount"
          className="field"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <fieldset className="chips">
          <legend className="field-label">What was it for?</legend>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip-btn${category === c.id ? ' on' : ''}`}
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </fieldset>

        <label htmlFor="cost-note" className="field-label">Note (optional)</label>
        <input
          id="cost-note"
          className="field"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit" className="primary-btn">Add cost</button>
      </form>

      {thisMonth.length > 0 && (
        <>
          <div className="list-head">
            <span className="list-title">This month</span>
          </div>
          <ul className="entries">
            {thisMonth.map((e) => (
              <li key={e.id} className="entry">
                <div>
                  <span className="entry-name">{categoryName(e.category)}</span>
                  <span className="entry-meta">
                    {formatShortDate(e.date)}
                    {e.note ? ` · ${e.note}` : ''}
                  </span>
                </div>
                <div className="entry-right">
                  <span className="entry-amount">{formatRand(e.amount)}</span>
                  <button
                    type="button"
                    className="entry-delete"
                    aria-label={`Delete ${categoryName(e.category)} ${formatRand(e.amount)}`}
                    onClick={() => remove(e.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}