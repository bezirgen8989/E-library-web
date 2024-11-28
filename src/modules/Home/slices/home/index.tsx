import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLoggedOut } from "core/session/slices/session";

import {
  AddBookToShelfParams,
  AddReviewParams,
  BooksParams,
  HomeState,
  ReviewParams,
} from "./types";
import {
  addBookReview,
  addBookToShelf,
  deleteBookFromShelf,
  deleteBookReview,
  getAllAuthorBooks,
  getAllFinishedBooks,
  getAllNewBooks,
  getAllNotStartedBooks,
  getAllReviews,
  getAllStartedBooks,
  getAllSuggestedBooks,
  getAllTopBooks,
  getAuthorName,
  getBook,
  getBooksByName,
  getBookshelfBooks,
  getSearchBooks,
} from "../../api/homeService";

const initialState: HomeState = {
  counter: 0,
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
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    updateCounter(state, action: PayloadAction<number>) {
      state.counter += action.payload;
    },
    setCurrentCategoryId(state, action: PayloadAction<string>) {
      state.currentCategoryId = action.payload;
    },
    resetCounter(state) {
      state.counter = initialState.counter;
    },
    setNewBooks: (state, action: PayloadAction<any>) => {
      state.newBooks = action.payload;
    },
    clearBooks: (state) => {
      state.newBooks = {};
      state.topBooks = {};
      state.newBooks = {};
      state.suggestedBooks = {};
      state.similarBooks = {};
      state.authorBooks = {};
      state.currentBook = {};
      state.authorsName = {};
      state.startedBooks = {};
      state.notStartedBooks = {};
      state.finishedBooks = {};
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

        // Ensure we do not lose previous books
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
      .addCase(getAuthorsBooks.pending, (state) => {
        if (!state.authorBooks.result) {
          state.authorBooks = { isLoading: true };
        } else {
          state.authorBooks.isLoading = true;
        }
      })
      .addCase(getAuthorsBooks.fulfilled, (state, action) => {
        const { content, error } = action.payload;

        // Ensure we do not lose previous books
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

      // Clear store if 'userLoggedOut' happened
      .addCase(userLoggedOut, () => initialState);
  },
});

export const getTopBooks = createAsyncThunk(
  "top/api/v1/books",
  async (books: BooksParams) => {
    const response = await getAllTopBooks(books);
    return response;
  }
);

export const getNewBooks = createAsyncThunk(
  "new/api/v1/books",
  async (books: BooksParams) => {
    const response = await getAllNewBooks(books);
    return response;
  }
);

export const getSuggestedBooks = createAsyncThunk(
  "suggested/api/v1/books",
  async (books: BooksParams) => {
    const response = await getAllSuggestedBooks(books);
    return response;
  }
);

export const getSimilarBooks = createAsyncThunk(
  "similar/api/v1/books",
  async (books: BooksParams) => {
    const response = await getAllSuggestedBooks(books);
    return response;
  }
);

export const getAuthorsBooks = createAsyncThunk(
  "author/api/v1/books",
  async (books: BooksParams) => {
    const response = await getAllAuthorBooks(books);
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
    const response = await getBooksByName(books);
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

export const { updateCounter, resetCounter, setCurrentCategoryId, clearBooks } =
  homeSlice.actions;
export default homeSlice.reducer;
