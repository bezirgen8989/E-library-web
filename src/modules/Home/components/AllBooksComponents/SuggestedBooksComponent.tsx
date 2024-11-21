import styles from "./NewBooksComponent.module.scss";
import React from "react";
import commonStyles from "../../../../assets/css/commonStyles/CommonStyles.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import { Skeleton } from "antd";

interface Author {
  name: string;
}

interface Book {
  id: string;
  title: string;
  bookCover: {
    link: string;
  };
  author: Author[];
}

type HomeProps = {
  books: any;
  getBook: (id: any) => void;
};

const SuggestedBooksComponent: React.FC<HomeProps> = ({ books, getBook }) => {
  const history = useHistory();
  const isLoading = !books || books.length === 0;

  return (
    <div className={styles.home_page}>
      <div
        onClick={() => history.goBack()}
        className={commonStyles.backBtnRelativePage}
      >
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        Back
      </div>
      <div className={styles.page_title}>
        <h1>Suggested for You</h1>
      </div>
      <div className={styles.booksList}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.newBook}>
                <div className={styles.imgWrap}>
                  <Skeleton.Image style={{ width: "142px", height: "175px" }} />
                </div>
                <div className={styles.newBookTitle}>
                  <Skeleton active paragraph={{ rows: 1 }} title={false} />
                </div>
                <div className={styles.newBookAuthor}>
                  <Skeleton active paragraph={{ rows: 1 }} title={false} />
                </div>
              </div>
            ))
          : books.map((book: Book) => (
              <div
                key={book.id}
                className={styles.newBook}
                onClick={() => getBook(book.id)}
              >
                <div className={styles.imgWrap}>
                  <img src={book.bookCover?.link} alt={book.title} />
                </div>
                <div className={styles.newBookTitle}>{book.title}</div>
                <div className={styles.newBookAuthor}>
                  {book.author.map((author) => author.name).join(", ")}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default SuggestedBooksComponent;
