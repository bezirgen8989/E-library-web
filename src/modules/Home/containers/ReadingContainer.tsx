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

  const { currentReadBook, isLoading } = useLazySelector(({ home }) => {
    return {
      currentReadBook: home.currentReadBook,
      isLoading: home.currentReadBook.isLoading,
    };
  });

  useEffect(() => {
    dispatch(clearBooks());
  }, [dispatch]);

  useEffect(() => {
    const langId = sessionStorage.getItem("selectedLanguage") || "7";
    dispatch(getReadBook({ bookId: id, langId, page: page.toString() }));
  }, [id, dispatch, page]);

  // Обработчик для загрузки следующей страницы
  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Обработчик для загрузки предыдущей страницы
  const handlePrev = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  return (
    <div style={{ maxHeight: "90vh", overflowY: "auto" }}>
      <Reading
        currentReadBook={currentReadBook}
        isLoading={isLoading}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default ReadingContainer;
