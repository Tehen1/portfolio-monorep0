/**
 * Cloudflare Edge Worker for Portfolio Platform Optimization
 * Global edge computing for <50ms latency and intelligent routing
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const country = request.cf.country
  const colo = request.cf.colo
  const clientIP = request.headers.get('CF-Connecting-IP')

  // Clone request for modification
  const modifiedRequest = new Request(request)

  // Add custom headers for analytics and routing
  modifiedRequest.headers.set('X-Client-IP', clientIP)
  modifiedRequest.headers.set('X-Country', country)
  modifiedRequest.headers.set('X-Edge-Location', colo)
  modifiedRequest.headers.set('X-Request-ID', generateRequestId())

  // Bot detection and blocking
  if (isBotRequest(request)) {
    return new Response('Access Denied', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Blocked-Reason': 'Bot Detection'
      }
    })
  }

  // Geographic routing optimization
  const optimizedOrigin = await getOptimizedOrigin(url.hostname, country)
  if (optimizedOrigin) {
    modifiedRequest.headers.set('X-Origin-Override', optimizedOrigin)
  }

  // Cache optimization based on content type
  if (shouldCache(request)) {
    modifiedRequest.headers.set('X-Cache-Strategy', 'aggressive')
    modifiedRequest.headers.set('X-Cache-TTL', getCacheTTL(url.pathname))
  }

  // API rate limiting for authenticated requests
  if (url.pathname.startsWith('/api/') && requiresAuth(request)) {
    const rateLimitResult = await checkRateLimit(clientIP, url.pathname)
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.retryAfter
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retryAfter,
          'X-Rate-Limit-Remaining': rateLimitResult.remaining
        }
      })
    }
  }

  // Security headers injection
  const response = await fetch(modifiedRequest)

  // Clone response to modify headers
  const modifiedResponse = new Response(response.body, response)

  // Add security headers
  modifiedResponse.headers.set('X-Content-Type-Options', 'nosniff')
  modifiedResponse.headers.set('X-Frame-Options', 'DENY')
  modifiedResponse.headers.set('X-XSS-Protection', '1; mode=block')
  modifiedResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  modifiedResponse.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Add HSTS for HTTPS requests
  if (url.protocol === 'https:') {
    modifiedResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // Compression optimization
  if (shouldCompress(response)) {
    modifiedResponse.headers.set('Content-Encoding', 'gzip')
  }

  // Add performance monitoring headers
  modifiedResponse.headers.set('X-Response-Time', Date.now() - event.timeStamp)
  modifiedResponse.headers.set('X-Edge-Processed', 'true')

  // Web3-specific optimizations
  if (isWeb3Request(url)) {
    modifiedResponse.headers.set('X-Web3-Optimized', 'true')
    // Add CORS headers for Web3 requests
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Web3-Signature')
  }

  return modifiedResponse
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return `${timestamp}-${random}`
}

/**
 * Bot detection logic
 */
function isBotRequest(request) {
  const userAgent = request.headers.get('User-Agent') || ''
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /headless/i,
    /selenium/i,
    /puppeteer/i
  ]

  return botPatterns.some(pattern => pattern.test(userAgent))
}

/**
 * Get optimized origin based on geography
 */
async function getOptimizedOrigin(hostname, country) {
  // Define regional origins
  const regionalOrigins = {
    'EU': ['de', 'fr', 'be', 'nl', 'gb', 'it', 'es'],
    'US': ['us', 'ca'],
    'ASIA': ['jp', 'kr', 'sg', 'au', 'in']
  }

  // Determine region
  let region = 'EU' // Default
  if (regionalOrigins.US.includes(country.toLowerCase())) {
    region = 'US'
  } else if (regionalOrigins.ASIA.includes(country.toLowerCase())) {
    region = 'ASIA'
  }

  // Return region-specific origin
  const origins = {
    'antonylambi.be': {
      'EU': 'eu-west-1.portfolio.internal',
      'US': 'us-east-1.portfolio.internal',
      'ASIA': 'ap-southeast-1.portfolio.internal'
    },
    'fixie.run': {
      'EU': 'eu-west-1.portfolio.internal',
      'US': 'us-east-1.portfolio.internal',
      'ASIA': 'ap-southeast-1.portfolio.internal'
    }
    // Add other domains...
  }

  return origins[hostname]?.[region] || null
}

