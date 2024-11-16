import styles from './UserListComponent.module.scss'
import {
  HomeOutlined,
  SearchOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import {
  Form,
  Input,
  Select,
  Table,
  Row,
  Col,
  Breadcrumb,
  Popconfirm,
  Tooltip,
  Collapse,
} from 'antd'
// import { User } from '../../../Home/types'
import { Link } from 'react-router-dom'
import React from 'react'
import Button from "../../../../components/common/Buttons/Button";

const { Panel } = Collapse

const { Option } = Select

export type UserListProps = {
  error: any
  isLoading: boolean
  data?: any
  onDeleteUser: (values: string) => void
  changeStatus: (id: string, status: boolean) => void
  changeRole: (id: string, role: string) => void
  filterUsers: (value: string) => void
}

const UserListComponent: React.FC<UserListProps> = props => {
  const { data, onDeleteUser, changeStatus, changeRole, filterUsers } = props

  function cancel(e: any) {
    console.log(e)
  }

  function handleChange(role: string, id: string) {
    changeRole(role, id)
  }

  // function onChange(date: any, dateString: any) {
  //   console.log(date, dateString)
  // }
  const [form] = Form.useForm()

  const onFinish = (values: any): void => {
    filterUsers(values)
  }
  const onReset = () => {
    form.resetFields()
  }

  const columns = [
    // {
    //   title: 'Profile Name',
    //   dataIndex: 'name',
    //   key: 'name',
    // },
    {
      title: 'Profile Name',
      dataIndex: 'id',
      key: 'photo_url',
      render: (id: any, data: any) => (
        <div className={styles.flex_block}>
          <div className={styles.user_photo}>
            <img src={data?.photo_url} alt='' />
          </div>
          <span>{data?.name}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'id',
      key: 'is_active',
      render: (id: any, data: any) => (
        <>
          <Tooltip
            placement='rightTop'
            title={data.is_active ? 'Click to make user Inactive' : 'Click to make user Active'}
          >
            {data.is_active ? (
              <button
                onClick={() => {
                  changeStatus(id, data.is_active)
                }}
                className={styles.active_status}
              >
                A
              </button>
            ) : (
              <button
                onClick={() => {
                  changeStatus(id, data.is_active)
                }}
                className={styles.inactive_status}
              >
                I
              </button>
            )}
          </Tooltip>
        </>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'id',
      key: 'role',
      render: (id: any, data: any) => (
        <>
          <Select
            defaultValue={data.role}
            style={{ width: 115 }}
            onChange={value => handleChange(value, id)}
          >
            <Option value='guest'>guest</Option>
            <Option value='city_staff'>city staff</Option>
            <Option value='city_admin'>city admin</Option>
            <Option value='super_admin' disabled>
              super admin
            </Option>
          </Select>
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'delete',
      render: (id: string) => (
        <>
          <Popconfirm
            title='Are you sure to delete this User?'
            onConfirm={() => {
              onDeleteUser(id)
            }}
            onCancel={cancel}
            okText='Yes'
            cancelText='No'
            icon={<QuestionCircleOutlined style={{ color: '#ff007c', fontSize: 18 }} />}
          >
            <Tooltip placement='rightTop' title='Delete user'>
              <button className={styles.delete_button}>
                <DeleteOutlined />
              </button>
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <>
      <h1>Users</h1>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>User Management</Breadcrumb.Item>
        <Breadcrumb.Item>User List</Breadcrumb.Item>
      </Breadcrumb>

      <Collapse defaultActiveKey={['0']}>
        <Panel header='Click if you want to apply filters' key='1'>
          <Form form={form} name='register' onFinish={onFinish}>
            <div className={styles.filters_block}>
              <Row>
                <Col span={3}>
                  <div className={styles.inner_col}>
                    <Form.Item name='name' rules={[{ message: 'Please input name!' }]}>
                      <Input prefix={<SearchOutlined />} placeholder='Name' />
                    </Form.Item>
                  </div>
                </Col>
                <Col span={3}>
                  <div className={styles.inner_col}>
                    <Form.Item name='email' rules={[{ message: 'Please input email!' }]}>
                      <Input prefix={<SearchOutlined />} placeholder='Email' />
                    </Form.Item>
                  </div>
                </Col>
                <Col span={3}>
                  <div className={styles.inner_col}>
                    <Form.Item name='role'>
                      <Select placeholder='Choose a role'>
                        <Select.Option value='super_admin'>Super admin</Select.Option>
                        <Select.Option value='city_admin'>City admin</Select.Option>
                        <Select.Option value='city_staff'>City staff</Select.Option>
                        <Select.Option value='guest'>Guest</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col span={3}>
                  <div className={styles.inner_col}>
                    <Form.Item name='is_active'>
                      <Select placeholder='Choose a status'>
                        <Select.Option value={true}>Active</Select.Option>
                        <Select.Option value={false}>Inactive</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col span={3}>
                  <div className={styles.inner_col}>
                    <Form.Item name='order_by'>
                      <Select placeholder='Order by'>
                        <Select.Option value='name'>Name</Select.Option>
                        <Select.Option value='email'>Email</Select.Option>
                        <Select.Option value='role'>Role</Select.Option>
                        <Select.Option value='register_date'>Date of registration</Select.Option>
                        <Select.Option value='is_active'>Status</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                {/*<Col span={3}>*/}
                {/*  <div className={styles.inner_col}>*/}
                {/*    <Form.Item>*/}
                {/*      <Select placeholder='Condition Type'>*/}
                {/*        <Select.Option value='demo'>Demo</Select.Option>*/}
                {/*        <Select.Option value='demo'>Demo</Select.Option>*/}
                {/*      </Select>*/}
                {/*    </Form.Item>*/}
                {/*  </div>*/}
                {/*</Col>*/}
                {/*<Col span={3}>*/}
                {/*  <Form.Item*/}
                {/*    // name='from_date'*/}
                {/*  >*/}
                {/*  <div className={`${styles.inner_col} ${styles.inner_col_before}`}>*/}
                {/*    <DatePicker onChange={onChange} />*/}
                {/*  </div>*/}
                {/*  </Form.Item>*/}
                {/*</Col>*/}
                {/*<Col span={3}>*/}
                {/*  <Form.Item*/}
                {/*    // name='to_date'*/}
                {/*  >*/}
                {/*    <div className={`${styles.inner_col} ${styles.inner_col_after}`}>*/}
                {/*      <DatePicker onChange={onChange} />*/}
                {/*    </div>*/}
                {/*  </Form.Item>*/}
                {/*</Col>*/}
                <Col span={2}>
                  <div className={styles.inner_col}>
                    <Button htmlType='submit'>Search</Button>
                  </div>
                </Col>
                <Col span={2}>
                  <Button
                    htmlType='button'
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
              {/*<Row>*/}
              {/*  <Col span={3}>*/}
              {/*    <div className={`${styles.inner_col} ${styles.inner_col_before}`}>*/}
              {/*      <DatePicker onChange={onChange} />*/}
              {/*    </div>*/}
              {/*  </Col>*/}
              {/*  <Col span={3}>*/}
              {/*    <div className={`${styles.inner_col} ${styles.inner_col_after}`}>*/}
              {/*      <DatePicker onChange={onChange} />*/}
              {/*    </div>*/}
              {/*  </Col>*/}
              {/*  <Col span={3}>*/}
              {/*    <div className={styles.inner_col}>*/}
              {/*      <Form.Item>*/}
              {/*        <Select placeholder='Condition Type'>*/}
              {/*          <Select.Option value='demo'>Demo</Select.Option>*/}
              {/*          <Select.Option value='demo'>Demo</Select.Option>*/}
              {/*        </Select>*/}
              {/*      </Form.Item>*/}
              {/*    </div>*/}
              {/*  </Col>*/}
              {/*  <Col span={3}>*/}
              {/*    <div className={styles.inner_col}>*/}
              {/*      <Form.Item>*/}
              {/*        <Select placeholder='Condition Type'>*/}
              {/*          <Select.Option value='demo'>Demo</Select.Option>*/}
              {/*          <Select.Option value='demo'>Demo</Select.Option>*/}
              {/*        </Select>*/}
              {/*      </Form.Item>*/}
              {/*    </div>*/}
              {/*  </Col>*/}
              {/*</Row>*/}
              <Row>
                {/*<Col span={10}>*/}
                {/*</Col>*/}
              </Row>
            </div>
          </Form>
        </Panel>
      </Collapse>

      <Table dataSource={data} columns={columns} />
    </>
  )
}

export default UserListComponent
