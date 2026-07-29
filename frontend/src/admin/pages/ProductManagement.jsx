import { memo } from 'react'
import AdminShell from '../components/AdminShell'

const ProductManagement = memo(function ProductManagement() {
  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-semibold mb-3">Product Management</h3>
        <p className="text-muted mb-0">This area can later support CRUD operations for catalog entries, pricing, and media.</p>
      </div>
    </AdminShell>
  )
})

export default ProductManagement
