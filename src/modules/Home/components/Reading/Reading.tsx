import React from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";

interface ReadingProps {
  currentReadBook: any;
}

const Reading: React.FC<ReadingProps> = ({ currentReadBook }) => {
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
      <div className={styles.home_page}>
        {/* Отображаем HTML контент с использованием dangerouslySetInnerHTML */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: currentReadBook?.result?.html }}
        />
      </div>
    </div>
  );
};

export default Reading;
