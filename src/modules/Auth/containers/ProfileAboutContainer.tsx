import { ProfileAboutForm } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { getOptionsAbout, setOptionsAbout } from "../slices/auth";
import { useLazySelector } from "../../../hooks";

const ProfileAboutContainer: React.FC = () => {
  const dispatch = useDispatch();

  const { aboutOptions } = useLazySelector(({ auth }) => {
    const { aboutOptions } = auth;
    return {
      aboutOptions,
    };
  });

  console.log("aboutOptions", aboutOptions?.result);

  const handleSubmit = useCallback(
    (values) => {
      console.log("valuesAbout", values);
      dispatch(setOptionsAbout(values));
    },
    [dispatch]
  );
  useEffect(() => {
    dispatch(getOptionsAbout());
  }, []);

  return (
    <ProfileAboutForm
      onSubmit={handleSubmit}
      aboutOptions={aboutOptions?.result}
    />
  );
};

export default ProfileAboutContainer;
