// src/ui-component/ErrorBoundary.js
import React from 'react'
import { Box, Typography, Button } from '@mui/material'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh' p={3}>
                    <Typography variant='h5' gutterBottom>
                        Something went wrong
                    </Typography>
                    <Button variant='contained' color='primary' onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                        Reload Page
                    </Button>
                </Box>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
