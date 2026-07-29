import { memo } from 'react'
import AdminShell from '../components/AdminShell'

const Inventory = memo(function Inventory() {
  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-semibold mb-3">Inventory</h3>
        <p className="text-muted mb-0">This section can later host stock levels, supplier data, and reorder alerts.</p>
      </div>
    </AdminShell>
  )
})

export default Inventory
