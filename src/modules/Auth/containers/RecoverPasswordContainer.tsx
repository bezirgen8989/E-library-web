import { RecoverPasswordForm } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { getLocalization, recoverPassword } from "../slices/auth";

const RecoverPasswordContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage));
  }, [dispatch, parsedAppLanguage]);

  const handleSubmit = useCallback(
    (values) => {
      console.log("RecoverValue", values);
      dispatch(recoverPassword(values));
    },
    [dispatch]
  );

  return <RecoverPasswordForm onSubmit={handleSubmit} />;
};

export default RecoverPasswordContainer;
