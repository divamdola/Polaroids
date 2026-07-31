import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import { FiShoppingBag, FiSearch, FiEye, FiFilter, FiX, FiCheck, FiClock, FiTruck, FiPackage } from 'react-icons/fi'
import AdminShell from '../components/AdminShell'
import OrderDetailModal from '../components/OrderDetailModal'
import Loader from '../../components/Loader/Loader'
import React from 'react'
import { formatCurrency } from '../../utils/formatters'

const Orders = memo(function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, { withCredentials: true })
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true })
      await fetchOrders()
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning'
      case 'Processing': return 'bg-info'
      case 'Shipped': return 'bg-primary'
      case 'Delivered': return 'bg-success'
      case 'Cancelled': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock />
      case 'Processing': return <FiPackage />
      case 'Shipped': return <FiTruck />
      case 'Delivered': return <FiCheck />
      case 'Cancelled': return <FiX />
      default: return <FiShoppingBag />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-semibold mb-1"><FiShoppingBag className="me-2" />Order Management</h3>
            <p className="text-muted mb-0">View and manage all customer orders</p>
          </div>
          <div className="d-flex gap-2">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <FiSearch style={{ width: '18px', height: '18px' }} />
              </span>
              <input
                type="text"
                className="form-control rounded-pill ps-5"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="dropdown">
              <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                <FiFilter className="me-2" />
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => setStatusFilter('all')}>All Status</button></li>
                <li><button className="dropdown-item" onClick={() => setStatusFilter('Pending')}>Pending</button></li>
                <li><button className="dropdown-item" onClick={() => setStatusFilter('Processing')}>Processing</button></li>
                <li><button className="dropdown-item" onClick={() => setStatusFilter('Shipped')}>Shipped</button></li>
                <li><button className="dropdown-item" onClick={() => setStatusFilter('Delivered')}>Delivered</button></li>
                <li><button className="dropdown-item" onClick={() => setStatusFilter('Cancelled')}>Cancelled</button></li>
              </ul>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <span className="fw-semibold">#{order._id.slice(-6)}</span>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{order.user?.name || 'Unknown'}</div>
                        <small className="text-muted">{order.user?.email || 'No email'}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="small">{order.items?.length || 0} items</span>
                        <small className="text-muted">
                          {order.items?.slice(0, 2).map(item => item.title).join(', ')}
                          {order.items?.length > 2 && '...'}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold">{formatCurrency(order.total)}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ms-1">{order.status}</span>
                      </span>
                    </td>
                    <td>
                      <small>{formatDate(order.createdAt)}</small>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewOrder(order)}
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            <FiFilter />
                          </button>
                          <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order._id, 'Pending')}>Pending</button></li>
                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order._id, 'Processing')}>Processing</button></li>
                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order._id, 'Shipped')}>Shipped</button></li>
                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}>Delivered</button></li>
                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order._id, 'Cancelled')}>Cancelled</button></li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-5">
                <div className="text-muted mb-3 d-flex justify-content-center">
                  <FiShoppingBag style={{ width: '48px', height: '48px' }} />
                </div>
                <p className="text-muted">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setShowOrderModal(false)} 
        />
      )}
    </AdminShell>
  )
})

export default Orders