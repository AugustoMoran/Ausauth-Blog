const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')
const openApiSpec = require('./docs/openapi')
const path = require('path')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
logger.info('connecting to', config.MONGODB_URI)

const loginLimiter = rateLimit({
  windowMs: config.LOGIN_RATE_LIMIT_WINDOW_MS,
  max: config.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too many login attempts, please try again later' },
  skip: () => process.env.NODE_ENV === 'test',
})

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginLimiter, loginRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))

if (process.env.NODE_ENV !== 'production') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// Serve frontend static files from /public (if present)
app.use(express.static(path.join(__dirname, 'public')))

// root health/info endpoint for API clients
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Ausauth Blog API running' })
})

// SPA fallback: serve index.html for non-API GET requests so client-side routing works
app.get('/*', (req, res, next) => {
  if (req.method !== 'GET') return next()
  if (req.path.startsWith('/api') || req.path.startsWith('/docs') || req.path.startsWith('/api/docs')) return next()
  const indexPath = path.join(__dirname, 'public', 'index.html')
  res.sendFile(indexPath, (err) => {
    if (err) next()
  })
})
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
