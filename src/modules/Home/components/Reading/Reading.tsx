import React from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";

interface ReadingProps {
  currentReadBook: any;
  isLoading: boolean;
}

const Reading: React.FC<ReadingProps> = ({ currentReadBook, isLoading }) => {
  const history = useHistory();

  if (isLoading) {
    return <SpinnerBrown />;
  }

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
