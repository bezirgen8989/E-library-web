import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Reading } from "../components";
import { clearBooks, getReadBook } from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";

const ReadingContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  // Состояние для текущей страницы
  const [page, setPage] = useState<number | null>(null);
  const [pagesContent, setPagesContent] = useState<string[]>([]);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [totalPages, setTotalPages] = useState<number>(0);
  const prevTotalPages = useRef<number>(0);

  // Значение страницы по умолчанию, приходящее с сервера
  const featurePageFromServer = 5; // Это значение может изменяться в зависимости от данных сервера

  const { currentReadBook, isLoading } = useLazySelector(({ home }) => ({
    currentReadBook: home.currentReadBook,
    isLoading: home.currentReadBook.isLoading,
  }));

  useEffect(() => {
    dispatch(clearBooks());
    setPagesContent([]);
    setLoadedPages(new Set());
    setTotalPages(0);
    prevTotalPages.current = 0;

    setPage(featurePageFromServer);
  }, [dispatch, id, featurePageFromServer]);

  useEffect(() => {
    const langId = sessionStorage.getItem("selectedLanguage") || "7";

    if (page !== null && !loadedPages.has(page)) {
      dispatch(getReadBook({ bookId: id, langId, page: page.toString() }));
    }
  }, [id, dispatch, page, loadedPages]);

  useEffect(() => {
    if (currentReadBook?.result?.html) {
      if (!pagesContent.includes(currentReadBook.result.html)) {
        setPagesContent((prev) => {
          if (page && page < featurePageFromServer) {
            return [currentReadBook.result.html, ...prev]; // Добавляем страницу перед текущим содержимым
          }
          return [...prev, currentReadBook.result.html]; // Добавляем страницу в конец
        });
        setLoadedPages((prev) => new Set(prev.add(page!)));
      }

      // Обновляем totalPages, если оно изменилось
      if (currentReadBook.result.totalPages !== prevTotalPages.current) {
        setTotalPages(currentReadBook.result.totalPages);
        prevTotalPages.current = currentReadBook.result.totalPages;
      }
    }
  }, [currentReadBook, page, pagesContent]);

  const handleNext = () => {
    setPage((prevPage) => (prevPage !== null ? prevPage + 1 : 1));
  };

  const handlePrev = () => {
    setPage((prevPage) =>
      prevPage !== null && prevPage > 1 ? prevPage - 1 : 1
    );
  };

  return (
    // <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
    <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
      <Reading
        pagesContent={pagesContent}
        totalPages={totalPages}
        isLoading={isLoading}
        onNext={handleNext}
        onPrev={handlePrev}
        featurePageFromServer={featurePageFromServer}
      />
    </div>
  );
};

export default ReadingContainer;
