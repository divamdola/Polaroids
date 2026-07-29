import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FiGrid, FiList, FiSearch } from 'react-icons/fi'
import { usePageTitle } from '../../hooks/usePageTitle'
import ProductCard from '../../components/ProductCard/ProductCard'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import CollectionBanner from '../../components/CollectionBanner/CollectionBanner'
import ShopSkeleton from '../../components/ShopSkeleton/ShopSkeleton'
import NoProducts from '../../components/NoProducts/NoProducts'
import Pagination from '../../components/Pagination/Pagination'
import { useStore } from '../../context/StoreContext'

const categories = ['All', 'Cameras', 'Accessories', 'Bags', 'Albums']
const pageSize = 6

export default function Shop() {
  const { products, isLoading } = useStore()
  usePageTitle('Shop', 'Browse a curated collection of instant cameras, film, and accessories.')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase()
    const result = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
      const matchesCategory = category === 'All' || product.category === category
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'under-50' && product.price < 50) ||
        (priceRange === '50-100' && product.price >= 50 && product.price <= 100) ||
        (priceRange === 'over-100' && product.price > 100)
      const matchesAvailability = availability === 'all' || (availability === 'in-stock' && (product.stockStatus || 'In stock') === 'In stock')

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability
    })

    if (sort === 'newest') return [...result].sort((a, b) => b.id - a.id)
    if (sort === 'popular') return [...result].sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0))
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
    setCategory('All')
    setPriceRange('all')
    setAvailability('all')
    setSort('featured')
    setPage(1)
  }

  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Curated store" title="A refined collection of instant essentials" text="Browse signature pieces designed for everyday rituals and special occasions alike." />

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-lg-4">
            <label className="form-label">Search products</label>
            <div className="position-relative">
              <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input className="form-control rounded-pill ps-5" placeholder="Search products" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
            </div>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Category</label>
            <select className="form-select rounded-pill" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }}>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Price</label>
            <select className="form-select rounded-pill" value={priceRange} onChange={(event) => { setPriceRange(event.target.value); setPage(1) }}>
              <option value="all">All</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over-100">Over $100</option>
            </select>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Availability</label>
            <select className="form-select rounded-pill" value={availability} onChange={(event) => { setAvailability(event.target.value); setPage(1) }}>
              <option value="all">All</option>
              <option value="in-stock">In stock</option>
            </select>
          </div>
          <div className="col-lg-2">
            <label className="form-label">Sort by</label>
            <select className="form-select rounded-pill" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="popular">Popularity</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">{filteredProducts.length} products</p>
        <div className="btn-group" role="group" aria-label="View toggle">
          <button type="button" className={`btn btn-sm ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setViewMode('grid')}><FiGrid className="me-2" /> Grid</button>
          <button type="button" className={`btn btn-sm ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setViewMode('list')}><FiList className="me-2" /> List</button>
        </div>
      </div>

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
                className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'col-12'}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <CollectionBanner />
    </section>
  )
}
