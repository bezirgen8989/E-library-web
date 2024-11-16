import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'
import session from 'core/session/slices/session'
import auth from 'modules/Auth/slices/auth'
import home from 'modules/Home/slices/home'
import register from 'modules/UserManagement/slices/adminRegister'
import userList from 'modules/UserManagement/slices/userList'

export const history = createBrowserHistory()

const rootReducer = combineReducers({
  session,
  auth,
  home,
  register,
  userList,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => [...getDefaultMiddleware({ serializableCheck: false })],
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store
