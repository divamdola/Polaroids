import { memo } from 'react'
import AdminShell from '../components/AdminShell'

const Orders = memo(function Orders() {
  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-semibold mb-3">Orders</h3>
        <p className="text-muted mb-0">This section can later host order history, shipment states, and fulfillment workflows.</p>
      </div>
    </AdminShell>
  )
})

export default Orders
