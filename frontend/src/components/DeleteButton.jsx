import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import '../styles/Button.css'

const DeleteButton = ({ blog, onDelete, loading = false }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const openConfirm = () => {
    setIsConfirmOpen(true)
  }

  const closeConfirm = () => {
    setIsConfirmOpen(false)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(blog)
    }
  }

  return (
    <>
      <button
        onClick={openConfirm}
        className="btn-delete"
        style={{ marginTop: '10px', marginBottom: '10px', width: '100%' }}
        data-testid="delete-button"
        disabled={loading}
      >
        {loading ? 'removing…' : 'remove'}
      </button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete blog"
        message={`Are you sure you want to remove "${blog.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={closeConfirm}
        loading={loading}
      />
    </>
  )
}

export default DeleteButton
