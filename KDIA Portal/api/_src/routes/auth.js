const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
}
const ACTUAL_SECRET = JWT_SECRET || 'kdia-dev-fallback-key-safe-for-local-only';

// Password validation function
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

router.post('/register', async (req, res) => {
    let {
        fullName,
        email,
        mobileNumber,
        consumerId,
        password,
        addressLine1,
        addressLine2,
        city,
        state,
        pinCode,
        locationType,
        dob,
        gender,
        alternateMobile,
        preferredComm,
        occupancyType
    } = req.body;
    const db = req.app.locals.db;

    // Basic validation
    if (!fullName || !email || !mobileNumber || !password || !addressLine1 || !city || !state || !pinCode || !dob || !gender) {
        return res.status(400).json({ error: "Required fields are missing. Please complete all mandatory fields including Date of Birth and Gender." });
    }

    // DOB Validation (18+)
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        return res.status(400).json({ error: "Infrastructure enrollment requires a minimum age of 18 years." });
    }

    if (birthDate > today) {
        return res.status(400).json({ error: "Date of Birth cannot be in the future." });
    }

    // PIN Code validation
    const sanitizedPin = (pinCode || '').toString().trim().replace(/\D/g, '');
    if (sanitizedPin.length !== 6) {
        return res.status(400).json({ error: "PIN code must be exactly 6 digits." });
    }

    // Address validation
    if (addressLine1.trim().length < 5) {
        return res.status(400).json({ error: "Address Line 1 must be at least 5 characters long." });
    }

    // Auto-generate consumerId if not provided
    if (!consumerId) {
        consumerId = `KDIA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
        });
    }

    // Mobile number validation
    let sanitizedMobile = mobileNumber.toString().trim();
    if (sanitizedMobile.startsWith('+91')) {
        sanitizedMobile = sanitizedMobile.substring(3);
    }
    sanitizedMobile = sanitizedMobile.replace(/\D/g, '');

    if (sanitizedMobile.length !== 10) {
        return res.status(400).json({ error: "Mobile number must be exactly 10 digits." });
    }
    // Update mobileNumber with sanitized version for DB
    mobileNumber = sanitizedMobile;

    try {
        // Check if user already exists
        const existingUser = await db.get('SELECT * FROM users WHERE email = ? OR consumerId = ?', [email, consumerId]);
        if (existingUser) {
            return res.status(400).json({ error: "User with this email or Consumer ID already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user (default role is 'customer', status is 'PENDING')
        const result = await db.run(
            `INSERT INTO users (
                fullName, email, mobileNumber, consumerId, password, role, approval_status,
                address_line_1, address_line_2, city, state, pin_code, location_type,
                dob, gender, alternate_mobile, preferred_comm, occupancy_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fullName, email, mobileNumber, consumerId, hashedPassword, 'customer', 'PENDING',
                addressLine1, addressLine2, city, state, sanitizedPin, locationType,
                dob, gender, alternateMobile, preferredComm, occupancyType
            ]
        );

        // Mock initialize subscription data for this new user
        await db.run(
            'INSERT INTO subscriptions (userId, totalUnits, startDate) VALUES (?, ?, ?)',
            [result.lastID, 1000, new Date().toISOString().split('T')[0]]
        );

        // Mock initialize some consumption logs
        await db.run(
            'INSERT INTO consumption_logs (userId, unitsConsumed, month) VALUES (?, ?, ?)',
            [result.lastID, 150, '2025-12']
        );

        res.status(201).json({ message: "User registered successfully", userId: result.lastID });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "A system error occurred during registration. Please try again." });
    }
});

