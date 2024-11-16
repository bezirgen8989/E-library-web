import React, { useState } from 'react'
import 'antd/dist/antd.css'
import { Form, Input } from 'antd'
import styles from '../../UserManagementCommon.module.scss'
import { useDispatch } from 'react-redux'
import { editUser, getMe } from '../../../../Auth/slices/auth'
import { EditUserParams } from '../../../../Auth/types'

import { Collapse } from 'antd';
import Button from "../../../../../components/common/Buttons/Button";

const { Panel } = Collapse;

export type PropsForEdit = {
  email?: string,
  name?: string,
  is_active?: boolean
}

const EditForm: React.FC<PropsForEdit> = ({ email, name, is_active }) => {
  const dispatch = useDispatch()
  const [fields, setFields] = useState([
    {
      name: ['username'],
      value: name,
    },
    {
      name: ['email'],
      value: email,
    },
    {
      name: ['oldpassword'],
      value: '',
    },
    {
      name: ['newpassword'],
      value: '',
    },
  ])

  const onSubmitValues = () => {
    console.log('inn')
    dispatch(getMe())
    const editedData:EditUserParams = {
      name: (fields[0].value) as string,
      email: (fields[1].value) as string,
      old_password: fields[2]?.value,
      password: fields[3]?.value
    }
    console.log('editedData', editedData)
    dispatch(editUser(editedData))
  }
const [isPanelShow, setIsPanelShow] = useState(false)
  function callback(key:any) {
    console.log(key);
    setIsPanelShow(!isPanelShow)
  }


  return (
    <>
      <CustomizedForm
        onSubmitValues={onSubmitValues}
        fields={fields}
        isPanelShow={isPanelShow}
        callback={callback}
        onChange={(newFields: any) => {
          setFields(newFields)
        }}
      />
    </>
  )
}
export default EditForm

export type FormProps = {
  onSubmitValues: () => void,
  onChange: (values: any) => void,
  fields: any,
  callback: (value: any) => void
  isPanelShow: boolean
}

const CustomizedForm: React.FC<FormProps> = ({ isPanelShow, callback, onSubmitValues, onChange, fields }) => (

    <Form
      onFinish={onSubmitValues}
      name='global_state'
      fields={fields}
      onFieldsChange={(_, allFields) => {
        onChange(allFields)
      }}

    >
            <Form.Item
              name='username'
              label='Profile Name'
              rules={[
                {
                  required: true,
                  message: 'Username is required!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              {
                required: true,
                message: 'Username is required!',
              },
            ]}
          >
            <Input />
          </Form.Item>
      <div className="edit_profile_collapse">
        <Collapse defaultActiveKey={['0']} onChange={callback}>
          <Panel header="Click to change your password" key="1">
            {isPanelShow&&<div className="collapse_inner">
              <Form.Item
                name='oldpassword'
                label='Old Password:'
                rules={[
                  {
                    min: 8,
                    required: true,
                    message: 'Password must be at least 8 characters long!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name='newpassword'
                label='New Passport:'
                rules={[
                  {
                    min: 8,
                    required: true,
                    message: 'Confirm password or enter new!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
            </div>}
          </Panel>
        </Collapse>
      </div>
          <div className={styles.buttons_group}>
            <Button htmlType='submit'>Save Changes</Button>
          </div>


    </Form>

)






// import {
//   Form,
//   Input,
//   Select,
//   Row,
//   Col
// } from 'antd';
// import styles from '../../UserManagementCommon.module.scss'
// import CommonButton from '../../../../../components/common/CommonButton'
// import PhotoEditor from '../../common/PhotoEditor/PhotoEditor'
//
// const { Option } = Select
//

//
// const EditForm: React.FC<PropsForEdit> = ({email, name, is_active}) => {
//   const [form] = Form.useForm();
//   const onFinish = (values: any) => {
//     console.log('Received values of form: ', values);
//   };
//   return (
//     <>
//       <div className='registration_form'>
//         <Form
//           form={form}
//           name="register"
//           onFinish={onFinish}
//           initialValues={{
//             residence: ['zhejiang', 'hangzhou', 'xihu'],
//             prefix: '86',
//           }}
//           scrollToFirstError
//         >
//           <Row>
//              <Col span={7}>
//               <Form.Item
//                 name="username"
//                 label="Username"
//
//                 rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
//               >
//                 <Input />
//               </Form.Item>
//
//               <Form.Item
//                 name="email"
//                 label="E-mail:"
//                 rules={[
//                   {
//                     type: 'email',
//                     message: 'The input is not valid E-mail!',
//                   },
//                   {
//                     required: true,
//                     message: 'Please input your E-mail!',
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//
//               <Form.Item
//                 name="status"
//                 label="Status"
//                 rules={[{ required: true, message: 'Please select status!' }]}
//               >
//                 <Select placeholder="select your status">
//                   <Option value="active">Active</Option>
//                   <Option value="inactive">Inactive</Option>
//                 </Select>
//               </Form.Item>
//
//               {/*<Form.Item*/}
//               {/*  name="password"*/}
//               {/*  label="Password:"*/}
//               {/*  rules={[*/}
//               {/*    {*/}
//               {/*      required: true,*/}
//               {/*      message: 'Please input your password!',*/}
//               {/*    },*/}
//               {/*  ]}*/}
//               {/*  hasFeedback*/}
//               {/*>*/}
//               {/*  <Input.Password />*/}
//               {/*</Form.Item>*/}
//               {/*<Form.Item*/}
//               {/*  name="confirm"*/}
//               {/*  label="Confirm:"*/}
//               {/*  dependencies={['password']}*/}
//               {/*  hasFeedback*/}
//               {/*  rules={[*/}
//               {/*    {*/}
//               {/*      required: true,*/}
//               {/*      message: 'Please confirm your password!',*/}
//               {/*    },*/}
//               {/*    ({ getFieldValue }) => ({*/}
//               {/*      validator(_, value) {*/}
//               {/*        if (!value || getFieldValue('password') === value) {*/}
//               {/*          return Promise.resolve();*/}
//               {/*        }*/}
//               {/*        return Promise.reject(new Error('The two passwords that you entered do not match!'));*/}
//               {/*      },*/}
//               {/*    }),*/}
//               {/*  ]}*/}
//               {/*>*/}
//               {/*  <Input.Password />*/}
//               {/*</Form.Item>*/}
//
//             </Col>
//             <Col span={7}>
//               <Form.Item
//                 name="position"
//                 label="Position"
//                 rules={[{ required: false, message: 'Please input your position!', whitespace: true }]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="location"
//                 label="Location"
//                 rules={[{ required: false, message: 'Please input your location!', whitespace: true }]}
//               >
//                 <Input />
//               </Form.Item>
//
//               <Form.Item
//                 name="phone"
//                 label="Phone:"
//                 rules={[{ required: false, message: 'Please input your phone number!' }]}
//               >
//                 <Input style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//             <Col span={2}>
//               <PhotoEditor />
//             </Col>
//           </Row>
//           <div className={styles.buttons_group}>
//             <CommonButton htmlType="submit">Register</CommonButton>
//             {/*<CommonButton background='#7A7AFE' >Reset</CommonButton>*/}
//           </div>
//           {/*<Button type="primary" htmlType="submit">*/}
//           {/*  Register*/}
//           {/*</Button>*/}
//
//         </Form>
//       </div>
//     </>
//   )
// }
// export default EditForm
