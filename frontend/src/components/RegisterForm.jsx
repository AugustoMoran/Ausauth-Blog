import { useState } from 'react'
import '../styles/Button.css'

const RegisterForm = ({ onRegister, loading = false }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onRegister({ name, username, password })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
          name
        </label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
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
          username
        </label>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          minLength={3}
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
          password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={3}
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

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'creating account…' : 'create account'}
      </button>
    </form>
  )
}

export default RegisterForm