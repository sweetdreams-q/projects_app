import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from '@mui/material';

import { getStaffById } from '../data/staffData';

export default function StaffProfilePage() {
  const { staffId } = useParams();
  const staff = getStaffById(Number(staffId));

  if (!staff) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4">Staff profile not found</Typography>
        <Button component={RouterLink} to="/staff" variant="contained">
          Back to Browse
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={RouterLink} to="/staff" variant="text" sx={{ px: 0 }}>
          Back to Browse
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h3">{staff.name}</Typography>
              <Typography color="text.secondary">
                {staff.role} · {staff.department}
              </Typography>
            </Stack>
            <Typography>{staff.bio}</Typography>
            <Typography variant="body2" color="text.secondary">
              {staff.email}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5">Areas of Interest</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {staff.areasOfInterest.map((interest) => (
                    <Chip key={interest.id} label={interest.title} color="primary" />
                  ))}
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  {staff.areasOfInterest.map((interest) => (
                    <Box key={interest.id}>
                      <Typography fontWeight={700}>{interest.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {interest.description}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5">Project Ideas</Typography>
                <Stack spacing={1.5}>
                  {staff.projectIdeas.map((project) => (
                    <Card key={project.id} variant="outlined">
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography fontWeight={800}>{project.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.description}
                          </Typography>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {project.tags.split(',').map((tag) => (
                              <Chip key={tag.trim()} label={tag.trim()} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}