const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');
const authController = require('../Controllers/authController');
const upload = require('../Middleware/uploadMiddleware');

// Protect all routes after this middleware
router.use(authController.protect);

// Event routes
router.post('/', upload.single('image'), eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/search', eventController.searchEvents);
router.get('/dashboard', eventController.getUserDashboard);
router.get('/:id', eventController.getEvent);
router.post('/:id/register', eventController.registerForEvent);

module.exports = router;