import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { logoutUser } from "core/session/slices/session";
import { Home } from "modules/Home/components";
import { getNewBooks, getSuggestedBooks, getTopBooks } from "../slices/home";
import { UserContext } from "../../../core/contexts";
import { useHistory } from "react-router-dom";
import { routes } from "../routing";
import { clearBooks } from "../slices/home";

const HomeContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);
  const habitsCategories = value?.readingHabits
    .map((genre: { id: string; name: string; colour: string }) => genre.id)
    .join(",");

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
  console.log("VALUE", value?.language?.id);

  const authState = useLazySelector(({ auth }) => {
    return auth;
  });

  const [loadingKidsMode, setLoadingKidsMode] = useState(true);

  useEffect(() => {
    if (authState.userData?.result?.kidsMode !== undefined) {
      setLoadingKidsMode(false);
    }
  }, [authState.userData?.result?.kidsMode]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const getBook = useCallback((id) => {
    history.push(`${routes.book}/${id}`);
  }, []);

  const isAgeRestricted =
    authState.userData.result?.kidsMode && `[isAgeRestricted][eq]=false`;

  const suggestedFilter = `[categories.id][in]=${habitsCategories}&filter${
    isAgeRestricted ? isAgeRestricted : ""
  }`;
  const getBooksFilter = authState.userData.result?.kidsMode
    ? "filter[isAgeRestricted][eq]=false"
    : false;
  console.log("suggestedFilter", suggestedFilter);
  useEffect(() => {
    if (!loadingKidsMode) {
      dispatch(clearBooks());
      dispatch(
        getTopBooks({
          limit: "3",
          page: "1",
          order: "",
          ...(!!getBooksFilter && { filter: getBooksFilter.toString() }),
        })
      );
      dispatch(
        getNewBooks({
          limit: "6",
          page: "1",
          order: "[dateAdded]=desc",
          ...(!!getBooksFilter && { filter: getBooksFilter.toString() }),
        })
      );
    }
  }, [dispatch, loadingKidsMode]);

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
  }, [dispatch, suggestedFilter]);

  return (
    <>
      <Home
        getBook={getBook}
        topBooks={topBooks?.result?.data}
        newBooks={newBooks?.result?.data}
        suggestedBooks={suggestedBooks?.result?.data}
        onLogout={handleLogout}
        isTopBooksLoading={isTopBooksLoading}
        isNewBooksLoading={isNewBooksLoading}
        isSuggestedBooksLoading={isSuggestedBooksLoading}
      />
    </>
  );
};

export default HomeContainer;
