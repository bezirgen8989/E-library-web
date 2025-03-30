import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import {
  clearBooks,
  getAuthorsBooks,
  getBookById,
  getNameByAuthorId,
  getNewBooks,
} from "../slices/home";
import { routes } from "../routing";
import { useHistory, useParams } from "react-router-dom";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";

const AuthorBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Extract id from URL
  const { id } = useParams<{ id: string }>();

  const { authorsName, authorBooks, isLoading } = useLazySelector(
    ({ home }) => {
      const { authorsName, authorBooks } = home;
      return {
        authorsName,
        authorBooks,
        isLoading: authorBooks.isLoading,
      };
    }
  );

  const limit = 12;

  const hasMoreBooks =
    (authorBooks?.result?.total || 0) >
    (authorBooks?.result?.data?.length || 0);

  const authorFilter = `[author.id][in]=${id}`;

  const getBook = useCallback(
    (id) => {
      dispatch(getBookById(id.toString()));
      history.push(`${routes.book}/${id}`);
    },
    [dispatch, history]
  );

  useEffect(() => {
    dispatch(clearBooks());
    dispatch(
      getAuthorsBooks({
        limit: "12",
        page: "1",
        order: null,
        filter: authorFilter,
      })
    );
  }, [dispatch, authorFilter]);

  const loadMoreBooks = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      await dispatch(
        getNewBooks({
          limit: limit.toString(),
          page: nextPage.toString(),
          order: null,
          filter: authorFilter,
        })
      );
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more books:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
      onLoadMore={hasMoreBooks ? loadMoreBooks : undefined}
      isLoadingMore={loadingMore}
      hasMoreBooks={hasMoreBooks}
      isLoading={isLoading}
    />
  );
};

export default AuthorBooksContainer;
