const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function api(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}