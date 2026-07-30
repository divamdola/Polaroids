import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiHeart, FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters'
import styles from './QuickViewModal.module.css'

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart, isWishlisted, onToggleWishlist }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)

  if (!isOpen || !product) return null

  const images = [product.image, product.hoverImage, product.image].filter(Boolean)
  const colors = ['Black', 'Silver', 'White']
  const sizes = ['Small', 'Medium', 'Large']

  const showSale = product.salePrice && product.salePrice < product.price
  const discountPercentage = showSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity })
    onClose()
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock || 10, quantity + delta))
    setQuantity(newQuantity)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.modalOverlay}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
              <FiX />
            </button>

            <div className={styles.modalBody}>
              {/* Image Section */}
              <div className={styles.imageSection}>
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[selectedImage]}
                  alt={product.title}
                  className={styles.mainImage}
                />
                <div className={styles.thumbnailGrid}>
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`₹{product.title} view ₹{index + 1}`}
                      className={`₹{styles.thumbnail} ₹{index === selectedImage ? styles.active : ''}`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className={styles.infoSection}>
                {showSale && <span className={`₹{styles.badge} ₹{styles.saleBadge}`}>Sale</span>}
                <p className={styles.category}>{product.category}</p>
                <h2 className={styles.title}>{product.title}</h2>
                <p className={styles.description}>{product.description}</p>

                {/* Rating */}
                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {'★'.repeat(Math.floor(product.rating?.rate || 4.7))}
                    {'☆'.repeat(5 - Math.floor(product.rating?.rate || 4.7))}
                  </div>
                  <span className={styles.ratingValue}>{product.rating?.rate || 4.7}</span>
                  <span className={styles.reviewCount}>({product.rating?.count || 120} reviews)</span>
                </div>

                {/* Price */}
                <div className={styles.priceSection}>
                  {showSale ? (
                    <>
                      <span className={styles.salePrice}>{formatCurrency(product.salePrice)}</span>
                      <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>
                      <span className={styles.discount}>-{discountPercentage}%</span>
                    </>
                  ) : (
                    <span className={styles.price}>{formatCurrency(product.price)}</span>
                  )}
                </div>

                {/* Color Options */}
                <div className={styles.optionsSection}>
                  <label className={styles.optionLabel}>Color: {colors[selectedColor]}</label>
                  <div className={styles.colorOptions}>
                    {colors.map((color, index) => (
                      <button
                        key={color}
                        className={`₹{styles.colorOption} ₹{index === selectedColor ? styles.active : ''}`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => setSelectedColor(index)}
                        aria-label={`Select ₹{color}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Options */}
                <div className={styles.optionsSection}>
                  <label className={styles.optionLabel}>Size: {sizes[selectedSize]}</label>
                  <div className={styles.sizeOptions}>
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`₹{styles.sizeOption} ₹{size === sizes[selectedSize] ? styles.active : ''}`}
                        onClick={() => setSelectedSize(sizes.indexOf(size))}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className={styles.quantitySection}>
                  <label className={styles.quantityLabel}>Quantity:</label>
                  <div className={styles.quantitySelector}>
                    <button className={styles.quantityButton} onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                      <FiMinus />
                    </button>
                    <span className={styles.quantityValue}>{quantity}</span>
                    <button className={styles.quantityButton} onClick={() => handleQuantityChange(1)} disabled={quantity >= (product.stock || 10)}>
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* Stock Status */}
                <p className={`₹{styles.stockStatus} ₹{product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                  {product.stock > 0 ? `₹{product.stock} in stock` : 'Out of stock'}
                </p>

                {/* Actions */}
                <div className={styles.actions}>
                  <button
                    className={styles.primaryButton}
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>
                  <button
                    className={`₹{styles.wishlistButton} ₹{isWishlisted ? 'active' : ''}`}
                    onClick={() => onToggleWishlist(product)}
                    aria-label="Toggle wishlist"
                  >
                    <FiHeart />
                  </button>
                </div>

                {/* Features */}
                <div className={styles.features}>
                  <div className={styles.feature}>
                    <FiTruck className={styles.featureIcon} />
                    <span>Free shipping</span>
                  </div>
                  <div className={styles.feature}>
                    <FiShield className={styles.featureIcon} />
                    <span>2-year warranty</span>
                  </div>
                  <div className={styles.feature}>
                    <FiRefreshCw className={styles.featureIcon} />
                    <span>30-day returns</span>
                  </div>
                  <div className={styles.feature}>
                    <FiShield className={styles.featureIcon} />
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}