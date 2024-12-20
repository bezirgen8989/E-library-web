import styles from "./ChooseAvatarStep4.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "../../../../../../components/common/Buttons/Button";
import { FC, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBookModal from "../../../common/SearchBookModal/SearchBookModal";

interface ChooseAvatarStep2Props {
  setCurrentStep: (value: number) => void;
  selectedAvatar: string;
}

const ChooseAvatarStep4: FC<ChooseAvatarStep2Props> = ({
  setCurrentStep,
  selectedAvatar,
}) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isGlobalQuestion = location.pathname.includes("ask_global_question");

  return (
    <div className={styles.askQuestionAvatar}>
      <div className={styles.avatarSliderWrap}>
        <div
          className={styles.sliderBackground}
          style={{ backgroundImage: `url(${selectedAvatar})` }}
        ></div>
        <div className={styles.messageSystemContent}>
          <strong style={{ color: "#fff" }}>Examples</strong>
          <br />
          What's the name of Hercule
          <br /> Poirot's friend and assistant
          <br /> in Agatha Christie's books?
        </div>

        {isGlobalQuestion ? (
          <>
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
              style={{ width: "341px", margin: "30px auto 20px" }}
              variant="Brown"
            >
              Select a Book
            </Button>
            <Button
              onClick={() => {
                setCurrentStep(5);
              }}
              style={{ width: "341px", margin: "30px auto 20px" }}
              variant="White"
            >
              Search in All Books
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              setCurrentStep(5);
            }}
            style={{ width: "341px", margin: "30px auto 20px" }}
            variant="Brown"
          >
            Continue
          </Button>
        )}
      </div>
      <SearchBookModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default ChooseAvatarStep4;
