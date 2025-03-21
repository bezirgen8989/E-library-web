import { API_PREFIX } from "api/apiHelpers";
import { useLocation, useHistory } from "react-router-dom";
// import { TokenManager } from 'utils';
import authRoutes from "../modules/Auth/routing/routes";
import { SESSION_TOKEN } from "../utils/SessionUtils";
import { useLazySelector } from "./index";
import homeRoutes from "routing/routes";
import { getMe } from "../modules/Auth/slices/auth";
import { useDispatch } from "react-redux";

type Social = "facebook" | "google" | "twitter" | "apple";

const useAuthSocial = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const userName = useLazySelector(
    ({ auth }) => auth?.userData?.result?.userName
  );

  console.log("userName", userName);
  const finishSocialLogin = () => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    dispatch(getMe());
    if (token) {
      sessionStorage.setItem(SESSION_TOKEN, token);
      // TokenManager.setAccessToken(token);
      // TokenManager.setRefreshToken(refreshToken);
      //
      userName
        ? history.push(homeRoutes.root)
        : history.push(authRoutes.ProfileHabits);
    }
  };

  const loginViaSocial = (social: Social) => {
    window.open(`${API_PREFIX}/api/v1/auth/${social}`, "_blank");
  };

  return { finishSocialLogin, loginViaSocial };
};

export default useAuthSocial;
