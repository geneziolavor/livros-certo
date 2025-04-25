import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Início', path: '/', icon: <HomeIcon /> },
  { text: 'Alunos', path: '/alunos', icon: <PeopleIcon /> },
  { text: 'Professores', path: '/professores', icon: <SchoolIcon /> },
  { text: 'Livros', path: '/livros', icon: <BookIcon /> },
  { text: 'Horários', path: '/horarios', icon: <ScheduleIcon /> },
  { text: 'Lembretes', path: '/lembretes', icon: <NotificationsIcon /> },
];

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 250,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        height: '100%',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Livros Certo
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
              },
              my: 0.5,
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ boxShadow: 2 }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Livros Certo
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, ml: 2, fontWeight: 'bold' }}
              >
                LIVROS CERTO - Escola Professor Pedro Teixeira Barroso
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      mx: 0.5,
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      borderBottom:
                        location.pathname === item.path
                          ? `2px solid ${theme.palette.secondary.main}`
                          : 'none',
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 