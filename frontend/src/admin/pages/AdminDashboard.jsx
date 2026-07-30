import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import AdminShell from '../components/AdminShell'

const AdminDashboard = memo(function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalInventory: 0, totalCustomers: 0, lowStockItems: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`, { withCredentials: true })
        setStats(response.data)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
        // Keep default stats on error
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminShell>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Revenue</p>
            <h3 className="fw-semibold">₹{(stats.totalRevenue || 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Orders</p>
            <h3 className="fw-semibold">{stats.totalOrders || 0}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Inventory</p>
            <h3 className="fw-semibold">{stats.totalInventory || 0}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Customers</p>
            <h3 className="fw-semibold">{stats.totalCustomers || 0}</h3>
          </div>
        </div>
      </div>
    </AdminShell>
  )
})

export default AdminDashboard
