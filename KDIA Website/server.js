const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets for the portal
app.use('/land-owner-portal', express.static(path.join(__dirname, 'land-owner-portal')));

// Serve root static assets (index.html, about.html, etc.)
app.use(express.static(path.join(__dirname, '.')));

// API routes (placeholder modules)
app.use('/api/auth', require('./land-owner-portal/api/auth'));
app.use('/api/land', require('./land-owner-portal/api/land'));
app.use('/api/documents', require('./land-owner-portal/api/documents'));
app.use('/api/notifications', require('./land-owner-portal/api/notifications'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
