import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ExternalLayer } from 'core/layers'
import { Spinner } from 'components/common'
import AuthRouting, { routes as authRoutes } from 'modules/Auth/routing'

const ExternalRouting = () => {
  return (
    <ExternalLayer>
      <Suspense fallback={<Spinner />}>
        <div className='wrap'>
          <Switch>
            <Route path={authRoutes.root} component={AuthRouting} />
          </Switch>
        </div>
      </Suspense>
    </ExternalLayer>
  )
}

export default ExternalRouting
