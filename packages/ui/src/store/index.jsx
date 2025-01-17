import { createStore, combineReducers } from 'redux'
import customizationReducer from './reducers/customizationReducer'
import canvasReducer from './reducers/canvasReducer'
import notifierReducer from './reducers/notifierReducer'
import dialogReducer from './reducers/dialogReducer'
import authReducer from './reducers/authReducer' // Create this file next

const reducer = combineReducers({
    customization: customizationReducer,
    canvas: canvasReducer,
    notifier: notifierReducer,
    dialog: dialogReducer,
    auth: authReducer
})

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = createStore(reducer)
const persister = 'Free'

export { store, persister }
