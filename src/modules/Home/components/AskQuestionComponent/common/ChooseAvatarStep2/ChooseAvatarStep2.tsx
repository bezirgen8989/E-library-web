import styles from "./ChooseAvatarStep2.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "../../../../../../components/common/Buttons/Button";
import { FC } from "react";

interface ChooseAvatarStep2Props {
  setCurrentStep: (value: number) => void;
  selectedAvatar: string;
}
const ChooseAvatarStep2: FC<ChooseAvatarStep2Props> = ({
  setCurrentStep,
  selectedAvatar,
}) => {
  return (
    <div className={styles.askQuestionAvatar}>
      {/*<div className={styles.avatarSettings}>*/}
      {/*  Umar*/}
      {/*  <div className={styles.settingsIcon}>*/}
      {/*    <img src={Settings} alt="icon" />*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className={styles.avatarSliderWrap}>
        <div
          className={styles.sliderBackground}
          style={{ backgroundImage: `url(${selectedAvatar})` }}
        ></div>
        <div className={styles.messageSystemContent}>
          You can ask me any question
          <br /> you want – and I’ll give you
          <br /> an answer in 10 seconds.
        </div>
        <Button
          onClick={() => {
            setCurrentStep(3);
          }}
          style={{ width: "341px", margin: "30px auto 20px" }}
          variant="Brown"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChooseAvatarStep2;
