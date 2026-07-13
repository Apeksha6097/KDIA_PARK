const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN || "https://examplePublicKey@o0.ingest.sentry.io/0",
    tracesSampleRate: 1.0,
});

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDB } = require('./database');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(require('./middleware/sanitize'));

// HTTP Request Logging
app.use(morgan('dev'));

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

// Initialize Database and Start Server
initDB().then(database => {
    db = database;
    app.locals.db = db; // Make db available to routes

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/profile', require('./routes/profile'));
    app.use('/api/energy', require('./routes/energy'));
    app.use('/api/admin', require('./routes/admin'));
    app.use('/api/vendor-customers', require('./routes/vendor_customers'));
    app.use('/api/support', require('./routes/support'));
    app.use('/api/activity', require('./routes/activity'));
    app.use('/api/leads', require('./routes/leads'));

    // Mock endpoint for "Know Your Project" page
    app.get('/api/customer/project-details', (req, res) => {
        res.json({
            customer: {
                discom: 'Jodhpur',
                locationType: 'Park',
                locationName: 'Solar Park Alpha',
                allocatedCapacity: 1000,
                allocationDate: '2025-01-15',
                status: 'Active'
            },
            project: {
                totalCapacity: 17000,
                executedCapacity: 11500,
                underExecutionCapacity: 2700,
                balanceCapacity: 2800,
                address: 'Phalodi Solar Zone, Jodhpur, Rajasthan',
                commissioningStatus: 'Under Execution',
                expectedCommissioningDate: '2025-12-31',
                solarTechnology: 'Monocrystalline Perc',
                discomZone: 'Jodhpur Zone 1'
            },
            documents: [
                { name: 'PPA Document', type: 'PDF', url: '#' },
                { name: 'Allocation Letter', type: 'PDF', url: '#' },
                { name: 'Project Brochure', type: 'PDF', url: '#' }
            ]
        });
    });

    app.get('/', (req, res) => {
        res.send('KDIA Re Park Portal API is running');
    });

    // Sentry debug route
    app.get('/debug-sentry', function mainHandler(req, res) {
        throw new Error('Test error');
    });

    // Sentry error handler — must be before other error handlers
    Sentry.setupExpressErrorHandler(app);

    // Centralized error handler — must be last middleware
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database', err);
    process.exit(1);
});
