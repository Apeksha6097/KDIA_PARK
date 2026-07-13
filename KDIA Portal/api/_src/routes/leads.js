const express = require('express');
const router = express.Router();
const { initDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/leads - Get all leads assigned to the logged-in vendor
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (req.userRole !== 'vendor') {
            return res.status(403).json({ error: "Access denied. Vendor role required." });
        }

        const db = await initDB();
        const leads = await db.all(
            "SELECT * FROM leads WHERE vendorId = ? ORDER BY assignedDate DESC",
            [req.userId]
        );
        res.json(leads);
    } catch (err) {
        console.error("Error fetching leads:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PATCH /api/leads/:id/status - Update lead status
router.patch('/:id/status', authenticateToken, async (req, res) => {
    try {
        if (req.userRole !== 'vendor') {
            return res.status(403).json({ error: "Access denied. Vendor role required." });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const allowedStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Not Interested', 'Converted'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const db = await initDB();

        // precise check: ensure lead belongs to this vendor before updating
        const result = await db.run(
            "UPDATE leads SET status = ? WHERE id = ? AND vendorId = ?",
            [status, id, req.userId]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "Lead not found or access denied" });
        }

        res.json({ message: "Lead status updated successfully", status });
    } catch (err) {
        console.error("Error updating lead status:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
