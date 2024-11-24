import { usingDelete, usingGet, usingPost } from "api/apiHelpers";
import {
  AddBookToShelfParams,
  AddReviewParams,
  BooksParams,
  ReviewParams,
} from "../slices/home/types";

export const getAllTopBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/books?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}`
  );
export const getAllNewBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/books?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}`
  );
export const getAllSuggestedBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/books?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}`
  );
export const getAllAuthorBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/books?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}`
  );
export const getBooksByName = (params: BooksParams) =>
  usingGet(
    `/api/v1/books?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}`
  );

export const addBookToShelf = (params: AddBookToShelfParams) =>
  usingPost(`/api/v1/bookshelf`, params);
export const addBookReview = (params: AddReviewParams) =>
  usingPost(`/api/v1/reviews`, params);
export const deleteBookFromShelf = (params: {
  userId: string;
  bookId: string;
}) => usingDelete(`/api/v1/bookshelf/${params.userId}/${params.bookId}`);
export const getBook = (id: string) => usingGet(`/api/v1/books/${id}`);
export const getAuthorName = (id: string) => usingGet(`/api/v1/authors/${id}`);
export const getAllReviews = (params: ReviewParams) =>
  usingGet(
    `/api/v1/reviews/${params.id}?page=${params.page}&limit=${params.limit}`
  );
export const deleteBookReview = (id: string) =>
  usingDelete(`/api/v1/reviews/${id}`);
export const getSearchBooks = (text: string) =>
  usingGet(`/api/v1/books/suggestSearch/${text}`);
