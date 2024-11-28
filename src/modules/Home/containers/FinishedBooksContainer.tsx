import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { clearBooks, getFinishedBooks } from "../slices/home";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../core/contexts";

const FinishedBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const { finishedBooks, isLoading } = useLazySelector(({ home }) => {
    const { finishedBooks } = home;
    return {
      finishedBooks,
      isLoading: finishedBooks.isLoading,
    };
  });

  const limit = 6;

  const hasMoreBooks =
    (finishedBooks?.result?.total || 0) >
    (finishedBooks?.result?.data?.length || 0);

  const finishedBooksList = finishedBooks?.result?.data.map((item: any) => {
    return {
      ...item.book,
      dateFinished: item.dateFinished,
      isBookshelfFinished: true,
    };
  });

  const getBook = useCallback((id) => {
    history.push(`${routes.book}/${id}`);
  }, []);

  const finishedFilter = "[readingState][eq]=finished";

  useEffect(() => {
    dispatch(clearBooks());
    if (value?.id) {
      const userIdFilter = `[user.id][eq]=${value.id}`;
      dispatch(
        getFinishedBooks({
          limit: limit.toString(),
          page: "1",
          order: "",
          filter: finishedFilter,
          userFilter: userIdFilter,
        })
      );
    }
  }, [value?.id, dispatch, finishedFilter]);

  const loadMoreBooks = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const userIdFilter = `[user.id][eq]=${value.id}`;
    try {
      await dispatch(
        getFinishedBooks({
          limit: limit.toString(),
          page: nextPage.toString(),
          order: "",
          filter: finishedFilter,
          userFilter: userIdFilter,
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
      books={finishedBooksList}
      getBook={getBook}
      title="Finished"
      onLoadMore={hasMoreBooks ? loadMoreBooks : undefined}
      isLoadingMore={loadingMore}
      hasMoreBooks={hasMoreBooks}
      isLoading={isLoading}
    />
  );
};

export default FinishedBooksContainer;
