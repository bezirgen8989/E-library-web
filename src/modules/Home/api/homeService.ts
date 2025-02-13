import { usingDelete, usingGet, usingPatch, usingPost } from "api/apiHelpers";
import {
  AddBookToShelfParams,
  AddReviewParams,
  BooksParams,
  ReadBooksParams,
  ReviewParams,
  SetReadingBookPayload,
} from "../slices/home/types";

export const getBooks = (params: BooksParams) =>
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
export const getBookshelfBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/bookshelf?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}`
  );
export const getAllStartedBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/bookshelf?page=${params.page}&limit=${params.limit}&filter${params.userFilter}&order${params.order}&filter${params.filter}`
  );

export const getAllNotStartedBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/bookshelf?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.userFilter}&filter${params.filter}`
  );
export const getAllFinishedBooks = (params: BooksParams) =>
  usingGet(
    `/api/v1/bookshelf?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}&filter${params.userFilter}`
  );
export const getCurrentReadBook = (params: ReadBooksParams) =>
  usingGet(
    `/api/v1/books/readBook/${params.bookId}/${params.langId}/${params.page}`
  );
export const askQuestion = (payload: ReadBooksParams) =>
  usingPost(`/api/v1/vectors/ask`, payload);
export const setReadingBookParams = (payload: SetReadingBookPayload) =>
  usingPatch(`/api/v1/bookshelf`, payload);
export const getCurrentBookshelfBookById = (payload: {
  userId: number;
  bookId: number;
}) => usingGet(`/api/v1/bookshelf/${payload.userId}/${payload.bookId}`);
export const getAllUserNotifications = (params: any) =>
  usingGet(
    `/api/v1/notifications?limit=${params.limit}&order${params.order}&page=${params.page}&filter${params.filter}`
  );
export const markNotificationAsRead = (params: any) =>
  usingPatch(`/api/v1/notifications/markAsRead`, params);
export const setUserNotifications = (payload: any) =>
  usingPatch(`/api/v1/notifications/settings`, payload);
export const getUserNotifications = () =>
  usingGet(`/api/v1/notifications/settings`);
export const checkUserNotifications = () =>
  usingGet(`/api/v1/notifications/checkNew`);
export const getAllAvatars = (params: { limit: string; page: string }) =>
  usingGet(`/api/v1/avatars?limit=${params.limit}&page=${params.page}`);
export const getStreamUrl = () => usingPost(`/api/v1/srs/url`, {});
export const getCurrentBookVersion = (params: any) =>
  usingGet(
    `/api/v1/bookVersions?page=${params.page}&limit=${params.limit}&filter${params.filterId}&filter${params.filterLanguage}`
  );
export const getAllBookVersions = (params: any) =>
  usingGet(
    `/api/v1/bookVersions?page=${params.page}&limit=${params.limit}&filter${params.filterId}`
  );
