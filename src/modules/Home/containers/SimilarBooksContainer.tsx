import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { clearBooks, getBookById, getSimilarBooks } from "../slices/home";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";

const SimilarBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const value = useContext(UserContext);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const { similarBooks, isLoading, currentBook } = useLazySelector(
    ({ home }) => {
      const { similarBooks, currentBook } = home;
      return {
        similarBooks,
        currentBook,
        isLoading: similarBooks.isLoading,
      };
    }
  );

  const limit = 6;

  const hasMoreBooks =
    (similarBooks?.result?.total || 0) >
    (similarBooks?.result?.data?.length || 0);
  const habitsCategories = currentBook?.result?.categories
    .map((genre: { id: string; name: string; colour: string }) => genre.id)
    .join(",");

  console.log("habitsCategories Lis", habitsCategories);

  // const dateOrder = "[dateAdded]=desc";
  const suggestedFilter = `[categories.id][in]=${habitsCategories}`;
  const ratingOrder = "[rating]=desc";

  const getBook = useCallback((id) => {
    dispatch(getBookById(id.toString()));
    history.push(`${routes.book}/${id}`);
  }, []);

  useEffect(() => {
    dispatch(clearBooks());
    dispatch(
      getSimilarBooks({
        limit: limit.toString(),
        page: "1",
        order: ratingOrder,
        filter: suggestedFilter,
      })
    );
  }, [dispatch, suggestedFilter]);

  const loadMoreBooks = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      await dispatch(
        getSimilarBooks({
          limit: limit.toString(),
          page: nextPage.toString(),
          order: ratingOrder,
          filter: suggestedFilter,
        })
      );
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more books:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <BooksComponent
      books={similarBooks?.result?.data}
      getBook={getBook}
      title="Similar books"
      onLoadMore={hasMoreBooks ? loadMoreBooks : undefined}
      isLoadingMore={loadingMore}
      hasMoreBooks={hasMoreBooks}
      isLoading={isLoading}
    />
  );
};

export default SimilarBooksContainer;
