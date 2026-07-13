const express = require('express');
const router = express.Router();
const { authenticateToken, supportMiddleware } = require('../middleware/auth');

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

// --- Support Agent Routes ---

// Fetch all tickets for support agents with filters
router.get('/agent/tickets', authenticateToken, supportMiddleware, async (req, res) => {
    const db = req.app.locals.db;
    const { status, priority, discom } = req.query;

    try {
        let query = `
            SELECT t.*, u.fullName as customerName, u.email as customerEmail, u.mobileNumber as customerMobile
            FROM support_tickets t
            JOIN users u ON t.customerId = u.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }
        if (priority) {
            query += ' AND t.priority = ?';
            params.push(priority);
        }
        if (discom) {
            query += ' AND t.discom = ?';
            params.push(discom);
        }

        query += ' ORDER BY t.createdAt DESC';

        const tickets = await db.all(query, params);
        res.json(tickets);
    } catch (err) {
        console.error("Error fetching support tickets:", err);
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});

// Fetch single ticket details for support agents
router.get('/agent/tickets/:id', authenticateToken, supportMiddleware, async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.db;

    try {
        const ticket = await db.get(`
            SELECT t.*, u.fullName as customerName, u.email as customerEmail, u.mobileNumber as customerMobile
            FROM support_tickets t
            JOIN users u ON t.customerId = u.id
            WHERE t.id = ?
        `, [id]);

        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        const messages = await db.all(`
            SELECT r.*, u.fullName as senderName, u.role as senderRole
            FROM ticket_responses r
            JOIN users u ON r.senderId = u.id
            WHERE r.ticketId = ?
            ORDER BY r.createdAt ASC
        `, [id]);

        const internalNotes = await db.all(`
            SELECT n.*, u.fullName as agentName
            FROM ticket_internal_notes n
            JOIN users u ON n.agentId = u.id
            WHERE n.ticketId = ?
            ORDER BY n.createdAt ASC
        `, [id]);

        res.json({ ...ticket, messages, internalNotes });
    } catch (err) {
        console.error("Error fetching ticket details:", err);
        res.status(500).json({ error: "Failed to fetch ticket details" });
    }
});

// Support reply to customer
router.post('/agent/tickets/:id/reply', authenticateToken, supportMiddleware, async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const agentId = req.userId;
    const db = req.app.locals.db;

    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        await db.run(
            'INSERT INTO ticket_responses (ticketId, senderId, message) VALUES (?, ?, ?)',
            [id, agentId, message]
        );

        // Auto-update status to 'Awaiting Customer Response' if it was 'Open' or 'In Progress'
        await db.run(
            "UPDATE support_tickets SET status = 'Awaiting Customer Response', updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND status IN ('PENDING', 'IN_PROGRESS')",
            [id]
        );

        res.json({ message: "Reply sent successfully" });
    } catch (err) {
        console.error("Error sending reply:", err);
        res.status(500).json({ error: "Failed to send reply" });
    }
});

// Add internal note
router.post('/agent/tickets/:id/note', authenticateToken, supportMiddleware, async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    const agentId = req.userId;
    const db = req.app.locals.db;

    if (!note) return res.status(400).json({ error: "Note is required" });

    try {
        await db.run(
            'INSERT INTO ticket_internal_notes (ticketId, agentId, note) VALUES (?, ?, ?)',
            [id, agentId, note]
        );
        res.json({ message: "Internal note added successfully" });
    } catch (err) {
        console.error("Error adding internal note:", err);
        res.status(500).json({ error: "Failed to add internal note" });
    }
});

// Change ticket status
router.patch('/agent/tickets/:id/status', authenticateToken, supportMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = req.app.locals.db;

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'Awaiting Customer Response', 'RESOLVED', 'ESCALATED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        await db.run(
            'UPDATE support_tickets SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );
        res.json({ message: "Ticket status updated successfully", status });
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

// Assign ticket
router.patch('/agent/tickets/:id/assign', authenticateToken, supportMiddleware, async (req, res) => {
    const { id } = req.params;
    const { assignedId } = req.body;
    const db = req.app.locals.db;

    try {
        await db.run(
            'UPDATE support_tickets SET assigned_support_id = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [assignedId, id]
        );
        res.json({ message: "Ticket assigned successfully" });
    } catch (err) {
        console.error("Error assigning ticket:", err);
        res.status(500).json({ error: "Failed to assign ticket" });
    }
});

module.exports = router;
