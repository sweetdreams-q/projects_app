import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import NavigationBar from './NavigationBar';

export default function AppLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, rgba(30,58,138,0.10), transparent 35%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)',
      }}
    >
      <NavigationBar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}