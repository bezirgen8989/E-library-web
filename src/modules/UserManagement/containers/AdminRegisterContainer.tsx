import { AdminRegisterComponent } from '../components'
import { useDispatch } from 'react-redux'
import { addUser } from '../slices/adminRegister'




const AdminRegisterContainer: React.FC = () => {
  const dispatch = useDispatch()


  const handleSubmit = (values:any) => {
    dispatch(addUser(values))
  }

  return (
    <>
      <AdminRegisterComponent handleSubmit={handleSubmit} />
    </>
  )
}

export default AdminRegisterContainer
