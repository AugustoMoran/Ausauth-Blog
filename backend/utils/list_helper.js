const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const fav = blogs.reduce((prev, current) => (current.likes > (prev.likes || 0) ? current : prev), blogs[0])

  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}
  blogs.forEach(b => {
    counts[b.author] = (counts[b.author] || 0) + 1
  })

  let topAuthor = null
  let max = 0
  Object.keys(counts).forEach(author => {
    if (counts[author] > max) {
      max = counts[author]
      topAuthor = author
    }
  })

  return {
    author: topAuthor,
    blogs: max
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likes = {}
  blogs.forEach(b => {
    likes[b.author] = (likes[b.author] || 0) + (b.likes || 0)
  })

  let topAuthor = null
  let max = 0
  Object.keys(likes).forEach(author => {
    if (likes[author] > max) {
      max = likes[author]
      topAuthor = author
    }
  })

  return {
    author: topAuthor,
    likes: max
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
