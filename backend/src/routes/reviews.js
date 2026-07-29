import { Router } from 'express';
import { mockReviews } from '../data/mockData.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(mockReviews);
});

router.post('/', (req, res) => {
  res.status(201).json({ success: true, review: req.body });
});

export default router;
