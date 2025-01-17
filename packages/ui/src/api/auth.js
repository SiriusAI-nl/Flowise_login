import axios from 'axios'

const API_BASE_URL = '/api/v1'

export const authAPI = {
    login: async (username, password) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username,
            password
        })
        return response.data
    },

    register: async (username, password, email) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            username,
            password,
            email
        })
        return response.data
    },

    verifyToken: async (token) => {
        const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    }
}

export default authAPI
