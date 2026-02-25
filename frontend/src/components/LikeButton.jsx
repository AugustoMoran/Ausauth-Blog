import '../styles/Button.css'

const LikeButton = ({ blog, onLike, loading = false, liked = false }) => {
  const handleLike = () => {
    if (onLike) {
      onLike(blog)
    }
  }

  return (
    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
      <span style={{ marginRight: '10px', fontWeight: '500' }}>
        likes <strong>{blog.likes}</strong>
      </span>
      <button
        onClick={handleLike}
        className="btn-like"
        data-testid="like-button"
        disabled={loading}
      >
        {loading ? 'saving…' : liked ? 'unlike' : 'like'}
      </button>
    </div>
  )
}

export default LikeButton
