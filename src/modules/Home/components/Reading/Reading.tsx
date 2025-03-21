import React, { useEffect, useRef, useState } from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";
import { Progress } from "antd";
import { useLazySelector } from "../../../../hooks"; // Import Ant Design's Progress component

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
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(10);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const { result: localization } = useLazySelector(
    ({ auth }) => auth.appLocalization || {}
  );

  useEffect(() => {
    if (featurePageFromServer) {
      setMaxLoadPage(featurePageFromServer);
    }
  }, [featurePageFromServer, setMaxLoadPage]);
  // Function to sanitize HTML and inject custom styles
  const sanitizeHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const imgs = doc.querySelectorAll("img");
    imgs.forEach((img) => img.remove());

    let meta = doc.querySelector("meta[name='viewport']") as HTMLMetaElement;
    if (!meta) {
      meta = doc.createElement("meta") as HTMLMetaElement;
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      doc.head.appendChild(meta);
    }

    const style = doc.createElement("style");
    style.innerHTML = `
      body {
        background-color: #FBF1EA;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        overflow: hidden;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
        color: #333;
        white-space: pre-wrap;
      }
    `;
    doc.head.appendChild(style);

    return doc.body.innerHTML;
  };

  useEffect(() => {
    if (pagesContent.length > 0 && containerRef.current && isFirstLoad) {
      setTimeout(() => {
        containerRef.current!.scrollTop = 50;
        setIsFirstLoad(false);
      }, 300);
    }
  }, [pagesContent, isFirstLoad]);

  if (pagesContent.length > 0) {
    const pageNumbers = pagesContent
      .map((page: any) => Number(page))
      .filter((num: any) => !isNaN(num)); // Filter out NaN values

    if (pageNumbers.length > 0) {
      const maxPage = Math.max(...pageNumbers);
      setMaxLoadPage(maxPage);
    }
  }

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

  const renderPdf = (pdfBase64: string) => {
    // Generate the data URI for embedding the PDF
    const pdfUrl = `data:application/pdf;base64,${pdfBase64}#toolbar=0`; // Adding the `#toolbar=0` to hide the toolbar
    return (
      <iframe
        src={pdfUrl}
        width="100%"
        height="1000px"
        title="PDF Viewer"
        frameBorder="0"
        style={{ display: "block" }} // Ensure the iframe takes up full width
      />
    );
  };

  return (
    <div>
      <div
        onClick={() => history.goBack()}
        className={styles.backBtnRelativePage}
      >
        <img style={{ marginRight: 9 }} src={BackIcon} alt="Back arrow" />
        {localization?.backBtn}
      </div>

      <div
        ref={containerRef}
        className={styles.home_page}
        style={{ maxHeight: "calc(100vh - 155px)", overflowY: "auto" }}
      >
        <div className={styles.content}>
          {pagesContent.map((page: any, index: any) => (
            <div key={index}>
              {page.fileType === "html" ? (
                <div
                  className={styles.contentWrap}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(page.content),
                  }}
                />
              ) : page.fileType === "pdf" ? (
                <div className={styles.pdfWrap}>
                  {page.pdfPage && renderPdf(page.pdfPage)}
                </div>
              ) : (
                <div className={styles.contentWrap}>
                  <pre>{page.content}</pre>
                </div>
              )}
            </div>
          ))}
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
