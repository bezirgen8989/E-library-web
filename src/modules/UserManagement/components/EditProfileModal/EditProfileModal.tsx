import { FC, useEffect } from "react";
import { Modal, Upload } from "antd";
import { Controller, useForm } from "react-hook-form";
import Button from "../../../../components/common/Buttons/Button";
import styles from "./EditProfile.module.scss";
import NoAvatar from "../../../../assets/images/icons/uploadBg.png";
import Close from "../../../../assets/images/icons/Close.svg";
import Delete from "../../../../assets/images/icons/delete_icon.svg";
import EditUpload from "../../../../assets/images/icons/editUploadIcon.svg";
import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";

interface EditProfileModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmit: (data: FormValues) => void;
  dateBirth?: string;
  userName?: string;
  gender?: string;
  userPhoto?: string;
  handleUpload: (params: any) => void;
  photoId: string | null;
}

interface FormValues {
  userName: string;
  gender: string;
  photo: any;
  dateBirth?: string;
}

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const EditProfileModal: FC<EditProfileModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  dateBirth,
  userName,
  gender,
  userPhoto,
  handleUpload,
  photoId,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      userName: "",
      gender: "",
      photo: null,
      dateBirth: "",
    },
  });

  const profilePicture = watch("photo");

  useEffect(() => {
    if (userName || gender || dateBirth || userPhoto) {
      reset({
        userName: userName || "",
        gender: gender || "",
        photo: null,
        dateBirth: dateBirth || "",
      });
    }
  }, [userName, gender, dateBirth, userPhoto, reset]);

  const hideModal = () => {
    setIsModalOpen(false);
    reset({
      userName: userName || "",
      gender: gender || "",
      photo: null,
      dateBirth: dateBirth || "",
    });
  };

  const onSubmitForm = (data: FormValues) => {
    const formattedData = {
      photo: {
        id: photoId,
      },
      userName: data.userName,
      gender: data.gender,
    };
    onSubmit(formattedData);
  };

  const uploadPhoto = (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("prefix", "prefix");
    formData.append("postfix", "postfix");
    formData.append("tag", "AVATAR");

    handleUpload(formData);
    setValue("photo", file); // Обновляем поле в форме
  };

  return (
    <Modal
      title={<div className="custom-modal-title">Edit Profile</div>}
      visible={isModalOpen}
      onCancel={hideModal}
      className="custom-modal"
      footer={null}
      closeIcon={
        <img className={styles.modalCloseIcon} src={Close} alt="close-icon" />
      }
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="uploadWrap">
          <div style={{ position: "relative" }}>
            <div className={styles.uploadIcon}>
              <img src={EditUpload} alt="" />
            </div>
            <Controller
              name="photo"
              control={control}
              render={({ field }) => (
                <Upload
                  beforeUpload={(file) => {
                    uploadPhoto(file);
                    return false; // Prevent automatic upload
                  }}
                  showUploadList={false}
                  fileList={
                    profilePicture
                      ? [
                          {
                            uid: "1", // You can generate a unique ID for each file
                            name: profilePicture.name,
                            status: "done", // Set the upload status
                            url: URL.createObjectURL(profilePicture), // Provide a preview URL
                          },
                        ]
                      : []
                  }
                  accept="image/*"
                  listType="picture-card"
                >
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="avatar"
                      className={commonStyles.uploadedImage}
                    />
                  ) : userPhoto ? (
                    <img
                      src={userPhoto}
                      alt="avatar"
                      className={commonStyles.uploadedImage}
                    />
                  ) : (
                    <img src={NoAvatar} alt="avatar" />
                  )}
                </Upload>
              )}
            />
          </div>
        </div>
        <div style={{ marginTop: 15 }}>
          <div className={styles.inputWrapper}>
            <Controller
              name="userName"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    autoComplete="off"
                    className={`${styles.inputField} ${
                      errors.userName ? styles.errorInput : ""
                    }`}
                    type="text"
                  />
                  <label
                    className={`${styles.inputLabel} ${
                      errors.userName ? styles.errorLabel : ""
                    }`}
                  >
                    Name
                  </label>
                  {errors.userName && (
                    <p className={styles.errorController}>
                      {errors.userName.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className={`${styles.inputWrapperLang} ${styles.genderWrap}`}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className={styles.dropdown}>
                  <select
                    {...field}
                    className={`${styles.inputField} ${
                      styles.inputFieldSelect
                    } ${errors.gender ? styles.errorInput : ""}`}
                  >
                    {genders.map((genderOption) => (
                      <option
                        key={genderOption.value}
                        value={genderOption.value}
                      >
                        {genderOption.label}
                      </option>
                    ))}
                  </select>
                  <label className={styles.inputLabel}>Gender</label>
                  {errors.gender && (
                    <p className={styles.errorController}>
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className={`${styles.inputWrapperLang} ${styles.dateWrap}`}>
            <Controller
              name="dateBirth"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    value={dateBirth}
                    readOnly
                    autoComplete="off"
                    className={`${styles.inputField}`}
                    type="text"
                  />
                  <label className={styles.inputLabel}>Date of Birth</label>
                </>
              )}
            />
          </div>
        </div>
        <Button variant="Brown" type="submit">
          Save
        </Button>
        <Button
          style={{ width: 249, margin: "30px auto 0 auto" }}
          variant="Error"
          type="button"
          icon={<img src={Delete} alt="delete-icon" />}
          onClick={() => console.log("Account deletion logic here")}
        >
          Delete Account
        </Button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
