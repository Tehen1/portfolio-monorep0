"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
// Simple request logger (replace with winston in production)
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip} - User: ${req.user?.id || 'anonymous'}`);
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
