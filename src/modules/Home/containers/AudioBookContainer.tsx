import React, { useEffect, useState, useContext } from "react";
import { AudioBookComponent } from "../components";
import {
  addToShelf,
  getAudioBook,
  getBookById,
  getBookshelfById,
  getBookVersion,
  setReadingBook,
} from "../slices/home";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
import { UserContext } from "../../../core/contexts";
import { SetReadingBookPayload } from "../slices/home/types";
import { getLocalization } from "../../Auth/slices/auth";
// import {getLanguages} from "../../Auth/slices/auth";

const AudioBookContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const value = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (value?.language?.isoCode2char) {
      dispatch(getLocalization(value?.language?.isoCode2char));
    }
  }, [dispatch, value?.language?.isoCode2char]);

  const { currentAudioBook, currentBookVersion, currentBook } = useLazySelector(
    ({ home }) => ({
      currentAudioBook: home.currentAudioBook,
      currentBookVersion: home.currentBookVersion,
      currentBook: home.currentBook,
    })
  );
  const [currentPage, setCurrentPage] = useState("1");
  console.log("currentAudioBook", currentAudioBook);
  console.log("currentBookVersion", currentBookVersion);
  console.log("currentBook", currentBook);

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
    dispatch(
      getBookVersion({
        page: "1",
        limit: "1",
        filterLanguage: `[language.id][eq]=7`,
        filterId: `[coreBook.id][eq]=${id}`,
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getBookById(id.toString()));
  }, [dispatch]);

  useEffect(() => {
    const langId = sessionStorage.getItem("selectedLanguageId") || "7";
    dispatch(getAudioBook({ bookId: id, langId, page: currentPage }));
  }, [id, dispatch, currentPage]);
  const [maxLoadPage, setMaxLoadPage] = useState<number>(0);
  const saveProgress = () => {
    if (value?.id && id) {
      const totalPages = currentBookVersion?.result?.data?.[0]?.totalPages;
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
      }
    };

    return handleLeave;
  }, [location.pathname, maxLoadPage]);

  return (
    <AudioBookComponent
      currentAudioBook={currentAudioBook}
      setCurrentPage={setCurrentPage}
      currentBookVersion={currentBookVersion}
      book={currentBook}
      currentPage={currentPage}
      setMaxLoadPage={setMaxLoadPage}
    />
  );
};

export default AudioBookContainer;
