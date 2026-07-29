import { Router } from 'express';
import { mockProducts } from '../data/mockData.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(mockProducts);
});

router.get('/:id', (req, res) => {
  const product = mockProducts.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.json(product);
});

export default router;
