import { FC, useContext } from "react";
import styles from "./ProfileUserComponent.module.scss";
import { UserContext } from "../../../../core/contexts";
import ProfileUserForm from "../ProfileUserForm";
import { LanguageType } from "../ProfileUserForm/ProfileUserForm";

interface ProfileUserComponentProps {
  languages: LanguageType[];
  onSubmit: (values: any) => void;
}

const ProfileUserComponent: FC<ProfileUserComponentProps> = ({
  languages,
  onSubmit,
}) => {
  const value = useContext(UserContext);
  return (
    <div className={styles.profile_page_wrap}>
      <div className={styles.profile_page}>
        <div className={styles.profile_logo}>
          <img src={value?.photo?.link} alt="avatar" />
        </div>
        <div className={styles.profile_page_content}>
          <ProfileUserForm languages={languages} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ProfileUserComponent;
