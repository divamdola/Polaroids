import { Router } from 'express';
import { mockCategories } from '../data/mockData.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(mockCategories);
});

export default router;
