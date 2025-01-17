// src/hooks/useApi.js
import { useState } from 'react'
import { auth } from '@/config/firebase/firebaseConfig'

export default (apiFunc) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const request = async (...args) => {
        setLoading(true)
        try {
            const user = auth.currentUser
            let headers = {}

            if (user) {
                const token = await user.getIdToken(true)
                headers = {
                    Authorization: `Bearer ${token}`
                }
            }

            // Add headers to the last argument if it's an object, or as a new argument
            const newArgs = [...args]
            if (typeof newArgs[newArgs.length - 1] === 'object') {
                newArgs[newArgs.length - 1] = {
                    ...newArgs[newArgs.length - 1],
                    headers: {
                        ...newArgs[newArgs.length - 1].headers,
                        ...headers
                    }
                }
            } else {
                newArgs.push({ headers })
            }

            const result = await apiFunc(...newArgs)
            setData(result.data)
            return result.data
        } catch (err) {
            setError(err || 'Unexpected Error!')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        data,
        error,
        loading,
        request
    }
}
