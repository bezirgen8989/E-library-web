import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import {
  getAuthorsBooks,
  getBookById,
  getNameByAuthorId,
} from "../slices/home";
import { routes } from "../routing";
import { useHistory, useParams } from "react-router-dom";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";

const AuthorBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Extract id from URL
  const { id } = useParams<{ id: string }>();

  const { authorsName, authorBooks } = useLazySelector(({ home }) => {
    const { authorsName, authorBooks } = home;
    return {
      authorsName,
      authorBooks,
    };
  });

  const authorFilter = `[author.id][in]=${id}`;

  const getBook = useCallback(
    (id) => {
      dispatch(getBookById(id.toString()));
      history.push(`${routes.book}/${id}`);
    },
    [dispatch, history]
  );

  useEffect(() => {
    dispatch(
      getAuthorsBooks({
        limit: "12",
        page: "1",
        order: null,
        filter: authorFilter,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getNameByAuthorId(id)); // Dispatch with id from URL
    }
  }, [dispatch, id]);

  return (
    <BooksComponent
      books={authorBooks?.result?.data}
      getBook={getBook}
      title={authorsName?.result?.name}
    />
  );
};

export default AuthorBooksContainer;
