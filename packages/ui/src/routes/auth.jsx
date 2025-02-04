// src/routes/auth.ts
import express from 'express'
import { AuthService } from '../services/AuthService'

const router = express.Router()
const authService = new AuthService()

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            console.log('Username and password are required')
            return res.status(400).json({ message: 'Username and password are required' })
        }

        const user = await authService.validateUser(username, password)
        if (!user) {
            console.log('Username and password are required')
            return res.status(401).json({ message: 'Invalid username or password' })
        }

        const result = await authService.login(user)
        res.json(result)
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Initialize admin user on startup
//authService.createInitialAdmin().catch(console.error)

// Registration route
// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' })
        }

        // Check if user already exists
        const existingUser = await AuthService.findUserByUsername(username)
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' })
        }

        // Create new user
        const user = await AuthService.createUser({
            username,
            password,
            email,
            role: 'user' // Default role
        })

        // Login the user after registration
        const result = await AuthService.login(user)
        res.json(result)
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router
