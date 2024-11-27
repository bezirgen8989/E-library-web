import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { getFinishedBooks } from "../slices/home";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../core/contexts";

const FinishedBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);

  const { finishedBooks, isFinishedBooksLoading } = useLazySelector(
    ({ home }) => {
      const { startedBooks, finishedBooks, notStartedBooks } = home;
      const { isLoading: isFinishedBooksLoading } = finishedBooks;
      return {
        startedBooks,
        notStartedBooks,
        finishedBooks,
        isFinishedBooksLoading,
      };
    }
  );

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
    if (value?.id) {
      const userIdFilter = `[user.id][eq]=${value.id}`;
      dispatch(
        getFinishedBooks({
          limit: "12",
          page: "1",
          order: "",
          filter: finishedFilter,
          userFilter: userIdFilter,
        })
      );
    }
  }, [value?.id, dispatch]);

  return (
    <BooksComponent
      books={finishedBooksList}
      getBook={getBook}
      title="Finished"
      isLoading={isFinishedBooksLoading}
    />
  );
};

export default FinishedBooksContainer;
