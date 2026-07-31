import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    hoverImage: { type: String, default: '' },
    // For custom products with multiple image uploads
    customImages: [{
      image: { type: String, required: true },
      description: { type: String, default: '' }
    }],
    // Product variants (e.g., 6 images vs 12 images)
    variants: [{
      name: { type: String, required: true },
      price: { type: Number, required: true },
      imageCount: { type: Number, required: true }
    }],
    rating: {
      rate: { type: Number, default: 4.5 },
      count: { type: Number, default: 120 },
    },
    stock: { type: Number, default: 20 },
    stockStatus: { type: String, default: 'In stock' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Product', productSchema);
