import styles from "./Home.module.scss";
import React from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import { routes } from "../../routing";

type HomeProps = {
  started: any;
  notStarted: any;
  finished: any;
  getBook: (id: number) => void;
};

const BooksShelfComponent: React.FC<HomeProps> = ({
  started,
  notStarted,
  finished,
  getBook,
}) => {
  return (
    <div className={styles.home_page}>
      <AllBooksSlider
        books={started}
        title={
          <span style={{ fontSize: "44px", fontWeight: "600" }}>Started</span>
        }
        seeAllLink={routes.newBooks}
        getBook={getBook}
      />
      <AllBooksSlider
        books={notStarted}
        title={
          <span style={{ fontSize: "44px", fontWeight: "600" }}>
            Not Started
          </span>
        }
        seeAllLink={routes.suggestedBooks}
        getBook={getBook}
      />
      <AllBooksSlider
        books={finished}
        title={
          <span style={{ fontSize: "44px", fontWeight: "600" }}>Finished</span>
        }
        seeAllLink={routes.suggestedBooks}
        getBook={getBook}
      />
    </div>
  );
};

export default BooksShelfComponent;
