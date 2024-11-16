import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userLoggedOut } from 'core/session/slices/session'
import {
  changeRole,
  changeStatus,
  deleteRegisterUser,
  getFilter,
  getUsers,
} from '../../api/usersService'
import { UserListState } from './types'

import { message } from 'antd'
import { UserData, UserDataRole, UserFilterParams } from '../../types'

const initialState: UserListState = {
  users: {},
  deletedUser: {},
  changedStatus: {},
  changedRole: {},
  filteredUsers: {},
}

const userSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadUsers.pending, state => {
        // state.users = { isLoading: true }
        state.users.isLoading = true
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        const { content, error } = action.payload
        state.users = { isLoading: false, result: content, error }
      })

      .addCase(deleteUser.pending, state => {
        state.deletedUser = { isLoading: true }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const { content, error } = action.payload
        state.deletedUser = { isLoading: false, result: content, error }
        // if(!error){
        //   const newUsers = state.users.filter(item => item.id !== iddwfwfwefwe)
        //   state.users =  newUsers
        // }
      })

      .addCase(changeUserStatus.pending, state => {
        // state.changedStatus = { isLoading: true }
        state.users.isLoading = true
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        const { content, error } = action.payload
        state.changedStatus = { isLoading: false, result: content, error }
      })

      .addCase(changeUserRole.pending, state => {
        // state.changedRole = { isLoading: true }
        state.users.isLoading = true
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        const { content, error } = action.payload
        state.changedRole = { isLoading: false, result: content, error }
      })

      // .addCase(getUsersFilter.pending, state => {
      //   // state.changedRole = { isLoading: true }
      //   state.users.isLoading = true
      // })
      // .addCase(getUsersFilter.fulfilled, (state, action) => {
      //   const { content, error } = action.payload
      //   state.filteredUsers = { isLoading: false, result: content, error }
      // })

      // Clear store if 'userLoggedOut' happened
      .addCase(userLoggedOut, () => initialState)
  },
})

export const {} = userSlice.actions
export default userSlice.reducer

export const loadUsers = createAsyncThunk('userList/loadUsers', async () => {
  const response = await getUsers()
  return response
})

export const deleteUser = createAsyncThunk(
  'userList/deleteUser',
  async (values: string, { dispatch }) => {
    const response = await deleteRegisterUser(values)
    const { error } = response
    if (error?.status === 204) {
      message.success(`user is deleted`, 2)
      dispatch(loadUsers())
    }
    return response
  }
)
export const changeUserStatus = createAsyncThunk(
  'userList/changeUserStatus',
  async (user: UserData, { dispatch }) => {
    const response = await changeStatus(user)
    const { error } = response
    console.log('new_status_response', response)
    if (!error) {
      message.success(`user status changed`, 2)
      dispatch(loadUsers())
    }
    return response
  }
)

export const changeUserRole = createAsyncThunk(
  'userList/changeUserRole',
  async (userRole: UserDataRole, { dispatch }) => {
    const response = await changeRole(userRole)
    const { error } = response
    console.log('new_status_response', response)
    if (!error) {
      message.success(`user role changed`, 2)
      dispatch(loadUsers())
    }
    return response
  }
)

export const getUsersFilter = createAsyncThunk(
  'userList/loadUsers',
  async (filterValue: UserFilterParams) => {
    const response = await getFilter(filterValue)
    return response
  }
)
