const fallbackProducts = [
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
