import axios from 'axios'
import API_URL from '../config'

const client = axios.create({
  baseURL: API_URL,
})

const register = async (payload) => {
  const response = await client.post('/api/users', payload)
  return response.data
}

export default { register }