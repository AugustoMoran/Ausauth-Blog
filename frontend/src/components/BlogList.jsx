import Blog from './Blog'

const BlogList = ({
  blogs,
  user,
  likeBlog,
  deleteBlog,
  editBlog,
  addComment,
  blogActionLoading,
  search,
  setSearch,
  authorFilter,
  setAuthorFilter,
  page,
  setPage,
  pageSize,
}) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  const totalPages = Math.max(1, Math.ceil(sortedBlogs.length / pageSize))

  const paginatedBlogs = sortedBlogs.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div style={{ marginTop: '24px' }}>
      <h2 style={{ marginBottom: '16px', color: 'var(--text)' }}>
        📝 Blogs ({sortedBlogs.length})
      </h2>

      <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          style={{ padding: '8px', border: '1px solid #233042', borderRadius: '4px', background: 'var(--surface)', color: 'var(--text)' }}
        />
        <input
          type="text"
          placeholder="Filter by author"
          value={authorFilter}
          onChange={(event) => {
            setAuthorFilter(event.target.value)
            setPage(1)
          }}
          style={{ padding: '8px', border: '1px solid #233042', borderRadius: '4px', background: 'var(--surface)', color: 'var(--text)' }}
        />
      </div>

      {sortedBlogs.length === 0 ? (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          backgroundColor: 'var(--surface)',
          borderRadius: '4px',
          color: 'var(--muted)',
          fontSize: '16px',
        }}>
          No blogs yet. Be the first to create one!
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {paginatedBlogs.map((blog) => (
            <li key={blog.id} data-testid="blog-item">
              <Blog
                blog={blog}
                user={user}
                onLike={likeBlog}
                onDelete={deleteBlog}
                onEdit={editBlog}
                onComment={addComment}
                loadingAction={blogActionLoading?.blogId === blog.id ? blogActionLoading.action : null}
              />
            </li>
          ))}
        </ul>
      )}

      {sortedBlogs.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <button className="btn-secondary" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            Previous
          </button>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Page {page} / {totalPages}
          </span>
          <button className="btn-secondary" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogList
