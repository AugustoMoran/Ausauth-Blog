import axios from 'axios'
import API_URL from '../config'

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

const login = async (username, password) => {
  try {
    const response = await client.post('/api/login', { username, password })
    return response.data
  } catch (error) {
    const message = error.response?.data?.error || 'Login failed'
    throw new Error(message)
  }
}

const refresh = async () => {
  const response = await client.post('/api/login/refresh')
  return response.data
}

const logout = async () => {
  await client.post('/api/login/logout')
}

export default { login, refresh, logout }