/**
 * Determine if request should be cached
 */
function shouldCache(request) {
  const url = new URL(request.url)
  const cacheableExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2']
  const cacheablePaths = ['/static/', '/assets/', '/images/', '/fonts/']

  return cacheableExtensions.some(ext => url.pathname.endsWith(ext)) ||
         cacheablePaths.some(path => url.pathname.startsWith(path))
}

/**
 * Get appropriate cache TTL based on content type
 */
function getCacheTTL(pathname) {
  if (pathname.includes('/static/') || pathname.includes('/assets/')) {
    return '31536000' // 1 year
  } else if (pathname.includes('/images/') || pathname.includes('/fonts/')) {
    return '86400' // 1 day
  } else {
    return '3600' // 1 hour
  }
}

/**
 * Check if request requires authentication
 */
function requiresAuth(request) {
  const authHeader = request.headers.get('Authorization')
  const cookie = request.headers.get('Cookie')

  return !!(authHeader || (cookie && cookie.includes('session')))
}

/**
 * Rate limiting logic using Cloudflare KV
 */
async function checkRateLimit(clientIP, path) {
  const key = `rate_limit:${clientIP}:${path}`
  const now = Date.now()
  const window = 60 * 1000 // 1 minute
  const limit = 100 // requests per window

  try {
    // Get current count
    let count = await RATE_LIMIT_KV.get(key)
    count = count ? parseInt(count) : 0

    // Reset if window expired
    const lastReset = await RATE_LIMIT_KV.get(`${key}:reset`)
    if (lastReset && now - parseInt(lastReset) > window) {
      count = 0
    }

    const remaining = Math.max(0, limit - count - 1)
    const allowed = count < limit

    if (allowed) {
      // Increment counter
      await RATE_LIMIT_KV.put(key, (count + 1).toString(), { expirationTtl: window / 1000 })
      if (!lastReset) {
        await RATE_LIMIT_KV.put(`${key}:reset`, now.toString(), { expirationTtl: window / 1000 })
      }
    }

    return {
      allowed,
      remaining,
      retryAfter: allowed ? 0 : Math.ceil(window / 1000)
    }
  } catch (error) {
    // Allow request on error to avoid blocking legitimate traffic
    console.error('Rate limit check error:', error)
    return { allowed: true, remaining: limit, retryAfter: 0 }
  }
}

/**
 * Determine if response should be compressed
 */
function shouldCompress(response) {
  const contentType = response.headers.get('Content-Type') || ''
  const contentLength = response.headers.get('Content-Length')

  // Compress text-based content
  const compressibleTypes = [
    'text/',
    'application/json',
    'application/javascript',
    'application/xml',
    'application/rss+xml'
  ]

  const isCompressible = compressibleTypes.some(type => contentType.includes(type))
  const isSmallEnough = !contentLength || parseInt(contentLength) > 1024

  return isCompressible && isSmallEnough
}

/**
 * Check if request is Web3-related
 */
function isWeb3Request(url) {
  return url.pathname.includes('/api/web3/') ||
         url.pathname.includes('/wallet/') ||
         url.pathname.includes('/contract/') ||
         url.hostname.includes('fixie.run') ||
         url.hostname.includes('rhymechain.win')
}

// Export for testing
export {
  generateRequestId,
  isBotRequest,
  getOptimizedOrigin,
  shouldCache,
  getCacheTTL,
  requiresAuth,
  shouldCompress,
  isWeb3Request
}