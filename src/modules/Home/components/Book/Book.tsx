import React, { useContext, useEffect, useState } from "react";
import styles from "./Book.module.scss";
import { UserContext } from "core/contexts";
import Button from "../../../../components/common/Buttons/Button";
import Question from "../../../../assets/images/icons/question.png";
import Download from "../../../../assets/images/icons/download.png";
import Group from "../../../../assets/images/icons/group.png";
import HabitIcon from "../../../../assets/images/icons/habit_icon.png";
import ReviewIcon from "../../../../assets/images/icons/review_icon.png";
import LikeIcon from "../../../../assets/images/icons/like.svg";
import { useHistory, useParams } from "react-router-dom";
// @ts-ignore
import Rating from "react-rating-stars-component";
import NoImg from "../../../../assets/images/NoImagePlaceholder.jpg";
import LanguageModal from "../../../Auth/components/LanguageModal";
import NoAvatar from "../../../../assets/images/icons/uploadBg.png";
import ReviewModal from "../common/ReviewModal";
import { routes } from "../../routing";
import PageBooksList from "../common/PageBooksList/PageBooksList";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import Review from "../common/Review/Review";
import { Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getBookVersion } from "../../slices/home";

type LanguageType = {
  id: number;
  name: string;
  flag: {
    link: string;
  };
};

type UserType = {
  userName: string;
};

type ReviewType = {
  id?: number;
  rating: number;
  text: string;
  reviewer: string;
  deleteReview: any;
  user?: UserType; // Optional user property added
};

type CategoryType = {
  id: number;
  name: string;
  color: string;
};

export type BookType = {
  id: any;
  title: string;
  added: number;
  isFavourite: boolean;
  author: { name: string }[];
  description: string;
  bookCover: { link: string };
  isAgeRestricted: boolean;
  categories: CategoryType[];
  rating: number;
  reviewCount: number;
};

type BookProps = {
  languages: LanguageType[];
  reviews?: ReviewType[]; // Mark reviews as optional
  currentBook: { result: BookType | null };
  getBook: (id: number) => void;
  addToBookShelf: any;
  deleteFromBookShelf: any;
  reviewSubmit: any;
  similarBooks: any;
  deleteReview: any;
  getAuthorBooks: any;
  startRead: any;
  currentBookVersion: any;
};

