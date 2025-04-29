import { useEffect, useMemo, useState } from "react";
import styles from "./Book.module.scss";
import { Button, Divider, Tag, Typography } from "antd";
import Question from "../../../../assets/images/icons/question.png";
import Download from "../../../../assets/images/icons/download.png";
import Group from "../../../../assets/images/icons/group.png";
import HabitIcon from "../../../../assets/images/icons/habit_icon.png";
import ReviewIcon from "../../../../assets/images/icons/review_icon.png";
import LikeIcon from "../../../../assets/images/icons/like.svg";
import ListenIcon from "../../../../assets/images/icons/listenIcon.svg";
import { useHistory, useParams } from "react-router-dom";
import NoImg from "../../../../assets/images/NoImagePlaceholder.jpg";
import arrowDown from "../../../../assets/images/icons/arrowProfile.svg";
import LanguageModal from "../../../Auth/components/LanguageModal";
import ReviewModal from "../common/ReviewModal";
import { routes } from "../../routing";
import PageBooksList from "../common/PageBooksList/PageBooksList";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import Review from "../common/Review/Review";
import { Rate } from "antd";
import { useDispatch } from "react-redux";
import {
  addToShelf,
  deleteFromShelf,
  getBookVersion,
  useHomeState,
} from "../../slices/home";
import { useTranslation } from "react-i18next";
import { defaultEnglishLanguage } from "../../../../constants";
import { Language } from "../../../Auth/slices/auth/types";
import { BookSkeleton } from "./Skeleton";
import { useAuthState } from "../../../Auth/slices/auth";
import { formatFileSize } from "../../../../helpers/helper";

type BookProps = {
  languages: Language[];
  getBook: (id: number) => void;
  reviewSubmit: any;
  similarBooks: any;
  deleteReview: any;
  getAuthorBooks: any;
  startRead: any;
  startListen: any;
  reviewsRating?: string;
};

