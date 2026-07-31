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
  'https://polaroids-2.onrender.com', // Frontend
  'https://polaroids-1.onrender.com', // Backend (self)
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
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
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

// Serve uploaded files statically
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add a middleware to ensure proper cookie handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
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
const paymentRoutes = (await import('./routes/payments.js')).default;

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

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
          title: 'Mini Polaroids - 6 Images',
          slug: 'mini-polaroids-6-images',
          description: 'Create your own mini polaroid set with 6 of your favorite photos. Upload your images and add personal descriptions for each memory.',
          price: 299,
          category: 'Mini Polaroids',
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
          rating: { rate: 4.9, count: 144 },
          stock: 50,
          stockStatus: 'In stock',
          isFeatured: true,
          variants: [
            { name: '6 Images', price: 299, imageCount: 6 },
            { name: '12 Images', price: 499, imageCount: 12 }
          ],
          customImages: []
        },
        {
          title: 'Mini Polaroids - 12 Images',
          slug: 'mini-polaroids-12-images',
          description: 'Create your own mini polaroid set with 12 of your favorite photos. Upload your images and add personal descriptions for each memory.',
          price: 499,
          category: 'Mini Polaroids',
          image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
          rating: { rate: 4.8, count: 88 },
          stock: 50,
          stockStatus: 'In stock',
          variants: [
            { name: '6 Images', price: 299, imageCount: 6 },
            { name: '12 Images', price: 499, imageCount: 12 }
          ],
          customImages: []
        },
        {
          title: 'Photo Collage - 6 Images',
          slug: 'photo-collage-6-images',
          description: 'Transform your photos into a beautiful collage with 6 images. Upload your photos and add descriptions to create a personalized masterpiece.',
          price: 349,
          category: 'Collages',
          image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
          rating: { rate: 4.7, count: 132 },
          stock: 50,
          stockStatus: 'In stock',
          variants: [
            { name: '6 Images', price: 349, imageCount: 6 },
            { name: '12 Images', price: 599, imageCount: 12 }
          ],
          customImages: []
        },
        {
          title: 'Photo Collage - 12 Images',
          slug: 'photo-collage-12-images',
          description: 'Transform your photos into a beautiful collage with 12 images. Upload your photos and add descriptions to create a personalized masterpiece.',
          price: 599,
          category: 'Collages',
          image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
          rating: { rate: 4.6, count: 120 },
          stock: 50,
          stockStatus: 'In stock',
          variants: [
            { name: '6 Images', price: 349, imageCount: 6 },
            { name: '12 Images', price: 599, imageCount: 12 }
          ],
          customImages: []
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
