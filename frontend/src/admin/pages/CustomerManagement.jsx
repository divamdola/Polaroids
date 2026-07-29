import { memo } from 'react'
import AdminShell from '../components/AdminShell'

const CustomerManagement = memo(function CustomerManagement() {
  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-semibold mb-3">Customer Management</h3>
        <p className="text-muted mb-0">This area can later support profiles, loyalty data, and support workflows.</p>
      </div>
    </AdminShell>
  )
})

export default CustomerManagement
