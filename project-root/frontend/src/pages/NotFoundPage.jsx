import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h3">404</Typography>
      <Typography color="text.secondary">The page you’re looking for does not exist.</Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Go Home
      </Button>
    </Stack>
  );
}