const BASE_PATH = '/users-management'
const routes = {
  root: BASE_PATH,
  users: `${BASE_PATH}/user-list`,
  register: `${BASE_PATH}/create`,
  edit: `${BASE_PATH}/edit-profile`,
  permissions: `${BASE_PATH}/permissions`

}
export default routes
