import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const [products, users, orders] = await Promise.all([
      Product.find({ isActive: true }),
      User.find({ isActive: true }).select('-password'),
      Order.find().populate('user', 'name email'),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const lowStockItems = products.filter((product) => (product.stock || 0) < 10);

    return res.json({
      totalRevenue,
      totalOrders: orders.length,
      totalInventory: products.length,
      totalCustomers: users.filter((user) => user.role !== 'admin').length,
      lowStockItems,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load dashboard stats', error: error.message });
  }
});

router.get('/inventory', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch inventory', error: error.message });
  }
});

router.get('/orders', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch orders', error: error.message });
  }
});

router.put('/orders/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update order status', error: error.message });
  }
});

router.get('/analytics', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const [products, users, orders] = await Promise.all([
      Product.find({ isActive: true }),
      User.find({ isActive: true }).select('-password'),
      Order.find(),
    ]);

    return res.json({
      orders: orders.length,
      products: products.length,
      customers: users.filter((user) => user.role !== 'admin').length,
      wishlistItems: 0,
      cartItems: 0,
      reviews: 0,
      categories: [...new Set(products.map((product) => product.category))].length,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load analytics', error: error.message });
  }
});

router.get('/products', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch admin products', error: error.message });
  }
});

router.get('/customers', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch customers', error: error.message });
  }
});

router.get('/discounts', requireAuth, requireAdmin, (_req, res) => {
  return res.json([
    { id: 'discount_1', code: 'SAVE10', value: 10, active: true },
    { id: 'discount_2', code: 'WELCOME15', value: 15, active: true },
  ]);
});

// Get user by ID with their orders
router.get('/users/:userId/orders', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not available' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title price');

    return res.json({ user, orders });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch user orders', error: error.message });
  }
});

export default router;
