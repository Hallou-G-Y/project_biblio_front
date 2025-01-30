'use client';

import { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Rating,
  Box,
  Typography,
} from '@mui/material';

interface BookReviewDialogProps {
  open: boolean;
  onClose: () => void;
  bookId: string;
}

export function BookReviewDialog({ open, onClose, bookId }: BookReviewDialogProps) {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const { addReview } = useLibrary();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating && comment.trim()) {
      console.log('rating = ', rating);
      await addReview(bookId, rating, comment.trim());
      onClose();
      setRating(0);
      setComment('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              precision={0.5}
            />
          </Box>
          
          <TextField
            fullWidth
            label="Your Review"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
            required
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={!rating || !comment.trim()}
          >
            Submit Review
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}