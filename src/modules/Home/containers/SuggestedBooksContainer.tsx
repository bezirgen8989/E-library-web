import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { getBookById, getTopBooks } from "../slices/home";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";

const SuggestedBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { suggestedBooks } = useLazySelector(({ home }) => {
    const { suggestedBooks } = home;
    return {
      suggestedBooks,
    };
  });

  // const topFilter = "[reviewCount][gte]=50"

  const getBook = useCallback((id) => {
    dispatch(getBookById(id.toString()));
    history.push(`${routes.book}/${id}`);
  }, []);

  useEffect(() => {
    dispatch(
      getTopBooks({
        limit: "20",
        page: "1",
        order: "",
        // filter: topFilter,
        filter: "",
      })
    );
  }, []);

  return (
    <BooksComponent
      books={suggestedBooks?.result?.data}
      getBook={getBook}
      title="Suggested for You"
    />
  );
};

export default SuggestedBooksContainer;
