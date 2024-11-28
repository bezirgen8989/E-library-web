import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { logoutUser } from "core/session/slices/session";
import {
  clearBooks,
  getNewBooks,
  getSuggestedBooks,
  getTopBooks,
  setCurrentCategoryId,
} from "../slices/home";
import { useHistory, useParams } from "react-router-dom";
import { routes } from "../routing";
import { SearchBooks } from "../components";
import { getCategories } from "../../Auth/slices/auth";

const SearchBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { id } = useParams<{ id: string }>();

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
  const { categories } = useLazySelector(({ auth }) => {
    const { categories } = auth;
    return {
      categories,
    };
  });

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const getBook = useCallback((id) => {
    history.push(`${routes.book}/${id}`);
  }, []);

  // const topFilter = "[reviewCount][gte]=50"
  const searchFilter = `[categories.id][in]=${id}`;
  const dateOrder = "[dateAdded]=desc";
  const ratingOrder = "[rating]=desc";

  useEffect(() => {
    dispatch(clearBooks());
    dispatch(
      getTopBooks({
        limit: "6",
        page: "1",
        order: "",
        // filter: topFilter,
        filter: searchFilter,
      })
    );
    dispatch(
      getNewBooks({
        limit: "6",
        page: "1",
        order: dateOrder,
        filter: searchFilter,
      })
    );
  }, [searchFilter]);
  useEffect(() => {
    dispatch(
      getSuggestedBooks({
        limit: "6",
        page: "1",
        order: ratingOrder,
        filter: searchFilter,
      })
    );
  }, [searchFilter]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(setCurrentCategoryId(id));
  }, []);

  return (
    <SearchBooks
      getBook={getBook}
      topBooks={topBooks?.result?.data}
      newBooks={newBooks?.result?.data}
      suggestedBooks={suggestedBooks?.result?.data}
      onLogout={handleLogout}
      searchId={id}
      categories={categories?.result?.data}
      isTopBooksLoading={isTopBooksLoading}
      isNewBooksLoading={isNewBooksLoading}
      isSuggestedBooksLoading={isSuggestedBooksLoading}
    />
  );
};

export default SearchBooksContainer;
