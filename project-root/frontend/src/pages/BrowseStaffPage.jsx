import React from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import StaffProfileCard from '../components/StaffProfileCard';
import { getInterests, getStaff } from '../services/api';

export default function BrowseStaffPage() {
  const [staffList, setStaffList] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedInterest, setSelectedInterest] = React.useState('all');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    async function loadStaff() {
      try {
        setLoading(true);
        setError('');

        const staffResponse = await getStaff();
        const enrichedStaff = await Promise.all(
          staffResponse.map(async (staff) => {
            const interests = await getInterests(staff.id);

            return {
              ...staff,
              areasOfInterest: interests.map((interest) => ({
                id: interest.id,
                title: interest.title,
                description: interest.description,
              })),
            };
          }),
        );

        if (isMounted) {
          setStaffList(enrichedStaff);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Failed to load staff. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStaff();

    return () => {
      isMounted = false;
    };
  }, []);

  const interestOptions = React.useMemo(() => {
    const titles = staffList.flatMap((staff) => staff.areasOfInterest?.map((interest) => interest.title) ?? []);
    return ['all', ...new Set(titles)].sort((a, b) => {
      if (a === 'all') return -1;
      if (b === 'all') return 1;
      return a.localeCompare(b);
    });
  }, [staffList]);

  const filteredStaff = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return staffList.filter((staff) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        staff.name.toLowerCase().includes(normalizedQuery) ||
        staff.department.toLowerCase().includes(normalizedQuery) ||
        (staff.areasOfInterest ?? []).some((interest) => interest.title.toLowerCase().includes(normalizedQuery));

      const matchesInterest =
        selectedInterest === 'all' ||
        (staff.areasOfInterest ?? []).some((interest) => interest.title === selectedInterest);

      return matchesSearch && matchesInterest;
    });
  }, [searchQuery, selectedInterest, staffList]);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3">Browse Staff</Typography>
        <Typography color="text.secondary">
          Explore staff profiles and filter by name or research interest.
        </Typography>
      </Stack>

      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={7}>
          <TextField
            fullWidth
            label="Search staff"
            placeholder="Search by name, department, or interest"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            select
            label="Filter by interest"
            value={selectedInterest}
            onChange={(event) => setSelectedInterest(event.target.value)}
          >
            <MenuItem value="all">All Interests</MenuItem>
            {interestOptions
              .filter((interest) => interest !== 'all')
              .map((interest) => (
                <MenuItem key={interest} value={interest}>
                  {interest}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'error.lighter', border: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : filteredStaff.length === 0 ? (
        <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px dashed', borderColor: 'divider' }}>
          <Typography color="text.secondary">No staff match your filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredStaff.map((staff) => (
            <Grid item xs={12} sm={6} lg={4} key={staff.id}>
              <StaffProfileCard staff={staff} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}