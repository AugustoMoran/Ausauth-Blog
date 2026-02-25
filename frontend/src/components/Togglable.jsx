import { useState } from 'react'
import '../styles/Button.css'

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} className="btn-primary">{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility} className="btn-secondary" style={{ marginTop: '12px' }}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
