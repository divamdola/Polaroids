import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { createFallbackUser, getFallbackUsers } from '../utils/fallbackData.js';

const router = Router();

const createToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'polaroid-secret', { expiresIn: '7d' });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (user) {
        const passwordValid = await user.comparePassword(password);
        if (!passwordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user);
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
      }
    }

    const fallbackUser = getFallbackUsers().find((candidate) => candidate.email === email);
    if (!fallbackUser || fallbackUser.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken({ _id: fallbackUser.id, role: fallbackUser.role });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ user: { id: fallbackUser.id, name: fallbackUser.name, email: fallbackUser.email, role: fallbackUser.role }, token });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const fallbackExisting = getFallbackUsers().find((candidate) => candidate.email === email);
    if (fallbackExisting) {
      return res.status(409).json({ message: 'User already exists' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const user = await User.create({ name, email, password, role: 'user' });
      const token = createToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    }

    const fallbackUser = createFallbackUser({ name, email, password });
    const token = createToken({ _id: fallbackUser.id, role: fallbackUser.role });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(201).json({ user: { id: fallbackUser.id, name: fallbackUser.name, email: fallbackUser.email, role: fallbackUser.role }, token });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register user', error: error.message });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
