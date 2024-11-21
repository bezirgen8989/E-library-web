// import homeRoutes from 'modules/SearchBooks/routing/routes'
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { LoginUser } from "../slices/auth";
import LoginForm from "../components/LoginForm";

const LoginContainer: React.FC = () => {
  const dispatch = useDispatch();

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
