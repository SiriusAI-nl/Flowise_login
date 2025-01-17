import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notifications: [],
    unreadCount: 0
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload)
            state.unreadCount += 1
        },
        clearNotifications: (state) => {
            state.notifications = []
            state.unreadCount = 0
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find((n) => n.id === action.payload)
            if (notification && !notification.read) {
                notification.read = true
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((notification) => {
                notification.read = true
            })
            state.unreadCount = 0
        }
    }
})

export const { addNotification, clearNotifications, markAsRead, markAllAsRead } = notificationSlice.actions

export default notificationSlice.reducer
