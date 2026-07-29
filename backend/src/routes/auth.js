import { Router } from 'express';
import { mockUsers } from '../data/mockData.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find((candidate) => candidate.email === email && candidate.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({ user, token: 'mock-token' });
});

router.post('/register', (req, res) => {
  const user = { id: `user_${Date.now()}`, ...req.body };
  return res.status(201).json({ user, token: 'mock-token' });
});

export default router;
