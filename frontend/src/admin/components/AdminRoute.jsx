import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminRoute = ({ children }) => {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking admin auth with API:', import.meta.env.VITE_API_BASE_URL)
        console.log('Cookies document.cookie:', document.cookie)
        
        // Try to get token from localStorage as fallback
        const localToken = localStorage.getItem('authToken')
        console.log('Local token found:', !!localToken)
        
        const headers = {
          'Content-Type': 'application/json',
        }
        
        if (localToken) {
          headers['Authorization'] = `Bearer ${localToken}`
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, { 
          withCredentials: true,
          headers
        })
        console.log('Auth response:', response.data)
        
        // Check if user has admin role
        const userRole = response.data?.role || response.data?.user?.role
        console.log('User role:', userRole)
        
        if (userRole === 'admin') {
          setIsAuthorized(true)
        } else {
          console.log('User is not admin, redirecting to profile')
          navigate('/profile')
        }
      } catch (error) {
        console.error('Auth check failed, redirecting to login', error)
        console.error('Error details:', error.response?.data)
        console.error('Error status:', error.response?.status)
        setError(error.message)
        // Don't redirect immediately, let user see the error
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted">Checking admin permissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="alert alert-danger">
            <h5>Authentication Error</h5>
            <p>{error}</p>
            <p className="mb-0">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return children
}

export default AdminRoute