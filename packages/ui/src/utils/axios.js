// src/utils/axios.js
import axios from 'axios'
import { store } from '@/store'

const axiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const state = store.getState()
        const token = state.auth?.token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            // Add x-request-from header
            config.headers['x-request-from'] = 'internal'
        }
        return config
    },
    error => Promise.reject(error)
)

export default axiosInstance