import SectionHeading from '../../components/SectionHeading/SectionHeading'
import OrdersList from '../../components/OrdersList/OrdersList'
import { useStore } from '../../context/StoreContext'
import { FiSettings, FiUsers, FiBox, FiShoppingBag, FiLock } from 'react-icons/fi'

export default function Profile() {
  const { user } = useStore()

  if (!user) {
    return <section className="container py-5"><h2 className="fw-bold">Please log in to view your profile.</h2></section>
  }

  const isAdmin = user.role === 'admin'

  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Account" title="Your profile" text="Manage your preferences, view recent orders, and return to your favorites anytime." />
      <div className="row g-4 mt-2">
        <div className="col-lg-4">
          <div className="card shadow-sm p-4 border-0 rounded-4 h-100">
            <h4 className="fw-semibold mb-3">Profile details</h4>
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-0"><strong>Role:</strong> 
              <span className={`badge ms-2 ${isAdmin ? 'bg-danger' : 'bg-success'}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </p>
            
            {isAdmin && (
              <div className="mt-4 pt-4 border-top">
                <h5 className="fw-semibold mb-3">
                  <span className="d-inline-flex align-items-center">
                    <FiSettings className="me-2" style={{ width: '18px', height: '18px' }} />
                    Admin Dashboard
                  </span>
                </h5>
                <div className="d-grid gap-2">
                  <button 
                    onClick={() => window.location.href = '/admin'} 
                    className="btn btn-outline-primary text-start"
                  >
                    <span className="d-inline-flex align-items-center">
                      <FiSettings className="me-2" style={{ width: '18px', height: '18px' }} />
                      Dashboard Overview
                    </span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/products'} 
                    className="btn btn-outline-primary text-start"
                  >
                    <span className="d-inline-flex align-items-center">
                      <FiBox className="me-2" style={{ width: '18px', height: '18px' }} />
                      Product Management
                    </span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/customers'} 
                    className="btn btn-outline-primary text-start"
                  >
                    <span className="d-inline-flex align-items-center">
                      <FiUsers className="me-2" style={{ width: '18px', height: '18px' }} />
                      Customer Management
                    </span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/orders'} 
                    className="btn btn-outline-primary text-start"
                  >
                    <span className="d-inline-flex align-items-center">
                      <FiShoppingBag className="me-2" style={{ width: '18px', height: '18px' }} />
                      Order Management
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-8">
          <OrdersList />
        </div>
      </div>
    </section>
  )
}
