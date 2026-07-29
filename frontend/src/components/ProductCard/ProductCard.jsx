import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatCurrency } from '../../utils/formatters'
import styles from './ProductCard.module.css'

const ProductCard = memo(function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const isWishlisted = useMemo(() => wishlist.some((item) => item.id === product.id), [wishlist, product.id])
  const showSale = useMemo(() => product.salePrice && product.salePrice < product.price, [product.salePrice, product.price])
  const stockStatus = useMemo(() => product.stockStatus || 'In stock', [product.stockStatus])
  const hoverImage = useMemo(() => product.hoverImage || product.image, [product.hoverImage, product.image])

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      layout
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className={`card h-100 ${styles.card}`}
    >
      <div className={`position-relative ${styles.imageWrap}`}>
        <motion.img whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }} src={product.image} alt={product.title} className={`card-img-top ${styles.image}`} />
        <motion.img whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }} src={hoverImage} alt={`${product.title} preview`} className={`card-img-top ${styles.hoverImage}`} />
        {showSale && <span className={`position-absolute top-0 start-0 m-3 badge rounded-pill ${styles.saleBadge}`}>Sale</span>}
        <div className={`position-absolute bottom-0 start-0 end-0 p-3 ${styles.overlayActions}`}>
          <Link to={`/product/${product.id}`} className={`btn btn-sm ${styles.quickViewButton}`}>
            <FiEye className="me-2" /> Quick view
          </Link>
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`btn btn-sm position-absolute top-0 end-0 m-3 ${styles.favoriteButton} ${isWishlisted ? 'btn-dark' : 'btn-light'}`}
          aria-label="Toggle wishlist"
        >
          <FiHeart className={isWishlisted ? 'text-white' : 'text-dark'} />
        </button>
      </div>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className={`mb-0 ${styles.meta}`}>{product.category}</p>
          <span className={`${styles.stockStatus}`}>{stockStatus}</span>
        </div>
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <h5 className={`card-title ${styles.title}`}>{product.title}</h5>
        </Link>
        <p className={`flex-grow-1 ${styles.description}`}>{product.description?.slice(0, 90)}...</p>
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="text-warning">★</span>
          <span className={styles.rating}>{product.rating?.rate || 4.7}</span>
          <span className={styles.ratingCount}>({product.rating?.count || 120})</span>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <div className="d-flex flex-column">
            {showSale ? (
              <>
                <span className={styles.salePrice}>{formatCurrency(product.salePrice)}</span>
                <span className={styles.priceStruck}>{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className={styles.price}>{formatCurrency(product.price)}</span>
            )}
          </div>
          <button type="button" className={`btn btn-sm ${styles.addButton}`} onClick={() => addToCart(product)}>
            <FiShoppingCart className="me-2" /> Add
          </button>
        </div>
      </div>
    </motion.article>
  )
})

export default ProductCard
