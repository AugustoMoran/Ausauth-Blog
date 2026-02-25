import { useState } from 'react'
import '../styles/Button.css'

const LoginForm = ({ onLogin, loading = false }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleUsernameChange = (event) => {
		setUsername(event.target.value)
	}

	const handlePasswordChange = (event) => {
		setPassword(event.target.value)
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		onLogin({ username, password })
		setPassword('')
	}

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
			<div>
				<label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
					username
				</label>
				<input
					type="text"
					value={username}
					onChange={handleUsernameChange}
					disabled={loading}
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
					password
				</label>
				<input
					type="password"
					value={password}
					onChange={handlePasswordChange}
					disabled={loading}
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
			<button type="submit" className="btn-primary" disabled={loading}>
				{loading ? 'logging in…' : 'login'}
			</button>
		</form>
	)
}

export default LoginForm
