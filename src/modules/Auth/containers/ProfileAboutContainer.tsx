import { ProfileAboutForm } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  getLocalization,
  getOptionsAbout,
  setOptionsAbout,
} from "../slices/auth";
import { useLazySelector } from "../../../hooks";

const ProfileAboutContainer: React.FC = () => {
  const dispatch = useDispatch();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  const { aboutOptions } = useLazySelector(({ auth }) => {
    const { aboutOptions } = auth;
    return {
      aboutOptions,
    };
  });

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage.isoCode2char));
  }, [dispatch, parsedAppLanguage]);

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
