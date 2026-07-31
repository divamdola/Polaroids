import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
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

        <div className={`container h-100 d-flex align-items-center ${styles.contentWrap}`}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="row align-items-center g-5 w-100">
            <motion.div variants={itemVariants} className={`col-lg-7 ${styles.copy}`}>
              <p className={`fw-semibold mb-3 ${styles.eyebrow}`}>Instant memories, beautifully made</p>
              <h1 className={`mb-4 ${styles.title}`}>Photography that feels timeless, tactile, and true.</h1>
              <p className={`mb-4 ${styles.text}`}>
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
                className={`${styles.imageCard} p-3 p-lg-4`}
              >
                <img
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80"
                  alt="Premium camera setup"
                  className={styles.image}
                  loading="eager"
                />
                <div className={`mt-3 p-3 ${styles.glassPanel}`}>
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
    </>
  )
}
