import styles from "./SearchComponent.module.scss";
import { FC, useState } from "react";
import NoImg from "../../../../../assets/images/NoImagePlaceholder.jpg";
import Search from "../../../../../assets/images/icons/SearchIcon.svg";
import { Input } from "antd";

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
  getSearchBooks: (text: string) => void;
  searchBooks: string[]; // Массив строк
}

const SearchComponent: FC<SearchBooksComponentProps> = ({
  categoriesData = [],
  getBooksByCategory,
  getSearchBooks,
  searchBooks = [], // Устанавливаем значение по умолчанию как пустой массив
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    getSearchBooks(value); // Запрос на поиск
  };

  const handleBookSelect = (title: string) => {
    setSearchTerm(title);
  };

  const filteredBooks = searchBooks.filter((book) =>
    book.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.home_page}>
      <div className={styles.habit_wrap}>
        <div className={styles.searchWrapper}>
          <Input
            placeholder="Search by place or influencer"
            prefix={<img src={Search} alt="search" />}
            id="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchBookInput}
            autoComplete="off"
          />
          {filteredBooks.length > 0 && (
            <div className={styles.dropdown}>
              {filteredBooks.map((book, index) => (
                <div
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleBookSelect(book)}
                >
                  <img src={Search} alt="search" /> {book}
                </div>
              ))}
            </div>
          )}
        </div>
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
                  src={category.picture.link || NoImg}
                  alt={category.name}
                  className={styles.bookCoverImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
