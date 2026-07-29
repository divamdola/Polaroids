import { Router } from 'express';
import { mockWishlist } from '../data/mockData.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(mockWishlist);
});

export default router;
