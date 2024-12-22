import { useDispatch } from "react-redux";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import { useCallback, useEffect } from "react";
import { getCategories } from "../../Auth/slices/auth";
import { useLazySelector } from "../../../hooks";
import routes from "../routing/routes";
import { useHistory } from "react-router-dom";
import {
  findBooks,
  getBookById,
  getBooksByQueryName,
  setCurrentCategoryId,
} from "../slices/home";

const SearchContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { categories } = useLazySelector(({ auth }) => {
    const { categories } = auth;
    return {
      categories,
    };
  });

  // const { isLoading, error, data } = useLazySelector(({ userList }) => {
  //   const { users } = userList
  //   const { isLoading, error, result } = users
  //   return {
  //     isLoading,
  //     error,
  //     data: result,
  //   }
  // })

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
  }, []);

  const getBooksByCategory = useCallback((id) => {
    dispatch(setCurrentCategoryId(id));
    history.push(`${routes.searchBooks}/${id}`);
  }, []);

  const getSearchBooks = useCallback((text) => {
    dispatch(findBooks(text));
  }, []);

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

  const getBook = useCallback((id) => {
    dispatch(getBookById(id.toString()));
    history.push(`${routes.book}/${id}`);
  }, []);

  return (
    <SearchComponent
      categoriesData={categories?.result?.data}
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
