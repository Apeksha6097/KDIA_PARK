const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/consumption', authenticateToken, async (req, res) => {
    res.json({ message: "Energy consumption data" });
});

router.post('/log', authenticateToken, async (req, res) => {
    const { unitsConsumed, month } = req.body;
    const userId = req.userId;
    const db = req.app.locals.db;

    if (!unitsConsumed || !month) {
        return res.status(400).json({ error: "Units and month are required" });
    }

    try {
        const subscription = await db.get('SELECT totalUnits FROM subscriptions WHERE userId = ?', [userId]);
        const totalConsumedRes = await db.get('SELECT SUM(unitsConsumed) as total FROM consumption_logs WHERE userId = ?', [userId]);
        const totalConsumed = totalConsumedRes.total || 0;

        // Logical limit check: cannot exceed subscription or common sense limit (e.g. 5000 kWh per month)
        if (unitsConsumed > 5000) {
            return res.status(400).json({ error: "Consumption exceeds logical limit for a single month" });
        }

        if (totalConsumed + unitsConsumed > subscription.totalUnits) {
            return res.status(400).json({ error: "Total consumption would exceed subscribed units" });
        }

        await db.run('INSERT INTO consumption_logs (userId, unitsConsumed, month) VALUES (?, ?, ?)', [userId, unitsConsumed, month]);
        res.status(201).json({ message: "Consumption logged successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to log consumption" });
    }
});

module.exports = router;
