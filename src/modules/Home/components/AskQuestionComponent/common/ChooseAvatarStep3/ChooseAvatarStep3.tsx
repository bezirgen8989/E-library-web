import styles from "./ChooseAvatarStep3.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Avatar from "../../../../../../assets/images/tempAvatar.png";
import Settings from "../../../../../../assets/images/icons/settingsIcon.svg";
import Button from "../../../../../../components/common/Buttons/Button";
import { FC } from "react";

interface ChooseAvatarStep2Props {
  setCurrentStep: (value: number) => void;
}
const ChooseAvatarStep3: FC<ChooseAvatarStep2Props> = ({ setCurrentStep }) => {
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
          <ul>
            <li>I understand text messages and audio messages</li>
            <li>
              You can use any language you want – I will find an answer and
              translate it to your language.
            </li>
            <li>
              You should mention the book and author in your question -- it will
              help me to find an answer for you.
            </li>
          </ul>
        </div>
        <Button
          onClick={() => {
            setCurrentStep(4);
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

export default ChooseAvatarStep3;
