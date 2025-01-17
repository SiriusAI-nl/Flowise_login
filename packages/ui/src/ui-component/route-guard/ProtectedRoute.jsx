// src/ui-component/route-guard/ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase/firebaseConfig'

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated')

            if (user) {
                try {
                    // Force token refresh to ensure it's valid
                    const token = await user.getIdToken(true)
                    localStorage.setItem('authToken', token)
                    setIsLoading(false)
                } catch (error) {
                    console.error('Token refresh error:', error)
                    localStorage.removeItem('authToken')
                    navigate('/login', { replace: true })
                }
            } else {
                localStorage.removeItem('authToken')
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

    return children
}

export default ProtectedRoute
