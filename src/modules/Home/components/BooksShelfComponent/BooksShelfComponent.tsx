import styles from "./Home.module.scss";
import React from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import { routes } from "../../routing";

type HomeProps = {
  topBooks: any;
  newBooks: any;
  suggestedBooks: any;
  getBook: (id: number) => void;
};

const BooksShelfComponent: React.FC<HomeProps> = ({
  newBooks,
  suggestedBooks,
  getBook,
}) => {
  return (
    <div className={styles.home_page}>
      <AllBooksSlider
        books={newBooks}
        title={
          <span style={{ fontSize: "44px", fontWeight: "600" }}>Started</span>
        }
        seeAllLink={routes.newBooks}
        getBook={getBook}
      />
      <AllBooksSlider
        books={suggestedBooks}
        title={
          <span style={{ fontSize: "44px", fontWeight: "600" }}>
            Not Started
          </span>
        }
        seeAllLink={routes.suggestedBooks}
        getBook={getBook}
      />
      <AllBooksSlider
        books={suggestedBooks}
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
