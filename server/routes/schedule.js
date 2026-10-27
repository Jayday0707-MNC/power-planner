const express = require('express');
const provider = require('../providers');

const router = express.Router();

router.get('/areas', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString();
    res.set('Cache-Control', 'public, max-age=300');
    res.json(await provider.searchAreas(q));
  } catch (err) {
    next(err);
  }
});

router.get('/areas/:id/schedule', async (req, res, next) => {
  try {
    const schedule = await provider.getSchedule(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Area not found' });
    res.json(schedule);
  } catch (err) {
    next(err);
  }
});

module.exports = router;