import { Breadcrumb, Checkbox, Form, Table } from 'antd'
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const PermissionsComponent: React.FC = () => {

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Permission',
      dataIndex: 'permission',
      key: 'permission',
      render: (permission:any) => (
        <div className='normalize_form'>
          {permission.map((item:any) => {
            return (
              <Form className='normalize_form' initialValues={{'checkbox-group': ['A']}}>
                <Form.Item name="checkbox-group">
                  <Checkbox.Group>
                    <Checkbox value="A" >{item.title}</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Form>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];
  const data = [
    {
      name: 'Administrator',
      item: 'Dashboard',
      permission: [
        { title: 'view', checked: false },
        { title: 'add', checked: false },
        { title: 'edit',  checked: false,},
        { title: 'delete', checked: false }
      ],
      status: 'Active',
    },
    {
      name: '',
      item: 'Air Quality',
      permission: [{ title: 'view', checked: false }, { title: 'add', checked: false }, {
        title: 'edit',
        checked: false,
      }, { title: 'delete', checked: false }],
      status: '',
    },
    {
      name: '',
      item: 'Smart Lighting',
      permission: [{ title: 'view', checked: false }, { title: 'add', checked: false }, {
        title: 'edit',
        checked: false,
      }, { title: 'delete', checked: false }],
      status: '',
    },
    {
      name: '',
      item: 'Free Internet',
      permission: [{ title: 'view', checked: false }, { title: 'add', checked: false }, {
        title: 'edit',
        checked: false,
      }, { title: 'delete', checked: false }],
      status: '',
    },
    {
      name: '',
      item: 'CCTV',
      permission: [{ title: 'view', checked: false }, { title: 'add', checked: false }, {
        title: 'edit',
        checked: false,
      }, { title: 'delete', checked: false }],
      status: '',
    },
    {
      name: '',
      item: 'Digital Signage',
      permission: [{ title: 'view', checked: true }, { title: 'add', checked: false }, {
        title: 'edit',
        checked: false,
      }, { title: 'delete', checked: false }],
      status: '',
    },
    {
      name: '',
      item: 'Complaint',
      permission: [{ title: 'view', checked: false }, { title: 'add', checked: false }, {
        title: 'edit',
        checked: false,
      }, { title: 'delete', checked: false }],
      status: '',
    },
  ]
  return (
    <>
      <h1>Permissions (page is under construction!) <LoadingOutlined /></h1>
      <Breadcrumb>
        <Breadcrumb.Item><Link to='/'><HomeOutlined /></Link></Breadcrumb.Item>
        <Breadcrumb.Item>User Management</Breadcrumb.Item>
        <Breadcrumb.Item>Permission</Breadcrumb.Item>
      </Breadcrumb>
        <Table dataSource={data} columns={columns} />;

    </>
  )
}

export default PermissionsComponent