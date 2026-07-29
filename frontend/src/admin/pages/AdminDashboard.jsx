import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import AdminShell from '../components/AdminShell'

const AdminDashboard = memo(function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalInventory: 0, totalCustomers: 0, lowStockItems: [] })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/dashboard`, { withCredentials: true })
        setStats(response.data)
      } catch (error) {
        console.error(error)
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
            <h3 className="fw-semibold">${stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Orders</p>
            <h3 className="fw-semibold">{stats.totalOrders}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Inventory</p>
            <h3 className="fw-semibold">{stats.totalInventory}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Customers</p>
            <h3 className="fw-semibold">{stats.totalCustomers}</h3>
          </div>
        </div>
      </div>
    </AdminShell>
  )
})

export default AdminDashboard
