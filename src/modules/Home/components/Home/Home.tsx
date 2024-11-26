import styles from "./Home.module.scss";
import { UserContext } from "core/contexts";
import React, { useContext } from "react";
import TopBooksSlider from "../common/TopBooksSlider/TopBooksSlider";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import books from "../../../../assets/images/icons/booksIcon.png";
import { routes } from "../../routing";

type HomeProps = {
  onLogout: Callback;
  topBooks: any;
  newBooks: any;
  suggestedBooks: any;
  getBook: (id: number) => void;
  isTopBooksLoading: boolean;
  isNewBooksLoading: boolean;
  isSuggestedBooksLoading: boolean;
};

const Home: React.FC<HomeProps> = ({
  topBooks,
  newBooks,
  suggestedBooks,
  getBook,
  isTopBooksLoading,
  isNewBooksLoading,
  isSuggestedBooksLoading,
}) => {
  const value = useContext(UserContext);
  console.log(value);

  return (
    <div className={styles.home_page}>
      <TopBooksSlider
        getBook={getBook}
        books={topBooks}
        isLoading={isTopBooksLoading}
      />
      <AllBooksSlider
        books={newBooks}
        title="New Books"
        titleImage={<img src={books} alt="books" />}
        seeAllLink={routes.newBooks}
        getBook={getBook}
        isLoading={isNewBooksLoading}
      />
      <div style={{ height: "1px", background: "rgba(18, 18, 18, 0.1)" }} />
      <AllBooksSlider
        books={suggestedBooks}
        title="Suggested for You"
        seeAllLink={routes.suggestedBooks}
        getBook={getBook}
        isLoading={isSuggestedBooksLoading}
      />
    </div>
  );
};

export default Home;
