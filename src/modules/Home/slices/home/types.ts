export type HomeState = {
  counter: number;
  books: any;
  topBooks: any;
  newBooks: any;
  suggestedBooks: any;
  currentBook: any;
  reviews: any;
  similarBooks: any;
  authorsName: any;
  authorBooks: any;
  currentCategoryId: any;
  searchBooks: any;
  booksByQueryName: any;
};
export type BooksParams = {
  page: string;
  limit: string;
  filter: string | null;
  order?: string | null;
};

export type AddBookToShelfParams = {
  user: { id: number };
  book: { id: number };
  isDownloaded: boolean;
  isFavourited: boolean;
  readingState: string;
};

export type AddReviewParams = {
  rating: number;
  text: string;
  user: {
    id: string;
  };
  coreBook: {
    id: string;
  };
};

export type ReviewParams = {
  id: number;
  limit: string;
  page: string;
};
