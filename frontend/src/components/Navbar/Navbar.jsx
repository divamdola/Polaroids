import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiMenu, FiSearch, FiUser, FiMoon, FiSun, FiX, FiHome } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'
import styles from './Navbar.module.css'



export default function Navbar() {
  const { cartCount, wishlistCount, user, logout } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className={styles.announcementBar}>
        <div className="container">
          <p className="mb-0">
            Free shipping on orders over ₹50 | 
            <Link to="/shop" className="ms-2">Shop Now →</Link>
          </p>
        </div>
      </div>

      {/* Main Navbar */}
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

          {/* Desktop Search Bar */}
          <div className={styles.searchBar}>
            <form onSubmit={handleSearch} className="position-relative">
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
            </form>
          </div>

          <button 
            className={`navbar-toggler border-0 ${styles.toggler}`} 
            type="button" 
            aria-label="Toggle navigation" 
            onClick={() => setIsMobileOpen((value) => !value)}
          >
            {isMobileOpen ? <FiX /> : <FiMenu />}
          </button>

          <div className={`collapse navbar-collapse ${isMobileOpen ? 'show' : ''}`} id="navbarNav">
            <ul className={`navbar-nav mx-lg-auto align-items-lg-center gap-lg-3 ${styles.navList}`}>
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} 
                  to="/" 
                  onClick={() => setIsMobileOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} 
                  to="/shop" 
                  onClick={() => setIsMobileOpen(false)}
                >
                  Shop
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} 
                  to="/about" 
                  onClick={() => setIsMobileOpen(false)}
                >
                  About
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} 
                  to="/contact" 
                  onClick={() => setIsMobileOpen(false)}
                >
                  Contact
                </NavLink>
              </li>
              
              {user?.role === 'admin' && (
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${styles.link} ${isActive ? styles.linkActive : ''}`} 
                    to="/admin" 
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span className="d-inline-flex align-items-center">
                      <FiHome className="me-2" style={{ width: '18px', height: '18px' }} />
                      Admin
                    </span>
                  </NavLink>
                </li>
              )}
            </ul>

            <div className={`d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0 ${styles.actions}`}>
              {/* Mobile Search Toggle */}
              <button 
                className={`btn ${styles.iconButton}`} 
                aria-label="Search products" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <FiSearch />
              </button>

              {/* Theme Toggle */}
              <button 
                type="button" 
                className={`btn ${styles.iconButton}`} 
                aria-label="Toggle theme" 
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              >
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
              </button>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className={`btn position-relative ${styles.iconButton}`} 
                aria-label="View wishlist" 
                onClick={() => setIsMobileOpen(false)}
              >
                <FiHeart />
                {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className={`btn position-relative ${styles.iconButton}`} 
                aria-label="View cart" 
                onClick={() => setIsMobileOpen(false)}
              >
                <FiShoppingCart />
                {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
              </Link>

              {/* User Account */}
              {user ? (
                <>
                  {user.role !== 'admin' && (
                    <Link 
                      to="/profile" 
                      className={`btn ${styles.avatarButton}`} 
                      aria-label="View profile" 
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FiUser />
                    </Link>
                  )}
                  <button
                    className={`btn ${styles.logoutButton}`}
                    onClick={() => {
                      logout()
                      setIsMobileOpen(false)
                      navigate('/')
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`btn ${styles.loginButton}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-light border-bottom p-3"
          >
            <form onSubmit={handleSearch} className="position-relative">
              <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control rounded-pill ps-5"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}