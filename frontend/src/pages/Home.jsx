import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Button,
  CardActions,
  Chip,
  Stack,
  Paper,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { styled, keyframes, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';

// Sample event images for each category
const categoryImages = {
  academic: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  cultural: 'https://images.unsplash.com/photo-1508904565972-168b36603296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  technical: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  other: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
};

// Hero carousel images
const carouselImages = [
  {
    img: 'https://tse2.mm.bing.net/th/id/OIP.Jz10N_W1SOv6hpHJMlJUtQHaED?w=4080&h=2233&rs=1&pid=ImgDetMain',
    title: 'Tech Innovation Summit',
    description: 'Join cutting-edge workshops and collaborate with industry experts',
  },
  {
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Cultural Festival',
    description: 'Experience diverse performances and artistic expressions',
  },
  {
    img: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Academic Excellence',
    description: 'Elevate your knowledge through interactive learning experiences',
  },
];

// Animation keyframes
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
`;

const slideIn = keyframes`
  0% { transform: translateX(50px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 5px rgba(30, 136, 229, 0.5); }
  50% { text-shadow: 0 0 20px rgba(30, 136, 229, 0.8), 0 0 30px rgba(30, 136, 229, 0.5); }
  100% { text-shadow: 0 0 5px rgba(30, 136, 229, 0.5); }
`;

// Animated text options for "You can..."
const animatedTextOptions = [
  "participate",
  "create",
  "learn",
  "connect",
  "discover",
];

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [animationState, setAnimationState] = useState('visible');

  useEffect(() => {
    fetchEvents();
    
    // Auto-advance carousel
    const carouselInterval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    
    // Text animation logic
    const textAnimationInterval = setInterval(() => {
      setAnimationState('hidden');
      
      setTimeout(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % animatedTextOptions.length);
        setAnimationState('visible');
      }, 500); // Wait for fade out animation to complete
    }, 3000); // Change text every 3 seconds
    
    return () => {
      clearInterval(carouselInterval);
      clearInterval(textAnimationInterval);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/events/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleNextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
  };

  const HeroCarousel = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '90vh',
    overflow: 'hidden',
    marginBottom: theme.spacing(6),
  }));

  const CarouselSlide = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    transition: 'opacity 1.5s ease-in-out, transform 5s ease-in-out',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transform: 'scale(1.05)',
    '&.active': {
      opacity: 1,
      transform: 'scale(1)'
    },
  }));

  const CarouselContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(10, 0),
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)',
    color: theme.palette.common.white,
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }));

  const AnimatedText = styled(Box)(({ theme, state }) => ({
    display: 'inline-block',
    minWidth: '180px',
    textAlign: 'center',
    animation: state === 'visible' 
      ? `${fadeIn} 0.5s forwards, ${glow} 2s infinite 0.5s` 
      : `${fadeOut} 0.5s forwards`,
    fontWeight: 700,
    color: theme.palette.primary.main,
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    padding: '0 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(4px)',
  }));

  const CarouselControls = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: '50%',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
  }));

  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.common.white,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      transform: 'scale(1.1)'
    },
  }));

  const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
    },
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
  }));

  const CategoryBadge = styled(Chip)(({ theme, color }) => ({
    position: 'absolute',
    top: '12px',
    right: '12px',
    fontWeight: 'bold',
    zIndex: 1,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(4px)',
    backgroundColor: alpha(theme.palette.primary.main, 0.85),
    color: '#fff',
  }));

  const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    fontWeight: 600,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '60px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
    },
  }));

  const Footer = styled('footer')(({ theme }) => ({
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    padding: theme.spacing(8, 0),
    marginTop: 'auto',
  }));

  const StatusChip = styled(Chip)(({ theme, status }) => {
    const statusColors = {
      upcoming: theme.palette.primary.main,
      ongoing: theme.palette.success.main,
      completed: theme.palette.info.main,
      cancelled: theme.palette.error.main,
    };
    
    return {
      position: 'absolute',
      top: '12px',
      left: '12px',
      fontWeight: 'bold',
      zIndex: 1,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(4px)',
      backgroundColor: alpha(statusColors[status] || theme.palette.grey[500], 0.85),
      color: '#fff',
    };
  });

  // Additional styled components for hero section
  const HeroTitle = styled(Typography)(({ theme }) => ({
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 800,
    letterSpacing: '-0.5px',
    textShadow: '0 4px 15px rgba(0,0,0,0.7)',
    marginBottom: theme.spacing(2),
    opacity: 0,
    animation: `${fadeIn} 1s forwards 0.3s`,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '2px'
    }
  }));

  const HeroSubtitle = styled(Typography)(({ theme }) => ({
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    letterSpacing: '0.5px',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
    marginBottom: theme.spacing(2),
    opacity: 0,
    animation: `${fadeIn} 1s forwards 0.6s`,
  }));

  const HeroButton = styled(Button)(({ theme, variant, delay = 0 }) => ({
    borderRadius: '30px',
    padding: theme.spacing(1.5, 4),
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: '0.5px',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    boxShadow: variant === 'contained' ? '0 4px 14px rgba(0,0,0,0.25)' : 'none',
    opacity: 0,
    animation: `${fadeIn} 1s forwards ${0.9 + delay}s`,
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: variant === 'contained' 
        ? '0 6px 20px rgba(0,0,0,0.3)' 
        : '0 4px 14px rgba(255,255,255,0.2)',
    }
  }));

  const AnimatedCard = styled(Card)(({ theme, index = 0 }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    opacity: 0,
    animation: `${fadeIn} 0.5s forwards ${0.2 * index}s, ${pulse} 2s infinite ${2 + 0.2 * index}s`,
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
    },
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hero Carousel */}
      <HeroCarousel>
        {carouselImages.map((slide, index) => (
          <CarouselSlide
            key={index}
            className={index === carouselIndex ? 'active' : ''}
            sx={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${slide.img})`,
            }}
          />
        ))}
        <CarouselContent>
          <Container maxWidth="lg">
            <HeroTitle variant="h2" component="h1">
              Welcome to MatoshriBuddy
            </HeroTitle>
            <HeroSubtitle variant="h4" paragraph>
              You can{' '}
              <AnimatedText state={animationState} component="span">
                {animatedTextOptions[textIndex]}
              </AnimatedText>{' '}
              now with us
            </HeroSubtitle>
            <Stack direction="row" spacing={3} sx={{ mt: 5, justifyContent: 'center' }}>
              <HeroButton 
                variant="contained" 
                size="large" 
                color="primary" 
                onClick={() => navigate('/login')}
              >
                Login
              </HeroButton>
              <HeroButton 
                variant="outlined" 
                size="large" 
                color="inherit"
                onClick={() => navigate('/register')}
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white' } }}
                delay={0.1}
              >
                Sign Up
              </HeroButton>
            </Stack>
            {/* Carousel Indicators */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: '40px', 
              left: 0, 
              right: 0, 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1
            }}>
              {carouselImages.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  sx={{
                    width: index === carouselIndex ? '35px' : '12px',
                    height: '12px',
                    borderRadius: '10px',
                    backgroundColor: index === carouselIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: index === carouselIndex ? 'primary.main' : 'rgba(255,255,255,0.8)',
                    }
                  }}
                />
              ))}
            </Box>
          </Container>
        </CarouselContent>
        <CarouselControls>
          <StyledIconButton onClick={handlePrevSlide}>
            <KeyboardArrowLeftIcon fontSize="large" />
          </StyledIconButton>
          <StyledIconButton onClick={handleNextSlide}>
            <KeyboardArrowRightIcon fontSize="large" />
          </StyledIconButton>
        </CarouselControls>
      </HeroCarousel>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle variant="h3" component="h2">
          Discover Events
        </SectionTitle>
        
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                sx: { borderRadius: '30px', pr: 0 },
                endAdornment: (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{ borderRadius: '0 30px 30px 0', px: 3, height: '56px' }}
                  >
                    <SearchIcon />
                  </Button>
                ),
              }}
            />
          </Box>
          
          <Grid container spacing={4}>
            {events.map((event, index) => (
              <Grid item key={event._id} xs={12} sm={6} md={4}>
                <AnimatedCard index={index}>
                  <CategoryBadge 
                    label={event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    color="primary"
                  />
                  {event.status && (
                    <StatusChip 
                      label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      status={event.status}
                      size="small"
                    />
                  )}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image ? `http://localhost:5000${event.image}` : categoryImages[event.category] || 'https://source.unsplash.com/random?event'}
                      alt={event.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      height: '60px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                    }} />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, fontSize: '1.25rem' }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, opacity: 0.8 }}>
                      {event.description.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                    </Typography>
                    
                    <Stack spacing={1.5} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1), 
                          borderRadius: '50%', 
                          p: 0.7,
                          display: 'flex'
                        }}>
                          <CalendarTodayIcon fontSize="small" color="primary" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1), 
                          borderRadius: '50%', 
                          p: 0.7,
                          display: 'flex'
                        }}>
                          <LocationOnIcon fontSize="small" color="primary" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1), 
                          borderRadius: '50%', 
                          p: 0.7,
                          display: 'flex'
                        }}>
                          <PeopleIcon fontSize="small" color="primary" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {event.currentParticipants}/{event.maxParticipants} participants
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate(`/event/${event._id}`)}
                      sx={{ 
                        borderRadius: '30px',
                        py: 1.2,
                        fontWeight: 600,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </AnimatedCard>
              </Grid>
            ))}
            
            {events.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No events found. Try a different search or check back later!
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Footer>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                About MatoshriBuddy
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                Your one-stop platform for discovering and participating in college events.
                Connect, engage, and make the most of your college experience.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', opacity: 0.8 }} onClick={() => navigate('/')}>All Events</Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', opacity: 0.8 }} onClick={() => navigate('/create-event')}>Create Event</Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', opacity: 0.8 }} onClick={() => navigate('/about')}>About Us</Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                📧 info@matoshribuddy.com
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                📞 +91 123 456 7890
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                📍 Mumbai, Maharashtra
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} MatoshriBuddy. All rights reserved.
          </Typography>
        </Container>
      </Footer>
    </Box>
  );
}

export default Home;