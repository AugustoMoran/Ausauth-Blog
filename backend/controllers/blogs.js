const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const {
  validateBody,
  blogCreateSchema,
  blogUpdateSchema,
  commentSchema,
} = require('../utils/validation')

// Lists blogs.
blogsRouter.get('/', async (request, response) => {
  const { search, author, page, limit } = request.query

  const query = {}
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ]
  }

  if (author) {
    query.author = { $regex: author, $options: 'i' }
  }

  const pageNumber = Number(page) > 0 ? Number(page) : null
  const limitNumber = Number(limit) > 0 ? Number(limit) : null

  let dbQuery = Blog.find(query)
  if (pageNumber && limitNumber) {
    dbQuery = dbQuery.skip((pageNumber - 1) * limitNumber).limit(limitNumber)
  }

  const blogs = await dbQuery.populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Creates a blog for the authenticated user.
blogsRouter.post('/', middleware.userExtractor, validateBody(blogCreateSchema), async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    content: body.content,
    likes: body.likes || 0,
    likedBy: [],
    comments: [],
    user: user._id
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Deletes a blog owned by the authenticated user.
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const user = request.user
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

// Updates a blog (likes and/or editable fields).
blogsRouter.put('/:id', middleware.userExtractor, validateBody(blogUpdateSchema), async (request, response) => {
  const { title, author, content, likes, like } = request.body

  if (likes === undefined && like === undefined && title === undefined && author === undefined && content === undefined) {
    return response.status(400).json({ error: 'no fields to update' })
  }

  const existingBlog = await Blog.findById(request.params.id)
  if (!existingBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (like === true) {
    const alreadyLiked = existingBlog.likedBy.some((entry) => entry.user.toString() === request.user._id.toString())

    if (alreadyLiked) {
      existingBlog.likedBy = existingBlog.likedBy.filter((entry) => entry.user.toString() !== request.user._id.toString())
    } else {
      existingBlog.likedBy = existingBlog.likedBy.concat({
        user: request.user._id,
        username: request.user.username,
        name: request.user.name,
      })
    }

    existingBlog.likes = existingBlog.likedBy.length

    const savedBlog = await existingBlog.save()
    await savedBlog.populate('user', { username: 1, name: 1 })
    return response.json(savedBlog)
  }

  const editingContent = title !== undefined || author !== undefined || content !== undefined
  if (editingContent && existingBlog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({ error: 'only the creator can edit this blog' })
  }

  const updatePayload = {}
  if (title !== undefined) updatePayload.title = title
  if (author !== undefined) updatePayload.author = author
  if (content !== undefined) updatePayload.content = content
  if (likes !== undefined) {
    updatePayload.likes = likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updatePayload,
    { new: true, runValidators: true }
  ).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

// Adds a comment to a blog.
blogsRouter.post('/:id/comments', middleware.userExtractor, validateBody(commentSchema), async (request, response) => {
  const { comment } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.comments = blog.comments.concat({
    text: comment,
    user: request.user._id,
    username: request.user.username,
    name: request.user.name,
  })
  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
