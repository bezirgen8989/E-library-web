import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Reading } from "../components";
import { clearBooks, getReadBook } from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";

const ReadingContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1); // Начальная страница для загрузки
  const [pagesContent, setPagesContent] = useState<string[]>([]); // Массив для хранения страниц

  const { currentReadBook, isLoading } = useLazySelector(({ home }) => {
    return {
      currentReadBook: home.currentReadBook,
      isLoading: home.currentReadBook.isLoading,
    };
  });

  useEffect(() => {
    dispatch(clearBooks());
    setPagesContent([]);
  }, [dispatch, id]);

  useEffect(() => {
    const langId = sessionStorage.getItem("selectedLanguage") || "7";
    dispatch(getReadBook({ bookId: id, langId, page: page.toString() }));
  }, [id, dispatch, page]);

  useEffect(() => {
    if (currentReadBook?.result?.html) {
      setPagesContent((prev) => [...prev, currentReadBook.result.html]);
    }
  }, [currentReadBook]);

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrev = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  return (
    <div style={{ maxHeight: "90vh", overflowY: "auto" }}>
      <Reading
        pagesContent={pagesContent}
        isLoading={isLoading}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default ReadingContainer;
