const config = require('../utils/config')

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Bloglist API',
    version: '1.0.0',
    description: 'API for authentication, users and blogs.',
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}`,
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'testuser' },
          password: { type: 'string', example: 'testpass123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          accessToken: { type: 'string' },
          expiresIn: { type: 'string', example: '1h' },
          username: { type: 'string', example: 'testuser' },
          name: { type: 'string', example: 'Test User' },
        },
      },
      UserCreateRequest: {
        type: 'object',
        required: ['username', 'name', 'password'],
        properties: {
          username: { type: 'string', example: 'testuser' },
          name: { type: 'string', example: 'Test User' },
          password: { type: 'string', example: 'testpass123' },
        },
      },
      BlogCreateRequest: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'My first blog' },
          author: { type: 'string', example: 'Augusto Moran' },
          content: { type: 'string', example: 'This is the blog content.' },
          likes: { type: 'integer', minimum: 0, example: 0 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user and start session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login success',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/login/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rotate refresh token and issue new access token',
        responses: {
          200: { description: 'Refresh success' },
          401: {
            description: 'Refresh failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/login/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and invalidate refresh session',
        responses: {
          204: { description: 'Logout success' },
        },
      },
    },
    '/api/users': {
      post: {
        tags: ['Users'],
        summary: 'Create user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserCreateRequest' },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
          400: { description: 'Validation error' },
        },
      },
      get: {
        tags: ['Users'],
        summary: 'List users',
        responses: {
          200: { description: 'Users listed' },
        },
      },
    },
    '/api/blogs': {
      get: {
        tags: ['Blogs'],
        summary: 'List blogs',
        responses: {
          200: { description: 'Blogs listed' },
        },
      },
      post: {
        tags: ['Blogs'],
        summary: 'Create blog',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BlogCreateRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Blog created' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
}

module.exports = openApiSpec
