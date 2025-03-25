import { ComponentType } from "react";
import { Redirect, Route } from "react-router-dom";
import { TokenManager } from "utils";
import { AccessDenied } from "components/errors";
import authRoutes from "modules/Auth/routing/routes";

type PrivateRouteProps = {
  path?: string | string[];
  component: ComponentType<any>;
  exact?: boolean;
  disabled?: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const { path, component: ProtectedComponent, disabled, exact } = props;
  const isSessionExists = !!TokenManager.getAccessToken();

  function renderComponent(props: any) {
    if (!isSessionExists)
      return (
        <Redirect
          to={{
            pathname: authRoutes.onboarding,
            state: { target: props.location },
          }}
        />
      );

    if (!disabled) return <ProtectedComponent {...props} />;

    return <AccessDenied />;
  }

  return <Route exact={exact} path={path} render={renderComponent} />;
};

export default PrivateRoute;
