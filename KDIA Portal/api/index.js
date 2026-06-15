// VERCEL SERVERLESS DEPLOYMENT - Main API Handler
// This file exports an Express app for Vercel's serverless platform
// Original server.js used app.listen() - that's handled by Vercel here

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDB } = require('./database');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Database initialization
// Database initialization middleware
// This ensures that the DB is initialized for every serverless request if not already ready
const dbMiddleware = async (req, res, next) => {
    if (!app.locals.db) {
        try {
            app.locals.db = await initDB();
        } catch (err) {
            console.error('Failed to initialize database', err);
            return res.status(500).json({ error: 'Database initialization failed' });
        }
    }
    next();
};

app.use(dbMiddleware);

// Security headers
app.use(helmet());

// CORS configuration - allow all origins for parked demo
app.use(cors());
app.use(express.json());

// Middleware imports
app.use(require('./middleware/sanitize'));

// HTTP Request Logging (Existing)
app.use(morgan('combined'));

// Custom Request Metrics Logging (Structured Format)
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            method: req.method,
            endpoint: req.originalUrl || req.url,
            status: res.statusCode,
            responseTimeMs: duration
        }));
    });
    next();
});

// Rate limiting — auth endpoints only
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again after 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/vendor/register', authLimiter);

// ============================================
// APP MODE — PARKED (demo) vs LIVE (production)
// Set APP_MODE=demo to keep Vercel read-only behaviour.
// Set APP_MODE=live (or omit) to enable full mutations on Railway.
// ============================================
const APP_MODE = process.env.APP_MODE || 'demo';

if (APP_MODE === 'demo') {
    app.use((req, res, next) => {
        const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

        // Allow health check endpoint
        if (req.path === '/api/health' || req.path === '/health') {
            return next();
        }

        // Block mutation methods
        if (mutationMethods.includes(req.method)) {
            return res.status(403).json({
                error: 'This project is parked and running in demo mode.',
                message: 'Data mutations are disabled for this deployment.',
                hint: 'This is a read-only showcase. All POST/PUT/PATCH/DELETE operations are blocked.',
                contact: 'Please contact the project owner for a live instance with full functionality.'
            });
        }

        next();
    });
}

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'KDIA Re-Park Portal is live (parked mode)',
        mode: 'READ-ONLY',
        deployment: 'Vercel Serverless',
        database: 'SQLite (bundled, read-only)',
        timestamp: new Date().toISOString(),
        message: 'All mutation operations are disabled. This is a demonstration instance.'
    });
});

// Also support /health without /api prefix for direct serverless calls
app.get('/health', (req, res) => {
    res.json({
        status: 'KDIA Re-Park Portal is live (parked mode)',
        mode: 'READ-ONLY',
        deployment: 'Vercel Serverless',
        database: 'SQLite (bundled, read-only)',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ROUTE IMPORTS
// ============================================
// All routes from server/routes are imported here
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/dashboard', require('../server/routes/dashboard'));
app.use('/api/profile', require('../server/routes/profile'));
app.use('/api/energy', require('../server/routes/energy'));
app.use('/api/admin', require('../server/routes/admin'));
app.use('/api/vendor-customers', require('../server/routes/vendor_customers'));
app.use('/api/support', require('../server/routes/support'));
app.use('/api/activity', require('../server/routes/activity'));
app.use('/api/leads', require('../server/routes/leads'));
app.use('/api/system', require('./routes/system')); // Added System Monitoring API

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'KDIA Re Park Portal API is running',
        mode: 'Parked Demo (Read-Only)',
        healthCheck: '/api/health',
        note: 'All mutation operations (POST/PUT/PATCH/DELETE) are disabled.'
    });
});

// ============================================
// SERVERLESS EXPORT
// ============================================
// Export the Express app for Vercel to handle
// DO NOT use app.listen() - Vercel handles the server

// Centralized error handler — must be last middleware
app.use(errorHandler);

module.exports = app;
