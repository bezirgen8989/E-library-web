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
};

const BooksShelfComponent: React.FC<HomeProps> = ({
  topBooks,
  newBooks,
  suggestedBooks,
  getBook,
}) => {
  const value = useContext(UserContext);
  console.log(value);

  return (
    <div className={styles.home_page}>
      sdvdskvndnsvldnsv.ns.dknvdsknv.dns.vds,
      <TopBooksSlider getBook={getBook} books={topBooks} />
      <AllBooksSlider
        books={newBooks}
        title="New Books"
        titleImage={<img src={books} alt="books" />}
        seeAllLink={routes.newBooks}
        getBook={getBook}
      />
      <div style={{ height: "1px", background: "rgba(18, 18, 18, 0.1)" }} />
      <AllBooksSlider
        books={suggestedBooks}
        title="Suggested for You"
        seeAllLink={routes.suggestedBooks}
        getBook={getBook}
      />
    </div>
  );
};

export default BooksShelfComponent;
