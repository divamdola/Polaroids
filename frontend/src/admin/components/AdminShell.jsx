import { memo } from 'react'
import { Link } from 'react-router-dom'
import { adminRoutes } from '../routes'

const AdminShell = memo(function AdminShell({ children }) {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <h4 className="fw-semibold mb-3">Admin</h4>
            <div className="d-flex flex-column gap-2">
              {adminRoutes.map((route) => (
                <Link key={route.path} to={route.path} className="text-decoration-none text-dark fw-medium">
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
        <section className="col-lg-9">{children}</section>
      </div>
    </div>
  )
})

export default AdminShell
