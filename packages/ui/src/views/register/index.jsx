import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, Typography, Box, Alert } from '@mui/material'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { Input } from '@/ui-component/input/Input'
import { setCredentials } from '@/store/authSlice'
import { authAPI } from '@/api/auth'

const RegisterPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async () => {
        if (!username || !password) {
            setError('Username and password are required')
            return
        }

        try {
            setIsLoading(true)
            setError('')

            const response = await authAPI.register(username, password, email)

            dispatch(
                setCredentials({
                    user: response.user,
                    token: response.access_token
                })
            )

            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
            console.error('Registration error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'background.default'
            }}
        >
            <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant='h4' component='h1' gutterBottom align='center'>
                        Register
                    </Typography>

                    {error && (
                        <Alert severity='error' sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ mb: 3 }}>
                        <Input
                            inputParam={{
                                label: 'Username',
                                name: 'username',
                                type: 'string',
                                placeholder: 'Enter username'
                            }}
                            onChange={(newValue) => setUsername(newValue)}
                            value={username}
                            disabled={isLoading}
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Input
                            inputParam={{
                                label: 'Email',
                                name: 'email',
                                type: 'string',
                                placeholder: 'Enter email (optional)'
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
                            disabled={isLoading}
                        />
                    </Box>

                    <StyledButton variant='contained' fullWidth onClick={handleRegister} disabled={isLoading || !username || !password}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </StyledButton>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant='body2'>
                            Already have an account?{' '}
                            <Link to='/login' style={{ textDecoration: 'none' }}>
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default RegisterPage
