import EditForm from './EditForm/EditForm'
import { Breadcrumb, Row, Col} from 'antd'
import { Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import { useLazySelector } from '../../../../hooks'
import PhotoEditor from '../common/PhotoEditor/PhotoEditor'

const EditProfileComponent: React.FC = () => {

  const { result,  } = useLazySelector(({ auth }) => {
    const { userData } = auth
    const {result,} = userData
    return {
      result,
    }
  })

  return (
    <>
      <h1>Edit Profile</h1>
      <Breadcrumb>
        <Breadcrumb.Item><Link to='/'><HomeOutlined /></Link></Breadcrumb.Item>
        <Breadcrumb.Item>Edit Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div className='registration_form'>
        <Row>
          <Col span={8}>
            <EditForm email={result?.email} name={result?.name} is_active={result?.is_active}/>
          </Col>
          <Col span={8}>
            <PhotoEditor />
          </Col >
        </Row>
      </div>
    </>
  )
}

export default EditProfileComponent
