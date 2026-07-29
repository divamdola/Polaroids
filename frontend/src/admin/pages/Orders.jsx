import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import AdminShell from '../components/AdminShell'

const Orders = memo(function Orders() {
  const [orders, setOrders] = useState([])

  const loadOrders = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/orders`, { withCredentials: true })
    setOrders(response.data)
  }

  useEffect(() => { loadOrders() }, [])

  const handleStatusChange = async (id, status) => {
    await axios.put(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/orders/${id}/status`, { status }, { withCredentials: true })
    loadOrders()
  }

  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-semibold mb-3">Orders</h3>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Updated</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id || order.id}>
                  <td>{order.user?.name || order.shippingAddress?.name || 'Guest'}</td>
                  <td>${order.total}</td>
                  <td>
                    <select className="form-select rounded-pill form-select-sm" value={order.status} onChange={(event) => handleStatusChange(order._id || order.id, event.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
})

export default Orders
