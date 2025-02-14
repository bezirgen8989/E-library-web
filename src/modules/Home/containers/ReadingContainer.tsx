import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { Reading } from "../components";
import {
  addToShelf,
  clearBooks,
  getBookshelfById,
  getReadBook,
  setReadingBook,
} from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
import { UserContext } from "../../../core/contexts";
import { SetReadingBookPayload } from "../slices/home/types";

const ReadingContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const value = useContext(UserContext);
  const dispatch = useDispatch();

  const [page, setPage] = useState<number | null>(null);
  const [pagesContent, setPagesContent] = useState<string[]>([]);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [totalPages, setTotalPages] = useState<number>(0);
  const prevTotalPages = useRef<number>(0);
  const [maxLoadPage, setMaxLoadPage] = useState<number>(0);
  const [featurePageFromServer, setFeaturePageFromServer] = useState<
    number | null
  >(null);

  const { currentReadBook, isLoading, currentBookshelfBook } = useLazySelector(
    ({ home }) => ({
      currentReadBook: home.currentReadBook,
      isLoading: home.currentReadBook.isLoading,
      currentBookshelfBook: home.currentBookshelfBook,
    })
  );

  useEffect(() => {
    const fetchBookshelfData = async () => {
      if (value?.id && id) {
        try {
          await dispatch(
            addToShelf({
              user: { id: +value.id },
              book: { id: +id },
              isFavourited: true,
              readingState: "added",
            })
          );
          await dispatch(
            getBookshelfById({
              userId: +value.id,
              bookId: +id,
            })
          );
        } catch (error) {
          console.error(
            "Error adding to shelf or fetching bookshelf data:",
            error
          );
        }
      }
    };

    fetchBookshelfData();
  }, [dispatch, value?.id, id]);

  useEffect(() => {
    if (currentBookshelfBook?.result) {
      const { readingState, lastPage } = currentBookshelfBook.result;

      if (readingState === "added") {
        setFeaturePageFromServer(1);
      } else if (readingState === "reading" && lastPage) {
        setFeaturePageFromServer(lastPage);
      }
    }
  }, [currentBookshelfBook]);

  useEffect(() => {
    dispatch(clearBooks());
    setPagesContent([]);
    setLoadedPages(new Set());
    setTotalPages(0);
    prevTotalPages.current = 0;

    setPage(featurePageFromServer);
  }, [dispatch, id, featurePageFromServer]);

  useEffect(() => {
    const langId = sessionStorage.getItem("selectedLanguageId") || "7";

    if (page !== null && !loadedPages.has(page)) {
      dispatch(getReadBook({ bookId: id, langId, page: page.toString() }));
    }
  }, [id, dispatch, page, loadedPages]);

  useEffect(() => {
    if (currentReadBook?.result?.html) {
      if (!pagesContent.includes(currentReadBook.result.html)) {
        setPagesContent((prev) => {
          if (page && page < featurePageFromServer!) {
            return [currentReadBook.result.html, ...prev];
          }
          return [...prev, currentReadBook.result.html];
        });
        setLoadedPages((prev) => new Set(prev.add(page!)));
      }

      if (currentReadBook.result.totalPages !== prevTotalPages.current) {
        setTotalPages(currentReadBook.result.totalPages);
        prevTotalPages.current = currentReadBook.result.totalPages;
      }
    }
  }, [currentReadBook, page, pagesContent, featurePageFromServer]);

  const handleNext = () => {
    setPage((prevPage) => (prevPage !== null ? prevPage + 1 : 1));
  };

  const handlePrev = () => {
    setPage((prevPage) =>
      prevPage !== null && prevPage > 1 ? prevPage - 1 : 1
    );
  };

  const saveProgress = () => {
    if (value?.id && id) {
      const payload: SetReadingBookPayload = {
        user: { id: +value.id },
        book: { id: +id },
        lastPage: maxLoadPage,
        progress: totalPages > 0 ? (maxLoadPage / totalPages) * 100 : 0,
        readingState: "reading",
      };

      dispatch(setReadingBook(payload));
    }
  };

  useEffect(() => {
    const handleLeave = () => {
      if (!location.pathname.includes("reading")) {
        saveProgress();
        setFeaturePageFromServer(null);
        dispatch(clearBooks());
      }
    };

    return handleLeave;
  }, [location.pathname, maxLoadPage]);

  return (
    <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
      <Reading
        pagesContent={pagesContent}
        totalPages={totalPages}
        isLoading={isLoading}
        onNext={handleNext}
        onPrev={handlePrev}
        featurePageFromServer={featurePageFromServer}
        maxLoadPage={maxLoadPage}
        setMaxLoadPage={setMaxLoadPage}
      />
    </div>
  );
};

export default ReadingContainer;
