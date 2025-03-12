import { API_PREFIX } from "api/apiHelpers";
import { useLocation } from "react-router-dom";
// import { TokenManager } from 'utils';
// import contactsRoutes from 'modules/Contacts/routing/routes';

type Social = "facebook" | "google" | "twitter" | "apple";

const useAuthSocial = () => {
  const location = useLocation();
  // const history = useHistory();
  // const navigate = useNavigate();

  const finishSocialLogin = () => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken) {
      // TokenManager.setAccessToken(token);
      // TokenManager.setRefreshToken(refreshToken);
      //
      // navigate(contactsRoutes.root);
    }
  };

  const loginViaSocial = (social: Social) => {
    window.open(`${API_PREFIX}/api/v1/auth/${social}`, "_blank");
  };

  return { finishSocialLogin, loginViaSocial };
};

export default useAuthSocial;
