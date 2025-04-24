import React from 'react';
import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  CardMedia,
  Chip,
  Divider,
  Avatar,
  Stack,
  Paper,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';

function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState({ createdEvents: [], registeredEvents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Get user profile data
        let profileData = null;
        try {
          const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          profileData = profileResponse.data.data;
          setUserData(profileData);
        } catch (profileErr) {
          console.error('Profile fetch error:', profileErr);
          // Continue with dashboard even if profile fetch fails
        }

        // Get dashboard events
        try {
          const dashboardResponse = await axios.get('http://localhost:5000/api/events/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setEvents(dashboardResponse.data.data);
        } catch (dashErr) {
          console.error('Dashboard fetch error:', dashErr);
          setError('Failed to fetch events data. Please try again later.');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEventImage = (event) => {
    if (event.image) return `http://localhost:5000${event.image}`;
    
    const categoryImages = {
      academic: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3',
      cultural: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3',
      sports: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3',
      technical: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3',
      other: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3',
    };
    
    return categoryImages[event.category] || 'https://source.unsplash.com/random?event';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      upcoming: 'primary',
      ongoing: 'success',
      completed: 'info',
      cancelled: 'error',
    };
    return statusColors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const currentEvents = tabValue === 0 ? events.createdEvents || [] : events.registeredEvents || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {userData && (
        <Paper elevation={2} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main', 
                    fontSize: '2rem',
                  }}
                >
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </Box>
            </Grid>
            <Grid item xs={12} md={10}>
              <Box sx={{ pl: { md: 2 }, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  {userData.name || 'User'}
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ 
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {userData.email || 'No email provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {events.createdEvents?.length || 0} Events Created
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {events.registeredEvents?.length || 0} Events Registered
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="600">
          My Events
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateEvent}
          sx={{ borderRadius: '30px', px: 3 }}
        >
          Create New Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: '100%', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': { fontWeight: 600 }
          }}
        >
          <Tab label="Events I Created" />
          <Tab label="Events I Registered" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                borderRadius: '10px',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}>
                <Box sx={{ position: 'absolute', top: -10, right: 20, zIndex: 1 }}>
                  <Chip 
                    label={event.status.charAt(0).toUpperCase() + event.status.slice(1)} 
                    color={getStatusColor(event.status)} 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </Box>
                <CardMedia
                  component="img"
                  height="160"
                  image={getEventImage(event)}
                  alt={event.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h2" fontWeight="600">
                      {event.title}
                    </Typography>
                    <Chip 
                      label={event.category.charAt(0).toUpperCase() + event.category.slice(1)} 
                      color="primary" 
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {event.currentParticipants}/{event.maxParticipants} participants
                      </Typography>
                    </Box>
                  </Stack>
                  
                  {event.organizer && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 1.5 }} />
                      <Tooltip title="Organizer">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            {event.organizer.name || 'Unknown organizer'}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  )}
                  
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {event.description && event.description.substring(0, 80)}
                    {event.description && event.description.length > 80 ? '...' : ''}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleViewDetails(event._id)}
                    sx={{ borderRadius: '30px' }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box textAlign="center" py={6} px={2} sx={{ 
              backgroundColor: 'rgba(0,0,0,0.03)', 
              borderRadius: '10px',
              border: '1px dashed rgba(0,0,0,0.1)' 
            }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {tabValue === 0 
                  ? "You haven't created any events yet." 
                  : "You haven't registered for any events yet."}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2, borderRadius: '30px', px: 3 }}
                onClick={tabValue === 0 ? handleCreateEvent : () => navigate('/')}
              >
                {tabValue === 0 ? "Create Your First Event" : "Browse Events"}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;