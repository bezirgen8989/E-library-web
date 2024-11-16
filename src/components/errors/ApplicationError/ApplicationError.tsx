import styles from "../../../modules/Auth/components/ProfileForm/ProfileForm.module.scss";
import BackIcon from "../../../assets/images/icons/goBackIcon.svg";
import React from "react";

const ApplicationError: React.FC = () => {
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", position: "relative" }}>
      <div className={styles.navTop}>
        <div className={styles.backBtn}>
          Skip
          <img style={{ marginLeft: 9, transform: 'rotate(180deg)' }} src={BackIcon} alt="Back arrow" />
        </div>
      </div>
      <div className={styles.centeredWrapper}>
        <div className={styles.centered}>
          <div className={styles.logo_name}>Profile Details</div>
         Application Error
        </div>
      </div>

    </div>
  )
}

export default ApplicationError
