import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  FormHelperText,
  Stack,
  LinearProgress,
  Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const categories = ['academic', 'cultural', 'sports', 'technical', 'other'];
const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: null,
    location: '',
    maxParticipants: '',
    category: '',
    status: 'upcoming',
    image: null,
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    // Title validation
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
      formIsValid = false;
    }

    // Description validation
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
      formIsValid = false;
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
      formIsValid = false;
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date and time are required';
      formIsValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.date = 'Date must be in the future';
        formIsValid = false;
      }
    }

    // Location validation
    if (!formData.location || !formData.location.trim()) {
      newErrors.location = 'Location is required';
      formIsValid = false;
    }

    // Max participants validation
    if (!formData.maxParticipants) {
      newErrors.maxParticipants = 'Maximum participants is required';
      formIsValid = false;
    } else if (parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = 'Maximum participants must be greater than 0';
      formIsValid = false;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
      formIsValid = false;
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = 'Status is required';
      formIsValid = false;
    }

    console.log("Form validation errors:", newErrors);
    console.log("Form data being validated:", formData);
    
    setErrors(newErrors);
    return formIsValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }
      
      if (errors.image) {
        setErrors({ ...errors, image: '' });
      }
      
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any previous submission error
    setError('');
    
    // Validate form
    if (!validateForm()) {
      console.error("Form validation failed");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Create form data for multipart/form-data
      const eventFormData = new FormData();
      
      // Make sure date is formatted properly
      const formattedData = {
        ...formData,
        date: formData.date instanceof Date ? formData.date.toISOString() : formData.date,
        maxParticipants: Number(formData.maxParticipants) // Ensure maxParticipants is a number
      };
      
      // Log what we're sending
      console.log("Raw form data:", formData);
      console.log("Formatted data for submission:", formattedData);
      
      // Add all form fields
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] !== null && formattedData[key] !== undefined) {
          if (key === 'image' && formattedData[key] instanceof File) {
            eventFormData.append(key, formattedData[key]);
          } else if (key !== 'image') {
            eventFormData.append(key, String(formattedData[key]));
          }
        }
      });
      
      // Log FormData entries for debugging
      for (let pair of eventFormData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post('http://localhost:5000/api/events', eventFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Event creation successful:", response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      
      if (error.response?.data) {
        console.error('Server response:', error.response.data);
      }
      
      // Extract validation errors from Mongoose
      if (error.response?.data?.message && error.response.data.message.includes('validation failed')) {
        // This indicates a Mongoose validation error
        const validationErrors = {};
        
        // Try to extract the validation error message
        const errorMsg = error.response.data.message;
        
        // Check for common Mongoose validation error patterns
        if (errorMsg.includes('Path `title` is required')) {
          validationErrors.title = 'Title is required';
        }
        if (errorMsg.includes('Path `description` is required')) {
          validationErrors.description = 'Description is required';
        }
        if (errorMsg.includes('Path `location` is required')) {
          validationErrors.location = 'Location is required';
        }
        if (errorMsg.includes('Path `date` is required')) {
          validationErrors.date = 'Date is required';
        }
        if (errorMsg.includes('Path `category` is required')) {
          validationErrors.category = 'Category is required';
        }
        if (errorMsg.includes('Path `maxParticipants` is required')) {
          validationErrors.maxParticipants = 'Maximum participants is required';
        }
        
        // Set the validation errors
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        } else {
          // If we couldn't parse specific errors, show a general message
          setError('Validation failed. Please check your inputs.');
        }
      } else if (error.response?.data?.message) {
        // Show the specific error message from the server
        setError(error.response.data.message);
      } else {
        // Generic error message
        setError('Error creating event. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
          Create New Event
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {submitting && <LinearProgress sx={{ mb: 4 }} />}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (min 20 characters)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description || `${formData.description.length}/20 characters minimum`}
                multiline
                rows={4}
                disabled={submitting}
                required
                placeholder="Please provide a detailed description of your event (minimum 20 characters required)"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Event Date and Time"
                  value={formData.date}
                  onChange={(newValue) => {
                    setFormData({ ...formData, date: newValue });
                    if (errors.date) {
                      setErrors({ ...errors, date: '' });
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.date,
                      helperText: errors.date,
                      disabled: submitting
                    }
                  }}
                  disabled={submitting}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                error={!!errors.location}
                helperText={errors.location}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Participants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                inputProps={{ min: 1 }}
                error={!!errors.maxParticipants}
                helperText={errors.maxParticipants}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category} disabled={submitting} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.status} disabled={submitting} required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                  disabled={submitting}
                />
                <Stack direction="row" alignItems="center" spacing={2}>
                  <label htmlFor="image-upload">
                    <Button 
                      variant="outlined" 
                      component="span"
                      disabled={submitting}
                      startIcon={<CloudUploadIcon />}
                      sx={{ borderRadius: '8px' }}
                    >
                      Upload Event Image
                    </Button>
                  </label>
                  {formData.image && (
                    <Typography variant="body2" color="textSecondary">
                      {formData.image.name}
                    </Typography>
                  )}
                </Stack>
                {errors.image && (
                  <FormHelperText error>{errors.image}</FormHelperText>
                )}
                {imagePreview && (
                  <Box sx={{ mt: 2, position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0' 
                      }}
                    />
                    <Button 
                      size="small" 
                      color="error" 
                      variant="contained"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({...formData, image: null});
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        minWidth: 'auto',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        p: 0
                      }}
                    >
                      ✕
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={submitting}
                sx={{ 
                  borderRadius: '8px', 
                  py: 1.5,
                  mt: 2,
                  fontWeight: 600
                }}
              >
                {submitting ? 'Creating Event...' : 'Create Event'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateEvent;