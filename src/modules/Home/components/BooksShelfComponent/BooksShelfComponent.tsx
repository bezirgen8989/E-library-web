import styles from "./Home.module.scss";
import React from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import { routes } from "../../routing";

type HomeProps = {
  started: any;
  notStarted: any;
  finished: any;
  getBook: (id: number) => void;
  isStartedBooksLoading: boolean;
  isNotStartedBooksLoading: boolean;
  isFinishedBooksLoading: boolean;
};

const BooksShelfComponent: React.FC<HomeProps> = ({
  started,
  notStarted,
  finished,
  getBook,
  isStartedBooksLoading,
  isNotStartedBooksLoading,
  isFinishedBooksLoading,
}) => {
  return (
    <div className={styles.home_page}>
      {started && (
        <AllBooksSlider
          books={started}
          title={
            <span style={{ fontSize: "44px", fontWeight: "600" }}>Started</span>
          }
          seeAllLink={routes.newBooks}
          getBook={getBook}
          isLoading={isStartedBooksLoading}
        />
      )}
      <AllBooksSlider
        books={notStarted}
        title={
          <span style={{ fontSize: "44px", fontWeight: "600" }}>
            Not Started
          </span>
        }
        seeAllLink={routes.suggestedBooks}
        getBook={getBook}
        isLoading={isNotStartedBooksLoading}
      />
      {finished && (
        <AllBooksSlider
          books={finished}
          title={
            <span style={{ fontSize: "44px", fontWeight: "600" }}>
              Finished
            </span>
          }
          seeAllLink={routes.suggestedBooks}
          getBook={getBook}
          isLoading={isFinishedBooksLoading}
        />
      )}
    </div>
  );
};

export default BooksShelfComponent;
