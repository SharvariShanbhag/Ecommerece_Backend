const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import the User model
const User = require('../models/userModel'); 

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) { 
            return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password: hashedPassword });

        const payload = { user: { id: newUser.id, username: newUser.username, email: newUser.email } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully!',
            user: { id: newUser.id, username: newUser.username, email: newUser.email },
            token
        });

    } catch (error) {
        console.error('Error in registerUser controller:', error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors[0].message || 'Validation error.' });
        }
        res.status(500).json({ message: 'Internal server error during registration.', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            // FIX: Changed status from 404 to 400 for better semantic meaning of "Invalid credentials"
            return res.status(400).json({ message: 'Invalid credentials.' }); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const payload = { user: { id: user.id, username: user.username, email: user.email } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'User logged in successfully!',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Error in loginUser controller:', error);
        res.status(500).json({ message: 'Internal server error during login.', error: error.message });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        if (!req.user || !req.user.id) { 
            return res.status(403).json({ message: 'Unauthorized: User information not available after authentication.' });
        }

        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } 
        }); 

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'User information retrieved successfully.',
            user: { id: user.id, username: user.username, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.error('Error in getUserInfo controller:', error);
        res.status(500).json({ message: 'Internal server error getting user info.', error: error.message });
    }
};
