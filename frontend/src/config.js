// In production (when served from the backend) we want relative API calls so
// the browser hits the same origin. During local dev you can set
// VITE_API_URL to e.g. http://localhost:3003
const API_URL = import.meta.env.VITE_API_URL ?? ''

export default API_URL
