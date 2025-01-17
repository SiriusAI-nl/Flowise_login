import { LOGIN, LOGOUT, SET_USER } from '../actions'

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token')
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            const { token, user } = action.payload
            localStorage.setItem('token', token)
            return {
                ...state,
                isAuthenticated: true,
                user,
                token
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null
            }
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            }
        default:
            return state
    }
}

export default authReducer
