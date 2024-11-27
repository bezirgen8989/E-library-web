import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { getStartedBooks } from "../slices/home";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../core/contexts";

const StartedBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);

  const { startedBooks, isStartedBooksLoading } = useLazySelector(
    ({ home }) => {
      const { startedBooks, finishedBooks, notStartedBooks } = home;
      const { isLoading: isStartedBooksLoading } = startedBooks;
      return {
        startedBooks,
        notStartedBooks,
        finishedBooks,
        isStartedBooksLoading,
      };
    }
  );

  const startedBooksList = startedBooks?.result?.data.map((item: any) => {
    return {
      ...item.book,
      isBookshelfStarted: true,
    };
  });

  const getBook = useCallback((id) => {
    history.push(`${routes.book}/${id}`);
  }, []);

  const startedFilter = "[readingState][eq]=reading";

  useEffect(() => {
    if (value?.id) {
      const userIdFilter = `[user.id][eq]=${value.id}`;
      dispatch(
        getStartedBooks({
          limit: "12",
          page: "1",
          order: "",
          filter: startedFilter,
          userFilter: userIdFilter,
        })
      );
    }
  }, [value?.id, dispatch]);

  return (
    <BooksComponent
      books={startedBooksList}
      getBook={getBook}
      title="Started"
      isLoading={isStartedBooksLoading}
    />
  );
};

export default StartedBooksContainer;
