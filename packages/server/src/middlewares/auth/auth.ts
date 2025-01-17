import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import logger from '../../utils/logger'

declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Access token is missing' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        req.user = decoded
        next()
    } catch (error) {
        logger.error('Authentication error:', error)
        return res.status(403).json({ message: 'Invalid token' })
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
    }
    next()
}
