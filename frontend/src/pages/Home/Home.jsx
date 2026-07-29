import { lazy, memo, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../../components/Hero/Hero'
import Loader from '../../components/Loader/Loader'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useStore } from '../../context/StoreContext'
import styles from './Home.module.css'

const ProductCard = lazy(() => import('../../components/ProductCard/ProductCard'))
const CategoryCard = lazy(() => import('../../components/CategoryCard/CategoryCard'))

const categories = [
  {
    title: 'Instant Cameras',
    subtitle: 'Beautifully compact and easy to carry anywhere.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Film & Accessories',
    subtitle: 'Stock up on color film, lenses, and creative gear.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Lifestyle Collections',
    subtitle: 'Perfect gifts and everyday essentials for photo lovers.',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
  },
]

const Home = memo(function Home() {
  const { products, isLoading } = useStore()
  usePageTitle('Home', 'Discover premium instant photography essentials at Polaroid Store.')

  const featuredProducts = useMemo(() => products.slice(0, 4), [products])
  const newArrivals = useMemo(() => products.slice(4, 8), [products])

  return (
    <div>
      <Hero />
      <section className={`container ${styles.section}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className={`mb-2 ${styles.eyebrow}`}>Best sellers</p>
            <h2 className={`fw-semibold ${styles.sectionTitle}`}>Trending in the shop</h2>
          </div>
          <Link to="/shop" className="text-decoration-none text-dark fw-semibold">View all</Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-3">
                <Suspense fallback={<Loader />}>
                  <ProductCard product={product} />
                </Suspense>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={`container ${styles.section}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className={`mb-2 ${styles.eyebrow}`}>New arrivals</p>
            <h2 className={`fw-semibold ${styles.sectionTitle}`}>Freshly curated for your next capture</h2>
          </div>
          <Link to="/collections" className="text-decoration-none text-dark fw-semibold">Discover more</Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="row g-4">
            {newArrivals.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-3">
                <Suspense fallback={<Loader />}>
                  <ProductCard product={product} />
                </Suspense>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={`container ${styles.section}`}>
        <h2 className={`fw-semibold mb-4 ${styles.sectionTitle}`}>Browse by category</h2>
        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.title} className="col-md-6 col-lg-4">
              <div className={styles.categoryCard}>
                <Suspense fallback={<Loader />}>
                  <CategoryCard {...category} />
                </Suspense>
              </div>
            </div>
          ))}
        </div>
      </section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`container ${styles.section}`}>
        <div className={`text-center ${styles.featureStrip}`}>
          <h3 className="fw-semibold mb-3">Capture a little magic every day</h3>
          <p className="text-muted mb-0">Create instant memories with premium gear and timeless design.</p>
        </div>
      </motion.section>
    </div>
  )
})

export default Home
