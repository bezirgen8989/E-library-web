import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Book } from "../components";
import { useLazySelector } from "../../../hooks";
import { getLanguages } from "../../Auth/slices/auth";
import {
  addReview,
  addToShelf,
  clearBooks,
  deleteFromShelf,
  deleteYourReview,
  getBookById,
  getReviews,
  getSimilarBooks,
} from "../slices/home";
import { routes } from "../routing";
import { useHistory } from "react-router-dom";

const BookContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const value = useContext(UserContext);

  const { languages } = useLazySelector(({ auth }) => {
    const { languages, photoId } = auth;
    return { languages, photoId };
  });

  const { currentBook, reviews, similarBooks } = useLazySelector(({ home }) => {
    const { currentBook, reviews, similarBooks } = home;
    return { currentBook, reviews, similarBooks };
  });

  const getBook = useCallback(
    (id) => {
      dispatch(getBookById(id.toString()));
    },
    [dispatch]
  );

  const addToBookShelf = useCallback(
    (params) => {
      dispatch(addToShelf(params));
    },
    [dispatch]
  );

  const deleteFromBookShelf = useCallback(
    (params) => {
      dispatch(deleteFromShelf(params));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  const fetchReviews = useCallback(() => {
    if (currentBook?.result?.id) {
      dispatch(
        getReviews({
          id: currentBook.result.id,
          page: "1",
          limit: "10",
        })
      );
    }
  }, [dispatch, currentBook]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const reviewSubmit = async (params: any) => {
    try {
      await dispatch(addReview(params));
      fetchReviews();
    } catch (error) {
      console.error("Error adding review or fetching reviews:", error);
    }
  };

  const deleteReview = useCallback(
    async (id) => {
      try {
        await dispatch(deleteYourReview(id.toString()));
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review or fetching reviews:", error);
      }
    },
    [dispatch, fetchReviews]
  );

  const habitsCategories = currentBook?.result?.categories
    .map((genre: { id: string; name: string; colour: string }) => genre.id)
    .join(",");

  console.log("habitsCategories Book", habitsCategories);

  const suggestedFilter = `[categories.id][in]=${habitsCategories}`;
  const ratingOrder = "[rating]=desc";
  useEffect(() => {
    dispatch(clearBooks());
  }, []);

  useEffect(() => {
    dispatch(
      getSimilarBooks({
        limit: "3",
        page: "1",
        order: ratingOrder,
        filter: suggestedFilter,
      })
    );
  }, [dispatch, suggestedFilter, ratingOrder]);

  const getAuthorBooks = useCallback(
    (id) => {
      history.push(`${routes.authorBooks}/${id}`);
    },
    [dispatch]
  );

  return (
    <Book
      getBook={getBook}
      currentBook={currentBook}
      languages={languages?.result?.data}
      addToBookShelf={addToBookShelf}
      deleteFromBookShelf={deleteFromBookShelf}
      reviews={reviews?.result?.data}
      reviewSubmit={reviewSubmit}
      similarBooks={similarBooks?.result?.data}
      deleteReview={deleteReview}
      getAuthorBooks={getAuthorBooks}
    />
  );
};

export default BookContainer;
