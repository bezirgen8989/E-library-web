import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLoggedOut } from "core/session/slices/session";

import {
  AddBookToShelfParams,
  AddReviewParams,
  BooksParams,
  HomeState,
  NotificationSettings,
  ReadBooksParams,
  ReviewParams,
  SetReadingBookPayload,
} from "./types";
import {
  addBookReview,
  addBookToShelf,
  askQuestion,
  checkUserNotifications,
  deleteBookFromShelf,
  deleteBookReview,
  getAllAvatars,
  getAllBookVersions,
  getAllFinishedBooks,
  getAllNotStartedBooks,
  getAllReviews,
  getAllStartedBooks,
  getAllUserNotifications,
  getAuthorName,
  getBook,
  getBooks,
  getBookshelfBooks,
  getCurrentAudioBook,
  getCurrentBookshelfBookById,
  getCurrentBookVersion,
  getSearchBooks,
  getStreamUrl,
  getUserNotifications,
  markNotificationAsRead,
  setReadingBookParams,
  setUserNotifications,
} from "../../api/homeService";
import axios from "axios";
import { TokenManager } from "../../../../utils";
import { API_PREFIX } from "../../../../api/apiHelpers";

const initialState: HomeState = {
  counter: 0,
  isDrawerOpen: false,
  books: {},
  topBooks: {},
  newBooks: {},
  suggestedBooks: {},
  similarBooks: {},
  authorBooks: {},
  currentBook: {},
  authorsName: {},
  reviews: {},
  currentCategoryId: "",
  searchBooks: [],
  booksByQueryName: {},
  bookshelf: {},
  startedBooks: {},
  notStartedBooks: {},
  finishedBooks: {},
  currentReadBook: {},
  currentUserAnswer: {},
  currentBookshelfBook: {},
  testCurrentBookshelfBook: {},
  notifications: {},
  notificationsSettings: {},
  hasNew: false,
  avatars: {},
  streamUrl: {},
  avatarLanguage: {},
  isStreamShow: false,
  currentBookVersion: {},
  bookVersions: {},
  currentAudioBook: {},
  avatarStreamShow: false,
  isStopQuestion: false,
  streamDone: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    updateCounter(state, action: PayloadAction<number>) {
      state.counter += action.payload;
    },
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isDrawerOpen = action.payload;
    },
    selectAvatarLanguage(state, action: PayloadAction<any>) {
      state.avatarLanguage = action.payload;
    },
    setCurrentCategoryId(state, action: PayloadAction<string>) {
      state.currentCategoryId = action.payload;
    },
    resetCounter(state) {
      state.counter = initialState.counter;
    },
    setIsStreamShow(state, action: PayloadAction<boolean>) {
      state.isStreamShow = action.payload;
    },
    setAvatarStreamShow(state, action: PayloadAction<boolean>) {
      state.avatarStreamShow = action.payload;
    },
    setIsStopQuestion(state, action: PayloadAction<boolean>) {
      state.isStopQuestion = action.payload;
    },
    setStreamDone(state, action: PayloadAction<boolean>) {
      state.streamDone = action.payload;
    },

    setNewBooks: (state, action: PayloadAction<any>) => {
      state.newBooks = action.payload;
    },
    clearBooks: (state) => {
      state.newBooks = {};
      state.topBooks = {};
      state.suggestedBooks = {};
      state.similarBooks = {};
      state.authorBooks = {};
      state.currentBook = {};
      state.authorsName = {};
      state.startedBooks = {};
      state.notStartedBooks = {};
      state.finishedBooks = {};
      state.currentBookshelfBook = {};
      state.currentReadBook = {};
    },
    clearCurrentVersion: (state) => {
      state.currentBookVersion = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTopBooks.pending, (state) => {
        if (!state.topBooks.result) {
          state.topBooks = { isLoading: true };
        } else {
          state.topBooks.isLoading = true;
        }
      })
      .addCase(getTopBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.topBooks.result?.data || [];
        state.topBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })
      .addCase(getNewBooks.pending, (state) => {
        if (!state.newBooks.result) {
          state.newBooks = { isLoading: true };
        } else {
          state.newBooks.isLoading = true;
        }
      })
      .addCase(getNewBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.newBooks.result?.data || [];
        state.newBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })

      .addCase(getSuggestedBooks.pending, (state) => {
        if (!state.suggestedBooks.result) {
          state.suggestedBooks = { isLoading: true };
        } else {
          state.suggestedBooks.isLoading = true;
        }
      })
      .addCase(getSuggestedBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.suggestedBooks.result?.data || [];
        state.suggestedBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })
      .addCase(getBookShelf.pending, (state) => {
        state.bookshelf = { isLoading: true };
      })
      .addCase(getBookShelf.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.bookshelf = { isLoading: false, result: content, error };
      })

      .addCase(getSimilarBooks.pending, (state) => {
        if (!state.similarBooks.result) {
          state.similarBooks = { isLoading: true };
        } else {
          state.similarBooks.isLoading = true;
        }
      })
      .addCase(getSimilarBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.similarBooks.result?.data || [];
        state.similarBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })
      .addCase(getBooksByQueryName.pending, (state) => {
        state.booksByQueryName = { isLoading: true };
      })
      .addCase(getBooksByQueryName.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.booksByQueryName = { isLoading: false, result: content, error };
      })
      .addCase(setStreamUrl.pending, (state) => {
        state.streamUrl = { isLoading: true };
      })
      .addCase(setStreamUrl.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.streamUrl = { isLoading: false, result: content, error };
      })

      .addCase(getAuthorsBooks.pending, (state) => {
        if (!state.authorBooks.result) {
          state.authorBooks = { isLoading: true };
        } else {
          state.authorBooks.isLoading = true;
        }
      })
      .addCase(getAuthorsBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.authorBooks.result?.data || [];
        state.authorBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })

      .addCase(getNameByAuthorId.pending, (state) => {
        state.authorsName = { isLoading: true };
      })
      .addCase(getNameByAuthorId.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.authorsName = { isLoading: false, result: content, error };
      })

      .addCase(getBookById.pending, (state) => {
        state.currentBook = { isLoading: true };
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.currentBook = { isLoading: false, result: content, error };
      })
      .addCase(getReviews.pending, (state) => {
        state.reviews = { isLoading: true };
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.reviews = { isLoading: false, result: content, error };
      })
      .addCase(findBooks.pending, (state) => {
        state.searchBooks = { isLoading: true };
      })
      .addCase(findBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.searchBooks = { isLoading: false, result: content, error };
      })
      .addCase(getBookVersion.pending, (state) => {
        state.currentBookVersion = { isLoading: true };
      })
      .addCase(getBookVersion.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.currentBookVersion = { isLoading: false, result: content, error };
      })

      .addCase(getStartedBooks.pending, (state) => {
        if (!state.startedBooks.result) {
          state.startedBooks = { isLoading: true };
        } else {
          state.startedBooks.isLoading = true;
        }
      })
      .addCase(getStartedBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.startedBooks.result?.data || [];
        state.startedBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })

      .addCase(getNotStartedBooks.pending, (state) => {
        if (!state.notStartedBooks.result) {
          state.notStartedBooks = { isLoading: true };
        } else {
          state.notStartedBooks.isLoading = true;
        }
      })
      .addCase(getNotStartedBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.notStartedBooks.result?.data || [];
        state.notStartedBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })

      .addCase(getFinishedBooks.pending, (state) => {
        if (!state.finishedBooks.result) {
          state.finishedBooks = { isLoading: true };
        } else {
          state.finishedBooks.isLoading = true;
        }
      })
      .addCase(getFinishedBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        const existingBooks = state.finishedBooks.result?.data || [];
        state.finishedBooks = {
          isLoading: false,
          result: {
            data: [...existingBooks, ...content.data],
            total: content.total,
          },
          error,
        };
      })

      .addCase(getReadBook.pending, (state) => {
        state.currentReadBook = { isLoading: true };
      })
      .addCase(getReadBook.fulfilled, (state, action) => {
        const { error } = action.payload;
        state.currentReadBook = {
          isLoading: false,
          result: action.payload,
          error,
        };
      })

      .addCase(getAudioBook.pending, (state) => {
        state.currentAudioBook = { isLoading: true };
      })
      .addCase(getAudioBook.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.currentAudioBook = { isLoading: false, result: content, error };
      })

      .addCase(checkNewNotifications.pending, (state) => {
        state.hasNew = { isLoading: true };
      })
      .addCase(checkNewNotifications.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.hasNew = { isLoading: false, result: content, error };
      })

      .addCase(getAvatars.pending, (state) => {
        state.avatars = { isLoading: true };
      })
      .addCase(getAvatars.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.avatars = { isLoading: false, result: content, error };
      })

      .addCase(getAllNotifications.pending, (state) => {
        state.notifications = { isLoading: true };
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.notifications = { isLoading: false, result: content, error };
      })
      .addCase(getNotificationsSettings.pending, (state) => {
        state.notificationsSettings = { isLoading: true };
      })
      .addCase(getNotificationsSettings.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.notificationsSettings = {
          isLoading: false,
          result: content,
          error,
        };
      })

      .addCase(getBookshelfById.pending, (state) => {
        state.currentBookshelfBook = { isLoading: true };
      })
      .addCase(getBookshelfById.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.currentBookshelfBook = {
          isLoading: false,
          result: content,
          error,
        };
      })

      .addCase(setUserQuestion.pending, (state) => {
        state.currentUserAnswer = { isLoading: true };
      })
      .addCase(setUserQuestion.fulfilled, (state, action) => {
        console.log("Action payload:", action.payload);
        const { content, error } = action.payload;
        state.currentUserAnswer = { isLoading: false, result: content, error };
      })

      .addCase(setReadingBook.pending, (state) => {
        state.currentBookshelfBook = { isLoading: true };
      })
      .addCase(setReadingBook.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.currentBookshelfBook = {
          isLoading: false,
          result: content,
          error,
        };
      })

      .addCase(getBookVersions.pending, (state) => {
        state.bookVersions = { isLoading: true };
      })
      .addCase(getBookVersions.fulfilled, (state, action) => {
        const { content, error } = action.payload;
        state.bookVersions = { isLoading: false, result: content, error };
      })

      // Clear store if 'userLoggedOut' happened
      .addCase(userLoggedOut, () => initialState);
  },
});

