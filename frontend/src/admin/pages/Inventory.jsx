import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import { FiPlus, FiX } from 'react-icons/fi'
import AdminShell from '../components/AdminShell'
import Loader from '../../components/Loader/Loader'

const Inventory = memo(function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', stock: '', image: '' })

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/inventory`, { withCredentials: true })
      setProducts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Failed to load products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, { ...form, price: Number(form.price), stock: Number(form.stock) }, { withCredentials: true })
      setForm({ title: '', description: '', price: '', category: '', stock: '', image: '' })
      setShowModal(false)
      loadProducts()
    } catch (error) {
      console.error('Failed to add product:', error)
      alert('Failed to add product')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, { withCredentials: true })
      loadProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <AdminShell>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div style={{ transition: 'filter 0.3s ease', filter: showModal ? 'blur(8px)' : 'none' }}>
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="fw-semibold mb-1">Inventory</h3>
                  <p className="text-muted mb-0">Add new products to your inventory</p>
                </div>
                <button 
                  className="btn btn-primary rounded-pill" 
                  onClick={() => setShowModal(true)}
                >
                  <FiPlus className="me-2" /> Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Add Product Modal */}
          {showModal && (
            <>
              <div 
                className="modal-backdrop fade show" 
                style={{ 
                  display: 'block', 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1050,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }} 
                onClick={() => setShowModal(false)}
              />
              <div 
                className="modal fade show" 
                style={{ display: 'block', zIndex: 1055 }} 
                tabIndex="-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add New Product</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowModal(false)}
                      />
                    </div>
                    <div className="modal-body">
                      <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                          <label className="form-label">Title *</label>
                          <input 
                            className="form-control rounded-pill" 
                            placeholder="Product title" 
                            value={form.title} 
                            onChange={(event) => setForm({ ...form, title: event.target.value })} 
                            required 
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Category *</label>
                          <input 
                            className="form-control rounded-pill" 
                            placeholder="Category" 
                            value={form.category} 
                            onChange={(event) => setForm({ ...form, category: event.target.value })} 
                            required 
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Image URL</label>
                          <input 
                            className="form-control rounded-pill" 
                            placeholder="https://example.com/image.jpg" 
                            value={form.image} 
                            onChange={(event) => setForm({ ...form, image: event.target.value })} 
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Price (₹) *</label>
                          <input 
                            className="form-control rounded-pill" 
                            type="number" 
                            placeholder="0.00" 
                            value={form.price} 
                            onChange={(event) => setForm({ ...form, price: event.target.value })} 
                            required 
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Stock *</label>
                          <input 
                            className="form-control rounded-pill" 
                            type="number" 
                            placeholder="0" 
                            value={form.stock} 
                            onChange={(event) => setForm({ ...form, stock: event.target.value })} 
                            required 
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Description *</label>
                          <textarea 
                            className="form-control rounded-4" 
                            rows="4" 
                            placeholder="Product description" 
                            value={form.description} 
                            onChange={(event) => setForm({ ...form, description: event.target.value })} 
                            required 
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-dark rounded-pill w-100">
                            Add Product
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </AdminShell>
  )
})

export default Inventory
