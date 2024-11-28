import { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { logoutUser } from "core/session/slices/session";
import { Home } from "modules/Home/components";
import { getNewBooks, getSuggestedBooks, getTopBooks } from "../slices/home";
import { UserContext } from "../../../core/contexts";
import { useHistory } from "react-router-dom";
import { routes } from "../routing";
import { clearBooks } from "../slices/home"; // Import the clearNewBooks action

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

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const getBook = useCallback((id) => {
    history.push(`${routes.book}/${id}`);
  }, []);

  const suggestedFilter = `[categories.id][in]=${habitsCategories}`;
  // const ratingOrder = "[rating]=desc";

  useEffect(() => {
    dispatch(clearBooks());
    dispatch(
      getTopBooks({
        limit: "3",
        page: "1",
        order: "",
        filter: "",
      })
    );
    dispatch(
      getNewBooks({
        limit: "6",
        page: "1",
        order: "[dateAdded]=desc",
        filter: null,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getSuggestedBooks({
        limit: "6",
        page: "1",
        order: "",
        filter: suggestedFilter,
      })
    );
  }, [dispatch, suggestedFilter]);

  return (
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
  );
};

export default HomeContainer;
