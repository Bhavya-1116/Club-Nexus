const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event (Admin)
// @route   POST /api/events
const createEvent = async (req, res) => {
  const { title, description, date, time, location, totalSeats } = req.body;

  if (!title || !date || !time || !location) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  try {
    // Ensure req.user exists (middleware should handle this)
    const clubName = req.user.clubName || 'General Club';

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      totalSeats,
      club: clubName,
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete event (Admin)
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for event (Student)
// @route   POST /api/events/:id/register
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already registered' });
    }

    // Check if seats available
    if (event.registeredUsers.length >= event.totalSeats) {
      return res.status(400).json({ message: 'Event is housefull' });
    }

    event.registeredUsers.push(req.user.id);
    await event.save();

    res.status(200).json({ message: 'Registration Successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Registrations (Admin)
// @route   GET /api/events/registrations
const getRegistrations = async (req, res) => {
    try {
        const events = await Event.find({ club: req.user.clubName })
            .populate('registeredUsers', 'name email');
        
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getEvents, createEvent, deleteEvent, registerForEvent, getRegistrations };