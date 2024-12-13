import ProfileUserComponent from "../components/ProfileUserComponent";
import { useLazySelector } from "../../../hooks";
import { useCallback, useEffect } from "react";
import {
  deleteUserAccount,
  getLanguages,
  setKidsMode,
  setProfile,
  uploadUserPhotoId,
} from "../../Auth/slices/auth";
import { useDispatch } from "react-redux";

const ProfileUserContainer: React.FC = () => {
  const dispatch = useDispatch();

  const { languages, photoId } = useLazySelector(({ auth }) => {
    const { languages, photoId } = auth;
    return {
      languages,
      photoId,
    };
  });

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  const handleSubmit = useCallback(
    (values) => {
      dispatch(setProfile(values));
    },
    [dispatch]
  );

  const handleUpload = (values: any) => {
    dispatch(uploadUserPhotoId(values));
  };
  const handleKidsMode = (value: any) => {
    dispatch(setKidsMode({ kidsMode: value }));
  };

  const deleteAccount = () => {
    dispatch(deleteUserAccount());
  };

  return (
    <ProfileUserComponent
      languages={languages?.result?.data}
      onSubmit={handleSubmit}
      handleUpload={handleUpload}
      photoId={photoId?.result?.[0]?.id || null}
      deleteAccount={deleteAccount}
      handleKidsMode={handleKidsMode}
    />
  );
};
export default ProfileUserContainer;
