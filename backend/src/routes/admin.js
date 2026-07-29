import { Router } from 'express';
import {
  mockProducts,
  mockOrders,
  mockUsers,
  mockCategories,
  mockWishlist,
  mockCart,
  mockReviews,
} from '../data/mockData.js';

const router = Router();

router.get('/dashboard', (_req, res) => {
  const totalRevenue = mockOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const lowStockItems = mockProducts.filter((product) => (product.stock || 0) < 10);

  res.json({
    totalRevenue,
    totalOrders: mockOrders.length,
    totalInventory: mockProducts.length,
    totalCustomers: mockUsers.filter((user) => user.role !== 'admin').length,
    lowStockItems,
  });
});

router.get('/inventory', (_req, res) => {
  res.json(mockProducts);
});

router.get('/orders', (_req, res) => {
  res.json(mockOrders);
});

router.get('/analytics', (_req, res) => {
  res.json({
    orders: mockOrders.length,
    products: mockProducts.length,
    customers: mockUsers.filter((user) => user.role !== 'admin').length,
    wishlistItems: mockWishlist.length,
    cartItems: mockCart.length,
    reviews: mockReviews.length,
    categories: mockCategories.length,
  });
});

router.get('/products', (_req, res) => {
  res.json(mockProducts);
});

router.get('/customers', (_req, res) => {
  res.json(mockUsers);
});

router.get('/discounts', (_req, res) => {
  res.json([
    { id: 'discount_1', code: 'SAVE10', value: 10, active: true },
    { id: 'discount_2', code: 'WELCOME15', value: 15, active: true },
  ]);
});

export default router;
