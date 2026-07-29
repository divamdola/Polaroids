import SectionHeading from '../../components/SectionHeading/SectionHeading'
import OrdersList from '../../components/OrdersList/OrdersList'

export default function Orders() {
  return (
    <section className="container py-5">
      <SectionHeading
        eyebrow="Order history"
        title="Your orders"
        text="Track your recent purchases, check status updates, and revisit your favorite deliveries."
      />
      <div className="mt-3">
        <OrdersList />
      </div>
    </section>
  )
}
