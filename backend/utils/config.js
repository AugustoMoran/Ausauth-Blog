require('dotenv').config()
const PORT = process.env.PORT || 3003

// Provide a sensible local fallback for development so the app can run without
// requiring the user to always set MONGODB_URI in their environment.
// In production you should always set a proper `MONGODB_URI` and rotate creds.
let MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else {
  MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bloglist'
  if (!process.env.MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.warn('Warning: MONGODB_URI not set — falling back to local mongodb://127.0.0.1:27017/bloglist')
  }
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
const SECRET = process.env.SECRET || 'dev_secret_change_me'
const REFRESH_SECRET = process.env.REFRESH_SECRET || SECRET
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'

const parsedRefreshTokenCookieMaxAgeMs = Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS)
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = Number.isFinite(parsedRefreshTokenCookieMaxAgeMs) && parsedRefreshTokenCookieMaxAgeMs > 0
  ? parsedRefreshTokenCookieMaxAgeMs
  : 7 * 24 * 60 * 60 * 1000

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

const parsedLoginRateLimitMax = Number(process.env.LOGIN_RATE_LIMIT_MAX)
const LOGIN_RATE_LIMIT_MAX = Number.isFinite(parsedLoginRateLimitMax) && parsedLoginRateLimitMax > 0
  ? parsedLoginRateLimitMax
  : 10

const parsedLoginRateLimitWindowMs = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS)
const LOGIN_RATE_LIMIT_WINDOW_MS = Number.isFinite(parsedLoginRateLimitWindowMs) && parsedLoginRateLimitWindowMs > 0
  ? parsedLoginRateLimitWindowMs
  : 15 * 60 * 1000

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_EXPIRES_IN,
  SECRET,
  REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  CORS_ORIGIN,
  LOGIN_RATE_LIMIT_MAX,
  LOGIN_RATE_LIMIT_WINDOW_MS,
}
