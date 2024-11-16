import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userLoggedOut } from 'core/session/slices/session'
import { RegisterState } from './types'
import { RegisterUserParams } from '../../types'
import { addRegisterUser} from '../../api/usersService'
import { history } from '../../../../store'
import routes from '../../routing/routes'
import { message } from 'antd'


const initialState: RegisterState = {
  registerRequest: {},
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addUser.pending, state => {
        state.registerRequest = { isLoading: true }
      })
      .addCase(addUser.fulfilled, (state, action) => {
        const { content, error } = action.payload
        state.registerRequest = { isLoading: false, result: content, error }
      })

      // Clear store if 'userLoggedOut' happened
      .addCase(userLoggedOut, () => initialState)
  },
})

export const {} = registerSlice.actions
export default registerSlice.reducer

export const addUser = createAsyncThunk('register/addUser',
  async (values:RegisterUserParams, {dispatch}) => {
  const response = await addRegisterUser(values)
    // console.log(1777, response)
    // console.log(2777, response.error?.detail[0].msg)
    if(response.success) {
      history.push(routes.users)
      message.success('User added successfully', 1);
    }
    if(response.error){
      message.error(`${(response.error?.detail[0].msg)?response.error?.detail[0].msg:response.error?.detail}`, 3);
    }


  return response
})


