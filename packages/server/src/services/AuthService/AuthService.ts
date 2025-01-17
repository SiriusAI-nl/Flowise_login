import { getRepository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { Users } from '../../database/entities/Users'

export class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

    async validateUser(username: string, password: string) {
        const userRepository = getRepository(Users)
        const user = await userRepository.findOne({ where: { username } })

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role }
        return {
            access_token: jwt.sign(payload, this.JWT_SECRET, { expiresIn: '1d' }),
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        }
    }

    async verifyToken(token: string) {
        try {
            return jwt.verify(token, this.JWT_SECRET)
        } catch (error) {
            throw new Error('Invalid token')
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    async createInitialAdmin() {
        const userRepository = getRepository(Users)
        const existingAdmin = await userRepository.findOne({ where: { username: process.env.DEFAULT_ADMIN_USERNAME || 'admin' } })

        if (!existingAdmin) {
            const hashedPassword = await this.hashPassword(process.env.DEFAULT_ADMIN_PASSWORD || 'admin')
            await userRepository.save({
                username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
                password: hashedPassword,
                role: 'admin',
                email: 'admin@example.com'
            })
        }
    }
}
