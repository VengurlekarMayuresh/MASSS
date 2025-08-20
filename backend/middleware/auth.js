const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Extract token from "Bearer token"
    const actualToken = token.substring(7);

    try {
      // Verify token
      const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'fallback_secret');
      
      // Get user from token
      const user = await User.findById(decoded.user.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found, authorization denied'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is inactive'
        });
      }

      // Add user to req object
      req.user = {
        id: user._id,
        role: user.role
      };
      
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }

    next();
  };
};

// Doctor only middleware
const doctorOnly = requireRole(['doctor']);

// Patient only middleware
const patientOnly = requireRole(['patient']);

// Admin only middleware
const adminOnly = requireRole(['admin']);

module.exports = {
  auth: auth,
  requireRole,
  doctorOnly,
  patientOnly,
  adminOnly
};
