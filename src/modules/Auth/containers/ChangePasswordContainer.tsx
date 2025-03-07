import { ChangePasswordForm } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { getLocalization, resetPassword } from "../slices/auth";

const ChangePasswordContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage));
  }, [dispatch, parsedAppLanguage]);

  const handleSubmit = useCallback(
    (values) => {
      dispatch(resetPassword(values));
    },
    [dispatch]
  );

  return <ChangePasswordForm onSubmit={handleSubmit} />;
};

export default ChangePasswordContainer;
