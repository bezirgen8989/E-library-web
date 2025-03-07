import { VerifyEmailSuccess } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLocalization } from "../slices/auth";

const VerifyEmailSuccessContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage));
  }, [dispatch, parsedAppLanguage]);

  return <VerifyEmailSuccess />;
};

export default VerifyEmailSuccessContainer;
