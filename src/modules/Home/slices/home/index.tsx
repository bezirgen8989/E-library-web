import {createAsyncThunk, createSlice, PayloadAction,} from '@reduxjs/toolkit'
import {userLoggedOut} from 'core/session/slices/session'

import {AddBookToShelfParams, AddReviewParams, BooksParams, HomeState, ReviewParams} from './types'
import {
    addBookReview,
    addBookToShelf,
    deleteBookFromShelf, deleteBookReview, getAllAuthorBooks,
    getAllNewBooks, getAllReviews,
    getAllSuggestedBooks,
    getAllTopBooks, getAuthorName,
    getBook
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
    reviews: {}
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        updateCounter(state, action: PayloadAction<number>) {
            state.counter += action.payload
        },
        resetCounter(state) {
            state.counter = initialState.counter
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getTopBooks.pending, (state) => {
                state.topBooks = { isLoading: true };
            })
            .addCase(getTopBooks.fulfilled, (state, action) => {
                const { content, error } = action.payload;
                state.topBooks = { isLoading: false, result: content, error };
            })
            .addCase(getNewBooks.pending, (state) => {
                state.newBooks = { isLoading: true };
            })
            .addCase(getNewBooks.fulfilled, (state, action) => {
                const { content, error } = action.payload;
                state.newBooks = { isLoading: false, result: content, error };
            })
            // .addCase(getNewBooks.fulfilled, (state, action) => {
            //     const { content, error } = action.payload;
            //     state.newBooks = {
            //         isLoading: false,
            //         result: {
            //             data: [...(state.newBooks?.result?.data || []), ...content.data], // Append new data
            //             total: content.total
            //         },
            //         error
            //     };
            // })
            .addCase(getSuggestedBooks.pending, (state) => {
                state.suggestedBooks = { isLoading: true };
            })
            .addCase(getSuggestedBooks.fulfilled, (state, action) => {
                const { content, error } = action.payload;
                state.suggestedBooks = { isLoading: false, result: content, error };
            })
            .addCase(getSimilarBooks.pending, (state) => {
                state.similarBooks = { isLoading: true };
            })
            .addCase(getSimilarBooks.fulfilled, (state, action) => {
                const { content, error } = action.payload;
                state.similarBooks = { isLoading: false, result: content, error };
            })

            .addCase(getAuthorsBooks.pending, (state) => {
                state.authorBooks = { isLoading: true };
            })
            .addCase(getAuthorsBooks.fulfilled, (state, action) => {
                const { content, error } = action.payload;
                state.authorBooks = { isLoading: false, result: content, error };
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

            // Clear store if 'userLoggedOut' happened
            .addCase(userLoggedOut, () => initialState)
    },
})

export const getTopBooks = createAsyncThunk(
    'top/api/v1/books',
    async (books: BooksParams) => {
        const response = await getAllTopBooks(books);
        return response;
    });

export const getNewBooks = createAsyncThunk(
    'new/api/v1/books',
    async (books: BooksParams) => {
        const response = await getAllNewBooks(books);
        return response;
    });

export const getSuggestedBooks = createAsyncThunk(
    'suggested/api/v1/books',
    async (books: BooksParams) => {
        const response = await getAllSuggestedBooks(books);
        return response;
    });

export const getSimilarBooks = createAsyncThunk(
    'similar/api/v1/books',
    async (books: BooksParams) => {
        const response = await getAllSuggestedBooks(books);
        return response;
    });

export const getAuthorsBooks = createAsyncThunk(
    'author/api/v1/books',
    async (books: BooksParams) => {
        const response = await getAllAuthorBooks(books);
        return response;
    });

export const getBookById = createAsyncThunk(
    '/api/v1/books/id',
    async (id: string) => {
        const response = await getBook(id);
        return response;
    });
export const addToShelf = createAsyncThunk(
    '/api/v1/bookshelf',
    async (params: AddBookToShelfParams) => {
        const response = await addBookToShelf(params);
        return response;
    });

export const deleteFromShelf = createAsyncThunk(
    'delete/api/v1/bookshelf',
    async (params: {userId: string, bookId: string}) => {
        const response = await deleteBookFromShelf(params);
        return response;
    });

export const addReview = createAsyncThunk(
    'add/api/v1/reviews',
    async (params: AddReviewParams) => {
        const response = await addBookReview(params);
        return response;
    });

export const getReviews = createAsyncThunk(
    'get/api/v1/reviews',
    async (params: ReviewParams) => {
        const response = await getAllReviews(params);
        return response;
    });

export const deleteYourReview = createAsyncThunk(
    'delete/api/v1/reviews/',
    async (id: string) => {
        const response = await deleteBookReview(id);
        return response;
    });

export const getNameByAuthorId = createAsyncThunk(
    '/api/v1/authors/id',
    async (id: string) => {
        const response = await getAuthorName(id);
        return response;
    })









export const {updateCounter, resetCounter} = homeSlice.actions
export default homeSlice.reducer


