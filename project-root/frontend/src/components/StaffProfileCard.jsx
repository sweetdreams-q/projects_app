import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material';

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function StaffProfileCard({ staff }) {
  const researchInterests = staff.areasOfInterest ?? [];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2.2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 12px 24px rgba(30, 58, 138, 0.18)',
                flexShrink: 0,
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'rgba(255,255,255,0.18)',
                  color: 'common.white',
                  fontWeight: 800,
                }}
              >
                {getInitials(staff.name)}
              </Avatar>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {staff.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {staff.department}
              </Typography>
            </Box>
          </Stack>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Research Interests
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {researchInterests.map((interest) => (
                <Chip key={interest.id} label={interest.title} size="small" variant="outlined" color="secondary" />
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button component={RouterLink} to={`/staff/${staff.id}`} variant="contained" fullWidth>
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
}