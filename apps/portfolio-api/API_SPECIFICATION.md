# 🎯 Portfolio Management API - RESTful Specification

**Version:** 1.0.0
**Base URL:** `https://api.portfolio.com/v1`
**Authentication:** JWT Bearer Token + API Key
**Rate Limiting:** 1000 requests/hour per user

## 📋 Table of Contents
- [Authentication](#authentication)
- [Portfolio Items (CRUD)](#portfolio-items-crud)
- [Pareto Optimization](#pareto-optimization)
- [Analytics & Reporting](#analytics--reporting)
- [Real-time Data](#real-time-data)
- [User Management](#user-management)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### POST /auth/login
**Authenticate user and get JWT token**

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "Anthony Lambi",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Security:** Rate limited to 5 attempts per 15 minutes

### POST /auth/register
**Register new user**

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "Anthony Lambi"
}
```

### POST /auth/refresh
**Refresh JWT token**

**Headers:**
```
Authorization: Bearer <refresh_token>
```

---

## 📊 Portfolio Items (CRUD)

### GET /portfolio/items
**List all portfolio items**

**Query Parameters:**
- `type` (optional): `domain|project|asset`
- `priority` (optional): `CRITICAL|HIGH|SUPPORTING|EMERGING`
- `limit` (optional): number (default: 50)
- `offset` (optional): number (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "domain_tech_review",
        "type": "domain",
        "name": "Tech Review Blog",
        "url": "tech-review-blog.com",
        "priority": "CRITICAL",
        "y1Revenue": 608000,
        "roi": 340,
        "weeklyHours": 8,
        "focus": "5 high-comm articles",
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-12-14T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 11,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### POST /portfolio/items
**Create new portfolio item**

**Request:**
```json
{
  "type": "domain",
  "name": "New Domain",
  "url": "newdomain.com",
  "priority": "EMERGING",
  "y1Revenue": 100000,
  "roi": 200,
  "weeklyHours": 2,
  "focus": "Market research"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": "domain_new_domain",
      "type": "domain",
      "name": "New Domain",
      "url": "newdomain.com",
      "priority": "EMERGING",
      "y1Revenue": 100000,
      "roi": 200,
      "weeklyHours": 2,
      "focus": "Market research",
      "createdAt": "2025-12-14T01:54:00Z",
      "updatedAt": "2025-12-14T01:54:00Z"
    }
  }
}
```

### GET /portfolio/items/{id}
**Get portfolio item by ID**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": "domain_tech_review",
      "type": "domain",
      "name": "Tech Review Blog",
      "url": "tech-review-blog.com",
      "priority": "CRITICAL",
      "y1Revenue": 608000,
      "roi": 340,
      "weeklyHours": 8,
      "focus": "5 high-comm articles",
      "paretoInsights": {
        "revenueConcentration": "80% revenue from 20% of content",
        "effortDistribution": "40% time: 5 high-commission reviews/week",
        "optimizationStrategy": "Focus on ChatGPT, Midjourney, NordVPN"
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-12-14T00:00:00Z"
    }
  }
}
```

### PUT /portfolio/items/{id}
**Update portfolio item**

**Request:**
```json
{
  "y1Revenue": 650000,
  "weeklyHours": 9,
  "focus": "6 high-comm articles"
}
```

### DELETE /portfolio/items/{id}
**Delete portfolio item**

**Response (204):** No Content

---

## 🎯 Pareto Optimization

### GET /pareto/rankings
**Get Pareto domain rankings**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "domainId": "tech-review-blog",
        "currentPriority": "CRITICAL",
        "recommendedPriority": "CRITICAL",
        "revenueImpact": 121600,
        "effortReduction": 0.48,
        "roiImprovement": 68,
        "optimizationActions": [
          "Publish 5 high-commission affiliate articles/week",
          "Focus on ChatGPT, Midjourney, NordVPN comparisons"
        ],
        "timeframe": "Q1"
      }
    ],
    "metadata": {
      "totalDomains": 11,
      "paretoRatio": 0.82,
      "lastCalculated": "2025-12-14T01:54:00Z"
    }
  }
}
```

### GET /pareto/allocations
**Get optimal effort allocation**

**Query Parameters:**
- `totalHours` (optional): number (default: 40)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "allocations": [
      {
        "domainId": "tech-review-blog",
        "weeklyHours": 8.0,
        "focus": "5 high-comm articles",
        "roiPerHour": 9500,
        "totalWeeklyEffort": 20.0
      }
    ],
    "summary": {
      "totalHours": 40,
      "efficiencyScore": 87.5,
      "paretoCompliance": 95.2
    }
  }
}
```

