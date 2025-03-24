import { ComponentType, useEffect } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import TokenManager from "../../utils/TokenManager";
import homeRoutes from "modules/Home/routing/routes";

type PublicRouteProps = {
  path?: string | string[];
  restricted?: boolean;
  component: ComponentType<any>;
  exact?: boolean;
};

const PublicRoute: React.FC<PublicRouteProps> = (props) => {
  const { path, component: PublicComponent, restricted = false } = props;
  const location = useLocation();
  console.log(location);

  const hasToken = !!TokenManager.getAccessToken();
  const shouldRedirect =
    hasToken &&
    restricted &&
    sessionStorage.getItem("shouldRedirect") === "true";

  useEffect(() => {
    // Reset shouldRedirect on page load or direct URL entry
    sessionStorage.setItem("shouldRedirect", "false");
  }, []);

  return (
    <Route
      path={path}
      render={(props) =>
        shouldRedirect ? (
          <Redirect
            to={{
              pathname: homeRoutes.root,
              state: { target: props.location },
            }}
          />
        ) : (
          <PublicComponent {...props} />
        )
      }
    />
  );
};

export const navigateWithRedirect = (to: string) => {
  sessionStorage.setItem("shouldRedirect", "true");
  return to;
};

export default PublicRoute;
