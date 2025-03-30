import { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";

import { BooksShelfComponent } from "modules/Home/components";
import {
  clearBooks,
  getFinishedBooks,
  getNotStartedBooks,
  getStartedBooks,
} from "../slices/home";
import { UserContext } from "../../../core/contexts";
import { useHistory } from "react-router-dom";
import { routes } from "../routing";
import { getLocalization } from "../../Auth/slices/auth";

const BookShelfContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);

  const {
    startedBooks,
    finishedBooks,
    notStartedBooks,
    isStartedBooksLoading,
    isNotStartedBooksLoading,
    isFinishedBooksLoading,
  } = useLazySelector(({ home }) => {
    const { startedBooks, finishedBooks, notStartedBooks } = home;
    const { isLoading: isStartedBooksLoading } = startedBooks;
    const { isLoading: isNotStartedBooksLoading } = notStartedBooks;
    const { isLoading: isFinishedBooksLoading } = finishedBooks;
    return {
      startedBooks,
      notStartedBooks,
      finishedBooks,
      isStartedBooksLoading,
      isNotStartedBooksLoading,
      isFinishedBooksLoading,
    };
  });

  const authState = useLazySelector(({ auth }) => {
    return auth;
  });

  useEffect(() => {
    if (value?.language?.isoCode2char) {
      dispatch(getLocalization(value?.language?.isoCode2char));
    }
  }, [dispatch, value?.language?.isoCode2char]);

  const startedBooksList = startedBooks?.result?.data.map((item: any) => {
    return {
      ...item.book,
      isBookshelfStarted: true,
    };
  });
  const notStartedBooksList = notStartedBooks?.result?.data.map((item: any) => {
    return {
      ...item.book,
      isBookshelfNotStarted: true,
    };
  });
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

  const continueReadingBook = useCallback((id) => {
    history.push(`${routes.reading}/${id}`);
  }, []);

  const isAgeRestricted = authState.userData.result?.kidsMode
    ? `filter[book.isAgeRestricted][eq]=0`
    : "";

  const startedFilter = `[readingState][eq]=reading&${isAgeRestricted}`;
  const favouriteFilter = `[readingState][eq]=added&${isAgeRestricted}`;
  const finishedFilter = `[readingState][eq]=finished&${isAgeRestricted}`;
  useEffect(() => {
    dispatch(clearBooks());
  }, []);

  useEffect(() => {
    if (value?.id) {
      const userIdFilter = `[user.id][eq]=${value.id}`;

      const timeoutId = setTimeout(() => {
        dispatch(
          getStartedBooks({
            limit: "6",
            page: "1",
            order: "",
            filter: startedFilter,
            userFilter: userIdFilter,
          })
        );
        dispatch(
          getNotStartedBooks({
            limit: "6",
            page: "1",
            order: "",
            filter: favouriteFilter,
            userFilter: userIdFilter,
          })
        );
        dispatch(
          getFinishedBooks({
            limit: "6",
            page: "1",
            order: "",
            filter: finishedFilter,
            userFilter: userIdFilter,
          })
        );
      }, 500);

      return () => clearTimeout(timeoutId); // Очистка таймера при размонтировании или изменении value.id
    }
  }, [value?.id, dispatch]);

  return (
    <BooksShelfComponent
      getBook={getBook}
      continueReadingBook={continueReadingBook}
      started={startedBooksList}
      notStarted={notStartedBooksList}
      finished={finishedBooksList}
      isStartedBooksLoading={isStartedBooksLoading}
      isNotStartedBooksLoading={isNotStartedBooksLoading}
      isFinishedBooksLoading={isFinishedBooksLoading}
    />
  );
};

export default BookShelfContainer;
