import { UserListComponent } from '../components'
import { useLazySelector } from '../../../hooks'
import { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import {
  changeUserRole,
  changeUserStatus,
  deleteUser,
  getUsersFilter,
  loadUsers,
} from '../slices/userList'

const UserListContainer: React.FC = () => {
  const dispatch = useDispatch()
  const { isLoading, error, data } = useLazySelector(({ userList }) => {
    const { users } = userList
    const { isLoading, error, result } = users
    return {
      isLoading,
      error,
      data: result,
    }
  })

  useEffect(() => {
    dispatch(loadUsers())
  }, [])

  const onDeleteUser = (id: string): void => {
    dispatch(deleteUser(id))
  }

  const toggleStatus = (status: boolean) => {
    return !status
  }

  const changeStatus = (id: string, status: boolean) => {
    const is_active = toggleStatus(status)
    dispatch(changeUserStatus({ id, is_active }))
  }

  const changeRole = (role: string, id: string) => {
    dispatch(changeUserRole({ role, id }))
  }

  const filterUsers = (filterValue: any) => {
    dispatch(getUsersFilter(filterValue))
  }

  return (
    <UserListComponent
      filterUsers={filterUsers}
      changeRole={changeRole}
      changeStatus={changeStatus}
      onDeleteUser={onDeleteUser}
      error={error}
      isLoading={isLoading}
      data={data}
    />
  )
}
export default UserListContainer
