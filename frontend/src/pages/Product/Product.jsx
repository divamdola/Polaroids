import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiMinus, FiPlus, FiShoppingCart, FiStar } from 'react-icons/fi'
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
  const [selectedSize, setSelectedSize] = useState('Standard')
  const [selectedFrame, setSelectedFrame] = useState('Classic')

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      const data = await getProductById(id)
      const allProducts = await getProducts()
      setProduct(data)
      setRelatedProducts(allProducts.filter((item) => item.id !== Number(id)).slice(0, 4))
      setIsLoading(false)
    }

    loadProduct()
  }, [id])

  const isWishlisted = useMemo(() => wishlist.some((item) => item.id === product?.id), [product, wishlist])

  if (isLoading) return <Loader />
  if (!product) return <section className="container py-5"><h3>Product not found.</h3></section>

  const salePrice = product.salePrice || product.price * 0.92
  const discount = Math.round(((product.price - salePrice) / product.price) * 100)
  const mainImage = galleryImages[selectedImage] || product.image

  return (
    <section className="container py-5">
      <Link to="/shop" className="btn btn-outline-dark rounded-pill btn-sm mb-4">
        <FiArrowLeft className="me-2" /> Back to shop
      </Link>
      <div className="row g-5">
        <div className={`col-lg-7 ₹{styles.galleryColumn}`}>
          <img src={mainImage} alt={product.title} className={styles.mainImage} />
          <div className="d-flex gap-3 mt-3 flex-wrap">
            {galleryImages.map((image, index) => (
              <button key={image} type="button" className={`₹{styles.thumbButton} ₹{selectedImage === index ? styles.thumbButtonActive : ''}`} onClick={() => setSelectedImage(index)}>
                <img src={image} alt={`₹{product.title} view ₹{index + 1}`} className={styles.thumbImage} />
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
                <span className={styles.discount}>Save {discount}%</span>
              </div>
              <p className="text-muted mb-4">{product.description}</p>

              <div className={styles.sectionBlock}>
                <p className="fw-semibold mb-3">Available sizes</p>
                <div className="d-flex flex-wrap gap-2">
                  {['Standard', 'Large', 'XL'].map((size) => (
                    <button key={size} type="button" className={`btn btn-sm rounded-pill ₹{selectedSize === size ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setSelectedSize(size)}>{size}</button>
                  ))}
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <p className="fw-semibold mb-3">Available frames</p>
                <div className="d-flex flex-wrap gap-2">
                  {['Classic', 'Walnut', 'Black'].map((frame) => (
                    <button key={frame} type="button" className={`btn btn-sm rounded-pill ₹{selectedFrame === frame ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setSelectedFrame(frame)}>{frame}</button>
                  ))}
                </div>
              </div>

              <div className={`₹{styles.sectionBlock} d-flex align-items-center justify-content-between`}>
                <span className="fw-semibold">Quantity</span>
                <div className="d-flex align-items-center gap-2">
                  <button type="button" className={styles.quantityButton} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><FiMinus /></button>
                  <span className="fw-semibold px-2">{quantity}</span>
                  <button type="button" className={styles.quantityButton} onClick={() => setQuantity((value) => value + 1)}><FiPlus /></button>
                </div>
              </div>

              <div className="d-grid gap-2 mb-3">
                <Button onClick={() => addToCart({ ...product, price: salePrice }, quantity)}><FiShoppingCart className="me-2" /> Add to cart</Button>
                <Button variant="outline">Buy now</Button>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-dark rounded-pill" onClick={() => toggleWishlist(product)}>
                  <FiHeart className={`me-2 ₹{isWishlisted ? 'text-danger' : ''}`} />{isWishlisted ? 'Saved' : 'Wishlist'}
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
                      <p className="fw-semibold mb-1">{review.name}</p>
                      <p className="mb-0 text-muted">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.sectionBlock}>
              <h5 className="fw-semibold mb-3">Shipping information</h5>
              <p className="text-muted mb-0">Free shipping on orders over ₹75. Delivery usually takes 3-5 business days within the continental US.</p>
            </div>
            <div>
              <h5 className="fw-semibold mb-3">FAQ</h5>
              <div className="accordion" id="faqAccordion">
                {[
                  ['Is it available for pre-order?', 'No, this item is ready to ship immediately.'],
                  ['Can I return it?', 'Yes, returns are accepted within 14 days if the item is unused.'],
                ].map(([question, answer], index) => (
                  <div key={question} className="accordion-item border-0 mb-2">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed rounded-3" type="button" data-bs-toggle="collapse" data-bs-target={`#faq₹{index}`}>
                        {question}
                      </button>
                    </h2>
                    <div id={`faq₹{index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body text-muted">{answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className={styles.infoBox}>
              <h6 className="fw-semibold mb-3">Why collectors love it</h6>
              <ul className="mb-0 ps-3 text-muted">
                <li>Premium materials and timeless finish</li>
                <li>Thoughtfully designed to elevate everyday moments</li>
                <li>Ready to gift or display with pride</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3">
        <SectionHeading eyebrow="You may also like" title="Related products" text="Explore more pieces that match the same elevated feel." />
        <div className="row g-4">
          {relatedProducts.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-3">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
