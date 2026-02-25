require('dotenv').config()
const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
const REFRESH_SECRET = process.env.REFRESH_SECRET || process.env.SECRET
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
  REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  CORS_ORIGIN,
  LOGIN_RATE_LIMIT_MAX,
  LOGIN_RATE_LIMIT_WINDOW_MS,
}
