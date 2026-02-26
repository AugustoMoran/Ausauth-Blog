const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const User = require('../models/user')
const config = require('../utils/config')

const createAccessToken = (user) => jwt.sign(
  {
    username: user.username,
    id: user._id,
    type: 'access',
  },
  config.SECRET,
  { expiresIn: config.JWT_EXPIRES_IN }
)

const createRefreshToken = (user, jti) => jwt.sign(
  {
    id: user._id,
    type: 'refresh',
    jti,
  },
  config.REFRESH_SECRET,
  { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN }
)

const verifyCredentials = async ({ username, password }) => {
  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return null
  }

  return user
}

const issueSessionTokens = async (user) => {
  const accessToken = createAccessToken(user)
  const refreshTokenJti = crypto.randomUUID()
  const refreshToken = createRefreshToken(user, refreshTokenJti)

  user.refreshTokenJti = refreshTokenJti
  user.lastActivityAt = new Date()
  await user.save()

  return {
    accessToken,
    refreshToken,
  }
}

const rotateSessionTokens = async (refreshToken) => {
  if (!refreshToken) {
    return { error: 'refresh token missing' }
  }

  let decoded
  try {
    decoded = jwt.verify(refreshToken, config.REFRESH_SECRET)
  } catch (_error) {
    return { error: 'refresh token invalid' }
  }

  if (decoded.type !== 'refresh') {
    return { error: 'wrong token type' }
  }

  const user = await User.findById(decoded.id)
  if (!user || !user.refreshTokenJti) {
    return { error: 'user session not found' }
  }

  if (user.refreshTokenJti !== decoded.jti) {
    return { error: 'refresh token revoked' }
  }

  const nextRefreshTokenJti = crypto.randomUUID()
  const nextRefreshToken = createRefreshToken(user, nextRefreshTokenJti)
  const nextAccessToken = createAccessToken(user)

  user.refreshTokenJti = nextRefreshTokenJti
  user.lastActivityAt = new Date()
  await user.save()

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  }
}

const revokeSessionFromRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return
  }

  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET)
    const user = await User.findById(decoded.id)
    if (user) {
      user.refreshTokenJti = null
      user.lastActivityAt = null
      await user.save()
    }
  } catch (_error) {
    // Ignore invalid refresh token on logout.
  }
}

module.exports = {
  verifyCredentials,
  issueSessionTokens,
  rotateSessionTokens,
  revokeSessionFromRefreshToken,
}
