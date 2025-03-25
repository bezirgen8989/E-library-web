import { API_PREFIX } from "api/apiHelpers";
import { useLocation, useHistory } from "react-router-dom";
import authRoutes from "../modules/Auth/routing/routes";
import { authMe } from "../modules/Auth/api/authService";
import homeRoutes from "routing/routes";
import TokenManager from "../utils/TokenManager";

type Social = "facebook" | "google" | "twitter" | "apple";

const useAuthSocial = () => {
  const location = useLocation();
  const history = useHistory();

  const finishSocialLogin = async () => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token) {
      TokenManager.setAccessToken(token);
      refreshToken && TokenManager.setRefreshToken(refreshToken);
      const response = await authMe();

      if (response.success && response.content.userName) {
        history.push(homeRoutes.root);
      } else {
        history.push(authRoutes.ProfileHabits);
      }
    }
  };

  const loginViaSocial = (social: Social) => {
    window.open(`${API_PREFIX}/api/v1/auth/${social}`, "_blank");
  };

  return { finishSocialLogin, loginViaSocial };
};

export default useAuthSocial;
