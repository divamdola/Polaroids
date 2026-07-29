import { Router } from 'express';
import { mockCart } from '../data/mockData.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(mockCart);
});

router.post('/', (req, res) => {
  res.json({ success: true, cart: req.body });
});

export default router;
