const sanitize = (req, res, next) => {
    const sanitizeValue = (val) => {
        if (typeof val === 'string') {
            return val.replace(/[<>]/g, ''); // Simple XSS prevention
        }
        if (typeof val === 'object' && val !== null) {
            for (let key in val) {
                val[key] = sanitizeValue(val[key]);
            }
        }
        return val;
    };

    if (req.body) {
        req.body = sanitizeValue(req.body);
    }
    next();
};

module.exports = sanitize;
