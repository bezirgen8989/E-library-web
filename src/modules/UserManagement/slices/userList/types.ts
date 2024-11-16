import { ApiPayload } from 'types/api'
import { User } from '../../../Home/types'
// import { User } from 'modules/Home/types'

// export type HomeState = {
//   users: ApiPayload<User[]>
//   counter: number
// }
export type UserListState = {
  deletedUser: ApiPayload<string>
  changedStatus: ApiPayload<boolean>
  changedRole: ApiPayload<string>
  users: ApiPayload<User[]>
  filteredUsers: any
}
