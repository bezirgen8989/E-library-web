import { useDispatch } from "react-redux";
import SearchComponent from "../components/components/SearchComponent/SearchComponent";
import { useCallback, useEffect } from "react";
import { getCategories } from "../../Auth/slices/auth";
import { useLazySelector } from "../../../hooks";
import routes from "../routing/routes";
import { useHistory } from "react-router-dom";
import { findBooks, setCurrentCategoryId } from "../slices/home";

const SearchContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { categories } = useLazySelector(({ auth }) => {
    const { categories } = auth;
    return {
      categories,
    };
  });

  const { searchBooks } = useLazySelector(({ home }) => {
    const { searchBooks } = home;
    return { searchBooks };
  });

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const getBooksByCategory = useCallback((id) => {
    dispatch(setCurrentCategoryId(id));
    history.push(`${routes.searchBooks}/${id}`);
  }, []);

  const getSearchBooks = useCallback((text) => {
    dispatch(findBooks(text));
  }, []);

  return (
    <SearchComponent
      categoriesData={categories?.result?.data}
      getBooksByCategory={getBooksByCategory}
      getSearchBooks={getSearchBooks}
      searchBooks={searchBooks?.result}
    />
  );
};

export default SearchContainer;
