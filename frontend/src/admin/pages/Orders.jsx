import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import { FiShoppingBag, FiSearch, FiEye, FiFilter, FiX, FiCheck, FiClock, FiTruck, FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import AdminShell from '../components/AdminShell'
import OrderTimeline from '../../components/OrderTimeline/OrderTimeline'
import React from 'react'

const Orders = memo(function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState({})

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

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
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
    return new Date(dateString).toLocaleDateString('en-US', {
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
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-3">Loading orders...</p>
          </div>
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
                  <React.Fragment key={order._id}>
                    <tr>
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
                        <span className="fw-semibold">${order.total?.toFixed(2) || '0.00'}</span>
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
                            onClick={() => toggleOrderExpansion(order._id)}
                          >
                            {expandedOrders[order._id] ? (
                              <FiChevronUp />
                            ) : (
                              <FiEye />
                            )}
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
                    {expandedOrders[order._id] && (
                      <tr key={`timeline-${order._id}`}>
                        <td colSpan="7" className="p-3">
                          <OrderTimeline 
                            status={order.status} 
                            orderDate={order.createdAt}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
        <>
          <div className="modal-backdrop fade show" style={{ display: 'block', zIndex: 1050 }}></div>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1055 }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details - #{selectedOrder._id.slice(-6)}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <h6 className="fw-semibold mb-3">Customer Information</h6>
                      <div className="card bg-light">
                        <div className="card-body">
                          <p className="mb-1"><strong>Name:</strong> {selectedOrder.user?.name || 'Unknown'}</p>
                          <p className="mb-1"><strong>Email:</strong> {selectedOrder.user?.email || 'No email'}</p>
                          <p className="mb-0"><strong>User ID:</strong> {selectedOrder.user?._id || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-semibold mb-3">Order Summary</h6>
                      <div className="card bg-light">
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>${selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Shipping:</span>
                            <span>${selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Tax:</span>
                            <span>${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="d-flex justify-content-between fw-bold border-top pt-2">
                            <span>Total:</span>
                            <span>${selectedOrder.total?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-semibold mb-3">Order Timeline</h6>
                      <OrderTimeline 
                        status={selectedOrder.status} 
                        orderDate={selectedOrder.createdAt}
                      />
                    </div>
                    <div className="col-12">
                      <h6 className="fw-semibold mb-3">Order Items</h6>
                      <div className="card bg-light">
                        <div className="card-body">
                          {selectedOrder.items?.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                              <div className="d-flex align-items-center">
                                <span className="badge bg-light text-dark me-3">{item.quantity}x</span>
                                <div>
                                  <div className="fw-semibold">{item.title}</div>
                                  <small className="text-muted">${item.price?.toFixed(2) || '0.00'} each</small>
                                </div>
                              </div>
                              <span className="fw-semibold">${(item.quantity * item.price)?.toFixed(2) || '0.00'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-semibold mb-3">Shipping Address</h6>
                      <div className="card bg-light">
                        <div className="card-body">
                          <p className="mb-1"><strong>Name:</strong> {selectedOrder.shippingAddress?.name || 'N/A'}</p>
                          <p className="mb-1"><strong>Email:</strong> {selectedOrder.shippingAddress?.email || 'N/A'}</p>
                          <p className="mb-1"><strong>Address:</strong> {selectedOrder.shippingAddress?.address || 'N/A'}</p>
                          <p className="mb-1"><strong>City:</strong> {selectedOrder.shippingAddress?.city || 'N/A'}</p>
                          <p className="mb-0"><strong>Postal Code:</strong> {selectedOrder.shippingAddress?.postalCode || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  )
})

export default Orders