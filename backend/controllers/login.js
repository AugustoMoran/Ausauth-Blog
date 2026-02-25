const loginRouter = require('express').Router()
const config = require('../utils/config')
const { validateBody, loginSchema } = require('../utils/validation')
const authService = require('../services/authService')

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: config.REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  path: '/api/login',
}

// Handles user login and token issuance.
loginRouter.post('/', validateBody(loginSchema), async (request, response) => {
  const { username, password } = request.body

  const user = await authService.verifyCredentials({ username, password })
  if (!user) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const { accessToken, refreshToken } = await authService.issueSessionTokens(user)

  response.cookie('refreshToken', refreshToken, refreshCookieOptions)

  response
    .status(200)
    .send({ 
      token: accessToken,
      accessToken,
      expiresIn: config.JWT_EXPIRES_IN,
      username: user.username,
      name: user.name
    })
})

loginRouter.post('/refresh', async (request, response) => {
  const rotated = await authService.rotateSessionTokens(request.cookies?.refreshToken)

  if (rotated.error) {
    return response.status(401).json({ error: rotated.error })
  }

  response.cookie('refreshToken', rotated.refreshToken, refreshCookieOptions)

  return response.status(200).json({
    token: rotated.accessToken,
    accessToken: rotated.accessToken,
    expiresIn: config.JWT_EXPIRES_IN,
  })
})

loginRouter.post('/logout', async (request, response) => {
  await authService.revokeSessionFromRefreshToken(request.cookies?.refreshToken)

  response.clearCookie('refreshToken', refreshCookieOptions)
  return response.status(204).end()
})

module.exports = loginRouter
