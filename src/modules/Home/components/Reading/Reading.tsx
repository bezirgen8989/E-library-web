import React, { useEffect, useRef } from "react";
import styles from "./Reading.module.scss";
import BackIcon from "../../../../assets/images/icons/backPage.svg";
import { useHistory } from "react-router-dom";
import SpinnerBrown from "../../../../components/common/SpinnerBrown";

interface ReadingProps {
  pagesContent: string[];
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const Reading: React.FC<ReadingProps> = ({
  pagesContent,
  isLoading,
  onNext,
  onPrev,
}) => {
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  // Обработчик скролла для загрузки следующей страницы при достижении конца
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Если скроллим вниз, загружаем следующую страницу
      if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
        onNext();
      }

      // Если скроллим вверх, загружаем предыдущую страницу
      if (scrollTop <= 10 && !isLoading) {
        onPrev();
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
  }, [onNext, onPrev, isLoading]);

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
          {pagesContent.map((pageHtml, index) => (
            <div
              style={{ marginBottom: "30px" }}
              key={index}
              dangerouslySetInnerHTML={{ __html: pageHtml }}
            />
          ))}
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <SpinnerBrown />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reading;
