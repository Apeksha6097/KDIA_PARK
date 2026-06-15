const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get activity timeline for authenticated customer
router.get('/timeline', authenticateToken, async (req, res) => {
    const customerId = req.userId;
    const db = req.app.locals.db;

    try {
        const events = [];

        // Execute all queries in parallel
        const [allocationChanges, tickets, profileUpdates, consumptionLogs] = await Promise.all([
            // 1. Allocation Changes
            db.all(`
                SELECT 
                    timestamp,
                    details
                FROM audit_logs
                WHERE actionType = 'ALLOCATION_CHANGE' 
                AND targetId = ?
                ORDER BY timestamp DESC
                LIMIT 10
            `, [customerId]),

            // 2. Support Ticket Updates
            db.all(`
                SELECT 
                    id,
                    subject,
                    status,
                    createdAt,
                    updatedAt,
                    admin_reply,
                    reply_at
                FROM support_tickets
                WHERE customerId = ?
                ORDER BY updatedAt DESC
                LIMIT 10
            `, [customerId]),

            // 3. Profile Update Events
            db.all(`
                SELECT 
                    timestamp,
                    actionType
                FROM audit_logs
                WHERE actionType IN ('PROFILE_UPDATE_APPROVED', 'PROFILE_UPDATE_REJECTED', 'CUSTOMER_PROFILE_UPDATE')
                AND targetId = ?
                ORDER BY timestamp DESC
                LIMIT 5
            `, [customerId]),

            // 4. Monthly Energy Statement Generation
            db.all(`
                SELECT 
                    month,
                    id
                FROM consumption_logs
                WHERE userId = ?
                ORDER BY month DESC
                LIMIT 5
            `, [customerId])
        ]);

        // Process 1. Allocation Changes
        allocationChanges.forEach(log => {
            try {
                const details = JSON.parse(log.details);
                events.push({
                    type: 'allocation',
                    description: `Allocation ${details.new > details.previous ? 'increased' : 'decreased'} to ${details.new} kWh`,
                    timestamp: log.timestamp,
                    icon: 'bolt',
                    referenceId: null
                });
            } catch (e) {
                // Skip malformed entries
            }
        });

        // Process 2. Support Ticket Updates
        tickets.forEach(ticket => {
            // Ticket creation
            events.push({
                type: 'ticket',
                description: `Support ticket #${ticket.id} created: ${ticket.subject}`,
                timestamp: ticket.createdAt,
                icon: 'ticket',
                referenceId: `TK-${ticket.id}`
            });

            // Status changes (if updated after creation)
            if (ticket.updatedAt !== ticket.createdAt) {
                const statusMap = {
                    'PENDING': 'pending review',
                    'IN_PROGRESS': 'in progress',
                    'RESOLVED': 'resolved',
                    'REVOKED': 'revoked',
                    'REJECTED': 'rejected'
                };
                events.push({
                    type: 'ticket',
                    description: `Support ticket #${ticket.id} marked ${statusMap[ticket.status] || ticket.status}`,
                    timestamp: ticket.updatedAt,
                    icon: 'ticket',
                    referenceId: `TK-${ticket.id}`
                });
            }

            // Admin reply
            if (ticket.admin_reply && ticket.reply_at) {
                events.push({
                    type: 'ticket',
                    description: `Admin replied to ticket #${ticket.id}`,
                    timestamp: ticket.reply_at,
                    icon: 'ticket',
                    referenceId: `TK-${ticket.id}`
                });
            }
        });

        // Process 3. Profile Update Events
        profileUpdates.forEach(log => {
            let description = 'Profile updated';
            if (log.actionType === 'PROFILE_UPDATE_APPROVED') {
                description = 'Profile update approved by Admin';
            } else if (log.actionType === 'PROFILE_UPDATE_REJECTED') {
                description = 'Profile update rejected by Admin';
            } else if (log.actionType === 'CUSTOMER_PROFILE_UPDATE') {
                description = 'Profile updated by Admin';
            }

            events.push({
                type: 'profile',
                description: description,
                timestamp: log.timestamp,
                icon: 'user',
                referenceId: null
            });
        });

        // Process 4. Monthly Energy Statement Generation
        consumptionLogs.forEach(log => {
            // Create a timestamp for the statement (first day of following month)
            const [year, month] = log.month.split('-');
            const statementDate = new Date(parseInt(year), parseInt(month), 1);

            events.push({
                type: 'statement',
                description: `Monthly Energy Statement generated`,
                timestamp: statementDate.toISOString(),
                icon: 'document',
                referenceId: log.month
            });
        });

        // Sort all events by timestamp (descending - newest first)
        events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limit to 20 most recent events
        const recentEvents = events.slice(0, 20);

        res.json(recentEvents);

    } catch (err) {
        console.error('Error fetching activity timeline:', err);
        res.status(500).json({ error: 'Failed to fetch activity timeline' });
    }
});

module.exports = router;
