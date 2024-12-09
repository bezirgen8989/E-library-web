import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Reading } from "../components";
import { clearBooks, getReadBook } from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";

const ReadingContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pagesContent, setPagesContent] = useState<string[]>([]);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [totalPages, setTotalPages] = useState<number>(0); // State for totalPages
  const prevTotalPages = useRef<number>(0); // To track the previous value of totalPages

  const { currentReadBook, isLoading } = useLazySelector(({ home }) => {
    return {
      currentReadBook: home.currentReadBook,
      isLoading: home.currentReadBook.isLoading,
    };
  });

  useEffect(() => {
    dispatch(clearBooks());
    setPagesContent([]);
    setLoadedPages(new Set());
    setTotalPages(0); // Reset totalPages when the id changes
    prevTotalPages.current = 0; // Reset previous totalPages
  }, [dispatch, id]);

  useEffect(() => {
    const langId = sessionStorage.getItem("selectedLanguage") || "7";

    if (!loadedPages.has(page)) {
      dispatch(getReadBook({ bookId: id, langId, page: page.toString() }));
    }
  }, [id, dispatch, page, loadedPages]);

  useEffect(() => {
    if (currentReadBook?.result?.html) {
      if (!pagesContent.includes(currentReadBook.result.html)) {
        setPagesContent((prev) => [...prev, currentReadBook.result.html]);
        setLoadedPages((prev) => new Set(prev.add(page)));
      }

      // Only update totalPages if it has changed
      if (currentReadBook.result.totalPages !== prevTotalPages.current) {
        setTotalPages(currentReadBook.result.totalPages);
        prevTotalPages.current = currentReadBook.result.totalPages; // Update the ref
      }
    }
  }, [currentReadBook, page, pagesContent]);

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
        totalPages={totalPages}
        isLoading={isLoading}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default ReadingContainer;
