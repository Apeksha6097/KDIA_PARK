const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/summary', authenticateToken, async (req, res) => {
    const db = req.app.locals.db;
    const userId = req.userId;

    try {
        // Fetch subscription
        const subscription = await db.get('SELECT * FROM subscriptions WHERE userId = ?', [userId]);

        // Fetch consumption logs (all)
        const consumptionLogs = await db.all('SELECT * FROM consumption_logs WHERE userId = ? ORDER BY month DESC', [userId]);

        // Calculate totals
        const totalConsumed = consumptionLogs.reduce((acc, log) => acc + log.unitsConsumed, 0);
        const currentMonthLog = consumptionLogs[0] || { unitsConsumed: 0, month: 'N/A' };

        const summary = {
            totalSubscribed: subscription ? subscription.totalUnits : 0,
            allocationName: subscription ? subscription.allocation_name : 'No Active Allocation',
            allocationStatus: subscription ? subscription.status : 'INACTIVE',
            startDate: subscription ? subscription.startDate : 'N/A',
            totalConsumed: totalConsumed,
            currentMonthConsumed: currentMonthLog.unitsConsumed,
            remainingUnits: subscription ? (subscription.totalUnits - totalConsumed) : 0,
            usageHistory: consumptionLogs.map(log => ({
                month: log.month,
                units: log.unitsConsumed
            })).reverse()
        };

        res.json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
});

module.exports = router;
