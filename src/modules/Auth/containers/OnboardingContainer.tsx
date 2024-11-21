// import homeRoutes from 'modules/SearchBooks/routing/routes'
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { googleLoginUser } from "../slices/auth";
import OnboardingForm from "../components/OnboardingForm";

const LoginContainer: React.FC = () => {
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (values) => {
      dispatch(googleLoginUser(values));
    },
    [dispatch]
  );

  return <OnboardingForm onSubmit={handleSubmit} />;
};

export default LoginContainer;
