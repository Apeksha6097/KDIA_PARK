const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  const { fullName, email, mobileNumber, password } = req.body;
  if (!fullName || !email || !mobileNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  res.status(201).json({ message: 'Registration successful!' });
});

router.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' });
  }
  res.json({
    token: 'mock-jwt-token',
    user: {
      id: 1,
      fullName: 'Demo Owner',
      email: email = identifier.includes('@') ? identifier : 'owner@kdia.com',
      mobileNumber: '1234567890',
      role: 'owner',
      isVerified: 1
    }
  });
});

module.exports = router;
