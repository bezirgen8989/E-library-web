import styles from "./Home.module.scss";
import React from "react";
import TopBooksSlider from "../common/TopBooksSlider/TopBooksSlider";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import books from "../../../../assets/images/icons/booksIcon.png";
import { routes } from "../../routing";
import { useTranslation } from "react-i18next";
import { Divider } from "antd";

type HomeProps = {
  onLogout: Callback;
  topBooks: any;
  newBooks: any;
  suggestedBooks: any;
  getBook: any;
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
  const { t } = useTranslation();

  return (
    <div className={styles.home_page}>
      <TopBooksSlider
        getBook={getBook}
        books={topBooks}
        isLoading={isTopBooksLoading}
      />
      <AllBooksSlider
        books={newBooks}
        title={t("titleNewBooks")}
        titleImage={<img src={books} alt="books" />}
        seeAllLink={routes.newBooks}
        getBook={getBook}
        isLoading={isNewBooksLoading}
      />
      <Divider />
      <AllBooksSlider
        books={suggestedBooks}
        title={t("titleSuggestedForYou")}
        seeAllLink={routes.suggestedBooks}
        getBook={getBook}
        isLoading={isSuggestedBooksLoading}
      />
    </div>
  );
};

export default Home;
