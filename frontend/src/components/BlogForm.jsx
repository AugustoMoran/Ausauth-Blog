import { useState } from 'react'
import '../styles/Button.css'

const BlogForm = ({ createBlog, loading = false }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleContentChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, content })
    setTitle('')
    setAuthor('')
    setContent('')
  }

  return (
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Create new blog</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
            title:
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
            author:
          </label>
          <input
            type="text"
            value={author}
            onChange={handleAuthorChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
            content:
          </label>
          <input
            type="text"
            value={content}
            onChange={handleContentChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'creating…' : 'create'}</button>
      </form>
    </div>
  )
}

export default BlogForm
