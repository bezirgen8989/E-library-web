import React from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";

interface ReadingProps {}

const Reading: React.FC<ReadingProps> = ({}) => {
  const history = useHistory();

  return (
    <div>
      <div
        onClick={() => history.goBack()}
        className={styles.backBtnRelativePage}
      >
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        Back
      </div>
      <div className={styles.home_page}>11111111</div>
    </div>
  );
};

export default Reading;
