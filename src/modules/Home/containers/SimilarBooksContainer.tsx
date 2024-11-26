import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { getBookById, getNewBooks } from "../slices/home";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";

const SimilarBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { similarBooks, isLoading } = useLazySelector(({ home }) => {
    const { similarBooks } = home;
    const { isLoading } = similarBooks;
    return {
      similarBooks,
      isLoading,
    };
  });

  const dateOrder = "[dateAdded]=desc";

  const getBook = useCallback((id) => {
    dispatch(getBookById(id.toString()));
    history.push(`${routes.book}/${id}`);
  }, []);

  useEffect(() => {
    dispatch(
      getNewBooks({
        limit: "20",
        page: "1",
        order: dateOrder,
        filter: null,
      })
    );
  }, []);

  return (
    <BooksComponent
      books={similarBooks?.result?.data}
      getBook={getBook}
      title="Similar books"
      isLoading={isLoading}
    />
  );
};

export default SimilarBooksContainer;