### GET /pareto/forecasts
**Get revenue forecasts**

**Query Parameters:**
- `domainId` (optional): filter by specific domain
- `scenario` (optional): `conservative|aggressive|expected`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "forecasts": [
      {
        "domainId": "tech-review-blog",
        "conservative": 731520,
        "aggressive": 975360,
        "expected": 853440,
        "growthFactor": 1.4,
        "confidence": 0.85,
        "keyDrivers": [
          "High-commission affiliate content",
          "SEO traffic growth"
        ],
        "risks": [
          "Affiliate program policy changes",
          "Competition from similar blogs"
        ]
      }
    ]
  }
}
```

### GET /pareto/analytics
**Get analytics dashboard data**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 4598000,
      "totalDomains": 11,
      "averageROI": 171.8,
      "paretoRatio": 80,
      "efficiencyScore": 89.45
    },
    "domainPerformance": [
      {
        "domainId": "tech-review-blog",
        "revenue": 608000,
        "roi": 340,
        "efficiency": 95.2,
        "priority": "CRITICAL",
        "trend": "up"
      }
    ],
    "forecasts": {
      "conservative": 3359400,
      "aggressive": 5537400,
      "expected": 4448400,
      "confidence": 82.5
    },
    "alerts": [
      {
        "type": "warning",
        "message": "Low efficiency: Revenue impact vs effort",
        "domainId": "some_domain",
        "impact": 25000
      }
    ]
  }
}
```

---

## 📈 Analytics & Reporting

### GET /analytics/metrics
**Get real-time metrics**

**Query Parameters:**
- `period` (optional): `hour|day|week|month`
- `metrics` (optional): comma-separated list

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioEfficiency": 89.45,
    "paretoCompliance": 95.2,
    "revenueConcentration": 82.1,
    "effortOptimization": 87.3,
    "forecastAccuracy": 91.5,
    "riskScore": 23.4,
    "timestamp": "2025-12-14T01:54:00Z"
  }
}
```

### GET /analytics/reports/{type}
**Generate analytics report**

**Path Parameters:**
- `type`: `performance|pareto|forecast|allocation`

**Query Parameters:**
- `timeframe`: `weekly|monthly|quarterly`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "report": {
      "type": "pareto",
      "timeframe": "monthly",
      "period": "Monthly report (2025-11-14 to 2025-12-14)",
      "kpiTrends": {
        "portfolioEfficiency": { "change": 5.2, "trend": "improving" },
        "paretoCompliance": { "change": -2.1, "trend": "stable" }
      },
      "topPerformers": ["tech-review-blog", "antonylambi"],
      "underperformers": ["emerging_domain_1"],
      "recommendations": [
        "Focus more resources on tech-review-blog",
        "Review strategy for emerging domains"
      ],
      "risks": [
        "Market competition may impact affiliate revenue",
        "Regulatory changes could affect emerging domains"
      ]
    },
    "generatedAt": "2025-12-14T01:54:00Z"
  }
}
```

### POST /analytics/reports
**Create custom report**

