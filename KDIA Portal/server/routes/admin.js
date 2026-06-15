const express = require('express');
const router = express.Router();
const { authenticateToken, adminMiddleware } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Apply admin protection to all routes in this file
router.use(authenticateToken);
router.use(adminMiddleware);

// Dashboard stats
router.get('/stats', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const stats = await db.get(`
            SELECT 
                (SELECT COUNT(*) FROM users WHERE role = 'customer') as totalCustomers,
                (SELECT COUNT(*) FROM users WHERE role = 'customer' AND isActive = 1) as activeCustomers,
                (SELECT SUM(totalUnits) FROM subscriptions) as totalAllocatedEnergy
            FROM users LIMIT 1
        `);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Operational alerts
router.get('/alerts', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const alerts = {
            pendingCustomerApprovals: 0,
            pendingVendorApprovals: 0,
            supportSLA: 0,
            profileChangeRequests: 0
        };

        // 1. Pending Customer Approvals
        const pendingCustomers = await db.get(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE role = 'customer' AND approval_status = 'PENDING'
        `);
        alerts.pendingCustomerApprovals = pendingCustomers.count || 0;

        // 2. Pending Vendor Approvals
        const pendingVendors = await db.get(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE role = 'vendor' AND approval_status = 'PENDING'
        `);
        alerts.pendingVendorApprovals = pendingVendors.count || 0;

        // 3. Support SLA: Tickets pending >48 hours
        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

        const oldTickets = await db.all(`
            SELECT id, createdAt
            FROM support_tickets
            WHERE status IN ('PENDING', 'IN_PROGRESS')
        `);

        for (const ticket of oldTickets) {
            const createdAt = new Date(ticket.createdAt);
            if (createdAt < fortyEightHoursAgo) {
                alerts.supportSLA++;
            }
        }

        // 4. Profile Change Requests: Pending approvals
        const profileChangeRequests = await db.get(`
            SELECT COUNT(*) as count
            FROM support_tickets
            WHERE category = 'PROFILE_UPDATE_REQUEST' AND status = 'PENDING'
        `);
        alerts.profileChangeRequests = profileChangeRequests.count || 0;

        res.json(alerts);
    } catch (err) {
        console.error('Error fetching alerts:', err);
        res.status(500).json({ error: "Failed to fetch alerts" });
    }
});

// Fetch audit logs
router.get('/audit-logs', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const logs = await db.all(`
            SELECT 
                a.*, 
                u.fullName as adminName
            FROM audit_logs a
            JOIN users u ON a.adminId = u.id
            ORDER BY a.timestamp DESC
            LIMIT 100
        `);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

// List all customers
router.get('/customers', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const customers = await db.all(`
            SELECT 
                u.id, u.fullName, u.email, u.consumerId, u.role, u.isActive, u.approval_status,
                u.createdAt, v.fullName as vendorName,
                s.totalUnits as allocatedEnergy, s.status as allocationStatus
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.userId AND s.status = 'ACTIVE'
            LEFT JOIN users v ON u.vendor_id = v.id
            WHERE u.role = 'customer' AND u.approval_status = 'APPROVED'
            ORDER BY u.createdAt DESC
        `);
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});

// List pending customers for approval
router.get('/pending-customers', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const customers = await db.all(`
            SELECT 
                u.id, u.fullName, u.email, u.consumerId, u.createdAt, u.approval_status,
                v.fullName as vendorName
            FROM users u
            LEFT JOIN users v ON u.vendor_id = v.id
            WHERE u.role = 'customer' AND u.approval_status = 'PENDING'
            ORDER BY u.createdAt DESC
        `);
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch pending customers" });
    }
});

// List all vendors
router.get('/vendors', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const vendors = await db.all(`
            SELECT 
                id, fullName, email, consumerId, role, isActive, approval_status,
                createdAt
            FROM users
            WHERE role = 'vendor'
            ORDER BY createdAt DESC
        `);
        res.json(vendors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch vendors" });
    }
});

// Get vendor detail
router.get('/vendors/:id', async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.db;
    try {
        const vendor = await db.get(`
            SELECT 
                id, fullName, email, consumerId, role, isActive, approval_status,
                createdAt, rejection_reason
            FROM users
            WHERE id = ? AND role = 'vendor'
        `, [id]);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.json(vendor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch vendor details" });
    }
});

// Approve vendor
router.post('/vendors/:id/approve', async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.db;
    const adminId = req.userId;
    try {
        await db.run('UPDATE users SET approval_status = ?, rejection_reason = NULL WHERE id = ?', ['APPROVED', id]);
        await logAction(db, adminId, 'VENDOR_APPROVED', id, { status: 'APPROVED' });
        res.json({ message: "Vendor approved successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to approve vendor" });
    }
});

