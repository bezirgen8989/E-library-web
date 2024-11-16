import { ForgotForm } from 'modules/Auth/components'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { recoverPassword } from '../slices/auth'



const ForgotContainer: React.FC = () => {
  const dispatch = useDispatch()

  const onSubmitEmail = useCallback((email:string)=>{
    console.log(123, email)
    dispatch(recoverPassword(email))
  }, [dispatch])

  return <ForgotForm onSubmitEmail={onSubmitEmail} />
}

export default ForgotContainer
