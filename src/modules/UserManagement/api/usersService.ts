import { RegisterUserParams, UserData, UserDataRole, UserFilterParams } from '../types'
import { usingDelete, usingGet, usingPost, usingPut } from '../../../api/apiHelpers'

export const addRegisterUser = (registerParams: RegisterUserParams) =>
  usingPost('/admin_dashboard/', registerParams)
export const deleteRegisterUser = (deleteParams: string) =>
  usingDelete(`/admin_dashboard/${deleteParams}`)
export const changeStatus = (user: UserData) =>
  usingPut(`/admin_dashboard/${user.id}`, { is_active: user.is_active })
export const changeRole = (userRole: UserDataRole) =>
  usingPut(`/admin_dashboard/${userRole.id}`, { role: userRole.role })
export const getUsers = () => usingGet('/admin_dashboard/users')
export const getFilter = ({ name, email, role, is_active, order_by }: UserFilterParams) =>
  usingGet(
    `/admin_dashboard/users?${name ? 'name=' + name : ''}${email ? '&email=' + email : ''}${
      role ? '&role=' + role : ''
    }${is_active ? '&is_active=' + is_active : ''}${order_by ? '&order_by=' + order_by : ''}`
  )
