import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Chip, Stack, Typography, Button } from '@mui/material';

export default function StaffCard({ staff }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1.2}>
          <Typography variant="h6" fontWeight={800}>
            {staff.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {staff.role} · {staff.department}
          </Typography>
          <Typography variant="body2">
            {staff.bio}
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {staff.areasOfInterest.slice(0, 3).map((interest) => (
              <Chip key={interest.id} label={interest.title} size="small" color="secondary" variant="outlined" />
            ))}
          </Stack>
        </Stack>
      </CardContent>
      <Stack sx={{ p: 2, pt: 0 }}>
        <Button component={RouterLink} to={`/staff/${staff.id}`} variant="contained" fullWidth>
          View Profile
        </Button>
      </Stack>
    </Card>
  );
}