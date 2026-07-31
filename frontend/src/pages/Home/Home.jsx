import { lazy, memo, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../../components/Hero/Hero'
import Loader from '../../components/Loader/Loader'
import Testimonials from '../../components/Testimonials/Testimonials'
import InstagramGallery from '../../components/InstagramGallery/InstagramGallery'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useStore } from '../../context/StoreContext'
import styles from './Home.module.css'

const ProductCard = lazy(() => import('../../components/ProductCard/ProductCard'))

const Home = memo(function Home() {
  const { products, isLoading } = useStore()
  usePageTitle('Home', 'Discover premium instant photography essentials at Polaroid Store.')

  const featuredProducts = useMemo(() => products.filter(p => p.isFeatured).slice(0, 4), [products])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div>
      <Hero />

      {/* Featured Products */}
      <section className={`container`}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
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
              {featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="col-md-6 col-lg-3"
                  variants={itemVariants}
                >
                  <Suspense fallback={<Loader />}>
                    <ProductCard product={product} />
                  </Suspense>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Feature Strip */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className={`${styles.featureStrip}`}
      >
        <div className="container text-center">
          <p className={`mb-2 ${styles.eyebrow}`}>Polaroid rituals</p>
          <h3 className="fw-bold mb-3">Capture a little magic every day</h3>
          <p className="text-muted mb-0">Create instant memories with premium gear and timeless design.</p>
        </div>
      </motion.section>

      <InstagramGallery />
      <Testimonials />
    </div>
  )
})

export default Home