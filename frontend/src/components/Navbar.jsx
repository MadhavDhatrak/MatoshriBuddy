import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  Badge,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount and route change
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogin = () => {
    navigate('/login');
    handleCloseNavMenu();
  };

  const handleSignup = () => {
    navigate('/register');
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
    handleCloseUserMenu();
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const navigationItems = [
    { name: 'Events', path: '/', icon: <EventIcon fontSize="small" /> },
    { name: 'Create Event', path: '/create-event', icon: <AddCircleOutlineIcon fontSize="small" /> },
  ];

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { name: 'Logout', action: handleLogout, icon: <LogoutIcon fontSize="small" /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      color="transparent" 
      elevation={isScrolled ? 2 : 0}
      sx={{ 
        backgroundColor: isScrolled ? alpha(theme.palette.background.paper, 0.95) : 'transparent',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease-in-out',
        borderBottom: isScrolled ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: { xs: 1, md: 1.2 } }}>
          {/* Logo - Desktop */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              fontSize: '1.7rem',
              color: 'primary.main',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
              fontFamily: "'Poppins', sans-serif",
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '6px',
                height: '6px',
                backgroundColor: 'secondary.main',
                borderRadius: '50%',
                bottom: '5px',
                right: '-8px'
              }
            }}
          >
            MatoshriBuddy
          </Typography>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ 
                color: 'text.primary',
                borderRadius: '8px',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ 
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  mt: 1.5,
                }
              }}
            >
              {navigationItems.map((item) => (
                <MenuItem 
                  key={item.name} 
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    borderRadius: '6px',
                    mx: 1,
                    my: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      color: 'primary.main',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '6px', 
                      p: 0.7,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      mr: 1.5
                    }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
              
              <Divider sx={{ my: 1.5, mx: 2 }} />
              
              {!isLoggedIn ? (
                <>
                  <MenuItem 
                    onClick={handleLogin}
                    sx={{
                      borderRadius: '6px',
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        color: 'primary.main',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '6px', 
                        p: 0.7,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        mr: 1.5
                      }}>
                        <LoginIcon fontSize="small" />
                      </Box>
                      <Typography sx={{ fontWeight: 500 }}>Login</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleSignup}
                    sx={{
                      borderRadius: '6px',
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        color: 'primary.main',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '6px', 
                        p: 0.7,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        mr: 1.5
                      }}>
                        <PersonAddIcon fontSize="small" />
                      </Box>
                      <Typography sx={{ fontWeight: 500 }}>Sign Up</Typography>
                    </Box>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem 
                    onClick={() => handleMenuClick('/dashboard')}
                    sx={{
                      borderRadius: '6px',
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        color: 'primary.main',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '6px', 
                        p: 0.7,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        mr: 1.5
                      }}>
                        <DashboardIcon fontSize="small" />
                      </Box>
                      <Typography sx={{ fontWeight: 500 }}>Dashboard</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      borderRadius: '6px',
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.light, 0.08),
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        color: 'error.main',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '6px', 
                        p: 0.7,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        mr: 1.5
                      }}>
                        <LogoutIcon fontSize="small" />
                      </Box>
                      <Typography sx={{ fontWeight: 500, color: 'error.main' }}>Logout</Typography>
                    </Box>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.4rem',
              letterSpacing: '-0.5px',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '5px',
                height: '5px',
                backgroundColor: 'secondary.main',
                borderRadius: '50%',
                bottom: '3px',
                right: '-6px'
              }
            }}
          >
            MatoshriBuddy
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  mx: 1.5,
                  px: 2,
                  py: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  fontWeight: 500,
                  opacity: 0.9,
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    opacity: 1,
                    transform: 'translateY(-2px)',
                  },
                  '&:after': location.pathname === item.path ? {
                    content: '""',
                    position: 'absolute',
                    height: '3px',
                    width: '30px',
                    backgroundColor: 'primary.main',
                    bottom: '5px',
                    left: 'calc(50% - 15px)',
                    borderRadius: '3px',
                  } : {},
                  borderRadius: '8px',
                }}
                startIcon={item.icon}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Login/Signup Buttons or User Menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {!isLoggedIn ? (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={handleLogin}
                  startIcon={<LoginIcon />}
                  sx={{ 
                    fontWeight: 500, 
                    borderRadius: '8px',
                    px: 2.5,
                    py: 1,
                    borderWidth: '1.5px',
                    '&:hover': {
                      borderWidth: '1.5px',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSignup}
                  startIcon={<PersonAddIcon />}
                  sx={{ 
                    fontWeight: 500, 
                    borderRadius: '8px',
                    px: 2.5,
                    py: 1,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 15px ${alpha(theme.palette.primary.main, 0.35)}`
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            ) : (
              <>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 2, 
                    display: { xs: 'none', md: 'block' }, 
                    color: 'text.secondary',
                    fontWeight: 500,
                    opacity: 0.8
                  }}
                >
                  Welcome back
                </Typography>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0.5,
                      border: '2px solid',
                      borderColor: alpha(theme.palette.primary.light, 0.6),
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        width: 40,
                        height: 40
                      }}
                    >
                      <AccountCircleIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ 
                    mt: '45px',
                    '& .MuiPaper-root': {
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: -6,
                        right: 14,
                        width: 12,
                        height: 12,
                        backgroundColor: 'background.paper',
                        transform: 'rotate(45deg)',
                        borderTop: '1px solid',
                        borderLeft: '1px solid',
                        borderColor: 'divider',
                        zIndex: 0,
                      }
                    }
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userMenuItems.map((item) => (
                    <MenuItem 
                      key={item.name} 
                      onClick={item.action ? item.action : () => handleMenuClick(item.path)}
                      sx={{
                        borderRadius: '6px',
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: item.name === 'Logout' 
                            ? alpha(theme.palette.error.light, 0.08)
                            : alpha(theme.palette.primary.main, 0.08),
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
                        <Box sx={{ 
                          color: item.name === 'Logout' ? 'error.main' : 'primary.main',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '6px', 
                          p: 0.7,
                          backgroundColor: item.name === 'Logout' 
                            ? alpha(theme.palette.error.main, 0.1)
                            : alpha(theme.palette.primary.main, 0.1),
                          mr: 1.5
                        }}>
                          {item.icon}
                        </Box>
                        <Typography sx={{ 
                          fontWeight: 500,
                          color: item.name === 'Logout' ? 'error.main' : 'text.primary',
                        }}>
                          {item.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;