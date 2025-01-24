// src/utils/axios.js
import axios from 'axios'
import { auth } from '@/config/firebase/firebaseConfig'

// packages/ui/src/utils/axios.js
import axios from 'axios'
import { auth } from '@/config/firebase/firebaseConfig'

const baseURL = import.meta.env.VITE_API_URL || '/api/v1'  // Default to relative path if not set

const axiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Rest of your code stays the same...

// Request interceptor
// src/utils/axios.js
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token') // Match the key used in login
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)


// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Try to refresh token first
            try {
                const user = auth.currentUser
                if (user) {
                    const newToken = await user.getIdToken(true)
                    if (error.config) {
                        // Retry the original request with new token
                        error.config.headers['Authorization'] = `Bearer ${newToken}`
                        return axios.request(error.config)
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                // Redirect to login if refresh fails
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
