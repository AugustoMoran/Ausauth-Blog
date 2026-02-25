import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import loginService from './services/loginService'
import blogService from './services/blogService'
import userService from './services/userService'
import './styles/Button.css'

function App() {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [isBlogsLoading, setIsBlogsLoading] = useState(false)
  const [isCreateLoading, setIsCreateLoading] = useState(false)
  const [blogActionLoading, setBlogActionLoading] = useState(null)
  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5
  const [authMode, setAuthMode] = useState('login')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const u = JSON.parse(loggedUserJSON)
      setUser(u)
      blogService.setToken(u.token)
    }
  }, [])

  useEffect(() => {
    blogService.setToken(user?.token || null)
    const fetchBlogs = async () => {
      if (!user) {
        setBlogs([])
        return
      }
      try {
        setIsBlogsLoading(true)
        const fetched = await blogService.getBlogs(user.token)
        setBlogs(fetched)
      } catch (e) {
        showNotification('Could not fetch blogs. Please try again.', 'error')
      } finally {
        setIsBlogsLoading(false)
      }
    }
    fetchBlogs()
  }, [user])

  const ownBlogs = blogs.filter((b) => b.user?.username === user?.username)
  const ownLikes = ownBlogs.reduce((sum, b) => sum + (b.likes || 0), 0)

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = `${blog.title} ${blog.author}`.toLowerCase().includes(search.toLowerCase())
    const matchesAuthor = authorFilter.trim() === '' || blog.author.toLowerCase().includes(authorFilter.toLowerCase())
    return matchesSearch && matchesAuthor
  })

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      setIsAuthLoading(true)
      const loggedInUser = await loginService.login(username, password)
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      localStorage.setItem('token', loggedInUser.token)
      showNotification(`Welcome back, ${loggedInUser.name}!`, 'success')
    } catch (error) {
      showNotification(`Wrong credentials. ${error.message}`, 'error')
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleRegister = async ({ name, username, password }) => {
    try {
      setIsAuthLoading(true)
      await userService.register({ name, username, password })
      showNotification('Account created successfully. Please log in.', 'success')
      setAuthMode('login')
    } catch (error) {
      showNotification(`Registration failed. ${error.message}`, 'error')
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleLogout = () => {
    loginService.logout().catch(() => {})
    blogService.setToken(null)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    showNotification('Logged out successfully.', 'info')
  }

  const addBlog = async (blogObject) => {
    try {
      setIsCreateLoading(true)
      const newBlog = await blogService.create(user.token, blogObject)
      setBlogs((prev) => prev.concat(newBlog))
      showNotification(`A new blog "${newBlog.title}" by ${newBlog.author} was added.`, 'success')
    } catch (e) {
      showNotification('Error creating blog. Please check title and content.', 'error')
    } finally {
      setIsCreateLoading(false)
    }
  }

  const editBlog = async (blog, updatedFields) => {
    try {
      setBlogActionLoading({ blogId: blog.id, action: 'edit' })
      const updated = await blogService.update(user.token, blog.id, updatedFields)
      setBlogs((prev) => prev.map((b) => b.id === blog.id ? updated : b))
      showNotification(`Blog "${updated.title}" updated.`, 'success')
    } catch (e) {
      showNotification('Error editing blog. Only creator can edit.', 'error')
    } finally {
      setBlogActionLoading(null)
    }
  }

  const addComment = async (blog, comment) => {
    try {
      setBlogActionLoading({ blogId: blog.id, action: 'comment' })
      const updated = await blogService.addComment(user.token, blog.id, comment)
      setBlogs((prev) => prev.map((b) => b.id === blog.id ? updated : b))
      showNotification('Comment added.', 'success')
    } catch (e) {
      showNotification('Error adding comment. Please try again.', 'error')
    } finally {
      setBlogActionLoading(null)
    }
  }

  const likeBlog = async (blog) => {
    try {
      setBlogActionLoading({ blogId: blog.id, action: 'like' })
      const updated = await blogService.update(user.token, blog.id, { like: true })
      setBlogs((prev) => prev.map((b) => b.id === blog.id ? updated : b))
      showNotification('Blog liked.', 'success')
    } catch (e) {
      showNotification('Error updating likes. Please try again.', 'error')
    } finally {
      setBlogActionLoading(null)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      setBlogActionLoading({ blogId: blog.id, action: 'delete' })
      await blogService.deleteBlog(user.token, blog.id)
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
      showNotification(`Blog "${blog.title}" removed.`, 'success')
    } catch (e) {
      showNotification('Error removing blog. You may not have permission.', 'error')
    } finally {
      setBlogActionLoading(null)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 Blog List</h1>
      </header>
      <main className="app-main">
        <Notification notification={notification} />
        {user === null ? (
          <section className="auth-section">
            <h2>{authMode === 'login' ? 'Login' : 'Create account'}</h2>
            {authMode === 'login' ? (
              <LoginForm onLogin={handleLogin} loading={isAuthLoading} />
            ) : (
              <RegisterForm onRegister={handleRegister} loading={isAuthLoading} />
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setAuthMode((prev) => prev === 'login' ? 'register' : 'login')}
              disabled={isAuthLoading}
              style={{ marginTop: '12px' }}
            >
              {authMode === 'login' ? 'create new account' : 'back to login'}
            </button>
          </section>
        ) : (
          <section className="blog-section">
            <div className="user-info">
              <p>Logged in as <strong>{user.name}</strong></p>
              <button onClick={handleLogout} className="btn-logout">logout</button>
            </div>
            <div style={{ marginTop: '12px', marginBottom: '12px', padding: '12px', background: '#f7f9fc', borderRadius: '6px' }}>
              <strong>👤 Your profile</strong>
              <p style={{ margin: '6px 0' }}>Blogs created: {ownBlogs.length}</p>
              <p style={{ margin: '6px 0' }}>Total likes received: {ownLikes}</p>
            </div>
            {isBlogsLoading && (
              <p style={{ marginTop: '10px', color: '#666' }}>Loading blogs…</p>
            )}
            <Togglable buttonLabel="new blog">
              <BlogForm createBlog={addBlog} loading={isCreateLoading} />
            </Togglable>
            <BlogList
              blogs={filteredBlogs}
              user={user}
              likeBlog={likeBlog}
              deleteBlog={deleteBlog}
              editBlog={editBlog}
              addComment={addComment}
              blogActionLoading={blogActionLoading}
              search={search}
              setSearch={setSearch}
              authorFilter={authorFilter}
              setAuthorFilter={setAuthorFilter}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
            />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