export const getTopBooks = createAsyncThunk(
  "top/api/v1/books",
  async (books: BooksParams) => {
    const response = await getBooks(books);
    return response;
  }
);

export const getNewBooks = createAsyncThunk(
  "new/api/v1/books",
  async (books: BooksParams) => {
    const response = await getBooks(books);
    return response;
  }
);

export const getSuggestedBooks = createAsyncThunk(
  "suggested/api/v1/books",
  async (books: BooksParams) => {
    const response = await getBooks(books);
    return response;
  }
);

export const getSimilarBooks = createAsyncThunk(
  "similar/api/v1/books",
  async (books: BooksParams) => {
    const response = await getBooks(books);
    return response;
  }
);

export const getAuthorsBooks = createAsyncThunk(
  "author/api/v1/books",
  async (books: BooksParams) => {
    const response = await getBooks(books);
    return response;
  }
);

export const getBookById = createAsyncThunk(
  "/api/v1/books/id",
  async (id: string) => {
    const response = await getBook(id);
    return response;
  }
);

export const getBookVersion = createAsyncThunk(
  "/api/v1/bookVersions",
  async (params: any) => {
    const response = await getCurrentBookVersion(params);
    return response;
  }
);

export const addToShelf = createAsyncThunk(
  "/api/v1/bookshelf",
  async (params: AddBookToShelfParams) => {
    const response = await addBookToShelf(params);
    return response;
  }
);

