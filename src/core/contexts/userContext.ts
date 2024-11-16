import { createContext } from 'react'
import { RegisterUserParams } from '../../modules/UserManagement/types'

const UserContext = createContext<RegisterUserParams>({})

export default UserContext