// src/App.jsx
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { onAuthStateChanged } from 'firebase/auth'

// routing
import Routes from '@/routes'

// defaultTheme
import themes from '@/themes'

// project imports
import NavigationScroll from '@/layout/NavigationScroll'
import { auth } from '@/config/firebase/firebaseConfig'
import { setCredentials, clearCredentials } from '@/store/slices/AuthSlice'

const App = () => {
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('Auth use effect')
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Auth state change effect')
            try {
                if (user) {
                    const token = await user.getIdToken()
                    dispatch(
                        setCredentials({
                            user: {
                                uid: user.uid,
                                email: user.email
                            },
                            token
                        })
                    )
                } else {
                    dispatch(clearCredentials())
                }
            } catch (error) {
                console.error('Auth state change error:', error)
                dispatch(clearCredentials())
            }
        })

        return () => unsubscribe()
    }, [dispatch])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