export const deleteFromShelf = createAsyncThunk(
  "delete/api/v1/bookshelf",
  async (params: { userId: string; bookId: string }) => {
    const response = await deleteBookFromShelf(params);
    return response;
  }
);

export const getBookShelf = createAsyncThunk(
  "get/api/v1/bookshelf",
  async (books: BooksParams) => {
    const response = await getBookshelfBooks(books);
    return response;
  }
);

export const addReview = createAsyncThunk(
  "add/api/v1/reviews",
  async (params: AddReviewParams) => {
    const response = await addBookReview(params);
    return response;
  }
);

export const getReviews = createAsyncThunk(
  "get/api/v1/reviews",
  async (params: ReviewParams) => {
    const response = await getAllReviews(params);
    return response;
  }
);
export const findBooks = createAsyncThunk(
  "api/v1/books/suggestSearch",
  async (text: string) => {
    const response = await getSearchBooks(text);
    return response;
  }
);

export const getBooksByQueryName = createAsyncThunk(
  "query/api/v1/books",
  async (books: BooksParams) => {
    const response = await getBooks(books);
    return response;
  }
);

export const deleteYourReview = createAsyncThunk(
  "delete/api/v1/reviews/",
  async (id: string) => {
    const response = await deleteBookReview(id);
    return response;
  }
);

