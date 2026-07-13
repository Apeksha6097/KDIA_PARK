require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');
const crypto = require('crypto');
const calculationService = require('./services/calculationService');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kdia_mobile_secret_key_2024';

app.use(cors());
app.use(express.json());

// --- Middleware ---

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Authentication token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// --- Auth Endpoints ---

// Login
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                consumerId: user.consumerId
            },
            token: token
        });
    });
});

// Forgot Password
app.post('/auth/forgot-password', (req, res) => {
    const { email } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        // Always return success to avoid email enumeration
        if (!user) {
            console.log(`[Forgot Password] User not found: ${email}`);
            return res.json({ success: true, message: 'If this email is registered, a reset link has been sent.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expiresAt = Date.now() + 3600000; // 1 hour

        db.run(
            'INSERT OR REPLACE INTO password_resets (email, token, expiresAt) VALUES (?, ?, ?)',
            [email, token, expiresAt],
            (err) => {
                if (err) return res.status(500).json({ message: 'Error saving reset token' });

                console.log(`\n==============================================`);
                console.log(`[PASS RESET] Link generated for ${email}`);
                console.log(`Token: ${token}`);
                console.log(`Environment: Mobile App (Localhost)`);
                console.log(`==============================================\n`);

                res.json({ success: true, message: 'Reset link generated and logged to console.' });
            }
        );
    });
});

// Reset Password
app.post('/auth/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;

    db.get('SELECT * FROM password_resets WHERE email = ? AND token = ?', [email, token], async (err, reset) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!reset || reset.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const passwordHash = await bcrypt.compare(newPassword, '$2a$10$invalidhash') ? '' : await bcrypt.hash(newPassword, 10);

        db.serialize(() => {
            db.run('UPDATE users SET password = ? WHERE email = ?', [passwordHash, email]);
            db.run('DELETE FROM password_resets WHERE email = ?', [email]);
            res.json({ success: true, message: 'Password reset successful.' });
        });
    });
});

// --- Core Endpoints (Protected) ---

// Profile
app.get('/profile', authenticateToken, (req, res) => {
    db.get('SELECT fullName, email, role, consumerId FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        // Hardcoded profile extensions to match mobile/services/api.ts
        res.json({
            ...user,
            planName: 'Solar Premium Tier 1',
            memberSince: 'Jan 2024',
            status: 'Active',
            phone: '+91 98765 43210',
            notificationPreferences: 'Email Alerts: Enabled',
            language: 'English',
            timeZone: 'IST (UTC+5:30)',
            connectionLocation: 'KDIA RE Park – Unit A',
            meterType: 'Smart Meter (IoT Enabled)',
            lastLogin: 'Today, 10:45 AM',
            deviceType: 'Android (Mobile App)'
        });
    });
});

// Dashboard
app.get('/dashboard', authenticateToken, (req, res) => {
    // Setup structured calculation data for the Calculation Engine
    const calcData = {
        investmentAmount: 0,
        energyAllocated: 450, // previously hardcoded
        tariffRate: 0,
        projectDuration: 0
    };

    // Use centralized calculation service
    const allocatedUnits = calculationService.calculateAllocation(calcData);

    // Simple mock dashboard data connected to user context
    res.json({
        allocationName: 'Solar Premium Tier 1',
        totalSubscribed: allocatedUnits,
        allocationStatus: 'ACTIVE',
        totalConsumed: 120,
    });
});

// Invoices
app.get('/invoices', authenticateToken, (req, res) => {
    db.all('SELECT id, date, amount, status FROM invoices WHERE userId = ?', [req.user.id], (err, invoices) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(invoices);
    });
});

// Support Tickets
app.get('/tickets', authenticateToken, (req, res) => {
    db.all('SELECT id, subject, status, date, description FROM tickets WHERE userId = ?', [req.user.id], (err, tickets) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(tickets);
    });
});

app.post('/tickets', authenticateToken, (req, res) => {
    const { subject, description } = req.body;
    const id = `TKT-${Date.now().toString().slice(-6)}`;
    const date = new Date().toISOString().split('T')[0];
    const status = 'OPEN';

    db.run(
        'INSERT INTO tickets (id, userId, subject, status, date, description) VALUES (?, ?, ?, ?, ?, ?)',
        [id, req.user.id, subject, status, date, description],
        (err) => {
            if (err) return res.status(500).json({ message: 'Error creating ticket' });
            res.json({ id, subject, status, date, description });
        }
    );
});

app.listen(PORT, () => {
    console.log(`KDIA Mobile Backend running at http://localhost:${PORT}`);
});
