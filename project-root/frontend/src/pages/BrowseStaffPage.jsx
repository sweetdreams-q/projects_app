import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';

import StaffProfileCard from '../components/StaffProfileCard';
import { staffData } from '../data/staffData';

export default function BrowseStaffPage() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3">Browse Staff</Typography>
        <Typography color="text.secondary">
          Explore staff profiles and open a detailed view to see interests and project ideas.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {staffData.map((staff) => (
          <Grid item xs={12} sm={6} lg={4} key={staff.id}>
            <StaffProfileCard staff={staff} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}