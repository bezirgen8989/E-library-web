import { useDispatch } from "react-redux";
import SearchComponent from "../components/components/SearchBookComponent/SearchComponent";
import { useCallback, useEffect } from "react";
import { getCategories } from "../../Auth/slices/auth";
import { useLazySelector } from "../../../hooks";
import routes from "../routing/routes";
import { useHistory } from "react-router-dom";
import { setCurrentCategoryId } from "../slices/home";

const SearchContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { categories } = useLazySelector(({ auth }) => {
    const { categories } = auth;
    return {
      categories,
    };
  });

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const getBooksByCategory = useCallback((id) => {
    dispatch(setCurrentCategoryId(id));
    history.push(`${routes.searchBooks}/${id}`);
  }, []);

  return (
    <SearchComponent
      categoriesData={categories?.result?.data}
      getBooksByCategory={getBooksByCategory}
    />
  );
};

export default SearchContainer;
