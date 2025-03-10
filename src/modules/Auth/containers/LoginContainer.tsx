import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import { getLocalization, LoginUser } from "../slices/auth";
import LoginForm from "../components/LoginForm";

const LoginContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage.isoCode2char));
  }, [dispatch, parsedAppLanguage]);

  const handleSubmit = useCallback(
    (values) => {
      console.log("ContainersValue", values);
      dispatch(LoginUser(values));
    },
    [dispatch]
  );

  return <LoginForm onSubmit={handleSubmit} />;
};

export default LoginContainer;
