import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { logoutUser } from "core/session/slices/session";
import { Home } from "modules/Home/components";
import {
  getNewBooks,
  getSuggestedBooks,
  getTopBooks,
  clearBooks,
} from "../slices/home";
import { UserContext } from "../../../core/contexts";
import { useHistory } from "react-router-dom";
import { routes } from "../routing";

const HomeContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);

  const habitsCategories = useMemo(
    () =>
      value?.readingHabits
        ?.map((genre: { id: string; name: string; colour: string }) => genre.id)
        .join(","),
    [value?.readingHabits]
  );

  const {
    topBooks,
    newBooks,
    suggestedBooks,
    isTopBooksLoading,
    isNewBooksLoading,
    isSuggestedBooksLoading,
  } = useLazySelector(({ home }) => {
    const { topBooks, newBooks, suggestedBooks } = home;
    const { isLoading: isTopBooksLoading } = topBooks;
    const { isLoading: isNewBooksLoading } = newBooks;
    const { isLoading: isSuggestedBooksLoading } = suggestedBooks;
    return {
      topBooks,
      newBooks,
      suggestedBooks,
      isTopBooksLoading,
      isNewBooksLoading,
      isSuggestedBooksLoading,
    };
  });

  const authState = useLazySelector(({ auth }) => auth);

  const [loadingKidsMode, setLoadingKidsMode] = useState(true);

  useEffect(() => {
    if (authState.userData?.result?.kidsMode !== undefined) {
      setLoadingKidsMode(false);
    }
  }, [authState.userData?.result?.kidsMode]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const getBook = useCallback(
    (id: string) => {
      history.push(`${routes.book}/${id}`);
    },
    [history]
  );

  const isAgeRestricted = useMemo(
    () =>
      authState.userData?.result?.kidsMode ? "[isAgeRestricted][eq]=false" : "",
    [authState.userData?.result?.kidsMode]
  );

  const suggestedFilter = useMemo(() => {
    if (!habitsCategories) return "";
    return `[categories.id][in]=${habitsCategories}&filter${
      isAgeRestricted ? isAgeRestricted : ""
    }`;
  }, [habitsCategories, isAgeRestricted]);

  const getBooksFilter = useMemo(
    () =>
      authState.userData?.result?.kidsMode
        ? "filter[isAgeRestricted][eq]=false"
        : "",
    [authState.userData?.result?.kidsMode]
  );

  useEffect(() => {
    if (!loadingKidsMode) {
      dispatch(clearBooks());
      dispatch(
        getTopBooks({
          limit: "3",
          page: "1",
          order: "",
          ...(getBooksFilter && { filter: getBooksFilter }),
        })
      );
      dispatch(
        getNewBooks({
          limit: "6",
          page: "1",
          order: "[dateAdded]=desc",
          ...(getBooksFilter && { filter: getBooksFilter }),
        })
      );
    }
  }, [dispatch, loadingKidsMode, getBooksFilter]);

  useEffect(() => {
    if (habitsCategories) {
      dispatch(
        getSuggestedBooks({
          limit: "6",
          page: "1",
          order: "",
          filter: suggestedFilter,
        })
      );
    }
  }, [dispatch, habitsCategories, suggestedFilter]);

  const memoizedTopBooks = useMemo(
    () => topBooks?.result?.data,
    [topBooks?.result?.data]
  );
  const memoizedNewBooks = useMemo(
    () => newBooks?.result?.data,
    [newBooks?.result?.data]
  );
  const memoizedSuggestedBooks = useMemo(
    () => suggestedBooks?.result?.data,
    [suggestedBooks?.result?.data]
  );

  return (
    <Home
      getBook={getBook}
      topBooks={memoizedTopBooks}
      newBooks={memoizedNewBooks}
      suggestedBooks={memoizedSuggestedBooks}
      onLogout={handleLogout}
      isTopBooksLoading={isTopBooksLoading}
      isNewBooksLoading={isNewBooksLoading}
      isSuggestedBooksLoading={isSuggestedBooksLoading}
    />
  );
};

export default HomeContainer;
