import { Router, Route, Switch, useLocation } from "react-router-dom";
import { history } from "store";
import ExternalRouting from "./ExternalRouting";
import PrivateRouting from "./PrivateRouting";
import rootRoutes from "./routes";
import { ErrorBoundary, ApplicationError } from "components/errors";
import { InitializationLayer } from "core/layers";
import authRoutes from "modules/Auth/routing/routes";
import { useEffect } from "react";
import routes from "../modules/UserManagement/routing/routes";

const BackgroundUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    switch (true) {
      case location.pathname.startsWith(authRoutes.root):
        root.style.background = "linear-gradient(to bottom, #d3a271, #a46542)";
        break;
      case location.pathname === rootRoutes.root:
        root.style.background = "#FBF1EA";
        break;
      case location.pathname === routes.profile:
        root.style.background = "linear-gradient(to bottom, #d3a271, #a46542)";
        break;
      default:
        root.style.background = "white";
    }
  }, [location]);

  return null;
};

const RootRouting = () => {
  return (
    <Router history={history}>
      <ErrorBoundary FallbackComponent={ApplicationError}>
        <InitializationLayer>
          <BackgroundUpdater /> {/* Обновление фона */}
          <Switch>
            <Route path={authRoutes.root} component={ExternalRouting} />
            <Route path={rootRoutes.root} component={PrivateRouting} />
          </Switch>
        </InitializationLayer>
      </ErrorBoundary>
    </Router>
  );
};
export default RootRouting;
