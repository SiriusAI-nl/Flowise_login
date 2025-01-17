import express from 'express'
import { AuthService } from '../../services/AuthService/AuthService'
import { getDataSource } from '../../DataSource'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { Users } from '../../database/entities/Users'

const router = express.Router()
const authService = new AuthService()

const JWT_SECRET = process.env.JWT_SECRET || 'n0xO2AO4MIOs8T5UbAlsBQQJUM/H1PZSjxO4JPYD6INHW9OIb12xENiSWF4Ch//Y3CNU6dR4CfZy/9uoo3h/cg=='

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body
        const userRepository = getRepository(Users)

        // Check if user exists
        const existingUser = await userRepository.findOne({ where: { username } })
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const user = userRepository.create({
            username,
            password: hashedPassword,
            email,
            role: 'user'
        })

        await userRepository.save(user)

        // Create JWT token
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' })

        // Remove password from response
        const { password: _, ...userResponse } = user

        res.json({
            user: userResponse,
            access_token: token
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' })
        }

        const user = await authService.validateUser(username, password)
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' })
        }

        const result = await authService.login(user)
        res.json(result)
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'No token provided' })
        }

        const user = await authService.verifyToken(token)
        res.json({ user })
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
})

export default router
