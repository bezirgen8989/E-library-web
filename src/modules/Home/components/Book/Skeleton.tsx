import { Divider, Skeleton } from "antd";
import styles from "./Book.module.scss";
import reviewStyles from "../common/Review/Review.module.scss";
import PageBooksStyles from "../common/PageBooksList/PageBooksList.module.scss";

export const BookSkeleton = () => {
  return (
    <div
      className={styles.bookPageWrapper}
      style={{ alignItems: "flex-start" }}
    >
      <Skeleton.Button className={styles.backBtnRelativePage} />
      <div className={styles.home_page}>
        <div className={styles.flex_wrap}>
          <div className={styles.left_side}>
            <div className={styles.img_wrap}>
              <Skeleton.Image
                className={styles.bookImg}
                active
                style={{ width: "100%" }}
              />
            </div>
            <div
              className={styles.bookCategories}
              style={{
                gap: 0,
              }}
            >
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className={styles.habit_tag}
                  style={{ padding: 0, borderRadius: 120 }}
                >
                  <Skeleton.Input
                    active
                    size={"small"}
                    style={{
                      borderRadius: 120,
                      height: "40px",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.right_side}>
            <div className={styles.bookHeader}>
              <div
                className={styles.bookInfo}
                style={{
                  padding: 5,
                }}
              >
                <div className={styles.bookName}>
                  <Skeleton.Input
                    active
                    size={"large"}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className={styles.bookAuthors}>
                  <Skeleton.Input
                    active
                    size={"small"}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className={styles.bookSettings}>
                <div className={styles.languageTitle}>
                  <div className={styles.selectedLanguageDetails}>
                    <Skeleton.Input
                      active
                      size={"large"}
                      style={{ width: "100%", borderRadius: 45 }}
                    />
                  </div>
                </div>
                <Skeleton.Avatar
                  active={true}
                  size={"large"}
                  shape={"circle"}
                />
              </div>
            </div>
            <div className={styles.bookActions}>
              <Skeleton.Button
                active
                size={"large"}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  background: "transparent",
                  height: 48,
                }}
              />
              <div className={styles.btns_block}>
                <Skeleton.Button
                  active
                  className={styles.buttonElement}
                  size={"large"}
                  style={{ width: "100%", border: "none" }}
                />
                <Skeleton.Button
                  active
                  className={styles.buttonElement}
                  size={"large"}
                  style={{ width: "100%", border: "none" }}
                />
              </div>
            </div>
            <Divider style={{ margin: "12.5px 0" }} />
            <div
              className={styles.descriptionBlock}
              style={{
                padding: 0,
              }}
            >
              <Skeleton active style={{ width: "100%" }} />
            </div>

            <section className={styles.reviewsSection} style={{ margin: 0 }}>
              <div className={styles.reviewsHeader}>
                <Skeleton.Input className={styles.reviews_title} />
              </div>
              <div
                className={styles.overallRating}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 6,
                  paddingTop: 7,
                  paddingBottom: 30,
                }}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton.Avatar
                    key={index}
                    active
                    size={"small"}
                    shape={"circle"}
                  />
                ))}
              </div>
              {Array.from({ length: 1 }).map((_, index) => (
                <div
                  key={index}
                  className={reviewStyles.review}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 17,
                  }}
                >
                  <div
                    className={styles.review_star}
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <Skeleton.Avatar active size={"small"} shape={"circle"} />
                    <Skeleton.Input active size={"small"} />
                  </div>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              ))}
            </section>

            <div className={PageBooksStyles.rowNewBooks}>
              <div className={PageBooksStyles.homeTitle}>
                <Skeleton.Input size={"small"} />
              </div>
              <div
                className={PageBooksStyles.newBooksList}
                style={{
                  gap: 10,
                }}
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton.Image
                    key={index}
                    active
                    className={PageBooksStyles.imgWrap}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
