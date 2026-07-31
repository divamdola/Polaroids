import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiCreditCard, FiShield, FiTruck, FiLoader } from 'react-icons/fi'
import Button from '../../components/Button/Button'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { useStore } from '../../context/StoreContext'
import { formatCurrency } from '../../utils/formatters'
import { createRazorpayOrder, initRazorpayCheckout, verifyPayment, loadRazorpayScript } from '../../services/payments'
import axios from 'axios'
import styles from './Checkout.module.css'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart, user } = useStore()
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 18 : 0
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  const handleRazorpayPayment = async (formData) => {
    try {
      setIsProcessing(true)
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.')
        setIsProcessing(false)
        return
      }
      
      // Create Razorpay order
      const order = await createRazorpayOrder(grandTotal, 'INR')
      
      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: 'Polaroids Store',
        description: 'Payment for your order',
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone || '',
        },
        theme: {
          color: '#000000',
        },
        handler: async (response) => {
          try {
            // Create order with payment details directly
            const orderResponse = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/orders`,
              {
                items: cart.map(item => ({
                  product: item.id,
                  title: item.title,
                  quantity: item.quantity,
                  price: item.price,
                  customImages: item.customImages || [],
                })),
                subtotal,
                shipping,
                tax,
                total: grandTotal,
                paymentMethod: 'Razorpay',
                paymentStatus: 'Paid',
                paymentDetails: {
                  razorpayOrderId: order.id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  amount: grandTotal,
                  currency: 'INR',
                  paidAt: new Date(),
                },
                shippingAddress: {
                  name: formData.name,
                  email: formData.email,
                  address: formData.address,
                  city: formData.city,
                  postalCode: formData.postal,
                  notes: formData.notes,
                },
              },
              { withCredentials: true }
            )
            
            console.log('Order created with payment status:', orderResponse.data.paymentStatus)
            console.log('Full order response:', orderResponse.data)
            
            clearCart()
            toast.success('Payment successful! Order placed.')
            navigate('/profile')
          } catch (error) {
            console.error('Order creation failed:', error)
            toast.error('Failed to create order. Please contact support.')
          } finally {
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            toast.info('Payment cancelled')
          },
        },
      }
      
      await initRazorpayCheckout(options)
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleCODPayment = async (formData) => {
    try {
      setIsProcessing(true)
      
      // Create order with COD
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orders`,
        {
          items: cart.map(item => ({
            product: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            customImages: item.customImages || [],
          })),
          subtotal,
          shipping,
          tax,
          total: grandTotal,
          paymentMethod: 'COD',
          paymentStatus: 'Pending',
          shippingAddress: {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postal,
            notes: formData.notes,
          },
        },
        { withCredentials: true }
      )
      
      console.log('COD Order created with payment status:', orderResponse.data.paymentStatus)
      
      clearCart()
      toast.success('Order placed successfully with Cash on Delivery!')
      navigate('/profile')
    } catch (error) {
      console.error('Order creation failed:', error)
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const onSubmit = async (formData) => {
    // Validate custom products have required images
    const customProducts = cart.filter(item => 
      item.category === 'Mini Polaroids' || item.category === 'Collages'
    )
    
    for (const item of customProducts) {
      if (!item.customImages || item.customImages.length === 0) {
        toast.error(`Please upload images for "${item.title}" before checkout`)
        return
      }
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment(formData)
    } else if (paymentMethod === 'cod') {
      await handleCODPayment(formData)
    }
  }

  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Secure checkout" title="Complete your order" text="A streamlined experience with premium support and thoughtful delivery details." />
      <div className="row g-4">
        <div className="col-lg-7">
          <div className={styles.formCard}>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
              <span className={styles.badge}><FiShield className="me-2" /> Secure checkout</span>
              <span className={styles.badge}><FiTruck className="me-2" /> Fast delivery</span>
            </div>
            <h4 className="mb-4 fw-semibold">Billing & shipping</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full name</label>
                <input className="form-control rounded-pill" {...register('name', { required: 'Full name is required' })} />
                {errors.name && <p className="small text-danger mt-1">{errors.name.message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control rounded-pill" type="email" {...register('email', { required: 'Email is required', pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: 'Enter a valid email' } })} />
                {errors.email && <p className="small text-danger mt-1">{errors.email.message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input className="form-control rounded-pill" type="tel" {...register('phone', { required: 'Phone is required for Razorpay payment' })} />
                {errors.phone && <p className="small text-danger mt-1">{errors.phone.message}</p>}
              </div>
              <div className="col-12">
                <label className="form-label">Billing address</label>
                <input className="form-control rounded-pill" {...register('address', { required: 'Address is required' })} />
                {errors.address && <p className="small text-danger mt-1">{errors.address.message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input className="form-control rounded-pill" {...register('city', { required: 'City is required' })} />
                {errors.city && <p className="small text-danger mt-1">{errors.city.message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Postal code</label>
                <input className="form-control rounded-pill" {...register('postal', { required: 'Postal code is required' })} />
                {errors.postal && <p className="small text-danger mt-1">{errors.postal.message}</p>}
              </div>
              <div className="col-12">
                <label className="form-label">Shipping notes</label>
                <textarea className="form-control rounded-4" rows="3" {...register('notes')} />
              </div>

              <div className="col-12 mt-3">
                <h5 className="fw-semibold mb-3">Payment method</h5>
                <div className="d-grid gap-2">
                  <button type="button" className={`text-start ${styles.paymentOption} ${paymentMethod === 'razorpay' ? styles.paymentOptionActive : ''}`} onClick={() => setPaymentMethod('razorpay')}>
                    <FiCreditCard className="me-2" /> Razorpay (UPI, Cards, Wallets)
                  </button>
                  <button type="button" className={`text-start ${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentOptionActive : ''}`} onClick={() => setPaymentMethod('cod')}>
                    Cash on Delivery
                  </button>
                </div>
              </div>

              <div className="col-12">
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <FiLoader className="me-2 spin" /> Processing...
                    </>
                  ) : (
                    `Pay ${formatCurrency(grandTotal)}`
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-5">
          <div className={styles.summaryCard}>
            <h4 className="mb-4 fw-semibold">Order summary</h4>
            {cart.map((item) => (
              <div key={item.id} className="d-flex justify-content-between py-2 border-bottom">
                <span>{item.title} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="input-group my-3">
              <input className="form-control rounded-pill" placeholder="Coupon code" />
              <button className="btn btn-outline-dark rounded-pill" type="button">Apply</button>
            </div>
            <div className="d-flex justify-content-between mt-3"><span className="text-muted">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="d-flex justify-content-between mt-2"><span className="text-muted">Shipping</span><span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
            <div className="d-flex justify-content-between mt-2"><span className="text-muted">Tax</span><span>{formatCurrency(tax)}</span></div>
            <div className="d-flex justify-content-between mt-3 fw-bold fs-5"><span>Grand total</span><span>{formatCurrency(grandTotal)}</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
