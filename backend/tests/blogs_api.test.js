const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'secreto123'
    }

    await api.post('/api/users').send(newUser)
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'secreto123' })

    token = loginResponse.body.token
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 0)
  })

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
      assert.ok(blog.id, 'Blog should have id property')
      assert.strictEqual(blog._id, undefined, 'Blog should not have _id property')
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Edsger W. Dijkstra',
      content: 'Useful notes about async/await patterns.',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    assert.ok(titles.includes('async/await simplifies making async calls'))
  })

  test('likes defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      content: 'A blog post without explicit likes.'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await api.get('/api/blogs')
    const addedBlog = blogsAtEnd.body.find(b => b.title === 'Blog without likes')
    assert.strictEqual(addedBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test Author',
      content: 'Missing title should fail.',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, 0)
  })

  test('blog without content is not added', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, 0)
  })

  test('a blog can be deleted', async () => {
    const newBlog = { title: 'To Delete', author: 'Test', content: 'Delete me content' }
    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, 0)
  })

  test('deleting non-existing blog returns 404', async () => {
    const nonExistingId = '507f1f77bcf86cd799439011'
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('a blog can be updated', async () => {
    const newBlog = { title: 'To Update', author: 'Test', content: 'Original content', likes: 5 }
    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const updatedLikes = { likes: 10 }
    const response = await api
      .put(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedLikes)
      .expect(200)

    assert.strictEqual(response.body.likes, 10)
    assert.strictEqual(response.body.title, 'To Update')
  })

  test('updating non-existing blog returns 404', async () => {
    const nonExistingId = '507f1f77bcf86cd799439011'
    const updatedLikes = { likes: 10 }
    await api
      .put(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedLikes)
      .expect(404)
  })

  test('creator can edit title, author and content', async () => {
    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old title', author: 'Old Author', content: 'Old content' })
      .expect(201)

    const response = await api
      .put(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New title', author: 'New Author', content: 'New content' })
      .expect(200)

    assert.strictEqual(response.body.title, 'New title')
    assert.strictEqual(response.body.author, 'New Author')
    assert.strictEqual(response.body.content, 'New content')
  })

  test('a comment can be added to a blog', async () => {
    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Commented blog', author: 'Tester', content: 'Blog with comments enabled' })
      .expect(201)

    const response = await api
      .post(`/api/blogs/${createdBlog.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ comment: 'Great post!' })
      .expect(201)

    assert.ok(response.body.comments)
    assert.strictEqual(response.body.comments.length, 1)
    assert.strictEqual(response.body.comments[0].text, 'Great post!')
    assert.strictEqual(response.body.comments[0].username, 'testuser')
  })

  test('like toggles per user on same blog', async () => {
    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Toggle likes', author: 'Tester', content: 'Toggle like test content' })
      .expect(201)

    const firstLikeResponse = await api
      .put(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ like: true })
      .expect(200)

    assert.strictEqual(firstLikeResponse.body.likes, 1)
    assert.strictEqual(firstLikeResponse.body.likedBy.length, 1)
    assert.strictEqual(firstLikeResponse.body.likedBy[0].username, 'testuser')

    const secondLikeResponse = await api
      .put(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ like: true })
      .expect(200)

    assert.strictEqual(secondLikeResponse.body.likes, 0)
    assert.strictEqual(secondLikeResponse.body.likedBy.length, 0)
  })

  test('adding a blog fails with 401 if token missing', async () => {
    const newBlog = {
      title: 'No Token Blog',
      author: 'Test Author',
      content: 'Unauthorized creation attempt',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})