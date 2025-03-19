import { Router, Route, Switch } from "react-router-dom";
import { history } from "store";
import ExternalRouting from "./ExternalRouting";
import PrivateRouting from "./PrivateRouting";
import rootRoutes from "./routes";
import { ErrorBoundary, ApplicationError } from "components/errors";
import { InitializationLayer } from "core/layers";
import authRoutes from "modules/Auth/routing/routes";
import { BackgroundUpdater } from "../helpers/BackgroundUpdater";
import Deeplink from "../modules/Auth/components/Deeplink/Deeplink";

const RootRouting = () => {
  return (
    <Router history={history}>
      <ErrorBoundary FallbackComponent={ApplicationError}>
        <InitializationLayer>
          <BackgroundUpdater /> {/* Обновление фона */}
          <Switch>
            <Route path={authRoutes.root} component={ExternalRouting} />
            <Route path={rootRoutes.root} component={PrivateRouting} />
            {/* for social login */}
            <Route path={"/deeplink"} component={Deeplink} />
          </Switch>
        </InitializationLayer>
      </ErrorBoundary>
    </Router>
  );
};
export default RootRouting;
