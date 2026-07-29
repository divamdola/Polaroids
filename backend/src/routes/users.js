import { Router } from 'express';
import { mockUsers } from '../data/mockData.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(mockUsers);
});

export default router;
