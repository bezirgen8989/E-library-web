import { FC, useEffect } from "react";

import useAuthSocial from "hooks/useAuthSocial";
import { useLazySelector } from "../../../../hooks";

const Deeplink: FC = () => {
  const { finishSocialLogin } = useAuthSocial();

  const userSate = useLazySelector(({ auth }) => auth);

  console.log("userSate", userSate);

  useEffect(() => {
    finishSocialLogin();
  }, [finishSocialLogin]);

  return <div>Loading...</div>;
};

export default Deeplink;
