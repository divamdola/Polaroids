export const mockProducts = [
  {
    id: 'prod_1',
    name: 'Polaroid OneStep 2',
    slug: 'polaroid-onestep-2',
    price: 129,
    currency: 'USD',
    description: 'A compact instant camera with a timeless design and bold color palette.',
    category: 'Cameras',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    stock: 24,
  },
  {
    id: 'prod_2',
    name: 'Color Film Pack',
    slug: 'color-film-pack',
    price: 24,
    currency: 'USD',
    description: 'High-quality film designed for vibrant daylight captures and rich contrast.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    stock: 56,
  },
  {
    id: 'prod_3',
    name: 'Canvas Camera Bag',
    slug: 'canvas-camera-bag',
    price: 78,
    currency: 'USD',
    description: 'Protect your camera with a sleek and durable everyday carry bag.',
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    stock: 18,
  },
  {
    id: 'prod_4',
    name: 'Instant Photo Album',
    slug: 'instant-photo-album',
    price: 34,
    currency: 'USD',
    description: 'Display your favorites in a premium album with archival sleeves.',
    category: 'Albums',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    rating: 4.5,
    stock: 42,
  },
];

export const mockCategories = [
  { id: 'cat_1', name: 'Cameras', slug: 'cameras' },
  { id: 'cat_2', name: 'Accessories', slug: 'accessories' },
  { id: 'cat_3', name: 'Bags', slug: 'bags' },
  { id: 'cat_4', name: 'Albums', slug: 'albums' },
];

export const mockUsers = [
  {
    id: 'user_1',
    name: 'Ada Stone',
    email: 'ada@example.com',
    password: 'password123',
    role: 'admin',
  },
];

export const mockOrders = [
  { id: 'order_1', customer: 'Ada Stone', total: 1250, status: 'Delivered' },
  { id: 'order_2', customer: 'Mina Lee', total: 890, status: 'Processing' },
];

export const mockWishlist = [
  { id: 'wish_1', productId: 'prod_1' },
  { id: 'wish_2', productId: 'prod_3' },
];

export const mockCart = [
  { id: 'cart_1', productId: 'prod_2', quantity: 2 },
];

export const mockReviews = [
  { id: 'review_1', productId: 'prod_1', rating: 5, author: 'Ada Stone' },
];
