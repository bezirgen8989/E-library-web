import { Router, Route, Switch } from 'react-router-dom'
import { history } from 'store'
import ExternalRouting from './ExternalRouting'
import PrivateRouting from './PrivateRouting'
import rootRoutes from './routes'
import { ErrorBoundary, ApplicationError } from 'components/errors'
import { InitializationLayer } from 'core/layers'
import authRoutes from 'modules/Auth/routing/routes'

const RootRouting = () => {
  return (
    <Router history={history}>
      <ErrorBoundary FallbackComponent={ApplicationError}>
        <InitializationLayer>
          <div className='container'>
            <div className='main'>
              <Switch>
                <Route path={authRoutes.root} component={ExternalRouting} />
                <Route path={rootRoutes.root} component={PrivateRouting} />
              </Switch>
            </div>
          </div>
        </InitializationLayer>
      </ErrorBoundary>
    </Router>
  )
}

export default RootRouting
