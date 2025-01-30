'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { BookSearch } from '@/components/BookSearch';
import { BookList } from '@/components/BookList';
import { AuthDialog } from '@/components/AuthDialog';
import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        my: 4, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Virtual Library
          </Typography>
          {isAuthenticated && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
        
        {!isAuthenticated ? (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Join our virtual library to start your reading journey
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => setAuthOpen(true)}
            >
              Get Started
            </Button>
            <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
          </Box>
        ) : (
          <>
            <BookSearch />
            <BookList />
          </>
        )}
      </Box>
    </Container>
  );
}