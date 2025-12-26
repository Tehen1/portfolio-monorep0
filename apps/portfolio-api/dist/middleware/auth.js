"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.authValidation = exports.generateRefreshToken = exports.generateToken = exports.requireRole = exports.validateApiKey = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
/**
 * Authenticate JWT token middleware
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Access token required',
                timestamp: new Date().toISOString()
            }
        });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Invalid or expired token',
                    timestamp: new Date().toISOString()
                }
            });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
/**
 * Validate API key middleware
 */
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'API key required',
                timestamp: new Date().toISOString()
            }
        });
    }
    // In production, validate against database
    const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
    if (!validApiKeys.includes(apiKey)) {
        return res.status(403).json({
            success: false,
            error: {
                code: 'FORBIDDEN',
                message: 'Invalid API key',
                timestamp: new Date().toISOString()
            }
        });
    }
    next();
};
exports.validateApiKey = validateApiKey;
/**
 * Check user permissions middleware
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                    timestamp: new Date().toISOString()
                }
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions',
                    timestamp: new Date().toISOString()
                }
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign(user, JWT_SECRET, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign(user, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Validation rules for authentication
 */
exports.authValidation = {
    login: [
        (0, express_validator_1.body)('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Valid email is required'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    register: [
        (0, express_validator_1.body)('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Valid email is required'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 8 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
        (0, express_validator_1.body)('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
    ],
    changePassword: [
        (0, express_validator_1.body)('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        (0, express_validator_1.body)('newPassword')
            .isLength({ min: 8 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('New password must be at least 8 characters with uppercase, lowercase, and number')
    ]
};
/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.array().map(err => ({
                    field: err.param,
                    reason: err.msg
                })),
                timestamp: new Date().toISOString()
            }
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
