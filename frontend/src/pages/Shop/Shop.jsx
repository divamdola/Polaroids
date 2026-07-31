import { motion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'
import { FiGrid, FiList, FiSearch, FiSliders, FiX, FiCheck } from 'react-icons/fi'
import { usePageTitle } from '../../hooks/usePageTitle'
import ProductCard from '../../components/ProductCard/ProductCard'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import ShopSkeleton from '../../components/ShopSkeleton/ShopSkeleton'
import NoProducts from '../../components/NoProducts/NoProducts'
import Pagination from '../../components/Pagination/Pagination'
import { useStore } from '../../context/StoreContext'

const categories = [
  { id: 'all', name: 'All Products', count: 0 },
  { id: 'mini-polaroids', name: 'Mini Polaroids', count: 0 },
  { id: 'collages', name: 'Collages', count: 0 },
]

const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under-50', name: 'Under ₹50' },
  { id: '50-100', name: '₹50 - ₹100' },
  { id: '100-200', name: '₹100 - ₹200' },
  { id: 'over-200', name: 'Over ₹200' },
]

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'newest', name: 'Newest' },
  { id: 'popular', name: 'Best Selling' },
  { id: 'rating', name: 'Top Rated' },
  { id: 'low', name: 'Price: Low to High' },
  { id: 'high', name: 'Price: High to Low' },
]

const pageSize = 12

export default function Shop() {
  const { products, isLoading } = useStore()
  usePageTitle('Shop', 'Browse a curated collection of instant cameras, film, and accessories.')
  
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [category, setCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update category counts
  const updatedCategories = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' 
        ? products.length 
        : products.filter(p => p.category?.toLowerCase().includes(cat.id)).length
    }))
  }, [products])

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase()
    const result = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(term) || 
                          product.category.toLowerCase().includes(term) ||
                          product.description?.toLowerCase().includes(term)
      const matchesCategory = category === 'all' || 
                            product.category?.toLowerCase().includes(category)
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'under-50' && product.price < 50) ||
        (priceRange === '50-100' && product.price >= 50 && product.price <= 100) ||
        (priceRange === '100-200' && product.price > 100 && product.price <= 200) ||
        (priceRange === 'over-200' && product.price > 200)
      const matchesAvailability = availability === 'all' || 
                                   (availability === 'in-stock' && (product.stockStatus || 'In stock') === 'In stock') ||
                                   (availability === 'out-of-stock' && (product.stockStatus || 'In stock') !== 'In stock')

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability
    })

    if (sort === 'newest') return [...result].sort((a, b) => b.id - a.id)
    if (sort === 'popular') return [...result].sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0))
    if (sort === 'rating') return [...result].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
    if (sort === 'low') return [...result].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...result].sort((a, b) => b.price - a.price)
    return result
  }, [products, search, category, priceRange, availability, sort])

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, page])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setPriceRange('all')
    setAvailability('all')
    setSort('featured')
    setPage(1)
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (search) count++
    if (category !== 'all') count++
    if (priceRange !== 'all') count++
    if (availability !== 'all') count++
    return count
  }, [search, category, priceRange, availability])

  if (!isMounted) {
    return <div className="container py-5"><div className="spinner-border text-primary" role="status"></div></div>
  }

  return (
    <section className="container py-5">
      <SectionHeading 
        eyebrow="Curated store" 
        title="A refined collection of instant essentials" 
        text="Browse signature pieces designed for everyday rituals and special occasions alike." 
      />

      {/* Search and Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="row g-3 align-items-center">
          {/* Search */}
          <div className="col-lg-4">
            <div className="position-relative">
              <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input 
                className="form-control rounded-pill ps-5" 
                placeholder="Search products..." 
                value={search} 
                onChange={(event) => { setSearch(event.target.value); setPage(1) }}
              />
              {search && (
                <button 
                  className="position-absolute top-50 end-0 translate-middle-y me-3 btn btn-link text-muted p-0"
                  onClick={() => setSearch('')}
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="col-lg-2">
            <select 
              className="form-select rounded-pill" 
              value={category} 
              onChange={(event) => { setCategory(event.target.value); setPage(1) }}
            >
              {updatedCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.count})
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="col-lg-2">
            <select 
              className="form-select rounded-pill" 
              value={priceRange} 
              onChange={(event) => { setPriceRange(event.target.value); setPage(1) }}
            >
              {priceRanges.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="col-lg-2">
            <select 
              className="form-select rounded-pill" 
              value={sort} 
              onChange={(event) => { setSort(event.target.value); setPage(1) }}
            >
              {sortOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* View Toggle & Filter Button */}
          <div className="col-lg-2 d-flex gap-2">
            <div className="btn-group flex-grow-1" role="group">
              <button 
                type="button" 
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-dark'}`} 
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button 
                type="button" 
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-dark'}`} 
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
            </div>
            <button 
              className="btn btn-sm btn-outline-dark position-relative"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiSliders />
              {activeFiltersCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-top"
          >
            <div className="row g-3">
              <div className="col-lg-3">
                <label className="form-label small text-muted">Availability</label>
                <select 
                  className="form-select rounded-pill" 
                  value={availability} 
                  onChange={(event) => { setAvailability(event.target.value); setPage(1) }}
                >
                  <option value="all">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div className="col-lg-9 d-flex align-items-end">
                <button 
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={resetFilters}
                >
                  <FiX className="me-2" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-0">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </p>
          {activeFiltersCount > 0 && (
            <button 
              className="btn btn-sm btn-link text-decoration-none p-0 mt-1"
              onClick={resetFilters}
            >
              Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
        
        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="d-flex gap-2 flex-wrap">
            {search && (
              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center gap-1">
                Search: "{search}"
                <button 
                  className="btn btn-sm p-0 ms-1" 
                  onClick={() => setSearch('')}
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {category !== 'all' && (
              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center gap-1">
                {updatedCategories.find(c => c.id === category)?.name}
                <button 
                  className="btn btn-sm p-0 ms-1" 
                  onClick={() => setCategory('all')}
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center gap-1">
                {priceRanges.find(r => r.id === priceRange)?.name}
                <button 
                  className="btn btn-sm p-0 ms-1" 
                  onClick={() => setPriceRange('all')}
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <ShopSkeleton />
      ) : filteredProducts.length === 0 ? (
        <NoProducts onClearFilters={resetFilters} />
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            className={`row g-4 ${viewMode === 'list' ? 'flex-column' : ''}`}
          >
            {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className={viewMode === 'grid' ? 'col-md-6 col-lg-4 col-xl-3' : 'col-12'}
              >
                <ProductCard product={product} variant={viewMode === 'list' ? 'compact' : 'default'} />
              </motion.div>
            ))}
          </motion.div>
          
          {totalPages > 1 && (
            <div className="mt-5">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </section>
  )
}