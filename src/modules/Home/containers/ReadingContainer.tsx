import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Reading } from "../components";
import { getReadBook } from "../slices/home";
import { useDispatch } from "react-redux";

const ReadingContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch();

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
    const langId = sessionStorage.getItem("selectedLanguage");
    console.log("BOOK_ID", id);
    console.log("LANG_ID", langId);
    dispatch(getReadBook({ bookId: id, langId: langId, page: "1" }));
  }, [id]);

  return <Reading />;
};

export default ReadingContainer;
