import styles from "./Home.module.scss";
import React from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import { routes } from "../../routing";
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
  console.log("started", notStarted);
  return (
    <div className={styles.home_page}>
      {started && (
        <AllBooksSlider
          books={started}
          title={
            <span style={{ fontSize: "44px", fontWeight: "600" }}>
              {t("started")}
            </span>
          }
          seeAllLink={routes.startedBooks}
          getBook={getBook}
          continueReadingBook={continueReadingBook}
          isLoading={isStartedBooksLoading}
        />
      )}
      {notStarted && notStarted.length > 0 && (
        <AllBooksSlider
          books={notStarted}
          title={
            <span style={{ fontSize: "44px", fontWeight: "600" }}>
              {t("notStarted")}
            </span>
          }
          seeAllLink={routes.notStartedBooks}
          getBook={getBook}
          isLoading={isNotStartedBooksLoading}
          continueReadingBook={continueReadingBook}
        />
      )}
      {finished && finished.length > 0 && (
        <AllBooksSlider
          books={finished}
          title={
            <span style={{ fontSize: "44px", fontWeight: "600" }}>
              {t("finished")}
            </span>
          }
          seeAllLink={routes.finishedBooks}
          getBook={getBook}
          isLoading={isFinishedBooksLoading}
        />
      )}
    </div>
  );
};

export default BooksShelfComponent;
