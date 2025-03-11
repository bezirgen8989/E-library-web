import { RecoverPasswordForm } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { getLocalization, recoverPassword } from "../slices/auth";

const RecoverPasswordContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage.isoCode2char));
  }, [dispatch, parsedAppLanguage]);

  const handleSubmit = useCallback(
    (values) => {
      dispatch(recoverPassword(values));
      if (values.email) {
        localStorage.setItem("recoveryEmail", values.email);
      }
    },
    [dispatch]
  );

  return <RecoverPasswordForm onSubmit={handleSubmit} />;
};

export default RecoverPasswordContainer;
