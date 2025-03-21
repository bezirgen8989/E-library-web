import { ComponentType, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import homeRoutes from "modules/Home/routing/routes";
import TokenManager from "../../utils/TokenManager";

type PublicRouteProps = {
  path?: string | string[];
  restricted?: boolean;
  component: ComponentType<any>;
  exact?: boolean;
};

const PublicRoute: React.FC<PublicRouteProps> = (props) => {
  const { path, component: PublicComponent, restricted = false } = props;
  // const location = useLocation();

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