// Reject vendor
router.post('/vendors/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    if (!reason) {
        return res.status(400).json({ error: "Rejection reason is required" });
    }

    try {
        await db.run('UPDATE users SET approval_status = ?, rejection_reason = ? WHERE id = ?', ['REJECTED', reason, id]);
        await logAction(db, adminId, 'VENDOR_REJECTED', id, { status: 'REJECTED', reason });
        res.json({ message: "Vendor application rejected" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reject application" });
    }
});

// Get customer detail
router.get('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.db;
    try {
        const profile = await db.get(`
            SELECT 
                u.id, u.fullName, u.email, u.mobileNumber, u.consumerId, u.role, u.isActive, u.approval_status,
                u.dob, u.gender, u.address_line_1, u.address_line_2, u.city, u.state, u.pin_code, u.location_type,
                u.createdAt, v.fullName as vendorName
            FROM users u
            LEFT JOIN users v ON u.vendor_id = v.id
            WHERE u.id = ? AND u.role = 'customer'
        `, [id]);


        if (!profile) {
            return res.status(404).json({ error: "Customer not found" });
        }

        const subscription = await db.get(`
            SELECT totalUnits, startDate FROM subscriptions WHERE userId = ?
        `, [id]);

        const consumption = await db.all(`
            SELECT unitsConsumed, month FROM consumption_logs 
            WHERE userId = ? 
            ORDER BY month DESC
        `, [id]);

        res.json({
            profile: profile,
            subscription: subscription || { totalUnits: 0, startDate: 'N/A' },
            consumption: consumption || []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch customer details" });
    }
});

// Toggle customer status
router.patch('/customers/:id/status', async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const db = req.app.locals.db;

    if (isActive === undefined) {
        return res.status(400).json({ error: "isActive status is required" });
    }

    try {
        const user = await db.get('SELECT isActive FROM users WHERE id = ? AND role = "customer"', [id]);
        if (!user) {
            return res.status(404).json({ error: "Customer not found" });
        }

        const prevValue = user.isActive;
        const newValue = isActive ? 1 : 0;

        await db.run('UPDATE users SET isActive = ? WHERE id = ?', [newValue, id]);

        // Log the change
        await logAction(db, req.userId, 'CUSTOMER_STATUS_CHANGE', id, {
            previous: prevValue === 1 ? 'Active' : 'Inactive',
            new: newValue === 1 ? 'Active' : 'Inactive'
        });

        res.json({ message: "Customer status updated successfully", isActive: newValue === 1 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

// Update customer profile
router.patch('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const {
        fullName, mobileNumber,
        addressLine1, addressLine2, city, state, pinCode,
        locationType, dob, gender
    } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    try {
        const user = await db.get('SELECT * FROM users WHERE id = ? AND role = "customer"', [id]);
        if (!user) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Basic validation
        if (!fullName || !mobileNumber) {
            return res.status(400).json({ error: "Name and Mobile Number are required" });
        }

        if (pinCode && pinCode.toString().length !== 6) {
            return res.status(400).json({ error: "PIN code must be 6 digits" });
        }

        // Prepare update query
        await db.run(`
            UPDATE users SET 
                fullName = ?, mobileNumber = ?,
                address_line_1 = ?, address_line_2 = ?, 
                city = ?, state = ?, pin_code = ?,
                location_type = ?, dob = ?, gender = ?
            WHERE id = ?
        `, [
            fullName, mobileNumber,
            addressLine1, addressLine2,
            city, state, pinCode,
            locationType, dob, gender,
            id
        ]);

        // Log action
        await logAction(db, adminId, 'CUSTOMER_PROFILE_UPDATE', id, {
            updatedFields: Object.keys(req.body)
        });

        res.json({ message: "Customer profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Admin reset customer password
router.post('/customers/:id/reset-password', async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        const user = await db.get('SELECT * FROM users WHERE id = ? AND role = "customer"', [id]);
        if (!user) {
            return res.status(404).json({ error: "Customer not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

        // Log action
        await logAction(db, adminId, 'CUSTOMER_PASSWORD_RESET', id, {
            action: 'Admin Manual Reset'
        });

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reset password" });
    }
});

// Approve customer
router.post('/customers/:id/approve', async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.db;
    const adminId = req.userId;
    try {
        const customer = await db.get('SELECT vendor_id, approval_status FROM users WHERE id = ? AND role = "customer"', [id]);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        if (customer.approval_status !== 'PENDING') {
            return res.status(400).json({ error: "Only PENDING applications can be approved." });
        }

        await db.run('UPDATE users SET approval_status = ?, rejection_reason = NULL, isActive = 1 WHERE id = ?', ['APPROVED', id]);

        await logAction(db, adminId, 'CUSTOMER_APPROVED', id, {
            status: 'APPROVED',
            vendorId: customer.vendor_id
        });

        res.json({ message: "Customer approved successfully. Portal access enabled." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to approve customer" });
    }
});

// Reject customer
router.post('/customers/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    if (!reason) {
        return res.status(400).json({ error: "Rejection reason is required" });
    }

    try {
        const customer = await db.get('SELECT vendor_id FROM users WHERE id = ? AND role = "customer"', [id]);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        await db.run('UPDATE users SET approval_status = ?, rejection_reason = ?, isActive = 0 WHERE id = ?', ['REJECTED', reason, id]);

        await logAction(db, adminId, 'CUSTOMER_REJECTED', id, {
            status: 'REJECTED',
            reason,
            vendorId: customer.vendor_id
        });

        res.json({ message: "Customer application rejected." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reject application" });
    }
});


// Helper for audit logging
async function logAction(db, adminId, actionType, targetId, details) {
    await db.run(
        'INSERT INTO audit_logs (adminId, actionType, targetId, details) VALUES (?, ?, ?, ?)',
        [adminId, actionType, targetId, JSON.stringify(details)]
    );
}

// Update energy allocation (Phase 7: Restricted to APPROVED customers)
router.post('/allocations', async (req, res) => {
    const { userId, totalUnits, startDate, allocationName, notes, period } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    if (!userId || totalUnits === undefined || totalUnits === null) {
        return res.status(400).json({ error: "User and units are required" });
    }

    const units = parseInt(totalUnits);
    if (isNaN(units) || units < 0 || units > 1000000) {
        return res.status(400).json({ error: "Units must be a number between 0 and 1,000,000" });
    }

    try {
        const user = await db.get('SELECT fullName, approval_status FROM users WHERE id = ? AND role = "customer"', [userId]);
        if (!user) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Eligibility Rule: Only APPROVED customers
        if (user.approval_status !== 'APPROVED') {
            return res.status(403).json({ error: "Allocations can only be assigned to APPROVED customers." });
        }

        // Overlap Rule: Prevent multiple ACTIVE allocations
        const activeSub = await db.get('SELECT * FROM subscriptions WHERE userId = ? AND status = "ACTIVE"', [userId]);
        if (activeSub) {
            return res.status(400).json({ error: "Customer already has an active solar allocation." });
        }

        const effectiveStartDate = startDate || new Date().toISOString().split('T')[0];
        const effectivePeriod = period || 'Monthly';
        const effectiveName = allocationName || 'Monthly Solar Allocation';

        const result = await db.run(
            `INSERT INTO subscriptions (
                userId, totalUnits, startDate, allocation_name, notes, status, period
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, units, effectiveStartDate, effectiveName, notes, 'ACTIVE', effectivePeriod]
        );

        // Log the change
        await logAction(db, adminId, 'ALLOCATION_ASSIGNED', userId, {
            amount: units,
            startDate: effectiveStartDate,
            allocationName: effectiveName,
            notes: notes || ''
        });

        res.json({
            message: "Allocation assigned successfully",
            allocationId: result.lastID
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to assign allocation" });
    }
});



// List all support tickets
router.get('/tickets', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const tickets = await db.all(`
            SELECT 
                t.*, 
                u.fullName as customerName,
                u.consumerId as customerConsumerId
            FROM support_tickets t
            JOIN users u ON t.customerId = u.id
            ORDER BY t.createdAt DESC
        `);
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});

// Get ticket detail with responses
router.get('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.db;
    try {
        const ticket = await db.get(`
            SELECT 
                t.*, 
                u.fullName as customerName,
                u.email as customerEmail,
                u.consumerId as customerConsumerId
            FROM support_tickets t
            JOIN users u ON t.customerId = u.id
            WHERE t.id = ?
        `, [id]);

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        const responses = await db.all(`
            SELECT 
                r.*, 
                u.fullName as senderName,
                u.role as senderRole
            FROM ticket_responses r
            JOIN users u ON r.senderId = u.id
            WHERE r.ticketId = ?
            ORDER BY r.createdAt ASC
        `, [id]);

        res.json({
            ticket,
            responses: responses || []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch ticket details" });
    }
});

// Update ticket status
router.patch('/tickets/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    const allowedStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REVOKED'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        const ticket = await db.get('status FROM support_tickets WHERE id = ?', [id]);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        await db.run(
            'UPDATE support_tickets SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );

        // Log the change
        await logAction(db, adminId, 'TICKET_STATUS_CHANGE', id, {
            previous: ticket.status,
            new: status
        });

        res.json({ message: "Ticket status updated successfully", status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update ticket status" });
    }
});

// Admin reply to ticket
router.post('/tickets/:id/reply', async (req, res) => {
    const { id } = req.params;
    const { message, updateStatus } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const ticket = await db.get('SELECT status FROM support_tickets WHERE id = ?', [id]);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        await db.run('BEGIN TRANSACTION');

        // Add to responses table
        await db.run(
            'INSERT INTO ticket_responses (ticketId, senderId, message) VALUES (?, ?, ?)',
            [id, adminId, message]
        );

        // Update support_tickets main record
        let statusUpdate = '';
        const params = [message, id];
        if (updateStatus && ['IN_PROGRESS', 'RESOLVED'].includes(updateStatus)) {
            statusUpdate = ', status = ?';
            params.unshift(updateStatus);
        }

        await db.run(`
            UPDATE support_tickets 
            SET admin_reply = ?, reply_at = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP ${statusUpdate}
            WHERE id = ?
        `, params);

        await db.run('COMMIT');

        // Log the action
        await logAction(db, adminId, 'TICKET_REPLY', id, {
            statusChanged: updateStatus || ticket.status
        });

        res.json({ message: "Reply sent successfully" });
    } catch (err) {
        await db.run('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Failed to send reply" });
    }
});

// Approve Profile Change Request
router.post('/tickets/:id/approve-change', async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.db;
    const adminId = req.userId;

    try {
        const ticket = await db.get('SELECT * FROM support_tickets WHERE id = ?', [id]);
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        if (ticket.category !== 'PROFILE_UPDATE_REQUEST') {
            return res.status(400).json({ error: "Invalid ticket category for approval" });
        }

        let changeRequest;
        try {
            changeRequest = JSON.parse(ticket.description);
        } catch (e) {
            return res.status(400).json({ error: "Invalid request format" });
        }

        const { requested, type } = changeRequest;
        const customerId = ticket.customerId;

        await db.run('BEGIN TRANSACTION');

        if (type === 'contact') {
            await db.run(
                'UPDATE users SET email = ?, mobileNumber = ? WHERE id = ?',
                [requested.email, requested.mobile, customerId]
            );
        } else if (type === 'address') {
            await db.run(`
                UPDATE users SET 
                address_line_1 = ?, address_line_2 = ?, city = ?, 
                state = ?, pin_code = ?, location_type = ?
                WHERE id = ?
            `, [
                requested.address1, requested.address2, requested.city,
                requested.state, requested.pin, requested.type,
                customerId
            ]);
        }

        // Auto-close ticket
        await db.run(
            'UPDATE support_tickets SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            ['RESOLVED', id]
        );

        // Add automated system response
        await db.run(
            'INSERT INTO ticket_responses (ticketId, senderId, message) VALUES (?, ?, ?)',
            [id, adminId, 'Request Approved. Profile updated successfully.']
        );

        await logAction(db, adminId, 'PROFILE_UPDATE_APPROVED', customerId, { ticketId: id, changes: requested });

        await db.run('COMMIT');
        res.json({ message: "Profile updated and ticket resolved." });

    } catch (err) {
        await db.run('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Failed to approve changes" });
    }
});

// Reject Profile Change Request
router.post('/tickets/:id/reject-change', async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const db = req.app.locals.db;
    const adminId = req.userId;

    if (!reason) return res.status(400).json({ error: "Rejection reason is required" });

    try {
        await db.run('BEGIN TRANSACTION');

        await db.run(
            'UPDATE support_tickets SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            ['REJECTED', id] // Note: Using 'REJECTED' or 'RESOLVED' based on preference. User prompt asked for REJECTED status logic.
        );

        // Add admin response
        await db.run(
            'INSERT INTO ticket_responses (ticketId, senderId, message) VALUES (?, ?, ?)',
            [id, adminId, `Request Rejected. Reason: ${reason}`]
        );

        await logAction(db, adminId, 'PROFILE_UPDATE_REJECTED', id, { reason });

        await db.run('COMMIT');
        res.json({ message: "Request rejected." });

    } catch (err) {
        await db.run('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Failed to reject request" });
    }
});

module.exports = router;
