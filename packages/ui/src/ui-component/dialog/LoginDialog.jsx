// src/ui-component/dialog/LoginDialog.jsx
import { useState } from 'react'
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { Input } from '@/ui-component/input/Input'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase/firebaseConfig'

const LoginDialog = ({ show, dialogProps, onConfirm }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        if (!email || !password) return

        try {
            setIsLoading(true)
            setError('')

            // First, authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()

            // Store token and credentials
            localStorage.setItem('authToken', token)
            localStorage.setItem('username', email)
            localStorage.setItem('password', password)

            // Call onConfirm with credentials
            onConfirm(email, password)
        } catch (err) {
            console.error('Login error:', err)
            let errorMessage = 'Login failed. Please try again.'

            if (err.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.'
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later.'
            }

            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant='h4' component='h1' gutterBottom align='center'>
                    Login
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Input
                        inputParam={{
                            label: 'Email',
                            name: 'email',
                            type: 'email',
                            placeholder: 'Enter email'
                        }}
                        onChange={(newValue) => setEmail(newValue)}
                        value={email}
                        disabled={isLoading}
                    />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Input
                        inputParam={{
                            label: 'Password',
                            name: 'password',
                            type: 'password',
                            placeholder: '••••••••'
                        }}
                        onChange={(newValue) => setPassword(newValue)}
                        value={password}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleLogin()
                        }}
                        disabled={isLoading}
                    />
                </Box>

                {error && (
                    <Box
                        sx={{
                            mb: 2,
                            p: 1,
                            bgcolor: 'error.light',
                            color: 'error.dark',
                            borderRadius: 1
                        }}
                    >
                        {error}
                    </Box>
                )}

                <StyledButton variant='contained' fullWidth onClick={handleLogin} disabled={isLoading || !email || !password}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} color='inherit' />
                            <span>Logging in...</span>
                        </Box>
                    ) : (
                        'Login'
                    )}
                </StyledButton>
            </CardContent>
        </Card>
    )
}

export default LoginDialog
