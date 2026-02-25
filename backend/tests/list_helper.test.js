const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      content: 'Classic article on structured programming.',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  const emptyList = []

  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes(emptyList), 0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'First',
      author: 'A',
      likes: 2
    },
    {
      title: 'Second',
      author: 'B',
      likes: 5
    },
    {
      title: 'Third',
      author: 'A',
      likes: 3
    }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, { title: 'Second', author: 'B', likes: 5 })
  })
})

describe('most blogs', () => {
  const blogs = [
    { author: 'A' },
    { author: 'B' },
    { author: 'A' },
    { author: 'C' },
    { author: 'A' }
  ]

  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'A', blogs: 3 })
  })
})

describe('most likes', () => {
  const blogs = [
    { author: 'A', likes: 5 },
    { author: 'B', likes: 7 },
    { author: 'A', likes: 3 },
    { author: 'C', likes: 2 }
  ]

  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'A', likes: 8 })
  })
})
