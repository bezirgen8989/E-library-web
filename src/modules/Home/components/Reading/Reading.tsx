import React from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";
import Button from "../../../../components/common/Buttons/Button";

interface ReadingProps {
  currentReadBook: any;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const Reading: React.FC<ReadingProps> = ({
  currentReadBook,
  isLoading,
  onNext,
  onPrev,
}) => {
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
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <Button
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            variant="White"
            onClick={onPrev}
          >
            <img
              style={{ transform: "rotate(90deg)" }}
              src={BackIcon}
              alt="Back arrow"
            />
          </Button>
        </div>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: currentReadBook?.result?.html }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <Button
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            variant="White"
            onClick={onNext}
          >
            <img
              style={{ transform: "rotate(270deg)" }}
              src={BackIcon}
              alt="Back arrow"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reading;
