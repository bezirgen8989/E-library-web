import { useDispatch } from "react-redux";
import SearchComponent from "../components/components/SearchBookComponent/SearchComponent";
import { useEffect } from "react";
import { getCategories } from "../../Auth/slices/auth";
import { useLazySelector } from "../../../hooks";

const SearchContainer: React.FC = () => {
  const dispatch = useDispatch();

  const { categories } = useLazySelector(({ auth }) => {
    const { categories, habits } = auth;
    return {
      categories,
      habits,
    };
  });

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return <SearchComponent categoriesData={categories?.result?.data} />;
};

export default SearchContainer;