const Book = ({
  getBook,
  reviewSubmit,
  similarBooks,
  deleteReview,
  getAuthorBooks,
  startRead,
  startListen,
  reviewsRating,
}: BookProps) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch();

  const { userData } = useAuthState();
  const { currentBook, currentBookVersion, reviews } = useHomeState();

  const { userBookLanguage, userId } = useMemo(() => {
    const userBookLanguage =
      userData?.result?.bookLanguage || defaultEnglishLanguage;
    const userId = userData?.result?.id;

    return {
      userBookLanguage,
      userId,
    };
  }, [userData.result, userData.isLoading]);

  const { bookReviews, isReviewed } = useMemo(() => {
    const bookReviews = reviews?.result?.data;
    const isReviewed = bookReviews?.some(
      (review) => review?.user?.id === userId
    );

    return {
      bookReviews,
      isReviewed,
    };
  }, [reviews?.result]);

  const { locBookCoverLink, isOfficial, downloadLink, isBookLiked } =
    useMemo(() => {
      const locBookCoverLink =
        currentBookVersion?.result?.data[0]?.locBookCover?.link || NoImg;
      const isOfficial =
        currentBookVersion?.result?.data[0]?.translationType !== "official";
      const downloadLink = currentBookVersion?.result?.data[0]?.bookFile?.link;
      const isBookLiked = currentBook.result?.isFavourite;

      return {
        locBookCoverLink,
        isOfficial,
        downloadLink,
        isBookLiked,
      };
    }, [currentBookVersion, currentBook]);

  const [selectedLanguage, setSelectedLanguage] = useState(userBookLanguage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getBook(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (currentBook?.result?.id) {
      dispatch(
        getBookVersion({
          page: "1",
          limit: "1",
          filterLanguage: `[language.id][eq]=${selectedLanguage?.id}`,
          filterId: `[coreBook.id][eq]=${currentBook?.result?.id}`,
        })
      );
    }
  }, [currentBook.result?.id]);

  const closeSelectBookLangModal = () => {
    setIsModalOpen(false);
  };

  const handleLikeClick = () => {
    if (currentBook.result?.id) {
      if (isBookLiked) {
        dispatch(
          deleteFromShelf({
            userId: userId,
            bookId: currentBook.result.id,
          })
        );
      } else {
        dispatch(
          addToShelf({
            user: {
              id: userId,
            },
            book: {
              id: currentBook.result.id,
            },
            isFavourited: true,
            readingState: "added",
          })
        );
      }
    }
  };

  const onLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    closeSelectBookLangModal();
    dispatch(
      getBookVersion({
        page: "1",
        limit: "1",
        filterLanguage: `[language.id][eq]=${language?.id}`,
        filterId: `[coreBook.id][eq]=${currentBook?.result?.id}`,
      })
    );
    sessionStorage.setItem("currentBookLanguage", JSON.stringify(language));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  if (
    !currentBook ||
    currentBookVersion.isLoading ||
    !currentBook?.result?.id ||
    userData.isLoading
  ) {
    return <BookSkeleton />;
  }

  return (
    <div className={styles.bookPageWrapper}>
      <LanguageModal
        isModalOpen={isModalOpen}
        onLanguageSelect={onLanguageSelect}
        currentSelectedLanguage={selectedLanguage}
        closeModal={closeSelectBookLangModal}
        languageSelectType={"book"}
      />
      <ReviewModal
        reviewSubmit={reviewSubmit}
        book={currentBook.result}
        isModalOpen={isReviewModalOpen}
        setIsModalOpen={setIsReviewModalOpen}
        customClass={styles.overallModalRating}
      />
      <Button
        className={styles.backBtnRelativePage}
        type={"text"}
        icon={<img src={BackIcon} alt="Back arrow" />}
        onClick={() => history.goBack()}
      >
        <span>{t("backBtn")}</span>
      </Button>
      <div className={styles.home_page}>
        <div className={styles.flex_wrap}>
          <div className={styles.left_side}>
            <div className={styles.bookImageBlock}>
              <div className={styles.img_wrap}>
                <img
                  className={styles.bookImg}
                  src={locBookCoverLink}
                  alt={`Book Image ${currentBook.result?.title}`}
                />
              </div>
              <div className={styles.desktopView}>
                {currentBook.result?.isAgeRestricted && (
                  <div className={styles.age_row}>
                    <img src={Group} alt="icon" />
                    For Ages 16 and Up
                  </div>
                )}
                <div className={styles.bookCategories}>
                  {currentBook.result?.categories?.map((category) => (
                    <div
                      key={category.id}
                      style={{ background: category.color }}
                      className={styles.habit_tag}
                    >
                      <img src={HabitIcon} alt="icon" />
                      <span>
                        {category?.name
                          ? t(`category${category.name}`, {
                              defaultValue:
                                category?.name || t("categoryNotFound"),
                            })
                          : t("categoryNotFound")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.right_side}>
            <div className={styles.bookHeader}>
              <div className={styles.bookInfo}>
                <Typography.Title className={styles.bookName}>
                  {currentBookVersion?.result?.data[0]?.title}
                </Typography.Title>
                <Typography.Title className={styles.bookAuthors}>
                  {currentBook.result?.author?.map((i) => (
                    <span key={i.id} onClick={() => getAuthorBooks(i.id)}>
                      {i.name}
                    </span>
                  ))}
                </Typography.Title>
              </div>
              <div className={styles.bookSettings}>
                <Button
                  className={styles.languageSelectWrapper}
                  onMouseDown={showModal}
                  icon={
                    <div
                      className={styles.languageSelect}
                      style={{
                        backgroundImage: `url(${selectedLanguage.flag.link})`,
                      }}
                    />
                  }
                >
                  <div className={styles.languageTitle}>
                    <div className={styles.selectedLanguageDetails}>
                      <span>{selectedLanguage.name}</span>
                      {isOfficial && <div className={styles.aiMarker}>AI</div>}
                    </div>
                    <img src={arrowDown} alt="Arrow" />
                  </div>
                </Button>
                <Button
                  className={styles.bookShelfButton}
                  shape={"circle"}
                  size={"large"}
                  onClick={handleLikeClick}
                  icon={
                    <img
                      src={LikeIcon}
                      alt="Like"
                      className={isBookLiked ? styles.likedIcon : ""}
                    />
                  }
                />
              </div>
            </div>

            <div className={styles.bookActions}>
              <Button
                className={styles.readBtn}
                onClick={() => {
                  startRead({ bookId: id });
                }}
              >
                {t("readNowBtn")}
              </Button>
              <div className={styles.btns_block}>
                <Button
                  className={styles.buttonElement}
                  icon={<img src={ListenIcon} alt="icon" />}
                  onClick={() => {
                    startListen({ bookId: id });
                  }}
                >
                  {t("listen")}
                </Button>
                <Button
                  className={styles.buttonElement}
                  icon={<img src={Question} alt="icon" />}
                  onClick={() =>
                    history.push(
                      `${routes.askQuestion}?currentStep=5&selectedBook=${id}`
                    )
                  }
                >
                  {t("AskQuestionBtn")}
                </Button>
              </div>
            </div>
            <Divider style={{ margin: "12.5px 0" }} />
            <div className={styles.descriptionBlock}>
              <Typography.Title level={4} className={styles.section_title}>
                {t("bookDescriptionBtn")}
              </Typography.Title>
              <Typography className={styles.descriptionText}>
                {currentBookVersion?.result?.data[0]?.description}
              </Typography>
            </div>

            {downloadLink && (
              <Button
                href={downloadLink}
                className={styles.downloadButton}
                icon={<img src={Download} alt="Download" />}
              >
                <Typography>{t("downloadBtn")}</Typography>
                <Tag className={styles.fileSizeTag}>
                  {formatFileSize(
                    currentBookVersion?.result?.data[0]?.bookFile?.fileSize
                  )}
                </Tag>
              </Button>
            )}

            <section className={styles.reviewsSection}>
              <div className={styles.reviewsHeader}>
                <Typography className={styles.reviews_title}>
                  {t("reviews")}
                </Typography>
                <div className={styles.overallRating}>
                  {currentBook.result?.rating && (
                    <Rate
                      disabled
                      value={
                        Number(reviewsRating) > 0 ? Number(reviewsRating) : 0
                      }
                      allowHalf
                    />
                  )}
                  <div className={styles.rating_count}>
                    {reviewsRating ? Number(reviewsRating).toFixed(1) : ""}
                  </div>
                  <Typography>
                    ({currentBook.result?.reviewCount}{" "}
                    {t("reviews").toLowerCase()})
                  </Typography>
                </div>
              </div>

              {bookReviews?.length ? (
                bookReviews.map((review: any) => (
                  <Review
                    key={review.id}
                    id={review.id}
                    rating={review.rating}
                    text={review.text}
                    reviewer={review?.user?.userName || "Anonymous"}
                    reviewerId={review?.user?.id}
                    deleteReview={deleteReview}
                  />
                ))
              ) : (
                <Typography className={styles.noReviewsAvailable}>
                  {t("noReviewsAvailable")}
                </Typography>
              )}

              <Button
                className={styles.writeReviewButton}
                onClick={() => {
                  setIsReviewModalOpen(true);
                }}
                disabled={isReviewed}
              >
                {t("writeReviewBtn")}
                <img src={ReviewIcon} alt="Review icon" />
              </Button>
            </section>
            <PageBooksList
              books={similarBooks}
              title={t("titleSimilarBooks")}
              seeAllLink={routes.similarBooks}
              getBook={getBook}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
