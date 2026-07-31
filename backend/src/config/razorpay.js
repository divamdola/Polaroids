import Razorpay from 'razorpay'
import crypto from 'crypto'

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID'
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_YOUR_KEY_SECRET'

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
})

// Generate order ID
export const generateOrderId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `order_${timestamp}_${random}`
}

// Create Razorpay order
export const createRazorpayOrder = async (amount, currency = 'INR', receipt = null) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (multiply by 100 for INR)
      currency,
      receipt: receipt || generateOrderId(),
      payment_capture: '1', // Auto capture payment
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Razorpay order creation failed:', error)
    throw new Error('Failed to create payment order')
  }
}

// Verify Razorpay payment signature
export const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  return generatedSignature === razorpaySignature
}

// Verify payment with Razorpay API
export const verifyPayment = async (razorpayOrderId, razorpayPaymentId) => {
  try {
    const payment = await razorpay.payments.fetch(razorpayPaymentId)
    return payment
  } catch (error) {
    console.error('Razorpay payment verification failed:', error)
    throw new Error('Failed to verify payment')
  }
}

export default razorpay