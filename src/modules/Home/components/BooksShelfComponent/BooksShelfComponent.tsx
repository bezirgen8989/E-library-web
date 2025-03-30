import styles from "./BooksShelfComponent.module.scss";
import React, { useEffect, useState } from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import { routes } from "../../routing";
import EmptyImg from "../../../../assets/images/emptyImg.jpg";
import Button from "../../../../components/common/Buttons/Button";
import { useTranslation } from "react-i18next";

type HomeProps = {
  started: any;
  notStarted: any;
  finished: any;
  getBook: (id: number) => void;
  continueReadingBook: (id: number) => void;
  isStartedBooksLoading: boolean;
  isNotStartedBooksLoading: boolean;
  isFinishedBooksLoading: boolean;
};

const BooksShelfComponent: React.FC<HomeProps> = ({
  started,
  notStarted,
  finished,
  getBook,
  continueReadingBook,
  isStartedBooksLoading,
  isNotStartedBooksLoading,
  isFinishedBooksLoading,
}) => {
  const { t } = useTranslation();

  const [showEmptyShelf, setShowEmptyShelf] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowEmptyShelf(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const showStarted = isStartedBooksLoading || (started && started.length > 0);
  const showNotStarted =
    isNotStartedBooksLoading || (notStarted && notStarted.length > 0);
  const showFinished =
    isFinishedBooksLoading || (finished && finished.length > 0);

  const isEmptyShelf = !showStarted && !showNotStarted && !showFinished;

  return (
    <div className={styles.home_page}>
      {showStarted && (
        <AllBooksSlider
          books={started}
          title={<span className={styles.title}>{t("started")}</span>}
          seeAllLink={routes.startedBooks}
          getBook={getBook}
          continueReadingBook={continueReadingBook}
          isLoading={isStartedBooksLoading}
        />
      )}
      {showNotStarted && (
        <AllBooksSlider
          books={notStarted}
          title={<span className={styles.title}>{t("notStarted")}</span>}
          seeAllLink={routes.notStartedBooks}
          getBook={getBook}
          continueReadingBook={continueReadingBook}
          isLoading={isNotStartedBooksLoading}
        />
      )}
      {showFinished && (
        <AllBooksSlider
          books={finished}
          title={<span className={styles.title}>{t("finished")}</span>}
          seeAllLink={routes.finishedBooks}
          getBook={getBook}
          isLoading={isFinishedBooksLoading}
        />
      )}

      {isEmptyShelf && showEmptyShelf && (
        <div className={styles.emptyBookShelf}>
          <div className={styles.emptyInner}>
            <div className={styles.innerImg}>
              <img src={EmptyImg} alt="empty" />
            </div>
            <div className={styles.title}>{t("YourBookshelfEmpty")}</div>
            <div className={styles.subTitle}>{t("ExploreLibraryNow")}</div>
            <Button variant="Brown" to={routes.root}>
              {t("StartExploring")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksShelfComponent;
