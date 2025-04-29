import { Language } from "../../../Auth/slices/auth/types";

export type HomeState = {
  counter: number;
  isDrawerOpen: boolean;
  books: any;
  topBooks: any;
  newBooks: any;
  suggestedBooks: any;
  currentBook: {
    isLoading: boolean;
    result: Partial<{
      id: number;
      title: string;
      description: string;
      isAgeRestricted: boolean;
      dateAdded: string;
      dateUpdated: null | string;
      reviewCount: number;
      reviewScoreSum: number;
      rating: string;
      added: number;
      downloaded: number;
      reading: number;
      finished: number;
      isFavourite: boolean;
      isDownloaded: boolean;
      isReading: boolean;
      isFinished: boolean;
      vectorEntity: any;
      author: any[];
      categories: BookCategory[];
      bookCover: any;
    }>;
    error: any;
  };
  reviews: {
    isLoading: boolean;
    result: Partial<{
      data: BookReviews[];
      total: number;
      page: number;
      limit: number;
      rating: string;
    }>;
    error: any;
  };
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
  bookVersions: {
    isLoading: boolean;
    result: Partial<{
      data: BookItem[];
      total: number;
      page: number;
      limit: number;
    }>;
    error?: any;
  };
  currentAudioBook: any;
  avatarStreamShow: boolean;
  isStopQuestion: boolean;
  streamDone: boolean;
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
  filter?: string | null;
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

export type TypeOnMetaEvents = {
  meta: {
    pdf: {
      version: string;
      info: {
        PDFFormatVersion: string;
        IsAcroFormPresent: boolean;
        IsXFAPresent: boolean;
        Title: string;
        Author: string;
        Subject: string;
        Creator: string;
        Producer: string;
        CreationDate: string;
      };
      totalPages: number;
    };
    loc: {
      pageNumber: number;
      lines: {
        from: number;
        to: number;
      };
    };
    source: string;
  };
  content: string;
};

type BookReviews = {
  id: number;
  createdAt: string;
  updatedAt: string;
  rating: number;
  text: string;
  user: {
    id: number;
    userName: string;
  };
  coreBook: {
    id: number;
    title: string;
  };
};

type BookCategory = {
  id: number;
  name: string;
  color: string;
};

export interface FileEntity {
  id: string;
  prefix: string;
  postfix: string;
  name: string;
  type: "FILE";
  fileType: string;
  fileSize: number;
  tag: string | null;
  link: string;
}

export interface BookItem {
  id: number;
  translationType: "ai" | "human" | string;
  title: string;
  description: string;
  convertedBookLink: string | null;
  totalPages: number | null;
  language: Language;
  bookFile: FileEntity | null;
  locBookCover: FileEntity;
}