**Request:**
```json
{
  "type": "custom",
  "name": "Q1 Planning Report",
  "metrics": ["paretoCompliance", "revenueConcentration"],
  "domains": ["tech-review-blog", "antonylambi"],
  "timeframe": {
    "start": "2025-01-01",
    "end": "2025-03-31"
  },
  "format": "json"
}
```

---

## 📡 Real-time Data

### GET /market/stock/{symbol}
**Get stock price data**

**Path Parameters:**
- `symbol`: Stock ticker (e.g., "AAPL", "GOOGL")

**Response (200):**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "price": 192.53,
    "change": 2.34,
    "changePercent": 1.23,
    "volume": 45238900,
    "marketCap": 2950000000000,
    "lastUpdated": "2025-12-14T01:54:00Z",
    "source": "Alpha Vantage"
  }
}
```

### GET /market/crypto/{symbol}
**Get cryptocurrency data**

**Path Parameters:**
- `symbol`: Crypto symbol (e.g., "BTC", "ETH")

**Response (200):**
```json
{
  "success": true,
  "data": {
    "symbol": "BTC",
    "name": "Bitcoin",
    "price": 43250.00,
    "change24h": 1250.50,
    "changePercent24h": 2.98,
    "volume24h": 28500000000,
    "marketCap": 845000000000,
    "lastUpdated": "2025-12-14T01:54:00Z",
    "source": "CoinGecko"
  }
}
```

### GET /market/forex/{pair}
**Get forex rates**

**Path Parameters:**
- `pair`: Currency pair (e.g., "EURUSD", "GBPJPY")

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pair": "EURUSD",
    "rate": 1.0825,
    "change": 0.0021,
    "changePercent": 0.19,
    "lastUpdated": "2025-12-14T01:54:00Z",
    "source": "Forex API"
  }
}
```

---

## 👤 User Management

### GET /users/profile
**Get user profile**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "anthony@antonylambi.be",
      "name": "Anthony Lambi",
      "role": "admin",
      "preferences": {
        "theme": "dark",
        "notifications": true,
        "defaultTimeframe": "monthly"
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "lastLogin": "2025-12-14T01:00:00Z"
    }
  }
}
```

### PUT /users/profile
**Update user profile**

**Request:**
```json
{
  "name": "Anthony Lambi",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

### POST /users/change-password
**Change user password**

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword"
}
```

---

## 🚨 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2025-12-14T01:54:00Z",
    "requestId": "req_123456"
  }
}
```

### Error Codes
- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error
- `EXTERNAL_API_ERROR` (502): Third-party API failure

---

## 🔒 Security & Rate Limiting

### Authentication Headers
```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>
```

### Rate Limiting
- **General endpoints**: 1000 requests/hour per user
- **Authentication endpoints**: 5 attempts/15 minutes per IP
- **Market data endpoints**: 100 requests/minute per user
- **Analytics endpoints**: 50 requests/hour per user

### CORS Configuration
```javascript
{
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}
```

### Input Validation
All endpoints use comprehensive input validation with sanitization and SQL injection prevention.

---

## 📊 Monitoring & Logging

### Health Check
**GET /health**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-14T01:54:00Z",
  "services": {
    "database": "connected",
    "cache": "healthy",
    "externalAPIs": "operational"
  }
}
```

### Metrics Endpoint
**GET /metrics**
Returns Prometheus-compatible metrics for monitoring.

---

## 🔄 API Versioning

- **Current Version**: v1
- **Version Header**: `Accept-Version: v1`
- **URL Versioning**: `/v1/resource`
- **Backward Compatibility**: Maintained for 12 months

---

## 📚 SDK & Documentation

### OpenAPI Specification
Available at: `GET /api-docs`

### Client SDKs
- JavaScript/TypeScript: `@portfolio/api-client`
- Python: `portfolio-api-client`

### Webhooks
Support for real-time notifications on portfolio changes and alerts.

---

**For implementation details, see the code examples in the `/src` directory.**
