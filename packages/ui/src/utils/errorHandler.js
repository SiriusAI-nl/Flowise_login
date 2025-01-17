// src/utils/errorHandler.js
const isErrorWithMessage = (error) => {
    return typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
}

const toErrorWithMessage = (maybeError) => {
    if (isErrorWithMessage(maybeError)) return maybeError

    try {
        return new Error(JSON.stringify(maybeError))
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError))
    }
}

export const getErrorMessage = (error) => {
    return toErrorWithMessage(error).message
}

export const handleApiError = (error) => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                return 'Authentication required. Please log in again.'
            case 403:
                return 'You do not have permission to perform this action.'
            case 404:
                return 'The requested resource was not found.'
            case 500:
                return 'An internal server error occurred. Please try again later.'
            default:
                return error.response.data?.message || 'An unexpected error occurred.'
        }
    }
    return getErrorMessage(error)
}

export const handleAuthError = (error) => {
    switch (error.code) {
        case 'auth/invalid-credential':
            return 'Invalid email or password.'
        case 'auth/user-not-found':
            return 'No account found with this email.'
        case 'auth/wrong-password':
            return 'Incorrect password.'
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.'
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.'
        default:
            return getErrorMessage(error)
    }
}
