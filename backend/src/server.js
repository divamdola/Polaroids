import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: packageJson.name,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (_req, res) => {
  res.json({ message: 'Polaroids API is running' });
});

const productRoutes = (await import('./routes/products.js')).default;
const categoryRoutes = (await import('./routes/categories.js')).default;
const authRoutes = (await import('./routes/auth.js')).default;
const userRoutes = (await import('./routes/users.js')).default;
const orderRoutes = (await import('./routes/orders.js')).default;
const wishlistRoutes = (await import('./routes/wishlist.js')).default;
const cartRoutes = (await import('./routes/cart.js')).default;
const reviewRoutes = (await import('./routes/reviews.js')).default;
const adminRoutes = (await import('./routes/admin.js')).default;

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');
    } else {
      console.log('MongoDB URI not configured. Continuing without database connection.');
    }

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start server', error);
    process.exit(1);
  }
};

startServer();
