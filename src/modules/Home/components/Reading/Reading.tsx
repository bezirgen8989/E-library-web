import React, { useEffect, useRef, useState } from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import { List, Progress } from "antd";
import { useTranslation } from "react-i18next";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";
import { ReaderByType } from "../../../../components/readerByType";

interface ReadingProps {
  pagesContent: any;
  totalPages: number;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  featurePageFromServer: any;
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
  const { t } = useTranslation();
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(10);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  console.log("pageContent", pagesContent);

  useEffect(() => {
    if (featurePageFromServer !== null) {
      setMaxLoadPage(featurePageFromServer);
    }
  }, [featurePageFromServer]);

  useEffect(() => {
    if (pagesContent.length > 0 && containerRef.current && isFirstLoad) {
      setTimeout(() => {
        containerRef.current!.scrollTop = 50;
        setIsFirstLoad(false);
      }, 300);
    }
  }, [pagesContent, isFirstLoad]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        currentPage < totalPages
      ) {
        onNext();
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }

      if (scrollTop < 50 && currentPage > 1) {
        const previousScrollHeight = scrollHeight;

        onPrev();
        setCurrentPage((prev) => Math.max(prev - 1, 1));

        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop =
              containerRef.current.scrollHeight -
              previousScrollHeight +
              scrollTop;
          }
        }, 50);
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
  }, [onNext, onPrev, isLoading, currentPage, totalPages]);

  return (
    <div>
      <div
        onClick={() => history.goBack()}
        className={styles.backBtnRelativePage}
      >
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        {t("backBtn")}
      </div>

      <div
        ref={containerRef}
        className={styles.home_page}
        style={{
          height: "calc(100vh - 155px)",
          overflow: "auto",
          padding: "0 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <List
          className={styles.listWrapper}
          dataSource={pagesContent}
          locale={{
            emptyText: () => null,
          }}
          renderItem={(page: any, index) => (
            <List.Item key={index} className={styles.listItem}>
              <ReaderByType
                content={
                  page.fileType === "html"
                    ? page.content
                    : page.pdfPage ?? page.content
                }
                fileType={page.fileType}
              />
            </List.Item>
          )}
        />
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
          strokeColor="#1890ff"
        />
      </div>
    </div>
  );
};

export default Reading;
