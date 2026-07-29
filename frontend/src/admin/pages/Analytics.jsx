import { memo } from 'react'
import AdminShell from '../components/AdminShell'

const Analytics = memo(function Analytics() {
  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-semibold mb-3">Analytics</h3>
        <p className="text-muted mb-0">This section can later host charts, conversion trends, and sales insights.</p>
      </div>
    </AdminShell>
  )
})

export default Analytics
