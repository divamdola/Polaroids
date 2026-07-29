import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import Button from '../../components/Button/Button'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { useStore } from '../../context/StoreContext'
import { formatCurrency } from '../../utils/formatters'
import styles from './Cart.module.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore()
  usePageTitle('Cart', 'Review your selected Polaroid favorites before checkout.')
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 18 : 0
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Your bag" title="Your cart" text="A calm place for your selected favorites before checkout." />
      {cart.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`text-center ${styles.emptyState}`}>
          <h4 className="fw-semibold mb-3">Your cart is empty</h4>
          <p className="text-muted mb-4">Add a few favorite pieces and they’ll appear here.</p>
          <Link to="/shop"><Button>Continue shopping</Button></Link>
        </motion.div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="mb-0 text-muted">{cart.length} item{cart.length > 1 ? 's' : ''}</p>
              <button type="button" className="btn btn-outline-dark rounded-pill btn-sm" onClick={clearCart}>Clear cart</button>
            </div>
            {cart.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`mb-3 ${styles.cartItem}`}>
                <div className="row align-items-center g-3">
                  <div className="col-md-3">
                    <img src={item.image} alt={item.title} className={styles.image} />
                  </div>
                  <div className="col-md-5">
                    <h5 className="fw-semibold mb-2">{item.title}</h5>
                    <p className="mb-2 text-muted">{formatCurrency(item.price)}</p>
                    <p className="mb-0 small text-muted">In stock • Ready to ship</p>
                  </div>
                  <div className="col-md-2">
                    <div className="d-flex align-items-center gap-2">
                      <button type="button" className={styles.quantityButton} onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                        <FiMinus />
                      </button>
                      <span className="fw-semibold">{item.quantity}</span>
                      <button type="button" className={styles.quantityButton} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-md-end">
                    <p className="fw-semibold mb-3">{formatCurrency(item.price * item.quantity)}</p>
                    <button type="button" className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => removeFromCart(item.id)}>
                      <FiTrash2 className="me-2" /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="d-flex flex-wrap gap-2 mt-3">
              <Link to="/shop"><Button variant="outline">Continue shopping</Button></Link>
              <Link to="/checkout"><Button>Proceed to checkout</Button></Link>
            </div>
          </div>
          <div className="col-lg-4">
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className={styles.summaryCard}>
              <h4 className="fw-semibold mb-4">Order summary</h4>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted">Shipping</span><span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
              <div className="d-flex justify-content-between mb-3"><span className="text-muted">Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="input-group mb-3">
                <input className="form-control rounded-pill" placeholder="Coupon code" />
                <button className="btn btn-outline-dark rounded-pill" type="button">Apply</button>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5"><span>Grand total</span><span>{formatCurrency(grandTotal)}</span></div>
              <Link to="/checkout" className="d-block mt-4"><Button className="w-100">Proceed to checkout</Button></Link>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  )
}
