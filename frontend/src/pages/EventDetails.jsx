import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
  Skeleton,
  CircularProgress,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  Group,
  Category,
  Person,
  ArrowBack,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';

// Styled components for EventDetails
const EventImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '16px 16px 0 0',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '150px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  }
}));

const EventContainer = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: '16px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
}));

const EventHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  position: 'relative',
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 600,
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
}));

const StyledAvatar = styled(Avatar)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.primary.main,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  border: `1px solid ${theme.palette.divider}`,
}));

const BackButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(4),
  left: theme.spacing(4),
  zIndex: 10,
  backgroundColor: alpha(theme.palette.common.white, 0.8),
  backdropFilter: 'blur(4px)',
  color: theme.palette.text.primary,
  fontWeight: 600,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  }
}));

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(response.data.data);
      setError('');
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError('Error fetching event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.post(
        `http://localhost:5000/api/events/${id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Successfully registered for the event!');
      // Refresh event details after successful registration
      await fetchEventDetails();
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 400) {
        setError(error.response.data.message || 'Failed to register for this event');
      } else {
        setError('Failed to register for this event. Please try again later.');
      }
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <BackButton 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
        >
          Back
        </BackButton>
        <Card sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
          <Skeleton variant="rectangular" height={400} animation="wave" />
          <Box sx={{ p: 4 }}>
            <Skeleton variant="text" height={60} width="60%" animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={20} animation="wave" />
            <Skeleton variant="text" height={20} animation="wave" />
            <Skeleton variant="text" height={20} animation="wave" />
            <Skeleton variant="text" height={20} width="80%" animation="wave" sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Skeleton variant="rectangular" height={200} animation="wave" sx={{ mb: 2, borderRadius: 2 }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={200} animation="wave" sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    );
  }

  if (error && !event) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ borderRadius: '8px' }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!event) return null;

  return (
    <Container sx={{ py: 4 }}>
      <BackButton 
        variant="contained" 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
      >
        Back
      </BackButton>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            mt: 2, 
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 4, 
            mt: 2, 
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          {success}
        </Alert>
      )}

      <EventContainer>
        <EventImage>
          <img
            src={event.image ? `http://localhost:5000${event.image}` : 'https://source.unsplash.com/random?event'}
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </EventImage>

        <EventHeader>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {event.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                <StyledChip 
                  label={event.category.charAt(0).toUpperCase() + event.category.slice(1)} 
                  color="primary" 
                  icon={<Category fontSize="small" />}
                />
                <StyledChip
                  label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  color={
                    event.status === 'upcoming' ? 'success' : 
                    event.status === 'ongoing' ? 'info' : 
                    event.status === 'completed' ? 'default' : 'error'
                  }
                />
                <StyledChip
                  label={`${event.currentParticipants}/${event.maxParticipants} participants`}
                  color={event.currentParticipants >= event.maxParticipants ? 'error' : 'success'}
                  icon={<Group fontSize="small" />}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <List>
                  <StyledListItem>
                    <ListItemAvatar>
                      <StyledAvatar bgcolor="#e3f2fd">
                        <EventIcon sx={{ color: 'primary.main' }} />
                      </StyledAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1" fontWeight={600}>Date and Time</Typography>}
                      secondary={formatDate(event.date)}
                    />
                  </StyledListItem>

                  <StyledListItem>
                    <ListItemAvatar>
                      <StyledAvatar bgcolor="#fff8e1">
                        <LocationOn sx={{ color: 'warning.main' }} />
                      </StyledAvatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={<Typography variant="subtitle1" fontWeight={600}>Location</Typography>}
                      secondary={event.location} 
                    />
                  </StyledListItem>

                  <StyledListItem>
                    <ListItemAvatar>
                      <StyledAvatar bgcolor="#f5f5f5">
                        <Person sx={{ color: 'text.primary' }} />
                      </StyledAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1" fontWeight={600}>Organizer</Typography>}
                      secondary={event.organizer?.name || 'Unknown'}
                    />
                  </StyledListItem>
                </List>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  About this event
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>{event.description}</Typography>
              </Box>

              {event.currentParticipants < event.maxParticipants ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleRegister}
                  disabled={registering}
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    px: 4,
                    borderRadius: '30px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {registering ? <CircularProgress size={24} color="inherit" /> : 'Register for Event'}
                </Button>
              ) : (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                  This event has reached its maximum capacity.
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ p: 2.5, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Registered Participants ({event.registeredUsers?.length || 0})
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                {event.registeredUsers?.length > 0 ? (
                  <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {event.registeredUsers.map((user) => (
                      <ListItem key={user._id} sx={{ px: 1, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={user.name} 
                          secondary={user.email} 
                          primaryTypographyProps={{ fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    No participants have registered yet.
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </EventHeader>
      </EventContainer>
    </Container>
  );
}

export default EventDetails;