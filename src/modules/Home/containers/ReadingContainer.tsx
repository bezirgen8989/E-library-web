import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Reading } from "../components";
import { clearBooks, getReadBook } from "../slices/home";
import { useDispatch } from "react-redux";
import { useLazySelector } from "../../../hooks";

const ReadingContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch();

  const { currentReadBook, isLoading } = useLazySelector(({ home }) => {
    const { currentReadBook } = home;
    const { isLoading } = currentReadBook;
    return { currentReadBook, isLoading };
  });

  useEffect(() => {
    dispatch(clearBooks());
  }, []);

  useEffect(() => {
    const unlisten = history.listen((location) => {
      if (!location.pathname.startsWith("/reading")) {
        sessionStorage.removeItem("selectedLanguage");
      }
    });

    return () => {
      unlisten();
    };
  }, [history]);

  useEffect(() => {
    const langId = sessionStorage.getItem("selectedLanguage") || "7";
    dispatch(getReadBook({ bookId: id, langId: langId, page: "5" }));
  }, [id]);

  return <Reading currentReadBook={currentReadBook} isLoading={isLoading} />;
};

export default ReadingContainer;
