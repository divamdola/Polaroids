export const mockProducts = [
  {
    id: 'prod_1',
    name: 'Mini Polaroids - 6 Images',
    slug: 'mini-polaroids-6-images',
    price: 299,
    currency: 'USD',
    description: 'Create your own mini polaroid set with 6 of your favorite photos. Upload your images and add personal descriptions for each memory.',
    category: 'Mini Polaroids',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    stock: 50,
    variants: [
      { name: '6 Images', price: 299, imageCount: 6 },
      { name: '12 Images', price: 499, imageCount: 12 }
    ],
    customImages: []
  },
  {
    id: 'prod_2',
    name: 'Mini Polaroids - 12 Images',
    slug: 'mini-polaroids-12-images',
    price: 499,
    currency: 'USD',
    description: 'Create your own mini polaroid set with 12 of your favorite photos. Upload your images and add personal descriptions for each memory.',
    category: 'Mini Polaroids',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    stock: 50,
    variants: [
      { name: '6 Images', price: 299, imageCount: 6 },
      { name: '12 Images', price: 499, imageCount: 12 }
    ],
    customImages: []
  },
  {
    id: 'prod_3',
    name: 'Photo Collage - 6 Images',
    slug: 'photo-collage-6-images',
    price: 349,
    currency: 'USD',
    description: 'Transform your photos into a beautiful collage with 6 images. Upload your photos and add descriptions to create a personalized masterpiece.',
    category: 'Collages',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    stock: 50,
    variants: [
      { name: '6 Images', price: 349, imageCount: 6 },
      { name: '12 Images', price: 599, imageCount: 12 }
    ],
    customImages: []
  },
  {
    id: 'prod_4',
    name: 'Photo Collage - 12 Images',
    slug: 'photo-collage-12-images',
    price: 599,
    currency: 'USD',
    description: 'Transform your photos into a beautiful collage with 12 images. Upload your photos and add descriptions to create a personalized masterpiece.',
    category: 'Collages',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    stock: 50,
    variants: [
      { name: '6 Images', price: 349, imageCount: 6 },
      { name: '12 Images', price: 599, imageCount: 12 }
    ],
    customImages: []
  },
];

export const mockCategories = [
  { id: 'cat_1', name: 'Mini Polaroids', slug: 'mini-polaroids' },
  { id: 'cat_2', name: 'Collages', slug: 'collages' },
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
