import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import OrderTimeline from '../OrderTimeline/OrderTimeline'
import Loader from '../Loader/Loader'
import React from 'react'

export default function OrdersList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState({})

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/my-orders`, { withCredentials: true })
      setOrders(response.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      // Fallback to mock data
      setOrders([
        { 
          _id: 'PO-1024', 
          createdAt: '2026-07-18T10:30:00Z', 
          total: 184, 
          status: 'Delivered',
          items: [{ title: 'Polaroid Camera', quantity: 1, price: 129 }]
        },
        { 
          _id: 'PO-1018', 
          createdAt: '2026-06-29T14:45:00Z', 
          total: 96, 
          status: 'Processing',
          items: [{ title: 'Film Pack', quantity: 2, price: 48 }]
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-success'
      case 'Shipped': return 'bg-primary'
      case 'Processing': return 'bg-info'
      case 'Confirmed': return 'bg-warning'
      case 'Pending': return 'bg-secondary'
      case 'Cancelled': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h4 className="fw-semibold mb-4">Recent orders</h4>
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h4 className="fw-semibold mb-4">Recent orders</h4>
        
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No orders found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr>
                      <td>
                        <span className="fw-semibold">#{order._id?.slice(-6) || order._id}</span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>${order.total?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge rounded-pill ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
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
                      </td>
                    </tr>
                    {expandedOrders[order._id] && (
                      <tr key={`timeline-${order._id}`}>
                        <td colSpan="5" className="p-3">
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
          </div>
        )}
      </div>
    </div>
  )
}
