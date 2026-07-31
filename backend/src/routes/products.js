import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { getFallbackProducts } from '../utils/fallbackData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only (jpeg, jpg, png, gif, webp)'));
    }
  }
});

const router = Router();

// Get all products (public)
router.get('/', optionalAuth, async (_req, res) => {
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

// Get single product (public)
router.get('/:id', optionalAuth, async (req, res) => {
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

// Create product (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create product', error: error.message });
  }
});

// Update product (admin only)
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

// Delete product (admin only)
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

// Search products (public)
router.get('/search/query', optionalAuth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json([]);
    }

    if (mongoose.connection.readyState !== 1) {
      const results = getFallbackProducts().filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      );
      return res.json(results);
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to search products', error: error.message });
  }
});

// Upload images for custom products
router.post('/upload', upload.array('images', 12), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = req.files.map(file => ({
      image: `/uploads/${file.filename}`,
      description: ''
    }));

    return res.json({ images: uploadedImages });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to upload images', error: error.message });
  }
});

export default router;
