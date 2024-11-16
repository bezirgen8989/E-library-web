import { Suspense, lazy } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import { Spinner } from 'components/common'
import routes from './routes'

export { routes }

export const UserList = lazy(() => import(/* webpackChunkName: "UserList" */ 'modules/UserManagement/pages/UserList'))
export const AdminRegister = lazy(() => import(/* webpackChunkName: "AdminRegister" */ 'modules/UserManagement/pages/AdminRegister'))
export const ProfileEditor = lazy(() => import(/* webpackChunkName: "EditProfile" */ 'modules/UserManagement/pages/EditProfile'))
export const PermissionsPage = lazy(() => import(/* webpackChunkName: "Permissions" */ 'modules/UserManagement/pages/Permissions'))

const UsersRouting = () => (
  <Suspense fallback={<Spinner />}>
    <Switch>
      <Route exact path={routes.users} component={UserList} />
      <Route exact path={routes.register} component={AdminRegister} />
      <Route exact path={routes.edit} component={ProfileEditor} />
      <Route exact path={routes.permissions} component={PermissionsPage} />
      <Redirect path='*' to={routes.root} />
    </Switch>
  </Suspense>
)

export default UsersRouting
