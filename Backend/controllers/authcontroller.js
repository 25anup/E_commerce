const express = require('express');
const passport = require('passport');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
exports.register = async (req, res) => {
  const { name, roles, email, password } = req.body;

  // Validate input
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  // Hash password and create user
  user = new User({ name, roles, email, password : await bcrypt.hash(password, 10) });
  await user.save();
   res.status(500).json({message: "user registed sucessfully", user});

  // Create JWT token
  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;


  // Validate input
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Email Invalid' });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Password Invalid' });

  // Create JWT token
     const payload = { user: 
        { 
          id: user.id,
          roles: user.roles
        } 
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
     });

  res.json({ 
    token, 
    user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        roles: user.roles
     }, 
    });
};

