const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Authentication Controller
 * 
 * WHY: Handles user authentication logic separately from student operations
 * Keeps authentication logic centralized and maintainable
 * 
 * Security Features:
 * - JWT token generation with expiration
 * - Password comparison (bcrypt)
 * - Input validation
 * - Error handling without exposing sensitive info
 */

/**
 * Generate JWT Token
 * WHY: Stateless authentication - server doesn't need to store session data
 * Includes userId and email for quick access without DB queries
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

/**
 * User Signup
 * POST /api/auth/signup
 * 
 * Creates new user with hashed password
 * Returns user data and JWT token
 */
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user (password will be hashed automatically by pre-save hook)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Return user data (password is excluded by toJSON method) and token
    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });

  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 * POST /api/auth/login
 * 
 * Validates credentials and returns JWT token
 * Compares provided password with stored hash
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Compare password with stored hash
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data (password excluded) and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User Profile
 * GET /api/auth/me
 * 
 * Returns current authenticated user's profile
 * Requires valid JWT token
 */
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 * POST /api/auth/logout
 * 
 * Note: With JWT, server-side logout is not strictly necessary
 * Token is stored client-side; client should remove it
 * This endpoint is for completeness and future blacklisting
 */
exports.logout = async (req, res, next) => {
  try {
    // In a more advanced setup, you could blacklist the token here
    // For now, client just removes the token from storage
    res.status(200).json({ 
      message: 'Logout successful. Please remove token from client storage.' 
    });
  } catch (error) {
    next(error);
  }
};
