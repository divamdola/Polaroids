import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { createRequire } from 'module';
import Product from './models/Product.js';
import User from './models/User.js';
import { getFallbackProducts } from './utils/fallbackData.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'https://polaroids-2.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://localhost:5180',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
}));

app.use(cookieParser());
app.use(express.json());

// Add a middleware to ensure proper cookie handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  next();
});

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

const seedInitialData = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        {
          title: 'Polaroid OneStep 2',
          slug: 'polaroid-onestep-2',
          description: 'A compact instant camera with a timeless design and bold color palette.',
          price: 129,
          salePrice: 119,
          category: 'Cameras',
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
          hoverImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
          rating: { rate: 4.7, count: 144 },
          stock: 24,
          stockStatus: 'In stock',
          isFeatured: true,
        },
        {
          title: 'Color Film Pack',
          slug: 'color-film-pack',
          description: 'High-quality film designed for vibrant daylight captures and rich contrast.',
          price: 24,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
          rating: { rate: 4.6, count: 88 },
          stock: 56,
          stockStatus: 'In stock',
        },
        {
          title: 'Canvas Camera Bag',
          slug: 'canvas-camera-bag',
          description: 'Protect your camera with a sleek and durable everyday carry bag.',
          price: 78,
          category: 'Bags',
          image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
          rating: { rate: 4.8, count: 132 },
          stock: 18,
          stockStatus: 'In stock',
        },
      ]);
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@polaroidstore.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      await User.create({ name: 'Polaroid Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    }
  } catch (error) {
    console.error('Unable to seed initial data', error);
  }
};

const startServer = async () => {
  let dbReady = false;

  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      await seedInitialData();
      dbReady = true;
      console.log('MongoDB connected');
    } else {
      console.log('MongoDB URI not configured. Continuing without database connection.');
    }
  } catch (error) {
    console.warn('MongoDB unavailable, continuing in local fallback mode.', error.message);
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    if (!dbReady) {
      console.log('Running with local fallback data because MongoDB is unavailable.');
    }
  });
};

startServer();
