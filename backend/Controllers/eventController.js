const Event = require('../Models/Event');
const User = require('../Models/User');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email notification
const sendEventEmail = async (userEmail, eventTitle, type) => {
  const subject = type === 'registration' ? 
    `Successfully Registered for ${eventTitle}` : 
    `New Event Created: ${eventTitle}`;

  const text = type === 'registration' ?
    `You have successfully registered for the event: ${eventTitle}` :
    `You have successfully created a new event: ${eventTitle}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: userEmail,
    subject,
    text
  });
};

exports.createEvent = async (req, res) => {
  try {
    // Create event object from request body
    const eventData = {
      ...req.body,
      organizer: req.user.id
    };
    
    // Add image path if a file was uploaded
    if (req.file) {
      // Store the path to the uploaded image
      eventData.image = `/uploads/${req.file.filename}`;
    }
    
    // Create the event in the database
    const newEvent = await Event.create(eventData);

    // Update user's created events
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdEvents: newEvent._id }
    });

    // Send email notification
    await sendEventEmail(req.user.email, newEvent.title, 'creation');

    res.status(201).json({
      status: 'success',
      data: newEvent
    });
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: events
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('registeredUsers', 'name email');

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: event
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'Event not found'
      });
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        status: 'fail',
        message: 'Event is full'
      });
    }

    // Check if user is already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already registered for this event'
      });
    }

    event.registeredUsers.push(req.user.id);
    event.currentParticipants += 1;
    await event.save();

    // Update user's registered events
    await User.findByIdAndUpdate(req.user.id, {
      $push: { registeredEvents: event._id }
    });

    // Send email notification
    await sendEventEmail(req.user.email, event.title, 'registration');

    res.status(200).json({
      status: 'success',
      message: 'Successfully registered for event'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    const events = await Event.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('organizer', 'name email');

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: events
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('createdEvents')
      .populate('registeredEvents');

    res.status(200).json({
      status: 'success',
      data: {
        createdEvents: user.createdEvents,
        registeredEvents: user.registeredEvents
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};