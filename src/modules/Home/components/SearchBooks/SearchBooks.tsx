import styles from "./SearchBooks.module.scss";
import { FC } from "react";
import AllBooksSlider from "../common/AllBooksSlider/AllBooksSlider";
import books from "../../../../assets/images/icons/booksIcon.png";
import { routes } from "../../routing";

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
};

const SearchBooks: FC<HomeProps> = ({
  topBooks,
  newBooks,
  suggestedBooks,
  getBook,
  searchId,
  categories = [], // значение по умолчанию
}) => {
  const selectedCategory = categories.find(
    (category) => category.id.toString() === searchId
  );

  return (
    <div className={styles.home_page}>
      <div className={styles.title}>
        {selectedCategory ? selectedCategory.name : "Category not found"}
      </div>
      <div className={styles.search_page}>
        <div className={styles.searchContainer}>
          <AllBooksSlider
            books={topBooks}
            title="Top books"
            seeAllLink={routes.newBooks}
            getBook={getBook}
          />
          <div style={{ height: "1px", background: "rgba(18, 18, 18, 0.1)" }} />
          <AllBooksSlider
            books={newBooks}
            title="New Books"
            titleImage={<img src={books} alt="books" />}
            seeAllLink={routes.newBooks}
            getBook={getBook}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBooks;
