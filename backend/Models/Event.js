const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  location: {
    type: String,
    required: [true, 'Please provide event location'],
    trim: true
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Event must belong to an organizer']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please provide maximum number of participants']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registeredUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    required: [true, 'Please provide event category'],
    enum: ['academic', 'cultural', 'sports', 'technical', 'other']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: null
  }
});

// Create index for search functionality
eventSchema.index({ title: 'text', description: 'text', category: 'text' });

// Middleware to prevent registration if event is full
eventSchema.pre('save', function(next) {
  if (this.currentParticipants >= this.maxParticipants) {
    next(new Error('Event has reached maximum participants'));
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;