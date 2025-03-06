import { RegistrationForm } from "modules/Auth/components";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getLocalization,
  registerUser,
  updateCurrentEmail,
} from "../slices/auth";

const RegistrationContainer: React.FC = () => {
  const dispatch = useDispatch();
  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage));
  }, [dispatch, parsedAppLanguage]);

  const onSubmit = useCallback(
    (userParams) => {
      dispatch(registerUser(userParams));
      dispatch(updateCurrentEmail(userParams?.email));
    },
    [dispatch]
  );

  return <RegistrationForm onSubmit={onSubmit} />;
};

export default RegistrationContainer;
