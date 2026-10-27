const SAST = '+02:00'; // South Africa has no daylight saving

const AREAS = [
  { id: 'demo-johannesburg', name: 'Johannesburg (demo)', slots: [['18:00', 2.5], ['22:00', 2.5]] },
  { id: 'demo-pretoria', name: 'Pretoria (demo)', slots: [['16:00', 2.5], ['20:00', 2.5]] },
  { id: 'demo-durban', name: 'Durban (demo)', slots: [['06:00', 2.5], ['14:00', 2.5]] },
  { id: 'demo-mbombela', name: 'Mbombela (demo)', slots: [['10:00', 2.5], ['18:00', 2.5]] },
];

function dateInSA(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 24 * 3600 * 1000);
  return d.toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' }); // YYYY-MM-DD
}

function makeSlot(date, startTime, hours, stage) {
  const start = new Date(`${date}T${startTime}:00${SAST}`);
  const end = new Date(start.getTime() + hours * 3600 * 1000);
  return { start: start.toISOString(), end: end.toISOString(), stage };
}

async function searchAreas(query) {
  const q = query.trim().toLowerCase();
  return AREAS
    .filter((a) => a.name.toLowerCase().includes(q))
    .map(({ id, name }) => ({ id, name }));
}

async function getSchedule(areaId) {
  const area = AREAS.find((a) => a.id === areaId);
  if (!area) return null;

  const stage = 2;
  const outages = [];
  for (const day of [0, 1]) {            // today and tomorrow
    const date = dateInSA(day);
    for (const [time, hours] of area.slots) {
      outages.push(makeSlot(date, time, hours, stage));
    }
  }

  return {
    area: { id: area.id, name: area.name },
    provider: 'demo',
    stage,
    generatedAt: new Date().toISOString(),
    outages,
  };
}

module.exports = { searchAreas, getSchedule };