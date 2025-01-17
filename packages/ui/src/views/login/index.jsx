// src/views/login/index.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledContainer = styled(Box)({
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#000',
    backgroundImage: 'radial-gradient(circle at 50% 50%, #47008F 0%, #000 100%)'
})

const StyledFormContainer = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '480px',
    padding: '0 40px'
})

const StyledInput = styled('input')({
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#000',
    fontSize: '16px',
    marginBottom: '20px',
    outline: 'none',
    '&:focus': {
        borderColor: '#fff',
        backgroundColor: '#fff'
    },
    '&::placeholder': {
        color: 'rgba(0, 0, 0, 0.6)'
    }
})

const StyledButton = styled('button')({
    width: '100%',
    padding: '12px',
    backgroundColor: '#47008F',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: '#5A00B3'
    },
    '&:disabled': {
        backgroundColor: '#2D0059',
        cursor: 'not-allowed'
    }
})

const StyledLink = styled('a')({
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
    '&:hover': {
        textDecoration: 'underline'
    }
})

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            setError('')

            localStorage.setItem('username', email)
            localStorage.setItem('password', password)

            navigate('/')
        } catch (err) {
            console.error('Login error:', err)
            setError('Invalid email or password')
            localStorage.removeItem('username')
            localStorage.removeItem('password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <StyledContainer>
            <StyledFormContainer>
                <Typography
                    variant='h1'
                    sx={{
                        fontSize: '40px',
                        fontWeight: '700',
                        mb: 1,
                        background: 'linear-gradient(90deg, #FFF 0%, #B49FFF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    SIRIUS AI
                </Typography>

                <Typography
                    variant='h4'
                    sx={{
                        fontSize: '24px',
                        mb: 1,
                        color: '#fff'
                    }}
                >
                    Welcome to Sirius AI 👋
                </Typography>

                <Typography
                    sx={{
                        fontSize: '14px',
                        mb: 4,
                        color: 'rgba(255, 255, 255, 0.7)'
                    }}
                >
                    Please Log In Your Account
                </Typography>

                {error && (
                    <Typography
                        sx={{
                            color: '#ff4d4f',
                            mb: 2,
                            fontSize: '14px',
                            backgroundColor: 'rgba(255, 77, 79, 0.1)',
                            padding: '8px 12px',
                            borderRadius: '4px'
                        }}
                    >
                        {error}
                    </Typography>
                )}

                <StyledInput
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />

                <StyledInput
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleLogin()
                    }}
                    disabled={isLoading}
                />

                <StyledButton onClick={handleLogin} disabled={isLoading || !email || !password}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                </StyledButton>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <StyledLink href='/register'>Don't have an account? Sign Up</StyledLink>
                </Box>
            </StyledFormContainer>

            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'block' },
                    backgroundImage: 'url(/logo.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
        </StyledContainer>
    )
}

export default Login
