/* export interface Book {
  googleBookId: string;
  title: string;
  authors: string[];
  description: string;
  publishedDate: string;
  imageLinks: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  pageCount: number;
  categories: string[];
  rating?: number;
  reviews: Review[];
}

export interface Review {
  _id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  _id: string;
  pseudo: string;
  email: string;
  isAdmin?: boolean;
}

export interface UserLibraryBook {
  userId: string;
  bookId: string;
  status: 'to-read' | 'reading' | 'completed';
  startDate?: string;
  finishDate?: string;
  rating?: number;
  review?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, pseudo: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LibraryContextType {
  books: Book[];
  searchBooks: (query: string) => Promise<void>;
  addToPersonalLibrary: (googleBookId: string) => Promise<void>;
  removeFromPersonalLibrary: (googleBookId: string) => Promise<void>;
  addReview: (bookId: string, rating: number, comment: string) => Promise<void>;
  loading: boolean;
  error: string | null;
} */

  export interface Book {
    googleBookId: string;
    title: string;
    authors: string[];
    description: string;
    publishedDate: string;
    imageLinks: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    pageCount: number;
    categories: string[];
    rating?: number;
    reviews: Review[];
    reviewsCount: number;
  }
  
  export interface Review {
    _id: string;
    userId: string;
    bookId: string;
    rating: number;
    comment: string;
    createdAt: string;
  }
  
  export interface User {
    _id: string;
    pseudo: string;
    email: string;
    isAdmin?: boolean;
  }
  
  export interface UserLibraryBook {
    userId: string;
    bookId: string;
    status: 'to-read' | 'reading' | 'completed';
    startDate?: string;
    finishDate?: string;
    rating?: number;
    review?: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, pseudo: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  }
  
  export interface LibraryContextType {
    books: Book[];
    userLibrary: UserLibraryBook[];
    searchBooks: (query: string) => Promise<void>;
    addToPersonalLibrary: (googleBookId: string) => Promise<void>;
    removeFromPersonalLibrary: (googleBookId: string) => Promise<void>;
    updateBookStatus: (googleBookId: string, status: string) => Promise<void>;
    addReview: (bookId: string, rating: number, comment: string) => Promise<void>;
    loading: boolean;
    error: string | null;
    query: string;
    userLibraryIsOpen: boolean;
    setQuery: (query: string) => void;
    setBooks: (books: Book[]) => void;
    setUserLibraryIsOpen: (userLibraryIsOpen: boolean) => void;
  }