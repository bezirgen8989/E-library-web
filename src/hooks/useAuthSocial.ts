import { API_PREFIX } from "api/apiHelpers";
import { useLocation, useHistory } from "react-router-dom";
// import { TokenManager } from 'utils';
import homeRoutes from "routing/routes";
import { SESSION_TOKEN } from "../utils/SessionUtils";

type Social = "facebook" | "google" | "twitter" | "apple";

const useAuthSocial = () => {
  const location = useLocation();
  const history = useHistory();
  debugger;
  const finishSocialLogin = () => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    // const refreshToken = params.get("refreshToken");
    console.log("token", token);

    if (token) {
      sessionStorage.setItem(SESSION_TOKEN, token);
      // TokenManager.setAccessToken(token);
      // TokenManager.setRefreshToken(refreshToken);
      //
      history.push(homeRoutes.root);
    }
  };

  const loginViaSocial = (social: Social) => {
    window.open(`${API_PREFIX}/api/v1/auth/${social}`, "_blank");
  };

  return { finishSocialLogin, loginViaSocial };
};

export default useAuthSocial;
