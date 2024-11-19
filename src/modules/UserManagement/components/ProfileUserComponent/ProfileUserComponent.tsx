import { FC, useContext, useState } from "react";
import styles from "./ProfileUserComponent.module.scss";
import { UserContext } from "../../../../core/contexts";
import ProfileUserForm from "../ProfileUserForm";
import { LanguageType } from "../ProfileUserForm/ProfileUserForm";
import Edit from "../../../../assets/images/icons/editProfileIcon.svg";
import Calendar from "../../../../assets/images/icons/calendarIcon.svg";
import SmallBook from "../../../../assets/images/icons/smallBookIcon.svg";
import LogOut from "../../../../assets/images/icons/logOutIcon.svg";
import { logoutUser } from "../../../../core/session/slices/session";
import { useDispatch } from "react-redux";
import EditProfileModal from "../EditProfileModal";

interface ProfileUserComponentProps {
  languages: LanguageType[];
  onSubmit: (values: any) => void;
}

const ProfileUserComponent: FC<ProfileUserComponentProps> = ({
  languages,
  onSubmit,
}) => {
  const value = useContext(UserContext);
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  console.log("value323232423", value);
  const onLogout = () => {
    dispatch(logoutUser());
  };

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
              <div
                className={styles.editButton}
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
              >
                <img src={Edit} alt="edit" />
              </div>
            </div>
          </div>
          <div className={styles.userBirth}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: 4 }} src={Calendar} alt="calendar" />
              {value?.dateBirth}
            </div>
            <div
              style={{ marginLeft: 14, display: "flex", alignItems: "center" }}
            >
              <img style={{ marginRight: 4 }} src={SmallBook} alt="book" />
              {value?.completedBooks} completed books
            </div>
          </div>
          <ProfileUserForm languages={languages} onSubmit={onSubmit} />
        </div>
        <div onClick={onLogout} className={styles.logOutBtn}>
          <img src={LogOut} alt="icon" />
          Log Out
        </div>
      </div>
      <EditProfileModal
        onSubmit={onSubmit}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        dateBirth={value?.dateBirth}
        userName={value?.userName}
        gender={value?.gender}
        userPhoto={value?.photo?.link}
      />
    </div>
  );
};

export default ProfileUserComponent;
