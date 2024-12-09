import React, { useEffect, useRef, useState } from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";

interface ReadingProps {
  pagesContent: string[];
  totalPages: number;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  featurePageFromServer: number;
}

const Reading: React.FC<ReadingProps> = ({
  pagesContent,
  totalPages,
  isLoading,
  onNext,
  onPrev,
  featurePageFromServer,
}) => {
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(featurePageFromServer);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true); // Состояние для отслеживания первой загрузки страницы

  // Функция для получения номера страницы из HTML-контента
  const getPageNumberFromHTML = (html: string) => {
    const match = html.match(/<title>Page (\d+)<\/title>/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Устанавливаем скролл в центр после загрузки данных, только для первой загрузки
  useEffect(() => {
    if (pagesContent.length > 0 && containerRef.current && isFirstLoad) {
      setTimeout(() => {
        // Отступ 50px для первой загрузки
        const scrollPosition = (containerRef.current!.scrollTop = 50);
        containerRef.current!.scrollTop = scrollPosition; // Устанавливаем скролл в центр
        setIsFirstLoad(false); // Обновляем флаг, что первая загрузка завершена
      }, 500); // Можно настроить задержку, если необходимо
    }
  }, [pagesContent, isFirstLoad]); // Эффект сработает, когда изменится pagesContent или isFirstLoad

  // Обработка прокрутки
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Прокрутка вниз: загрузка следующей страницы
      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        !isLoading &&
        currentPage < totalPages
      ) {
        onNext();
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }

      // Прокрутка вверх: загрузка предыдущей страницы с отступом
      if (scrollTop <= 10 && !isLoading && currentPage > 1) {
        onPrev();
        setCurrentPage((prev) => Math.max(prev - 1, 1));

        // Отступ для прокрутки вверх с задержкой
        if (scrollTop <= 10 && !isFirstLoad) {
          setTimeout(() => {
            containerRef.current!.scrollTop = 50; // Устанавливаем отступ при прокрутке вверх с задержкой
          }, 300); // Задержка 300 мс (можно настроить)
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
