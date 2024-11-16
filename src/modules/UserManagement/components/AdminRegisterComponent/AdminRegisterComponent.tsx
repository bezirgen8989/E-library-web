import styles from './../UserManagementCommon.module.scss'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
} from 'antd'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import Button from "../../../../components/common/Buttons/Button";

const { Option } = Select

export type RegisterProps = {
  handleSubmit: (values: any) => void
}

const AdminRegisterComponent: React.FC<RegisterProps> = ({handleSubmit}) => {


  const [form] = Form.useForm();

  const onFinish = (values: any):void =>  {
    handleSubmit(values)
  };
  return (
    <>
      <h1>Create</h1>
      <Breadcrumb>
        <Breadcrumb.Item><Link to='/'><HomeOutlined /></Link></Breadcrumb.Item>
        <Breadcrumb.Item>User Management</Breadcrumb.Item>
        <Breadcrumb.Item>Create</Breadcrumb.Item>
      </Breadcrumb>
      <div className='registration_form'>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ['zhejiang', 'hangzhou', 'xihu'],
            prefix: '86',
          }}
          scrollToFirstError
        >
          <Row>

            <Col span={8}>
              <Form.Item
                name="employeeId"
                label="Employee Id"
                rules={[{ required: false, message: 'Please input your id!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Profile Name"
                rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password:"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm:"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: false,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="is_active"
                label="Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select placeholder="select your status">
                  <Option value={true}>Active</Option>
                  {/*<Option value={false}>Inactive</Option>*/}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: false, message: 'Please input your position!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: false, message: 'Please input your location!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="E-mail:"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone:"
                rules={[{ required: false, message: 'Please input your phone number!' }]}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select your role!' }]}
              >
                <Select placeholder="select your position">
                  <Option value="guest">User</Option>
                </Select>
              </Form.Item>
            </Col>

            {/*<Col span={2}>*/}
            {/*  <PhotoEditor />*/}
            {/*</Col>*/}
          </Row>


          <div className={styles.buttons_group}>
            <Button htmlType="submit">Create</Button>
            {/*<CommonButton background='#7A7AFE' >Reset</CommonButton>*/}
          </div>
          {/*<Button type="primary" htmlType="submit">*/}
          {/*  Register*/}
          {/*</Button>*/}

        </Form>

      </div>


    </>
  )
}

export default AdminRegisterComponent
