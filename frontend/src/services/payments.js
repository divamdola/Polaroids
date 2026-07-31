import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Create Razorpay order
export const createRazorpayOrder = async (amount, currency = 'INR', receipt = null) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/create-order`,
      { amount, currency, receipt },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Failed to create Razorpay order:', error)
    throw error.response?.data || { message: 'Failed to create payment order' }
  }
}

// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/verify`,
      paymentData,
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Failed to verify payment:', error)
    throw error.response?.data || { message: 'Payment verification failed' }
  }
}

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payments/status/${paymentId}`,
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Failed to get payment status:', error)
    throw error.response?.data || { message: 'Failed to get payment status' }
  }
}

// Initialize Razorpay checkout
export const initRazorpayCheckout = (options) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'))
      return
    }

    const rzp = new window.Razorpay(options)
    
    rzp.on('payment.success', (response) => {
      resolve(response)
    })
    
    rzp.on('payment.error', (error) => {
      reject(error)
    })
    
    rzp.open()
  })
}