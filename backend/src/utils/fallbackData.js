const fallbackProducts = [
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

const fallbackUsers = [
  {
    id: 'user_1',
    name: 'Ada Stone',
    email: 'ada@example.com',
    password: 'password123',
    role: 'admin',
  },
];

const fallbackOrders = [
  {
    id: 'order_1',
    user: 'user_1',
    items: [
      {
        product: 'prod_1',
        title: 'Polaroid OneStep 2',
        quantity: 1,
        price: 129,
      },
    ],
    subtotal: 129,
    shipping: 0,
    tax: 10.32,
    total: 139.32,
    status: 'Delivered',
    paymentMethod: 'Card',
    shippingAddress: {
      name: 'Ada Stone',
      email: 'ada@example.com',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
    },
    createdAt: new Date('2024-01-15'),
  },
];

export const getFallbackProducts = () => fallbackProducts;
export const getFallbackUsers = () => fallbackUsers;
export const getFallbackOrders = () => fallbackOrders;

export const createFallbackUser = ({ name, email, password, role = 'user' }) => {
  const user = {
    id: `user_${fallbackUsers.length + 1}`,
    name,
    email,
    password,
    role,
  };

  fallbackUsers.push(user);
  return user;
};

export const createFallbackOrder = (orderData) => {
  const order = {
    id: `order_${fallbackOrders.length + 1}`,
    ...orderData,
    createdAt: new Date(),
  };

  fallbackOrders.push(order);
  return order;
};
