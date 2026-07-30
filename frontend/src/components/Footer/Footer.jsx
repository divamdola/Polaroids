import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiArrowUp, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi'
import styles from './Footer.module.css'

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    alert('Thank you for subscribing to our newsletter!')
  }

  return (
    <>
      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className="container">
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>Stay in the Frame</h2>
            <p className={styles.newsletterText}>
              Subscribe to get special offers, free giveaways, and new arrival updates.
            </p>
            <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerTop}>
            <div className={styles.footerGrid}>
              {/* Brand Column */}
              <div className={styles.footerBrand}>
                <Link to="/" className={styles.brandLogo}>
                  <span className={styles.brandMark}>P</span>
                  POLAROID STORE
                </Link>
                <p className={styles.brandDescription}>
                  Premium instant cameras and accessories for capturing life's beautiful moments. Quality products, exceptional service, and memories that last forever.
                </p>
                <div className={styles.socialLinks}>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                    <FiInstagram />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                    <FiFacebook />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                    <FiTwitter />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                    <FiYoutube />
                  </a>
                </div>

                {/* Mobile App Section */}
                <div className={styles.mobileApp}>
                  <div className={styles.mobileAppContent}>
                    <h4>Download Our App</h4>
                    <p>Get exclusive offers and a seamless shopping experience on the go.</p>
                    <div className={styles.appButtons}>
                      <a href="#" className={styles.appButton}>
                        <span className={styles.appButtonIcon}>🍎</span>
                        <span>App Store</span>
                      </a>
                      <a href="#" className={styles.appButton}>
                        <span className={styles.appButtonIcon}>▶️</span>
                        <span>Google Play</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Column */}
              <div className={styles.footerColumn}>
                <h4>Shop</h4>
                <ul className={styles.footerLinks}>
                  <li><Link to="/shop">All Products</Link></li>
                  <li><Link to="/shop?category=cameras">Instant Cameras</Link></li>
                  <li><Link to="/shop?category=film">Film & Accessories</Link></li>
                  <li><Link to="/shop?category=lenses">Lenses</Link></li>
                  <li><Link to="/shop?category=albums">Albums & Storage</Link></li>
                  <li><Link to="/shop?category=bags">Bags & Cases</Link></li>
                  <li><Link to="/collections">Collections</Link></li>
                  <li><Link to="/shop?sort=sale">Sale Items</Link></li>
                </ul>
              </div>

              {/* Company Column */}
              <div className={styles.footerColumn}>
                <h4>Company</h4>
                <ul className={styles.footerLinks}>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/press">Press</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/sustainability">Sustainability</Link></li>
                </ul>
              </div>

              {/* Support Column */}
              <div className={styles.footerColumn}>
                <h4>Support</h4>
                <ul className={styles.footerLinks}>
                  <li><Link to="/help">Help Center</Link></li>
                  <li><Link to="/shipping">Shipping Info</Link></li>
                  <li><Link to="/returns">Returns & Exchanges</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/warranty">Warranty</Link></li>
                  <li><Link to="/track-order">Track Order</Link></li>
                </ul>
              </div>

              {/* Legal Column */}
              <div className={styles.footerColumn}>
                <h4>Legal</h4>
                <ul className={styles.footerLinks}>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/cookies">Cookie Policy</Link></li>
                  <li><Link to="/accessibility">Accessibility</Link></li>
                  <li><Link to="/sitemap">Sitemap</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <div className={styles.trustBadgeIcon}><FiTruck /></div>
              <span>Free Shipping</span>
            </div>
            <div className={styles.trustBadge}>
              <div className={styles.trustBadgeIcon}><FiShield /></div>
              <span>Secure Payment</span>
            </div>
            <div className={styles.trustBadge}>
              <div className={styles.trustBadgeIcon}><FiRefreshCw /></div>
              <span>Easy Returns</span>
            </div>
            <div className={styles.trustBadge}>
              <div className={styles.trustBadgeIcon}><FiHeadphones /></div>
              <span>24/7 Support</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              © {currentYear} Polaroid Store. All rights reserved. Made with ❤️ for photography lovers.
            </p>
            <div className={styles.paymentMethods}>
              <div className={styles.paymentIcon} title="Visa">VISA</div>
              <div className={styles.paymentIcon} title="Mastercard">MC</div>
              <div className={styles.paymentIcon} title="American Express">AMEX</div>
              <div className={styles.paymentIcon} title="PayPal">PP</div>
              <div className={styles.paymentIcon} title="Apple Pay">AP</div>
              <div className={styles.paymentIcon} title="Google Pay">GP</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        className={`${styles.backToTop} ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FiArrowUp />
      </button>
    </>
  )
}