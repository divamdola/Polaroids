import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../../components/Hero/Hero'
import Loader from '../../components/Loader/Loader'
import ProductCard from '../../components/ProductCard/ProductCard'
import Testimonials from '../../components/Testimonials/Testimonials'
import InstagramGallery from '../../components/InstagramGallery/InstagramGallery'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useStore } from '../../context/StoreContext'
import styles from './Home.module.css'

const Home = memo(function Home() {
  const { products, isLoading } = useStore()
  usePageTitle('Home', 'Discover premium instant photography essentials at Polaroid Store.')

  const featuredProducts = useMemo(() => products.filter(p => p.isFeatured).slice(0, 4), [products])

  return (
    <div>
      <Hero />

      {/* Featured Products */}
      <section className="container">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <p className={`mb-2 ${styles.eyebrow}`}>Best sellers</p>
              <h2 className={`fw-semibold ${styles.sectionTitle}`}>Trending in the shop</h2>
            </div>
            <Link to="/shop?sort=bestseller" className={`${styles.viewAllLink}`}>
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <Loader />
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="col-md-6 col-lg-3"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Strip */}
      <section className="py-5">
        <div className="container text-center">
          <p className={`mb-2 ${styles.eyebrow}`}>Polaroid rituals</p>
          <h3 className="fw-bold mb-3">Capture a little magic every day</h3>
          <p className="text-muted mb-0">Create instant memories with premium gear and timeless design.</p>
        </div>
      </section>

      <InstagramGallery />
      <Testimonials />
    </div>
  )
})

export default Home