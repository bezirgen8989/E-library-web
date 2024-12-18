import styles from "./ChooseAvatarStep4.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Avatar from "../../../../../../assets/images/tempAvatar.png";
import Settings from "../../../../../../assets/images/icons/settingsIcon.svg";
import Button from "../../../../../../components/common/Buttons/Button";
import { FC } from "react";

interface ChooseAvatarStep2Props {
  setCurrentStep: (value: number) => void;
}
const ChooseAvatarStep4: FC<ChooseAvatarStep2Props> = ({ setCurrentStep }) => {
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
          <strong style={{ color: "#fff" }}>Examples</strong>
          <br />
          What's the name of Hercule
          <br /> Poirot's friend and assistant
          <br /> in Agatha Christie's books?
        </div>
        <Button
          onClick={() => {
            setCurrentStep(5);
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

export default ChooseAvatarStep4;
