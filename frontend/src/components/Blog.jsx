import { useState } from 'react'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import '../styles/Button.css'

const Blog = ({ blog, user, onLike, onDelete, onEdit, onComment, loadingAction = null }) => {
  const [visible, setVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(blog.title)
  const [editAuthor, setEditAuthor] = useState(blog.author)
  const [editContent, setEditContent] = useState(blog.content || '')
  const [commentText, setCommentText] = useState('')

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const canRemove = user && blog.user && blog.user.username === user.username
  const canEdit = canRemove
  const likedBy = blog.likedBy || []
  const alreadyLikedByCurrentUser = likedBy.some((entry) => entry.username === user?.username)
  const isLikeLoading = loadingAction === 'like'
  const isDeleteLoading = loadingAction === 'delete'
  const isEditLoading = loadingAction === 'edit'
  const isCommentLoading = loadingAction === 'comment'

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    if (!onEdit) return
    await onEdit(blog, { title: editTitle, author: editAuthor, content: editContent })
    setIsEditing(false)
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    if (!commentText.trim() || !onComment) return
    await onComment(blog, commentText)
    setCommentText('')
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '12px',
        marginBottom: '12px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <strong>{blog.title}</strong> by <em>{blog.author}</em>
        </div>
        <button onClick={toggleVisibility} className="btn-secondary">
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
          <p style={{ marginBottom: '10px', color: '#334155', whiteSpace: 'pre-wrap' }}>{blog.content || 'No content provided'}</p>
          <LikeButton blog={blog} onLike={onLike} loading={isLikeLoading} liked={alreadyLikedByCurrentUser} />

          <div style={{ marginBottom: '10px', fontSize: '13px', color: '#334155' }}>
            <strong>Liked by:</strong>{' '}
            {likedBy.length === 0
                ? 'nobody yet'
              : likedBy.map((entry) => entry.name || entry.username).join(', ')}
          </div>

          {canEdit && (
            <div style={{ marginBottom: '10px' }}>
              <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'cancel edit' : 'edit blog'}
              </button>
            </div>
          )}

          {isEditing && (
            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '8px', marginBottom: '10px' }}>
              <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} required />
              <input value={editAuthor} onChange={(event) => setEditAuthor(event.target.value)} required />
              <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} required rows={3} />
              <button className="btn-primary" type="submit" disabled={isEditLoading}>
                {isEditLoading ? 'saving…' : 'save changes'}
              </button>
            </form>
          )}

          <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
            Added by <strong>{blog.user?.name}</strong>
          </div>

          <div style={{ marginTop: '8px', marginBottom: '8px' }}>
            <strong>Comments</strong>
            <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
              {(blog.comments || []).length === 0 ? <li>No comments yet</li> : blog.comments.map((comment, index) => (
                <li key={`${blog.id}-comment-${index}`}>
                  <span>{typeof comment === 'string' ? comment : comment.text}</span>
                  {typeof comment === 'object' && comment !== null && (
                    <small style={{ display: 'block', color: '#64748b', marginTop: '2px' }}>
                      — {comment.name || comment.username}
                    </small>
                  )}
                </li>
              ))}
            </ul>
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={commentText}
                placeholder="Write a comment"
                onChange={(event) => setCommentText(event.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-secondary" disabled={isCommentLoading}>
                {isCommentLoading ? 'adding…' : 'add'}
              </button>
            </form>
          </div>

          {canRemove && <DeleteButton blog={blog} onDelete={onDelete} loading={isDeleteLoading} />}
        </div>
      )}
    </div>
  )
}

export default Blog
