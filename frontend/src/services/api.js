import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 8000,
})

const fallbackProducts = [
  {
    id: 1,
    title: 'Polaroid OneStep 2',
    price: 129,
    description: 'A compact instant camera with a timeless design and bold color palette.',
    category: 'Cameras',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.7, count: 144 },
  },
  {
    id: 2,
    title: 'Color Film Pack',
    price: 24,
    description: 'High-quality film designed for vibrant daylight captures and rich contrast.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.6, count: 88 },
  },
  {
    id: 3,
    title: 'Canvas Camera Bag',
    price: 78,
    description: 'Protect your camera with a sleek and durable everyday carry bag.',
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.8, count: 132 },
  },
  {
    id: 4,
    title: 'Instant Photo Album',
    price: 34,
    description: 'Display your favorites in a premium album with archival sleeves.',
    category: 'Albums',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    rating: { rate: 4.5, count: 97 },
  },
]

const normalizeProduct = (product) => ({
  ...product,
  id: product.id ?? product._id ?? 1,
  title: product.title || product.name || 'Untitled product',
  price: product.price ?? 0,
  description: product.description || 'A polished addition to your collection.',
  category: product.category || 'Accessories',
  image:
    product.image ||
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  rating: product.rating || { rate: 4.5, count: 120 },
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
