import React, { useEffect, useRef, useState } from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";
import { Progress } from "antd"; // Import Ant Design's Progress component

interface ReadingProps {
  pagesContent: string[];
  totalPages: number;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  featurePageFromServer: number;
  maxLoadPage: number;
  setMaxLoadPage: (num: number) => void;
}

const Reading: React.FC<ReadingProps> = ({
  pagesContent,
  totalPages,
  isLoading,
  onNext,
  onPrev,
  featurePageFromServer,
  maxLoadPage,
  setMaxLoadPage,
}) => {
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(featurePageFromServer);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const getPageNumberFromHTML = (html: string) => {
    const match = html.match(/<title>Page (\d+)<\/title>/);
    return match ? parseInt(match[1], 10) : null;
  };

  useEffect(() => {
    if (pagesContent.length > 0 && containerRef.current && isFirstLoad) {
      setTimeout(() => {
        containerRef.current!.scrollTop = 50;
        setIsFirstLoad(false);
      }, 300);
    }
  }, [pagesContent, isFirstLoad]);

  useEffect(() => {
    if (pagesContent.length > 0) {
      const pageNumbers = pagesContent
        .map(getPageNumberFromHTML)
        .filter((num) => num !== null) as number[];

      if (pageNumbers.length > 0) {
        const maxPage = Math.max(...pageNumbers);
        setMaxLoadPage(maxPage);
      }
    }
  }, [pagesContent, setMaxLoadPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        !isLoading &&
        currentPage < totalPages
      ) {
        onNext();
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }

      if (scrollTop <= 10 && !isLoading && currentPage > 1) {
        onPrev();
        setCurrentPage((prev) => Math.max(prev - 1, 1));

        if (scrollTop <= 10 && !isFirstLoad) {
          setTimeout(() => {
            containerRef.current!.scrollTop = 100;
          }, 300);
        }
      }
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
  }, [onNext, onPrev, isLoading, currentPage, totalPages, isFirstLoad]);

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
        style={{ maxHeight: "calc(100vh - 155px)", overflowY: "auto" }}
      >
        <div className={styles.content}>
          {pagesContent.map((pageHtml, index) => {
            const pageNumber = getPageNumberFromHTML(pageHtml);
            return (
              <div key={index}>
                <div
                  className={styles.contentWrap}
                  dangerouslySetInnerHTML={{ __html: pageHtml }}
                />
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

      <div className={styles.progressContent} style={{ marginTop: "20px" }}>
        <div style={{ textAlign: "center" }}>
          {maxLoadPage} of {totalPages}
        </div>
        <Progress
          percent={(maxLoadPage / totalPages) * 100}
          status="active"
          showInfo={false}
          strokeColor="#1890ff" // Customize the progress bar color if needed
        />
      </div>
    </div>
  );
};

export default Reading;
