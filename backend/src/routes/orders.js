import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { getFallbackOrders, createFallbackOrder } from '../utils/fallbackData.js';

const router = Router();

// Get all orders (admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(getFallbackOrders());
    }

    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email').populate('items.product', 'title price customImages');
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch orders', error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const userOrders = getFallbackOrders().filter(order => order.user === req.user._id || order.user === req.user.id);
      return res.json(userOrders);
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'title price customImages');
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch orders', error: error.message });
  }
});

// Get single order
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'title price customImages');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch order', error: error.message });
  }
});

// Create new order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentStatus, paymentDetails, subtotal, shipping, tax, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Use provided totals or calculate them
    const calculatedSubtotal = subtotal || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedShipping = shipping !== undefined ? shipping : (calculatedSubtotal > 50 ? 0 : 10);
    const calculatedTax = tax !== undefined ? tax : (calculatedSubtotal * 0.08);
    const calculatedTotal = total !== undefined ? total : (calculatedSubtotal + calculatedShipping + calculatedTax);

    const orderData = {
      user: req.user._id,
      items,
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      tax: calculatedTax,
      total: calculatedTotal,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      status: paymentStatus === 'Paid' ? 'Processing' : 'Pending',
    };

    // Add payment status and details if provided
    if (paymentStatus) {
      orderData.paymentStatus = paymentStatus;
    }
    if (paymentDetails) {
      orderData.paymentDetails = paymentDetails;
    }

    console.log('Creating order with payment status:', paymentStatus);
    console.log('Order data:', orderData);

    if (mongoose.connection.readyState === 1) {
      const order = await Order.create(orderData);
      console.log('Order created successfully:', order.paymentStatus);
      console.log('Full created order:', order);
      return res.status(201).json(order);
    }

    // Fallback for local development
    const fallbackOrder = createFallbackOrder({ ...orderData, user: req.user._id });
    return res.status(201).json(fallbackOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create order', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update order', error: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if order is in Pending status
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }

    order.status = 'Cancelled';
    await order.save();

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to cancel order', error: error.message });
  }
});

export default router;
