import styles from "./BooksShelfComponent.module.scss";
import React from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import { routes } from "../../routing";
import EmptyImg from "../../../../assets/images/emptyImg.jpg";
import Button from "../../../../components/common/Buttons/Button";
import { useLazySelector } from "../../../../hooks";

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
  const { result: localization } = useLazySelector(
    ({ auth }) => auth.appLocalization || {}
  );

  const isEmptyShelf =
    (!started || started.length === 0) &&
    (!notStarted || notStarted.length === 0) &&
    (!finished || finished.length === 0);

  return (
    <div className={styles.home_page}>
      {!isEmptyShelf && (
        <>
          {started && started.length > 0 && (
            <AllBooksSlider
              books={started}
              title={
                <span style={{ fontSize: "44px", fontWeight: "600" }}>
                  {localization?.started}
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
                  {localization?.notStarted}
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
                  {localization?.finished}
                </span>
              }
              seeAllLink={routes.finishedBooks}
              getBook={getBook}
              isLoading={isFinishedBooksLoading}
            />
          )}
        </>
      )}

      {isEmptyShelf && (
        <div className={styles.emptyBookShelf}>
          <div className={styles.emptyInner}>
            <div className={styles.innerImg}>
              <img src={EmptyImg} alt="empty" />
            </div>
            <div className={styles.title}>localization?.YourBookshelfEmpty</div>
            <div className={styles.subTitle}>
              localization?.ExploreLibraryNow
            </div>
            <Button variant="Brown" to={routes.root}>
              localization?.StartExploring
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksShelfComponent;
