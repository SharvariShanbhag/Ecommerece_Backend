const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const user = await User.create({ 
      username, 
      email, 
      password,
      isAdmin: false
    });

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.scope('withPassword').findOne({ where: { email } });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user info
const getUserInfo = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to get user information",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  registerUser, 
  login,
  getUserInfo
};