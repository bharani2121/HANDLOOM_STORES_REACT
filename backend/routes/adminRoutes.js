const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Admin Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Create and save new admin
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
