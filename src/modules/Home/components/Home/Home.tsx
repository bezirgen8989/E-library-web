import styles from "./Home.module.scss";
import { UserContext } from "core/contexts";
import React, { useContext } from "react";
import TopBooksSlider from "../common/TopBooksSlider/TopBooksSlider";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import books from "../../../../assets/images/icons/booksIcon.png";
import { routes } from "../../routing";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
  const { t } = useTranslation();
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
        title={t("titleNewBooks")}
        titleImage={<img src={books} alt="books" />}
        seeAllLink={routes.newBooks}
        getBook={getBook}
        isLoading={isNewBooksLoading}
      />
      <div style={{ height: "1px", background: "rgba(18, 18, 18, 0.1)" }} />
      <Link to={routes.termsAndConditions}>/terms_and_conditions</Link>
      <Link to={routes.privacyPolicy}>/privacy</Link>
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
