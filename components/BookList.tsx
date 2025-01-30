"use client";

import { useLibrary } from "@/contexts/LibraryContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { BookReviewDialog } from "./BookReviewDialog";
import { useState } from "react";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

interface BookListProps {
  personalLibraryOnly?: boolean;
}

export function BookList({ personalLibraryOnly = false }: BookListProps) {
  const {
    books,
    setBooks,
    userLibraryIsOpen,
    setUserLibraryIsOpen,
    userLibrary,
    loading,
    error,
    addToPersonalLibrary,
    removeFromPersonalLibrary,
    updateBookStatus,
  } = useLibrary();
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [showPersonalLibrary, setShowPersonalLibrary] =
    useState(personalLibraryOnly);

  const displayedBooks = showPersonalLibrary
    ? books.filter((book) =>
        userLibrary.some((lib) => lib.bookId === book.googleBookId)
      )
    : books;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Loading books...</Typography>
      </Box>
    );
  }

  const isInLibrary = (bookId: string) => {
    return userLibrary.some((lib) => lib.bookId === bookId);
  };

  const getBookStatus = (bookId: string) => {
    const libraryBook = userLibrary.find((lib) => lib.bookId === bookId);
    return libraryBook?.status || "reading";
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<LibraryBooksIcon />}
          onClick={() => {
            setShowPersonalLibrary(!showPersonalLibrary);
            setUserLibraryIsOpen(!userLibraryIsOpen);
          }}
        >
          {showPersonalLibrary ? "Show All Books" : "Show My Library"}
        </Button>
      </Box>

      {displayedBooks.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography>
            {showPersonalLibrary
              ? "No books in your library yet."
              : "No books found. Try searching for something!"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayedBooks.map((book) => {
            const inLibrary = isInLibrary(book.googleBookId);
            const status = getBookStatus(book.googleBookId);

            return (
              <Grid item xs={12} sm={6} md={4} key={book.googleBookId}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={
                      book.imageLinks?.thumbnail || "/placeholder-book.jpg"
                    }
                    alt={book.title}
                    sx={{ objectFit: "contain" }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.authors?.join(", ")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Rating
                        value={book.rating || 0}
                        readOnly
                        precision={0.5}
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({book.reviewsCount || 0} reviews)
                      </Typography>
                    </Box>

                    {inLibrary && (
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={status}
                          label="Status"
                          onChange={(e) =>
                            updateBookStatus(book.googleBookId, e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="want-to-read">Want to Read</MenuItem>
                          <MenuItem value="reading">Reading</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </CardContent>
                  <CardActions>
                    {showPersonalLibrary ? (
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          removeFromPersonalLibrary(book.googleBookId)
                        }
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => addToPersonalLibrary(book.googleBookId)}
                        disabled={inLibrary}
                      >
                        {inLibrary ? "In Library" : "Add to Library"}
                      </Button>
                    )}
                    <Button
                      size="small"
                      onClick={() => setSelectedBook(book.googleBookId)}
                    >
                      Review
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <BookReviewDialog
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        bookId={selectedBook!}
      />
    </>
  );
}
