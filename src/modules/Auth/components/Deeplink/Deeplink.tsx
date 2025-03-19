import { FC, useEffect } from "react";

import useAuthSocial from "hooks/useAuthSocial";

const Deeplink: FC = () => {
  console.log("Deeplink");
  const { finishSocialLogin } = useAuthSocial();

  useEffect(() => {
    finishSocialLogin();
  }, [finishSocialLogin]);

  return <div>Loading...</div>;
};

export default Deeplink;
