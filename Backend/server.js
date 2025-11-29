require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

const app = express();

// Middleware
app.use(express.json()); // Allows us to read JSON data sent from frontend
app.use(cors()); // Allows frontend running on different port to talk to backend

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Database Connection & Server Start
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clubnexus';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    // Only start server if DB connects successfully
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });