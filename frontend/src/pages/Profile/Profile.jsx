import SectionHeading from '../../components/SectionHeading/SectionHeading'
import OrdersList from '../../components/OrdersList/OrdersList'
import { useStore } from '../../context/StoreContext'

export default function Profile() {
  const { user } = useStore()

  if (!user) {
    return <section className="container py-5"><h2 className="fw-bold">Please log in to view your profile.</h2></section>
  }

  return (
    <section className="container py-5">
      <SectionHeading eyebrow="Account" title="Your profile" text="Manage your preferences, view recent orders, and return to your favorites anytime." />
      <div className="row g-4 mt-2">
        <div className="col-lg-4">
          <div className="card shadow-sm p-4 border-0 rounded-4 h-100">
            <h4 className="fw-semibold mb-3">Profile details</h4>
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-0"><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
        <div className="col-lg-8">
          <OrdersList />
        </div>
      </div>
    </section>
  )
}
