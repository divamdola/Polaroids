import { AnimatePresence, motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import { formatCurrency } from '../../utils/formatters'
import styles from './QuickViewModal.module.css'

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart, isWishlisted, onToggleWishlist }) {
  if (!product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view for ${product.title}`}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close preview">
              <FiX />
            </button>
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <img src={product.image} alt={product.title} className={styles.image} />
              </div>
              <div className="col-lg-6">
                <p className={styles.eyebrow}>{product.category}</p>
                <h3 className={styles.title}>{product.title}</h3>
                <p className={styles.description}>{product.description}</p>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="text-warning">★</span>
                  <span className={styles.rating}>{product.rating?.rate || 4.7}</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className={styles.price}>{formatCurrency(product.price)}</span>
                  <span className={styles.badge}>Ready to ship</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Button onClick={() => onAddToCart(product)}>
                    <FiShoppingCart className="me-2" /> Add to cart
                  </Button>
                  <button type="button" className={styles.wishlistButton} onClick={() => onToggleWishlist(product)}>
                    <FiHeart className={`me-2 ${isWishlisted ? styles.activeHeart : ''}`} /> {isWishlisted ? 'Saved' : 'Wishlist'}
                  </button>
                </div>
                <Link to={`/product/${product.id}`} className={styles.link} onClick={onClose}>
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
