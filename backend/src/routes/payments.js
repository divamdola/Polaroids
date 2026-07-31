import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createRazorpayOrder, verifyPaymentSignature, verifyPayment } from '../config/razorpay.js';
import Order from '../models/Order.js';

const router = Router();

// Create Razorpay order
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const order = await createRazorpayOrder(amount, currency, receipt);
    return res.json(order);
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    return res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
});

// Verify payment after completion
router.post('/verify', requireAuth, async (req, res) => {
  try {
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      orderId 
    } = req.body;

    // Verify signature
    const isValidSignature = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    
    if (!isValidSignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Verify payment with Razorpay API
    const payment = await verifyPayment(razorpayOrderId, razorpayPaymentId);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({ message: 'Payment not captured' });
    }

    // Update order with payment details
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'Paid';
        order.paymentMethod = 'Razorpay';
        order.paymentDetails = {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          amount: payment.amount / 100, // Convert back to rupees
          currency: payment.currency,
          paidAt: new Date(),
        };
        order.status = 'Processing';
        await order.save();
      }
    }

    return res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      payment: {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
      }
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

// Get payment status
router.get('/status/:paymentId', requireAuth, async (req, res) => {
  try {
    const payment = await verifyPayment(null, req.params.paymentId);
    return res.json(payment);
  } catch (error) {
    console.error('Failed to get payment status:', error);
    return res.status(500).json({ message: 'Failed to get payment status', error: error.message });
  }
});

export default router;