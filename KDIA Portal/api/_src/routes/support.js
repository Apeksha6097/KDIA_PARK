const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Create a new support ticket
router.post('/tickets', authenticateToken, async (req, res) => {
    const { subject, description, category } = req.body;
    const customerId = req.userId;
    const db = req.app.locals.db;

    if (!subject || !description) {
        return res.status(400).json({ error: "Subject and description are required" });
    }

    // Default category to subject if not provided (legacy support)
    const ticketCategory = category || subject;

    try {
        const result = await db.run(
            'INSERT INTO support_tickets (customerId, subject, description, category) VALUES (?, ?, ?, ?)',
            [customerId, subject, description, ticketCategory]
        );
        const newTicket = await db.get('SELECT * FROM support_tickets WHERE id = ?', [result.lastID]);
        res.status(201).json(newTicket);
    } catch (err) {
        console.error("Error creating ticket:", err);
        res.status(500).json({ error: "Failed to create support ticket" });
    }
});

// Fetch all tickets for the authenticated customer
router.get('/tickets', authenticateToken, async (req, res) => {
    const customerId = req.userId;
    const db = req.app.locals.db;

    try {
        const tickets = await db.all(
            'SELECT * FROM support_tickets WHERE customerId = ? ORDER BY createdAt DESC',
            [customerId]
        );
        res.json(tickets);
    } catch (err) {
        console.error("Error fetching tickets:", err);
        res.status(500).json({ error: "Failed to fetch support tickets" });
    }
});

// Revoke a support ticket
router.patch('/tickets/:id/revoke', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const customerId = req.userId;
    const db = req.app.locals.db;

    try {
        const ticket = await db.get('SELECT * FROM support_tickets WHERE id = ? AND customerId = ?', [id, customerId]);

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        if (ticket.status !== 'PENDING' && ticket.status !== 'IN_PROGRESS') {
            return res.status(400).json({ error: "Only PENDING or IN_PROGRESS tickets can be revoked" });
        }

        await db.run(
            'UPDATE support_tickets SET status = ?, revokedAt = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            ['REVOKED', new Date().toISOString(), id]
        );

        const updatedTicket = await db.get('SELECT * FROM support_tickets WHERE id = ?', [id]);
        res.json(updatedTicket);
    } catch (err) {
        console.error("Error revoking ticket:", err);
        res.status(500).json({ error: "Failed to revoke support ticket" });
    }
});

module.exports = router;
