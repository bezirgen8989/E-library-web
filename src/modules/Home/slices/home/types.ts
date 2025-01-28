export type HomeState = {
  counter: number;
  isDrawerOpen: boolean;
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
  bookshelf: any;
  startedBooks: any;
  notStartedBooks: any;
  finishedBooks: any;
  currentReadBook: any;
  currentUserAnswer: any;
  currentBookshelfBook: any;
  testCurrentBookshelfBook: any;
  notifications: any;
  notificationsSettings: any;
  hasNew: any;
  avatars: any;
  streamUrl: any;
  avatarLanguage: any;
  currentBookVersion: any;
  isStreamShow: boolean;
};
export interface SetReadingBookPayload {
  user: {
    id: number;
  };
  book: {
    id: number;
  };
  lastPage: number;
  progress: number;
  readingState: string;
  isFavourited?: boolean;
}
export interface NotificationSettings {
  startReading: boolean;
  continueReading: boolean;
  newBooks: boolean;
}
export type BooksParams = {
  page: string;
  limit: string;
  filter: string | null;
  order?: string | null;
  userFilter?: string | null;
};
export type ReadBooksParams = {
  page: string;
  bookId?: string | null;
  langId?: string | null;
};

export type AddBookToShelfParams = {
  user: { id: number } | undefined;
  book: { id: number };
  isDownloaded?: boolean;
  isFavourited: boolean;
  readingState?: string;
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
