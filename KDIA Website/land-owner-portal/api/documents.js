const express = require('express');
const router = express.Router();

router.post('/upload', (req, res) => {
  res.status(201).json({ message: 'Document uploaded (mocked)' });
});

module.exports = router;
