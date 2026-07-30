import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminRoutes } from '../routes'
import { FiGrid, FiShoppingBag, FiBarChart2, FiTag, FiUsers, FiPercent } from 'react-icons/fi'

const AdminShell = memo(function AdminShell({ children }) {
  const location = useLocation()
  
  // Filter out routes that shouldn't appear in sidebar (like UserOrders)
  const sidebarRoutes = adminRoutes.filter(route => !route.path.includes(':userId'))
  
  const getIcon = (path) => {
    if (path === '/admin') return <FiGrid />
    if (path === '/admin/orders') return <FiShoppingBag />
    if (path === '/admin/analytics') return <FiBarChart2 />
    if (path === '/admin/products') return <FiTag />
    if (path === '/admin/customers') return <FiUsers />
    if (path === '/admin/discounts') return <FiPercent />
    return <FiGrid />
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <h4 className="fw-semibold mb-3">Admin Dashboard</h4>
            <div className="d-flex flex-column gap-2">
              {sidebarRoutes.map((route) => (
                <Link 
                  key={route.path} 
                  to={route.path} 
                  className={`text-decoration-none d-flex align-items-center gap-2 p-2 rounded ${location.pathname === route.path ? 'bg-primary text-white' : 'text-dark fw-medium'}`}
                >
                  {getIcon(route.path)}
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
