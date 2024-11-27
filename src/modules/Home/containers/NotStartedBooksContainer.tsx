import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { getNotStartedBooks } from "../slices/home";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../core/contexts";

const NotStartedBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);

  const { notStartedBooks, isNotStartedBooksLoading } = useLazySelector(
    ({ home }) => {
      const { startedBooks, finishedBooks, notStartedBooks } = home;
      const { isLoading: isNotStartedBooksLoading } = notStartedBooks;
      return {
        startedBooks,
        notStartedBooks,
        finishedBooks,
        isNotStartedBooksLoading,
      };
    }
  );

  const notStartedBooksList = notStartedBooks?.result?.data.map((item: any) => {
    return {
      ...item.book,
      isBookshelfNotStarted: true,
    };
  });

  const getBook = useCallback((id) => {
    history.push(`${routes.book}/${id}`);
  }, []);

  const favouriteFilter = "[readingState][eq]=added";

  useEffect(() => {
    if (value?.id) {
      const userIdFilter = `[user.id][eq]=${value.id}`;
      dispatch(
        getNotStartedBooks({
          limit: "12",
          page: "1",
          order: "",
          filter: favouriteFilter,
          userFilter: userIdFilter,
        })
      );
    }
  }, [value?.id, dispatch]);

  return (
    <BooksComponent
      books={notStartedBooksList}
      getBook={getBook}
      title="Not started"
      isLoading={isNotStartedBooksLoading}
    />
  );
};

export default NotStartedBooksContainer;
