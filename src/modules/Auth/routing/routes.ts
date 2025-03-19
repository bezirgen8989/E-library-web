const base = "/auth";

const routes = {
  root: base,
  onboarding: `${base}/onboarding`,
  login: `${base}/login`,
  registration: `${base}/registration`,
  forgot: `${base}/forgot`,
  recoverPassword: `${base}/recover_password`,
  changePassword: `${base}/change-password`,
  verifyEmailSuccess: `${base}/success_email_verification`,
  enterCode: `${base}/enter_code`,
  ProfileHabits: `${base}/habits`,
  Profile: `${base}/profile_auth`,
  profileAbout: `${base}/profile_about`,
  termsAndConditions: `${base}/terms_and_conditions`,
  privacyPolicy: `${base}/privacy_policy`,
  deeplink: `${base}/deeplink`,
};

export default routes;
