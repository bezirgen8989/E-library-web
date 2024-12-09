import React, { useEffect, useRef, useState } from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";

interface ReadingProps {
  pagesContent: string[];
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  totalPages: number;
}

const Reading: React.FC<ReadingProps> = ({
  pagesContent,
  isLoading,
  onNext,
  onPrev,
  totalPages,
}) => {
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1); // Текущее состояние страницы
  console.log(currentPage);

  const getPageNumberFromHTML = (html: string) => {
    const match = html.match(/<title>Page (\d+)<\/title>/);
    return match ? parseInt(match[1], 10) : null;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Прокрутка вниз
      if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
        onNext();
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }

      // // Прокрутка вверх, но не на первую страницу
      // if (scrollTop <= 10 && !isLoading && currentPage > 1) {
      //     onPrev();
      //     setCurrentPage((prev) => prev - 1);
      // }
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [onNext, onPrev, isLoading, currentPage, totalPages]);

  return (
    <div>
      <div
        onClick={() => history.goBack()}
        className={styles.backBtnRelativePage}
      >
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        Back
      </div>
      <div
        ref={containerRef}
        className={styles.home_page}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className={styles.content}>
          {pagesContent.map((pageHtml, index) => {
            const pageNumber = getPageNumberFromHTML(pageHtml);

            return (
              <div key={index}>
                <div
                  style={{ marginBottom: "30px" }}
                  dangerouslySetInnerHTML={{ __html: pageHtml }}
                />
                {/* Отображение номера страницы, если найден */}
                {pageNumber !== null && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    Page {pageNumber}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <SpinnerBrown />
          </div>
        )}
      </div>

      <div className={styles.progressContent}>
        <div style={{ textAlign: "center" }}>
          Page {currentPage} of {totalPages}
        </div>
        <progress
          className={styles.progressLine}
          value={currentPage}
          max={totalPages}
        ></progress>
      </div>
    </div>
  );
};

export default Reading;
