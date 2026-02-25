import '../styles/Button.css'

const overlayStyles = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 9999,
}

const containerStyles = {
  background: '#fff',
  borderRadius: '8px',
  padding: '16px',
  width: 'min(92vw, 420px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
}

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      style={overlayStyles}
    >
      <div style={containerStyles}>
        <h3 id="confirm-dialog-title" style={{ marginTop: 0 }}>
          {title}
        </h3>

        <p style={{ marginBottom: '16px' }}>{message}</p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn-secondary" disabled={loading}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn-delete" disabled={loading}>
            {loading ? 'Deleting…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog