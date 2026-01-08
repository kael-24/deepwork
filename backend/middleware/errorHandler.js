/**
 * Central Error Handler Middleware
 * Handles all errors thrown in the application
 */
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

export const errorHandler = (err, req, res, next) => {
    const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

    console.error(`[Error Handler] Status: ${status}, Message: ${message}`, err);

    res.status(status).json({
        error: message,
        ...(process.env.IS_DEV === 'true' && { stack: err.stack }),
    });
};

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;
