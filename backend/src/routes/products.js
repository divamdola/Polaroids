import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { getFallbackProducts } from '../utils/fallbackData.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(getFallbackProducts());
    }

    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.json(getFallbackProducts());
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch product', error: error.message });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create product', error: error.message });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update product', error: error.message });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete product', error: error.message });
  }
});

export default router;
