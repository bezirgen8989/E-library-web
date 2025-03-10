import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import { getLocalization, googleLoginUser } from "../slices/auth";
import OnboardingForm from "../components/OnboardingForm";

const OnboardingContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage.isoCode2char));
  }, [dispatch, parsedAppLanguage]);

  const handleSubmit = useCallback(
    (values) => {
      dispatch(googleLoginUser(values));
    },
    [dispatch]
  );

  return <OnboardingForm onSubmit={handleSubmit} />;
};

export default OnboardingContainer;
