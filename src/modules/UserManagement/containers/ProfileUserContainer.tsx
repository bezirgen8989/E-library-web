import ProfileUserComponent from "../components/ProfileUserComponent";
import { useLazySelector } from "../../../hooks";
import { useCallback, useEffect } from "react";
import { getLanguages } from "../../Auth/slices/auth";
import { useDispatch } from "react-redux";

const ProfileUserContainer: React.FC = () => {
  const dispatch = useDispatch();

  const { languages } = useLazySelector(({ auth }) => {
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
    },
    [dispatch]
  );

  return (
    <ProfileUserComponent
      languages={languages?.result?.data}
      onSubmit={handleSubmit}
    />
  );
};
export default ProfileUserContainer;
