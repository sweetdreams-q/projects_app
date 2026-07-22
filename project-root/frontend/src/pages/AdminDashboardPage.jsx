import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  addInterest,
  addProject,
  deleteInterest,
  deleteProject,
  getInterests,
  getProjects,
  getStaff,
  updateInterest,
  updateProject,
} from '../services/api';

const emptyInterestForm = {
  id: null,
  staffId: '',
  title: '',
  description: '',
};

const emptyProjectForm = {
  id: null,
  staffId: '',
  title: '',
  description: '',
  tags: '',
};

export default function AdminDashboardPage() {
  const [staffList, setStaffList] = React.useState([]);
  const [interests, setInterests] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [interestDialogOpen, setInterestDialogOpen] = React.useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = React.useState(false);
  const [interestForm, setInterestForm] = React.useState(emptyInterestForm);
  const [projectForm, setProjectForm] = React.useState(emptyProjectForm);

  const loadDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const staffResponse = await getStaff();
      const staffWithData = await Promise.all(
        staffResponse.map(async (staff) => {
          const [staffInterests, staffProjects] = await Promise.all([
            getInterests(staff.id),
            getProjects(staff.id),
          ]);

          return {
            ...staff,
            areasOfInterest: staffInterests,
            projectIdeas: staffProjects,
          };
        }),
      );

      const allInterests = staffWithData.flatMap((staff) =>
        staff.areasOfInterest.map((interest) => ({
          ...interest,
          staffName: staff.name,
        })),
      );

      const allProjects = staffWithData.flatMap((staff) =>
        staff.projectIdeas.map((project) => ({
          ...project,
          staffName: staff.name,
        })),
      );

      setStaffList(staffWithData);
      setInterests(allInterests);
      setProjects(allProjects);
    } catch (loadError) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = React.useMemo(
    () => [
      { label: 'Staff Members', value: staffList.length },
      { label: 'Areas of Interest', value: interests.length },
      { label: 'Project Ideas', value: projects.length },
    ],
    [staffList.length, interests.length, projects.length],
  );

  const staffOptions = React.useMemo(
    () => staffList.map((staff) => ({ value: String(staff.id), label: staff.name })),
    [staffList],
  );

  const closeInterestDialog = () => {
    setInterestDialogOpen(false);
    setInterestForm(emptyInterestForm);
  };

  const closeProjectDialog = () => {
    setProjectDialogOpen(false);
    setProjectForm(emptyProjectForm);
  };

  const openAddInterestDialog = () => {
    setInterestForm(emptyInterestForm);
    setInterestDialogOpen(true);
  };

  const openEditInterestDialog = (interest) => {
    setInterestForm({
      id: interest.id,
      staffId: String(interest.staffId),
      title: interest.title ?? '',
      description: interest.description ?? '',
    });
    setInterestDialogOpen(true);
  };

  const openAddProjectDialog = () => {
    setProjectForm(emptyProjectForm);
    setProjectDialogOpen(true);
  };

  const openEditProjectDialog = (project) => {
    setProjectForm({
      id: project.id,
      staffId: String(project.staffId),
      title: project.title ?? '',
      description: project.description ?? '',
      tags: project.tags ?? '',
    });
    setProjectDialogOpen(true);
  };

  const handleSaveInterest = async (event) => {
    event.preventDefault();

    const payload = {
      staffId: Number(interestForm.staffId),
      title: interestForm.title.trim(),
      description: interestForm.description.trim(),
    };

    if (!payload.staffId || !payload.title || !payload.description) {
      setError('Please complete all interest fields.');
      return;
    }

    if (interestForm.id) {
      await updateInterest(interestForm.id, payload);
    } else {
      await addInterest(payload);
    }

    closeInterestDialog();
    await loadDashboard();
  };

  const handleSaveProject = async (event) => {
    event.preventDefault();

    const payload = {
      staffId: Number(projectForm.staffId),
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      tags: projectForm.tags.trim(),
    };

    if (!payload.staffId || !payload.title || !payload.description || !payload.tags) {
      setError('Please complete all project fields.');
      return;
    }

    if (projectForm.id) {
      await updateProject(projectForm.id, payload);
    } else {
      await addProject(payload);
    }

    closeProjectDialog();
    await loadDashboard();
  };

  const handleDeleteInterest = async (interestId) => {
    await deleteInterest(interestId);
    await loadDashboard();
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    await loadDashboard();
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3">Admin Dashboard</Typography>
        <Typography color="text.secondary">
          Manage interests and project ideas with dialog-based forms and responsive cards.
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={4} key={metric.label}>
            <Card>
              <CardContent>
                <Typography variant="h4">{loading ? '...' : metric.value}</Typography>
                <Typography color="text.secondary">{metric.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h5">Manage Interests</Typography>
                    <Typography color="text.secondary">Create, edit, and delete areas of interest.</Typography>
                  </Box>
                  <Button variant="contained" onClick={openAddInterestDialog}>
                    Add
                  </Button>
                </Stack>

                <Divider />

                <Grid container spacing={2}>
                  {interests.map((interest) => (
                    <Grid item xs={12} sm={6} key={interest.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography fontWeight={800}>{interest.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {interest.description}
                            </Typography>
                            <Chip label={interest.staffName} size="small" variant="outlined" />
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                          <Button size="small" onClick={() => openEditInterestDialog(interest)} startIcon={<EditIcon />}>
                            Edit
                          </Button>
                          <IconButton aria-label={`delete interest ${interest.title}`} onClick={() => handleDeleteInterest(interest.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h5">Manage Project Ideas</Typography>
                    <Typography color="text.secondary">Create, edit, and delete project idea cards.</Typography>
                  </Box>
                  <Button variant="contained" onClick={openAddProjectDialog}>
                    Add
                  </Button>
                </Stack>

                <Divider />

                <Grid container spacing={2}>
                  {projects.map((project) => (
                    <Grid item xs={12} key={project.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
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
                            <Chip label={project.staffName} size="small" color="secondary" variant="outlined" />
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                          <Button size="small" onClick={() => openEditProjectDialog(project)} startIcon={<EditIcon />}>
                            Edit
                          </Button>
                          <IconButton aria-label={`delete project ${project.title}`} onClick={() => handleDeleteProject(project.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={interestDialogOpen} onClose={closeInterestDialog} fullWidth maxWidth="sm">
        <DialogTitle>{interestForm.id ? 'Edit Interest' : 'Add Interest'}</DialogTitle>
        <Box component="form" onSubmit={handleSaveInterest}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="interest-staff-label">Staff Member</InputLabel>
                <Select
                  labelId="interest-staff-label"
                  label="Staff Member"
                  value={interestForm.staffId}
                  onChange={(event) => setInterestForm((current) => ({ ...current, staffId: event.target.value }))}
                >
                  {staffOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Title"
                value={interestForm.title}
                onChange={(event) => setInterestForm((current) => ({ ...current, title: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Description"
                value={interestForm.description}
                onChange={(event) => setInterestForm((current) => ({ ...current, description: event.target.value }))}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeInterestDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={projectDialogOpen} onClose={closeProjectDialog} fullWidth maxWidth="sm">
        <DialogTitle>{projectForm.id ? 'Edit Project Idea' : 'Add Project Idea'}</DialogTitle>
        <Box component="form" onSubmit={handleSaveProject}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="project-staff-label">Staff Member</InputLabel>
                <Select
                  labelId="project-staff-label"
                  label="Staff Member"
                  value={projectForm.staffId}
                  onChange={(event) => setProjectForm((current) => ({ ...current, staffId: event.target.value }))}
                >
                  {staffOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Title"
                value={projectForm.title}
                onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Description"
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                fullWidth
                multiline
                minRows={3}
              />
              <TextField
                label="Tags"
                helperText="Comma-separated tags"
                value={projectForm.tags}
                onChange={(event) => setProjectForm((current) => ({ ...current, tags: event.target.value }))}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeProjectDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}