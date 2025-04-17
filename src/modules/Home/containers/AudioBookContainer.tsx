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

const AudioBookContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const value = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (value?.language?.isoCode2char) {
      dispatch(getLocalization(value?.language?.isoCode2char));
    }
  }, [dispatch, value?.language?.isoCode2char]);

  const {
    currentAudioBook,
    currentBookVersion,
    currentBook,
    currentBookshelfBook,
  } = useLazySelector(({ home }) => ({
    currentAudioBook: home.currentAudioBook,
    currentBookVersion: home.currentBookVersion,
    currentBook: home.currentBook,
    currentBookshelfBook: home.currentBookshelfBook,
  }));
  const [currentPage, setCurrentPage] = useState("1");
  const [maxLoadPage, setMaxLoadPage] = useState<number>(1);
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);

  useEffect(() => {
    const fetchAudioBook = async () => {
      if (id) {
        setIsFetchingAudio(true);
        try {
          await dispatch(
            getAudioBook({ bookId: id, langId, page: currentPage })
          );
        } catch (error) {
          console.error("Error fetching audio book:", error);
        } finally {
          setIsFetchingAudio(false);
        }
      }
    };

    fetchAudioBook();
  }, [id, dispatch, currentPage]);

  useEffect(() => {
    if (currentBookshelfBook?.result?.lastPage) {
      setCurrentPage(currentBookshelfBook.result.lastPage.toString());
      setMaxLoadPage(currentBookshelfBook.result.lastPage);
    }
  }, [currentBookshelfBook?.result?.lastPage]);

  useEffect(() => {
    const fetchBookshelfData = async () => {
      if (value?.id && id) {
        try {
          if (currentBook?.result?.isReading === false) {
            await dispatch(
              addToShelf({
                user: { id: +value.id },
                book: { id: +id },
                isFavourited: true,
                readingState: "added",
              })
            );
          }

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

  const currentBookLang: any = sessionStorage.getItem("currentBookLanguage");
  const parseLang = JSON.parse(currentBookLang);
  const langId = parseLang?.id || value?.bookLanguage?.id || "7";

  useEffect(() => {
    dispatch(
      getBookVersion({
        page: "1",
        limit: "1",
        filterLanguage: `[language.id][eq]=${langId}`,
        filterId: `[coreBook.id][eq]=${id}`,
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getBookById(id.toString()));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAudioBook({ bookId: id, langId, page: currentPage }));
  }, [id, dispatch, currentPage]);

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
  //   if (prevTotalPages?.current <= 0) {
  //     return;
  //   }

  useEffect(() => {
    const handleLeave = () => {
      if (!location.pathname.includes("audio_book")) {
        saveProgress();
        sessionStorage.removeItem("currentBookLanguage");
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
      isFetchingAudio={isFetchingAudio}
      aiTotalPages={currentAudioBook?.result?.totalPages}
    />
  );
};

export default AudioBookContainer;
