import styles from '../RegistrationForm/RegistrationForm.module.scss'
import { Link } from 'react-router-dom'
import logo from '../../../../assets/images/5GCT-logo-new.svg'
import { Form, Input } from 'antd'
import Button from "../../../../components/common/Buttons/Button";

type RecoverProps = {
  onSubmitEmail: (email:string) => void
}

const ForgotForm: React.FC<RecoverProps> = ({onSubmitEmail}) => {

  const onFinish = (email: string) => {
    onSubmitEmail(email)
  }

  return (
    <div className={styles.user_registration_form}>
      <div className={styles.registration_logo}>
        <Link to='/auth/login'>
          <img src={logo} alt='' />
        </Link>
      </div>
      <h1>Forgot your password?</h1>
      <h3>Enter your email and we will send you a link for password recovery</h3>
      <div className='user_registration'>
        <Form
          // form={form}
          name='forgot'
          onFinish={onFinish}
          scrollToFirstError
        >
            <Form.Item
              name='email'
              label='E-mail:'
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

          <div className={styles.buttons_group}>
            <Button htmlType='submit'>Send a letter</Button>
          </div>

        </Form>
      </div>
    </div>
  )
}

export default ForgotForm
