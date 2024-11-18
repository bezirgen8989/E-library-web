import { Suspense, lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { Spinner } from "components/common";
import routes from "./routes";

export { routes };

export const Profile = lazy(
  () =>
    import(
      /* webpackChunkName: "ProfileUserPage" */ "modules/UserManagement/pages/ProfileUserPage"
    )
);

const UsersRouting = () => (
  <Suspense fallback={<Spinner />}>
    <Switch>
      <Route exact path={routes.profile} component={Profile} />
      <Redirect path="*" to={routes.root} />
    </Switch>
  </Suspense>
);

export default UsersRouting;
