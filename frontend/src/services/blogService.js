import axios from 'axios'
import API_URL from '../config'
import loginService from './loginService'

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

let authToken = null

const setToken = (token) => {
  authToken = token || null
}

client.interceptors.request.use((requestConfig) => {
  if (authToken) {
    requestConfig.headers = requestConfig.headers || {}
    requestConfig.headers.Authorization = `Bearer ${authToken}`
  }

  return requestConfig
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401
      && !originalRequest?._retry
      && authToken
      && !String(originalRequest?.url || '').includes('/api/login/refresh')
    ) {
      originalRequest._retry = true

      try {
        const refreshResponse = await loginService.refresh()
        const refreshedToken = refreshResponse.token || refreshResponse.accessToken

        if (!refreshedToken) {
          throw new Error('No refreshed token returned')
        }

        authToken = refreshedToken
        localStorage.setItem('token', refreshedToken)

        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          localStorage.setItem('user', JSON.stringify({ ...parsedUser, token: refreshedToken }))
        }

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`

        return client(originalRequest)
      } catch (_refreshError) {
        authToken = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    return Promise.reject(error)
  }
)

const getBlogs = async (_token, params = {}) => {
  const response = await client.get('/api/blogs', {
    params,
  })
  return response.data
}

const create = async (_token, blogData) => {
  const response = await client.post('/api/blogs', blogData)
  return response.data
}

const update = async (_token, id, blogData) => {
  const response = await client.put(`/api/blogs/${id}`, blogData)
  return response.data
}

const deleteBlog = async (_token, id) => {
  const response = await client.delete(`/api/blogs/${id}`)
  return response.data
}

const addComment = async (_token, id, comment) => {
  const response = await client.post(`/api/blogs/${id}/comments`, { comment })
  return response.data
}

export default { getBlogs, create, update, deleteBlog, addComment, setToken }
