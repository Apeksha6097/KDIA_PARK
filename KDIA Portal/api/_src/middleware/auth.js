const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'kdia-secret-key-123';

const authenticateToken = async (req, res, next) => {
    const db = req.app.locals.db;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fast DB check for isActive status
        const user = await db.get('SELECT isActive FROM users WHERE id = ?', [decoded.userId]);
        if (!user || user.isActive === 0) {
            return res.status(403).json({ error: "Account inactive or not found. Please contact support." });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized or invalid session" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: "Access denied: Admins only" });
    }
    next();
};

module.exports = { authenticateToken, adminMiddleware };