// Vendor Registration Route
router.post('/vendor/register', async (req, res) => {
    let {
        fullName,
        email,
        mobileNumber,
        consumerId, // Vendors might provide a Business ID here
        password,
        addressLine1,
        addressLine2,
        city,
        state,
        pinCode,
        locationType
    } = req.body;
    const db = req.app.locals.db;

    // Basic validation (Similar to customer but adapted)
    if (!fullName || !email || !mobileNumber || !password || !addressLine1 || !city || !state || !pinCode) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    // PIN Code validation
    const sanitizedPin = (pinCode || '').toString().trim().replace(/\D/g, '');
    if (sanitizedPin.length !== 6) {
        return res.status(400).json({ error: "PIN code must be exactly 6 digits." });
    }

    // Auto-generate ID if not provided
    if (!consumerId) {
        consumerId = `VEND-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
        });
    }

    // Mobile number validation
    let sanitizedMobile = mobileNumber.toString().trim();
    if (sanitizedMobile.startsWith('+91')) {
        sanitizedMobile = sanitizedMobile.substring(3);
    }
    sanitizedMobile = sanitizedMobile.replace(/\D/g, '');

    if (sanitizedMobile.length !== 10) {
        return res.status(400).json({ error: "Mobile number must be exactly 10 digits." });
    }
    mobileNumber = sanitizedMobile;

    try {
        // Check if user already exists
        const existingUser = await db.get('SELECT * FROM users WHERE email = ? OR consumerId = ?', [email, consumerId]);
        if (existingUser) {
            return res.status(400).json({ error: "User with this email or ID already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user (role='vendor', approval_status='PENDING')
        const result = await db.run(
            `INSERT INTO users (
                fullName, email, mobileNumber, consumerId, password, role, approval_status,
                address_line_1, address_line_2, city, state, pin_code, location_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fullName, email, mobileNumber, consumerId, hashedPassword, 'vendor', 'PENDING',
                addressLine1, addressLine2, city, state, sanitizedPin, locationType
            ]
        );

        res.status(201).json({ message: "Vendor registration successful. Approval pending.", userId: result.lastID });
    } catch (err) {
        console.error("Vendor Registration Error:", err);
        res.status(500).json({ error: "A system error occurred during registration. Please try again." });
    }
});

router.post('/login', async (req, res) => {
    const { loginId, password } = req.body;
    const db = req.app.locals.db;

    if (!loginId || !password) {
        return res.status(400).json({ error: "Login ID and password are required" });
    }

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ? OR mobileNumber = ?', [loginId, loginId]);

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if user is active
        if (user.isActive === 0) {
            return res.status(403).json({ error: "Your account is inactive. Please contact your system administrator." });
        }

        // Check for lock
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(423).json({ error: "Account temporary locked. Try again later." });
        }

        // Phase 6B: Status-based login gating
        if (user.role === 'customer') {
            if (user.approval_status === 'REJECTED') {
                return res.status(403).json({
                    error: "Access Denied. Your application was not approved.",
                    reason: user.rejection_reason
                });
            }
            if (user.approval_status === 'PENDING' || user.approval_status === 'DRAFT') {
                return res.status(403).json({ error: "Your application is currently under review. Please check back later." });
            }
        } else if (user.role === 'vendor') {
            // Vendors already have similar logic in some implementations, ensuring consistency here if needed
            if (user.approval_status === 'PENDING') {
                return res.status(403).json({ error: "Your vendor application is pending admin approval." });
            }
            if (user.approval_status === 'REJECTED') {
                return res.status(403).json({ error: "Your vendor application has been rejected." });
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const newAttempts = user.loginAttempts + 1;
            let lockUntil = 0;
            if (newAttempts >= 5) {
                lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
            }
            await db.run('UPDATE users SET loginAttempts = ?, lockUntil = ? WHERE id = ?', [newAttempts, lockUntil, user.id]);

            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Reset attempts on success
        await db.run('UPDATE users SET loginAttempts = 0, lockUntil = 0 WHERE id = ?', [user.id]);

        const token = jwt.sign({ userId: user.id, role: user.role }, ACTUAL_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                consumerId: user.consumerId,
                role: user.role,
                approvalStatus: user.approval_status || 'APPROVED' // Default to APPROVED if column is null (migration safety)
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "A system error occurred during authentication. Please try again." });
    }
});

module.exports = router;
