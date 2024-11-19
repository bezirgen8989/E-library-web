import { FC, useRef, useState, useEffect } from "react";
import { Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import Button from "../../../../components/common/Buttons/Button";
import styles from "./EditProfile.module.scss";
import NoAvatar from "../../../../assets/images/icons/uploadBg.png";
import Close from "../../../../assets/images/icons/Close.svg";
import EditUpload from "../../../../assets/images/icons/editUploadIcon.svg";

interface EditProfileModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmit: (data: FormValues) => void;
  dateBirth?: string;
  userName?: string;
  gender?: string;
  userPhoto?: string;
}

interface FormValues {
  userName: string;
  gender: string;
  photo: File | null;
  dateBirth: string;
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
}) => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      userName: "",
      gender: "",
      photo: null,
      dateBirth: "",
    },
  });

  useEffect(() => {
    if (userName || gender || dateBirth) {
      reset({
        userName: userName || "",
        gender: gender || "",
        photo: null,
        dateBirth: dateBirth || "",
      });
    }
  }, [userName, gender, dateBirth, reset]);

  const hideModal = () => {
    setIsModalOpen(false);
    reset({
      userName: userName || "",
      gender: gender || "",
      photo: null,
      dateBirth: dateBirth || "",
    });
    setProfilePicture(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setValue("photo", file);
    }
  };

  const onSubmitForm = (data: FormValues) => {
    const formattedData = {
      userName: data.userName,
      gender: data.gender,
      photo: profilePicture,
      dateBirth: data.dateBirth,
    };
    onSubmit(formattedData);
    hideModal();
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
          <div
            style={{ position: "relative", width: "125px", height: "125px" }}
          >
            <div
              className={styles.uploadIcon}
              onClick={() => uploadInputRef.current?.click()}
            >
              <img src={EditUpload} alt="icon" />
            </div>
            <input
              type="file"
              ref={uploadInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="avatar"
                className={styles.uploadedImage}
              />
            ) : userPhoto ? (
              <img
                src={userPhoto}
                alt="user-avatar"
                className={styles.uploadedImage}
              />
            ) : (
              <img src={NoAvatar} alt="no-avatar" />
            )}
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
              rules={{ required: "Gender is required" }}
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
      </form>
    </Modal>
  );
};

export default EditProfileModal;
