import { Suspense, lazy } from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { PublicRoute } from 'routing/components'
import routes from './routes'
// import { Loading } from "../components";
import {Spinner} from "../../../components/common";

export { routes }

export const OnboardingRoute = lazy(() => import(/* webpackChunkName: "OnboardingRoute" */ 'modules/Auth/pages/Onboarding'))
export const LoginRoute = lazy(() => import(/* webpackChunkName: "LoginRoute" */ 'modules/Auth/pages/Login'))
export const RegistrationRoute = lazy(() => import(/* webpackChunkName: "RegistrationRoute" */ 'modules/Auth/pages/Registration'))
export const ForgotRoute = lazy(() => import(/* webpackChunkName: "ForgotRoute" */ 'modules/Auth/pages/ForgotPage'))
export const RecoverPasswordRoute = lazy(() => import(/* webpackChunkName: "RecoverPasswordRoute" */ 'modules/Auth/pages/RecoverPassword'))
export const ChangePasswordRoute = lazy(() => import(/* webpackChunkName: "ChangePasswordRoute" */ 'modules/Auth/pages/ChangePasswordPage'))
export const VerifyEmailSuccessRoute = lazy(() => import(/* webpackChunkName: "VerifyEmailSuccessRoute" */ 'modules/Auth/pages/VerifyEmailSuccessPage'))
export const EnterCodeRoute = lazy(() => import(/* webpackChunkName: "EnterCodeRoute" */ 'modules/Auth/pages/EnterCodePage'))
export const ProfileHabitsRoute = lazy(() => import(/* webpackChunkName: "ProfileHabitsRoute" */ 'modules/Auth/pages/ProfileHabitsPage'))
export const ProfileAuthRoute = lazy(() => import(/* webpackChunkName: "ProfileAuthRoute" */ 'modules/Auth/pages/ProfilePage'))
export const Error404Route = lazy(() => import(/* webpackChunkName: "Error404Route" */ 'modules/Auth/pages/404Page'))

const AuthRouting = () => (
  <Suspense fallback={<Spinner />}>
    <Switch>
      <PublicRoute exact path={routes.onboarding} component={OnboardingRoute} restricted />
      <PublicRoute exact path={routes.login} component={LoginRoute} restricted />
      <PublicRoute exact path={routes.registration} component={RegistrationRoute} restricted />
      <PublicRoute exact path={routes.forgot} component={ForgotRoute} restricted />
      <PublicRoute exact path={routes.recoverPassword} component={RecoverPasswordRoute} restricted />
      <PublicRoute exact path={routes.changePassword} component={ChangePasswordRoute} restricted />
      <PublicRoute exact path={routes.verifyEmailSuccess} component={VerifyEmailSuccessRoute} restricted />
      <PublicRoute exact path={routes.enterCode} component={EnterCodeRoute} restricted />
      <PublicRoute exact path={routes.ProfileHabits} component={ProfileHabitsRoute} restricted />
      <PublicRoute exact path={routes.Profile} component={ProfileAuthRoute} restricted />
      <PublicRoute exact path={routes.Error404} component={Error404Route} restricted />

      <Redirect path='*' to={routes.onboarding} />
    </Switch>
  </Suspense>
)

export default AuthRouting
