import { Router } from 'express';
import { mockOrders } from '../data/mockData.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(mockOrders);
});

router.post('/', (req, res) => {
  res.status(201).json({ success: true, order: req.body });
});

export default router;
