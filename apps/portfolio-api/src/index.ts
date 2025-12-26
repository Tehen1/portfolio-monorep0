import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import paretoRoutes from './routes/pareto.js';
import analyticsRoutes from './routes/analytics.js';
import marketRoutes from './routes/market.js';
import userRoutes from './routes/users.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { authenticateToken } from './middleware/auth.js';

// Services
import { initializeServices } from './services/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services (database, cache, etc.)
initializeServices();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
app.use(requestLogger);

// Rate limiting
app.use('/api/v1', rateLimiter);

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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/pareto', authenticateToken, paretoRoutes);
app.use('/api/v1/analytics', authenticateToken, analyticsRoutes);
app.use('/api/v1/market', authenticateToken, marketRoutes);
app.use('/api/v1/users', authenticateToken, userRoutes);

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
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio API v1.0.0 running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`📋 Full Spec: http://localhost:${PORT}/API_SPECIFICATION.md`);
});

export default app;
