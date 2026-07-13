/**
 * Centralized Error Handler Middleware
 * Attach at the END of the Express middleware chain.
 * Returns a standardized JSON error format.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Log the error internally for debugging
    console.error('[Error]', err.message);

    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    const statusCode = err.status || err.statusCode || 500;
    const message =
        process.env.NODE_ENV === 'production' && statusCode === 500
            ? 'An internal server error occurred.'
            : err.message || 'An unexpected error occurred.';

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
