import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCamera, FiAperture, FiShield, FiTruck } from 'react-icons/fi'
import Button from '../Button/Button'
import styles from './Hero.module.css'

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, -80])
  const opacity = useTransform(scrollY, [0, 220], [1, 0.2])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  }

  const features = [
    {
      icon: FiCamera,
      title: 'Premium Cameras',
      description: 'Curated selection of instant cameras for every photographer',
    },
    {
      icon: FiAperture,
      title: 'Quality Film',
      description: 'High-quality film for vibrant, lasting memories',
    },
    {
      icon: FiShield,
      title: 'Authentic Products',
      description: '100% genuine products with manufacturer warranty',
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Quick shipping with careful packaging',
    },
  ]

  return (
    <>
      <section className={styles.heroSection}>
        <motion.div style={{ y, opacity }} className={styles.backgroundLayer}>
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80"
            alt="Polaroid camera surrounded by curated accessories"
            className={styles.backgroundImage}
          />
          <div className={styles.overlay} />
        </motion.div>

        <div className={`container h-100 d-flex align-items-center ₹{styles.contentWrap}`}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="row align-items-center g-5 w-100">
            <motion.div variants={itemVariants} className={`col-lg-7 ₹{styles.copy}`}>
              <p className={`fw-semibold mb-3 ₹{styles.eyebrow}`}>Instant memories, beautifully made</p>
              <h1 className={`mb-4 ₹{styles.title}`}>Photography that feels timeless, tactile, and true.</h1>
              <p className={`mb-4 ₹{styles.text}`}>
                Discover refined instant cameras, elevated accessories, and collector-worthy essentials designed for modern storytelling.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/shop">
                  <Button className={styles.button}>Shop collection</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className={styles.button}>Learn more</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="col-lg-5">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                whileHover={{ y: -6, scale: 1.01 }} 
                transition={{ type: 'spring', stiffness: 120, damping: 16 }} 
                className={`₹{styles.imageCard} p-3 p-lg-4`}
              >
                <img
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80"
                  alt="Premium camera setup"
                  className={styles.image}
                  loading="eager"
                />
                <div className={`mt-3 p-3 ₹{styles.glassPanel}`}>
                  <p className="fw-semibold mb-1">Limited edition films</p>
                  <p className="mb-0 text-muted">Crafted for rich tones and remarkable contrast.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div className={styles.scrollIndicator} aria-hidden="true">
          <span />
          <p>Scroll</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Happy Customers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>200+</div>
              <div className={styles.statLabel}>Products</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>4.9★</div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-5">
        <div className="container">
          <div className={styles.featureCards}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