const Book: React.FC<BookProps> = ({
  languages,
  reviews = [],
  currentBook,
  getBook,
  addToBookShelf,
  deleteFromBookShelf,
  reviewSubmit,
  similarBooks,
  deleteReview,
  getAuthorBooks,
  startRead,
  currentBookVersion,
}) => {
  const [book, setBook] = useState<BookType | null>(null);
  const { id } = useParams<{ id: string }>();
  const value = useContext(UserContext);
  const history = useHistory();
  const { t } = useTranslation();

  // const defaultLanguage = () => {
  //   const storedLanguageId = sessionStorage.getItem("selectedLanguage");
  //   const selectedLang = languages.find(
  //       (lang) => lang.id === (storedLanguageId ? Number(storedLanguageId) : 0)
  //   );
  //
  //   if (selectedLang) {
  //     return selectedLang;
  //   }
  //
  //   return {
  //     id: 0,
  //     name: "Select Language",
  //     flag: { link: NoAvatar },
  //     translationType: "official"
  //   };
  // };

  const [selectedLanguage, setSelectedLanguage] = useState({
    id: 0,
    name: "Select Language",
    flag: { link: NoAvatar },
    translationType: "official",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  console.log("selectedLanguage", selectedLanguage);
  console.log("currentBookVersion", currentBookVersion);

  useEffect(() => {
    if (id) {
      getBook(Number(id));
    }
  }, [id, getBook]);

  useEffect(() => {
    if (selectedLanguage) {
      dispatch(
        getBookVersion({
          page: "1",
          limit: "1",
          filterLanguage: `[language.id][eq]=${selectedLanguage?.id}`,
          filterId: `[coreBook.id][eq]=${currentBook?.result?.id}`,
        })
      );
    }
  }, [selectedLanguage, currentBook]);

  useEffect(() => {
    if (currentBook?.result) {
      setBook(currentBook.result);
      setIsLiked(currentBook.result.isFavourite);
    }
  }, [currentBook]);

  const handleLikeClick = () => {
    if (book) {
      if (isLiked) {
        // If already liked, remove from bookshelf
        deleteFromBookShelf({
          userId: value.id,
          bookId: book.id,
        });
      } else {
        // If not liked, add to bookshelf
        addToBookShelf({
          user: {
            id: value.id,
          },
          book: {
            id: book.id,
          },
          isFavourited: true,
          readingState: "added",
        });
      }
      setIsLiked(!isLiked);
    }
  };

  const onLanguageSelect = (language: LanguageType) => {
    // @ts-ignore
    setSelectedLanguage(language);
    sessionStorage.setItem("selectedLanguageId", JSON.stringify(language.id));
  };

  useEffect(() => {
    if (currentBook?.result) {
      setBook(currentBook.result);
      console.log("Current Reading Set:", currentBook.result);
    }
  }, [currentBook]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // useEffect(() => {
  //   if (languages && languages.length > 0) {
  //     const englishLanguage = languages.find((lang) => lang.name === "English");
  //     if (englishLanguage) {
  //       setSelectedLanguage(englishLanguage);
  //     }
  //   }
  // }, [languages]);

  if (!languages) {
    return (
      <div className={styles.home_page}>
        <div className={styles.home_page}>
          <div className={styles.flex_wrap}>
            <div className={styles.left_side}>
              <Skeleton.Image
                style={{
                  width: "247px",
                  height: "372px",
                  marginBottom: "20px",
                }}
              />
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </div>
            <div className={styles.right_side}>
              <div style={{ marginBottom: "20px" }}>
                <Skeleton.Button active />
              </div>
              <div style={{ marginBottom: "40px", width: "300px" }}>
                <Skeleton.Button active block />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton.Button
                  style={{ marginBottom: "20px", width: "95%", height: "54px" }}
                  active
                  block
                />
                <Skeleton.Button
                  style={{ marginBottom: "20px", width: "95%", height: "54px" }}
                  active
                  block
                />
              </div>
              <Skeleton.Button style={{ marginBottom: "20px" }} active block />
              <Skeleton.Button
                style={{ marginBottom: "20px", height: "80px" }}
                active
                block
              />
              <Skeleton.Button
                style={{ marginBottom: "20px", height: "60px" }}
                active
                block
              />
              <Skeleton.Button
                style={{ marginBottom: "20px", height: "60px" }}
                active
                block
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => history.goBack()}
        className={styles.backBtnRelativePage}
      >
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        {t("backBtn")}
      </div>
      <div className={styles.home_page}>
        <div className={styles.flex_wrap}>
          <div className={styles.left_side}>
            <div className={styles.img_wrap}>
              {book?.bookCover?.link ? (
                <img
                  src={book.bookCover?.link}
                  alt={book.title}
                  className={styles.bookCoverImage}
                />
              ) : (
                <img
                  src={NoImg}
                  alt={book?.title}
                  className={styles.bookCoverImage}
                />
              )}
            </div>
            <div className={styles.desktopView}>
              {book?.isAgeRestricted && (
                <div className={styles.age_row}>
                  <img style={{ marginRight: "5px" }} src={Group} alt="icon" />
                  For Ages 16 and Up
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "16px",
                }}
              >
                {book?.categories?.map((category: any) => (
                  <div
                    key={category.id}
                    style={{ background: category.color }}
                    className={styles.habit_tag}
                  >
                    <img
                      style={{ marginRight: "5px" }}
                      src={HabitIcon}
                      alt="icon"
                    />
                    {t(`category${category.name}`, {
                      defaultValue: category.name,
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.right_side}>
            <div className={styles.top_block}>
              <div className={styles.book_title}>
                <div>{currentBookVersion?.result?.data[0]?.title}</div>
                <div className={styles.bookSettings}>
                  <div className={styles.desktopView}>
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        showModal();
                      }}
                      className={styles.languageSelectWrapper}
                    >
                      <div
                        className={styles.languageSelect}
                        style={{
                          backgroundImage: `url(${selectedLanguage.flag.link})`,
                        }}
                      ></div>
                      <span>{selectedLanguage.name}</span>
                      {currentBookVersion?.result?.data[0]?.translationType !==
                        "official" && <div className={styles.aiMarker}>AI</div>}
                    </div>
                  </div>
                  <div
                    className={styles.bookShelfButton}
                    onClick={handleLikeClick}
                  >
                    <img
                      src={LikeIcon}
                      alt="like"
                      className={isLiked ? styles.likedIcon : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.author_title}>
              {book?.author?.map((author: any, index: number) => {
                const isLast = index === book.author.length - 1;
                const isSecondLast = index === book.author.length - 2;
                return (
                  <React.Fragment key={index}>
                    <span
                      className={styles.author}
                      onClick={() => getAuthorBooks(author.id)}
                      style={{
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      {author.name}
                    </span>
                    {isSecondLast && (
                      <span style={{ color: "#7C7A72" }}> and </span>
                    )}
                    {!isSecondLast && !isLast && ", "}
                  </React.Fragment>
                );
              })}
            </div>
            <div className={styles.mobileView}>
              <div style={{ display: "flex" }}>
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    showModal();
                  }}
                  className={styles.languageSelectWrapper}
                >
                  <div
                    className={styles.languageSelect}
                    style={{
                      backgroundImage: `url(${selectedLanguage.flag.link})`,
                    }}
                  ></div>
                  <span>{selectedLanguage.name}</span>
                </div>
              </div>
            </div>
            <div className={styles.btns_block}>
              <Button
                className={styles.readBtn}
                style={{ marginTop: 0 }}
                onClick={() => {
                  startRead({ bookId: id });
                }}
                variant="Brown"
                type="submit"
              >
                {t("readNowBtn")}
              </Button>
              <div className={styles.divider} />
              <Button
                className={styles.questionBtn}
                to={`${routes.askQuestion}/${id}`}
                style={{
                  color: "#996C42",
                  border: "2px solid rgba(153, 108, 66, 0.2)",
                  borderRadius: "50px",
                  background: "transparent",
                }}
                variant="Transparent"
                icon={<img src={Question} alt="icon" />}
              >
                {t("AskQuestionBtn")}
              </Button>
            </div>
            <section className={styles.bookDescription}>
              <div className={styles.description}>
                <div className={styles.section_title}>
                  {t("bookDescriptionBtn")}
                </div>
                <p>
                  <div>{currentBookVersion?.result?.data[0]?.description}</div>
                </p>
              </div>
              <div className={styles.mobileView}>
                <div className={styles.age_row}>
                  <img style={{ marginRight: "5px" }} src={Group} alt="icon" />
                  {t("ageLimit")}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "left",
                    justifyContent: "left",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  }}
                >
                  {book?.categories?.map((category: any) => (
                    <div
                      key={category.id}
                      style={{ background: category.color }}
                      className={styles.habit_tag}
                    >
                      <img
                        style={{ marginRight: "5px" }}
                        src={HabitIcon}
                        alt="icon"
                      />
                      {t(`category${category.name}`)}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                style={{
                  color: "#996C42",
                  border: "2px solid rgba(153, 108, 66, 0.2)",
                  background: "transparent",
                  borderRadius: "14px",
                }}
                variant="Transparent"
                icon={<img src={Download} alt="icon" />}
              >
                {t("downloadBtn")}
                <div
                  style={{
                    background: "rgba(153, 108, 66, 0.1)",
                    fontSize: "12px",
                    borderRadius: "24px",
                    padding: "2px 6px",
                    marginLeft: "5px",
                  }}
                >
                  2MB
                </div>
              </Button>
            </section>
            <section className={styles.reviewsSection}>
              <div className={styles.section_title}>{t("reviews")}</div>
              <div className={styles.overallRating}>
                {book?.rating !== undefined && (
                  <Rating
                    count={5}
                    value={Number(book.rating) > 0 ? Number(book.rating) : 0}
                    size={24}
                    edit={false}
                    activeColor="#996C42"
                    emptyColor="#ccc"
                    half={true}
                  />
                )}
                <div className={styles.rating_count}>
                  {book?.rating ? Number(book.rating).toFixed(1) : "N/A"}
                </div>
                <span>
                  ({book?.reviewCount} {t("reviews").toLowerCase()})
                </span>
              </div>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Review
                    key={review.id}
                    id={review.id}
                    rating={review.rating}
                    text={review.text}
                    reviewer={review?.user?.userName || "Anonymous"}
                    deleteReview={deleteReview}
                  />
                ))
              ) : (
                <p>{t("noReviewsAvailable")}</p>
              )}
              <Button
                style={{
                  color: "#996C42",
                  border: "2px solid rgba(153, 108, 66, 0.2)",
                  borderRadius: "14px",
                  background: "transparent",
                }}
                onClick={() => {
                  setIsReviewModalOpen(true);
                }}
                variant="Transparent"
              >
                {t("writeReviewBtn")}
                <img
                  style={{ marginLeft: "10px" }}
                  src={ReviewIcon}
                  alt="icon"
                />
              </Button>
            </section>
            <section>
              <PageBooksList
                books={similarBooks}
                title={t("titleSimilarBooks")}
                seeAllLink={routes.similarBooks}
                getBook={getBook}
              />
            </section>
          </div>
        </div>
        <LanguageModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          languages={languages}
          defaultLanguage={selectedLanguage}
          onLanguageSelect={onLanguageSelect}
        />
        <ReviewModal
          reviewSubmit={reviewSubmit}
          book={book}
          isModalOpen={isReviewModalOpen}
          setIsModalOpen={setIsReviewModalOpen}
        />
      </div>
    </div>
  );
};

export default Book;
