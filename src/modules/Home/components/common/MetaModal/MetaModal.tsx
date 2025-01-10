import { FC } from "react";
import { Collapse, Modal } from "antd";
import styles from "./MetaModal.module.scss";
import commonStyles from "../../../../../assets/css/commonStyles/CommonStyles.module.scss";
import Close from "../../../../../assets/images/icons/Close.svg";
// import { useTranslation } from "react-i18next";

interface NotificationsModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  metaData: any;
}

const MetaModal: FC<NotificationsModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  metaData,
}) => {
  // const { t } = useTranslation();

  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={<div className="custom-modal-title">Resources</div>}
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
      <div className={styles.resourcesWrap}>
        <Collapse>{metaData}</Collapse>
      </div>
    </Modal>
  );
};

export default MetaModal;
