import { lazy, memo, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import Hero from '../../components/Hero/Hero'
import Loader from '../../components/Loader/Loader'
import Testimonials from '../../components/Testimonials/Testimonials'
import InstagramGallery from '../../components/InstagramGallery/InstagramGallery'
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
    productCount: 24,
  },
  {
    title: 'Film & Accessories',
    subtitle: 'Stock up on color film, lenses, and creative gear.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    productCount: 56,
  },
  {
    title: 'Lifestyle Collections',
    subtitle: 'Perfect gifts and everyday essentials for photo lovers.',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    productCount: 32,
  },
]

const features = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'On orders over ₹50',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    description: '100% secure transactions',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: FiStar,
    title: 'Premium Quality',
    description: 'Authentic products only',
  },
]

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
      <section className={`container ${styles.section}`}>
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

      {/* Categories */}
      <section className={`container ${styles.section}`}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-5">
            <p className={`mb-2 ${styles.eyebrow}`}>Collections</p>
            <h2 className={`fw-semibold ${styles.sectionTitle}`}>Browse by category</h2>
          </div>
          
          <div className="row g-4">
            {categories.map((category, index) => (
              <motion.div 
                key={category.title} 
                className="col-md-6 col-lg-4"
                variants={itemVariants}
              >
                <div className={styles.categoryCard}>
                  <Suspense fallback={<Loader />}>
                    <CategoryCard {...category} />
                  </Suspense>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className="row g-4">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="col-md-6 col-lg-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <feature.icon />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Feature Strip */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className={`${styles.section} ${styles.featureStrip}`}
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