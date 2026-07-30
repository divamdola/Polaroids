import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { getFallbackUsers } from '../utils/fallbackData.js';

const router = Router();

// Get all users (admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(getFallbackUsers());
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch users', error: error.message });
  }
});

// Get current user
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Get single user (admin only)
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch user', error: error.message });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const allowedUpdates = { name, email, avatar };
    
    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        allowedUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(user);
    }

    // Fallback for local development
    const updatedUser = {
      ...req.user,
      ...allowedUpdates,
    };

    return res.json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Unable to update profile', error: error.message });
  }
});

// Change password
router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      return res.json({ message: 'Password changed successfully' });
    }

    // Fallback for local development
    if (req.user.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to change password', error: error.message });
  }
});

// Update user (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const allowedUpdates = { name, email, role, isActive };
    
    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        allowedUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(user);
    }

    // Fallback for local development
    const users = getFallbackUsers();
    const userIndex = users.findIndex(u => u._id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = { ...users[userIndex], ...allowedUpdates };
    return res.json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Unable to update user', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ message: 'User deleted successfully' });
    }

    // Fallback for local development
    const users = getFallbackUsers();
    const userIndex = users.findIndex(u => u._id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete user', error: error.message });
  }
});

export default router;