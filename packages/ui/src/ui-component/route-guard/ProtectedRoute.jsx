// src/ui-component/route-guard/ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase/firebaseConfig'

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated')

            if (user) {
                try {
                    // Force token refresh to ensure it's valid
                    const token = await user.getIdToken(true)
                    localStorage.setItem('authToken', token)
                    // Also set these to prevent Flowise default login from appearing
                    localStorage.setItem('username', 'firebase-user')
                    localStorage.setItem('password', 'firebase-auth')
                    setIsAuthenticated(true)
                    setIsLoading(false)
                } catch (error) {
                    console.error('Token refresh error:', error)
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('username')
                    localStorage.removeItem('password')
                    setIsAuthenticated(false)
                    navigate('/login', { replace: true })
                }
            } else {
                localStorage.removeItem('authToken')
                localStorage.removeItem('username')
                localStorage.removeItem('password')
                setIsAuthenticated(false)
                navigate('/login', { replace: true })
            }
        })

        // Cleanup subscription
        return () => unsubscribe()
    }, [navigate])

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    // Only render children if authenticated
    return isAuthenticated ? children : null
}

export default ProtectedRoute