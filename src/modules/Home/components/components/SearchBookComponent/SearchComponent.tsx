import styles from "./SearchComponent.module.scss";
import { FC } from "react";
import NoImg from "../../../../../assets/images/NoImagePlaceholder.jpg";

type CategoryData = {
  id: number;
  name: string;
  color: string;
  picture: {
    link: string;
  };
};

interface SearchBooksComponentProps {
  categoriesData?: CategoryData[];
  getBooksByCategory: (id: any) => void;
}

const SearchComponent: FC<SearchBooksComponentProps> = ({
  categoriesData = [],
  getBooksByCategory,
}) => {
  return (
    <div className={styles.home_page}>
      <div className={styles.habit_wrap}>
        <div className={styles.page_title}>
          <span>All Genres</span>
        </div>
        <div className={styles.grid_container}>
          {categoriesData.map((category: CategoryData) => (
            <div
              onClick={() => {
                getBooksByCategory(category.id);
              }}
              key={category.id}
              className={styles.grid_item}
              style={{
                backgroundColor: category.color,
              }}
            >
              {category.name}
              <div className={styles.backgroundImg}>
                <img
                  src={category.picture.link}
                  alt="img"
                  className={styles.bookCoverImage}
                />
                {category.picture.link ? (
                  <img
                    src={category.picture.link}
                    alt="img"
                    className={styles.bookCoverImage}
                  />
                ) : (
                  <img
                    src={NoImg}
                    alt="img"
                    className={styles.bookCoverImage}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.booksList}></div>
    </div>
  );
};

export default SearchComponent;
