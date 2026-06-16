const express = require('express');
const router = express.Router();

router.get('/my-applications', (req, res) => {
  res.json([]);
});

router.post('/create', (req, res) => {
  res.status(201).json({ message: 'Land application created (mocked)' });
});

module.exports = router;
