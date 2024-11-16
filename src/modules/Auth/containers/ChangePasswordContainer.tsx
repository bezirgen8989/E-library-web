import {ChangePasswordForm} from 'modules/Auth/components'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {resetPassword} from '../slices/auth'

const ChangePasswordContainer: React.FC = () => {
  const dispatch = useDispatch()

  const handleSubmit = useCallback((values) => {
    dispatch(resetPassword(values))
  }, [dispatch])

  return <ChangePasswordForm onSubmit={handleSubmit} />
}

export default ChangePasswordContainer
