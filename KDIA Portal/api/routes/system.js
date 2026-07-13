const express = require('express');
const router = express.Router();
const { authenticateToken, adminMiddleware } = require('../middleware/auth');

// GET /api/system/health
router.get('/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        if (req.app.locals.db) {
            await req.app.locals.db.get('SELECT 1');
            dbStatus = 'connected';
        }
    } catch (e) {
        dbStatus = 'error';
    }

    res.json({
        status: 'ok',
        serverTime: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        database: dbStatus,
        environment: process.env.NODE_ENV || 'production'
    });
});

// GET /api/system/stats
router.get('/stats', authenticateToken, adminMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    try {
        const [
            users,
            customers,
            vendors,
            subscriptions,
            tickets
        ] = await Promise.all([
            db.get(`SELECT COUNT(*) as count FROM users`),
            db.get(`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`),
            db.get(`SELECT COUNT(*) as count FROM users WHERE role = 'vendor'`),
            db.get(`SELECT COUNT(*) as count FROM subscriptions WHERE status = 'ACTIVE'`),
            db.get(`SELECT COUNT(*) as count FROM support_tickets WHERE status IN ('PENDING', 'IN_PROGRESS')`)
        ]);

        res.json({
            totalUsers: users?.count || 0,
            totalCustomers: customers?.count || 0,
            totalVendors: vendors?.count || 0,
            activeSubscriptions: subscriptions?.count || 0,
            openSupportTickets: tickets?.count || 0
        });

    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ error: "Failed to fetch system stats" });
    }
});

module.exports = router;
