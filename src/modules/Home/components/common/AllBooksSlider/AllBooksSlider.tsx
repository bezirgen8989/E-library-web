import styles from "./AllBooksSlider.module.scss";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NoImg from "../../../../../assets/images/NoImagePlaceholder.jpg";
import { FC, ReactNode } from "react";
import { Skeleton } from "antd";

interface Author {
  name: string;
}

interface Book {
  id: number;
  title: string;
  bookCover: {
    link: string;
  };
  author: Author[];
  isBookshelfStarted?: any;
  isBookshelfNotStarted?: any;
  isBookshelfFinished?: any;
  dateFinished?: string | null;
}

interface AllBooksSliderProps {
  title: any;
  seeAllLink?: any;
  books?: Book[]; // null or undefined indicates loading state
  titleImage?: ReactNode | null;
  getBook: (id: number) => void;
  isLoading?: boolean;
}

const restSliderSettings = {
  infinite: false,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  arrows: false,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        centerMode: false,
        centerPadding: "0px",
        variableWidth: true,
      },
    },
    // {
    //   breakpoint: 768,
    //   settings: {
    //     slidesToShow: 5,
    //     centerMode: false,
    //   },
    // },
    {
      breakpoint: 1050,
      settings: {
        slidesToShow: 5,
        centerMode: false,
        centerPadding: "0px",
        variableWidth: true,
      },
    },
  ],
};
const AllBooksSlider: FC<AllBooksSliderProps> = ({
  title,
  titleImage,
  books,
  seeAllLink,
  getBook,
  isLoading,
}) => {
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const renderLoadingSkeletons = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className={styles.newBook} style={{ height: "299px" }}>
        <div className={styles.imgWrap}>
          <Skeleton.Image className={styles.skeletonImage} />
        </div>
        <Skeleton
          active
          title={false}
          paragraph={{ rows: 2, width: ["100%", "80%"] }}
        />
      </div>
    ));

  const renderBooks = () =>
    books?.map((book) => (
      <div key={book.id} className={styles.newBook}>
        <div onClick={() => getBook(book.id)}>
          <div className={styles.imgWrap}>
            {book.bookCover?.link ? (
              <img
                src={book.bookCover?.link}
                alt={book.title}
                className={styles.bookCoverImage}
              />
            ) : (
              <img
                src={NoImg}
                alt={book.title}
                className={styles.bookCoverImage}
              />
            )}
          </div>
          {book.dateFinished && (
            <div className={styles.finishedDate}>
              Finished on {formatDate(book.dateFinished)}
            </div>
          )}
          <div className={styles.newBookTitle}>{book.title}</div>
          <div
            style={{
              color:
                book?.isBookshelfNotStarted || book?.isBookshelfStarted
                  ? "grey"
                  : "#996C42",
            }}
            className={styles.newBookAuthor}
          >
            {book.author.map((author) => author.name).join(", ")}
          </div>
        </div>
        {book?.isBookshelfNotStarted && (
          <div className={styles.startBtn}>Start Reading</div>
        )}
        {book?.isBookshelfStarted && (
          <div className={styles.startBtn}>Continue Reading</div>
        )}
      </div>
    ));

  return (
    <div className={styles.rowNewBooks}>
      <div className={styles.homeTitle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>{title}</h2>
          {titleImage}
        </div>
        {seeAllLink && (
          <Link className={styles.titleLink} to={seeAllLink}>
            See all
          </Link>
        )}
      </div>
      <div className={styles.newBooksList}>
        {isLoading ? renderLoadingSkeletons() : renderBooks()}
      </div>
      <Slider className={styles.newBooksSlider} {...restSliderSettings}>
        {isLoading ? renderLoadingSkeletons() : renderBooks()}
      </Slider>
    </div>
  );
};

export default AllBooksSlider;
