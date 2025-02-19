import React, { useEffect, useState } from "react";
import { AudioBookComponent } from "../components";
import { getAudioBook, getBookById, getBookVersion } from "../slices/home";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";
// import {getLanguages} from "../../Auth/slices/auth";

const AudioBookContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

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

  return (
    <AudioBookComponent
      currentAudioBook={currentAudioBook}
      setCurrentPage={setCurrentPage}
      currentBookVersion={currentBookVersion}
      book={currentBook}
      currentPage={currentPage}
    />
  );
};

export default AudioBookContainer;
