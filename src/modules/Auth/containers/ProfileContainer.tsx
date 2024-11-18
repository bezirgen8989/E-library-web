import { ProfileForm } from "modules/Auth/components";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { getLanguages, setProfile, uploadUserPhotoId } from "../slices/auth";
import { useLazySelector } from "../../../hooks";

const ProfileContainer: React.FC = () => {
  const dispatch = useDispatch();

  const { languages, photoId } = useLazySelector(({ auth }) => {
    const { languages, photoId } = auth;
    return {
      languages,
      photoId,
    };
  });
  console.log("languages", languages?.result?.data);

  const handleSubmit = useCallback(
    (values) => {
      dispatch(setProfile(values));
    },
    [dispatch]
  );

  const handleUpload = (values: any) => {
    dispatch(uploadUserPhotoId(values));
  };

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

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
