import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import AdminShell from '../components/AdminShell'

const Inventory = memo(function Inventory() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', stock: '', image: '' })

  const loadProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/inventory`, { withCredentials: true })
    setProducts(response.data)
  }

  useEffect(() => { loadProducts() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/products`, { ...form, price: Number(form.price), stock: Number(form.stock) }, { withCredentials: true })
    setForm({ title: '', description: '', price: '', category: '', stock: '', image: '' })
    loadProducts()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/products/${id}`, { withCredentials: true })
    loadProducts()
  }

  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h3 className="fw-semibold mb-3">Inventory</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6"><input className="form-control rounded-pill" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control rounded-pill" placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /></div>
          <div className="col-12"><input className="form-control rounded-pill" placeholder="Image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></div>
          <div className="col-md-6"><input className="form-control rounded-pill" type="number" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control rounded-pill" type="number" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required /></div>
          <div className="col-12"><textarea className="form-control rounded-4" rows="3" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></div>
          <div className="col-12"><button type="submit" className="btn btn-dark rounded-pill">Add product</button></div>
        </form>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h4 className="fw-semibold mb-3">Current products</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id || product.id}>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td><button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => handleDelete(product._id || product.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
})

export default Inventory
