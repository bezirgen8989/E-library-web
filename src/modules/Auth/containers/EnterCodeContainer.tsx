import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { EnterCodeForm } from "../components";
import {
  codeResend,
  emailConfirm,
  getLocalization,
  getMe,
} from "../slices/auth";
import { useLazySelector } from "../../../hooks";

const EnterCodeContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage.isoCode2char));
  }, [dispatch, parsedAppLanguage]);

  const { currentEmail } = useLazySelector(({ auth }) => {
    const { currentEmail } = auth;
    return {
      currentEmail,
    };
  });

  const handleSubmit = useCallback(
    (values) => {
      dispatch(emailConfirm(values));
    },
    [dispatch]
  );
  useEffect(() => {
    dispatch(getMe());
  }, []);

  const onResendCode = useCallback(() => {
    dispatch(codeResend({ email: currentEmail }));
  }, [dispatch]);

  return (
    <EnterCodeForm
      onSubmit={handleSubmit}
      currentEmail={currentEmail}
      onResendCode={onResendCode}
    />
  );
};

export default EnterCodeContainer;
