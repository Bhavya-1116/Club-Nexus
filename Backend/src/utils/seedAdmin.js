require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clubnexus';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@chitkara.edu.in' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@chitkara.edu.in',
      password: hashedPassword,
      role: 'admin',
      clubName: 'General Admin'
    });

    await adminUser.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@chitkara.edu.in');
    console.log('Password: admin123');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAdmin();