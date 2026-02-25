const { z } = require('zod')

const usernameSchema = z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'username must be alphanumeric (underscore allowed)')
const passwordSchema = z.string().min(3).max(72)

const registerSchema = z.object({
  username: usernameSchema,
  name: z.string().trim().min(1).max(80),
  password: passwordSchema,
}).strict()

const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
}).strict()

const blogCreateSchema = z.object({
  title: z.string().trim().min(1).max(140),
  author: z.string().trim().max(80).optional().default(''),
  content: z.string().trim().min(1).max(5000),
  likes: z.number().int().min(0).optional().default(0),
}).strict()

const blogUpdateSchema = z.object({
  title: z.string().trim().min(1).max(140).optional(),
  author: z.string().trim().max(80).optional(),
  content: z.string().trim().min(1).max(5000).optional(),
  likes: z.number().int().min(0).optional(),
  like: z.boolean().optional(),
}).strict()

const commentSchema = z.object({
  comment: z.string().trim().min(1).max(1000),
}).strict()

const validateBody = (schema) => (request, response, next) => {
  const parsed = schema.safeParse(request.body)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return response.status(400).json({ error: issue?.message || 'invalid request body' })
  }

  request.body = parsed.data
  next()
}

module.exports = {
  validateBody,
  registerSchema,
  loginSchema,
  blogCreateSchema,
  blogUpdateSchema,
  commentSchema,
}
