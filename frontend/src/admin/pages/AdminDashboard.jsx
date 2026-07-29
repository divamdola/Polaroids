import { memo } from 'react'
import AdminShell from '../components/AdminShell'
import { useAdminStats } from '../hooks/useAdminStats'

const AdminDashboard = memo(function AdminDashboard() {
  const stats = useAdminStats(
    [{ total: 1250 }, { total: 890 }],
    [{ stock: 8 }, { stock: 24 }, { stock: 6 }],
    [{ id: 1 }, { id: 2 }, { id: 3 }],
  )

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
