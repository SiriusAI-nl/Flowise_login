// src/api/client.js
import axios from 'axios'
import { auth } from '@/config/firebase/firebaseConfig'
import { baseURL } from '@/store/constant'

const apiClient = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add a request interceptor
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // First try to get token from localStorage
            let token = localStorage.getItem('authToken')

            // If no token in localStorage, try to get from Firebase
            if (!token && auth.currentUser) {
                token = await auth.currentUser.getIdToken(true)
                localStorage.setItem('authToken', token)
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }

            return config
        } catch (error) {
            console.error('Request interceptor error:', error)
            return Promise.reject(error)
        }
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                if (auth.currentUser) {
                    // Try to get a fresh token
                    const token = await auth.currentUser.getIdToken(true)
                    localStorage.setItem('authToken', token)

                    // Retry the original request with new token
                    error.config.headers.Authorization = `Bearer ${token}`
                    return apiClient.request(error.config)
                } else {
                    // Clear stored credentials if no current user
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('username')
                    localStorage.removeItem('password')
                    window.location.href = '/login'
                }
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError)
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default apiClient
