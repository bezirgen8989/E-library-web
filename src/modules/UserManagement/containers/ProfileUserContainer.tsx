import ProfileUserComponent from "../components/ProfileUserComponent";
import { useLazySelector } from "../../../hooks";
import { useCallback, useEffect } from "react";
import {
  deleteUserAccount,
  getLanguages,
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
  console.log("languages", languages?.result?.data);

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  const handleSubmit = useCallback(
    (values) => {
      console.log("profile submit values", values);
      dispatch(setProfile(values));
    },
    [dispatch]
  );

  const handleUpload = (values: any) => {
    dispatch(uploadUserPhotoId(values));
  };

  const deleteAccount = () => {
    console.log();
    dispatch(deleteUserAccount());
  };

  return (
    <ProfileUserComponent
      languages={languages?.result?.data}
      onSubmit={handleSubmit}
      handleUpload={handleUpload}
      photoId={photoId?.result?.[0]?.id || null}
      deleteAccount={deleteAccount}
    />
  );
};
export default ProfileUserContainer;
