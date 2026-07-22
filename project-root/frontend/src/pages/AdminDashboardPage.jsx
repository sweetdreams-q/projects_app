import React from 'react';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

import { staffData } from '../data/staffData';

const metrics = [
  { label: 'Staff Members', value: staffData.length },
  { label: 'Areas of Interest', value: staffData.reduce((total, staff) => total + staff.areasOfInterest.length, 0) },
  { label: 'Project Ideas', value: staffData.reduce((total, staff) => total + staff.projectIdeas.length, 0) },
];

export default function AdminDashboardPage() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3">Admin Dashboard</Typography>
        <Typography color="text.secondary">
          Quick overview of the directory, with a simple layout for future management tools.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={4} key={metric.label}>
            <Card>
              <CardContent>
                <Typography variant="h4">{metric.value}</Typography>
                <Typography color="text.secondary">{metric.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Management Notes
          </Typography>
          <Typography color="text.secondary">
            This dashboard is intentionally simple and responsive, leaving room for CRUD controls,
            filters, and analytics later.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}