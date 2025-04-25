import { ProfileForm } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  // getLanguages,
  getLocalization,
  setProfile,
  uploadUserPhotoId,
  useAuthState,
} from "../slices/auth";

const ProfileContainer: React.FC = () => {
  const dispatch = useDispatch();

  const { languages, photoId } = useAuthState();

  const appLanguage = sessionStorage.getItem("appLanguage");
  const parsedAppLanguage = appLanguage ? JSON.parse(appLanguage) : "en";

  useEffect(() => {
    dispatch(getLocalization(parsedAppLanguage.isoCode2char));
  }, [dispatch, parsedAppLanguage]);

  const handleSubmit = useCallback(
    (values) => {
      dispatch(setProfile(values));
    },
    [dispatch]
  );

  const handleUpload = (values: any) => {
    dispatch(uploadUserPhotoId(values));
  };

  // useEffect(() => {
  //   if(!languages.result?.data?.length){
  //     dispatch(getLanguages());
  //   }
  // }, [dispatch, languages.result?.data?.length]);

  return (
    <ProfileForm
      onSubmit={handleSubmit}
      languages={languages?.result?.data}
      handleUpload={handleUpload}
      photoId={photoId?.result?.[0]?.id || null}
    />
  );
};

export default ProfileContainer;
