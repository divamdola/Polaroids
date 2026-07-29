import { memo } from 'react'
import AdminShell from '../components/AdminShell'

const DiscountCodes = memo(function DiscountCodes() {
  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-semibold mb-3">Discount Codes</h3>
        <p className="text-muted mb-0">This section can later host promo rules, expiration logic, and campaign status.</p>
      </div>
    </AdminShell>
  )
})

export default DiscountCodes
