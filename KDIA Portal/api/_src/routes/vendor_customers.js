const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { initDB } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// POST /api/vendor-customers - Create a new draft customer
router.post('/', authenticateToken, async (req, res) => {
    // 1. Check permissions
    if (req.userRole !== 'vendor') {
        return res.status(403).json({ error: "Access denied. Vendor role required." });
    }

    const {
        fullName,
        email,
        mobileNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        pinCode,
        locationType,
        gender,
        dob,
        leadId // Optional: to link back/update status
    } = req.body;

    // 2. Validate required fields
    if (!fullName || !email || !mobileNumber || !addressLine1 || !city || !state || !pinCode) {
        return res.status(400).json({ error: "Required fields missing (Name, Email, Mobile, Address)." });
    }

    const db = await initDB();

    try {
        // 3. Check for duplicates
        const existingUser = await db.get('SELECT * FROM users WHERE email = ? OR mobileNumber = ?', [email, mobileNumber]);
        if (existingUser) {
            return res.status(409).json({ error: "Customer with this email or mobile already exists." });
        }

        // 4. Generate Random Password (Placeholder)
        // Since this is a DRAFT, the user cannot login yet. 
        // We set a strong random password that no one knows.
        const plainPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + "A1!";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // 5. Generate Consumer ID
        const consumerId = `KDIA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 6. Insert User as DRAFT
        const result = await db.run(
            `INSERT INTO users (
                fullName, email, mobileNumber, consumerId, password, role, 
                address_line_1, address_line_2, city, state, pin_code, location_type,
                gender, dob, 
                vendor_id, onboarding_status, approval_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fullName, email, mobileNumber, consumerId, hashedPassword, 'customer',
                addressLine1, addressLine2, city, state, pinCode, locationType,
                gender, dob,
                req.userId, 'DRAFT', 'DRAFT'
            ]
        );

        // 7. Initialize Subscription & Logs (Empty/Placeholder for consistency)
        await db.run(
            'INSERT INTO subscriptions (userId, totalUnits, startDate) VALUES (?, ?, ?)',
            [result.lastID, 0, new Date().toISOString().split('T')[0]]
        );

        // 8. If Lead ID provided, update lead status to 'Converted'
        if (leadId) {
            await db.run(
                "UPDATE leads SET status = 'Converted' WHERE id = ? AND vendorId = ?",
                [leadId, req.userId]
            );
        }

        res.status(201).json({
            message: "Draft customer created successfully.",
            customerId: result.lastID,
            consumerId: consumerId
        });

    } catch (err) {
        console.error("Error creating draft customer:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/vendor-customers/stats - Get dashboard metrics for vendor
router.get('/stats', authenticateToken, async (req, res) => {
    if (req.userRole !== 'vendor') {
        return res.status(403).json({ error: "Access denied. Vendor role required." });
    }

    const db = await initDB();
    try {
        const stats = await db.get(`
            SELECT 
                (SELECT COUNT(*) FROM leads WHERE vendorId = ?) as totalLeads,
                (SELECT COUNT(*) FROM users WHERE vendor_id = ? AND role = 'customer') as totalCustomers,
                (SELECT COUNT(*) FROM users WHERE vendor_id = ? AND role = 'customer' AND approval_status = 'DRAFT') as draftCustomers,
                (SELECT COUNT(*) FROM users WHERE vendor_id = ? AND role = 'customer' AND approval_status = 'PENDING') as pendingCustomers
            FROM users LIMIT 1
        `, [req.userId, req.userId, req.userId, req.userId]);

        res.json({
            assignedLeads: stats.totalLeads || 0,
            customersOnboarded: stats.totalCustomers || 0,
            pendingActions: stats.draftCustomers || 0 // Drafts need submission
        });
    } catch (err) {
        console.error("Error fetching vendor stats:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/vendor-customers - List customers onboarded by this vendor
router.get('/', authenticateToken, async (req, res) => {
    if (req.userRole !== 'vendor') {
        return res.status(403).json({ error: "Access denied. Vendor role required." });
    }

    const db = await initDB();
    try {
        const customers = await db.all(`
            SELECT 
                u.id, u.fullName, u.email, u.mobileNumber, u.consumerId, u.approval_status,
                u.createdAt, s.totalUnits as allocatedEnergy
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.userId
            WHERE u.vendor_id = ? AND u.role = 'customer'
            ORDER BY u.createdAt DESC
        `, [req.userId]);
        res.json(customers);
    } catch (err) {
        console.error("Error fetching vendor customers:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/vendor-customers/:id/submit - Submit draft for admin approval
router.post('/:id/submit', authenticateToken, async (req, res) => {
    if (req.userRole !== 'vendor') {
        return res.status(403).json({ error: "Access denied. Vendor role required." });
    }

    const { id } = req.params;
    const db = await initDB();

    try {
        const customer = await db.get('SELECT * FROM users WHERE id = ? AND vendor_id = ? AND role = "customer"', [id, req.userId]);
        if (!customer) return res.status(404).json({ error: "Customer not found or access denied." });

        if (customer.approval_status !== 'DRAFT') {
            return res.status(400).json({ error: `Cannot submit customer in ${customer.approval_status} status.` });
        }

        await db.run('UPDATE users SET approval_status = ? WHERE id = ?', ['PENDING', id]);

        // Log the submission action
        await logAction(db, req.userId, 'CUSTOMER_SUBMITTED_FOR_APPROVAL', id, {
            vendorId: req.userId,
            customerName: customer.fullName
        });

        res.json({ message: "Application submitted for admin review." });
    } catch (err) {
        console.error("Error submitting customer:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Helper for audit logging
async function logAction(db, adminId, actionType, targetId, details) {
    await db.run(
        'INSERT INTO audit_logs (adminId, actionType, targetId, details) VALUES (?, ?, ?, ?)',
        [adminId, actionType, targetId, JSON.stringify(details)]
    );
}

module.exports = router;
