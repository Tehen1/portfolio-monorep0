"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const portfolio_js_1 = __importDefault(require("./routes/portfolio.js"));
const pareto_js_1 = __importDefault(require("./routes/pareto.js"));
const analytics_js_1 = __importDefault(require("./routes/analytics.js"));
const market_js_1 = __importDefault(require("./routes/market.js"));
const users_js_1 = __importDefault(require("./routes/users.js"));
// Middleware
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const logger_js_1 = require("./middleware/logger.js");
const rateLimiter_js_1 = require("./middleware/rateLimiter.js");
const auth_js_2 = require("./middleware/auth.js");
// Services
const index_js_1 = require("./services/index.js");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Initialize services (database, cache, etc.)
(0, index_js_1.initializeServices)();
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Compression
app.use((0, compression_1.default)());
// Logging
app.use(logger_js_1.requestLogger);
// Rate limiting
app.use('/api/v1', rateLimiter_js_1.rateLimiter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            database: 'connected',
            cache: 'healthy',
            paretoEngine: 'operational'
        }
    });
});
// API Documentation
app.get('/api-docs', (req, res) => {
    res.json({
        message: 'API Documentation available at /API_SPECIFICATION.md',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            portfolio: '/api/v1/portfolio',
            pareto: '/api/v1/pareto',
            analytics: '/api/v1/analytics',
            market: '/api/v1/market',
            users: '/api/v1/users'
        }
    });
});
// API Routes (v1)
app.use('/api/v1/auth', auth_js_1.default);
app.use('/api/v1/portfolio', portfolio_js_1.default);
app.use('/api/v1/pareto', auth_js_2.authenticateToken, pareto_js_1.default);
app.use('/api/v1/analytics', auth_js_2.authenticateToken, analytics_js_1.default);
app.use('/api/v1/market', auth_js_2.authenticateToken, market_js_1.default);
app.use('/api/v1/users', auth_js_2.authenticateToken, users_js_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found',
            timestamp: new Date().toISOString()
        }
    });
});
// Error handling middleware (must be last)
app.use(errorHandler_js_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio API v1.0.0 running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`📋 Full Spec: http://localhost:${PORT}/API_SPECIFICATION.md`);
});
exports.default = app;
