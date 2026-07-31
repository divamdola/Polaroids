import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiCreditCard, FiShield, FiTruck } from 'react-icons/fi'
import Button from '../../components/Button/Button'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { useStore } from '../../context/StoreContext'
import { formatCurrency } from '../../utils/formatters'
import styles from './Checkout.module.css'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart } = useStore()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 18 : 0
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  const onSubmit = () => {
    clearCart()
    toast.success('Order placed successfully!')
    navigate('/profile')
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
                  <button type="button" className={`text-start ${styles.paymentOption} ${paymentMethod === 'card' ? styles.paymentOptionActive : ''}`} onClick={() => setPaymentMethod('card')}>
                    <FiCreditCard className="me-2" /> Credit / Debit Card
                  </button>
                  <button type="button" className={`text-start ${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentOptionActive : ''}`} onClick={() => setPaymentMethod('cod')}>
                    Cash on Delivery (currently unavailable)
                  </button>
                </div>
              </div>

              <div className="col-12">
                <Button type="submit">Place order</Button>
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
