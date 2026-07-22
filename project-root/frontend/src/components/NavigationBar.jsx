import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Browse Staff', to: '/staff' },
  { label: 'Admin Dashboard', to: '/admin' },
];

export default function NavigationBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const location = useLocation();

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const navButtonStyles = (path) => ({
    color: location.pathname === path ? 'primary.main' : 'text.primary',
    fontWeight: location.pathname === path ? 800 : 600,
  });

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 800 }}>
          Student Hub
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)} aria-label="open navigation menu">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box sx={{ width: 280, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
                  Navigation
                </Typography>
                <List>
                  {navItems.map((item) => (
                    <ListItemButton
                      key={item.to}
                      component={RouterLink}
                      to={item.to}
                      onClick={toggleDrawer(false)}
                      selected={location.pathname === item.to}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {navItems.map((item) => (
              <Button key={item.to} component={RouterLink} to={item.to} sx={navButtonStyles(item.to)}>
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}