import { memo, useEffect, useState } from 'react'
import AdminShell from '../components/AdminShell'
import Loader from '../../components/Loader/Loader'
import { formatCurrency } from '../../utils/formatters'
import { getAdminDashboard } from '../../services/api'

const AdminDashboard = memo(function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalInventory: 0, totalCustomers: 0, lowStockItems: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAdminDashboard()
        setStats(data)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
        setError('Failed to load dashboard data')
        // Keep default stats on error
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminShell>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-danger rounded-4">
          {error}
        </div>
      ) : (
        <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <p className="text-muted mb-2">Revenue</p>
            <h3 className="fw-semibold">{formatCurrency(stats.totalRevenue || 0)}</h3>
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
      )}
    </AdminShell>
  )
})

export default AdminDashboard
