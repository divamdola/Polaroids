import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiMinus, FiPlus, FiShoppingCart, FiStar, FiX } from 'react-icons/fi'
import Loader from '../../components/Loader/Loader'
import Button from '../../components/Button/Button'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useStore } from '../../context/StoreContext'
import { formatCurrency } from '../../utils/formatters'
import { getProductById, getProducts } from '../../services/api'
import { usePageTitle } from '../../hooks/usePageTitle'
import styles from './Product.module.css'

const galleryImages = [
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
]

export default function Product() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const [product, setProduct] = useState(null)
  usePageTitle(product?.title || 'Product', product?.description || 'Explore the details of this premium Polaroid product.')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [imageDescriptions, setImageDescriptions] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      const data = await getProductById(id)
      const allProducts = await getProducts()
      setProduct(data)
      setRelatedProducts(allProducts.filter((item) => item.id !== Number(id)).slice(0, 4))
      // Set default variant
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0])
      }
      setIsLoading(false)
    }

    loadProduct()
  }, [id])

  const isWishlisted = useMemo(() => wishlist.some((item) => item.id === product?.id), [product, wishlist])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setIsUploading(true)
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    try {
      const response = await fetch('http://localhost:5002/api/products/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (response.ok) {
        setUploadedImages(prev => [...prev, ...data.images])
      } else {
        console.error('Upload failed:', data.message)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDescriptionChange = (index, description) => {
    setImageDescriptions(prev => ({
      ...prev,
      [index]: description
    }))
  }

  if (isLoading) return <Loader />
  if (!product) return <section className="container py-5"><h3>Product not found.</h3></section>

  const salePrice = selectedVariant ? selectedVariant.price : (product.salePrice || product.price * 0.92)
  const discount = Math.round(((product.price - salePrice) / product.price) * 100)
  const mainImage = galleryImages[selectedImage] || product.image
  const isCustomProduct = product.category === 'Mini Polaroids' || product.category === 'Collages'
  const maxImages = selectedVariant ? selectedVariant.imageCount : 6

  return (
    <section className="container py-5">
      <Link to="/shop" className="btn btn-outline-dark rounded-pill btn-sm mb-4">
        <FiArrowLeft className="me-2" /> Back to shop
      </Link>
      <div className="row g-5">
        <div className={`col-lg-7 ${styles.galleryColumn}`}>
          <img src={mainImage} alt={product.title} className={styles.mainImage} />
          <div className="d-flex gap-3 mt-3 flex-wrap">
            {galleryImages.map((image, index) => (
              <button key={image} type="button" className={`${styles.thumbButton} ${selectedImage === index ? styles.thumbButtonActive : ''}`} onClick={() => setSelectedImage(index)}>
                <img src={image} alt={`${product.title} view ${index + 1}`} className={styles.thumbImage} />
              </button>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div className={styles.stickyCard}>
            <div className={styles.purchaseCard}>
              <p className="text-uppercase fw-semibold text-muted mb-2" style={{ letterSpacing: '0.24rem' }}>{product.category}</p>
              <h1 className="fw-semibold mb-3" style={{ color: '#171514', fontSize: '2.1rem' }}>{product.title}</h1>
              <div className="d-flex align-items-center gap-2 mb-3">
                {Array.from({ length: 5 }).map((_, index) => <FiStar key={index} color={index < Math.round(product.rating?.rate || 4.7) ? '#171514' : '#d7cabf'} />)}
                <span className="text-muted ms-2">{product.rating?.count || 120} reviews</span>
              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className={styles.price}>{formatCurrency(salePrice)}</span>
                {discount > 0 && <span className={styles.discount}>Save {discount}%</span>}
              </div>
              <p className="text-muted mb-4">{product.description}</p>

              {product.variants && product.variants.length > 0 && (
                <div className={styles.sectionBlock}>
                  <p className="fw-semibold mb-3">Select Option</p>
                  <div className="d-flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button 
                        key={variant.name} 
                        type="button" 
                        className={`btn btn-sm rounded-pill ${selectedVariant?.name === variant.name ? 'btn-dark' : 'btn-outline-dark'}`} 
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.name} - {formatCurrency(variant.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isCustomProduct && (
                <div className={styles.sectionBlock}>
                  <p className="fw-semibold mb-3">Upload Your Images ({uploadedImages.length}/{maxImages})</p>
                  <div className="mb-3">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading || uploadedImages.length >= maxImages}
                      className="form-control"
                    />
                    {isUploading && <small className="text-muted">Uploading...</small>}
                  </div>
                  
                  {uploadedImages.length > 0 && (
                    <div className="row g-3 mt-2">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="col-6 col-md-4">
                          <div className="position-relative">
                            <img 
                              src={`http://localhost:5002${img.image}`} 
                              alt={`Uploaded ${index + 1}`} 
                              className="img-fluid rounded"
                              style={{ height: '120px', objectFit: 'cover' }}
                            />
                            <button 
                              type="button"
                              className="position-absolute top-0 end-0 btn btn-sm btn-danger rounded-circle m-1"
                              onClick={() => removeImage(index)}
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                          <input 
                            type="text" 
                            className="form-control form-control-sm mt-2"
                            placeholder="Add description..."
                            value={imageDescriptions[index] || ''}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className={`${styles.sectionBlock} d-flex align-items-center justify-content-between`}>
                <span className="fw-semibold">Quantity</span>
                <div className="d-flex align-items-center gap-2">
                  <button type="button" className={styles.quantityButton} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><FiMinus /></button>
                  <span className="fw-semibold px-2">{quantity}</span>
                  <button type="button" className={styles.quantityButton} onClick={() => setQuantity((value) => value + 1)}><FiPlus /></button>
                </div>
              </div>

              <div className="d-grid gap-2 mb-3">
                <Button 
                  onClick={() => addToCart({ 
                    ...product, 
                    price: salePrice, 
                    customImages: uploadedImages.map((img, idx) => ({
                      ...img,
                      description: imageDescriptions[idx] || ''
                    }))
                  }, quantity)}
                  disabled={isCustomProduct && uploadedImages.length === 0}
                >
                  <FiShoppingCart className="me-2" /> Add to cart
                </Button>
                <Button variant="outline">Buy now</Button>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-dark rounded-pill" onClick={() => toggleWishlist(product)}>
                  <FiHeart className={`me-2 ${isWishlisted ? 'text-danger' : ''}`}/>{isWishlisted ? 'Saved' : 'Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4">
        <SectionHeading eyebrow="Product details" title="Crafted for the detail-driven collector" text="Everything you need to know before bringing this piece home." />
        <div className="row g-4">
          <div className="col-lg-8">
            <div className={styles.sectionBlock}>
              <h5 className="fw-semibold mb-3">Description</h5>
              <p className="text-muted mb-0">A premium instant experience designed with tactile finishes, rich color warmth, and a timeless silhouette. This edition is made for collectors who appreciate thoughtful craftsmanship.</p>
            </div>
            <div className={styles.sectionBlock}>
              <h5 className="fw-semibold mb-3">Specifications</h5>
              <div className="row g-3">
                {['Material', 'Finish', 'Compatibility', 'Warranty'].map((item) => (
                  <div key={item} className="col-md-6">
                    <div className={styles.infoBox}>
                      <p className="fw-semibold mb-1">{item}</p>
                      <p className="mb-0 text-muted">Premium detail</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.sectionBlock}>
              <h5 className="fw-semibold mb-3">Reviews</h5>
              <div className="row g-3">
                {[
                  { name: 'Maya', text: 'Beautiful quality and feels so premium.' },
                  { name: 'Jordan', text: 'The details are lovely and it arrived beautifully packaged.' },
                ].map((review) => (
                  <div key={review.name} className="col-md-6">
                    <div className={styles.reviewCard}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, index) => <FiStar key={index} color="#171514" />)}
                      </div>
                      <p className="mb-0 text-muted">{review.text}</p>
                      <p className="mb-0 fw-semibold">— {review.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4">
        <SectionHeading eyebrow="You may also like" title="Complete the collection" text="Discover more pieces that complement this selection." />
        <div className="row g-4">
          {relatedProducts.map((item) => (
            <div key={item.id} className="col-6 col-md-3">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}