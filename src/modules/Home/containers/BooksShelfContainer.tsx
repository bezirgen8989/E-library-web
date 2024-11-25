import { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { logoutUser } from "core/session/slices/session";
import { BooksShelfComponent } from "modules/Home/components";
import { getNewBooks, getSuggestedBooks, getTopBooks } from "../slices/home";
import { UserContext } from "../../../core/contexts";
import { useHistory } from "react-router-dom";
import { routes } from "../routing";

const BookShelfContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);
  const habitsCategories = value?.readingHabits
    .map((genre: { id: string; name: string; colour: string }) => genre.id)
    .join(",");

  const { topBooks, newBooks, suggestedBooks } = useLazySelector(({ home }) => {
    const { topBooks, newBooks, suggestedBooks } = home;
    return {
      topBooks,
      newBooks,
      suggestedBooks,
    };
  });

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const getBook = useCallback((id) => {
    history.push(`${routes.book}/${id}`);
  }, []);

  // const topFilter = "[reviewCount][gte]=50"
  const suggestedFilter = `[categories.id][in]=${habitsCategories}`;
  const dateOrder = "[dateAdded]=desc";
  const ratingOrder = "[rating]=desc";

  useEffect(() => {
    dispatch(
      getTopBooks({
        limit: "3",
        page: "1",
        order: "",
        // filter: topFilter,
        filter: "",
      })
    );
    dispatch(
      getNewBooks({
        limit: "6",
        page: "1",
        order: dateOrder,
        filter: null,
      })
    );
  }, []);
  useEffect(() => {
    dispatch(
      getSuggestedBooks({
        limit: "6",
        page: "1",
        order: ratingOrder,
        filter: suggestedFilter,
      })
    );
  }, [suggestedFilter]);

  return (
    <BooksShelfComponent
      getBook={getBook}
      topBooks={topBooks?.result?.data}
      newBooks={newBooks?.result?.data}
      suggestedBooks={suggestedBooks?.result?.data}
      onLogout={handleLogout}
    />
  );
};

export default BookShelfContainer;
