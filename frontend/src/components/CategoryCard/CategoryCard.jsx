import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from '../../pages/Home/Home.module.css'

export default function CategoryCard({ title, subtitle, image }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} className="h-100">
      <img src={image} alt={title} className={styles.categoryImage} />
      <div className="card-body p-4">
        <h5 className="card-title fw-semibold">{title}</h5>
        <p className="card-text text-muted">{subtitle}</p>
        <Link to="/shop" className={`btn btn-outline-dark btn-sm ${styles.categoryButton}`}>
          Browse now
        </Link>
      </div>
    </motion.div>
  )
}
