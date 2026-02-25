const Notification = ({ notification }) => {
  if (!notification || !notification.message) return null

  const type = notification.type || 'info'
  const isError = type === 'error'
  const isSuccess = type === 'success'
  const backgroundColor = isError ? '#ffcdd2' : isSuccess ? '#c8e6c9' : '#bbdefb'
  const borderColor = isError ? '#d32f2f' : isSuccess ? '#2e7d32' : '#1565c0'
  const textColor = isError ? '#d32f2f' : isSuccess ? '#2e7d32' : '#0d47a1'

  return (
    <div
      style={{
        color: textColor,
        backgroundColor,
        border: `2px solid ${borderColor}`,
        padding: '12px 16px',
        marginBottom: '16px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      {notification.message}
    </div>
  )
}

export default Notification
