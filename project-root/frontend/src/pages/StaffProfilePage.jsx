import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import { getInterests, getProjects, getStaffById } from '../services/api';

export default function StaffProfilePage() {
  const { staffId } = useParams();
  const [staff, setStaff] = React.useState(null);
  const [interests, setInterests] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    async function loadStaffProfile() {
      try {
        setLoading(true);
        setError('');

        const [staffResponse, interestsResponse, projectsResponse] = await Promise.all([
          getStaffById(staffId),
          getInterests(staffId),
          getProjects(staffId),
        ]);

        if (!isMounted) {
          return;
        }

        setStaff(staffResponse);
        setInterests(interestsResponse);
        setProjects(projectsResponse);
      } catch (loadError) {
        if (isMounted) {
          setError('Failed to load staff profile. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStaffProfile();

    return () => {
      isMounted = false;
    };
  }, [staffId]);

  if (loading) {
    return (
      <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4">Staff profile</Typography>
        <Typography color="error">{error}</Typography>
        <Button component={RouterLink} to="/staff" variant="contained">
          Back to Browse
        </Button>
      </Stack>
    );
  }

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
                {staff.department}
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
                  {interests.map((interest) => (
                    <Chip key={interest.id} label={interest.title} color="primary" />
                  ))}
                </Stack>
                <Divider />
                <Stack spacing={1.5}>
                  {interests.map((interest) => (
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
                <Grid container spacing={2}>
                  {projects.map((project) => (
                    <Grid item xs={12} key={project.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1.25}>
                            <Typography fontWeight={800}>{project.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {project.description}
                            </Typography>
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                              {String(project.tags || '')
                                .split(',')
                                .map((tag) => tag.trim())
                                .filter(Boolean)
                                .map((tag) => (
                                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                                ))}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}