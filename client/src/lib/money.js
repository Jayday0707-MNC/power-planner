const zar = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
});

export function formatRand(n) {
  return zar.format(n);
}

// Today's date in South Africa as YYYY-MM-DD
export function todayKey() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' });
}

export function formatShortDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

export function monthLabel(key) {
  return new Date(`${key}-01T00:00:00Z`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}