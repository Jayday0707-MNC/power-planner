class TTLCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    return { value: entry.value, fresh: Date.now() - entry.savedAt < this.ttlMs };
  }

  set(key, value) {
    this.store.set(key, { value, savedAt: Date.now() });
  }
}

module.exports = TTLCache;