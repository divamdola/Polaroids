import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCurrentUser, getProducts, loginUser, logoutUser, registerUser } from '../services/api'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const navigate = useNavigate()
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    return JSON.parse(localStorage.getItem('polaroid-cart') || '[]')
  })
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    return JSON.parse(localStorage.getItem('polaroid-wishlist') || '[]')
  })
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    return JSON.parse(localStorage.getItem('polaroid-user') || 'null')
  })
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('polaroid-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('polaroid-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('polaroid-user', JSON.stringify(user))
  }, [user])

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      setError('')
    } catch (err) {
      setError('We could not load the latest catalog right now.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await getCurrentUser()
        if (response?.user) {
          setUser(response.user)
        }
      } catch (error) {
        // If cookie-based auth fails, try to use localStorage token
        const localToken = localStorage.getItem('authToken')
        if (localToken) {
          try {
            const response = await getCurrentUser()
            if (response?.user) {
              setUser(response.user)
            }
          } catch (retryError) {
            setUser(null)
            localStorage.removeItem('authToken')
          }
        } else {
          setUser(null)
        }
      }
    }

    restoreSession()
  }, [])

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((current) => {
      const existingItem = current.find((item) => item.id === product.id)

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      return [...current, { ...product, quantity }]
    })
    toast.success(`₹{product.title} added to your cart.`)
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    setCart((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback((product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id)
      if (exists) {
        return current.filter((item) => item.id !== product.id)
      }
      return [...current, product]
    })
  }, [])

  const login = useCallback(async (userData) => {
    try {
      const response = await loginUser(userData)
      setUser(response.user)
      
      // Store token in localStorage as fallback for cross-origin
      if (response.token) {
        localStorage.setItem('authToken', response.token)
      }
      
      toast.success(`Welcome back, ${response.user.name}!`)
      return response.user
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to sign in.')
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error(error)
    } finally {
      setUser(null)
      localStorage.removeItem('authToken')
      toast.info('You have been signed out.')
      // Redirect to home after logout
      navigate('/')
    }
  }, [navigate])

  const register = useCallback(async (userData) => {
    try {
      const response = await registerUser(userData)
      setUser(response.user)
      toast.success(`Thanks for joining, ₹{response.user.name}!`)
      return response.user
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create account.')
      throw error
    }
  }, [])

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const wishlistCount = useMemo(() => wishlist.length, [wishlist])

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      products,
      user,
      isLoading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      login,
      logout,
      register,
      cartCount,
      wishlistCount,
    }),
    [cart, wishlist, products, user, isLoading, error, addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, login, logout, register, cartCount, wishlistCount],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used inside a StoreProvider')
  }

  return context
}
