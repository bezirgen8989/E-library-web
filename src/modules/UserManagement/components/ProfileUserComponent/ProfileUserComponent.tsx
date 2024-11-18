import { FC, useContext } from "react";
import styles from "./ProfileUserComponent.module.scss";
import { UserContext } from "../../../../core/contexts";
import ProfileUserForm from "../ProfileUserForm";
import { LanguageType } from "../ProfileUserForm/ProfileUserForm";
import Edit from "../../../../assets/images/icons/editProfileIcon.svg";
import Calendar from "../../../../assets/images/icons/calendarIcon.svg";
import SmallBook from "../../../../assets/images/icons/smallBookIcon.svg";

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
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              <span>{value?.userName}</span>
              <div className={styles.editButton}>
                <img src={Edit} alt="edit" />
              </div>
            </div>
          </div>
          <div className={styles.userBirth}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: 4 }} src={Calendar} alt="calendar" />
              15.06.1998
            </div>
            <div
              style={{ marginLeft: 14, display: "flex", alignItems: "center" }}
            >
              <img style={{ marginRight: 4 }} src={SmallBook} alt="book" />
              74 completed books
            </div>
          </div>
          <ProfileUserForm languages={languages} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ProfileUserComponent;
