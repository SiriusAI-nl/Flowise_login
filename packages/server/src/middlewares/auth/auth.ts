import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'
import logger from '../../utils/logger'

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
   admin.initializeApp({
       credential: admin.credential.cert({
           projectId: process.env.VITE_FIREBASE_PROJECT_ID,
           clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
           privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
       })
   })
}

declare global {
   namespace Express {
       interface Request {
           user?: any
       }
   }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
   try {
       const token = req.headers.authorization?.split('Bearer ')[1]
       if (!token) return res.status(401).json({ message: 'Access token is missing' })

       const decodedToken = await admin.auth().verifyIdToken(token)
       req.user = decodedToken
       next()
   } catch (error) {
       logger.error('Authentication error:', error)
       return res.status(403).json({ message: 'Invalid token' })
   }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
   try {
       if (!req.user) return res.status(401).json({ message: 'User not authenticated' })
       
       const userRecord = await admin.auth().getUser(req.user.uid)
       const customClaims = userRecord.customClaims || {}
       
       if (!customClaims.admin) {
           return res.status(403).json({ message: 'Admin access required' })
       }
       next()
   } catch (error) {
       logger.error('Admin verification error:', error)
       return res.status(403).json({ message: 'Failed to verify admin status' })
   }
}