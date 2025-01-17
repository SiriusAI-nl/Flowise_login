// src/utils/axios.js
import axios from 'axios'
import { auth } from '@/config/firebase/firebaseConfig'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const user = auth.currentUser
            if (user) {
                const token = await user.getIdToken(true) // Force token refresh
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        } catch (error) {
            console.error('Auth token error:', error)
            return Promise.reject(error)
        }
    },
    (error) => {
        return Promise.reject(error)
    }
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
