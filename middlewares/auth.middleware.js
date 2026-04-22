const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * 
 * WHY: Protects routes by verifying JWT tokens
 * Centralized authentication logic - no duplication across routes
 * 
 * Security Features:
 * - Verifies JWT signature and expiration
 * - Extracts user info from token
 * - Attaches user to request for use in controllers
 * - Returns appropriate error for invalid/missing tokens
 * 
 * Header Format:
 * Authorization: Bearer <jwt_token>
 */

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    // Check if header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Invalid token format. Use: Bearer <token>' 
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. Token is empty.' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret_change_in_production'
    );

    // Attach user info to request object
    // Controllers can now access req.user to get authenticated user info
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    // Continue to next middleware or route handler
    next();

  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token. Please login again.' 
      });
    }

    // Generic auth error
    return res.status(401).json({ 
      message: 'Authentication failed. Please login again.' 
    });
  }
};

/**
 * Optional: Role-based access control middleware
 * WHY: Allows restricting routes to specific user roles (admin, user, etc.)
 * 
 * Usage: router.get('/admin-only', authMiddleware, requireRole('admin'), handler)
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ 
        message: `Access denied. ${role} role required.` 
      });
    }

    next();
  };
};

module.exports = { authMiddleware, requireRole };
