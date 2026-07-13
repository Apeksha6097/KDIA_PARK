const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');

// GET /api/profile - Fetch user profile data
router.get('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = req.userId;

        const user = await db.get(
            `SELECT 
                id, fullName, email, mobileNumber, consumerId, role,
                address_line_1, address_line_2, city, state, pin_code, location_type,
                dob, gender, alternate_mobile, preferred_comm, occupancy_type
            FROM users 
            WHERE id = ?`,
            [userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Format response with camelCase for frontend
        const profileData = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            consumerId: user.consumerId,
            role: user.role,
            addressLine1: user.address_line_1,
            addressLine2: user.address_line_2,
            city: user.city,
            state: user.state,
            pinCode: user.pin_code,
            locationType: user.location_type,
            dob: user.dob,
            gender: user.gender,
            alternateMobile: user.alternate_mobile,
            preferredComm: user.preferred_comm,
            occupancyType: user.occupancy_type
        };

        res.json(profileData);
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch profile data' });
    }
});

// POST /api/profile/change-password - Change user password
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        // Password strength validation
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasDigit = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        if (!hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
            return res.status(400).json({
                error: 'Password must contain uppercase, lowercase, digit, and special character'
            });
        }

        // Fetch current user
        const user = await db.get('SELECT id, password FROM users WHERE id = ?', [userId]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and reset login attempts
        await db.run(
            'UPDATE users SET password = ?, loginAttempts = 0 WHERE id = ?',
            [hashedPassword, userId]
        );

        // Log security change for compliance
        await db.run(
            `INSERT INTO audit_logs (adminId, actionType, targetId, details) 
             VALUES (?, ?, ?, ?)`,
            [userId, 'PASSWORD_CHANGE', userId, 'User changed their own password']
        );

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Password change error:', err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;
