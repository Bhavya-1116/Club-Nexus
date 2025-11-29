const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent, registerForEvent, getRegistrations } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Route - Get all events
router.get('/', getEvents);

// Student Route - Register for an event
router.post('/:id/register', protect, registerForEvent);

// Admin Routes - Create, Delete, View Registrations
router.post('/', protect, adminOnly, createEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.get('/registrations', protect, adminOnly, getRegistrations);

module.exports = router;