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

export const getFallbackProducts = () => fallbackProducts;
export const getFallbackUsers = () => fallbackUsers;

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
