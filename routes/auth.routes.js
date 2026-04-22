const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Authentication Routes
 * 
 * WHY: Separates authentication routes from student routes
 * Clean, RESTful API structure
 * 
 * Routes:
 * POST /api/auth/signup - User registration
 * POST /api/auth/login - User login
 * GET  /api/auth/me - Get current user (protected)
 * POST /api/auth/logout - Logout
 */

// Public routes (no authentication required)
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes (authentication required)
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
