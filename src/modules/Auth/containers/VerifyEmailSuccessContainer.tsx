import { VerifyEmailSuccess } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getLocalization } from "../slices/auth";

const VerifyEmailSuccessContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage.isoCode2char));
    const storedEmail = localStorage.getItem("recoveryEmail");
    if (storedEmail) {
      setRecoveryEmail(storedEmail);
    }
    return () => {
      if (localStorage.getItem("recoveryEmail")) {
        localStorage.removeItem("recoveryEmail");
      }
    };
  }, [dispatch, parsedAppLanguage]);

  return <VerifyEmailSuccess recoveryEmail={recoveryEmail} />;
};

export default VerifyEmailSuccessContainer;
