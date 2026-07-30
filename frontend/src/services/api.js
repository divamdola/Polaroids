import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include token from localStorage
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage as fallback for cross-origin
    const localToken = localStorage.getItem('authToken')
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.baseURL)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.config?.url, error.message)
    if (error.response) {
      console.error('Error Status:', error.response.status)
      console.error('Error Data:', error.response.data)
    } else if (error.request) {
      console.error('No response received:', error.request)
    }
    return Promise.reject(error)
  }
)

const fallbackProducts = [
  {
    id: 1,
    title: 'Polaroid OneStep 2',
    slug: 'polaroid-onestep-2',
    price: 129,
    salePrice: 119,
    description: 'A compact instant camera with a timeless design and bold color palette.',
    category: 'Cameras',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.7, count: 144 },
    stock: 24,
    stockStatus: 'In stock',
    isFeatured: true,
    isNew: false,
  },
  {
    id: 2,
    title: 'Color Film Pack',
    slug: 'color-film-pack',
    price: 24,
    description: 'High-quality film designed for vibrant daylight captures and rich contrast.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.6, count: 88 },
    stock: 56,
    stockStatus: 'In stock',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 3,
    title: 'Canvas Camera Bag',
    slug: 'canvas-camera-bag',
    price: 78,
    description: 'Protect your camera with a sleek and durable everyday carry bag.',
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.8, count: 132 },
    stock: 18,
    stockStatus: 'In stock',
    isFeatured: true,
    isNew: false,
  },
  {
    id: 4,
    title: 'Instant Photo Album',
    slug: 'instant-photo-album',
    price: 34,
    description: 'Display your favorites in a premium album with archival sleeves.',
    category: 'Albums',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.5, count: 97 },
    stock: 42,
    stockStatus: 'In stock',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 5,
    title: 'Polaroid Now+',
    slug: 'polaroid-now-plus',
    price: 149,
    salePrice: 129,
    description: 'The newest instant camera with advanced features and Bluetooth connectivity.',
    category: 'Cameras',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.9, count: 203 },
    stock: 15,
    stockStatus: 'In stock',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 6,
    title: 'Black & White Film',
    slug: 'black-white-film',
    price: 28,
    description: 'Classic black and white instant film for timeless monochrome shots.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.7, count: 156 },
    stock: 38,
    stockStatus: 'In stock',
    isFeatured: false,
    isNew: false,
  },
  {
    id: 7,
    title: 'Leather Camera Strap',
    slug: 'leather-camera-strap',
    price: 45,
    description: 'Premium leather camera strap for comfortable carrying.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.4, count: 67 },
    stock: 29,
    stockStatus: 'In stock',
    isFeatured: false,
    isNew: true,
  },
  {
    id: 8,
    title: 'Photo Display Box',
    slug: 'photo-display-box',
    price: 52,
    description: 'Elegant wooden box for storing and displaying your instant photos.',
    category: 'Albums',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.6, count: 89 },
    stock: 21,
    stockStatus: 'Low stock',
    isFeatured: true,
    isNew: false,
  },
]

const normalizeProduct = (product) => ({
  ...product,
  id: product.id ?? product._id ?? 1,
  title: product.title || product.name || 'Untitled product',
  slug: product.slug || product.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled',
  price: product.price ?? 0,
  salePrice: product.salePrice || null,
  description: product.description || 'A polished addition to your collection.',
  category: product.category || 'Accessories',
  image:
    product.image ||
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  hoverImage: product.hoverImage || product.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  rating: product.rating || { rate: 4.5, count: 120 },
  stock: product.stock ?? 20,
  stockStatus: product.stockStatus || 'In stock',
  isFeatured: product.isFeatured || false,
  isNew: product.isNew || false,
})

export const getProducts = async () => {
  try {
    const response = await api.get('/products')
    const payload = Array.isArray(response.data) ? response.data : response.data.products || []
    return payload.map(normalizeProduct)
  } catch (error) {
    console.error('Falling back to local product data', error)
    return fallbackProducts
  }
}

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`)
    return normalizeProduct(response.data)
  } catch (error) {
    console.error('Falling back to local product detail', error)
    const products = await getProducts()
    return products.find((product) => String(product.id) === String(id)) || null
  }
}

export const loginUser = async (payload) => {
  const response = await api.post('/auth/login', payload)
  return response.data
}

export const registerUser = async (payload) => {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// Admin API functions
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard')
  return response.data
}

export const getAdminUsers = async () => {
  const response = await api.get('/users')
  return response.data
}

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/users/${userId}`, { role })
  return response.data
}

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`)
  return response.data
}

export const getUserOrders = async (userId) => {
  const response = await api.get(`/admin/users/${userId}/orders`)
  return response.data
}

export const getAdminOrders = async () => {
  const response = await api.get('/orders')
  return response.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status })
  return response.data
}

export const getAdminProducts = async () => {
  const response = await api.get('/products')
  return response.data
}

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData)
  return response.data
}

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData)
  return response.data
}

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`)
  return response.data
}
