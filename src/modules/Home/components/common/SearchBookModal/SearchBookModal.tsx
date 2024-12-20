import { FC, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Switch } from "antd";
import { useDispatch } from "react-redux";
import {
  getNotificationsSettings,
  setNotificationsSettings,
} from "../../../../Home/slices/home";

import Button from "../../../../../components/common/Buttons/Button";
import commonStyles from "../../../../../assets/css/commonStyles/CommonStyles.module.scss";
import styles from "./SearchBookModal.module.scss";
import Close from "../../../../../assets/images/icons/Close.svg";

import SpinnerBrown from "../../../../../components/common/SpinnerBrown";

interface NotificationsModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

interface NotificationFormData {
  startReading: boolean;
  continueReading: boolean;
  newBooks: boolean;
}

const SearchBookModal: FC<NotificationsModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { handleSubmit, control } = useForm<NotificationFormData>({
    defaultValues: {
      startReading: false,
      continueReading: false,
      newBooks: false,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      dispatch(getNotificationsSettings());
    }
  }, [isModalOpen, dispatch]);

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data: NotificationFormData) => {
    console.log("data", data);
    dispatch(setNotificationsSettings(data));
    hideModal();
  };

  return (
    <Modal
      title={<div className="custom-modal-title">Notifications</div>}
      visible={isModalOpen}
      onCancel={hideModal}
      className="custom-modal-settings"
      footer={null}
      closeIcon={
        <img
          className={commonStyles.modalCloseIcon}
          src={Close}
          alt="close-icon"
        />
      }
    >
      {loading ? (
        <div className={styles.spinnerWrapper}>
          <SpinnerBrown />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.kidsSelectWrapper}>
            <span>Your Reading Progress</span>
            <Controller
              name="startReading"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className={styles.kidsSelectWrapper}>
            <span>New Book on Your BookShelf</span>
            <Controller
              name="continueReading"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className={styles.kidsSelectWrapper}>
            <span>New Books in Your Favorite Category</span>
            <Controller
              name="newBooks"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div style={{ textAlign: "right", marginTop: "30px" }}>
            <Button variant="Brown" type="submit">
              Save
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default SearchBookModal;
