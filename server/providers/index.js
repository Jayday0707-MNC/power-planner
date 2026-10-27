const TTLCache = require('../cache');
const demo = require('./demoProvider');

const providers = { demo };

const name = process.env.DATA_PROVIDER || 'demo';
const provider = providers[name];
if (!provider) {
  throw new Error(`Unknown DATA_PROVIDER "${name}"`);
}

const ttlMs = Number(process.env.CACHE_TTL_MINUTES || 30) * 60 * 1000;
const scheduleCache = new TTLCache(ttlMs);

async function getSchedule(areaId) {
  const key = `schedule:${areaId}`;
  const cached = scheduleCache.get(key);

  if (cached && cached.fresh) {
    return { ...cached.value, cached: true };
  }

  try {
    const fresh = await provider.getSchedule(areaId);
    if (fresh) scheduleCache.set(key, fresh);
    return fresh ? { ...fresh, cached: false } : null;
  } catch (err) {
    // The data source failed: serve the old copy if we have one
    if (cached) return { ...cached.value, cached: true, stale: true };
    throw err;
  }
}

module.exports = {
  searchAreas: provider.searchAreas,
  getSchedule,
};