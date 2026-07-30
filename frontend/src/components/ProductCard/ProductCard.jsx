import { memo, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye, FiMinus, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatCurrency } from '../../utils/formatters'
import QuickViewModal from '../QuickViewModal/QuickViewModal'
import styles from './ProductCard.module.css'

const ProductCard = memo(function ProductCard({ product, variant = 'default' }) {
  const { addToCart, toggleWishlist, wishlist, cart } = useStore()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const isWishlisted = useMemo(() => wishlist.some((item) => item.id === product.id), [wishlist, product.id])
  const showSale = useMemo(() => product.salePrice && product.salePrice < product.price, [product.salePrice, product.price])
  const stockStatus = useMemo(() => product.stockStatus || 'In stock', [product.stockStatus])
  const hoverImage = useMemo(() => product.hoverImage || product.image, [product.hoverImage, product.image])
  
  const discountPercentage = useMemo(() => {
    if (showSale) {
      return Math.round(((product.price - product.salePrice) / product.price) * 100)
    }
    return 0
  }, [showSale, product.price, product.salePrice])

  const stockClass = useMemo(() => {
    if (stockStatus === 'In stock') return styles.inStock
    if (stockStatus === 'Low stock') return styles.lowStock
    return styles.outOfStock
  }, [stockStatus])

  const isInCart = useMemo(() => cart.some((item) => item.id === product.id), [cart, product.id])

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart({ ...product, quantity })
      setQuantity(1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock || 10, quantity + delta))
    setQuantity(newQuantity)
  }

  const cardVariants = {
    default: styles.card,
    compact: `₹{styles.card} ₹{styles.cardCompact}`,
    minimal: `₹{styles.card} ₹{styles.cardMinimal}`,
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      layout
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className={cardVariants[variant]}
    >
      <div className={styles.imageWrap}>
        <Link to={`/product/₹{product.id}`}>
          <motion.img 
            whileHover={{ scale: 1.04 }} 
            transition={{ duration: 0.25 }} 
            src={product.image} 
            alt={product.title} 
            className={styles.image}
            loading="lazy"
          />
        </Link>
        <Link to={`/product/₹{product.id}`}>
          <motion.img 
            whileHover={{ scale: 1.04 }} 
            transition={{ duration: 0.25 }} 
            src={hoverImage} 
            alt={`₹{product.title} preview`} 
            className={styles.hoverImage}
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        {showSale && <span className={`₹{styles.badge} ₹{styles.saleBadge}`}>Sale</span>}
        {product.isNew && <span className={`₹{styles.badge} ₹{styles.newBadge}`}>New</span>}
        {product.isFeatured && <span className={`₹{styles.badge} ₹{styles.featuredBadge}`}>Featured</span>}
        {stockStatus === 'Out of stock' && <span className={`₹{styles.badge} ₹{styles.outOfStockBadge}`}>Sold Out</span>}

        {/* Overlay Actions */}
        <div className={styles.overlayActions}>
          <button 
            type="button" 
            className={styles.actionButton}
            onClick={() => setIsQuickViewOpen(true)}
            aria-label="Quick view"
          >
            <FiEye />
          </button>
          <button 
            type="button" 
            className={styles.actionButton}
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
          >
            <FiHeart />
          </button>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`₹{styles.favoriteButton} ₹{isWishlisted ? 'active' : ''}`}
          aria-label="Toggle wishlist"
        >
          <FiHeart />
        </button>
      </div>

      <div className={styles.cardBody}>
        {/* Meta Information */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className={styles.meta}>{product.category}</p>
          <span className={`₹{styles.stockStatus} ₹{stockClass}`}>{stockStatus}</span>
        </div>

        {/* Product Title */}
        <Link to={`/product/₹{product.id}`} className="text-decoration-none">
          <h5 className={styles.title}>{product.title}</h5>
        </Link>

        {/* Description */}
        {variant !== 'compact' && (
          <p className={styles.description}>{product.description?.slice(0, 90)}...</p>
        )}

        {/* Rating */}
        <div className={styles.ratingContainer}>
          <div className={styles.ratingStars}>
            {'★'.repeat(Math.floor(product.rating?.rate || 4.7))}
            {'☆'.repeat(5 - Math.floor(product.rating?.rate || 4.7))}
          </div>
          <span className={styles.rating}>{product.rating?.rate || 4.7}</span>
          <span className={styles.ratingCount}>({product.rating?.count || 120})</span>
        </div>

        {/* Price Section */}
        <div className={styles.priceSection}>
          {showSale ? (
            <>
              <span className={styles.salePrice}>{formatCurrency(product.salePrice)}</span>
              <span className={styles.priceStruck}>{formatCurrency(product.price)}</span>
              {discountPercentage > 0 && (
                <span className={styles.discountPercentage}>-{discountPercentage}%</span>
              )}
            </>
          ) : (
            <span className={styles.price}>{formatCurrency(product.price)}</span>
          )}
        </div>

        {/* Quantity Selector (for compact variant) */}
        {variant === 'compact' && stockStatus === 'In stock' && (
          <div className="d-flex align-items-center gap-2 mb-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <FiMinus />
            </button>
            <span className="fw-semibold">{quantity}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= (product.stock || 10)}
            >
              <FiPlus />
            </button>
          </div>
        )}

        {/* Add to Cart Button */}
        {stockStatus === 'In stock' ? (
          isInCart ? (
            <Link 
              to="/cart" 
              className={styles.addButton}
            >
              View in Cart
            </Link>
          ) : (
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <span>Adding...</span>
              ) : (
                <>
                  <FiShoppingCart />
                  {variant === 'compact' ? `Add (₹{quantity})` : 'Add to Cart'}
                </>
              )}
            </button>
          )
        ) : (
          <button
            type="button"
            className={styles.addButton}
            disabled
          >
            Out of Stock
          </button>
        )}
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={addToCart}
        isWishlisted={isWishlisted}
        onToggleWishlist={toggleWishlist}
      />
    </motion.article>
  )
})

export default ProductCard
