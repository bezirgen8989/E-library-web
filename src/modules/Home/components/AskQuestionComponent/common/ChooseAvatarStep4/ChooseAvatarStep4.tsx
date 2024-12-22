import styles from "./ChooseAvatarStep4.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "../../../../../../components/common/Buttons/Button";
import { FC, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBookModal from "../../../common/SearchBookModal/SearchBookModal";
import { useLazySelector } from "../../../../../../hooks";
import { getCategories } from "../../../../../Auth/slices/auth";
import { findBooks, getBooksByQueryName } from "../../../../slices/home";
import { useDispatch } from "react-redux";

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

  const dispatch = useDispatch();

  const { searchBooks, booksByQueryName, isLoading } = useLazySelector(
    ({ home }) => {
      const { searchBooks, booksByQueryName } = home;
      const { isLoading } = booksByQueryName;
      return { searchBooks, booksByQueryName, isLoading };
    }
  );

  console.log("isLoading", isLoading);
  console.log("booksByQueryName", booksByQueryName);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const getSearchBooks = useCallback((text) => {
    dispatch(findBooks(text));
  }, []);

  const getBooksByName = (name: string) => {
    dispatch(
      getBooksByQueryName({
        limit: "12",
        page: "1",
        order: "",
        filter: `[title|description][contains]=${name}`,
      })
    );
  };

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
        getSearchBooks={getSearchBooks}
        searchBooks={searchBooks?.result}
        getBooksByName={getBooksByName}
        booksByQueryName={booksByQueryName?.result?.data}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChooseAvatarStep4;
