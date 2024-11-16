import { RegistrationForm } from 'modules/Auth/components'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {registerUser, updateCurrentEmail} from '../slices/auth'

const RegistrationContainer: React.FC = () => {
  const dispatch = useDispatch()

  const onSubmit = useCallback((userParams) => {
    dispatch(registerUser(userParams))
    dispatch(updateCurrentEmail(userParams?.email));
  }, [dispatch])

  return <RegistrationForm onSubmit={onSubmit} />
}

export default RegistrationContainer
