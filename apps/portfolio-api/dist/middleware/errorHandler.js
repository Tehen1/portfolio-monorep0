"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const winston_1 = __importDefault(require("winston"));
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error
    winston_1.default.error('API Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        userId: req.user?.id,
        timestamp: new Date().toISOString()
    });
    // Determine error type and status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    if (err.code === 'VALIDATION_ERROR') {
        statusCode = 400;
        errorCode = err.code;
        message = err.message;
    }
    else if (err.code === 'UNAUTHORIZED') {
        statusCode = 401;
        errorCode = err.code;
        message = err.message;
    }
    else if (err.code === 'FORBIDDEN') {
        statusCode = 403;
        errorCode = err.code;
        message = err.message;
    }
    else if (err.code === 'NOT_FOUND') {
        statusCode = 404;
        errorCode = err.code;
        message = err.message;
    }
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
        message = 'Invalid input data';
    }
    else if (err.name === 'CastError') {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
        message = 'Invalid data format';
    }
    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message,
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] || 'unknown'
        }
    });
};
exports.errorHandler = errorHandler;
/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found',
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] || 'unknown'
        }
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
