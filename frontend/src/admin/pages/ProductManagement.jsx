import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiImage, FiBox, FiTag, FiPackage } from 'react-icons/fi'
import AdminShell from '../components/AdminShell'

const ProductManagement = memo(function ProductManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    category: 'Cameras',
    image: '',
    hoverImage: '',
    stock: '',
    stockStatus: 'In stock',
    isFeatured: false,
    isActive: true,
  })

  const categories = ['Cameras', 'Accessories', 'Bags', 'Albums', 'Lenses']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, { withCredentials: true })
      setProducts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock),
        rating: { rate: 4.5, count: 0 },
      }

      // Validate required fields
      if (!productData.title || !productData.description || !productData.price || !productData.image) {
        alert('Please fill in all required fields (title, description, price, image)')
        return
      }

      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct._id}`, productData, { withCredentials: true })
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, productData, { withCredentials: true })
      }

      await fetchProducts()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      category: product.category || 'Cameras',
      image: product.image || '',
      hoverImage: product.hoverImage || '',
      stock: product.stock || '',
      stockStatus: product.stockStatus || 'In stock',
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
    })
    setShowModal(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`, { withCredentials: true })
      await fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      title: '',
      slug: '',
      description: '',
      price: '',
      salePrice: '',
      category: 'Cameras',
      image: '',
      hoverImage: '',
      stock: '',
      stockStatus: 'In stock',
      isFeatured: false,
      isActive: true,
    })
  }

  const filteredProducts = Array.isArray(products) ? products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In stock': return 'bg-success'
      case 'Low stock': return 'bg-warning'
      case 'Out of stock': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-semibold mb-1"><FiBox className="me-2" />Product Management</h3>
            <p className="text-muted mb-0">Add, edit, and manage your product catalog</p>
          </div>
          <div className="d-flex gap-2">
            <div className="position-relative">
              <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control rounded-pill ps-5"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary rounded-pill"
              onClick={() => setShowModal(true)}
            >
              <FiPlus className="me-2" /> Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-3">Loading products...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="rounded me-2"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light rounded me-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <FiImage className="text-muted" />
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold">{product.title}</div>
                          <small className="text-muted">{product.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">{product.category}</span>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold">₹{product.price}</span>
                        {product.salePrice && (
                          <small className="text-decoration-line-through text-muted">₹{product.salePrice}</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FiPackage className="me-2 text-muted" />
                        {product.stock}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStockStatusColor(product.stockStatus)}`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td>
                      {product.isFeatured ? (
                        <span className="badge bg-warning">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditProduct(product)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <FiBox className="text-muted mb-3" style={{ fontSize: '48px' }} />
                <p className="text-muted">No products found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Product Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter product title"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="product-slug"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product description"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sale Price</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Main Image URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hover Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.hoverImage}
                      onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                      placeholder="https://example.com/hover-image.jpg"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock Status</label>
                    <select
                      className="form-select"
                      value={formData.stockStatus}
                      onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                    >
                      <option value="In stock">In stock</option>
                      <option value="Low stock">Low stock</option>
                      <option value="Out of stock">Out of stock</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Featured</label>
                    <select
                      className="form-select"
                      value={formData.isFeatured ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'true' })}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        Active (visible in store)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddProduct}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
})

export default ProductManagement