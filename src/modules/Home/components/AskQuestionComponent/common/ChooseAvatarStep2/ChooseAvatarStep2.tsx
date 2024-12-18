import styles from "./ChooseAvatarStep2.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Avatar from "../../../../../../assets/images/tempAvatar.png";
import Button from "../../../../../../components/common/Buttons/Button";
import { FC } from "react";
import Settings from "../../../../../../assets/images/icons/settingsIcon.svg";

interface ChooseAvatarStep2Props {
  setCurrentStep: (value: number) => void;
}
const ChooseAvatarStep2: FC<ChooseAvatarStep2Props> = ({ setCurrentStep }) => {
  return (
    <div className={styles.askQuestionAvatar}>
      <div className={styles.avatarSettings}>
        Umar
        <div className={styles.settingsIcon}>
          <img src={Settings} alt="icon" />
        </div>
      </div>
      <div className={styles.avatarSliderWrap}>
        <div
          className={styles.sliderBackground}
          // style={{ backgroundImage: `url(${currentImage.avatar})` }}
          style={{ backgroundImage: `url(${Avatar})` }}
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
