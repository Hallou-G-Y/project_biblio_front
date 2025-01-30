'use client';

import { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function BookSearch() {
  const { query, setQuery } = useLibrary()
  const { searchBooks, loading } = useLibrary();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchBooks(query.trim());
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
}