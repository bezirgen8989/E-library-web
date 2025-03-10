import { useDispatch } from "react-redux";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import { useCallback, useContext, useEffect } from "react";
import { getCategories, getLocalization } from "../../Auth/slices/auth";
import { useLazySelector } from "../../../hooks";
import routes from "../routing/routes";
import { useHistory } from "react-router-dom";
import {
  findBooks,
  getBookById,
  getBooksByQueryName,
  setCurrentCategoryId,
} from "../slices/home";
import { UserContext } from "../../../core/contexts";

const SearchContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const value = useContext(UserContext);

  const { categories } = useLazySelector(({ auth }) => {
    const { categories } = auth;
    return {
      categories,
    };
  });

  const { result: localization } = useLazySelector(
    ({ auth }) => auth.appLocalization || {}
  );

  useEffect(() => {
    if (value?.language?.isoCode2char) {
      dispatch(getLocalization(value?.language?.isoCode2char));
    }
  }, [dispatch, value?.language?.isoCode2char]);

  const { searchBooks, booksByQueryName, isLoading } = useLazySelector(
    ({ home }) => {
      const { searchBooks, booksByQueryName } = home;
      const { isLoading } = booksByQueryName;
      return { searchBooks, booksByQueryName, isLoading };
    }
  );

  console.log("isLoading", isLoading);
  console.log("booksByQueryName", booksByQueryName);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const getBooksByCategory = useCallback(
    (id) => {
      dispatch(setCurrentCategoryId(id));
      history.push(`${routes.searchBooks}/${id}`);
    },
    [dispatch, history]
  );

  const getSearchBooks = useCallback(
    (text) => {
      dispatch(findBooks(text));
    },
    [dispatch]
  );

  const getBooksByName = (name: string) => {
    dispatch(
      getBooksByQueryName({
        limit: "12",
        page: "1",
        order: "",
        filter: `[title|description][contains]=${name}`,
      })
    );
  };

  const getBook = useCallback(
    (id) => {
      dispatch(getBookById(id.toString()));
      history.push(`${routes.book}/${id}`);
    },
    [dispatch, history]
  );

  const translatedCategories = categories?.result?.data?.map(
    (category: any) => ({
      ...category,
      name: localization?.[category.name] || category.name, // Используем localization напрямую
    })
  );

  return (
    <SearchComponent
      categoriesData={translatedCategories}
      getBooksByCategory={getBooksByCategory}
      getSearchBooks={getSearchBooks}
      searchBooks={searchBooks?.result}
      getBooksByName={getBooksByName}
      booksByQueryName={booksByQueryName?.result?.data}
      getBook={getBook}
      isLoading={isLoading}
    />
  );
};

export default SearchContainer;
