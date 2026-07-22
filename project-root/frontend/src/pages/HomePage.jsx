import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';

const highlights = [
  { value: '24', label: 'staff profiles' },
  { value: '80+', label: 'areas of interest' },
  { value: '40+', label: 'project ideas' },
];

export default function HomePage() {
  return (
    <Stack spacing={4}>
      <Box
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          color: 'common.white',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)',
          boxShadow: 6,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.9 }}>
                Campus Staff Explorer
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '4rem' } }}>
                Find people, ideas, and opportunities in one place.
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 680, opacity: 0.92 }}>
                Browse staff profiles, open their area of interest pages, and jump into project ideas with a responsive interface built for students.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={RouterLink} to="/staff" variant="contained" color="secondary" size="large">
                  Browse Staff
                </Button>
                <Button component={RouterLink} to="/admin" variant="outlined" size="large" sx={{ color: 'common.white', borderColor: 'rgba(255,255,255,0.6)' }}>
                  Admin Dashboard
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              {highlights.map((item) => (
                <Grid item xs={12} sm={4} md={12} key={item.label}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'common.white', backdropFilter: 'blur(10px)' }}>
                    <CardContent>
                      <Typography variant="h3" component="p">
                        {item.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {item.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}