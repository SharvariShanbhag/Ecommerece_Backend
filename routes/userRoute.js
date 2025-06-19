const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Public routes (no authentication needed)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes (authentication required)
router.get('/getUserInfo', authMiddleware.auth, userController.getUserInfo);

module.exports = router;