export const getNameByAuthorId = createAsyncThunk(
  "/api/v1/authors/id",
  async (id: string) => {
    const response = await getAuthorName(id);
    return response;
  }
);

export const getStartedBooks = createAsyncThunk(
  "started/api/v1/bookshelf",
  async (books: BooksParams) => {
    const response = await getAllStartedBooks(books);
    return response;
  }
);

export const getNotStartedBooks = createAsyncThunk(
  "not-started/api/v1/bookshelf",
  async (books: BooksParams) => {
    const response = await getAllNotStartedBooks(books);
    return response;
  }
);

export const getFinishedBooks = createAsyncThunk(
  "finished/api/v1/bookshelf",
  async (books: BooksParams) => {
    const response = await getAllFinishedBooks(books);
    return response;
  }
);

export const getReadBook = createAsyncThunk(
  "home/getReadBook",
  async (params: {
    bookId: string;
    langId: number;
    page: string;
    signal?: AbortSignal;
  }) => {
    const token = TokenManager.getAccessToken();
    const response = await axios.get(
      `${API_PREFIX}/api/v1/books/readBookNew/${params.bookId}/${params.langId}/${params.page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: params.signal,
      }
    );
    console.log("response222", response);
    return response.data;
  }
);

export const getAudioBook = createAsyncThunk(
  "/api/v1/books/listenBook",
  async (books: ReadBooksParams) => {
    const response = await getCurrentAudioBook(books);
    return response;
  }
);

export const setUserQuestion = createAsyncThunk(
  "/api/v1/vectors/ask",
  async (books: any) => {
    const response = await askQuestion(books);
    return response;
  }
);

export const setReadingBook = createAsyncThunk(
  "setBookProgress/api/v1/bookshelf",
  async (params: SetReadingBookPayload) => {
    const response = await setReadingBookParams(params);
    return response;
  }
);

export const getBookshelfById = createAsyncThunk(
  "getBookFromBookshelf/api/v1/bookshelf",
  async (params: { userId: any; bookId: number }) => {
    const response = await getCurrentBookshelfBookById(params);
    return response;
  }
);

export const getAllNotifications = createAsyncThunk(
  "getNotifications/api/v1/notifications",
  async (params: any) => {
    const response = await getAllUserNotifications(params);
    return response;
  }
);
export const markAsRead = createAsyncThunk(
  "markNotifications/api/v1/notifications",
  async (params: any) => {
    const response = await markNotificationAsRead(params);
    return response;
  }
);

export const setNotificationsSettings = createAsyncThunk(
  "set/api/v1/notifications/settings",
  async (payload: NotificationSettings) => {
    const response = await setUserNotifications(payload);
    return response;
  }
);

export const getNotificationsSettings = createAsyncThunk(
  "get/api/v1/notifications/settings",
  async () => {
    const response = await getUserNotifications();
    return response;
  }
);
export const checkNewNotifications = createAsyncThunk(
  "check/api/v1/notifications/checkNew",
  async () => {
    const response = await checkUserNotifications();
    return response;
  }
);

export const getAvatars = createAsyncThunk(
  "get/api/v1/avatars",
  async (params: { limit: string; page: string }) => {
    const response = await getAllAvatars(params);
    return response;
  }
);
export const setStreamUrl = createAsyncThunk("/api/v1/srs/url", async () => {
  const response = await getStreamUrl();
  return response;
});

export const getBookVersions = createAsyncThunk(
  "getVersions/api/v1/bookshelf",
  async (books: any) => {
    console.log("0675986745988909", books);
    const response = await getAllBookVersions(books);
    return response;
  }
);

export const {
  updateCounter,
  resetCounter,
  setCurrentCategoryId,
  clearBooks,
  setDrawerOpen,
  selectAvatarLanguage,
  setIsStreamShow,
  setAvatarStreamShow,
  setIsStopQuestion,
  setStreamDone,
  clearCurrentVersion,
} = homeSlice.actions;
export default homeSlice.reducer;
