import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazySelector } from "hooks";
import { getBookById, getNewBooks } from "../slices/home";
import BooksComponent from "../components/AllBooksComponents/BooksComponent";
import { routes } from "../routing";
import { useHistory, useParams } from "react-router-dom";

const SearchNewBooksContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const { newBooks } = useLazySelector(({ home }) => {
    const { newBooks } = home;
    return {
      newBooks,
    };
  });
  const searchFilter = `[categories.id][in]=${id}`;
  const dateOrder = "[dateAdded]=desc";

  const getBook = useCallback((id) => {
    dispatch(getBookById(id.toString()));
    history.push(`${routes.book}/${id}`);
  }, []);

  useEffect(() => {
    dispatch(
      getNewBooks({
        limit: "20",
        page: "1",
        order: dateOrder,
        filter: searchFilter,
      })
    );
  }, []);

  return (
    <BooksComponent
      books={newBooks?.result?.data}
      getBook={getBook}
      title="Top Books"
    />
  );
};

export default SearchNewBooksContainer;
