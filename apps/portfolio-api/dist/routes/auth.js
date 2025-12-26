"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Mock user database (replace with real database in production)
const users = [
    {
        id: 'user_123',
        email: 'anthony@antonylambi.be',
        password: '$2a$10$hashedpassword', // bcrypt hash
        name: 'Anthony Lambi',
        role: 'admin'
    }
];
/**
 * POST /auth/login
 * Authenticate user and get JWT token
 */
router.post('/login', auth_js_1.authValidation.login, auth_js_1.handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user (mock implementation)
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid credentials',
                    timestamp: new Date().toISOString()
                }
            });
        }
        // Verify password (mock - use bcrypt in production)
        if (password !== 'password123') { // Mock password check
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid credentials',
                    timestamp: new Date().toISOString()
                }
            });
        }
        // Generate token
        const token = (0, auth_js_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role
        });
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token,
                expiresIn: 3600
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Login failed',
                timestamp: new Date().toISOString()
            }
        });
    }
});
/**
 * POST /auth/register
 * Register new user
 */
router.post('/register', auth_js_1.authValidation.register, auth_js_1.handleValidationErrors, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'User already exists',
                    timestamp: new Date().toISOString()
                }
            });
        }
        // Create user (mock implementation)
        const newUser = {
            id: `user_${Date.now()}`,
            email,
            password: '$2a$10$mockhash', // Mock hash
            name,
            role: 'user'
        };
        users.push(newUser);
        // Generate token
        const token = (0, auth_js_1.generateToken)({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        });
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role
                },
                token,
                expiresIn: 3600
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Registration failed',
                timestamp: new Date().toISOString()
            }
        });
    }
});
/**
 * POST /auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', async (req, res) => {
    // Implementation would validate refresh token and issue new access token
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Token refresh not implemented',
            timestamp: new Date().toISOString()
        }
    });
});
exports.default = router;
