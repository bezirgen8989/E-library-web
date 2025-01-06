import styles from "./SearchBooks.module.scss";
import { FC } from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import books from "../../../../assets/images/icons/booksIcon.png";
import { routes } from "../../routing";
import BackIcon from "../../../../assets/images/icons/goBackIcon.svg";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

type CategoryData = {
  id: number;
  name: string;
};

type HomeProps = {
  onLogout: () => void;
  topBooks: any;
  newBooks: any;
  suggestedBooks: any;
  getBook: (id: number) => void;
  searchId: string;
  categories: CategoryData[];
  isTopBooksLoading: boolean;
  isNewBooksLoading: boolean;
  isSuggestedBooksLoading: boolean;
};

const SearchBooks: FC<HomeProps> = ({
  topBooks,
  newBooks,
  suggestedBooks,
  getBook,
  searchId,
  categories = [],
  isTopBooksLoading,
  isNewBooksLoading,
  isSuggestedBooksLoading,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const selectedCategory = categories.find(
    (category) => category.id.toString() === searchId
  );

  return (
    <div className={styles.home_page}>
      <div onClick={() => history.goBack()} className={styles.backBtnSearch}>
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        {t("backBtn")}
      </div>
      <div className={styles.title}>
        {/* Use the category name as a key for translation */}
        {selectedCategory
          ? t(`category${selectedCategory.name}`) // Translate using category name
          : t("categoryNotFound")}
      </div>
      <div className={styles.search_page}>
        <div className={styles.searchContainer}>
          {topBooks && (
            <AllBooksSlider
              books={topBooks}
              title={t("titleTopBooks")}
              seeAllLink={`${routes.searchTopBooks}/${searchId}`}
              getBook={getBook}
              isLoading={isTopBooksLoading}
            />
          )}
          <div style={{ height: "1px", background: "rgba(18, 18, 18, 0.1)" }} />
          {newBooks && (
            <AllBooksSlider
              books={newBooks}
              title={t("titleNewBooks")}
              titleImage={<img src={books} alt="books" />}
              seeAllLink={`${routes.searchNewBooks}/${searchId}`}
              getBook={getBook}
              isLoading={isNewBooksLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBooks;
