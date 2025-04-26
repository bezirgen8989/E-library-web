import { FC, useContext, useState } from "react";
import styles from "./ProfileUserComponent.module.scss";
import { UserContext } from "../../../../core/contexts";
import ProfileUserForm from "../ProfileUserForm";
import Edit from "../../../../assets/images/icons/editProfileIcon.svg";
import Calendar from "../../../../assets/images/icons/calendarIcon.svg";
import SmallBook from "../../../../assets/images/icons/smallBookIcon.svg";
import LogOut from "../../../../assets/images/icons/logOutIcon.svg";
import { logoutUser } from "../../../../core/session/slices/session";
import { useDispatch } from "react-redux";
import EditProfileModal from "../EditProfileModal";
import noAvatar from "../../../../assets/images/icons/noUserAvatar.png";
import { useTranslation } from "react-i18next";
import { Language } from "../../../Auth/slices/auth/types";
import { useAuthState } from "modules/Auth/slices/auth";
import { Button, Tag, Typography } from "antd";
import cn from "classnames";
import { ProfileUserComponentSkeleton } from "./Skeleton";

interface ProfileUserComponentProps {
  languages: Language[];
  onSubmit: (values: any) => void;
  handleUpload: (params: any) => void;
  photoId: string | null;
  deleteAccount: () => void;
  handleKidsMode: (value: any) => void;
  setUserAvatar: any;
  handleAppLanguage: any;
  handleBookLanguage: any;
}

const ProfileUserComponent: FC<ProfileUserComponentProps> = ({
  onSubmit,
  handleUpload,
  photoId,
  deleteAccount,
}) => {
  const { t } = useTranslation();
  const { userData } = useAuthState();
  const value = useContext(UserContext);
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const onLogout = () => {
    dispatch(logoutUser());
  };
  const userNameTitle = userData?.result?.userName || userData?.result?.email;

  if (userData?.isLoading) {
    return <ProfileUserComponentSkeleton />;
  }

  return (
    <div className={styles.profile_page_wrap}>
      <EditProfileModal
        onSubmit={onSubmit}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        dateBirth={value?.dateBirth}
        userName={value?.userName}
        gender={value?.gender}
        userPhoto={value?.photo?.link}
        bookLanguage={value?.bookLanguage}
        handleUpload={handleUpload}
        photoId={photoId}
        deleteAccount={deleteAccount}
      />
      <div className={styles.profile_page}>
        <div className={styles.profile_page_content}>
          <div className={styles.profile_header}>
            <div className={styles.profile_logo}>
              <img
                src={value?.photo?.link ? value?.photo?.link : noAvatar}
                alt=""
              />
            </div>
            <div className={styles.profile_info}>
              <div className={styles.profile_mainInfo}>
                <Typography className={styles.profile_userName}>
                  {userNameTitle}
                </Typography>
                <Button
                  type="text"
                  icon={<img src={Edit} alt="edit" />}
                  className={styles.editButton}
                  shape={"circle"}
                  onClick={() => setIsEditModalOpen(true)}
                />
              </div>
              <div className={styles.profile_additionalInfo}>
                {value?.dateBirth && (
                  <Tag
                    className={cn(styles.tags, styles.readBookTag)}
                    color={"transparent"}
                    icon={<img src={Calendar} alt="calendar" />}
                  >
                    {value?.dateBirth}
                  </Tag>
                )}

                <Tag
                  className={cn(styles.tags, styles.readBookTag)}
                  color={"transparent"}
                  icon={
                    <img
                      style={{ marginRight: 4 }}
                      src={SmallBook}
                      alt="book"
                    />
                  }
                >
                  {value?.completedBooks} {t("completedBooks")}
                </Tag>
              </div>
            </div>
            <ProfileUserForm />
            <div onClick={onLogout} className={styles.logOutBtn}>
              <img src={LogOut} alt="icon" />
              {t("logOut")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserComponent;
