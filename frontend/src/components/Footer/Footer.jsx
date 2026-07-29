import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <p className={`mb-3 ${styles.title}`}>Polaroid Store</p>
            <p className={styles.text}>A modern eCommerce experience for instant photography lovers, shaped with minimal luxury and timeless ease.</p>
          </div>
          <div className="col-lg-3">
            <p className={`mb-3 ${styles.title}`}>Quick links</p>
            <ul className="list-unstyled">
              <li><Link to="/shop" className={styles.link}>Shop</Link></li>
              <li><Link to="/about" className={styles.link}>About</Link></li>
              <li><Link to="/contact" className={styles.link}>Contact</Link></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <p className={`mb-3 ${styles.title}`}>Contact</p>
            <ul className="list-unstyled">
              <li className={styles.text}>hello@polaroidstore.com</li>
              <li className={styles.text}>+1 555 0123</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
