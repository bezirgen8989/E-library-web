import { API_PREFIX } from "api/apiHelpers";
import { useLocation, useHistory } from "react-router-dom";
import authRoutes from "../modules/Auth/routing/routes";
import { SESSION_TOKEN } from "../utils/SessionUtils";

type Social = "facebook" | "google" | "twitter" | "apple";

const useAuthSocial = () => {
  const location = useLocation();
  const history = useHistory();

  const finishSocialLogin = async () => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");

    if (token) {
      sessionStorage.setItem(SESSION_TOKEN, token);
      // const response = await authMe();

      // if (response.success && response.content.userName) {
      //   history.push(homeRoutes.root)
      // } else {
      history.push(authRoutes.ProfileHabits);
      // }
      // TokenManager.setAccessToken(token);
      // TokenManager.setRefreshToken(refreshToken);
      //
      // userName
      //   ? history.push(homeRoutes.root)
      //   : history.push(authRoutes.ProfileHabits);
    }
  };

  const loginViaSocial = (social: Social) => {
    window.open(`${API_PREFIX}/api/v1/auth/${social}`, "_blank");
  };

  return { finishSocialLogin, loginViaSocial };
};

export default useAuthSocial;
