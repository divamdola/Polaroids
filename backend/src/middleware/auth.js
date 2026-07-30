import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then from Authorization header
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'polaroid-secret');

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
      return;
    }

    req.user = {
      _id: decoded.id,
      id: decoded.id,
      name: decoded.name || 'Local User',
      email: decoded.email || 'local@example.com',
      role: decoded.role || 'user',
      isActive: true,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'polaroid-secret');

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      } else {
        req.user = null;
      }
      next();
      return;
    }

    req.user = {
      _id: decoded.id,
      id: decoded.id,
      name: decoded.name || 'Local User',
      email: decoded.email || 'local@example.com',
      role: decoded.role || 'user',
      isActive: true,
    };
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
