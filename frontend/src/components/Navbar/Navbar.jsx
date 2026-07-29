import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiMenu, FiSearch, FiUser, FiMoon, FiSun } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'
import styles from './Navbar.module.css'

const shopCategories = ['Instant Cameras', 'Film & Accessories', 'Lenses', 'Albums']
const collectionHighlights = [
  { title: 'New Arrivals', path: '/collections', text: 'Fresh launches for the season.' },
  { title: 'Editorial Picks', path: '/shop', text: 'The latest favorites curated for everyday style.' },
  { title: 'Giftables', path: '/collections', text: 'Thoughtful accessories and keepsakes.' },
]

export default function Navbar() {
  const { cartCount, wishlistCount, user, logout } = useStore()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('polaroid-theme') || 'light'
  })

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('polaroid-theme', theme)
  }, [theme])

  const isHome = location.pathname === '/'
  const navState = !isScrolled && isHome ? styles.transparent : styles.scrolled

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`navbar navbar-expand-lg sticky-top ${styles.navbar} ${navState}`}
    >
      <div className="container py-3">
        <Link className={`navbar-brand fw-semibold ${styles.brand}`} to="/">
          <span className={styles.logoMark}>P</span> POLAROID STORE
        </Link>
        <button className={`navbar-toggler border-0 ${styles.toggler}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation" onClick={() => setIsMobileOpen((value) => !value)}>
          <FiMenu />
        </button>
        <div className={`collapse navbar-collapse ${isMobileOpen ? 'show' : ''}`} id="navbarNav">
          <ul className={`navbar-nav mx-lg-auto align-items-lg-center gap-lg-3 ${styles.navList}`}>
            <li className="nav-item"><NavLink className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} to="/" onClick={() => setIsMobileOpen(false)}>Home</NavLink></li>
            <li className={`nav-item ${styles.dropdownWrapper}`} onMouseEnter={() => setIsShopOpen(true)} onMouseLeave={() => setIsShopOpen(false)}>
              <button type="button" className={`${styles.dropdownToggle} ${styles.link}`} onClick={() => setIsShopOpen((value) => !value)}>
                Shop
              </button>
              <div className={`${styles.dropdownMenu} ${isShopOpen ? styles.dropdownMenuVisible : ''}`}>
                {shopCategories.map((category) => (
                  <Link key={category} to="/shop" className={styles.dropdownItem} onClick={() => setIsShopOpen(false)}>
                    {category}
                  </Link>
                ))}
              </div>
            </li>
            <li className={`nav-item ${styles.dropdownWrapper}`} onMouseEnter={() => setIsCollectionsOpen(true)} onMouseLeave={() => setIsCollectionsOpen(false)}>
              <button type="button" className={`${styles.dropdownToggle} ${styles.link}`} onClick={() => setIsCollectionsOpen((value) => !value)}>
                Collections
              </button>
              <div className={`${styles.megaMenu} ${isCollectionsOpen ? styles.megaMenuVisible : ''}`}>
                <div className="row g-3 align-items-stretch">
                  {collectionHighlights.map((item) => (
                    <div key={item.title} className="col-md-4">
                      <Link to={item.path} className={styles.megaCard} onClick={() => setIsCollectionsOpen(false)}>
                        <h6 className="fw-semibold mb-2">{item.title}</h6>
                        <p className="small mb-0">{item.text}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li className="nav-item"><NavLink className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} to="/about" onClick={() => setIsMobileOpen(false)}>About</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} to="/contact" onClick={() => setIsMobileOpen(false)}>Contact</NavLink></li>
          </ul>

          <div className={`d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0 ${styles.actions}`}>
            <Link to="/shop" className={`btn position-relative ${styles.iconButton}`} aria-label="Search products" onClick={() => setIsMobileOpen(false)}>
              <FiSearch />
            </Link>
            <button type="button" className={`btn ${styles.iconButton}`} aria-label="Toggle theme" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}>
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <Link to="/wishlist" className={`btn position-relative ${styles.iconButton}`} aria-label="View wishlist" onClick={() => setIsMobileOpen(false)}>
              <FiHeart />
              {wishlistCount > 0 && <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${styles.badge}`}>{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className={`btn position-relative ${styles.iconButton}`} aria-label="View cart" onClick={() => setIsMobileOpen(false)}>
              <FiShoppingCart />
              {cartCount > 0 && <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${styles.badge}`}>{cartCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/profile" className={`btn ${styles.avatarButton}`} aria-label="View profile" onClick={() => setIsMobileOpen(false)}>
                  <FiUser />
                </Link>
                <button type="button" className={`btn ${styles.logoutButton}`} onClick={() => { logout(); setIsMobileOpen(false) }}>Logout</button>
              </>
            ) : (
              <Link to="/login" className={`btn ${styles.loginButton}`} onClick={() => setIsMobileOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
