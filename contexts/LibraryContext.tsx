/* 'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { LibraryContextType, Book } from '@/lib/types';
import { cookies } from '@/lib/cookies';

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const API_URL = 'http://localhost:8086/api';

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = cookies.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const searchBooks = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/books/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search books');
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      setError('Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  const addToPersonalLibrary = async (googleBookId: string) => {
    try {
      const response = await fetch(`${API_URL}/library/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          googleBookId,
          status: 'to-read'
        }),
      });
      if (!response.ok) throw new Error('Failed to add book to library');
    } catch (error) {
      setError('Failed to add book to library');
    }
  };

  const removeFromPersonalLibrary = async (googleBookId: string) => {
    try {
      const response = await fetch(`${API_URL}/library/${googleBookId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to remove book from library');
    } catch (error) {
      setError('Failed to remove book from library');
    }
  };

  const addReview = async (bookId: string, rating: number, comment: string) => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId, rating, comment }),
      });
      if (!response.ok) throw new Error('Failed to add review');
      
      // Refresh book details to update the reviews
      const bookResponse = await fetch(`${API_URL}/books/${bookId}`);
      if (bookResponse.ok) {
        const updatedBook = await bookResponse.json();
        setBooks(books.map(book => 
          book.googleBookId === bookId ? updatedBook : book
        ));
      }
    } catch (error) {
      setError('Failed to add review');
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        searchBooks,
        addToPersonalLibrary,
        removeFromPersonalLibrary,
        addReview,
        loading,
        error,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}; */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  use,
} from "react";
import { LibraryContextType, Book, UserLibraryBook } from "@/lib/types";
import { cookies } from "@/lib/cookies";

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const API_URL = "http://localhost:8086/api";

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [userLibrary, setUserLibrary] = useState<UserLibraryBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLibraryIsOpen, setUserLibraryIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = cookies.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Charger la bibliothèque de l'utilisateur
  const loadUserLibrary = async () => {
    try {
      const response = await fetch(`${API_URL}/library/`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to load library");
      const data = await response.json();

      setUserLibrary(data);
      return data;
    } catch (error) {
      setError("Failed to load library");
    }
  };
  const loadUserBooks = async (userLibrary: any) => {
    try {
      // Créer un tableau de promesses pour chaque livre
      const bookPromises = userLibrary.map(async (libBook: any) => {
        const response = await fetch(`${API_URL}/books/${libBook.bookId}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok)
          throw new Error(`Failed to load book with ID: ${libBook.bookId}`);
        return response.json(); // Retourner les données du livre
      });
      // Attendre que toutes les promesses soient résolues
      const booksData = await Promise.all(bookPromises);
      
      const reviewInfos = await getReviewCount(booksData);
      
      const booksWithReviews = booksData.map((book: Book) => {
        const review = reviewInfos.find(r => r.bookId === book.googleBookId);
        return {
          ...book,
          reviewsCount: review.reviewsCount || 0
        }
      })
      // Mettre à jour l'état avec les données des livres
      setBooks(booksWithReviews);
    } catch (error) {
      setError("Failed to load user books");
      console.error(error);
    }
  };

  useEffect(() => {
    if (cookies.getToken()) {
      loadUserLibrary();
    }
  }, []);

  const [query, setQuery] = useState("");

  const getReviewCount = async (data:any) => {
    const reviewPromises = data.map(async (book: Book) => {
      const reviewRes = await fetch(`${API_URL}/reviews/book/${book.googleBookId}`);
      if (!reviewRes.ok) throw new Error('Failed to load reviews for book id '+book.googleBookId);
      const reviewsData = await reviewRes.json();
      return { bookId: book.googleBookId, reviewsCount: reviewsData.total };
    });
    const reviewsinfo = await Promise.all(reviewPromises);
    
    return reviewsinfo;
  };

  const searchBooks = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (query) {
        response = await fetch(
          `${API_URL}/books/search?query=${encodeURIComponent(query)}`
        );
      } else {
        response = await fetch(`${API_URL}/books/search`);
      }
      if (!response.ok) throw new Error("Failed to search books");
      const data = await response.json();
      const reviewInfos = await getReviewCount(data.books);
      const booksWithReviews = data.books.map((book: Book) => {
        const review = reviewInfos.find(r => r.bookId === book.googleBookId);
        return {
          ...book,
          reviewsCount: review.reviewsCount || 0
        }
      })
      setBooks(booksWithReviews);
    } catch (error) {
      setError("Failed to search books");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userLibraryIsOpen) {
      searchBooks(query);
    }
  }, [query, userLibraryIsOpen]);
  useEffect(() => {
    if (userLibraryIsOpen) {
      loadUserBooks(userLibrary);
    }
  }, [userLibraryIsOpen]);

  const addToPersonalLibrary = async (googleBookId: string) => {
    try {
      const response = await fetch(`${API_URL}/library/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          googleBookId,
        }),
      });
      if (!response.ok) throw new Error("Failed to add book to library");
      await loadUserLibrary(); // Recharger la bibliothèque
    } catch (error) {
      setError("Failed to add book to library");
    }
  };

  const removeFromPersonalLibrary = async (googleBookId: string) => {
    try {
      const response = await fetch(`${API_URL}/library/${googleBookId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to remove book from library");
      await loadUserLibrary(); // Recharger la bibliothèque
    } catch (error) {
      setError("Failed to remove book from library");
    }
  };

  const updateBookStatus = async (googleBookId: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/library/${googleBookId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update book status");
      await loadUserLibrary();
    } catch (error) {
      setError("Failed to update book status");
    }
  };

  const addReview = async (bookId: string, rating: number, comment: string) => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId, rating, comment }),
      });
      if (!response.ok) throw new Error("Failed to add review");
      await loadUserLibrary();
    } catch (error) {
      setError("Failed to add review");
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        setBooks,
        userLibrary,
        searchBooks,
        addToPersonalLibrary,
        removeFromPersonalLibrary,
        updateBookStatus,
        addReview,
        loading,
        error,
        setQuery,
        query,
        userLibraryIsOpen,
        setUserLibraryIsOpen,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
